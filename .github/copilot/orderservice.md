# 📦 order-service – Quản lý đơn hàng

## Chức năng
- Tạo, xem, hủy, cập nhật trạng thái đơn hàng.
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

