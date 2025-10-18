# 🚪 api-gateway – Cổng giao tiếp trung gian

## Chức năng
- Nhận request từ frontend và điều hướng đến service tương ứng.
- Xử lý xác thực JWT và ghi log.

## Cấu trúc
apigateway/
├── routes/
│ ├── user.route.js
│ ├── product.route.js
│ ├── order.route.js
│ ├── payment.route.js
│ ├── review.route.js
│ └── chat.route.js
├── middleware/auth.middleware.js
├── index.js
└── package.json