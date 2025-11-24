# 📦 order-service – Quản lý đơn hàng

## Chức năng
- Tạo, xem trạng thái đơn hàng theo userID 
- Giao tiếp với `payment-service` khi thanh toán thành công.

## Cấu trúc
orderservice/
├── config/config.js, connectDB.js
├── controllers/order.controller.js
├── models/order.model.js
├── routes/order.routes.js
├── services/order.service.js
└── index.js
└── package.json

## Endpoint

router.post('/create',
    auth,
    orderController.createOrder
)
router.get('/list',
    auth,
    orderController.getUserOrders
)
router.post('/create-order-guest',
    orderController.createOrderGuest
)

## Ghi chú
- Mỗi đơn lưu thông tin: sản phẩm, số lượng, giá, trạng thái.
- Bạn cần xây dựng OrderService (Phía User) với luồng xử lý cụ  thể:User chốt đơn/Thanh toán xong $\rightarrow$ 
- Dữ liệu từ giỏ hàng được chuyển thành Đơn hàng trong Database (trạng thái ban đầu là pending - Chờ xác nhận).
- Chung Database:Service này sẽ ghi vào cùng một Database mà Admin Service đọc (để Admin thấy đơn mà duyệt).
- Xem lịch sử: User chỉ được phép xem trạng thái đơn hàng (Read-only) để biết Admin đã duyệt đến đâu.

