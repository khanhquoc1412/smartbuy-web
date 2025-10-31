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
    console.log("🔗 Đang kết nối tới MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected successfully!");

    // 📖 Đọc dữ liệu từ file JSON
    const dataPath = path.join(__dirname, "seed_data_complete.json");
    console.log(`📖 Đang đọc file: ${dataPath}`);
    
    if (!fs.existsSync(dataPath)) {
      throw new Error(`❌ File không tồn tại: ${dataPath}`);
    }
    
    const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
    console.log(`✅ Đã đọc file JSON thành công!`);
    console.log(`📊 Tổng quan dữ liệu:`);
    console.log(`   - Categories: ${data.categories?.length || 0}`);
    console.log(`   - Brands: ${data.brands?.length || 0}`);
    console.log(`   - Colors: ${data.colors?.length || 0}`);
    console.log(`   - Memories: ${data.memories?.length || 0}`);
    console.log(`   - Products: ${data.products?.length || 0}`);

    // 🧹 Xóa dữ liệu cũ (đảm bảo sạch trước khi seed)
    console.log("\n🧹 Đang xóa dữ liệu cũ...");
    await ProductImage.deleteMany();
    await ProductVariant.deleteMany();
    await ProductSpecification.deleteMany();
    await Product.deleteMany();
    await Memory.deleteMany();
    await Color.deleteMany();
    await Specification.deleteMany();
    await Brand.deleteMany();
    await Category.deleteMany();
    console.log("✅ Đã xóa dữ liệu cũ thành công!");

    // 🌱 Chèn dữ liệu độc lập
    console.log("\n🌱 Đang seed dữ liệu cơ bản...");

    // 1️⃣ Categories
    console.log("1️⃣  Seeding Categories...");
    for (const cat of data.categories) {
      await Category.updateOne(
        { nameAscii: cat.nameAscii },
        { $set: cat },
        { upsert: true }
      );
    }
    console.log(`   ✅ Đã seed ${data.categories.length} categories`);

    // 2️⃣ Brands
    console.log("2️⃣  Seeding Brands...");
    for (const brand of data.brands) {
      if (!brand.nameAscii) continue; // tránh null nameAscii
      await Brand.updateOne(
        { nameAscii: brand.nameAscii },
        { $set: brand },
        { upsert: true }
      );
    }
    console.log(`   ✅ Đã seed ${data.brands.length} brands`);

    // 3️⃣ Specifications
    console.log("3️⃣  Seeding Specifications...");
    for (const spec of data.specifications) {
      await Specification.updateOne(
        { specName: spec.specName },
        { $set: spec },
        { upsert: true }
      );
    }
    console.log(`   ✅ Đã seed ${data.specifications.length} specifications`);

    // 4️⃣ Colors
    console.log("4️⃣  Seeding Colors...");
    for (const color of data.colors) {
      await Color.updateOne(
        { name: color.name },
        { $set: color },
        { upsert: true }
      );
    }
    console.log(`   ✅ Đã seed ${data.colors.length} colors`);

    // 5️⃣ Memories
    console.log("5️⃣  Seeding Memories...");
    for (const mem of data.memories) {
      await Memory.updateOne(
        { ram: mem.ram, rom: mem.rom },
        { $set: mem },
        { upsert: true }
      );
    }
    console.log(`   ✅ Đã seed ${data.memories.length} memories`);

    // 🔁 Sau khi chèn xong, lấy lại danh sách từ DB để map ID
    console.log("\n🔄 Đang tạo mapping ID...");
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
    console.log("✅ Đã tạo mapping ID thành công!");

    // 📱 Seeding Products
    console.log("\n📱 Đang seed sản phẩm và quan hệ...");
    console.log("━".repeat(60));

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < data.products.length; i++) {
      const productData = data.products[i];
      try {
        // Tạo sản phẩm chính
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

        successCount++;
        console.log(
          `✅ [${i + 1}/${data.products.length}] ${newProduct.name} (${productData.brand})`
        );
      } catch (error) {
        errorCount++;
        console.error(
          `❌ [${i + 1}/${data.products.length}] Lỗi khi tạo ${productData.name}:`,
          error.message
        );
      }
    }

    console.log("━".repeat(60));
    console.log("\n🎉 HOÀN THÀNH SEED DỮ LIỆU!");
    console.log("📊 THỐNG KÊ:");
    console.log(`   ✅ Thành công: ${successCount} sản phẩm`);
    console.log(`   ❌ Lỗi: ${errorCount} sản phẩm`);
    console.log(`   📦 Tổng cộng: ${data.products.length} sản phẩm`);
    
    // Thống kê chi tiết theo thương hiệu
    console.log("\n📊 CHI TIẾT THEO THƯƠNG HIỆU:");
    const productsByBrand = {};
    for (const p of data.products) {
      productsByBrand[p.brand] = (productsByBrand[p.brand] || 0) + 1;
    }
    for (const [brand, count] of Object.entries(productsByBrand)) {
      console.log(`   • ${brand}: ${count} sản phẩm`);
    }
    
    console.log("\n✅ Data Imported Successfully!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ LỖI KHI IMPORT DỮ LIỆU:");
    console.error(error);
    process.exit(1);
  }
};

// Chạy script
console.log("🚀 BẮT ĐẦU SEED DỮ LIỆU TỪ seed_data_complete.json");
console.log("━".repeat(60));
importData();
