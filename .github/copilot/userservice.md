rules:
  # 🧭 Hướng dẫn tổng thể toàn dự án miroservice SmartBuy
  # (File này mô tả rule tổng quát áp dụng trên mọi workspace / repo liên quan SmartBuy)

  1. Mô tả tổng quan:
     - SmartBuy: hệ thống **bán điện thoại online** theo **kiến trúc Microservice**.
     - Mục tiêu: quản lý người dùng, sản phẩm, giỏ hàng, đơn hàng, thanh toán, đánh giá, chatbot tư vấn.

  2. Công nghệ chính (bắt buộc tuân theo):
     - Backend: Node.js + Express (TypeScript cho api-gateway).
     - Database: MongoDB cho services (một số service có thể dùng DB khác rõ ràng).
     - Frontend: Vue.js (Vue 3) + Vite + TailwindCSS.
     - Giao tiếp giữa services: REST API; Kafka là tùy chọn cho event-driven.
     - API Gateway: trung gian bắt buộc cho mọi request từ client.
     - Service Discovery: discovery-service (khi dùng dynamic routing).

  3. Danh sách microservice chuẩn (tên thư mục / repo):
     - user-service
     - product-service
     - product-manager-service
     - cart-service
     - order-service
     - order-manager-service
     - payment-service
     - review-service
     - chat-service (chatbot)
     - discovery-service
     - api-gateway
     - client (frontend Vue)

  4. Nguyên tắc về API Gateway (bất biến):
     - Mọi request từ client **phải** đi qua API Gateway (port mặc định `3000`).
     - **Không được** gọi trực tiếp các service (5001, 5002...) từ client.
     - Tất cả baseURL phía client phải dùng biến môi trường `VITE_API_GATEWAY_URL`.
     - API Gateway giữ trạng thái **stateless**; KHÔNG chứa business logic.
     - Cấu hình route/service trong `src/routes/proxyRoutes.ts` (hoặc tương đương): mỗi service có `url` và `path`.
     - Biến môi trường cho URL từng service phải được đặt trong `.env` (ví dụ `USER_SERVICE_URL`, `PRODUCT_SERVICE_URL`...).
     - Khi thêm service mới: 
       1) thêm biến môi trường, 2) thêm entry trong `proxyRoutes.ts`, 3) cập nhật docs + checklist.

  5. Quy ước route & RESTful:
     - Dùng dạng số nhiều cho resource: `/api/products`, `/api/users`, `/api/orders`.
     - Nếu发现 mismatch (`/api/product` vs `/api/products`) → ưu tiên chuẩn RESTful `/api/products`.
     - API versioning (nếu cần): `/api/v1/...`.
     - Các route trong Gateway phải khớp 100% với routes service; nếu đổi route, cập nhật cả client.

  6. Cấu trúc project/service (bắt buộc chuẩn hóa)
     - Mỗi service tối thiểu:
       - config/
       - controllers/
       - models/
       - middleware/
       - routes/
       - services/
       - validations/ (nếu có)
       - index.js hoặc app.ts (entry)
     - File tài nguyên (env, README, OpenAPI/Swagger nếu có) phải có ở root của service.

  7. Quy tắc lập trình & style (bắt buộc)
     - Ngôn ngữ: tiếng Việt cho comment, commit message, và tài liệu nội bộ.
     - Dùng `async/await` cho code bất đồng bộ; bắt lỗi bằng `try...catch`.
     - ES Modules (`import`/`export`) cho TypeScript/JS mới; CommonJS chỉ khi legacy.
     - TypeScript: bật `strict` cho api-gateway; dùng interface/type cho object phức tạp.
     - Không hardcode: mọi config (port, DB URL, secret, service URL) qua biến môi trường.
     - Tên biến, function, file dùng camelCase hoặc kebab-case nhất quán theo repo.

  8. Bảo mật & middleware chung (áp dụng cho api-gateway và services)
     - API Gateway phải dùng:
       - `helmet` (security headers)
       - `cors` (config theo domain)
       - `express-rate-limit` hoặc rate limiter tương đương
       - logging (morgan / pino) cho request/response
     - Xác thực: JWT. Secret lấy từ `process.env.JWT_SECRET`.
     - Middleware auth (pattern):
       1) Lấy token từ `Authorization: Bearer <token>`.
       2) Nếu không có token → 401.
       3) `jwt.verify` với `JWT_SECRET`.
       4) Sau verify: gọi User Service `/api/users/profile` (GET) với token để xác thực user tồn tại và lấy role → gán `req.user`.
       5) Nếu user không hợp lệ → 401.
     - Không lưu token/secret vào repo; .env.example phải chỉ dẫn biến cần thiết.

  9. Quản lý routes & compatibility (migration rules)
     - Khi thay đổi route của service:
       - Update `proxyRoutes.ts`.
       - Tìm & sửa tất cả client calls (pattern `localhost:\d+`).
       - Cập nhật unit/integration tests.
     - Migration checklist khi chuyển client qua Gateway:
       - client `axios.ts` chỉ có 1 instance baseURL = `${VITE_API_GATEWAY_URL}/api`.
       - Các alias cũ (`userAxios`, `productAxios`, `cartAxios`) trỏ về cùng instance để backward compatibility.
       - Test: login/register, product listing, add-to-cart, checkout.

  10. Kiểm thử & QA
      - Mỗi service cần có:
        - unit tests (jest/mocha) cho controllers & services
        - integration tests cho flow chính (ví dụ order → payment callback)
      - Smoke-test cho API Gateway: health endpoint `/health` phải phản hồi.
      - Test checklist trước merge:
        - [ ] Route khớp giữa Gateway & Service
        - [ ] Client sử dụng API Gateway URL
        - [ ] Auth flow hoạt động (login → protected route)
        - [ ] Test timeout & error handling

  11. Logging & Monitoring
      - Logs: structured JSON (pino/winston preferred).
      - Traces/errors: tích hợp Sentry (nếu có) hoặc tương đương.
      - Mỗi service expose metrics (Prometheus) nếu có orchestration.

  13. Tài liệu & commit
      - README cho mỗi service phải nêu rõ:
        - Env required (ví dụ `USER_SERVICE_URL`, `MONGO_URI`)
        - Cách chạy dev & test
        - Endpoint list quan trọng
      - Commit message: tiếng Việt, ngắn gọn, dạng: `feat(user): thêm endpoint login` / `fix(product): sửa route products`.

  14. Các anti-patterns cấm tuyệt đối
      - Gọi services trực tiếp từ client (bypass API Gateway).
      - Hardcode secrets hoặc URLs trong code.
      - Đặt business logic nặng trong API Gateway.
      - Không kiểm tra route mismatch khi thay đổi đường dẫn.
      - Ghi log chứa thông tin nhạy cảm (password, token).

  15. Checklist chuyển đổi (Quick migration checklist)
      - [ ] Đặt `VITE_API_GATEWAY_URL` trong client `.env`.
      - [ ] Cập nhật `client/src/plugins/axios/axios.ts` để dùng API Gateway.
      - [ ] Sửa mọi client direct call (`http://localhost:3001`, ...) sang `http://localhost:3000/api`.
      - [ ] Thêm `/api/auth` route vào Gateway nếu chưa có.
      - [ ] Chuẩn hóa `/api/product` → `/api/products` (quyết định và áp dụng toàn bộ).
      - [ ] Test end-to-end: Login → Browse → Add to Cart → Checkout.
      - [ ] Cập nhật docs + README cho team.

  16. Hướng dẫn nhanh thêm service vào Gateway
      - Thêm biến môi trường SERVICE_URL.
      - Trong `src/routes/proxyRoutes.ts` thêm:
        services.<name> = { url: process.env.<NAME>_SERVICE_URL || 'http://localhost:500X', path: '/api/<resources>' }
      - Restart gateway, chạy health checks.

  17. Liên hệ & trách nhiệm
      - Mọi thay đổi liên quan route hoặc auth phải được thông báo trên channel team trước khi merge.
      - Người tạo PR cần mô tả rõ: thay đổi route, cập nhật client, ảnh hưởng backward compatibility.

  18. Ghi chú bổ sung (ưu tiên thực tế)
      - Mọi cấu hình dev có thể có giá trị mặc định để phát triển nhanh, nhưng production bắt buộc dùng env thực tế.
      - Dành thời gian chuẩn hóa tên API (số nhiều vs số ít) trước khi mở rộng nhiều client.

  19. Mẫu file `.env.example` (bắt buộc cung cấp trong repo)
     - VITE_API_GATEWAY_URL=http://localhost:3000
     - USER_SERVICE_URL=http://localhost:5001
     - PRODUCT_SERVICE_URL=http://localhost:5002
     - CART_SERVICE_URL=http://localhost:5003
     - ORDER_SERVICE_URL=http://localhost:5004
     - PAYMENT_SERVICE_URL=http://localhost:5009
     - JWT_SECRET=your_jwt_secret_here
     - MONGO_URI=mongodb://localhost:27017/smartbuy

  20. Kết luận
     - Tuân thủ file rules này giúp:
       - Đảm bảo tính nhất quán giữa client & services.
       - Tăng bảo mật & dễ vận hành.
       - Giảm lỗi do mismatch route và cấu hình.
     - Rule này là nguồn truth cho kiến trúc microservice SmartBuy — mọi thay đổi phải được cập nhật tại đây.

# END OF RULES
