// const mongoose = require("mongoose");

// const productSpecificationSchema = new mongoose.Schema({
//   specValue: {
//     type: String,
//     default: null,
//   },
//   productId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Product",
//     required: true,
//   },
//   specsId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Specification",
//     required: true,
//   },
// }, {
//   timestamps: true,
// });

// module.exports = mongoose.model("ProductSpecification", productSpecificationSchema);

const mongoose = require("mongoose");

const productSpecificationSchema = new mongoose.Schema(
  {
    specValue: { type: String, default: null },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    specsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Specification",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "ProductSpecification",
  productSpecificationSchema
);
