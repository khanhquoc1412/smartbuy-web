const mongoose = require("mongoose");

/**
 * Cart Item Schema - Embedded in Cart
 */
const CartItemSchema = new mongoose.Schema(
  {
    // ========== PRODUCT INFO ==========
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product ID là bắt buộc"],
    },
    productName: {
      type: String,
      required: [true, "Tên sản phẩm là bắt buộc"],
      trim: true,
    },
    productSlug: {
      type: String,
      required: [true, "Slug sản phẩm là bắt buộc"],
    },
    thumbUrl: {
      type: String,
      default: "",
    },

    // ========== VARIANT INFO ==========
    variant: {
      variantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Variant ID là bắt buộc"],
      },
      color: {
        id: mongoose.Schema.Types.ObjectId,
        name: String,
        code: String,
      },
      memory: {
        id: mongoose.Schema.Types.ObjectId,
        ram: String,
        rom: String,
      },
      sku: {
        type: String,
        required: true,
        index: true, // ✅ ADD: Index for fast search
      },
      price: {
        type: Number,
        required: [true, "Giá variant là bắt buộc"],
        min: [0, "Giá không thể âm"],
      },
      stock: {
        type: Number,
        default: 0,
        min: 0,
      },
    },

    // ========== QUANTITY & PRICING ==========
    quantity: {
      type: Number,
      required: [true, "Số lượng là bắt buộc"],
      min: [1, "Số lượng tối thiểu là 1"],
      default: 1,
    },
    priceAtAdd: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: true, timestamps: true }
);

/**
 * Main Cart Schema
 */
const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID là bắt buộc"],
      index: true,
    },
    items: [CartItemSchema],
    totalItems: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    couponCode: {
      type: String,
      trim: true,
      uppercase: true,
    },
    couponDiscount: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["active", "ordered", "expired"],
      default: "active",
      index: true,
    },
    expiresAt: {
      type: Date,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ========== INDEXES ==========
CartSchema.index({ userId: 1, status: 1 });
CartSchema.index({ expiresAt: 1 });
CartSchema.index({ "items.variant.sku": 1 }); // ✅ ADD: Index for SKU search

// ========== VIRTUAL FIELDS ==========
CartSchema.virtual("finalTotal").get(function () {
  return Math.max(0, this.totalPrice - this.couponDiscount);
});

// ========== INSTANCE METHODS ==========

/**
 * Calculate totals
 */
CartSchema.methods.calculateTotals = function () {
  this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
  this.totalPrice = this.items.reduce((sum, item) => sum + item.subtotal, 0);
  return this;
};

/**
 * Add item to cart
 */
CartSchema.methods.addItem = function (itemData) {
  const existingIndex = this.items.findIndex(
    (item) =>
      item.variant.variantId.toString() ===
      itemData.variant.variantId.toString()
  );

  if (existingIndex > -1) {
    // ✅ FIX: Cập nhật item đã tồn tại
    const existing = this.items[existingIndex];
    const newQty = existing.quantity + itemData.quantity;

    // Stock validation
    if (newQty > itemData.variant.stock) {
      throw new Error(`Chỉ còn ${itemData.variant.stock} sản phẩm trong kho`);
    }

    existing.quantity = newQty;
    // ✅ FIX: Tính cả discount
    existing.subtotal = Math.round(
      existing.priceAtAdd * newQty * (1 - existing.discountPercentage / 100)
    );
  } else {
    // ✅ FIX: Tính subtotal cho item mới
    const subtotal = Math.round(
      itemData.priceAtAdd *
        itemData.quantity *
        (1 - itemData.discountPercentage / 100)
    );
    this.items.push({
      ...itemData,
      subtotal,
    });
  }

  this.calculateTotals();
  return this;
};

/**
 * Remove item from cart
 */
CartSchema.methods.removeItem = function (cartItemId) {
  const index = this.items.findIndex(
    (item) => item._id.toString() === cartItemId.toString()
  );

  if (index === -1) {
    throw new Error("Không tìm thấy sản phẩm trong giỏ hàng");
  }

  this.items.splice(index, 1);
  this.calculateTotals();
  return this;
};

/**
 * Update item quantity
 */
CartSchema.methods.updateQuantity = function (cartItemId, newQty) {
  const item = this.items.find(
    (i) => i._id.toString() === cartItemId.toString()
  );

  if (!item) {
    throw new Error("Không tìm thấy sản phẩm trong giỏ hàng");
  }

  // Remove if quantity is 0
  if (newQty <= 0) {
    return this.removeItem(cartItemId);
  }

  // Stock validation
  if (newQty > item.variant.stock) {
    throw new Error(`Chỉ còn ${item.variant.stock} sản phẩm trong kho`);
  }

  item.quantity = newQty;
  // ✅ FIX: Tính cả discount
  item.subtotal = Math.round(
    item.priceAtAdd * newQty * (1 - item.discountPercentage / 100)
  );
  this.calculateTotals();
  return this;
};

/**
 * ✅ ADD: Clear all items
 */
CartSchema.methods.clearCart = function () {
  this.items = [];
  this.couponCode = null;
  this.couponDiscount = 0;
  this.calculateTotals();
  return this;
};

/**
 * ✅ ADD: Apply coupon
 */
CartSchema.methods.applyCoupon = function (code, discountAmount) {
  if (!code || discountAmount < 0) {
    throw new Error("Thông tin coupon không hợp lệ");
  }

  this.couponCode = code.toUpperCase();
  // Discount không vượt quá totalPrice
  this.couponDiscount = Math.min(discountAmount, this.totalPrice);
  return this;
};

/**
 * ✅ ADD: Remove coupon
 */
CartSchema.methods.removeCoupon = function () {
  this.couponCode = null;
  this.couponDiscount = 0;
  return this;
};

// ========== STATIC METHODS ==========

/**
 * Get or create active cart for user
 */
CartSchema.statics.getOrCreateCart = async function (userId) {
  let cart = await this.findOne({ userId, status: "active" });

  if (!cart) {
    const config = require("../config/config");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + config.CART_EXPIRE_DAYS);

    cart = await this.create({
      userId,
      items: [],
      totalItems: 0,
      totalPrice: 0,
      expiresAt,
      status: "active",
    });

    console.log("📝 Created new cart for user:", userId);
  }

  return cart;
};

