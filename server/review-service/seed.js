// Seed data for review service testing
const mongoose = require('mongoose');
require('dotenv').config();

const Review = require('./src/models/review');

const sampleReviews = [
  {
    userId: 'user_001',
    productId: 'product_001',
    productName: 'iPhone 15 Pro Max',
    rating: 5,
    comment: 'Sản phẩm tuyệt vời! Pin trâu, camera cực đỉnh. Màn hình sáng, mượt mà. Rất đáng mua!',
    userName: 'Nguyễn Văn A',
    images: ['https://picsum.photos/400/300?random=1', 'https://picsum.photos/400/300?random=2'],
    helpfulCount: 15,
    isVisible: true
  },
  {
    userId: 'user_002',
    productId: 'product_001',
    productName: 'iPhone 15 Pro Max',
    rating: 4,
    comment: 'Máy đẹp, chạy nhanh. Tuy nhiên giá hơi cao so với mặt bằng chung. Camera chụp đêm rất đẹp.',
    userName: 'Trần Thị B',
    images: [],
    helpfulCount: 8,
    isVisible: true
  },
  {
    userId: 'user_003',
    productId: 'product_002',
    productName: 'Samsung Galaxy S24 Ultra',
    rating: 5,
    comment: 'Galaxy S24 Ultra quá đỉnh! Bút S Pen tiện lợi, màn hình siêu sáng. Pin dùng cả ngày không lo.',
    userName: 'Lê Văn C',
    images: ['https://picsum.photos/400/300?random=3'],
    helpfulCount: 12,
    isVisible: true
  },
  {
    userId: 'user_004',
    productId: 'product_002',
    productName: 'Samsung Galaxy S24 Ultra',
    rating: 3,
    comment: 'Máy ổn nhưng nóng khi chơi game nặng. Camera zoom 100x chất lượng trung bình.',
    userName: 'Phạm Thị D',
    images: [],
    helpfulCount: 5,
    isVisible: true
  },
  {
    userId: 'user_005',
    productId: 'product_003',
    productName: 'Xiaomi 14 Pro',
    rating: 4,
    comment: 'Giá tốt, hiệu năng mạnh. Camera Leica chụp ảnh đẹp. Sạc nhanh 120W rất tiện.',
    userName: 'Hoàng Văn E',
    images: ['https://picsum.photos/400/300?random=4', 'https://picsum.photos/400/300?random=5'],
    helpfulCount: 10,
    isVisible: true
  },
  {
    userId: 'user_006',
    productId: 'product_003',
    productName: 'Xiaomi 14 Pro',
    rating: 2,
    comment: 'Quảng cáo sản phẩm, nội dung spam.',
    userName: 'Fake User',
    images: [],
    helpfulCount: 0,
    isVisible: false,
    hiddenReason: 'Vi phạm quy định - Spam quảng cáo',
    hiddenBy: 'admin',
    hiddenAt: new Date()
  },
  {
    userId: 'user_007',
    productId: 'product_004',
    productName: 'OPPO Find X7 Ultra',
    rating: 5,
    comment: 'Thiết kế sang trọng, camera Hasselblad chụp ảnh chuyên nghiệp. Màn hình cong đẹp mắt.',
    userName: 'Võ Thị F',
    images: ['https://picsum.photos/400/300?random=6'],
    helpfulCount: 20,
    isVisible: true
  },
  {
    userId: 'user_008',
    productId: 'product_004',
    productName: 'OPPO Find X7 Ultra',
    rating: 4,
    comment: 'Máy tốt, nhưng ColorOS hơi nặng. Cần tối ưu hơn về pin.',
    userName: 'Đỗ Văn G',
    images: [],
    helpfulCount: 6,
    isVisible: true
  },
  {
    userId: 'user_009',
    productId: 'product_005',
    productName: 'Realme GT 5 Pro',
    rating: 5,
    comment: 'Hiệu năng khủng với Snapdragon 8 Gen 3. Giá cả phải chăng, đáng mua!',
    userName: 'Bùi Thị H',
    images: ['https://picsum.photos/400/300?random=7', 'https://picsum.photos/400/300?random=8'],
    helpfulCount: 18,
    isVisible: true
  },
  {
    userId: 'user_010',
    productId: 'product_005',
    productName: 'Realme GT 5 Pro',
    rating: 1,
    comment: 'Ngôn từ không phù hợp, vi phạm.',
    userName: 'Bad User',
    images: [],
    helpfulCount: 0,
    isVisible: false,
    hiddenReason: 'Vi phạm quy định - Ngôn từ không phù hợp',
    hiddenBy: 'admin',
    hiddenAt: new Date()
  },
  {
    userId: 'user_011',
    productId: 'product_001',
    productName: 'iPhone 15 Pro Max',
    rating: 3,
    comment: 'Máy ổn nhưng iOS hơi cứng nhắc. Giá cao, không phù hợp túi tiền.',
    userName: 'Lý Văn I',
    images: [],
    helpfulCount: 3,
    isVisible: true
  },
  {
    userId: 'user_012',
    productId: 'product_002',
    productName: 'Samsung Galaxy S24 Ultra',
    rating: 5,
    comment: 'Flagship tốt nhất năm! One UI mượt mà, camera zoom xa đỉnh cao.',
    userName: 'Trịnh Thị K',
    images: ['https://picsum.photos/400/300?random=9'],
    helpfulCount: 25,
    isVisible: true
  }
];

async function seedReviews() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smartbuy_db_review', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing reviews
    await Review.deleteMany({});
    console.log('🗑️  Cleared existing reviews');

    // Insert sample reviews
    const insertedReviews = await Review.insertMany(sampleReviews);
    console.log(`✅ Inserted ${insertedReviews.length} reviews`);

    // Display stats
    const stats = await Review.aggregate([
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          visibleReviews: { 
            $sum: { $cond: ['$isVisible', 1, 0] } 
          },
          hiddenReviews: { 
            $sum: { $cond: ['$isVisible', 0, 1] } 
          }
        }
      }
    ]);

    console.log('\n📊 Review Statistics:');
    console.log(`   Total Reviews: ${stats[0].totalReviews}`);
    console.log(`   Average Rating: ${stats[0].averageRating.toFixed(2)}`);
    console.log(`   Visible: ${stats[0].visibleReviews}`);
    console.log(`   Hidden: ${stats[0].hiddenReviews}`);

    // Display reviews by product
    const byProduct = await Review.aggregate([
      {
        $group: {
          _id: '$productName',
          count: { $sum: 1 },
          avgRating: { $avg: '$rating' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    console.log('\n📱 Reviews by Product:');
    byProduct.forEach(p => {
      console.log(`   ${p._id}: ${p.count} reviews (${p.avgRating.toFixed(1)}⭐)`);
    });

    console.log('\n✅ Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding reviews:', error);
    process.exit(1);
  }
}

seedReviews();
