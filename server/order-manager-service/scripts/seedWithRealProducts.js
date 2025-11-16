require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('../src/models/Order');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartbuy_db_order';

// Real user IDs from user-manager-service database (with real emails for testing email notifications)
const realUserIds = [
  '690e335cc652340b3d8ab0d7',  // P_ Senpai - phapn460@gmail.com (Admin)
  '690e37e853bac02db0034938',  // Huy Nguyen - huy056614@gmail.com
  '6918a080d0cf402360e77001',  // Phap203 - phapn203@gmail.com
  '6918a0acd0cf402360e77013'   // Phapb2104818 - phapb2104818@student.ctu.edu.vn
];

// User info for matching addresses (from real database)
const userInfo = [
  { id: '690e335cc652340b3d8ab0d7', name: 'P_ Senpai', email: 'phapn460@gmail.com' },
  { id: '690e37e853bac02db0034938', name: 'Huy Nguyen', email: 'huy056614@gmail.com' },
  { id: '6918a080d0cf402360e77001', name: 'Phap203', email: 'phapn203@gmail.com' },
  { id: '6918a0acd0cf402360e77013', name: 'Phapb2104818', email: 'phapb2104818@student.ctu.edu.vn' }
];

// Load real data from product-manager-service database
const loadProductData = () => {
  const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'smartbuy_db_product.products.json'), 'utf8'));
  const variants = JSON.parse(fs.readFileSync(path.join(__dirname, 'smartbuy_db_product.productvariants.json'), 'utf8'));
  const colors = JSON.parse(fs.readFileSync(path.join(__dirname, 'smartbuy_db_product.colors.json'), 'utf8'));
  const memories = JSON.parse(fs.readFileSync(path.join(__dirname, 'smartbuy_db_product.memories.json'), 'utf8'));
  const images = JSON.parse(fs.readFileSync(path.join(__dirname, 'smartbuy_db_product.productimages.json'), 'utf8'));

  // Create lookup maps
  const colorMap = {};
  colors.forEach(c => {
    colorMap[c._id.$oid] = c.name;
  });

  const memoryMap = {};
  memories.forEach(m => {
    memoryMap[m._id.$oid] = `${m.ram || ''} ${m.rom || ''}`.trim();
  });

  const productMap = {};
  products.forEach(p => {
    productMap[p._id.$oid] = p;
  });

  const imageMap = {};
  images.forEach(img => {
    const key = `${img.productId.$oid}_${img.colorId.$oid}`;
    if (!imageMap[key]) {
      imageMap[key] = [];
    }
    imageMap[key].push(img.imageUrl);
  });

  // Build product list with real variant IDs
  const productList = [];
  
  // Take first 30 variants to avoid too many products
  variants.slice(0, 30).forEach(variant => {
    const productId = variant.productId.$oid;
    const product = productMap[productId];
    
    if (!product || variant.stock === 0) return; // Skip if no product or out of stock
    
    const colorId = variant.colorId.$oid;
    const memoryId = variant.memoryId.$oid;
    const colorName = colorMap[colorId] || 'N/A';
    const memoryName = memoryMap[memoryId] || 'N/A';
    
    const imageKey = `${productId}_${colorId}`;
    const productImages = imageMap[imageKey] || [];
    const imageUrl = productImages[0] || product.thumbUrl || '';

    productList.push({
      variantId: variant._id.$oid,  // This is the real variant ID from database
      productId: productId,
      name: product.name,
      price: variant.price,
      image: imageUrl,
      stock: variant.stock,
      color: colorName,
      memory: memoryName
    });
  });

  return productList;
};

