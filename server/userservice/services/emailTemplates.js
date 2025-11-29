// Email Templates for SmartBuy

/**
 * OTP Email Template - Professional design similar to HoYoverse
 */
const otpTemplate = (userName, otp, type = 'registration') => {
    const title = type === 'registration' ? 'Xác Thực Tài Khoản' : 'Đăng Nhập';
    const message = type === 'registration'
        ? 'Bạn đang hoàn tất xác minh thiết bị mới. Mã xác minh của bạn là:'
        : 'Bạn đang hoàn tất quá trình đăng nhập. Mã xác minh của bạn là:';

    return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mã Xác Minh SmartBuy</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f5f5f5; padding: 40px 0;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header with Logo -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #e11d48 0%, #be123c 100%);">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: 2px;">
                SMARTBUY
              </h1>
            </td>
          </tr>
          
          <!-- Content Section -->
          <tr>
            <td style="padding: 40px;">
              <!-- Greeting -->
              <p style="margin: 0 0 20px; font-size: 16px; color: #333333; line-height: 1.6;">
                CHÀO!
              </p>
              
              <!-- Main Message -->
              <p style="margin: 0 0 30px; font-size: 14px; color: #666666; line-height: 1.6;">
                ${message} Mã xác minh của bạn là: <strong style="color: #e11d48; font-size: 24px;">${otp}</strong>.
              </p>
              
              <!-- OTP Box -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 30px;">
                <tr>
                  <td align="center" style="background-color: #f8f9fa; border-radius: 8px; padding: 30px;">
                    <div style="font-size: 36px; font-weight: 700; color: #e11d48; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                      ${otp}
                    </div>
                  </td>
                </tr>
              </table>
              
              <!-- Validity Notice -->
              <p style="margin: 0 0 20px; font-size: 14px; color: #666666; line-height: 1.6;">
                Vui lòng hoàn tất quá trình xác minh tài khoản trong <strong style="color: #333333;">30 phút</strong>.
              </p>
              
              <!-- Signature -->
              <p style="margin: 0 0 30px; font-size: 14px; color: #333333; font-weight: 500;">
                SmartBuy
              </p>
              
              <!-- Divider -->
              <div style="border-top: 1px solid #e5e7eb; margin: 30px 0;"></div>
              
              <!-- Footer Notice -->
              <p style="margin: 0; font-size: 12px; color: #999999; line-height: 1.6;">
                Đây là email tự động. Vui lòng không trả lời email này.
              </p>
              
              <!-- Security Notice -->
              <p style="margin: 15px 0 0; font-size: 12px; color: #999999; line-height: 1.6;">
                Nếu bạn không thực hiện hành động này, vui lòng bỏ qua email này.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; background-color: #f8f9fa; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 12px; color: #999999;">
                © ${new Date().getFullYear()} SmartBuy. All rights reserved.
              </p>
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

/**
 * Password Reset Email Template
 */
const passwordResetTemplate = (userName, resetURL) => {
    return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Đặt Lại Mật Khẩu - SmartBuy</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f5f5f5; padding: 40px 0;">
    <tr>
      <td align="center">
        <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #e11d48 0%, #be123c 100%);">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: 2px;">
                SMARTBUY
              </h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; font-size: 24px; color: #333333; font-weight: 600;">
                Đặt Lại Mật Khẩu
              </h2>
              
              <p style="margin: 0 0 20px; font-size: 14px; color: #666666; line-height: 1.6;">
                Chào <strong>${userName}</strong>,
              </p>
              
              <p style="margin: 0 0 30px; font-size: 14px; color: #666666; line-height: 1.6;">
                Bạn có 5 phút để thay đổi mật khẩu. Click vào nút bên dưới để tạo mật khẩu mới:
              </p>
              
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 30px;">
                <tr>
                  <td align="center">
                    <a href="${resetURL}" style="display: inline-block; padding: 14px 40px; background-color: #e11d48; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                      Tạo Mật Khẩu Mới
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 20px; font-size: 14px; color: #666666; line-height: 1.6;">
                Hoặc copy link sau vào trình duyệt:
              </p>
              
              <p style="margin: 0 0 30px; font-size: 12px; color: #999999; word-break: break-all;">
                ${resetURL}
              </p>
              
              <div style="border-top: 1px solid #e5e7eb; margin: 30px 0;"></div>
              
              <p style="margin: 0; font-size: 12px; color: #999999; line-height: 1.6;">
                Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
              </p>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 20px 40px; background-color: #f8f9fa; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 12px; color: #999999;">
                © ${new Date().getFullYear()} SmartBuy. All rights reserved.
              </p>
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
    otpTemplate,
    passwordResetTemplate
};
