const paymentService = require("../services/payment.service");
const {
  VNPay,
  ignoreLogger,
  ProductCode,
  VnpLocale,
  dateFormat,
} = require("vnpay");

class PaymentController {
  constructor() {
    // Initialize VNPay
    this.vnpay = new VNPay({
      tmnCode: "1XD3D3Z0",
      secureSecret: "VPFJJ8ZBW0PV4JQW25WCRTCXW9S3I319",
      vnpayHost: "https://sandbox.vnpayment.vn",
      testMode: true,
      hashAlgorithm: "SHA512",
      loggerFn: ignoreLogger,
    });
  }

  /**
   * 1. TẠO PAYMENT
   * POST /api/payments/create
   */
  async createPayment(req, res) {
    try {
      const {
        orderId,
        userId,
        amount,
        paymentMethod,
        customerInfo,
        description,
        bankCode,
      } = req.body;

      console.log('🔍 [PaymentController] createPayment body:', JSON.stringify(req.body, null, 2));

      // Get IP Address
      const ipAddress = req.ip || req.connection.remoteAddress || "127.0.0.1";

      // Validate
      if (!orderId || !userId || !amount || !paymentMethod) {
        return res.status(400).json({
          success: false,
          message: "Thiếu thông tin thanh toán",
        });
      }

      // Tạo payment record (PENDING)
      const payment = await paymentService.createPayment({
        orderId,
        userId,
        amount,
        paymentMethod,
        customerInfo,
        description,
        bankCode,
        ipAddress,
      });

      // Tạo payment URL
      let paymentUrl = null;

      if (paymentMethod === "VNPAY") {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        paymentUrl = await this.vnpay.buildPaymentUrl({
          vnp_Amount: amount,
          vnp_IpAddr: ipAddress,
          vnp_TxnRef: payment.transactionId, // Use transactionId from payment record
          vnp_OrderInfo: description || `Thanh toan don hang ${orderId}`,
          vnp_OrderType: ProductCode.Other,
          vnp_ReturnUrl: "http://localhost:3000/api/payments/vnpay/return",
          vnp_Locale: VnpLocale.VN,
          vnp_CreateDate: dateFormat(new Date()),
          vnp_ExpireDate: dateFormat(tomorrow),
        });

        // Update payment with URL (optional, but good for tracking)
        // We can skip saving URL to DB if not needed, but let's keep it consistent if service supports it
        // For now, just return it.
      } else if (paymentMethod === "MOMO") {
        // TODO: Implement MOMO
        throw new Error("MOMO chưa hỗ trợ");
      } else if (paymentMethod === "COD") {
        // COD không cần payment URL
        return res.status(200).json({
          success: true,
          message: "Đơn hàng COD được tạo thành công",
          data: payment,
        });
      }

      res.status(201).json({
        success: true,
        message: "Tạo thanh toán thành công",
        data: {
          ...payment.toObject(),
          paymentUrl,
        },
      });
    } catch (error) {
      console.error("❌ Create payment error:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Không thể tạo thanh toán",
      });
    }
  }

  /**
   * 2. LẤY PAYMENT THEO ID
   * GET /api/payments/:id
   */
  async getPaymentById(req, res) {
    try {
      const payment = await paymentService.getPaymentById(req.params.id);

      res.status(200).json({
        success: true,
        data: payment,
      });
    } catch (error) {
      console.error("❌ Get payment error:", error);
      res.status(404).json({
        success: false,
        message: error.message || "Không tìm thấy payment",
      });
    }
  }

  /**
   * 3. LẤY PAYMENT THEO ORDER ID
   * GET /api/payments/order/:orderId
   */
  async getPaymentByOrderId(req, res) {
    try {
      const payment = await paymentService.getPaymentByOrderId(
        req.params.orderId
      );

      res.status(200).json({
        success: true,
        data: payment,
      });
    } catch (error) {
      console.error("❌ Get payment error:", error);
      res.status(404).json({
        success: false,
        message: error.message || "Không tìm thấy payment",
      });
    }
  }

  /**
   * 4. VNPAY RETURN URL (User redirect về)
   * GET /api/payments/vnpay/return
   */
  async handleVNPayReturn(req, res) {
    try {
      const vnpParams = req.query;

      // Verify signature using controller's vnpay instance
      const verifyResult = await this.vnpay.verifyReturnUrl(vnpParams);

      if (!verifyResult || !verifyResult.isSuccess) {
        return res.redirect(
          `${process.env.CLIENT_URL}/payment/failed?message=Invalid signature`
        );
      }

      const orderId = vnpParams.vnp_TxnRef;
      const responseCode = vnpParams.vnp_ResponseCode;

      // Build query params
      const queryParams = new URLSearchParams({
        orderId: orderId || '',
        vnp_Amount: vnpParams.vnp_Amount || '',
        vnp_TransactionNo: vnpParams.vnp_TransactionNo || '',
        vnp_PayDate: vnpParams.vnp_PayDate || '',
        vnp_BankCode: vnpParams.vnp_BankCode || '',
      });

      if (responseCode === "00") {
        // Thanh toán thành công - update DB
        // Pass verified info to service
        const paymentData = {
          transactionId: verifyResult.vnp_TxnRef,
          isSuccess: true,
          amount: verifyResult.vnp_Amount,
          responseCode: verifyResult.vnp_ResponseCode,
          bankCode: verifyResult.vnp_BankCode,
          cardType: verifyResult.vnp_CardType,
          transactionNo: verifyResult.vnp_TransactionNo,
          payDate: verifyResult.vnp_PayDate
        };

        const updatedPayment = await paymentService.updatePaymentStatusFromVNPay(paymentData);

        // Update orderId in query params to be the real Order ID (not transactionId)
        queryParams.set('orderId', updatedPayment.orderId);

        res.redirect(
          `${process.env.CLIENT_URL}/payment/success?${queryParams.toString()}`
        );
      } else {
        // Thanh toán thất bại
        const paymentData = {
          transactionId: verifyResult.vnp_TxnRef,
          isSuccess: false,
          responseCode: verifyResult.vnp_ResponseCode,
        };

        await paymentService.updatePaymentStatusFromVNPay(paymentData);

        queryParams.append('code', responseCode);

        res.redirect(
          `${process.env.CLIENT_URL}/payment/failed?${queryParams.toString()}`
        );
      }
    } catch (error) {
      console.error("❌ VNPAY return error:", error);
      res.redirect(`${process.env.CLIENT_URL}/payment/failed?message=Error`);
    }
  }

  /**
   * 5. HOÀN TIỀN
   * POST /api/payments/:id/refund
   */
  async refundPayment(req, res) {
    try {
      const paymentId = req.params.id;
      const refundData = {
        amount: req.body.amount,
        reason: req.body.reason,
      };

      const payment = await paymentService.refundPayment(paymentId, refundData);

      res.status(200).json({
        success: true,
        message: "Hoàn tiền thành công",
        data: payment,
      });
    } catch (error) {
      console.error("❌ Refund error:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Không thể hoàn tiền",
      });
    }
  }

  /**
   * 6. HỦY PAYMENT
   * POST /api/payments/:id/cancel
   */
  async cancelPayment(req, res) {
    try {
      const paymentId = req.params.id;
      const { reason } = req.body;

      const payment = await paymentService.cancelPayment(paymentId, reason);

      res.status(200).json({
        success: true,
        message: "Hủy thanh toán thành công",
        data: payment,
      });
    } catch (error) {
      console.error("❌ Cancel payment error:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Không thể hủy thanh toán",
      });
    }
  }
}

// Export instance
const paymentController = new PaymentController();
module.exports = {
  createPayment: paymentController.createPayment.bind(paymentController),
  getPaymentById: paymentController.getPaymentById.bind(paymentController),
  getPaymentByOrderId:
    paymentController.getPaymentByOrderId.bind(paymentController),
  handleVNPayReturn:
    paymentController.handleVNPayReturn.bind(paymentController),
  refundPayment: paymentController.refundPayment.bind(paymentController),
  cancelPayment: paymentController.cancelPayment.bind(paymentController),
};
