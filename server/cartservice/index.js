const express = require("express");
const connectDB = require("./config/connectDB");
const config = require("./config/config");
const corsMiddleware = require("./middleware/corsMiddleware");
const cartRouter = require("./routes/cart.router");

const app = express();

// ========== CONNECT TO MONGODB ==========
connectDB();

// ========== MIDDLEWARE ==========
app.use(corsMiddleware);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging (development only)
if (config.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.path}`, {
      body: Object.keys(req.body).length ? "✅" : "❌",
      query: Object.keys(req.query).length ? "✅" : "❌",
      auth: req.headers.authorization ? "✅" : "❌",
    });
    next();
  });
}

// ========== ROUTES ==========
app.use("/api/cart", cartRouter);

// ========== HEALTH CHECK ==========
app.get("/health", (req, res) => {
  res.json({
    service: "Cart Service",
    status: "running",
    environment: config.NODE_ENV,
    timestamp: new Date().toISOString(),
    database: "MongoDB",
    uptime: process.uptime(),
  });
});

// ========== ROOT ENDPOINT ==========
app.get("/", (req, res) => {
  res.json({
    message: "SmartBuy Cart Service API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      cart: "/api/cart",
      docs: "/api/cart (see routes for details)",
    },
  });
});

// ========== 404 HANDLER ==========
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
    method: req.method,
  });
});

// ========== ERROR HANDLER ==========
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", {
    error: err.message,
    stack: err.stack,
    path: req.path,
  });

  // CORS errors
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "CORS policy: Origin not allowed",
    });
  }

  // MongoDB errors
  if (err.name === "MongoError" || err.name === "MongoServerError") {
    return res.status(500).json({
      success: false,
      message: "Database error",
      error: config.NODE_ENV === "development" ? err.message : undefined,
    });
  }

  // Validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: err.errors,
    });
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: config.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// ========== START SERVER ==========
const PORT = config.PORT;
const server = app.listen(PORT, () => {
  console.log("=".repeat(70));
  console.log("🚀 CART SERVICE STARTED");
  console.log("=".repeat(70));
  console.log(`📍 Port:        ${PORT}`);
  console.log(`🌐 Environment: ${config.NODE_ENV}`);
  console.log(`💾 Database:    smartbuy_db_cart`);
  console.log(`🔑 JWT:         ACCESS_TOKEN_PRIVATE_KEY`);
  console.log(`🌍 CORS:        ${config.CLIENT_URL}`);
  console.log("=".repeat(70));
  console.log("📡 ENDPOINTS:");
  console.log(`   Health:      http://localhost:${PORT}/health`);
  console.log(`   Root:        http://localhost:${PORT}/`);
  console.log(`   Cart API:    http://localhost:${PORT}/api/cart`);
  console.log("=".repeat(70));
});

// ========== GRACEFUL SHUTDOWN ==========
const gracefulShutdown = (signal) => {
  console.log(`\n👋 ${signal} received. Shutting down gracefully...`);

  server.close(async () => {
    console.log("🔌 HTTP server closed");

    // Close database connection
    const mongoose = require("mongoose");
    await mongoose.connection.close();
    console.log("💾 MongoDB connection closed");

    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error("⚠️ Forced shutdown after 10s timeout");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// ========== UNHANDLED ERRORS ==========
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  // Don't exit in production
  if (config.NODE_ENV === "development") {
    process.exit(1);
  }
});

process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  // Always exit on uncaught exception
  process.exit(1);
});

module.exports = app;