/**
 * ✅ ADD: Find cart by userId
 */
CartSchema.statics.findByUserId = async function (userId) {
  return await this.findOne({
    userId,
    status: "active",
  });
};

/**
 * ✅ ADD: Clean expired carts (for cron job)
 */
CartSchema.statics.cleanExpiredCarts = async function () {
  const result = await this.updateMany(
    {
      status: "active",
      expiresAt: { $lt: new Date() },
    },
    {
      $set: { status: "expired" },
    }
  );

  console.log(`🧹 Cleaned ${result.modifiedCount} expired carts`);
  return result;
};

/**
 * ✅ ADD: Mark cart as ordered
 */
CartSchema.statics.markAsOrdered = async function (userId) {
  const cart = await this.findOneAndUpdate(
    { userId, status: "active" },
    { $set: { status: "ordered" } },
    { new: true }
  );

  if (cart) {
    console.log(`✅ Marked cart as ordered for user: ${userId}`);
  }

  return cart;
};

/**
 * ✅ ADD: Get cart item count for user
 */
CartSchema.statics.getItemCount = async function (userId) {
  const cart = await this.findOne({ userId, status: "active" });
  return cart ? cart.totalItems : 0;
};

// ========== HOOKS ==========

/**
 * ✅ ADD: Before save - Auto calculate totals
 */
CartSchema.pre("save", function (next) {
  if (this.isModified("items")) {
    this.calculateTotals();
  }
  next();
});

/**
 * ✅ ADD: After save - Log
 */
CartSchema.post("save", function (doc) {
  console.log(`💾 Cart saved for user ${doc.userId}:`, {
    totalItems: doc.totalItems,
    totalPrice: doc.totalPrice,
    finalTotal: doc.finalTotal,
    itemsCount: doc.items.length,
  });
});

/**
 * ✅ ADD: Before item save - Calculate subtotal
 */
CartItemSchema.pre("save", function (next) {
  if (
    this.isModified("quantity") ||
    this.isModified("priceAtAdd") ||
    this.isModified("discountPercentage")
  ) {
    const finalPrice = this.priceAtAdd * (1 - this.discountPercentage / 100);
    this.subtotal = Math.round(finalPrice * this.quantity);
  }
  next();
});

module.exports = mongoose.model("Cart", CartSchema);
