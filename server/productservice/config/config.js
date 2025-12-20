require("dotenv").config();

module.exports = {
  development: {
    url: process.env.DB_URL || "mongodb://localhost:27017/smartbuy_db_product",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  test: {
    url:
      process.env.DB_TEST_URL ||
      "mongodb://localhost:27017/smartbuy_db_product_test",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  production: {
    url:
      process.env.DB_PROD_URL ||
      "mongodb+srv://smartbuy_admin:KQ1412%40g@smartbuy-cluster.tz9okzm.mongodb.net/smartbuy_db_product?retryWrites=true&w=majority",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
};
