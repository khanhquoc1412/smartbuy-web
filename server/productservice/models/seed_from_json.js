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
    // 🔗 Kết nối tới MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    // 🔥 Xóa các bản ghi lỗi có nameAscii = null để tránh duplicate key
    await Brand.deleteMany({ nameAscii: null });
    console.log("🧹 Removed invalid brands with null nameAscii");

    // 📖 Đọc dữ liệu từ file JSON
    const dataPath = path.join(__dirname, "seed_data.json");
    const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

    // 🧹 Xóa dữ liệu cũ (đảm bảo sạch trước khi seed)
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

    // 🌱 Chèn dữ liệu độc lập
    console.log("🌱 Seeding independent data...");

    // 👉 Dùng updateOne + upsert để tránh lỗi trùng khóa
    for (const cat of data.categories) {
      await Category.updateOne(
        { nameAscii: cat.nameAscii },
        { $set: cat },
        { upsert: true }
      );
    }

    for (const brand of data.brands) {
      if (!brand.nameAscii) continue; // tránh null nameAscii
      await Brand.updateOne(
        { nameAscii: brand.nameAscii },
        { $set: brand },
        { upsert: true }
      );
    }

    for (const spec of data.specifications) {
      await Specification.updateOne(
        { specName: spec.specName },
        { $set: spec },
        { upsert: true }
      );
    }

    for (const color of data.colors) {
      await Color.updateOne(
        { name: color.name },
        { $set: color },
        { upsert: true }
      );
    }

    for (const mem of data.memories) {
      await Memory.updateOne(
        { ram: mem.ram, rom: mem.rom },
        { $set: mem },
        { upsert: true }
      );
    }

    // 🔁 Sau khi chèn xong, lấy lại danh sách từ DB để map ID
    const categories = await Category.find();
    const brands = await Brand.find();
    const specifications = await Specification.find();
    const colors = await Color.find();
    const memories = await Memory.find();

    const categoryMap = new Map(categories.map((c) => [c.name, c._id]));
    const brandMap = new Map(brands.map((b) => [b.name, b._id]));
    const specMap = new Map(specifications.map((s) => [s.specName, s._id]));
    const colorMap = new Map(colors.map((c) => [c.name, c._id]));
    const memoryMap = new Map(
      memories.map((m) => [`${m.ram}/${m.rom}`, m._id])
    );

    console.log("📱 Seeding products and their relations...");

    // 🔧 Tạo sản phẩm và quan hệ
    for (const productData of data.products) {
      const newProduct = await Product.create({
        name: productData.name,
        description: productData.description,
        thumbUrl: productData.thumbUrl,
        discountPercentage: productData.discountPercentage,
        slug: productData.slug,
        basePrice: productData.basePrice,
        brand: brandMap.get(productData.brand),
        category: categoryMap.get(productData.category),
      });

      // 🧩 Thông số kỹ thuật
      if (productData.specifications && productData.specifications.length > 0) {
        const productSpecs = productData.specifications.map((spec) => ({
          productId: newProduct._id,
          specsId: specMap.get(spec.specName),
          specValue: spec.specValue,
        }));
        await ProductSpecification.insertMany(productSpecs);
      }

      // 🎨 Biến thể (color + memory)
      if (productData.variants && productData.variants.length > 0) {
        const productVariants = productData.variants.map((variant) => ({
          productId: newProduct._id,
          colorId: colorMap.get(variant.color),
          memoryId: memoryMap.get(
            `${variant.memory.ram}/${variant.memory.rom}`
          ),
          price: variant.price,
          stock: variant.stock,
        }));
        await ProductVariant.insertMany(productVariants);
      }

      // 🖼️ Hình ảnh sản phẩm
      if (productData.images && productData.images.length > 0) {
        const productImages = productData.images.map((image) => ({
          productId: newProduct._id,
          colorId: colorMap.get(image.color),
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
