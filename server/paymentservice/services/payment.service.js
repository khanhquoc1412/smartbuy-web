const Payment = require('../models/Payment');
const vnpayService = require('./vnpay.service');
const webhookService = require('./webhook.service');
const { PAYMENT_STATUS, PAYMENT_METHODS } = require('../utils/constants');
const PaymentHelpers = require('../utils/helpers');
const config = require('../config/config');

class PaymentService {
  /**
   * Tạo payment mới
   */
  async createPayment(paymentData) {
    try {
      const {
        orderId,
        userId,
        amount,
        paymentMethod,
        customerInfo,
        description,
        ipAddress,
        bankCode,
      } = paymentData;

      // Validate
      if (!orderId || !userId || !amount || !paymentMethod) {
        throw new Error('Missing required fields');
      }

      if (!PaymentHelpers.validateAmount(amount)) {
        throw new Error('Invalid amount');
      }

      // Kiểm tra xem order đã có payment chưa
      const existingPayment = await Payment.findOne({
        orderId,
        status: { $in: [PAYMENT_STATUS.PENDING, PAYMENT_STATUS.PROCESSING] },
      });

      if (existingPayment) {
        console.log(`⚠️  Order ${orderId} đã có payment pending`);
        return existingPayment;
      }

      // Tạo transactionId
      const transactionId = PaymentHelpers.generateTransactionId();

      // Tính thời gian hết hạn
      const expiresAt = new Date(Date.now() + config.PAYMENT_TIMEOUT_MINUTES * 60 * 1000);

      // Tạo Payment record
      const payment = new Payment({
        orderId,
        userId,
        amount,
        currency: 'VND',
        paymentMethod,
        status: PAYMENT_STATUS.PENDING,
        transactionId,
        customerInfo,
        description: description || `Thanh toan don hang ${orderId}`,
        ipAddress,
        expiresAt,
        statusHistory: [
          {
            status: PAYMENT_STATUS.PENDING,
            timestamp: new Date(),
            note: 'Payment created',
          },
        ],
      });

      // Tạo payment URL theo từng gateway
      let paymentUrl = null;
      let gatewayData = {};

      if (paymentMethod === PAYMENT_METHODS.VNPAY) {
        const vnpayResult = vnpayService.createPaymentUrl({
          orderId: transactionId,
          amount,
          orderInfo: description || `Thanh toan don hang ${orderId}`,
          ipAddress,
          bankCode,
        });

        paymentUrl = vnpayResult.paymentUrl;
        gatewayData = {
          gateway: 'VNPAY',
          transactionId: vnpayResult.transactionId,
        };
      } else if (paymentMethod === PAYMENT_METHODS.MOMO) {
        // TODO: Implement MOMO
        throw new Error('MOMO payment not implemented yet');
      } else if (paymentMethod === PAYMENT_METHODS.ZALOPAY) {
        // TODO: Implement ZaloPay
        throw new Error('ZaloPay payment not implemented yet');
      } else if (paymentMethod === PAYMENT_METHODS.COD) {
        // COD không cần payment URL
        payment.status = PAYMENT_STATUS.PENDING;
      } else {
        throw new Error(`Unsupported payment method: ${paymentMethod}`);
      }

      payment.paymentUrl = paymentUrl;
      payment.gatewayData = gatewayData;

      await payment.save();

      console.log(`✅ Payment created: ${payment._id} - Method: ${paymentMethod}`);

      return payment;
    } catch (error) {
      console.error('❌ Create payment error:', error);
      throw error;
    }
  }

  /**
   * Lấy payment theo ID
   */
  async getPaymentById(paymentId) {
    try {
      const payment = await Payment.findById(paymentId);

      if (!payment) {
        throw new Error('Payment not found');
      }

      return payment;
    } catch (error) {
      console.error('❌ Get payment error:', error);
      throw error;
    }
  }

  /**
   * Lấy payment theo orderId
   */
  async getPaymentByOrderId(orderId) {
    try {
      const payment = await Payment.findByOrderId(orderId);

      if (!payment) {
        throw new Error('Payment not found for this order');
      }

      return payment;
    } catch (error) {
      console.error('❌ Get payment by order error:', error);
      throw error;
    }
  }

