const express = require("express");
const cors = require("cors");
const connectDB = require("./config/connectDB");
const config = require("./config/config");
const cron = require("node-cron");
const paymentService = require("./services/payment.service");

const app = express();

// ============ MIDDLEWARE ============
app.use(
  cors({
    origin: config.ALLOWED_ORIGINS,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============ ROUTES ============
app.use("/api/payments", require("./routes/payment.routes"));
app.use("/api/webhooks", require("./routes/webhook.routes"));

// ============ HEALTH CHECK ============
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "PaymentService is running",
    port: config.PORT,
    service: "payment-service",
  });
});

// ============ 404 HANDLER ============
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ============ ERROR HANDLER ============
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// ============ CRON JOB: Tự động hủy payment hết hạn ============
// Chạy mỗi 5 phút
cron.schedule("*/5 * * * *", async () => {
  try {
    console.log("🕒 Running auto-cancel expired payments job...");
    const cancelledCount = await paymentService.autoCancelExpiredPayments();
    console.log(`✅ Auto-cancelled ${cancelledCount} expired payments`);
  } catch (error) {
    console.error("❌ Auto-cancel job error:", error);
  }
});

// ============ START SERVER ============
const startServer = async () => {
  try {
    await connectDB();

    app.listen(config.PORT, () => {
      console.log(`✅ PaymentService running on port ${config.PORT}`);
      console.log(`🌐 Environment: ${config.NODE_ENV}`);
      console.log(`📦 Database: ${config.MONGO_URI}`);
      console.log(`🕑 Cron job for auto-cancel enabled`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
