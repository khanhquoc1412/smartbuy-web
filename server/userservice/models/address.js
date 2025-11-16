const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    label: {
      type: String,
      default: "Nhà riêng", // "Văn phòng", "Nhà bạn gái"...
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    province: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    ward: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true, // Số nhà, tên đường
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// 🔹 Quan hệ với Order (1 address có nhiều orders)
AddressSchema.virtual("orders", {
  ref: "Order",
  localField: "_id",
  foreignField: "addressId",
});

// 🔹 Đảm bảo virtuals được bao gồm khi convert sang JSON
AddressSchema.set("toJSON", { virtuals: true });
AddressSchema.set("toObject", { virtuals: true });

module.exports =
  mongoose.models.Address || mongoose.model("Address", AddressSchema);
