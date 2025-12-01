require('dotenv').config();

module.exports = {
  // Server
  PORT: process.env.PORT || 3002,  // ✅ Order Service runs on port 3002
  NODE_ENV: process.env.NODE_ENV || 'development',

  // MongoDB
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/smartbuy_db_order',

  // Payment Service URL (port 3004)
  PAYMENT_SERVICE_URL: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3004',

  // Cart Service URL (port 3003) - ✅ NEW
  CART_SERVICE_URL: process.env.CART_SERVICE_URL || 'http://localhost:3003',

  // Product Service URL (port 3001) - ✅ NEW
  PRODUCT_SERVICE_URL: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001',

  // User Service URL (port 3005) - ✅ NEW
  USER_SERVICE_URL: process.env.USER_SERVICE_URL || 'http://localhost:3005',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'your-jwt-secret',

  // CORS
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
};