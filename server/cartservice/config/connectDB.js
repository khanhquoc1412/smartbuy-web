const mongoose = require("mongoose");
const config = require("./config");

const connectDB = async () => {
  try {
    const dbConfig = config.database[config.NODE_ENV];
    await mongoose.connect(dbConfig.url, dbConfig.options);
    console.log("✅ MongoDB connection has been established successfully.");
    console.log(`📦 Database: smartbuy_db_cart`);
  } catch (error) {
    console.error("❌ Unable to connect to MongoDB:", error.message);
    process.exit(1);
  }
};

// Connection events
mongoose.connection.on("connected", () => {
  console.log("🔌 Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ Mongoose disconnected from MongoDB");
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("👋 MongoDB connection closed - Cart Service");
  process.exit(0);
});

module.exports = connectDB;
