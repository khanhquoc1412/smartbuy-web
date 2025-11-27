const mongoose = require("mongoose");

const WishlistItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    variantId: {
        type: String, // ID của variant (nếu sản phẩm có nhiều màu/cấu hình)
        required: false,
    },
    colorId: {
        type: String, // ID màu sắc đã chọn
        required: false,
    },
    memoryId: {
        type: String, // ID cấu hình đã chọn
        required: false,
    },
    addedAt: {
        type: Date,
        default: Date.now,
    },
});

const WishlistSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
            index: true,
        },
        items: [WishlistItemSchema],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Wishlist", WishlistSchema);
