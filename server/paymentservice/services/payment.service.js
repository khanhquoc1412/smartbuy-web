const Payment = require("../models/payment");
const webhookService = require("./webhook.service");
const { PAYMENT_STATUS, PAYMENT_METHODS } = require("../utils/constants");
const PaymentHelpers = require("../utils/helpers");
const config = require("../config/config");

class PaymentService {
  /**
   * Tạo payment mới (Chỉ tạo record trong DB)
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
        throw new Error("Missing required fields");
      }

      if (!PaymentHelpers.validateAmount(amount)) {
        throw new Error("Invalid amount");
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
      const expiresAt = new Date(
        Date.now() + config.PAYMENT_TIMEOUT_MINUTES * 60 * 1000
      );

      // Tạo Payment record
      const payment = new Payment({
        orderId,
        userId,
        amount,
        currency: "VND",
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
            note: "Payment created",
          },
        ],
      });

      // Không tạo URL ở đây nữa, controller sẽ làm việc đó
      let gatewayData = {};
      if (paymentMethod === PAYMENT_METHODS.VNPAY) {
        gatewayData = {
          gateway: "VNPAY",
          transactionId: transactionId,
        };
      }

      payment.gatewayData = gatewayData;

      await payment.save();

      console.log(
        `✅ Payment created: ${payment._id} - Method: ${paymentMethod}`
      );

      return payment;
    } catch (error) {
      console.error("❌ Create payment error:", error);
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
        throw new Error("Payment not found");
      }

      return payment;
    } catch (error) {
      console.error("❌ Get payment error:", error);
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
        throw new Error("Payment not found for this order");
      }

      return payment;
    } catch (error) {
      console.error("❌ Get payment by order error:", error);
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
      console.error("❌ Get payments error:", error);
      throw error;
    }
  }

  /**
   * Cập nhật trạng thái payment từ VNPay (được gọi từ Controller sau khi verify)
   */
  async updatePaymentStatusFromVNPay(data) {
    try {
      const {
        transactionId,
        isSuccess,
        amount,
        responseCode,
        bankCode,
        cardType,
        transactionNo,
        payDate,
      } = data;

      // Tìm payment
      const payment = await Payment.findOne({ transactionId });

      if (!payment) {
        throw new Error(`Payment not found: ${transactionId}`);
      }

      // Helper function to get message
      const getResponseMessage = (code) => {
        const messages = {
          "00": "Giao dịch thành công",
          "07": "Trừ tiền thành công. Giao dịch bị nghi ngờ.",
          "09": "Giao dịch không thành công: Chưa đăng ký InternetBanking.",
          "10": "Giao dịch không thành công: Xác thực sai quá 3 lần.",
          "11": "Giao dịch không thành công: Hết hạn chờ thanh toán.",
          "12": "Giao dịch không thành công: Tài khoản bị khóa.",
          "13": "Giao dịch không thành công: Sai OTP.",
          "24": "Giao dịch không thành công: Khách hàng hủy giao dịch.",
          "51": "Giao dịch không thành công: Tài khoản không đủ số dư.",
          "65": "Giao dịch không thành công: Vượt quá hạn mức.",
          "75": "Ngân hàng thanh toán đang bảo trì.",
          "79": "Giao dịch không thành công: Sai mật khẩu thanh toán.",
          "99": "Lỗi khác.",
        };
        return messages[code] || "Lỗi không xác định";
      };

      // Cập nhật payment
      if (isSuccess) {
        payment.status = PAYMENT_STATUS.PAID;

        // Handle payDate safely
        let paidAtDate = new Date();
        if (payDate) {
          // Try to parse if it's VNPAY format yyyyMMddHHmmss
          const dateStr = payDate.toString();
          if (dateStr.length === 14) {
            const year = dateStr.substring(0, 4);
            const month = dateStr.substring(4, 6);
            const day = dateStr.substring(6, 8);
            const hour = dateStr.substring(8, 10);
            const minute = dateStr.substring(10, 12);
            const second = dateStr.substring(12, 14);
            paidAtDate = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
          }
        }

        payment.paidAt = paidAtDate;
        payment.externalTransactionId = transactionNo;
        payment.bankCode = bankCode;
        payment.cardType = cardType;
        payment.responseCode = responseCode;
        payment.responseMessage = getResponseMessage(responseCode);

        payment.statusHistory.push({
          status: PAYMENT_STATUS.PAID,
          timestamp: new Date(),
          note: "Payment successful via VNPAY",
          responseCode,
        });

        // Gửi webhook tới OrderService
        await webhookService.notifyOrderService(payment, "paid");
      } else {
        payment.status = PAYMENT_STATUS.FAILED;
        payment.responseCode = responseCode;
        payment.responseMessage = getResponseMessage(responseCode);

        payment.statusHistory.push({
          status: PAYMENT_STATUS.FAILED,
          timestamp: new Date(),
          note: `Payment failed: ${getResponseMessage(responseCode)}`,
          responseCode,
        });

        // Gửi webhook tới OrderService
        await webhookService.notifyOrderService(payment, "failed");
      }

      await payment.save();

      console.log(
        `✅ VNPAY callback processed: ${transactionId} - ${payment.status}`
      );

      return payment;
    } catch (error) {
      console.error("❌ Handle VNPAY callback error:", error);
      throw error;
    }
  }

