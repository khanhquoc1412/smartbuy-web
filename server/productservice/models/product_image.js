const mongoose = require("mongoose");

const productImageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: null,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      default: null,
    },
    fileSize: {
      type: Number,
      default: null,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    // 👇 THÊM TRƯỜNG colorId ĐỂ LIÊN KẾT ẢNH VỚI MÀU SẮC
    colorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Color",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ProductImage", productImageSchema);
