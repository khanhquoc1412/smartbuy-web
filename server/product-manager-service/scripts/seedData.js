const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Brand = require('../src/models/brand');
const Category = require('../src/models/category');
const Color = require('../src/models/color');
const Memory = require('../src/models/memory');
const Product = require('../src/models/product');
const ProductVariant = require('../src/models/product_variant');
const ProductImage = require('../src/models/product_image');
const Specification = require('../src/models/specification');
const ProductSpecification = require('../src/models/product_specification');

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/products_phone_shop', {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Seed data
const seedData = async () => {
  try {
    console.log('🌱 Starting data seeding...');

    // Clear existing data
    await Brand.deleteMany({});
    await Category.deleteMany({});
    await Color.deleteMany({});
    await Memory.deleteMany({});
    await Product.deleteMany({});
    await ProductVariant.deleteMany({});
    await ProductImage.deleteMany({});
    await Specification.deleteMany({});
    await ProductSpecification.deleteMany({});

    // 1. Seed Brands
    const brands = await Brand.insertMany([
      {
        name: 'Apple',
        description: 'Thương hiệu điện thoại cao cấp từ Mỹ'
      },
      {
        name: 'Samsung',
        description: 'Thương hiệu điện thoại hàng đầu từ Hàn Quốc'
      },
      {
        name: 'Xiaomi',
        description: 'Thương hiệu điện thoại giá rẻ từ Trung Quốc'
      },
      {
        name: 'OPPO',
        description: 'Thương hiệu điện thoại chụp ảnh tốt từ Trung Quốc'
      },
      {
        name: 'Vivo',
        description: 'Thương hiệu điện thoại selfie tốt từ Trung Quốc'
      }
    ]);
    console.log('✅ Brands seeded');

    // 2. Seed Categories
    const categories = await Category.insertMany([
      {
        name: 'Điện thoại',
        nameAscii: 'dien-thoai'
      },
      {
        name: 'Phụ kiện điện thoại',
        nameAscii: 'phu-kien-dien-thoai'
      },
      {
        name: 'Đồng hồ thông minh',
        nameAscii: 'dong-ho-thong-minh'
      }
    ]);
    console.log('✅ Categories seeded');

    // 3. Seed Colors
    const colors = await Color.insertMany([
      {
        name: 'Đen',
        code: 'den',
        description: 'Màu đen cổ điển, sang trọng'
      },
      {
        name: 'Trắng',
        code: 'trang',
        description: 'Màu trắng tinh khiết, hiện đại'
      },
      {
        name: 'Xanh dương',
        code: 'xanh-duong',
        description: 'Màu xanh dương năng động, trẻ trung'
      },
      {
        name: 'Hồng',
        code: 'hong',
        description: 'Màu hồng nữ tính, dễ thương'
      },
      {
        name: 'Tím',
        code: 'tim',
        description: 'Màu tím bí ẩn, quyến rũ'
      }
    ]);
    console.log('✅ Colors seeded');

    // 4. Seed Memories
    const memories = await Memory.insertMany([
      {
        ram: '4GB',
        rom: '64GB',
        chipset: 'Snapdragon 680'
      },
      {
        ram: '6GB',
        rom: '128GB',
        chipset: 'Snapdragon 778G'
      },
      {
        ram: '8GB',
        rom: '256GB',
        chipset: 'Snapdragon 8 Gen 1'
      },
      {
        ram: '12GB',
        rom: '512GB',
        chipset: 'Apple A16 Bionic'
      },
      {
        ram: '16GB',
        rom: '1TB',
        chipset: 'Apple A17 Pro'
      }
    ]);
    console.log('✅ Memories seeded');

    // 5. Seed Specifications
    const specifications = await Specification.insertMany([
      {
        specName: 'Màn hình'
      },
      {
        specName: 'Camera chính'
      },
      {
        specName: 'Camera selfie'
      },
      {
        specName: 'Chip xử lý'
      },
      {
        specName: 'RAM'
      },
      {
        specName: 'Pin'
      },
      {
        specName: 'Hệ điều hành'
      }
    ]);
    console.log('✅ Specifications seeded');

    // 6. Seed Products
    const products = await Product.insertMany([
      {
        name: 'iPhone 14',
        description: 'Điện thoại Apple iPhone 14 với chip A15 Bionic mạnh mẽ',
        thumbUrl: 'https://res.cloudinary.com/your_cloud/image/upload/iphone14.jpg',
        discountPercentage: 5,
        slug: 'iphone-14',
        basePrice: 25000000,
        brand: brands[0]._id, // Apple
        category: categories[0]._id // Điện thoại
      },
      {
        name: 'iPhone 14 Pro',
        description: 'Điện thoại Apple iPhone 14 Pro với camera 48MP',
        thumbUrl: 'https://res.cloudinary.com/your_cloud/image/upload/iphone14pro.jpg',
        discountPercentage: 0,
        slug: 'iphone-14-pro',
        basePrice: 32000000,
        brand: brands[0]._id, // Apple
        category: categories[0]._id // Điện thoại
      },
      {
        name: 'Samsung Galaxy S23',
        description: 'Điện thoại Samsung Galaxy S23 với camera 50MP',
        thumbUrl: 'https://res.cloudinary.com/your_cloud/image/upload/galaxy-s23.jpg',
        discountPercentage: 10,
        slug: 'samsung-galaxy-s23',
        basePrice: 22000000,
        brand: brands[1]._id, // Samsung
        category: categories[0]._id // Điện thoại
      },
      {
        name: 'Xiaomi Redmi Note 12',
        description: 'Điện thoại Xiaomi Redmi Note 12 giá rẻ, hiệu năng tốt',
        thumbUrl: 'https://res.cloudinary.com/your_cloud/image/upload/redmi-note-12.jpg',
        discountPercentage: 15,
        slug: 'xiaomi-redmi-note-12',
        basePrice: 5000000,
        brand: brands[2]._id, // Xiaomi
        category: categories[0]._id // Điện thoại
      }
    ]);
    console.log('✅ Products seeded');

    // 7. Seed Product Variants
    const productVariants = await ProductVariant.insertMany([
      // iPhone 14 variants
      {
        productId: products[0]._id,
        memoryId: memories[1]._id, // 128GB
        colorId: colors[0]._id, // Đen
        stock: 10,
        price: 25000000
      },
      {
        productId: products[0]._id,
        memoryId: memories[1]._id, // 128GB
        colorId: colors[1]._id, // Trắng
        stock: 5,
        price: 25000000
      },
      {
        productId: products[0]._id,
        memoryId: memories[2]._id, // 256GB
        colorId: colors[0]._id, // Đen
        stock: 8,
        price: 28000000
      },
      // iPhone 14 Pro variants
      {
        productId: products[1]._id,
        memoryId: memories[2]._id, // 256GB
        colorId: colors[0]._id, // Đen
        stock: 15,
        price: 32000000
      },
      {
        productId: products[1]._id,
        memoryId: memories[2]._id, // 256GB
        colorId: colors[1]._id, // Trắng
        stock: 12,
        price: 32000000
      },
      // Samsung Galaxy S23 variants
      {
        productId: products[2]._id,
        memoryId: memories[1]._id, // 128GB
        colorId: colors[2]._id, // Xanh dương
        stock: 20,
        price: 22000000
      },
      {
        productId: products[2]._id,
        memoryId: memories[2]._id, // 256GB
        colorId: colors[2]._id, // Xanh dương
        stock: 18,
        price: 25000000
      },
      // Xiaomi Redmi Note 12 variants
      {
        productId: products[3]._id,
        memoryId: memories[0]._id, // 64GB
        colorId: colors[0]._id, // Đen
        stock: 25,
        price: 5000000
      },
      {
        productId: products[3]._id,
        memoryId: memories[1]._id, // 128GB
        colorId: colors[3]._id, // Hồng
        stock: 30,
        price: 5500000
      }
    ]);
    console.log('✅ Product Variants seeded');

    // 8. Seed Product Images
    const productImages = await ProductImage.insertMany([
      {
        name: 'iPhone 14 - Ảnh chính',
        productId: products[0]._id,
        imageUrl: 'https://res.cloudinary.com/your_cloud/image/upload/iphone14-1.jpg',
        originalName: 'iphone14-main.jpg',
        fileSize: 1024000
      },
      {
        name: 'iPhone 14 - Ảnh phụ',
        productId: products[0]._id,
        imageUrl: 'https://res.cloudinary.com/your_cloud/image/upload/iphone14-2.jpg',
        originalName: 'iphone14-side.jpg',
        fileSize: 987000
      },
      {
        name: 'iPhone 14 Pro - Ảnh chính',
        productId: products[1]._id,
        imageUrl: 'https://res.cloudinary.com/your_cloud/image/upload/iphone14pro-1.jpg',
        originalName: 'iphone14pro-main.jpg',
        fileSize: 1150000
      },
      {
        name: 'Samsung Galaxy S23 - Ảnh chính',
        productId: products[2]._id,
        imageUrl: 'https://res.cloudinary.com/your_cloud/image/upload/galaxy-s23-1.jpg',
        originalName: 'galaxy-s23-main.jpg',
        fileSize: 1200000
      },
      {
        name: 'Xiaomi Redmi Note 12 - Ảnh chính',
        productId: products[3]._id,
        imageUrl: 'https://res.cloudinary.com/your_cloud/image/upload/redmi-note-12-1.jpg',
        originalName: 'redmi-note12-main.jpg',
        fileSize: 950000
      }
    ]);
    console.log('✅ Product Images seeded');

    // 9. Seed Product Specifications
    const productSpecifications = await ProductSpecification.insertMany([
      // iPhone 14 specifications
      {
        productId: products[0]._id,
        specsId: specifications[0]._id, // Màn hình
        specValue: '6.1 inch Super Retina XDR'
      },
      {
        productId: products[0]._id,
        specsId: specifications[1]._id, // Camera chính
        specValue: '12MP Dual Camera'
      },
      {
        productId: products[0]._id,
        specsId: specifications[2]._id, // Camera selfie
        specValue: '12MP TrueDepth'
      },
      {
        productId: products[0]._id,
        specsId: specifications[3]._id, // Chip xử lý
        specValue: 'A15 Bionic'
      },
      {
        productId: products[0]._id,
        specsId: specifications[4]._id, // RAM
        specValue: '6GB'
      },
      {
        productId: products[0]._id,
        specsId: specifications[5]._id, // Pin
        specValue: '3279 mAh'
      },
      {
        productId: products[0]._id,
        specsId: specifications[6]._id, // Hệ điều hành
        specValue: 'iOS 16'
      },
      // iPhone 14 Pro specifications
      {
        productId: products[1]._id,
        specsId: specifications[0]._id, // Màn hình
        specValue: '6.1 inch Super Retina XDR ProMotion'
      },
      {
        productId: products[1]._id,
        specsId: specifications[1]._id, // Camera chính
        specValue: '48MP Main + 12MP Ultra Wide + 12MP Telephoto'
      },
      {
        productId: products[1]._id,
        specsId: specifications[3]._id, // Chip xử lý
        specValue: 'A16 Bionic'
      },
      {
        productId: products[1]._id,
        specsId: specifications[4]._id, // RAM
        specValue: '6GB'
      },
      {
        productId: products[1]._id,
        specsId: specifications[5]._id, // Pin
        specValue: '3200 mAh'
      },
      {
        productId: products[1]._id,
        specsId: specifications[6]._id, // Hệ điều hành
        specValue: 'iOS 16'
      }
    ]);
    console.log('✅ Product Specifications seeded');

    console.log('✅ All data seeded successfully!');
    console.log(`📊 Created: ${brands.length} brands, ${categories.length} categories, ${colors.length} colors, ${memories.length} memories, ${products.length} products, ${productVariants.length} variants`);

  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
    throw error;
  }
};

// Main execution
const main = async () => {
  try {
    await connectDB();
    await seedData();
    console.log('📦 Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { connectDB, seedData };
