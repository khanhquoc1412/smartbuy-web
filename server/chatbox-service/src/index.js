const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
// Load .env only in development (Railway injects env vars directly)
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "./config.env" });
}

const webhookRoutes = require("./routes/webhookRoutes");
const healthRoutes = require("./routes/healthRoutes");

const app = express();
const PORT = process.env.PORT || 3007;

// ==================== MIDDLEWARE ====================

// CORS Configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "*",
    credentials: true,
  })
);

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Request Logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ==================== ROUTES ====================

app.use("/health", healthRoutes);
app.use("/webhook", webhookRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    service: "SmartBuy ChatBox Service",
    version: "1.0.0",
    status: "running",
    endpoints: {
      health: "/health",
      webhook: "/webhook",
      dialogflow: "/webhook/dialogflow",
    },
    documentation: "https://github.com/your-repo/docs",
  });
});

// ==================== ERROR HANDLING ====================

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
    path: req.path,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log("=".repeat(60));
  console.log(`🤖 ChatBox Service is running`);
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Webhook URL: http://localhost:${PORT}/webhook/dialogflow`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  console.log("=".repeat(60));
});

// Graceful Shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("\nSIGINT received. Shutting down gracefully...");
  process.exit(0);
});

module.exports = app;
