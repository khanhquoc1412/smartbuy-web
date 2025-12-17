const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    userName: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    helpfulCount: {
      type: Number,
      default: 0,
    },
    helpfulBy: {
      type: [String],
      default: [],
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    hiddenReason: {
      type: String,
      default: null,
    },
    hiddenBy: {
      type: String,
      default: null,
    },
    hiddenAt: {
      type: Date,
      default: null,
    },
    adminReply: {
      type: String,
      default: null,
    },
    adminReplyBy: {
      type: String,
      default: null,
    },
    adminReplyAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index để query nhanh
reviewSchema.index({ productId: 1, createdAt: -1 });
reviewSchema.index({ userId: 1 });
reviewSchema.index({ rating: 1 });

module.exports = mongoose.model("Review", reviewSchema);
