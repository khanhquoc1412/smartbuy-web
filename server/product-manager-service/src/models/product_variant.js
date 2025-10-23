const mongoose = require("mongoose");

const productVariantSchema = new mongoose.Schema({
  stock: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    default: 0,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  memoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Memory",
    required: true,
  },
  colorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Color",
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("ProductVariant", productVariantSchema);