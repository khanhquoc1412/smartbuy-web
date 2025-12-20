# Hướng dẫn chi tiết: productservice

## 1. Tổng quan (Lý thuyết)
`productservice` là service chịu trách nhiệm quản lý toàn bộ dữ liệu về sản phẩm, danh mục (Category) và thương hiệu (Brand). Đây là "trái tim" của hệ thống thương mại điện tử SmartBuy.
- **Chức năng chính**: Hiển thị danh sách sản phẩm, tìm kiếm, lọc (theo brand, category, giá, màu sắc, bộ nhớ), xem chi tiết sản phẩm.
- **Công nghệ**: Node.js, Express, MongoDB (Mongoose).
- **Cổng kết nối (Port)**: 3001.

---

## 2. Kết nối Database & Mô hình dữ liệu (Models)

### 2.1. Cấu trúc dữ liệu phức hợp
Khác với các service khác, `productservice` có hệ thống model khá đồ sộ để hỗ trợ các biến thể sản phẩm:

- **Product (`models/product.js`)**: Lưu thông tin chung (tên, mô tả, giá cơ bản, slug, brandId, categoryId).
- **ProductVariant (`models/product_variant.js`)**: Lưu thông tin cụ thể cho từng phiên bản (Ví dụ: iPhone 15 Pro - Màu Titan - 256GB). Mỗi biến thể có giá và tồn kho (`stock`) riêng.
- **ProductImage (`models/product_image.js`)**: Quản lý nhiều ảnh cho một sản phẩm, có thể gắn với màu sắc cụ thể.
- **Specification (`models/specification.js`) & ProductSpecification**: Lưu thông số kỹ thuật (Chip, RAM, Camera, Pin...).
- **Brand & Category**: Phân loại sản phẩm.
- **Color & Memory**: Các thuộc tính bổ trợ cho biến thể.

---

## 3. API & Controllers

### 3.1. Controller Sản phẩm (`controllers/product.controller.js`)

#### Hàm `getAll` (Lấy danh sách & Tìm kiếm)
Đây là hàm phức tạp nhất, hỗ trợ:
1. **Phân trang (`Pagination`)**: Sử dụng `page` và `limit` để chia nhỏ dữ liệu.
2. **Sắp xếp (`Sorting`)**: Sắp xếp theo giá, tên hoặc ngày tạo.
3. **Lọc nâng cao (`Filtering`)**: 
   - Lọc theo Brand/Category ID hoặc tên (hỗ trợ regex tìm kiếm không dấu).
   - **Keyword Parsing**: Khi user tìm "iPhone 15 Đỏ 128GB", hàm `parseSearchKeyword` sẽ tách ra: Tên = "iPhone 15", Màu = "Đỏ", Bộ nhớ = "128GB" để lọc chính xác các biến thể.
4. **Populate**: Tự động gộp dữ liệu từ nhiều bảng (variants, images, colors, memories) để trả về một object sản phẩm đầy đủ cho UI.

#### Hàm `getDetail` (Chi tiết sản phẩm)
- Tìm sản phẩm theo `slug`.
- Trả về toàn bộ thông tin: mô tả, thông số kỹ thuật, danh sách tất cả biến thể và ảnh kèm theo.

---

## 4. Tương tác với Giao diện (Client)

1. **Trang chủ & Danh mục**: UI gọi API `/api/product` với các query params như `?category=smartphone&brand=apple`.
2. **Thanh tìm kiếm (Search Bar)**: UI gọi API tìm kiếm. Nhờ cơ chế parse keyword ở server, kết quả trả về sẽ rất chính xác theo nhu cầu người dùng.
3. **Trang Chi tiết (Product Detail)**: Khi user chọn một màu khác hoặc bộ nhớ khác, UI sẽ dựa vào list `productVariants` trả về từ API để cập nhật Giá và Ảnh hiển thị tương ứng.

---

## 5. Lưu ý cho Lập trình viên

- **Slug**: Được tạo tự động từ tên sản phẩm bằng thư viện `slugify` trong pre-save hook.
- **Hiệu năng**: Vì dữ liệu sản phẩm rất lớn và phải join nhiều bảng, service sử dụng `.lean()` của Mongoose để tăng tốc độ truy vấn và `.populate()` một cách chọn lọc.
- **Seeding**: Service có hệ thống `seed.js` và dữ liệu JSON mẫu để bạn có thể nhanh chóng tạo hàng trăm sản phẩm mẫu cho việc phát triển.

---

> [!IMPORTANT]
> Khi thêm sản phẩm mới, ngoài bảng `Product`, bạn cần phải thêm dữ liệu vào `ProductVariant` thì sản phẩm mới có giá và có thể cho vào giỏ hàng.
