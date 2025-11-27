require("dotenv").config();

const express = require("express");
const connectDB = require("./config/connectDB");
require("./config/passport");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3005;

// Middleware
const { corsMiddleware } = require("./middleware");
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static avatars
app.use('/avatars', express.static(path.join(__dirname, 'avarta')));

// ===== ROUTES =====
const authRouter = require("./routes/auth.router"); // ✅ Auth routes
const addressRouter = require("./routes/address.router"); // ✅ Address routes

app.use("/api/auth", authRouter);
app.use("/api/user/addresses", addressRouter); // ✅ Mount address routes

// Health check
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "User service is running",
    port: PORT,
    database: "smartbuy_db",
    routes: ["/api/auth", "/api/user/addresses"]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Something went wrong!"
  });
});

// Connect DB
connectDB();

// Listen
app.listen(PORT, () => {
  console.log(`🚀 User Service running on port ${PORT}`);
  console.log(`📊 Database: smartbuy_db`);
  console.log(`🔗 Routes:`);
  console.log(`   - /api/auth`);
  console.log(`   - /api/user/addresses`);
});

module.exports = app;