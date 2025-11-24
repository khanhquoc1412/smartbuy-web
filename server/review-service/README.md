# Review Service

Service quản lý đánh giá sản phẩm cho SmartBuy Mobile Shop.

## Tính năng

- ✅ Tạo đánh giá sản phẩm (rating 1-5 sao, comment, hình ảnh)
- ✅ Lấy danh sách đánh giá theo sản phẩm với phân trang
- ✅ Lấy đánh giá của user
- ✅ Cập nhật và xóa đánh giá
- ✅ Đánh dấu đánh giá hữu ích
- ✅ Thống kê rating (trung bình, phân bố 1-5 sao)
- ✅ Admin có thể ẩn/hiện đánh giá (mặc định tự động hiển thị)
- ✅ Xác thực mua hàng (verified purchase)

## Cài đặt

```bash
# Cài đặt dependencies
npm install

# Copy file môi trường
cp .env.example .env

# Chỉnh sửa file .env theo cấu hình của bạn

# Chạy development
npm run dev

# Chạy production
npm start
```

## API Endpoints

### Public APIs

#### 1. Tạo đánh giá mới
```
POST /api/reviews
Body: {
  "userId": "user123",
  "productId": "product_objectid",
  "rating": 5,
  "comment": "Sản phẩm rất tốt!",
  "userName": "Nguyễn Văn A",
  "isVerifiedPurchase": true,
  "images": ["url1", "url2"]
}
```

#### 2. Lấy đánh giá của sản phẩm
```
GET /api/reviews/product/:productId?page=1&limit=10&rating=5&sortBy=createdAt
```

#### 3. Lấy đánh giá của user
```
GET /api/reviews/user/:userId?page=1&limit=10
```

#### 4. Lấy chi tiết đánh giá
```
GET /api/reviews/:id
```

#### 5. Cập nhật đánh giá
```
PUT /api/reviews/:id
Body: {
  "rating": 4,
  "comment": "Updated comment",
  "images": ["new_url"]
}
```

#### 6. Xóa đánh giá
```
DELETE /api/reviews/:id
```

#### 7. Đánh dấu hữu ích
```
POST /api/reviews/:id/helpful
```

### Admin APIs

#### 8. Ẩn/hiện đánh giá (Admin)
```
PATCH /api/reviews/:id/visibility
Body: {
  "isVisible": false,           // true = hiện, false = ẩn
  "hiddenReason": "Spam/Vi phạm nội dung",  // Lý do ẩn (optional)
  "adminId": "admin_user_id"    // ID admin thực hiện (optional)
}
```

#### 9. Lấy thống kê tổng quan
```
GET /api/reviews/stats/overview
```

## Database Schema

### Review Model
```javascript
{
  userId: String,              // ID của user
  productId: ObjectId,         // ID của sản phẩm
  rating: Number (1-5),        // Đánh giá sao
  comment: String,             // Nội dung đánh giá
  userName: String,            // Tên người đánh giá
  isVerifiedPurchase: Boolean, // Đã mua hàng chưa
  images: [String],            // Hình ảnh đính kèm
  helpfulCount: Number,        // Số người thấy hữu ích
  isVisible: Boolean,          // Hiển thị hay ẩn (default: true)
  hiddenReason: String,        // Lý do ẩn (nếu bị admin ẩn)
  hiddenBy: String,            // Admin ID người ẩn
  hiddenAt: Date,              // Thời gian ẩn
  createdAt: Date,
  updatedAt: Date
}
```

## Dependencies

- express: Web framework
- mongoose: MongoDB ODM
- cors: CORS middleware
- helmet: Security headers
- morgan: HTTP request logger
- express-rate-limit: Rate limiting
- dotenv: Environment variables

## Port

Mặc định: **5006**

## Author

SmartBuy Team
