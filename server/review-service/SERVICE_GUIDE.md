# Hướng dẫn chi tiết: review-service

## 1. Tổng quan (Lý thuyết)
`review-service` chịu trách nhiệm quản lý ý kiến phản hồi và đánh giá của khách hàng về sản phẩm. Đây là thành phần quan trọng giúp tăng tính tin cậy cho hệ thống thương mại điện tử.
- **Chức năng chính**: Gửi đánh giá, tải lên hình ảnh sản phẩm thực tế, trả lời đánh giá (admin), và tính toán điểm trung bình (rating) cho sản phẩm.
- **Công nghệ**: Node.js, Express, MongoDB.
- **Cổng kết nối (Port)**: 5006.

---

## 2. Mô hình dữ liệu (Models)

### Review Schema (`src/models/review.js`)
Lưu trữ thông tin chi tiết về một bài đánh giá:
- **Thông tin liên quan**: `productId` (Sản phẩm được đánh giá), `userId` (Người viết đánh giá), `orderId` (Đơn hàng mua sản phẩm đó - dùng để xác thực "Người mua thực sự").
- **Nội dung**: `rating` (Số sao từ 1-5), `content` (Nội dung văn bản), `images` (Mảng chứa các URL ảnh thực tế từ người dùng).
- **Phản hồi**: `replies` (Mảng chứa các câu trả lời từ Admin hoặc hệ thống).
- **Trạng thái**: `status` (PENDING, APPROVED, HIDDEN). Mặc định đánh giá có thể cần Admin duyệt trước khi hiển thị.

---

## 3. Các tính năng cốt lõi (Logic)

### 3.1. Gửi đánh giá với hình ảnh
- Service hỗ trợ gửi ảnh dưới dạng **Base64** qua API với giới hạn dữ liệu lên đến 50MB (cấu hình trong `server.js`).
- Hình ảnh sau đó sẽ được service xử lý (thường là đẩy lên Cloudinary) để lấy link URL.

### 3.2. Tính toán Rating
- Mỗi khi có đánh giá mới được phê duyệt, service sẽ thực hiện tính toán lại điểm trung bình của sản phẩm đó.
- Công thức: `Tổng số sao / Tổng số lượt đánh giá`. Kết quả này sẽ được hiển thị trên trang chi tiết sản phẩm ở phía Client.

### 3.3. Bảo mật và Chống Spam
- **Rate Limiting**: Giới hạn số lượng request từ một IP (100 lần/phút) để tránh bot tự động gửi hàng loạt đánh giá ảo.
- **Xác thực mua hàng**: Trước khi cho phép đánh giá, service kiểm tra xem `userId` đã có đơn hàng nào chứa `productId` đó ở trạng thái `completed` chưa.

---

## 4. Tương tác với Giao diện (Client)

1. **Trang chi tiết sản phẩm**: UI gọi API `GET /api/reviews/product/:productId` để hiển thị danh sách đánh giá và số sao trung bình.
2. **Trang Lịch sử đơn hàng**: Sau khi bấm "Đã nhận được hàng", UI sẽ hiển thị nút "Đánh giá ngay" dẫn đến form viết review.
3. **Phân trang**: Danh sách đánh giá được trả về có kèm theo thông tin phân trang (Pagination) để đảm bảo tốc độ tải trang nhanh khi sản phẩm có hàng nghìn đánh giá.

---

## 5. Lưu ý cho Lập trình viên

- **Xử lý ảnh lỗi**: Nếu quá trình tải ảnh lên cloud thất bại, service nên lưu bài viết mà không có ảnh thay vì trả về lỗi 500 cho người dùng.
- **Log duyệt tin**: Mọi hành động ẩn hoặc hiện đánh giá của Admin đều được ghi lại để quản lý minh bạch.

---

> [!TIP]
> Bạn có thể chạy file `seed.js` trong thư mục gốc của service để nạp dữ liệu đánh giá mẫu cho quá trình phát triển (Development phase).
