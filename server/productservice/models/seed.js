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
    
    // Tạo sản phẩm iPhone 15
    const iphone15 = await Product.create({
      name: "iPhone 15",
      description: "Điện thoại Apple iPhone 15",
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

    // Tạo màu sắc
    const colors = await Color.insertMany([
      { name: "Đen", code: "#000000" },
      { name: "Trắng", code: "#FFFFFF" },
      { name: "Xanh", code: "#0000FF" },
      { name: "Hồng", code: "#FFC0CB" },
    ]);

    // Tạo bộ nhớ
    const memories = await Memory.insertMany([
      { ram: "6GB", rom: "128GB", },
      { ram: "6GB", rom: "256GB", },
      { ram: "8GB", rom: "512GB", },
      { ram: "12GB", rom: "512GB",},
    ]);

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

    // Tạo biến thể sản phẩm
    const variants = await ProductVariant.insertMany([
      {
        productId: iphone15._id,
        colorId: colors[0]._id, // Đen
        memoryId: memories[0]._id, // 6GB/128GB
        price: 25000000,
        stock: 50,
      },
      {
        productId: iphone15._id,
        colorId: colors[0]._id, // Đen
        memoryId: memories[1]._id, // 6GB/256GB
        price: 28000000,
        stock: 30,
      },
      {
        productId: iphone15._id,
        colorId: colors[1]._id, // Trắng
        memoryId: memories[0]._id, // 6GB/128GB
        price: 25000000,
        stock: 45,
      },
      {
        productId: iphone15._id,
        colorId: colors[1]._id, // Trắng
        memoryId: memories[1]._id, // 6GB/256GB
        price: 28000000,
        stock: 35,
      },
      {
        productId: iphone15._id,
        colorId: colors[2]._id, // Xanh
        memoryId: memories[0]._id, // 6GB/128GB
        price: 25000000,
        stock: 40,
      },
      {
        productId: iphone15._id,
        colorId: colors[3]._id, // Hồng
        memoryId: memories[0]._id, // 6GB/128GB
        price: 25000000,
        stock: 25,
      },
      {
        productId: iphone15._id,
        colorId: colors[3]._id, // Hồng
        memoryId: memories[1]._id, // 6GB/256GB
        price: 28000000,
        stock: 20,
      },
    ]);

    // Tạo hình ảnh sản phẩm với đường dẫn local và liên kết với màu sắc
    await ProductImage.insertMany([
      // Ảnh iPhone màu đen
      {
        productId: iphone15._id,
        colorId: colors[0]._id, // Đen
        name: "iPhone 15 Đen - Mặt trước",
        imageUrl: "/src/assets/images/ip15.jpg",
        originalName: "iphone15.jpg",
        fileSize: 1024,
      },
      {
        productId: iphone15._id,
        colorId: colors[0]._id, // Đen
        name: "iPhone 15 Đen - Mặt sau",
        imageUrl: "/src/assets/images/ip15_back.jpg",
        originalName: "iphone15_back.jpg",
        fileSize: 1024,
      },
      {
        productId: iphone15._id,
        colorId: colors[0]._id, // Đen
        name: "iPhone 15 Đen - Cạnh bên",
        imageUrl: "/src/assets/images/ip15_ben.jpg",
        originalName: "iphone15_ben.jpg",
        fileSize: 1024,
      },
      
      // Ảnh iPhone màu trắng
      {
        productId: iphone15._id,
        colorId: colors[1]._id, // Trắng
        name: "iPhone 15 Trắng - Mặt trước",
        imageUrl: "/src/assets/images/ip15_trang_truoc1.jpg",
        originalName: "ip15_trang_truoc1.jpg",
        fileSize: 1024,
      },
      {
        productId: iphone15._id,
        colorId: colors[1]._id, // Trắng
        name: "iPhone 15 Trắng - Mặt sau",
        imageUrl: "/src/assets/images/ip15_trang_sau.jpg",
        originalName: "ip15_trang_sau.jpg",
        fileSize: 1024,
      },
      {
        productId: iphone15._id,
        colorId: colors[1]._id, // Trắng
        name: "iPhone 15 Trắng - Cạnh bên",
        imageUrl: "/src/assets/images/ip15_trang_ben.jpg",
        originalName: "ip15_trang_ben.jpg",
        fileSize: 1024,
      },
      
      // Ảnh iPhone màu xanh
      {
        productId: iphone15._id,
        colorId: colors[2]._id, // Xanh
        name: "iPhone 15 Xanh - Mặt trước",
        imageUrl: "/src/assets/images/ip15_xanh.jpg",
        originalName: "ip15_xanh.jpg",
        fileSize: 1024,
      },
      {
        productId: iphone15._id,
        colorId: colors[2]._id, // Xanh
        name: "iPhone 15 Xanh - Mặt sau",
        imageUrl: "/src/assets/images/ip15_xanh_sau.jpg",
        originalName: "ip15_xanh_sau.jpg",
        fileSize: 1024,
      },
      {
        productId: iphone15._id,
        colorId: colors[2]._id, // Xanh
        name: "iPhone 15 Xanh - Cạnh bên",
        imageUrl: "/src/assets/images/ip15_xanh.jpg",
        originalName: "ip15_xanh.jpg",
        fileSize: 1024,
      },
      
      // Ảnh iPhone màu hồng
      {
        productId: iphone15._id,
        colorId: colors[3]._id, // Hồng
        name: "iPhone 15 Hồng - Mặt trước",
        imageUrl: "/src/assets/images/ip15_hong_truoc.jpg",
        originalName: "ip15_hong_truoc.jpg",
        fileSize: 1024,
      },
      {
        productId: iphone15._id,
        colorId: colors[3]._id, // Hồng
        name: "iPhone 15 Hồng - Mặt sau",
        imageUrl: "/src/assets/images/ip15_hong_sau1.jpg",
        originalName: "ip15_hong_sau1.jpg",
        fileSize: 1024,
      },
      {
        productId: iphone15._id,
        colorId: colors[3]._id, // Hồng
        name: "iPhone 15 Hồng - Cạnh bên",
        imageUrl: "/src/assets/images/ip15_hong_ben.jpg",
        originalName: "ip15_hong_ben.jpg",
        fileSize: 1024,
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
