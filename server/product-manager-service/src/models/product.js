// const mongoose = require("mongoose");
// const slugify = require("slugify");

// const productSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     description: {
//       type: String,
//       default: null,
//     },
//     thumbUrl: {
//       type: String,
//       default: null,
//     },
//     discountPercentage: {
//       type: Number,
//       default: 0,
//     },
//     slug: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     basePrice: {
//       type: Number,
//       required: true,
//     },
//     brandId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Brand",
//       required: true,
//     },
//     categoryId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Category",
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// productSchema.pre("save", function (next) {
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });

// module.exports = mongoose.model("Product", productSchema);

const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, default: null },
    thumbUrl: { type: String, default: null },
    discountPercentage: { type: Number, default: 0 },
    slug: { type: String, required: true, unique: true },
    basePrice: { type: Number, required: true },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
