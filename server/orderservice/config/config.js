require('dotenv').config();

module.exports = {
  // Server
  PORT: process.env.PORT || 3004,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // MongoDB
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/smartbuy_db_order',
  
  // Payment Service URL
  PAYMENT_SERVICE_URL: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3004',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'your-jwt-secret',
  
  // CORS
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
};