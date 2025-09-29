const mongoose = require("mongoose");
const slugify = require("slugify");
require("dotenv").config();

// Import models
const Category = require("./category");
const Brand = require("./brand");
const Specification = require("./specification");
const Product = require("./product");
const ProductSpecification = require("./product_specification");

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/smartbuy_db_product";

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    // Xóa dữ liệu cũ
    await Category.deleteMany();
    await Brand.deleteMany();
    await Specification.deleteMany();
    await Product.deleteMany();
    await ProductSpecification.deleteMany();
    console.log("🧹 Old data cleared");

    // Tạo category
    const phoneCategory = await Category.create({
      name: "Điện thoại",
      nameAscii: "dien-thoai",
    });

    // Tạo brand
    const apple = await Brand.create({
      name: "Apple",
      nameAscii: "apple",
    });

    // Tạo specification list
    const specs = await Specification.insertMany([
      { specName: "Màn hình" },
      { specName: "Camera" },
      { specName: "Chip" },
      { specName: "RAM & Bộ nhớ" },
      { specName: "Pin" },
      { specName: "Hệ điều hành" },
    ]);

    // Tạo product (thêm slug ✅)
    const iphone15 = await Product.create({
      name: "iPhone 15",
      description: "Điện thoại iPhone 15 mới nhất",
      thumbUrl: "/src/assets/images/ip15.jpg", // chỉ lưu đường dẫn ảnh
      discountPercentage: 5,
      slug: slugify("iPhone 15", { lower: true }), // ✅ thêm slug
      basePrice: 25000000,
      brandId: apple._id,
      categoryId: phoneCategory._id,
    });

    // Gán specification cho iPhone 15
    await ProductSpecification.insertMany([
      {
        productId: iphone15._id,
        specsId: specs[0]._id,
        specValue: "6.1 inch OLED",
      },
      {
        productId: iphone15._id,
        specsId: specs[1]._id,
        specValue: "48MP + 12MP",
      },
      {
        productId: iphone15._id,
        specsId: specs[2]._id,
        specValue: "Apple A16 Bionic",
      },
      {
        productId: iphone15._id,
        specsId: specs[3]._id,
        specValue: "6GB RAM + 128GB",
      },
      {
        productId: iphone15._id,
        specsId: specs[4]._id,
        specValue: "3279 mAh",
      },
      {
        productId: iphone15._id,
        specsId: specs[5]._id,
        specValue: "iOS 17",
      },
    ]);

    console.log("🌱 Seeding completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding data:", err);
    process.exit(1);
  }
};

seed();
