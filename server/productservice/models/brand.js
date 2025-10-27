// const mongoose = require("mongoose");

// const BrandSchema = new mongoose.Schema({
//   name: { type: String, required: true, unique: true },
//   // nameAscii: { type: String }, // 👈 thêm dòng này
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Brand", BrandSchema);

const mongoose = require("mongoose");

const BrandSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  nameAscii: { type: String, default: null }, // ✅ bật lại dòng này
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Brand", BrandSchema);
