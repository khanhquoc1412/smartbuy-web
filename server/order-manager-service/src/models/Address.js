const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
    houseNumber: {
      type: String,
      default: "",
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

module.exports = mongoose.models.Address || mongoose.model("Address", AddressSchema);