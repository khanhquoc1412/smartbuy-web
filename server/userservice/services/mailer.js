const nodemailer = require('nodemailer');

// Email configuration - Simple SMTP setup
const emailConfig = {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // true for 465, false for other ports (587)
    auth: {
        user: process.env.EMAIL_USER || process.env.ADMIN_EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD || process.env.ADMIN_EMAIL_PASSWORD
    }
};

// Create reusable transporter
let transporter = null;

const getTransporter = () => {
    if (!transporter) {
        transporter = nodemailer.createTransport(emailConfig);

        // Verify connection configuration
        transporter.verify((error, success) => {
            if (error) {
                console.error('❌ Email service error:', error.message);
            } else {
                console.log('✅ Email service is ready to send messages');
            }
        });
    }

    return transporter;
};

// Main mailer function
module.exports = async (email, htmlContent, subject) => {
    try {
        const transport = getTransporter();

        const mailOptions = {
            from: `"SmartBuy" <${process.env.EMAIL_USER || process.env.ADMIN_EMAIL_ADDRESS}>`,
            to: email,
            subject: subject || '[SmartBuy] Thông báo',
            html: htmlContent
        };

        const info = await transport.sendMail(mailOptions);
        console.log(`✅ Email sent to ${email}: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error('❌ Error sending email:', error.message);
        throw error;
    }
};