## Về Dự Án Này

Đây là API Gateway cho ứng dụng microservice của Mobile Shop, được xây dựng bằng TypeScript và Express.js. Các trách nhiệm chính của nó bao gồm:
1.  **Chuyển tiếp (Proxy) Request**: Đóng vai trò là một điểm truy cập duy nhất, định tuyến các request đến microservice tương ứng (ví dụ: User Service, Product Service).
2.  **Xác thực**: Bảo vệ các endpoint bằng cách xác minh JSON Web Tokens (JWT).
3.  **Các Vấn đề Xuyên suốt (Cross-Cutting Concerns)**: Xử lý các security header với `helmet`, quản lý CORS, giới hạn tần suất request (rate limiting), và ghi log request.

Bản thân API Gateway phải được giữ ở trạng thái stateless (không lưu trạng thái) và không chứa bất kỳ logic nghiệp vụ nào.

## Công Nghệ Cốt Lõi & Nguyên Tắc

- **Ngôn ngữ**: TypeScript (với chế độ `strict` được bật).
- **Framework**: Express.js.
- **Định tuyến (Routing)**: Sử dụng `http-proxy-middleware` để chuyển tiếp request. Các route mới được định nghĩa trong đối tượng `services` tại `src/routes/proxyRoutes.ts`.
- **Cấu hình**: Mọi cấu hình (port, URL, secret) BẮT BUỘC phải được quản lý thông qua biến môi trường (environment variables) sử dụng package `dotenv`. Tuyệt đối không hardcode các giá trị cấu hình.
- **Bảo mật**:
    - `helmet` được dùng để thiết lập các HTTP header an toàn.
    - `express-rate-limit` được cấu hình để chống lạm dụng.
    - `cors` được dùng để quản lý các request cross-origin từ frontend.
- **Xác thực**: Cơ chế xác thực dựa trên JWT được triển khai tại `src/middleware/auth.ts`.

## Quy Ước Lập Trình & Phong Cách Code

- **Code bất đồng bộ**: Luôn sử dụng `async/await` cho các tác vụ bất đồng bộ. Bọc các lời gọi `await` trong khối `try...catch` để xử lý lỗi, đặc biệt là trong middleware.
- **Modules**: Sử dụng cú pháp module của ES6 (`import`/`export`).
- **Typing**: Sử dụng TypeScript interface cho các đối tượng phức tạp, ví dụ như `AuthUser` và `AuthRequest` trong `auth.ts`.
- **Biến môi trường**: Luôn truy cập biến môi trường thông qua `process.env`. Cung cấp giá trị mặc định để thuận tiện cho việc phát triển nếu cần (ví dụ: `process.env.PORT || '3000'`).

## Các Logic và Mẫu Thiết Kế Chính

### Luồng Xác thực (`src/middleware/auth.ts`)

Đây là một mẫu (pattern) cực kỳ quan trọng trong hệ thống. Khi tạo middleware xác thực, hãy tuân thủ chính xác các bước sau:
1.  Trích xuất JWT từ header `Authorization: Bearer <token>`.
2.  Nếu không có token, trả về lỗi 401 Unauthorized.
3.  Xác minh token bằng `jwt.verify` với `process.env.JWT_SECRET`.
4.  **Điểm quan trọng**: Sau khi xác minh JWT thành công, thực hiện một request GET bằng `axios` đến User Service (`USER_SERVICE_URL`) tại endpoint `/api/users/profile`, và gửi kèm token trong header. Bước này nhằm xác thực rằng người dùng vẫn tồn tại và hoạt động trong cơ sở dữ liệu.
5.  Nếu request đến User Service thành công, gắn thông tin người dùng (`id`, `username`, `role`) vào đối tượng `req.user`.
6.  Nếu bất kỳ bước nào thất bại (token không hợp lệ, không tìm thấy người dùng), trả về lỗi 401 Unauthorized cùng với một thông điệp JSON mô tả `{ success: false, message: '...' }`.

### Cách Thêm Một Route Cho Service Mới

Để thêm một route cho microservice mới, hãy làm theo mẫu sau:
1.  Thêm URL của service vào file `.env` (ví dụ: `PAYMENT_SERVICE_URL=http://localhost:5009`).
2.  Trong `src/routes/proxyRoutes.ts`, thêm một mục mới vào đối tượng `services`. `key` là tên của service, và `value` chứa URL và đường dẫn API cần proxy.

**Ví dụ**:
```typescript
// Trong src/routes/proxyRoutes.ts
const services = {
  // ... các service khác
  payment: { url: process.env.PAYMENT_SERVICE_URL || 'http://localhost:5009', path: '/api/payments' }
} as const;