# Hướng dẫn chi tiết: paymentservice

## 1. Tổng quan (Lý thuyết)
`paymentservice` đóng vai trò là cầu nối giữa hệ thống SmartBuy và các cổng thanh toán bên thứ ba (như VNPay, MoMo). Service này đảm bảo việc thu tiền từ khách hàng được an toàn, chính xác và có thể kiểm tra (audit).
- **Chức năng chính**: Tạo giao dịch, sinh link thanh toán, xác thực kết quả thanh toán từ ngân hàng (Webhook), xử lý hoàn tiền (Refund), và tự động hủy các giao dịch quá hạn.
- **Công nghệ**: Node.js, Express, MongoDB.
- **Cổng kết nối (Port)**: 3002.

---

## 2. Mô hình dữ liệu (Models)

### Payment Schema (`models/payment.js`)
Lưu trữ chi tiết từng giao dịch:
- **Liên kết**: `orderId` (ID đơn hàng), `userId` (Người mua).
- **Số tiền**: `amount`, `currency` (mặc định VND).
- **Trạng thái (`status`)**: `pending` (Chờ thanh toán), `paid` (Đã trả tiền), `failed` (Lỗi), `expired` (Hết hạn), `refunded` (Đã hoàn tiền).
- **Thông tin Gateway**: `transactionId` (Mã nội bộ), `externalTransactionId` (Mã từ VNPay/MoMo), `bankCode` (Ngân hàng thanh toán).
- **Hết hạn (`expiresAt`)**: Thời điểm cuối cùng user phải thanh toán (thường là sau 24h).

---

## 3. Các tính năng quan trọng (Logic)

### 3.1. Tích hợp VNPay
Service sử dụng thư viện `vnpay` để:
- **Build URL**: Tạo đường link dẫn người dùng sang trang thanh toán của ngân hàng.
- **Verify Return**: Khi người dùng quay lại từ trang ngân hàng (Return URL), service sẽ kiểm tra chữ ký số (Checksum) để đảm bảo dữ liệu không bị can thiệp.

### 3.2. Webhook & Đóng gói dữ liệu
- Khi VNPay/MoMo gửi kết quả thanh toán về, `paymentservice` sẽ cập nhật trạng thái của mình trước.
- Sau đó, nó gọi API nội bộ sang `orderservice` để cập nhật trạng thái đơn hàng tương ứng. Điều này đảm bảo tính nhất quán (Consistency) giữa hai service.

### 3.3. Tự động hủy giao dịch (Cron Job)
- Một cron job chạy mỗi 5 phút (`node-cron`) để tìm các giao dịch ở trạng thái `pending` đã quá `expiresAt`.
- Các giao dịch này sẽ được chuyển sang trạng thái `expired`.

---

## 4. Bảo mật và Toàn vẹn dữ liệu

1. **Checksum/Signature**: Luôn sử dụng `secureSecret` để mã hóa và kiểm tra dữ liệu từ Gateway gửi về.
2. **IP Whitelisting**: (Khuyên dùng) Chỉ cho phép các IP từ hạ tầng cổng thanh toán gửi Webhook về.
3. **Idempotency**: Đảm bảo một mã giao dịch chỉ được thanh toán một lần, tránh trường hợp user thanh toán trùng hoặc hacker gửi Webhook giả nhiều lần.

---

## 5. Tương tác với Giao diện (Client)

1. **Khi thanh toán**: UI nhận được `paymentUrl` từ server và thực hiện điều hướng (`window.location.href`).
2. **Trang kết quả**: Người dùng được redirect về `/payment/success` hoặc `/payment/failed`. UI sẽ lấy tham số từ URL để hiển thị kết quả chi tiết.

---

> [!CAUTION]
> Tuyệt đối không lưu trữ các thông tin nhạy cảm của thẻ tín dụng (CVV, số thẻ) vào database. Toàn bộ việc này được thực hiện trực tiếp trên trang bảo mật của Cổng thanh toán.
