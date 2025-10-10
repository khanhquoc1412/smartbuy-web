const mongoose = require("mongoose");

const productImageSchema = new mongoose.Schema({
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
}, {
  timestamps: true,
});

module.exports = mongoose.model("ProductImage", productImageSchema);