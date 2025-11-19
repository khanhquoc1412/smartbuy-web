require("dotenv").config();

module.exports = {
  // ========== DATABASE CONFIG ==========
  database: {
    development: {
      url: process.env.DB_URL || "mongodb://localhost:27017/smartbuy_db_cart",
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    },
    test: {
      url:
        process.env.DB_TEST_URL ||
        "mongodb://localhost:27017/smartbuy_db_cart_test",
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    },
    production: {
      url:
        process.env.DB_PROD_URL ||
        "mongodb+srv://user:pass@cluster.mongodb.net/smartbuy_db_cart",
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    },
  },

  // ========== APPLICATION CONFIG ==========
  PORT: process.env.PORT || 3002,
  NODE_ENV: process.env.NODE_ENV || "development",

  // JWT (PHẢI GIỐNG VỚI USERSERVICE)
  ACCESS_TOKEN_PRIVATE_KEY:
    process.env.ACCESS_TOKEN_PRIVATE_KEY || "supersecret123",
  REFRESH_TOKEN_PRIVATE_KEY:
    process.env.REFRESH_TOKEN_PRIVATE_KEY || "refreshsecret456",

  // External Services
  PRODUCT_SERVICE_URL:
    process.env.PRODUCT_SERVICE_URL || "http://localhost:3001",
  USER_SERVICE_URL: process.env.USER_SERVICE_URL || "http://localhost:3005",

  // Cart Settings
  CART_EXPIRE_DAYS: parseInt(process.env.CART_EXPIRE_DAYS) || 30,
  MAX_ITEMS_PER_CART: parseInt(process.env.MAX_ITEMS_PER_CART) || 100,

  // CORS
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
};
