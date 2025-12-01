require('dotenv').config();
const mongoose = require('mongoose');
const readline = require('readline');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartbuy_db_order';

// Import models
const Order = require('../src/models/Order');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function clearDatabase() {
  try {
    console.log('🔄 Đang kết nối MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Đã kết nối MongoDB:', MONGODB_URI);
    console.log('');

    // Đếm số lượng documents trước khi xóa
    const orderCount = await Order.countDocuments();
    
    console.log('📊 THỐNG KÊ DATABASE HIỆN TẠI:');
    console.log('=====================================');
    console.log(`Số lượng đơn hàng: ${orderCount}`);
    console.log('=====================================');
    console.log('');

    if (orderCount === 0) {
      console.log('ℹ️  Database đã trống, không có gì để xóa!');
      await mongoose.disconnect();
      process.exit(0);
    }

    // Xác nhận trước khi xóa
    rl.question('⚠️  BẠN CÓ CHẮC CHẮN MUỐN XÓA TOÀN BỘ DỮ LIỆU? (nhập "YES" để xác nhận): ', async (answer) => {
      if (answer.trim().toUpperCase() === 'YES') {
        console.log('');
        console.log('🗑️  Đang xóa toàn bộ dữ liệu...');
        
        // Xóa tất cả orders
        const deleteResult = await Order.deleteMany({});
        
        console.log('');
        console.log('✅ ĐÃ XÓA THÀNH CÔNG!');
        console.log('=====================================');
        console.log(`Đã xóa ${deleteResult.deletedCount} đơn hàng`);
        console.log('=====================================');
        console.log('');
        console.log('💡 Database order-manager-service đã được xóa sạch!');
        console.log('💡 Bạn có thể chạy seed script để tạo dữ liệu mới:');
        console.log('   node scripts/seedWithRealProducts.js');
        
      } else {
        console.log('');
        console.log('❌ Hủy bỏ thao tác xóa database');
      }
      
      console.log('');
      console.log('🔌 Đang đóng kết nối MongoDB...');
      await mongoose.disconnect();
      console.log('✅ Đã đóng kết nối');
      rl.close();
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    await mongoose.disconnect();
    rl.close();
    process.exit(1);
  }
}

// Xử lý Ctrl+C
process.on('SIGINT', async () => {
  console.log('\n\n❌ Đã hủy bỏ thao tác');
  await mongoose.disconnect();
  rl.close();
  process.exit(0);
});

clearDatabase();
