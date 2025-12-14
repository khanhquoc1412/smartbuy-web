require("dotenv").config();

module.exports = {
  development: {
    url:
      process.env.MONGODB_URI ||
      process.env.DB_URL ||
      "mongodb://localhost:27017/smartbuy_db",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  test: {
    url:
      process.env.DB_TEST_URL || "mongodb://localhost:27017/smartbuy_db_test",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  production: {
    url:
      process.env.MONGODB_URI ||
      process.env.DB_URL ||
      process.env.DB_PROD_URL ||
      "mongodb+srv://smartbuy_admin:KQ1412%40g@smartbuy-cluster.tz9okzm.mongodb.net/smartbuy_db?retryWrites=true&w=majority",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
};
