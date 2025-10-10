## Về Service Này

Đây là **Product Manager Service**, một microservice cốt lõi trong hệ thống Mobile Shop.
- **Mục đích**: Chịu trách nhiệm quản lý toàn bộ dữ liệu liên quan đến danh mục sản phẩm, bao gồm: **Products**, **Brands**, **Categories**, **Colors**, **Specifications**, **Product Variants**, và **Product Images**.
- **Công nghệ**: Service này được xây dựng bằng **Node.js**, **Express.js**, và sử dụng **Mongoose** để tương tác với cơ sở dữ liệu **MongoDB**.

## Quy Ước Lập Trình & Mẫu Thiết Kế Quan Trọng

### 1. Mongoose Models là trung tâm
Tất cả logic đều xoay quanh các Mongoose model được định nghĩa trong `src/models/`.
- **Quan hệ (Relationships)**: Luôn sử dụng `mongoose.Schema.Types.ObjectId` và thuộc tính `ref` để tạo liên kết giữa các model. Ví dụ, `Product` model có các trường `brand` và `category` tham chiếu đến `Brand` và `Category`.
- **Tự động tạo Slug**: Model `Product` có một `pre('save')` hook để tự động tạo ra một `slug` (chuỗi thân thiện với URL) từ trường `name` mỗi khi một sản phẩm mới được tạo hoặc cập nhật tên. Hãy luôn duy trì mẫu này.

### 2. Cấu trúc Controller cho CRUD
Mỗi model sẽ có một file controller tương ứng trong `src/controllers/` (ví dụ: `brandsController.js`).
- **Logic bất đồng bộ**: Luôn sử dụng `async/await` cho các thao tác với cơ sở dữ liệu.
- **Xử lý lỗi**: Mọi hàm trong controller phải được bọc trong khối `try...catch` để bắt lỗi và trả về một response JSON nhất quán.
- **Format Response chuẩn**:
    - **Thành công**: `{ success: true, items: [...] }` hoặc `{ success: true, item: {...} }`.
    - **Thất bại**: `{ success: false, message: error.message }` với status code phù hợp (400, 404, 500).

### 3. Mẫu Aggregation Pipeline khi lấy danh sách Sản phẩm
Khi lấy danh sách sản phẩm (`productsController.list`), **không** dùng `Product.find()` đơn thuần. Thay vào đó, hãy sử dụng **Aggregation Pipeline** để làm giàu dữ liệu:
- Dùng `$lookup` để "join" với collection `brands` và `categories` để lấy tên thay vì chỉ có ID.
- Dùng `$lookup` để "join" với collection `productVariants` và `$group` để tính tổng số lượng tồn kho (`totalStock`) cho mỗi sản phẩm.
Đây là mẫu thiết kế ưu tiên để giảm số lượng truy vấn từ client.

## Cách Thêm một Resource Mới (ví dụ: `Memory`)

Để thêm các endpoint quản lý cho một model mới, hãy tuân thủ các bước sau:
1.  **Tạo Model**: Tạo file schema trong `src/models/memory.js`.
2.  **Tạo Controller**: Tạo file `src/controllers/memoriesController.js` với đầy đủ các hàm CRUD (`list`, `getById`, `create`, `update`, `delete`).
3.  **Tạo Route**: Tạo file `src/routes/memories.js`, định nghĩa các endpoint và liên kết chúng với các hàm trong `memoriesController`.
4.  **Đăng ký Route**: Trong file `server.js`, thêm dòng `app.use('/api/memories', require('./src/routes/memories'));` để kích hoạt các endpoint mới.

## Những Điều Cần Tránh

- **Không đặt logic xử lý trong file route**: File route chỉ dùng để định nghĩa endpoint. Toàn bộ logic phải nằm trong controller.
- **Không quên `ref`**: Khi tạo các trường tham chiếu đến model khác, luôn phải có thuộc tính `ref`.
- **Không trả về lỗi không có cấu trúc**: Luôn tuân thủ format JSON `{ success: false, message: '...' }` khi có lỗi xảy ra.