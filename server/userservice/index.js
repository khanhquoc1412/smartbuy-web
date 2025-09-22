require("dotenv").config();
// Load .env đầu tiên
const express = require("express");
const connectDB = require("./config/connectDB"); // Kết nối MongoDB
require("./config/passport");
// Init Passport cho social login

const app = express();
const PORT = process.env.PORT || 3005; // Default 3005 nếu không có env

// Middleware chung (từ thư mục middleware của bạn)
const { corsMiddleware, auth } = require("./middleware"); // Giả sử bạn có index.js trong middleware
app.use(corsMiddleware);
app.use(express.json()); // Parse JSON body
app.use(express.urlencoded({ extended: true })); // Parse form data

// Routes (từ auth.router.js)
const authRouter = require("./routes/auth.router");
app.use("/api/auth", authRouter); // Ví dụ: /api/auth/login, /api/auth/google

// Connect DB
connectDB();

// Listen server
app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});

module.exports = app; // Export nếu cần test
