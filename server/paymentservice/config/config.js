const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  // MongoDB
  MONGO_URI:
    process.env.MONGO_URI || "mongodb://localhost:27017/smartbuy_db_payment",

  // Server
  PORT: process.env.PORT || 3002,
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

  // External Services
  ORDER_SERVICE_URL: process.env.ORDER_SERVICE_URL || "http://localhost:3004",

  // Webhook
  WEBHOOK_SECRET: process.env.WEBHOOK_SECRET || "webhook-secret-key",

  // VNPAY
  VNPAY: {
    TMN_CODE: process.env.VNPAY_TMN_CODE,
    HASH_SECRET: process.env.VNPAY_HASH_SECRET,
    URL: process.env.VNPAY_URL,
    RETURN_URL: process.env.VNPAY_RETURN_URL,
    IPN_URL: process.env.VNPAY_IPN_URL,
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
