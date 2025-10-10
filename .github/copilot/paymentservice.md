# 💳 payment-service – Xử lý thanh toán

## Chức năng
- Xử lý giao dịch thanh toán.
- Giao tiếp với `order-service`.
- Ghi log thanh toán.

## Cấu trúc
paymentservice/
├── config/config.js, connectDB.js
├── controllers/payment.controller.js
├── models/payment.model.js
├── routes/payment.routes.js
├── services/payment.service.js
└── index.js
└── package.json
## Endpoint
| Method | Endpoint | Mô tả |
|---------|-----------|--------|
| POST | /payment | Tạo thanh toán |
| GET | /payment/:id | Xem chi tiết thanh toán |

## Ghi chú
- Hỗ trợ phương thức COD, chuyển khoản, Momo.
- Khi thanh toán thành công → gửi callback tới order-service.