const mongoose = require("mongoose");
const config = require("./config")[process.env.NODE_ENV || "development"];

const connectDB = async () => {
  try {
    await mongoose.connect(config.url, config.options);
    console.log("✅ MongoDB connection has been established successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