// Sample addresses (matching real user names)
const sampleAddresses = [
  {
    fullName: 'P_ Senpai',
    phone: '0901234567',
    province: 'Thành phố Hồ Chí Minh',
    district: 'Quận 1',
    ward: 'Phường Bến Nghé',
    address: '123 Nguyễn Huệ'
  },
  {
    fullName: 'Huy Nguyen',
    phone: '0912345678',
    province: 'Hà Nội',
    district: 'Quận Hoàn Kiếm',
    ward: 'Phường Hàng Bạc',
    address: '456 Hàng Bạc'
  },
  {
    fullName: 'Phap203',
    phone: '0923456789',
    province: 'Đà Nẵng',
    district: 'Quận Hải Châu',
    ward: 'Phường Thạch Thang',
    address: '789 Lê Duẩn'
  },
  {
    fullName: 'Phapb2104818',
    phone: '0934567890',
    province: 'Thành phố Cần Thơ',
    district: 'Quận Ninh Kiều',
    ward: 'Phường An Hòa',
    address: '321 Đại học Cần Thơ'
  }
];

// Order statuses to distribute
const orderStatuses = [
  'pending',
  'confirmed',
  'processing',
  'ready_to_ship',
  'shipping',
  'delivered',
  'completed',
  'cancelled'
];

const paymentMethods = ['COD', 'VNPAY', 'MOMO', 'ZALOPAY'];
const paymentStatuses = ['unpaid', 'paid', 'failed'];

// Status labels in Vietnamese
const statusLabelsVi = {
  pending: 'chờ xác nhận',
  confirmed: 'đã xác nhận',
  processing: 'đang chuẩn bị',
  ready_to_ship: 'sẵn sàng giao',
  shipping: 'đang giao',
  delivered: 'đã giao',
  completed: 'hoàn thành',
  cancelled: 'đã hủy',
  pending_payment: 'chờ thanh toán',
  payment_failed: 'thanh toán thất bại',
  returned: 'đã trả hàng'
};

// Helper function to get random item from array
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Helper function to get random number in range
const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper function to generate random date within last 30 days
const randomDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - randomNumber(0, daysAgo));
  date.setHours(randomNumber(8, 20), randomNumber(0, 59), randomNumber(0, 59));
  return date;
};

// Generate sample orders
const generateOrders = (count, realProducts) => {
  const orders = [];

  for (let i = 0; i < count; i++) {
    const createdAt = randomDate(30);
    const status = randomItem(orderStatuses);
    const paymentMethod = randomItem(paymentMethods);
    
    // Logic thanh toán chuẩn:
    // - COD: chỉ paid khi completed, còn lại unpaid
    // - Online: completed/delivered phải paid, còn lại random
    let paymentStatus;
    if (paymentMethod === 'COD') {
      paymentStatus = status === 'completed' ? 'paid' : 'unpaid';
    } else {
      // Online payment
      if (['completed', 'delivered'].includes(status)) {
        paymentStatus = 'paid'; // Đã giao/hoàn thành phải đã thanh toán
      } else if (status === 'cancelled') {
        paymentStatus = 'failed'; // Hủy thì thanh toán thất bại
      } else {
        paymentStatus = randomItem(['unpaid', 'paid']); // Các trạng thái khác random
      }
    }

    // Generate 1-3 items per order
    const itemCount = randomNumber(1, 3);
    const orderItems = [];
    let itemsPrice = 0;

    for (let j = 0; j < itemCount; j++) {
      const product = randomItem(realProducts);
      const qty = randomNumber(1, 2);
      const price = product.price;

      orderItems.push({
        product: product.variantId,  // Use real variant ID
        name: product.name,
        qty,
        price,
        image: product.image,
        variant: {
          color: product.color,
          memory: product.memory
        }
      });

      itemsPrice += price * qty;
    }

    const shippingPrice = itemsPrice > 10000000 ? 0 : 30000;
    const discountAmount = Math.random() > 0.7 ? Math.floor(itemsPrice * 0.1) : 0;
    const totalPrice = itemsPrice + shippingPrice - discountAmount;

    // Generate status history based on current status
    const statusHistory = [];
    const statusFlow = ['pending', 'confirmed', 'processing', 'ready_to_ship', 'shipping', 'delivered', 'completed'];
    const currentStatusIndex = statusFlow.indexOf(status);

    if (currentStatusIndex >= 0) {
      for (let k = 0; k <= currentStatusIndex; k++) {
        const historyDate = new Date(createdAt);
        historyDate.setHours(historyDate.getHours() + k * 2);
        statusHistory.push({
          status: statusFlow[k],
          note: `Đơn hàng ${statusLabelsVi[statusFlow[k]]}`,
          timestamp: historyDate
        });
      }
    } else if (status === 'cancelled') {
      statusHistory.push({
        status: 'pending',
        note: 'Đơn hàng chờ xác nhận',
        timestamp: createdAt
      });
      const cancelDate = new Date(createdAt);
      cancelDate.setHours(cancelDate.getHours() + 1);
      statusHistory.push({
        status: 'cancelled',
        note: 'Đơn hàng đã hủy - Khách hàng đổi ý',
        timestamp: cancelDate
      });
    }

    const userIndex = i % realUserIds.length;
    const userId = realUserIds[userIndex];
    const address = sampleAddresses[userIndex];

    orders.push({
      user: userId,  // Changed from userId to user
      orderItems,
      shippingAddress: address,
      paymentMethod,
      paymentStatus,
      status: status,
      itemsPrice,
      shippingPrice,
      discountAmount,
      totalPrice,
      statusHistory,
      createdAt,
      updatedAt: createdAt
    });
  }

  return orders;
};

