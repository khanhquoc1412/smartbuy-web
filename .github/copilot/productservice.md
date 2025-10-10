## 📱 3️⃣ `productservice.md`

```md
# 📱 product-service – Quản lý sản phẩm

## Chức năng
- Quản lý sản phẩm, danh mục, thông số kỹ thuật.
- Tìm kiếm sản phẩm.
- Liên kết với `review-service` để tính đánh giá trung bình.

## Cấu trúc
productservice/
├── config/
│   ├── config.js
│   └── connectDB.js
├── controllers/
│   ├── brand.controller.js
│   ├── category.controller.js
│   ├── product.controller.js
│   └── productSpec.controller.js
├── errors/
│   ├── badRequestError.js
│   ├── conflictError.js
│   ├── index.js
│   ├── notFoundError.js
│   └── unauthorizedError.js
├── middleware/
│   ├── corsMiddleware.js
│   └── index.js
├── models/
│   ├── brand.js
│   ├── category.js
│   ├── color.js
│   ├── memory.js
│   ├── product_image.js
│   ├── product_specification.js
│   ├── product_variant.js
│   ├── product.js
│   ├── seed.js
│   └── specification.js
├── node_modules/
├── routes/
│   ├── brand.router.js
│   └── product.router.js
├── services/
│   ├── cloudinary.js
│   ├── index.js
│   └── mailer.js
├── index.js
├── package-lock.json
└── package.json
## Ghi chú
- Mỗi sản phẩm có thể chứa nhiều cấu hình (RAM, màu...).
- Cho phép lọc theo giá, danh mục, thương hiệu.