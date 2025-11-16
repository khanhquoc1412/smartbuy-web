# Order Manager Service

Microservice quản lý đơn hàng cho hệ thống SmartBuy.

## 🚀 Cài đặt

```bash
npm install
```

## 🔧 Cấu hình

Copy file `config.env.example` thành `.env` và cấu hình:

```env
MONGODB_URI=mongodb://localhost:27017/smartbuy_db_order
PORT=5003
NODE_ENV=development
USER_MANAGER_SERVICE_URL=http://localhost:3006
PRODUCT_MANAGER_SERVICE_URL=http://localhost:5002
```

## 🌱 Seed dữ liệu mẫu

```bash
npm run seed
```

Lệnh này sẽ tạo 50 đơn hàng mẫu với:
- Các trạng thái khác nhau (pending, confirmed, shipping, completed, cancelled...)
- Các phương thức thanh toán (COD, VNPAY, MOMO, ZALOPAY)
- Lịch sử thay đổi trạng thái
- Thông tin giao hàng

## ▶️ Chạy service

```bash
# Development
npm run dev

# Production
npm start
```

Service sẽ chạy tại: `http://localhost:5003`

## 📡 API Endpoints

### Orders

- `GET /api/orders` - Lấy danh sách đơn hàng (có phân trang, filter)
- `GET /api/orders/stats` - Lấy thống kê đơn hàng
- `GET /api/orders/:id` - Lấy chi tiết đơn hàng
- `POST /api/orders` - Tạo đơn hàng mới
- `PATCH /api/orders/:id/status` - Cập nhật trạng thái đơn hàng
- `PATCH /api/orders/:id` - Cập nhật đơn hàng
- `DELETE /api/orders` - Xóa nhiều đơn hàng
- `DELETE /api/orders/:id` - Xóa đơn hàng

### Query Parameters (GET /api/orders)

- `page` - Số trang (default: 1)
- `limit` - Số items/trang (default: 10)
- `search` - Tìm kiếm theo tên khách hàng, SĐT
- `orderStatus` - Lọc theo trạng thái đơn (array)
- `paymentStatus` - Lọc theo trạng thái thanh toán (array)
- `dateFrom` - Lọc từ ngày
- `dateTo` - Lọc đến ngày

## 📊 Order Model

Xem chi tiết tại `src/models/Order.js`

### Order Statuses
- `pending_payment` - Chờ thanh toán
- `payment_failed` - Thanh toán thất bại
- `pending` - Chờ xác nhận
- `confirmed` - Đã xác nhận
- `processing` - Đang chuẩn bị
- `ready_to_ship` - Sẵn sàng giao
- `shipping` - Đang giao
- `delivered` - Đã giao
- `completed` - Hoàn thành
- `cancelled` - Đã hủy
- `returned` - Đã trả hàng

### Payment Statuses
- `unpaid` - Chưa thanh toán
- `paid` - Đã thanh toán
- `refunded` - Đã hoàn tiền
- `failed` - Thất bại

## 🔗 Integration với API Gateway

Đảm bảo đã cấu hình route trong API Gateway:

```typescript
orders: { 
  url: process.env.ORDER_MANAGER_SERVICE_URL || 'http://localhost:5003', 
  path: '/api/orders' 
}
```

## 📝 License

MIT
