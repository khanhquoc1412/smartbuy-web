// const mongoose = require("mongoose");

// const brandSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     nameAscii: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("Brand", brandSchema);
const mongoose = require("mongoose");

const BrandSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  nameAscii: { type: String }, // 👈 thêm dòng này
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Brand", BrandSchema);
