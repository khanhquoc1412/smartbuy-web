const nodemailer = require('nodemailer');

// Email configuration
const emailConfig = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
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

// Email sender info
const emailFrom = {
  name: process.env.EMAIL_FROM_NAME || 'SmartBuy',
  address: process.env.EMAIL_FROM_ADDRESS || process.env.EMAIL_USER
};

module.exports = {
  getTransporter,
  emailFrom,
  emailConfig
};
