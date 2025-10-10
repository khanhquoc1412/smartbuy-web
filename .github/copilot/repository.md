# 🧭 Hướng dẫn tổng thể toàn dự án SmartBuy

## Mô tả tổng quan
SmartBuy là hệ thống **kinh doanh điện thoại online** theo **kiến trúc Microservice**.  
Mục tiêu: quản lý sản phẩm, giỏ hàng, đơn hàng, thanh toán, đánh giá, người dùng và chatbot tư vấn sản phẩm.

### Công nghệ chính
- **Backend:** Node.js + Express
- **Database:** MongoDB
- **Frontend:** Vue.js + TailwindCSS
- **Communication:** REST API + Kafka (tùy chọn)
- **Gateway:** API Gateway trung gian
- **Service Discovery:** discovery-service

### Các microservice chính
1. `user-service` — quản lý người dùng & xác thực
2. `product-service` — sản phẩm, danh mục, cấu hình
3. `cart-service` — giỏ hàng người dùng
4. `order-service` — quản lý đơn hàng
5. `payment-service` — thanh toán
6. `review-service` — đánh giá sản phẩm
7. `chat-service` — chatbot tư vấn
8. `discovery-service` — service registry
9. `api-gateway` — định tuyến request đến service
10. `client` — giao diện người dùng (Vue)
11.`product-manager-service` - quản lý tất cả sản phẩm dưới quyền admin

### Quy tắc lập trình chung
- Luôn **viết bằng tiếng Việt** (code comment, commit, file doc).
- Cấu trúc mỗi service gồm:
config/
controllers/
models/
middleware/
routes/
services/
validations/
index.js