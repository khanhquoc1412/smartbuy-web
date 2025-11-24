const querystring = require('querystring');
const crypto = require('crypto');
const config = require('../config/config');
const PaymentHelpers = require('../utils/helpers');

class VNPayService {
  /**
   * Tạo URL thanh toán VNPAY
   */
  createPaymentUrl(paymentData) {
    try {
      const {
        orderId,
        amount,
        orderInfo,
        ipAddress,
        bankCode = '',
        locale = 'vn',
      } = paymentData;

      // Validate
      if (!orderId || !amount) {
        throw new Error('Missing required fields: orderId, amount');
      }

      const createDate = PaymentHelpers.formatDateVNPay();
      const expireDate = PaymentHelpers.formatDateVNPay(
        new Date(Date.now() + config.PAYMENT_TIMEOUT_MINUTES * 60 * 1000)
      );

      // Build VNPAY params
      let vnpParams = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: config.VNPAY_TMN_CODE,
        vnp_Locale: locale,
        vnp_CurrCode: 'VND',
        vnp_TxnRef: orderId,
        vnp_OrderInfo: orderInfo || `Thanh toan don hang ${orderId}`,
        vnp_OrderType: 'other',
        vnp_Amount: amount * 100, // VNPAY yêu cầu nhân 100
        vnp_ReturnUrl: config.VNPAY_RETURN_URL,
        vnp_IpAddr: ipAddress,
        vnp_CreateDate: createDate,
        vnp_ExpireDate: expireDate,
      };

      // Thêm bankCode nếu có
      if (bankCode) {
        vnpParams.vnp_BankCode = bankCode;
      }

      // Sort params
      vnpParams = PaymentHelpers.sortObject(vnpParams);

      // Tạo signature
      const signData = querystring.stringify(vnpParams, { encode: false });
      const hmac = crypto.createHmac('sha512', config.VNPAY_HASH_SECRET);
      const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
      vnpParams.vnp_SecureHash = signed;

      // Build URL
      const paymentUrl = config.VNPAY_URL + '?' + querystring.stringify(vnpParams, { encode: false });

      console.log('✅ VNPAY Payment URL created:', paymentUrl.substring(0, 100) + '...');

      return {
        paymentUrl,
        transactionId: orderId,
        expiresAt: PaymentHelpers.parseDateVNPay(expireDate),
      };
    } catch (error) {
      console.error('❌ VNPAY createPaymentUrl error:', error);
      throw error;
    }
  }

  /**
   * Verify callback từ VNPAY
   */
  verifyReturnUrl(vnpParams) {
    try {
      const secureHash = vnpParams.vnp_SecureHash;
      delete vnpParams.vnp_SecureHash;
      delete vnpParams.vnp_SecureHashType;

      // Sort params
      const sortedParams = PaymentHelpers.sortObject(vnpParams);
      const signData = querystring.stringify(sortedParams, { encode: false });
      const hmac = crypto.createHmac('sha512', config.VNPAY_HASH_SECRET);
      const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

      // Verify signature
      if (secureHash !== signed) {
        console.error('❌ VNPAY signature mismatch');
        return {
          success: false,
          message: 'Invalid signature',
        };
      }

      // Parse response
      const responseCode = vnpParams.vnp_ResponseCode;
      const transactionId = vnpParams.vnp_TxnRef;
      const amount = parseInt(vnpParams.vnp_Amount) / 100;
      const bankCode = vnpParams.vnp_BankCode;
      const cardType = vnpParams.vnp_CardType;
      const transactionNo = vnpParams.vnp_TransactionNo;
      const payDate = vnpParams.vnp_PayDate;

      const isSuccess = responseCode === '00';

      return {
        success: true,
        isSuccess,
        transactionId,
        amount,
        responseCode,
        bankCode,
        cardType,
        transactionNo,
        payDate: payDate ? PaymentHelpers.parseDateVNPay(payDate) : null,
        message: this.getResponseMessage(responseCode),
        rawData: vnpParams,
      };
    } catch (error) {
      console.error('❌ VNPAY verifyReturnUrl error:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Xử lý IPN (Instant Payment Notification) từ VNPAY
   */
  handleIPN(vnpParams) {
    try {
      const secureHash = vnpParams.vnp_SecureHash;
      delete vnpParams.vnp_SecureHash;
      delete vnpParams.vnp_SecureHashType;

      // Sort và verify signature
      const sortedParams = PaymentHelpers.sortObject(vnpParams);
      const signData = querystring.stringify(sortedParams, { encode: false });
      const hmac = crypto.createHmac('sha512', config.VNPAY_HASH_SECRET);
      const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

      if (secureHash !== signed) {
        console.error('❌ VNPAY IPN signature invalid');
        return {
          RspCode: '97',
          Message: 'Invalid signature',
        };
      }

      const responseCode = vnpParams.vnp_ResponseCode;
      const transactionId = vnpParams.vnp_TxnRef;
      const amount = parseInt(vnpParams.vnp_Amount) / 100;

      // TODO: Kiểm tra trong database xem order đã thanh toán chưa
      // const payment = await Payment.findOne({ transactionId });

      if (responseCode === '00') {
        // Thanh toán thành công
        console.log(`✅ VNPAY IPN: Payment success - ${transactionId}`);

        return {
          RspCode: '00',
          Message: 'Confirm Success',
          data: {
            transactionId,
            amount,
            responseCode,
            bankCode: vnpParams.vnp_BankCode,
            transactionNo: vnpParams.vnp_TransactionNo,
            payDate: PaymentHelpers.parseDateVNPay(vnpParams.vnp_PayDate),
          },
        };
      } else {
        // Thanh toán thất bại
        console.log(`⚠️ VNPAY IPN: Payment failed - ${transactionId}`);

        return {
          RspCode: '00',
          Message: 'Confirm Success',
          data: {
            transactionId,
            amount,
            responseCode,
            failed: true,
          },
        };
      }
    } catch (error) {
      console.error('❌ VNPAY handleIPN error:', error);
      return {
        RspCode: '99',
        Message: 'Unknown error',
      };
    }
  }

  /**
   * Query transaction status từ VNPAY (nếu cần)
   */
  async queryTransaction(transactionId, transactionDate) {
    try {
      // TODO: Implement VNPAY query API
      // Tham khảo: https://sandbox.vnpayment.vn/apis/docs/truy-van-hoan-tien/
      console.log('🔍 Query VNPAY transaction:', transactionId);

      // Placeholder
      return {
        success: true,
        message: 'Query API not implemented yet',
      };
    } catch (error) {
      console.error('❌ VNPAY queryTransaction error:', error);
      throw error;
    }
  }

  /**
   * Refund transaction (hoàn tiền)
   */
  async refundTransaction(refundData) {
    try {
      // TODO: Implement VNPAY refund API
      console.log('💰 Refund VNPAY transaction:', refundData);

      // Placeholder
      return {
        success: true,
        message: 'Refund API not implemented yet',
      };
    } catch (error) {
      console.error('❌ VNPAY refundTransaction error:', error);
      throw error;
    }
  }

  /**
   * Get response message từ response code
   */
  getResponseMessage(responseCode) {
    const messages = {
      '00': 'Giao dịch thành công',
      '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
      '09': 'Thẻ/Tài khoản chưa đăng ký dịch vụ InternetBanking.',
      '10': 'Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
      '11': 'Đã hết hạn chờ thanh toán.',
      '12': 'Thẻ/Tài khoản bị khóa.',
      '13': 'Sai mật khẩu xác thực giao dịch (OTP).',
      '24': 'Khách hàng hủy giao dịch',
      '51': 'Tài khoản không đủ số dư.',
      '65': 'Tài khoản đã vượt quá hạn mức giao dịch trong ngày.',
      '75': 'Ngân hàng thanh toán đang bảo trì.',
      '79': 'Nhập sai mật khẩu thanh toán quá số lần quy định.',
      '99': 'Các lỗi khác',
    };

    return messages[responseCode] || 'Lỗi không xác định';
  }
}

module.exports = new VNPayService();