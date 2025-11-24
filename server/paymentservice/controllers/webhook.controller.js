const paymentService = require('../services/payment.service');

class WebhookController {
  /**
   * IPN từ VNPAY (server-to-server)
   */
  async vnpayIPN(req, res) {
    try {
      const vnpParams = req.query;
      
      console.log('📥 Nhận IPN từ VNPAY:', vnpParams);
      
      // Xử lý IPN
      const result = await paymentService.handleVnpayIPN(vnpParams);
      
      console.log('📤 Trả response cho VNPAY:', result);
      
      // VNPAY yêu cầu response JSON
      return res.status(200).json(result);
    } catch (error) {
      console.error('❌ Lỗi xử lý VNPAY IPN:', error);
      return res.status(200).json({
        RspCode: '99',
        Message: 'Unknown error',
      });
    }
  }
  
  /**
   * Return URL từ VNPAY (user redirect về)
   */
  async vnpayReturn(req, res) {
    try {
      const vnpParams = req.query;
      
      console.log('📥 User quay về từ VNPAY:', vnpParams);
      
      const result = await paymentService.handleVnpayReturn(vnpParams);
      
      if (result.success) {
        // Redirect về trang success
        return res.redirect(
          `${process.env.CLIENT_URL}/payment/success?orderId=${result.orderId}&transactionId=${result.transactionId}`
        );
      } else {
        // Redirect về trang failed
        return res.redirect(
          `${process.env.CLIENT_URL}/payment/failed?message=${encodeURIComponent(result.message)}`
        );
      }
    } catch (error) {
      console.error('❌ Lỗi xử lý VNPAY return:', error);
      return res.redirect(`${process.env.CLIENT_URL}/payment/failed?message=System error`);
    }
  }
  
  /**
   * IPN từ MOMO
   */
  async momoIPN(req, res) {
    try {
      // TODO: Implement khi có thông tin MOMO
      return res.status(200).json({
        resultCode: 0,
        message: 'Success',
      });
    } catch (error) {
      console.error('❌ Lỗi xử lý MOMO IPN:', error);
      return res.status(200).json({
        resultCode: 99,
        message: 'Unknown error',
      });
    }
  }
}

module.exports = new WebhookController();