  /**
   * Hủy payment
   */
  async cancelPayment(paymentId, reason) {
    try {
      const payment = await Payment.findById(paymentId);

      if (!payment) {
        throw new Error("Payment not found");
      }

      if (payment.status === PAYMENT_STATUS.PAID) {
        throw new Error("Cannot cancel paid payment");
      }

      payment.status = PAYMENT_STATUS.CANCELLED;
      payment.statusHistory.push({
        status: PAYMENT_STATUS.CANCELLED,
        timestamp: new Date(),
        note: reason || "Payment cancelled",
      });

      await payment.save();

      console.log(`✅ Payment cancelled: ${paymentId}`);

      return payment;
    } catch (error) {
      console.error("❌ Cancel payment error:", error);
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
          note: "Payment expired - auto cancelled",
        });

        await payment.save();

        // Notify OrderService - REMOVED as per user request
        // await webhookService.notifyOrderService(payment, "expired");
      }

      return expiredPayments.length;
    } catch (error) {
      console.error("❌ Auto cancel expired payments error:", error);
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
        throw new Error("Payment not found");
      }

      if (!payment.canRefund()) {
        throw new Error("Payment cannot be refunded");
      }

      // TODO: Call gateway API để refund
      // Tùy vào gateway (VNPAY, MOMO, etc.)

      payment.status = PAYMENT_STATUS.REFUNDED;
      payment.refundInfo = {
        refundAmount: refundData.amount || payment.amount,
        refundedAt: new Date(),
        refundReason: refundData.reason,
        refundStatus: "completed",
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
      console.error("❌ Refund payment error:", error);
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

      const [
        totalPayments,
        paidPayments,
        failedPayments,
        totalRevenue,
        byMethod,
      ] = await Promise.all([
        Payment.countDocuments(dateFilter),
        Payment.countDocuments({ ...dateFilter, status: PAYMENT_STATUS.PAID }),
        Payment.countDocuments({
          ...dateFilter,
          status: PAYMENT_STATUS.FAILED,
        }),
        Payment.aggregate([
          { $match: { ...dateFilter, status: PAYMENT_STATUS.PAID } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
        Payment.aggregate([
          { $match: dateFilter },
          {
            $group: {
              _id: "$paymentMethod",
              count: { $sum: 1 },
              totalAmount: {
                $sum: { $cond: [{ $eq: ["$status", "paid"] }, "$amount", 0] },
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
        successRate:
          totalPayments > 0 ? (paidPayments / totalPayments) * 100 : 0,
        byMethod,
      };
    } catch (error) {
      console.error("❌ Get payment stats error:", error);
      throw error;
    }
  }

  /**
   * ✅ Lấy payment theo transactionId
   */
  async getPaymentByTransactionId(transactionId) {
    try {
      const payment = await Payment.findOne({ transactionId });

      if (!payment) {
        throw new Error("Payment not found for this transaction");
      }

      return payment;
    } catch (error) {
      console.error("❌ Get payment by transactionId error:", error);
      throw error;
    }
  }
}

module.exports = new PaymentService();
