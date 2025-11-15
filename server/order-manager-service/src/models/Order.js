const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    // ============ THÔNG TIN KHÁCH HÀNG ============
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // index để query nhanh
    },

    // ============ SẢN PHẨM TRONG ĐơN ============
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },      // snapshot tên sản phẩm
        sku: { type: String },                       // mã SKU
        qty: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 }, // giá tại thời điểm đặt
        image: { type: String },                     // ảnh đại diện
        variant: {                                   // biến thể sản phẩm
          color: { type: String },
          memory: { type: String },
          variantId: { type: mongoose.Schema.Types.ObjectId }, // ID variant để reserve stock
        },
      },
    ],

    // ============ ĐỊA CHỈ GIAO HÀNG ============
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      province: { type: String, required: true },
      district: { type: String, required: true },
      ward: { type: String, required: true },
      address: { type: String, required: true },    // số nhà, tên đường
      addressId: { type: mongoose.Schema.Types.ObjectId, ref: "Address" }, // reference nếu cần
    },

    // ============ THANH TOÁN ============
    paymentMethod: {
      type: String,
      enum: ["COD", "VNPAY", "MOMO", "ZALOPAY", "PAYPAL", "CREDIT_CARD"],
      required: true,
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded", "failed"],
      default: "unpaid",
    },

    paymentResult: {
      transactionId: String,        // mã giao dịch từ cổng thanh toán
      paymentGateway: String,       // VNPAY, MOMO...
      status: String,               // SUCCESS, FAILED
      paidAt: Date,                 // thời điểm thanh toán
      amount: Number,               // số tiền đã thanh toán
      responseCode: String,         // mã phản hồi từ gateway
      bankCode: String,             // ngân hàng (nếu có)
    },

    // ============ GIÁ CẢ ============
    itemsPrice: { type: Number, required: true, min: 0 },     // tổng tiền sản phẩm
    shippingPrice: { type: Number, default: 0, min: 0 },      // phí ship
    taxPrice: { type: Number, default: 0, min: 0 },           // thuế VAT
    discountAmount: { type: Number, default: 0, min: 0 },     // giảm giá
    couponCode: { type: String, uppercase: true, trim: true }, // mã giảm giá
    totalPrice: { type: Number, required: true, min: 0 },     // tổng cuối cùng

    // ============ TRẠNG THÁI ĐƠN HÀNG ============
    status: {
      type: String,
      enum: [
        "pending_payment",  // chờ thanh toán (online payment)
        "payment_failed",   // thanh toán thất bại
        "pending",          // chờ shop xác nhận
        "confirmed",        // shop đã xác nhận
        "processing",       // đang chuẩn bị hàng (đóng gói)
        "ready_to_ship",    // sẵn sàng giao shipper
        "shipping",         // đang giao hàng
        "delivered",        // đã giao (chờ khách xác nhận)
        "completed",        // hoàn thành (khách đã xác nhận)
        "cancelled",        // đã hủy
        "returned",         // đã trả hàng
      ],
      default: "pending",
      index: true,
    },

    // ============ GIAO HÀNG ============
    shippingInfo: {
      carrier: { type: String },              // đơn vị vận chuyển (Giao Hàng Nhanh, Viettel Post...)
      trackingNumber: { type: String },       // mã vận đơn
      estimatedDelivery: { type: Date },      // dự kiến giao
      actualDelivery: { type: Date },         // thực tế giao
      shippingMethod: { type: String },       // Express, Standard, Economy
    },

    // ============ GHI CHÚ & LÝ DO ============
    notes: { type: String, maxlength: 500 },           // ghi chú của khách
    adminNotes: { type: String, maxlength: 500 },      // ghi chú nội bộ (admin)
    cancelReason: { type: String },                    // lý do hủy
    returnReason: { type: String },                    // lý do trả hàng

    // ============ LỊCH SỬ THAY ĐỔI ============
    statusHistory: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        actor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",  // admin hoặc system
        },
        actorType: { type: String, enum: ["user", "admin", "system"], default: "system" },
        note: { type: String },
      },
    ],

    // ============ QUẢN LÝ TỒN KHO ============
    stockReserved: { type: Boolean, default: false },  // đã reserve stock chưa
    stockReservedAt: { type: Date },                   // thời điểm reserve
    stockReleased: { type: Boolean, default: false },  // đã release stock chưa

    // ============ TỰ ĐỘNG HỦY ============
    autoCancel: {
      enabled: { type: Boolean, default: false },
      scheduledAt: { type: Date },                     // thời điểm tự động hủy
      reason: { type: String },
    },
  },
  {
    timestamps: true, // tự động thêm createdAt, updatedAt
  }
);