  /**
   * Lấy danh sách payments (với filter, pagination)
   */
  async getPayments(filters = {}, page = 1, limit = 10) {
    try {
      const query = {};

      if (filters.userId) {
        query.userId = filters.userId;
      }

      if (filters.status) {
        query.status = filters.status;
      }

      if (filters.paymentMethod) {
        query.paymentMethod = filters.paymentMethod;
      }

      if (filters.startDate || filters.endDate) {
        query.createdAt = {};
        if (filters.startDate) {
          query.createdAt.$gte = new Date(filters.startDate);
        }
        if (filters.endDate) {
          query.createdAt.$lte = new Date(filters.endDate);
        }
      }

      const skip = (page - 1) * limit;

      const [payments, total] = await Promise.all([
        Payment.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Payment.countDocuments(query),
      ]);

      return {
        payments,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('❌ Get payments error:', error);
      throw error;
    }
  }

  /**
   * Xử lý callback từ VNPAY
   */
  async handleVNPayCallback(vnpParams) {
    try {
      // Verify signature
      const verifyResult = vnpayService.verifyReturnUrl(vnpParams);

      if (!verifyResult.success) {
        throw new Error('Invalid VNPAY signature');
      }

      const { transactionId, isSuccess, amount, responseCode, bankCode, cardType, transactionNo, payDate } = verifyResult;

      // Tìm payment
      const payment = await Payment.findOne({ transactionId });

      if (!payment) {
        throw new Error(`Payment not found: ${transactionId}`);
      }

      // Cập nhật payment
      if (isSuccess) {
        payment.status = PAYMENT_STATUS.PAID;
        payment.paidAt = payDate || new Date();
        payment.externalTransactionId = transactionNo;
        payment.bankCode = bankCode;
        payment.cardType = cardType;
        payment.responseCode = responseCode;
        payment.responseMessage = vnpayService.getResponseMessage(responseCode);

        payment.statusHistory.push({
          status: PAYMENT_STATUS.PAID,
          timestamp: new Date(),
          note: 'Payment successful via VNPAY',
          responseCode,
        });

        // Gửi webhook tới OrderService
        await webhookService.notifyOrderService(payment, 'paid');
      } else {
        payment.status = PAYMENT_STATUS.FAILED;
        payment.responseCode = responseCode;
        payment.responseMessage = vnpayService.getResponseMessage(responseCode);

        payment.statusHistory.push({
          status: PAYMENT_STATUS.FAILED,
          timestamp: new Date(),
          note: `Payment failed: ${vnpayService.getResponseMessage(responseCode)}`,
          responseCode,
        });

        // Gửi webhook tới OrderService
        await webhookService.notifyOrderService(payment, 'failed');
      }

      await payment.save();

      console.log(`✅ VNPAY callback processed: ${transactionId} - ${payment.status}`);

      return payment;
    } catch (error) {
      console.error('❌ Handle VNPAY callback error:', error);
      throw error;
    }
  }

  /**
   * Xử lý IPN từ VNPAY
   */
  async handleVNPayIPN(vnpParams) {
    try {
      const ipnResult = vnpayService.handleIPN(vnpParams);

      if (ipnResult.RspCode !== '00') {
        return ipnResult;
      }

      const { transactionId, responseCode } = ipnResult.data;

      // Tìm payment
      const payment = await Payment.findOne({ transactionId });

      if (!payment) {
        console.error(`❌ Payment not found for IPN: ${transactionId}`);
        return {
          RspCode: '01',
          Message: 'Order not found',
        };
      }

      // Kiểm tra đã xử lý chưa
      if (payment.status === PAYMENT_STATUS.PAID) {
        console.log(`⚠️  Payment ${transactionId} đã được xử lý rồi`);
        return {
          RspCode: '00',
          Message: 'Already processed',
        };
      }

      // Cập nhật payment (tương tự callback)
      if (responseCode === '00') {
        payment.status = PAYMENT_STATUS.PAID;
        payment.paidAt = ipnResult.data.payDate || new Date();
        payment.externalTransactionId = ipnResult.data.transactionNo;
        payment.bankCode = ipnResult.data.bankCode;

        payment.statusHistory.push({
          status: PAYMENT_STATUS.PAID,
          timestamp: new Date(),
          note: 'Payment confirmed via VNPAY IPN',
          responseCode,
        });

        await payment.save();

        // Gửi webhook tới OrderService
        await webhookService.notifyOrderService(payment, 'paid');
      }

      return ipnResult;
    } catch (error) {
      console.error('❌ Handle VNPAY IPN error:', error);
      return {
        RspCode: '99',
        Message: 'Unknown error',
      };
    }
  }

  /**
   * Hủy payment
   */
  async cancelPayment(paymentId, reason) {
    try {
      const payment = await Payment.findById(paymentId);

      if (!payment) {
        throw new Error('Payment not found');
      }

      if (payment.status === PAYMENT_STATUS.PAID) {
        throw new Error('Cannot cancel paid payment');
      }

      payment.status = PAYMENT_STATUS.CANCELLED;
      payment.statusHistory.push({
        status: PAYMENT_STATUS.CANCELLED,
        timestamp: new Date(),
        note: reason || 'Payment cancelled',
      });

      await payment.save();

      console.log(`✅ Payment cancelled: ${paymentId}`);

      return payment;
    } catch (error) {
      console.error('❌ Cancel payment error:', error);
      throw error;
    }
  }

  /**
   * Auto cancel các payment hết hạn
   */
  async autoCancelExpiredPayments() {
    try {
      const expiredPayments = await Payment.findExpiredPayments();

      console.log(`🔍 Tìm thấy ${expiredPayments.length} payments hết hạn`);

      for (const payment of expiredPayments) {
        payment.status = PAYMENT_STATUS.EXPIRED;
        payment.statusHistory.push({
          status: PAYMENT_STATUS.EXPIRED,
          timestamp: new Date(),
          note: 'Payment expired - auto cancelled',
        });

        await payment.save();

        // Notify OrderService
        await webhookService.notifyOrderService(payment, 'expired');
      }

      return expiredPayments.length;
    } catch (error) {
      console.error('❌ Auto cancel expired payments error:', error);
      return 0;
    }
  }

  /**
   * Refund payment
   */
  async refundPayment(paymentId, refundData) {
    try {
      const payment = await Payment.findById(paymentId);

      if (!payment) {
        throw new Error('Payment not found');
      }

      if (!payment.canRefund()) {
        throw new Error('Payment cannot be refunded');
      }

      // TODO: Call gateway API để refund
      // Tùy vào gateway (VNPAY, MOMO, etc.)

      payment.status = PAYMENT_STATUS.REFUNDED;
      payment.refundInfo = {
        refundAmount: refundData.amount || payment.amount,
        refundedAt: new Date(),
        refundReason: refundData.reason,
        refundStatus: 'completed',
      };

      payment.statusHistory.push({
        status: PAYMENT_STATUS.REFUNDED,
        timestamp: new Date(),
        note: `Refunded: ${refundData.reason}`,
      });

      await payment.save();

      console.log(`✅ Payment refunded: ${paymentId}`);

      return payment;
    } catch (error) {
      console.error('❌ Refund payment error:', error);
      throw error;
    }
  }

  /**
   * Thống kê payments
   */
  async getPaymentStats(startDate, endDate) {
    try {
      const dateFilter = {};
      if (startDate || endDate) {
        dateFilter.createdAt = {};
        if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
        if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
      }

      const [totalPayments, paidPayments, failedPayments, totalRevenue, byMethod] = await Promise.all([
        Payment.countDocuments(dateFilter),
        Payment.countDocuments({ ...dateFilter, status: PAYMENT_STATUS.PAID }),
        Payment.countDocuments({ ...dateFilter, status: PAYMENT_STATUS.FAILED }),
        Payment.aggregate([
          { $match: { ...dateFilter, status: PAYMENT_STATUS.PAID } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
        Payment.aggregate([
          { $match: dateFilter },
          {
            $group: {
              _id: '$paymentMethod',
              count: { $sum: 1 },
              totalAmount: {
                $sum: { $cond: [{ $eq: ['$status', 'paid'] }, '$amount', 0] },
              },
            },
          },
        ]),
      ]);

      return {
        totalPayments,
        paidPayments,
        failedPayments,
        totalRevenue: totalRevenue[0]?.total || 0,
        successRate: totalPayments > 0 ? (paidPayments / totalPayments) * 100 : 0,
        byMethod,
      };
    } catch (error) {
      console.error('❌ Get payment stats error:', error);
      throw error;
    }
  }
}

module.exports = new PaymentService();