const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

// Import tất cả các model
const Category = require("./category");
const Brand = require("./brand");
const Specification = require("./specification");
const Color = require("./color");
const Memory = require("./memory");
const Product = require("./product");
const ProductSpecification = require("./product_specification");
const ProductVariant = require("./product_variant");
const ProductImage = require("./product_image");

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/smartbuy_db_product";

const importData = async () => {
  try {
    // Kết nối tới DB
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    // Đọc dữ liệu từ file JSON
    // Sửa thành tên file đúng của bạn
    const dataPath = path.join(__dirname, "seed_data.json");
    const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

    // Tùy chọn: Xóa dữ liệu cũ để tránh trùng lặp
    console.log("🧹 Clearing old data...");
    await Category.deleteMany();
    await Brand.deleteMany();
    await Specification.deleteMany();
    await Color.deleteMany();
    await Memory.deleteMany();
    await Product.deleteMany();
    await ProductSpecification.deleteMany();
    await ProductVariant.deleteMany();
    await ProductImage.deleteMany();
    console.log("🧹 Old data cleared");

    // --- Bắt đầu chèn dữ liệu ---

    console.log("🌱 Seeding independent data...");
    // 1. Chèn các dữ liệu không phụ thuộc
    const categories = await Category.insertMany(data.categories);
    const brands = await Brand.insertMany(data.brands);
    const specifications = await Specification.insertMany(data.specifications);
    const colors = await Color.insertMany(data.colors);
    const memories = await Memory.insertMany(data.memories);

    // 2. Tạo các map để dễ dàng tra cứu ID từ tên (bước quan trọng nhất)
    const categoryMap = new Map(categories.map((c) => [c.name, c._id]));
    const brandMap = new Map(brands.map((b) => [b.name, b._id]));
    const specMap = new Map(specifications.map((s) => [s.specName, s._id]));
    const colorMap = new Map(colors.map((c) => [c.name, c._id]));
    const memoryMap = new Map(
      memories.map((m) => [`${m.ram}/${m.rom}`, m._id])
    );

    console.log("📱 Seeding products and their relations...");
    // 3. Lặp qua từng sản phẩm để chèn và tạo liên kết
    for (const productData of data.products) {
      // Tạo sản phẩm chính
      const newProduct = await Product.create({
        name: productData.name,
        description: productData.description,
        thumbUrl: productData.thumbUrl,
        discountPercentage: productData.discountPercentage,
        slug: productData.slug,
        basePrice: productData.basePrice,
        brand: brandMap.get(productData.brand), // Lấy ID từ map
        category: categoryMap.get(productData.category), // Lấy ID từ map
      });

      // Tạo thông số kỹ thuật cho sản phẩm
      if (productData.specifications && productData.specifications.length > 0) {
        const productSpecs = productData.specifications.map((spec) => ({
          productId: newProduct._id,
          specsId: specMap.get(spec.specName), // Lấy ID từ map
          specValue: spec.specValue,
        }));
        await ProductSpecification.insertMany(productSpecs);
      }

      // Tạo các biến thể sản phẩm
      if (productData.variants && productData.variants.length > 0) {
        const productVariants = productData.variants.map((variant) => ({
          productId: newProduct._id,
          colorId: colorMap.get(variant.color), // Lấy ID từ map
          memoryId: memoryMap.get(
            `${variant.memory.ram}/${variant.memory.rom}`
          ), // Lấy ID từ map
          price: variant.price,
          stock: variant.stock,
        }));
        await ProductVariant.insertMany(productVariants);
      }

      // Tạo hình ảnh sản phẩm
      if (productData.images && productData.images.length > 0) {
        const productImages = productData.images.map((image) => ({
          productId: newProduct._id,
          colorId: colorMap.get(image.color), // Lấy ID từ map
          name: image.name,
          imageUrl: image.imageUrl,
        }));
        await ProductImage.insertMany(productImages);
      }

      console.log(`   -> Created product: ${newProduct.name}`);
    }

    console.log("✅ Data Imported Successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error importing data:", error);
    process.exit(1);
  }
};

importData();
