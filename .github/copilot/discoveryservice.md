# 🔍 discovery-service – Quản lý Service Registry

## Chức năng
- Ghi nhận danh sách các service đang hoạt động.
- Cung cấp API kiểm tra trạng thái từng service.

## Cấu trúc
discoveryservice/
├── controllers/discovery.controller.js
├── routes/discovery.routes.js
├── services/registry.service.js
└── index.js
└── package.json

## Endpoint
| Method | Endpoint | Mô tả |
|---------|-----------|--------|
| GET | /services | Danh sách service |
| POST | /register | Đăng ký service mới |
| GET | /health/:name | Kiểm tra trạng thái |
# 🚪 api-gateway – Cổng giao tiếp trung gian

