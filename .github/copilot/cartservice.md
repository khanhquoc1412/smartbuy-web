# 🛒 cart-service – Quản lý giỏ hàng

## Chức năng
- Thêm, xóa, cập nhật sản phẩm trong giỏ.
- Lưu giỏ hàng theo `userId`.
- Thêm sản phẩm từ bên product vào giỏ hàng.
## Cấu trúc
cartservice/
├── config/db.js
├── controllers/cart.controller.js
├── models/cart.model.js
├── routes/cart.routes.js
├── services/cart.service.js
└── index.js

## Endpoint
| Method | Endpoint | Mô tả |
|---------|-----------|--------|
router.post('/add',
    auth,
    cartController.addProductToCart
)
router.patch('/decr-qty/:cartId',
    auth,
    cartController.decreaseQuantity
)
router.delete('/:cartId',
    auth,
    cartController.removeProduct
)
router.get('/user/:userId',
    auth,
    cartController.getUserCarts
)


## Ghi chú
- Mỗi user chỉ có một giỏ hàng đang hoạt động.
- Khi thanh toán xong, giỏ hàng sẽ được reset.
