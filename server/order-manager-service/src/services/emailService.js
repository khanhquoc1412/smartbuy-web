const { getTransporter, emailFrom } = require('../config/email');
const { generateOrderEmailTemplate } = require('../utils/emailTemplates');

class EmailService {
  /**
   * Gửi email thông báo trạng thái đơn hàng
   * @param {Object} order - Order object
   * @param {String} status - New status
   * @param {String} customerEmail - Customer email
   * @param {String} customerName - Customer name
   */
  async sendOrderStatusEmail(order, status, customerEmail, customerName) {
    try {
      const transporter = getTransporter();
      
      if (!transporter) {
        console.error('Email transporter not configured');
        return false;
      }

      // Get email content based on status
      const { subject, html } = this.getEmailContent(order, status, customerName);

      const mailOptions = {
        from: `"${emailFrom.name}" <${emailFrom.address}>`,
        to: customerEmail,
        subject: subject,
        html: html
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`✅ Email sent to ${customerEmail}: ${info.messageId}`);
      return true;
    } catch (error) {
      console.error('❌ Error sending email:', error.message);
      return false;
    }
  }

  /**
   * Lấy nội dung email theo trạng thái
   */
  getEmailContent(order, status, customerName) {
    const orderNumber = order.orderNumber || 'N/A';
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const trackingUrl = `${baseUrl}/account/orders/${order._id}`;

    const statusConfig = {
      pending: {
        subject: `Đơn hàng ${orderNumber} đang chờ xác nhận`,
        title: 'Đơn hàng đang chờ xác nhận',
        message: 'Đơn hàng của bạn đã được tạo và đang chờ xác nhận từ người bán.',
        icon: '⏳'
      },
      confirmed: {
        subject: `Đơn hàng ${orderNumber} đã được xác nhận`,
        title: 'Đơn hàng đã được xác nhận',
        message: 'Người bán đã xác nhận đơn hàng của bạn và sẽ bắt đầu chuẩn bị hàng.',
        icon: '✅'
      },
      processing: {
        subject: `Đơn hàng ${orderNumber} đang được chuẩn bị`,
        title: 'Đơn hàng đang được chuẩn bị',
        message: 'Đơn hàng của bạn đang được đóng gói và chuẩn bị giao cho đơn vị vận chuyển.',
        icon: '📦'
      },
      ready_to_ship: {
        subject: `Đơn hàng ${orderNumber} sẵn sàng giao hàng`,
        title: 'Đơn hàng sẵn sàng giao hàng',
        message: 'Đơn hàng của bạn đã được đóng gói và sẵn sàng bàn giao cho đơn vị vận chuyển.',
        icon: '📦'
      },
      shipping: {
        subject: `Đơn hàng ${orderNumber} đang được giao đến bạn`,
        title: 'Đơn hàng đang trên đường giao',
        message: order.shippingInfo?.trackingNumber 
          ? `Đơn hàng của bạn đang được giao bởi ${order.shippingInfo.carrier}. Mã vận đơn: ${order.shippingInfo.trackingNumber}`
          : 'Đơn hàng của bạn đang được giao đến địa chỉ nhận hàng.',
        icon: '🚚'
      },
      delivered: {
        subject: `Đơn hàng ${orderNumber} đã được giao thành công`,
        title: 'Đơn hàng đã được giao',
        message: 'Đơn hàng của bạn đã được giao thành công. Vui lòng kiểm tra và xác nhận đã nhận hàng.',
        icon: '🎉'
      },
      completed: {
        subject: `Đơn hàng ${orderNumber} đã hoàn thành`,
        title: 'Đơn hàng đã hoàn thành',
        message: 'Cảm ơn bạn đã mua hàng! Hãy để lại đánh giá của bạn về sản phẩm.',
        icon: '⭐'
      },
      cancelled: {
        subject: `Đơn hàng ${orderNumber} đã bị hủy`,
        title: 'Đơn hàng đã bị hủy',
        message: order.cancelReason 
          ? `Đơn hàng của bạn đã bị hủy. Lý do: ${order.cancelReason}`
          : 'Đơn hàng của bạn đã bị hủy.',
        icon: '❌'
      },
      returned: {
        subject: `Đơn hàng ${orderNumber} đã được trả lại`,
        title: 'Đơn hàng đã được trả lại',
        message: 'Đơn hàng của bạn đã được trả lại. Chúng tôi sẽ xử lý hoàn tiền trong thời gian sớm nhất.',
        icon: '↩️'
      },
      payment_failed: {
        subject: `Thanh toán đơn hàng ${orderNumber} thất bại`,
        title: 'Thanh toán thất bại',
        message: 'Thanh toán đơn hàng của bạn không thành công. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.',
        icon: '⚠️'
      }
    };

    const config = statusConfig[status] || statusConfig.pending;
    
    const html = generateOrderEmailTemplate({
      customerName,
      icon: config.icon,
      title: config.title,
      message: config.message,
      orderNumber,
      totalPrice: order.totalPrice,
      orderItems: order.orderItems,
      shippingAddress: order.shippingAddress,
      paymentMethod: order.paymentMethod,
      trackingUrl,
      status
    });

    return {
      subject: config.subject,
      html
    };
  }

  /**
   * Gửi email xác nhận đơn hàng mới
   */
  async sendNewOrderEmail(order, customerEmail, customerName) {
    return this.sendOrderStatusEmail(order, 'pending', customerEmail, customerName);
  }
}

module.exports = new EmailService();
