require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('../src/models/Order');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartbuy_db_order';

// Sample user IDs (you should replace with real user IDs from your user service)
const sampleUserIds = [
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId()
];

// Sample product IDs (you should replace with real product IDs from your product service)
const sampleProducts = [
  {
    id: new mongoose.Types.ObjectId(),
    name: 'iPhone 15 Pro Max',
    price: 29990000,
    image: 'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-1.jpg',
    variant: { color: 'Titan Xanh', memory: '256GB' }
  },
  {
    id: new mongoose.Types.ObjectId(),
    name: 'Samsung Galaxy S24 Ultra',
    price: 26990000,
    image: 'https://cdn.tgdd.vn/Products/Images/42/320126/samsung-galaxy-s24-ultra-grey-1.jpg',
    variant: { color: 'Xám', memory: '256GB' }
  },
  {
    id: new mongoose.Types.ObjectId(),
    name: 'MacBook Pro 14" M3',
    price: 49990000,
    image: 'https://cdn.tgdd.vn/Products/Images/44/309020/macbook-pro-14-m3-2023-1.jpg',
    variant: { color: 'Xám', memory: '512GB' }
  },
  {
    id: new mongoose.Types.ObjectId(),
    name: 'iPad Pro M2 11"',
    price: 22990000,
    image: 'https://cdn.tgdd.vn/Products/Images/522/325530/ipad-pro-m2-11-wifi-128gb-2024-1.jpg',
    variant: { color: 'Bạc', memory: '128GB' }
  },
  {
    id: new mongoose.Types.ObjectId(),
    name: 'AirPods Pro 2',
    price: 6490000,
    image: 'https://cdn.tgdd.vn/Products/Images/54/289781/airpods-pro-2-1.jpg',
    variant: { color: 'Trắng', memory: null }
  }
];

// Sample addresses
const sampleAddresses = [
  {
    fullName: 'Nguyễn Văn An',
    phone: '0901234567',
    province: 'Thành phố Hồ Chí Minh',
    district: 'Quận 1',
    ward: 'Phường Bến Nghé',
    address: '123 Nguyễn Huệ'
  },
  {
    fullName: 'Trần Thị Bình',
    phone: '0912345678',
    province: 'Hà Nội',
    district: 'Quận Hoàn Kiếm',
    ward: 'Phường Hàng Bạc',
    address: '456 Hàng Bạc'
  },
  {
    fullName: 'Lê Minh Cường',
    phone: '0923456789',
    province: 'Đà Nẵng',
    district: 'Quận Hải Châu',
    ward: 'Phường Thạch Thang',
    address: '789 Lê Duẩn'
  },
  {
    fullName: 'Phạm Thị Dung',
    phone: '0934567890',
    province: 'Thành phố Hồ Chí Minh',
    district: 'Quận 3',
    ward: 'Phường Võ Thị Sáu',
    address: '321 Võ Văn Tần'
  },
  {
    fullName: 'Hoàng Văn Em',
    phone: '0945678901',
    province: 'Cần Thơ',
    district: 'Quận Ninh Kiều',
    ward: 'Phường An Hòa',
    address: '654 Mậu Thân'
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
const generateOrders = (count) => {
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
      const product = randomItem(sampleProducts);
      const qty = randomNumber(1, 2);
      const price = product.price;

      orderItems.push({
        product: product.id,
        name: product.name,
        qty,
        price,
        image: product.image,
        variant: product.variant
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
        historyDate.setHours(historyDate.getHours() + k);
        
        statusHistory.push({
          status: statusFlow[k],
          timestamp: historyDate,
          actorType: k === 0 ? 'system' : 'admin',
          note: k === 0 ? 'Đơn hàng được tạo' : `Chuyển sang ${statusLabelsVi[statusFlow[k]] || statusFlow[k]}`
        });
      }
    } else if (status === 'cancelled') {
      statusHistory.push({
        status: 'pending',
        timestamp: createdAt,
        actorType: 'system',
        note: 'Đơn hàng được tạo'
      });
      const cancelDate = new Date(createdAt);
      cancelDate.setHours(cancelDate.getHours() + 1);
      statusHistory.push({
        status: 'cancelled',
        timestamp: cancelDate,
        actorType: 'user',
        note: 'Khách hàng hủy đơn'
      });
    }

    const order = {
      user: randomItem(sampleUserIds),
      orderItems,
      shippingAddress: randomItem(sampleAddresses),
      paymentMethod,
      paymentStatus,
      paymentResult: paymentStatus === 'paid' && paymentMethod !== 'COD' ? {
        transactionId: `TXN${Date.now()}${randomNumber(1000, 9999)}`,
        paymentGateway: paymentMethod,
        status: 'SUCCESS',
        paidAt: createdAt,
        amount: totalPrice
      } : undefined,
      itemsPrice,
      shippingPrice,
      discountAmount,
      couponCode: discountAmount > 0 ? 'SAVE10' : undefined,
      totalPrice,
      status,
      statusHistory,
      shippingInfo: ['shipping', 'delivered', 'completed'].includes(status) ? {
        carrier: randomItem(['Giao Hàng Nhanh', 'Viettel Post', 'J&T Express']),
        trackingNumber: `TRK${Date.now()}${randomNumber(1000, 9999)}`,
        shippingMethod: 'Express'
      } : undefined,
      notes: Math.random() > 0.8 ? 'Giao hàng giờ hành chính' : undefined,
      cancelReason: status === 'cancelled' ? 'Khách hàng đổi ý' : undefined,
      createdAt,
      updatedAt: createdAt
    };

    orders.push(order);
  }

  return orders;
};

// Main seed function
const seedOrders = async () => {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing orders
    console.log('🗑️  Clearing existing orders...');
    await Order.deleteMany({});
    console.log('✅ Cleared existing orders');

    // Generate and insert orders
    console.log('🌱 Generating sample orders...');
    const orders = generateOrders(50); // Generate 50 sample orders
    
    console.log('💾 Inserting orders...');
    await Order.insertMany(orders);
    console.log(`✅ Successfully inserted ${orders.length} orders`);

    // Display statistics
    const stats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    console.log('\n📊 Order Statistics:');
    stats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} orders`);
    });

    const totalRevenue = await Order.aggregate([
      {
        $match: {
          status: 'completed',
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalPrice' }
        }
      }
    ]);

    if (totalRevenue.length > 0) {
      console.log(`\n💰 Total Revenue: ${totalRevenue[0].total.toLocaleString('vi-VN')} VND`);
    }

    console.log('\n✅ Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding orders:', error);
    process.exit(1);
  }
};

// Run seed
seedOrders();
