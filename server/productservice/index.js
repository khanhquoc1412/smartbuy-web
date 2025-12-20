const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/connectDB"); // Thêm dòng này để import module connectDB

// Load .env only in development (Railway injects env vars directly)
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}
connectDB(); // Gọi hàm kết nối database

const app = express();

// ✅ Bật CORS cho frontend (http://localhost:5173) VÀ API Gateway (http://localhost:3000)
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Client
      "http://localhost:3000", // API Gateway
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", service: "product-service" });
});

// routes
const productRouter = require("./routes/product.router");
app.use("/api/product", productRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Product Service running on port ${PORT}`);
});
// restart
// restart2
