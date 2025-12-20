# Hướng dẫn chi tiết: cartservice

## 1. Tổng quan (Lý thuyết)
`cartservice` quản lý giỏ hàng của người dùng. Khác với thông tin sản phẩm (tĩnh), giỏ hàng là dữ liệu động, thay đổi liên tục khi người dùng thêm/bớt hàng hoặc áp dụng mã giảm giá.
- **Chức năng chính**: Thêm sản phẩm vào giỏ, cập nhật số lượng, xóa sản phẩm, tính tổng tiền, áp dụng coupon, và đồng bộ dữ liệu với service sản phẩm.
- **Công nghệ**: Node.js, Express, MongoDB.
- **Cổng kết nối (Port)**: 3003.

---

## 2. Mô hình dữ liệu (Models)

### Cart Schema (`models/cart.js`)
Giỏ hàng được thiết kế theo cấu trúc lồng nhau (Embedded Documents):
- **userId**: Liên kết với người dùng.
- **items**: Một mảng các `CartItem`. Mỗi item lưu trữ:
  - Thông tin sản phẩm (`productId`, `name`, `slug`, `thumbUrl`).
  - Thông tin biến thể (`variantId`, `color`, `memory`, `price`, `stock`, `sku`).
  - `quantity`: Số lượng.
  - `subtotal`: Thành tiền của từng item (đã tính discount).
- **totalPrice**: Tổng tiền trước giảm giá của toàn bộ giỏ hàng.
- **couponDiscount**: Số tiền được giảm từ mã khuyến mãi.
- **finalTotal**: Số tiền cuối cùng user phải trả (Virtual field).

---

## 3. Các tính năng cốt lõi (Logic)

### 3.1. Thêm sản phẩm (`addToCart`)
- Khi user thêm hàng, service sẽ gọi sang `productservice` để lấy giá và tồn kho mới nhất.
- Kiểm tra xem sản phẩm đã có trong giỏ chưa. Nếu có, nó sẽ cộng dồn số lượng.
- Kiểm tra tồn kho (`checkStock`) để đảm bảo user không đặt quá số lượng đang có.

### 3.2. Cập nhật số lượng (`updateQuantity`)
- Thay đổi số lượng của một item cụ thể. 
- Nếu số lượng giảm về 0, item đó tự động bị xóa khỏi giỏ.
- Mỗi lần cập nhật, `totalPrice` sẽ được tính toán lại tự động thông qua hook `pre("save")`.

### 3.3. Đồng bộ giỏ hàng (`syncCart`)
Đây là tính năng quan trọng:
- Giỏ hàng có thể được lưu từ lâu, trong khi giá sản phẩm hoặc tồn kho có thể đã thay đổi.
- Khi user vào trang giỏ hàng, API `sync` sẽ được gọi để cập nhật lại Giá, Ảnh đại diện và Tồn kho mới nhất từ `productservice`.
- Sản phẩm nào không còn kinh doanh (bị xóa hoặc ẩn) sẽ tự động bị loại bỏ khỏi giỏ.

---

## 4. Tương tác với Giao diện (Client)

1. **Badge Giỏ hàng**: UI gọi API `/api/cart/count` để hiển thị số lượng sản phẩm trên header.
2. **Trang Giỏ hàng**: 
   - UI hiển thị danh sách sản phẩm. 
   - Khi user bấm nút `+` hoặc `-`, UI gọi API `PATCH /item/:id`.
   - Kết quả trả về chứa toàn bộ object giỏ hàng mới để UI cập nhật lại Tổng tiền ngay lập tức.
3. **Thanh toán (Checkout)**: Trước khi chuyển sang trang thanh toán, hệ thống sẽ gọi `syncCart` một lần nữa để đảm bảo mọi thứ vẫn đúng giá và còn hàng.

---

## 5. Lưu ý cho Lập trình viên

- **Mã lỗi**: Service sử dụng `http-status-codes` để chuẩn hóa các phản hồi lỗi (400 cho lỗi logic, 401 cho chưa login, 503 nếu không kết nối được với Product Service).
- **TTL Index**: Giỏ hàng có trường `expiresAt`. Bạn có thể cấu hình MongoDB TTL index để tự động xóa các giỏ hàng cũ "bị bỏ rơi" sau một khoảng thời gian (ví dụ 30 ngày).

---

> [!TIP]
> Log của service này rất chi tiết (được cấu hình trong `index.js`). Bạn có thể thấy rõ luồng cộng dồn sản phẩm hoặc tính toán lại tiền mỗi khi có yêu cầu thay đổi.
