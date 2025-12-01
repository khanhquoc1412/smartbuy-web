/**
 * Generate HTML email template for order status updates
 */
const generateOrderEmailTemplate = ({
  customerName = 'Quý khách',
  icon,
  title,
  message,
  orderNumber,
  totalPrice,
  orderItems,
  shippingAddress,
  paymentMethod,
  trackingUrl,
  status
}) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const orderItemsHtml = orderItems.map(item => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
        <div style="display: flex; align-items: center;">
          
          <div>
            <div style="font-weight: 500; color: #111827;">${item.name}</div>
            ${item.variant ? `<div style="font-size: 12px; color: #6b7280; margin-top: 4px;">
              ${item.variant.color || ''} ${item.variant.memory || ''}
            </div>` : ''}
            <div style="font-size: 14px; color: #6b7280; margin-top: 4px;">
              Số lượng: ${item.qty}
            </div>
          </div>
        </div>
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 500; color: #dc2626;">
        ${formatCurrency(item.price * item.qty)}
      </td>
    </tr>
  `).join('');

  const showTrackingButton = ['shipping', 'delivered', 'completed'].includes(status);

  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f3f4f6;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">SmartBuy</h1>
            </td>
          </tr>

          <!-- Status Icon & Title -->
          <tr>
            <td style="padding: 40px 30px 20px; text-align: center;">
              <div style="font-size: 64px; margin-bottom: 16px;">${icon}</div>
              <h2 style="margin: 0; color: #111827; font-size: 24px; font-weight: 600;">${title}</h2>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 0 30px 20px;">
              <p style="margin: 0; color: #374151; font-size: 16px; line-height: 1.5;">
                Xin chào <strong>${customerName}</strong>,
              </p>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <p style="margin: 0; color: #6b7280; font-size: 15px; line-height: 1.6;">
                ${message}
              </p>
            </td>
          </tr>

          <!-- Order Number -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="background-color: #f9fafb; border-left: 4px solid #dc2626; padding: 16px 20px; border-radius: 8px;">
                <div style="color: #6b7280; font-size: 13px; margin-bottom: 4px;">Mã đơn hàng</div>
                <div style="color: #111827; font-size: 18px; font-weight: 600; font-family: 'Courier New', monospace;">
                  ${orderNumber}
                </div>
              </div>
            </td>
          </tr>

          <!-- Order Items -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <h3 style="margin: 0 0 20px 0; color: #111827; font-size: 18px; font-weight: 600;">Chi tiết đơn hàng</h3>
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                ${orderItemsHtml}
                <tr>
                  <td style="padding: 16px 0; text-align: right; color: #6b7280; font-size: 15px;">
                    Tổng cộng:
                  </td>
                  <td style="padding: 16px 0; text-align: right; font-size: 20px; font-weight: 700; color: #dc2626;">
                    ${formatCurrency(totalPrice)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Shipping Address -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <h3 style="margin: 0 0 12px 0; color: #111827; font-size: 18px; font-weight: 600;">Địa chỉ giao hàng</h3>
              <div style="background-color: #f9fafb; padding: 16px 20px; border-radius: 8px; color: #374151; font-size: 14px; line-height: 1.6;">
                <div style="font-weight: 600; margin-bottom: 8px;">${shippingAddress.fullName}</div>
                <div>${shippingAddress.phone}</div>
                <div style="margin-top: 8px;">
                  ${shippingAddress.address}, ${shippingAddress.ward}, ${shippingAddress.district}, ${shippingAddress.province}
                </div>
              </div>
            </td>
          </tr>

          <!-- Payment Method -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #6b7280; font-size: 14px;">Phương thức thanh toán:</span>
                <span style="color: #111827; font-weight: 600; font-size: 14px;">${paymentMethod}</span>
              </div>
            </td>
          </tr>

          ${showTrackingButton ? `
          <!-- Tracking Button -->
          <tr>
            <td style="padding: 0 30px 40px; text-align: center;">
              <a href="${trackingUrl}" style="display: inline-block; background-color: #dc2626; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px; transition: background-color 0.3s;">
                Theo dõi đơn hàng
              </a>
            </td>
          </tr>
          ` : ''}

          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 14px;">
                Cảm ơn bạn đã mua sắm tại <strong style="color: #dc2626;">SmartBuy</strong>!
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 13px;">
                Nếu bạn có thắc mắc, vui lòng liên hệ: 
                <a href="mailto:phapn460@gmail.com" style="color: #dc2626; text-decoration: none;">support@smartbuy.vn</a>
              </p>
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                  © 2025 SmartBuy. All rights reserved.
                </p>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

module.exports = {
  generateOrderEmailTemplate
};