// ============ INDEXES ============
OrderSchema.index({ user: 1, createdAt: -1 });              // query orders của user
OrderSchema.index({ status: 1, createdAt: -1 });            // query theo status
OrderSchema.index({ "shippingInfo.trackingNumber": 1 });    // tracking đơn hàng
OrderSchema.index({ "paymentResult.transactionId": 1 });    // query theo mã giao dịch

// ============ VIRTUAL FIELDS ============
OrderSchema.virtual("orderNumber").get(function () {
  // Tạo mã đơn hàng: ORD-20251114-ABC123
  const date = this.createdAt.toISOString().slice(0, 10).replace(/-/g, "");
  const id = this._id.toString().slice(-6).toUpperCase();
  return `ORD-${date}-${id}`;
});

// ============ METHODS ============

// Thêm trạng thái vào lịch sử
OrderSchema.methods.addStatusHistory = function (status, actor, actorType, note) {
  this.statusHistory.push({
    status,
    timestamp: new Date(),
    actor,
    actorType: actorType || "system",
    note,
  });
  this.status = status;
};

// Kiểm tra có thể hủy không
OrderSchema.methods.canCancel = function () {
  return ["pending", "confirmed", "pending_payment"].includes(this.status);
};

// Kiểm tra có thể refund không
OrderSchema.methods.canRefund = function () {
  return this.paymentStatus === "paid" && ["cancelled", "returned"].includes(this.status);
};

// Tính tổng tiền
OrderSchema.methods.calculateTotal = function () {
  this.totalPrice = this.itemsPrice + this.shippingPrice + this.taxPrice - this.discountAmount;
  return this.totalPrice;
};

// ============ STATICS ============

// Generate order number from _id and createdAt
OrderSchema.statics.generateOrderNumber = function (orderId, createdAt) {
  const date = createdAt.toISOString().slice(0, 10).replace(/-/g, "");
  const id = orderId.toString().slice(-6).toUpperCase();
  return `ORD-${date}-${id}`;
};

// Add orderNumber to orders array
OrderSchema.statics.addOrderNumbers = function (orders) {
  return orders.map(order => ({
    ...order,
    orderNumber: this.generateOrderNumber(order._id, order.createdAt)
  }));
};

// Tìm orders theo user
OrderSchema.statics.findByUser = function (userId, options = {}) {
  return this.find({ user: userId })
    .sort(options.sort || { createdAt: -1 })
    .limit(options.limit || 20)
    .populate("user", "userName email");
};

// Tìm orders theo status
OrderSchema.statics.findByStatus = function (status, options = {}) {
  return this.find({ status })
    .sort(options.sort || { createdAt: -1 })
    .limit(options.limit || 50);
};

// Đếm orders theo status
OrderSchema.statics.countByStatus = function (userId) {
  return this.aggregate([
    { $match: userId ? { user: new mongoose.Types.ObjectId(userId) } : {} },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
};

// ============ MIDDLEWARE ============

// Tự động thêm status history khi tạo mới
OrderSchema.pre("save", function (next) {
  if (this.isNew) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      actorType: "system",
      note: "Order created",
    });
  }
  next();
});

// Đảm bảo virtuals được include khi convert sang JSON
OrderSchema.set("toJSON", { virtuals: true });
OrderSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Order", OrderSchema);
