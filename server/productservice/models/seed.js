const mongoose = require("mongoose");
const slugify = require("slugify");
require("dotenv").config();


// Import models
const Category = require("./category");
const Brand = require("./brand");
const Color = require("./color");
const Memory = require("./memory");
const Product = require("./product");
const ProductVariant = require("./product_variant");
const ProductImage = require("./product_image");
const Specification = require("./specification");
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
  await Color.deleteMany();
  await Memory.deleteMany();
  await Specification.deleteMany();
  await Product.deleteMany();
  await ProductVariant.deleteMany();
  await ProductImage.deleteMany();
  await ProductSpecification.deleteMany();
  console.log("🧹 Old data cleared");

    // Tạo categories
    const phoneCategory = await Category.create({
      name: "Điện thoại",
      nameAscii: "dien-thoai",
    });
    const laptopCategory = await Category.create({
      name: "Laptop",
      nameAscii: "laptop",
    });

    // Tạo brands
    const apple = await Brand.create({ name: "Apple" });
    const samsung = await Brand.create({ name: "Samsung" });
    const dell = await Brand.create({ name: "Dell" });

    // Tạo colors
    const colors = await Color.insertMany([
      { name: "Đen", code: "den" },
      { name: "Trắng", code: "trang" },
      { name: "Xanh dương", code: "xanh-duong" },
      { name: "Hồng", code: "hong" },
      { name: "Tím", code: "tim" },
    ]);

    // Tạo memories
    const memories = await Memory.insertMany([
      { ram: "4GB", rom: "64GB", chipset: "Snapdragon 680" },
      { ram: "6GB", rom: "128GB", chipset: "Snapdragon 778G" },
      { ram: "8GB", rom: "256GB", chipset: "Snapdragon 8 Gen 1" },
      { ram: "12GB", rom: "512GB", chipset: "Apple A16 Bionic" },
      { ram: "16GB", rom: "1TB", chipset: "Apple A17 Pro" },
    ]);

    // Tạo sản phẩm iPhone 15
    const iphone15 = await Product.create({
      name: "iPhone 15",
      description: "Điện thoại iPhone 15 mới nhất",
      thumbUrl: "/src/assets/images/ip15.jpg",
      discountPercentage: 5,
      slug: slugify("iPhone 15", { lower: true }),
      basePrice: 25000000,
      brand: apple._id,
      category: phoneCategory._id,
    });

    // Tạo sản phẩm Galaxy S24
    const galaxyS24 = await Product.create({
      name: "Galaxy S24",
      description: "Điện thoại Samsung Galaxy S24 cao cấp",
      thumbUrl: "/src/assets/images/galaxy-s24.jpg",
      discountPercentage: 7,
      slug: slugify("Galaxy S24", { lower: true }),
      basePrice: 21000000,
      brand: samsung._id,
      category: phoneCategory._id,
    });

    // Tạo sản phẩm Dell XPS 13
    const dellXPS = await Product.create({
      name: "Dell XPS 13",
      description: "Laptop Dell XPS 13 mỏng nhẹ, cao cấp",
      thumbUrl: "/src/assets/images/dell-xps13.jpg",
      discountPercentage: 10,
      slug: slugify("Dell XPS 13", { lower: true }),
      basePrice: 32000000,
      brand: dell._id,
      category: laptopCategory._id,
    });

    // Tạo ProductVariants
    const productVariants = await ProductVariant.insertMany([
      // iPhone 15 variants
      {
        productId: iphone15._id,
        memoryId: memories[1]._id, // 6GB/128GB
        colorId: colors[0]._id, // Đen
        stock: 10,
        price: 25000000,
      },
      {
        productId: iphone15._id,
        memoryId: memories[2]._id, // 8GB/256GB
        colorId: colors[1]._id, // Trắng
        stock: 5,
        price: 28000000,
      },
      // Galaxy S24 variants
      {
        productId: galaxyS24._id,
        memoryId: memories[1]._id,
        colorId: colors[2]._id, // Xanh dương
        stock: 20,
        price: 21000000,
      },
      {
        productId: galaxyS24._id,
        memoryId: memories[2]._id,
        colorId: colors[2]._id,
        stock: 18,
        price: 25000000,
      },
      // Dell XPS 13 variants
      {
        productId: dellXPS._id,
        memoryId: memories[3]._id, // 12GB/512GB
        colorId: colors[0]._id, // Đen
        stock: 8,
        price: 32000000,
      },
    ]);

    // Tạo ProductImages
    const productImages = await ProductImage.insertMany([
      {
        name: "iPhone 15 - Ảnh chính",
        productId: iphone15._id,
        imageUrl: "/src/assets/images/ip15.jpg",
        originalName: "ip15-main.jpg",
        fileSize: 1024000,
      },
      {
        name: "Galaxy S24 - Ảnh chính",
        productId: galaxyS24._id,
        imageUrl: "/src/assets/images/galaxy-s24.jpg",
        originalName: "galaxy-s24-main.jpg",
        fileSize: 1200000,
      },
      {
        name: "Dell XPS 13 - Ảnh chính",
        productId: dellXPS._id,
        imageUrl: "/src/assets/images/dell-xps13.jpg",
        originalName: "dell-xps13-main.jpg",
        fileSize: 950000,
      },
    ]);


    // Tạo specification list
    const specs = await Specification.insertMany([
      { specName: "Màn hình" },
      { specName: "Camera" },
      { specName: "Chip" },
      { specName: "RAM & Bộ nhớ" },
      { specName: "Pin" },
      { specName: "Hệ điều hành" },
      { specName: "Trọng lượng" },
      { specName: "Card đồ họa" },
    ]);

    

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

    // Gán specification cho Galaxy S24
    await ProductSpecification.insertMany([
      {
        productId: galaxyS24._id,
        specsId: specs[0]._id,
        specValue: "6.2 inch Dynamic AMOLED",
      },
      {
        productId: galaxyS24._id,
        specsId: specs[1]._id,
        specValue: "50MP + 12MP + 10MP",
      },
      {
        productId: galaxyS24._id,
        specsId: specs[2]._id,
        specValue: "Snapdragon 8 Gen 3",
      },
      {
        productId: galaxyS24._id,
        specsId: specs[3]._id,
        specValue: "8GB RAM + 256GB",
      },
      {
        productId: galaxyS24._id,
        specsId: specs[4]._id,
        specValue: "4000 mAh",
      },
      {
        productId: galaxyS24._id,
        specsId: specs[5]._id,
        specValue: "Android 14",
      },
    ]);

    // Gán specification cho Dell XPS 13
    await ProductSpecification.insertMany([
      {
        productId: dellXPS._id,
        specsId: specs[0]._id,
        specValue: "13.4 inch FHD+",
      },
      {
        productId: dellXPS._id,
        specsId: specs[2]._id,
        specValue: "Intel Core i7-1355U",
      },
      {
        productId: dellXPS._id,
        specsId: specs[3]._id,
        specValue: "16GB RAM + 512GB SSD",
      },
      {
        productId: dellXPS._id,
        specsId: specs[6]._id,
        specValue: "1.2kg",
      },
      {
        productId: dellXPS._id,
        specsId: specs[7]._id,
        specValue: "Intel Iris Xe",
      },
      {
        productId: dellXPS._id,
        specsId: specs[5]._id,
        specValue: "Windows 11",
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
