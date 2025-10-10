# 🌟 review-service – Đánh giá sản phẩm

## Chức năng
- Đăng, xem, xóa đánh giá sản phẩm.
- Tính điểm trung bình cho mỗi sản phẩm.

## Cấu trúc
reviewservice/
├── config/config.js, connectDB.js
├── controllers/review.controller.js
├── models/review.model.js
├── routes/review.routes.js
├── services/review.service.js
└── index.js

## Endpoint
| Method | Endpoint | Mô tả |
|---------|-----------|--------|
| POST | /review | Gửi đánh giá |
| GET | /review/product/:id | Lấy danh sách đánh giá |
| DELETE | /review/:id | Xóa đánh giá |

## Ghi chú
- Mỗi review liên kết với `userId` và `productId`.
- Cho phép tính trung bình rating.
