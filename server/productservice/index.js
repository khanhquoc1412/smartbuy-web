const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/connectDB"); // Thêm dòng này để import module connectDB

dotenv.config();
connectDB(); // Gọi hàm kết nối database

const app = express();

// ✅ Bật CORS cho frontend (http://localhost:5173)
app.use(cors({
  origin: "http://localhost:5173", // chỉ cho phép frontend này
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// routes
const productRouter = require("./routes/product.router");
app.use("/api/product", productRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Product Service running on port ${PORT}`);
});
