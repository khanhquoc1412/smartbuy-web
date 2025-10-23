/**
 * File: seed_from_json_fixed.js
 * Chức năng: Đọc dữ liệu từ seed_data.json và tự động map ObjectId giữa các bảng
 */

const { MongoClient } = require("mongodb");
const fs = require("fs");
require("dotenv").config();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/smartbuy_db_product";

async function seedFromJson() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    const db = client.db();
    console.log("✅ Kết nối MongoDB thành công!");

    const data = JSON.parse(fs.readFileSync("./seed_data.json", "utf8"));

    // Xóa dữ liệu cũ
    const collections = [
      "categories",
      "brands",
      "specifications",
      "products",
      "product_specifications",
      "colors",
      "memories",
      "product_variants",
      "product_images",
    ];
    for (const col of collections) await db.collection(col).deleteMany({});
    console.log("🧹 Đã xóa dữ liệu cũ!");

    // ====== INSERT THEO THỨ TỰ ======

    // Category
    const categoryMap = {};
    for (const c of data.categories) {
      const res = await db.collection("categories").insertOne(c);
      categoryMap[c.name] = res.insertedId;
    }

    // Brand
    const brandMap = {};
    for (const b of data.brands) {
      const res = await db.collection("brands").insertOne(b);
      brandMap[b.name] = res.insertedId;
    }

    // Color
    const colorMap = {};
    for (const c of data.colors) {
      const res = await db.collection("colors").insertOne(c);
      colorMap[c.name] = res.insertedId;
    }

    // Memory
    const memoryMap = {};
    for (const m of data.memories) {
      const res = await db.collection("memories").insertOne(m);
      const key = `${m.ram}/${m.rom}`;
      memoryMap[key] = res.insertedId;
    }

    // Specification
    const specMap = {};
    for (const s of data.specifications) {
      const res = await db.collection("specifications").insertOne(s);
      specMap[s.specName] = res.insertedId;
    }

    // Product
    const productMap = {};
    for (const p of data.products) {
      const res = await db.collection("products").insertOne({
        ...p,
        brand: brandMap[p.brand],
        category: categoryMap[p.category],
      });
      productMap[p.name] = res.insertedId;
    }

    // Product Specification
    for (const ps of data.product_specifications) {
      await db.collection("product_specifications").insertOne({
        productId: productMap[ps.product],
        specsId: specMap[ps.specName],
        specValue: ps.specValue,
      });
    }

    // Product Variant
    for (const v of data.variants) {
      const memKey = v.memory.includes("/") ? v.memory : v.memory.replace(" ", "/");
      await db.collection("product_variants").insertOne({
        productId: productMap[v.product],
        colorId: colorMap[v.color],
        memoryId: memoryMap[memKey],
        price: v.price,
        stock: v.stock,
      });
    }

    // Product Images
    for (const img of data.images) {
      await db.collection("product_images").insertOne({
        productId: productMap[img.product],
        colorId: colorMap[img.color],
        name: img.name,
        imageUrl: img.imageUrl,
      });
    }

    console.log("🌱 Dữ liệu từ file JSON đã được map ID và chèn thành công!");
  } catch (err) {
    console.error("❌ Lỗi khi seed dữ liệu:", err);
  } finally {
    await client.close();
    console.log("🔌 Đã đóng kết nối MongoDB.");
  }
}

seedFromJson();
