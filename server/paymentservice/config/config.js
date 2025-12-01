const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  // MongoDB
  MONGO_URI:
    process.env.MONGO_URI || "mongodb://localhost:27017/smartbuy_db_payment",

  // Server
  PORT: process.env.PORT || 3004,  // ✅ Payment Service runs on port 3004
  NODE_ENV: process.env.NODE_ENV || "development",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",

  // JWT
  JWT_SECRET:
    process.env.JWT_SECRET ||
    process.env.ACCESS_TOKEN_PRIVATE_KEY ||
    "your-secret-key",

  // CORS
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(",") || [
    "http://localhost:5173",
  ],

  // External Services - Order Service on port 3002
  ORDER_SERVICE_URL: process.env.ORDER_SERVICE_URL || "http://localhost:3002",

  // Payment Settings
  PAYMENT_TIMEOUT_MINUTES: process.env.PAYMENT_TIMEOUT_MINUTES || 15, // 15 minutes default

  // Webhook
  WEBHOOK_SECRET: process.env.WEBHOOK_SECRET || "webhook-secret-key",

  // VNPAY - Credentials đã test thành công qua Postman
  VNPAY: {
    TMN_CODE: "1XD3D3Z0",
    HASH_SECRET: "VPFJJ8ZBW0PV4JQW25WCRTCXW9S3I319",
    URL: "https://sandbox.vnpayment.vn",
    RETURN_URL: "http://localhost:3000/api/payments/vnpay/return",
    IPN_URL: process.env.VNPAY_IPN_URL || "http://localhost:3004/api/payments/vnpay/ipn",
  },

  // MOMO
  MOMO: {
    PARTNER_CODE: process.env.MOMO_PARTNER_CODE,
    ACCESS_KEY: process.env.MOMO_ACCESS_KEY,
    SECRET_KEY: process.env.MOMO_SECRET_KEY,
    ENDPOINT: process.env.MOMO_ENDPOINT,
    RETURN_URL: process.env.MOMO_RETURN_URL,
    IPN_URL: process.env.MOMO_IPN_URL,
  },
};
