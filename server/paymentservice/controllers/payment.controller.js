const paymentService = require("../services/payment.service");
const vnpayService = require("../services/vnpay.service");

class PaymentController {
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
      } = req.body;

      // Validate
      if (!orderId || !userId || !amount || !paymentMethod) {
        return res.status(400).json({
          success: false,
          message: "Thiếu thông tin thanh toán",
        });
      }

      // Tạo payment record
      const payment = await paymentService.createPayment({
        orderId,
        userId,
        amount,
        paymentMethod,
        customerInfo,
        description,
      });

      // Tạo payment URL
      let paymentUrl = null;

      if (paymentMethod === "VNPAY") {
        const ipAddress = req.ip || req.connection.remoteAddress || "127.0.0.1";
        paymentUrl = vnpayService.createPaymentUrl(payment, ipAddress);
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

      const result = await vnpayService.verifyReturnUrl(vnpParams);

      if (!result) {
        return res.redirect(
          `${process.env.CLIENT_URL}/payment/failed?message=Invalid signature`
        );
      }

      const orderId = vnpParams.vnp_TxnRef?.split("_")[0];
      const responseCode = vnpParams.vnp_ResponseCode;

      if (responseCode === "00") {
        // Thanh toán thành công
        res.redirect(
          `${process.env.CLIENT_URL}/payment/success?orderId=${orderId}`
        );
      } else {
        // Thanh toán thất bại
        res.redirect(
          `${process.env.CLIENT_URL}/payment/failed?orderId=${orderId}&code=${responseCode}`
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

// Export instance với các method đã bind
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