// Main seeding function
const seedDatabase = async () => {
  try {
    console.log('🔄 Đang kết nối MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Đã kết nối MongoDB');

    console.log('🔄 Đang xóa dữ liệu cũ...');
    await Order.deleteMany({});
    console.log('✅ Đã xóa dữ liệu cũ');

    console.log('🔄 Đang load dữ liệu sản phẩm từ product-manager-service...');
    const realProducts = loadProductData();
    console.log(`✅ Đã load ${realProducts.length} sản phẩm thật từ database`);

    console.log('🔄 Đang tạo đơn hàng mẫu...');
    const orders = generateOrders(50, realProducts); // Create 50 sample orders
    
    console.log('🔄 Đang lưu đơn hàng vào database...');
    const createdOrders = await Order.insertMany(orders);
    console.log(`✅ Đã tạo ${createdOrders.length} đơn hàng`);

    // Add orderNumber to all orders using static method
    console.log('🔄 Đang tạo orderNumber cho các đơn hàng...');
    const ordersWithNumbers = await Order.find({}).lean();
    const ordersWithOrderNumbers = Order.addOrderNumbers(ordersWithNumbers);
    
    console.log('✅ Đã tạo orderNumber thành công');

    // Statistics
    const stats = {
      totalOrders: createdOrders.length,
      byStatus: {},
      byPaymentStatus: {},
      totalRevenue: 0
    };

    ordersWithOrderNumbers.forEach(order => {
      stats.byStatus[order.status] = (stats.byStatus[order.status] || 0) + 1;
      stats.byPaymentStatus[order.paymentStatus] = (stats.byPaymentStatus[order.paymentStatus] || 0) + 1;
      if (order.paymentStatus === 'paid') {
        stats.totalRevenue += order.totalPrice;
      }
    });

    console.log('\n📊 THỐNG KÊ:');
    console.log('=====================================');
    console.log(`Tổng số đơn hàng: ${stats.totalOrders}`);
    console.log('\nTheo trạng thái đơn hàng:');
    Object.entries(stats.byStatus).forEach(([status, count]) => {
      console.log(`  ${statusLabelsVi[status]}: ${count}`);
    });
    console.log('\nTheo trạng thái thanh toán:');
    Object.entries(stats.byPaymentStatus).forEach(([status, count]) => {
      console.log(`  ${status}: ${count}`);
    });
    console.log(`\nTổng doanh thu (đã thanh toán): ${stats.totalRevenue.toLocaleString('vi-VN')} VNĐ`);
    console.log('=====================================\n');

    console.log('✅ Seed database thành công!');
    console.log('\n💡 LƯU Ý: Các đơn hàng đã sử dụng variant ID thật từ product-manager-service');
    console.log('💡 Bây giờ bạn có thể test chức năng trừ/cộng kho khi đặt hàng và hủy hàng!');
    
  } catch (error) {
    console.error('❌ Lỗi khi seed database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Đã đóng kết nối MongoDB');
  }
};

// Run seeding
seedDatabase();
