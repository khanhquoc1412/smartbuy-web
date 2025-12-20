# Hướng dẫn chi tiết: orderservice

## 1. Tổng quan (Lý thuyết)
`orderservice` quản lý vòng đời của một đơn hàng, từ lúc khách hàng bấm "Đặt hàng" cho đến khi đơn hàng hoàn tất hoặc bị hủy. Đây là service điều phối (Orchestrator) chính, tương tác với nhiều service khác như `userservice`, `productservice`, `cartservice`, và `paymentservice`.
- **Chức năng chính**: Tạo đơn hàng, quản lý trạng thái, cập nhật tồn kho, xử lý hoàn tiền, và lịch sử đơn hàng.
- **Công nghệ**: Node.js, Express, MongoDB.
- **Cổng kết nối (Port)**: 3004.

---

## 2. Mô hình dữ liệu (Models)

### Order Schema (`models/order.js`)
Một object đơn hàng chứa rất nhiều thông tin quan trọng:
- **Thông tin khách hàng**: `user` (ID), `shippingAddress` (Họ tên, SĐT, Địa chỉ chi tiết).
- **Danh sách sản phẩm (`orderItems`)**: Snapshot thông tin sản phẩm tại thời điểm đặt (tên, giá, SKU, biến thể) để tránh việc giá thay đổi sau này làm ảnh hưởng đến đơn cũ.
- **Thanh toán**: `paymentMethod` (COD, VNPAY, MOMO...), `paymentStatus` (unpaid, paid, failed), và `paymentResult` (mã giao dịch từ ngân hàng).
- **Trạng thái (`status`)**: Một chuỗi các trạng thái: `pending_payment` -> `pending` -> `confirmed` -> `processing` -> `shipping` -> `delivered` -> `completed`.
- **Lịch sử trạng thái (`statusHistory`)**: Ghi lại ai đã thay đổi trạng thái, vào lúc nào và lý do là gì.

---

## 3. Luồng hoạt động chính (Workflows)

### 3.1. Quy trình tạo đơn hàng (`createOrderFromCart`)
1. **Trừ tồn kho tạm thời**: Gọi sang `productservice` để trừ số lượng sản phẩm trong kho (`deduct stock`).
2. **Tạo đơn hàng**: Lưu thông tin đơn hàng vào database với trạng thái ban đầu.
3. **Xóa giỏ hàng**: Gọi sang `cartservice` để xóa các sản phẩm vừa đặt khỏi giỏ.
4. **Xử lý thanh toán**: 
   - Nếu là **COD**: Kết thúc luồng, chờ Admin xác nhận.
   - Nếu là **Online (VNPAY/MOMO)**: Gọi sang `paymentservice` để lấy link thanh toán và trả về cho UI.

### 3.2. Xử lý sau thanh toán (`handlePaymentCallback`)
- Khi người dùng thanh toán xong, `paymentservice` sẽ gửi thông báo (Webhook) về.
- Nếu thành công: Cập nhật `paymentStatus = paid` và chuyển đơn hàng sang trạng thái `pending` (Chờ shop chuẩn bị hàng).
- Nếu thất bại: Chuyển đơn hàng sang `payment_failed` hoặc `cancelled` và **hoàn trả lại tồn kho** cho `productservice`.

### 3.3. Hủy đơn hàng và Hoàn tiền
- Người dùng có thể hủy đơn khi hàng chưa được giao.
- Hệ thống sẽ tự động gọi `paymentservice` để thực hiện lệnh hoàn tiền (`refund`) nếu đơn đã thanh toán trước đó.
- Tồn kho cũng được cộng lại tự động vào kho hàng.

---

## 4. Tương tác với Giao diện (Client)

1. **Trang Checkout**: UI gửi thông tin giỏ hàng và địa chỉ qua API `/api/order/create`. Server trả về `paymentUrl` nếu cần thanh toán online.
2. **Trang Đơn hàng của tôi**: UI gọi API `/api/order/list` để lấy danh sách. Server trả về kèm theo `orderNumber` (định dạng dễ đọc như `ORD-20251220-ABC123`).
3. **Nút "Đã nhận được hàng"**: UI gọi API `confirm-received` để kết thúc đơn hàng, lúc này user mới có quyền đánh giá sản phẩm.

---

## 5. Lưu ý cho Lập trình viên

- **Tự động hóa**: Service có cơ chế `autoCancel` cho các đơn hàng online không thanh toán sau một khoảng thời gian nhất định.
- **Tính nhất quán**: Do làm việc với nhiều service, `orderservice` phải đảm bảo các lệnh gọi API liên-service (inter-service calls) được thực hiện an toàn. Nếu trừ kho thành công mà tạo đơn lỗi, phải có cơ chế hoàn trả kho.

---

> [!IMPORTANT]
> Mã đơn hàng (`orderNumber`) là một virtual field, được sinh ra từ ngày tạo và ID sản phẩm để đảm bảo tính duy nhất và chuyên nghiệp.
