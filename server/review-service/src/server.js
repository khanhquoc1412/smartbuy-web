require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { connectDB } = require("./config/database");

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: '50mb' })); // ✅ Tăng limit lên 50MB cho base64 images
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan("dev"));

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 phút
  max: 100, // giới hạn 100 requests mỗi phút
});
app.use(limiter);

// Routes
app.use("/api/reviews", require("./routes/reviews"));

// Health check
app.get("/", (req, res) => {
  res.json({ 
    success: true, 
    message: "Review Service OK",
    version: "1.0.0"
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 5006;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/smartbuy_db_review";

connectDB(MONGODB_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Review Service listening on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
  });
});

module.exports = app;
