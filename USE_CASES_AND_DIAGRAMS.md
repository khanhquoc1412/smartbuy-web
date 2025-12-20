# USE CASES VÀ CLASS DIAGRAMS - HỆ THỐNG SMARTBUY

> **Tài liệu kỹ thuật chi tiết về Use Cases và Class Diagrams**  
> Sinh viên: [Tên của bạn]  
> Ngày cập nhật: ${new Date().toLocaleDateString('vi-VN')}

---

## MỤC LỤC

1. [Use Case Diagram Tổng Quan](#1-use-case-diagram-tổng-quan)
2. [Mô Tả Chi Tiết Use Cases](#2-mô-tả-chi-tiết-use-cases)
   - [UC2: Đăng Nhập](#uc2-đăng-nhập-hệ-thống)
   - [UC9: Đặt Hàng](#uc9-đặt-hàng)
   - [UC10: Thanh Toán VNPay](#uc10-thanh-toán-vnpay)
3. [Sequence Diagrams](#3-sequence-diagrams)
4. [Class Diagram Toàn Hệ Thống](#4-class-diagram-toàn-hệ-thống)
5. [Design Patterns](#5-design-patterns)

---

## 1. USE CASE DIAGRAM TỔNG QUAN

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    HỆ THỐNG SMARTBUY - USE CASE TỔNG QUAN                   │
└─────────────────────────────────────────────────────────────────────────────┘

     ┌──────────────┐                                        ┌──────────────┐
     │              │                                        │              │
     │  Khách Hàng  │                                        │  Quản Trị    │
     │              │                                        │   Viên       │
     └──────┬───────┘                                        └──────┬───────┘
            │                                                       │
            │                                                       │
    ┌───────┴────────────────────────────────────────────────────┬─┴────────┐
    │                                                            │          │
    ├── UC1: Đăng Ký Tài Khoản                                 │          │
    │                                                            │          │
    ├── UC2: Đăng Nhập Hệ Thống                                ├──────────┤
    │                                                            │          │
    ├── UC3: Quên Mật Khẩu / Đặt Lại Mật Khẩu                  │          │
    │                                                            │          │
    ├── UC4: Cập Nhật Thông Tin Cá Nhân                        │          │
    │                                                            │          │
    ├── UC5: Tìm Kiếm & Lọc Sản Phẩm                           │          │
    │                                                            │          │
    ├── UC6: Xem Chi Tiết Sản Phẩm                             │          │
    │                                                            │          │
    ├── UC7: Thêm Sản Phẩm Vào Giỏ Hàng                        │          │
    │                                                            │          │
    ├── UC8: Quản Lý Giỏ Hàng (Xem/Sửa/Xóa)                    │          │
    │                                                            │          │
    ├── UC9: Đặt Hàng                                          │          │
    │                                                            │          │
    ├── UC10: Thanh Toán (VNPay/COD)                           │          │
    │                                                            │          │
    ├── UC11: Theo Dõi Đơn Hàng                                │          │
    │                                                            │          │
    ├── UC12: Hủy Đơn Hàng                                     │          │
    │                                                            │          │
    ├── UC13: Viết Đánh Giá Sản Phẩm                           │          │
    │                                                            │          │
    ├── UC14: Tương Tác Chatbox AI                             │          │
    │                                                            │          │
    │                                                            ├── UC15: Quản Lý Sản Phẩm
    │                                                            │
    │                                                            ├── UC16: Quản Lý Đơn Hàng
    │                                                            │
    │                                                            ├── UC17: Quản Lý Người Dùng
    │                                                            │
    │                                                            ├── UC18: Xem Thống Kê & Báo Cáo
    │                                                            │
    └────────────────────────────────────────────────────────────┴──────────┘
```

### Danh Sách Use Cases

**A. Use Cases Khách Hàng:**

| ID   | Tên Use Case          | Mô tả ngắn                                           | Service liên quan |
| ---- | --------------------- | ---------------------------------------------------- | ----------------- |
| UC1  | Đăng Ký Tài Khoản     | Tạo tài khoản mới với email/password                 | User Service      |
| UC2  | Đăng Nhập             | Xác thực người dùng qua JWT token                    | User Service      |
| UC3  | Quên Mật Khẩu         | Gửi email reset password với verification token      | User Manager      |
| UC4  | Cập Nhật Thông Tin    | Sửa profile, avatar, địa chỉ giao hàng               | User Manager      |
| UC5  | Tìm Kiếm Sản Phẩm     | Tìm kiếm theo tên, lọc theo brand/category/giá       | Product Service   |
| UC6  | Xem Chi Tiết Sản Phẩm | Xem thông tin, hình ảnh, variants, đánh giá          | Product Service   |
| UC7  | Thêm Giỏ Hàng         | Chọn variant (màu/bộ nhớ), số lượng và thêm vào cart | Cart Service      |
| UC8  | Quản Lý Giỏ Hàng      | Xem, cập nhật số lượng, xóa sản phẩm khỏi cart       | Cart Service      |
| UC9  | Đặt Hàng              | Tạo đơn hàng từ giỏ hàng, nhập địa chỉ giao hàng     | Order Service     |
| UC10 | Thanh Toán            | Thanh toán qua VNPay hoặc COD                        | Payment Service   |
| UC11 | Theo Dõi Đơn Hàng     | Xem trạng thái đơn hàng (11 trạng thái)              | Order Manager     |
| UC12 | Hủy Đơn Hàng          | Hủy đơn hàng ở trạng thái cho phép                   | Order Manager     |
| UC13 | Viết Đánh Giá         | Đánh giá sản phẩm (rating 1-5, comment, hình ảnh)    | Review Service    |
| UC14 | Chatbox AI            | Tương tác với Dialogflow bot để tư vấn sản phẩm      | Chatbox Service   |

**B. Use Cases Quản Trị Viên:**

| ID   | Tên Use Case       | Mô tả ngắn                                         | Service liên quan |
| ---- | ------------------ | -------------------------------------------------- | ----------------- |
| UC15 | Quản Lý Sản Phẩm   | CRUD sản phẩm, quản lý variants, tồn kho, hình ảnh | Product Manager   |
| UC16 | Quản Lý Đơn Hàng   | Cập nhật trạng thái đơn hàng, xử lý hoàn/hủy       | Order Manager     |
| UC17 | Quản Lý Người Dùng | Xem danh sách user, block/unblock, phân quyền      | User Manager      |
| UC18 | Thống Kê           | Xem báo cáo doanh thu, sản phẩm bán chạy, đánh giá | Order Manager     |

---

## 2. MÔ TẢ CHI TIẾT USE CASES

### UC2: Đăng Nhập Hệ Thống

**Tên Use Case**: Đăng nhập hệ thống  
**Tác nhân**: Khách hàng, Quản trị viên  
**Mục tiêu**: Xác thực người dùng và cấp quyền truy cập hệ thống  
**Điều kiện tiên quyết**: Người dùng đã có tài khoản đăng ký  
**Service**: User Service (Port 3005)

#### Luồng chính:

1. Người dùng truy cập trang đăng nhập
2. Người dùng nhập email và mật khẩu
3. Hệ thống kiểm tra thông tin đăng nhập
   - Tìm user theo email trong database
   - So sánh mật khẩu đã hash với bcrypt
4. Nếu thông tin hợp lệ:
   - Tạo Access Token (JWT, thời hạn 15 phút)
   - Tạo Refresh Token (JWT, thời hạn 7 ngày)
   - Lưu Refresh Token vào database (trường `tokens.refreshToken`)
   - Trả về tokens và thông tin user (email, isAdmin, avatarUrl)
5. Client lưu Access Token vào localStorage
6. Client lưu Refresh Token vào httpOnly cookie
7. Chuyển hướng về trang chủ hoặc trang yêu cầu trước đó

#### Luồng thay thế:

**3a. Email không tồn tại:**

- Hiển thị thông báo "Email hoặc mật khẩu không đúng"
- Quay lại bước 2

**3b. Mật khẩu sai:**

- Hiển thị thông báo "Email hoặc mật khẩu không đúng"
- Quay lại bước 2

**3c. Tài khoản chưa verify email:**

- Hiển thị thông báo "Vui lòng verify email trước khi đăng nhập"
- Cung cấp link gửi lại email verification

#### Kết quả:

- User đăng nhập thành công với Access Token và Refresh Token
- Hệ thống nhận diện quyền của user (isAdmin: true/false)

#### Công nghệ sử dụng:

- `bcrypt` để hash/compare password
- `jsonwebtoken` để tạo JWT tokens
- MongoDB lưu trữ user và refresh tokens
- Express.js middleware xác thực token cho các request tiếp theo

#### API Endpoint:

```http
POST /api/users/login
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "password123"
}

Response (200 OK):
{
  "success": true,
  "data": {
    "user": {
      "_id": "65f123...",
      "email": "user@example.com",
      "firstName": "Nguyễn",
      "lastName": "Văn A",
      "isAdmin": false,
      "avatarUrl": "https://..."
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### UC9: Đặt Hàng

**Tên Use Case**: Đặt hàng  
**Tác nhân**: Khách hàng đã đăng nhập  
**Mục tiêu**: Tạo đơn hàng từ giỏ hàng và xác nhận thông tin giao hàng  
**Điều kiện tiên quyết**:

- Người dùng đã đăng nhập
- Giỏ hàng có ít nhất 1 sản phẩm  
  **Service**: Order Service (Port 3002), Cart Service (Port 3003)

#### Luồng chính:

1. Người dùng vào giỏ hàng, click "Tiến hành đặt hàng"
2. Hệ thống lấy thông tin giỏ hàng từ Cart Service
   - `GET /api/cart/:userId`
   - Kiểm tra tồn kho cho từng sản phẩm
   - Tính tổng giá trị (itemsPrice)
3. Người dùng nhập/chọn thông tin giao hàng:
   - Họ tên người nhận
   - Số điện thoại
   - Địa chỉ cụ thể (số nhà, đường)
   - Phường/Xã
   - Quận/Huyện
   - Tỉnh/Thành phố
   - Ghi chú (optional)
4. Người dùng chọn phương thức thanh toán:
   - COD (Thanh toán khi nhận hàng)
   - VNPay (Thanh toán online)
5. Hệ thống tính toán chi tiết:
   ```
   itemsPrice = Σ(item.price × item.quantity)
   shippingPrice = 30000 VNĐ (cố định)
   taxPrice = itemsPrice × 0.1 (10%)
   totalPrice = itemsPrice + shippingPrice + taxPrice - discountAmount
   ```
6. Người dùng xác nhận đặt hàng
7. Hệ thống tạo đơn hàng:
   - `POST /api/orders/create`
   - Tạo Order document trong MongoDB
   - Status: `pending_payment` (VNPay) hoặc `pending` (COD)
8. Nếu chọn VNPay: Chuyển sang UC10
9. Nếu chọn COD:
   - Gửi email xác nhận đơn hàng
   - Xóa giỏ hàng
10. Hiển thị trang xác nhận đơn hàng thành công
11. Chuyển hướng đến trang theo dõi đơn hàng

#### Luồng thay thế:

**2a. Giỏ hàng trống:**

- Hiển thị thông báo "Giỏ hàng trống"
- Chuyển về trang sản phẩm

**2b. Sản phẩm hết hàng:**

- Hiển thị thông báo "Sản phẩm [tên SP] đã hết hàng"
- Tự động xóa sản phẩm khỏi giỏ hàng
- Yêu cầu người dùng kiểm tra lại giỏ hàng

**3a. Thông tin giao hàng không hợp lệ:**

- Highlight các trường bị lỗi (validation)
- Yêu cầu nhập lại

**7a. Lỗi tạo đơn hàng (database error):**

- Hiển thị thông báo "Không thể tạo đơn hàng, vui lòng thử lại"
- Rollback các thay đổi

#### Kết quả:

- Đơn hàng được tạo thành công với mã đơn hàng (orderId)
- Giỏ hàng được xóa
- Email xác nhận được gửi
- Trạng thái đơn hàng: `pending` (COD) hoặc `pending_payment` (VNPay)

#### Dữ liệu Order được lưu:

```javascript
{
  _id: ObjectId,
  userId: ObjectId("65f123..."),
  orderItems: [
    {
      productId: ObjectId("65f456..."),
      name: "iPhone 15 Pro Max",
      slug: "iphone-15-pro-max",
      variant: {
        color: "Titan Tự Nhiên",
        memory: "256GB",
        sku: "IP15PM-256-TN"
      },
      quantity: 1,
      price: 29990000,
      thumbUrl: "https://...",
      subtotal: 29990000
    }
  ],
  shippingAddress: {
    fullName: "Nguyễn Văn A",
    phone: "0901234567",
    address: "123 Đường ABC",
    ward: "Phường 1",
    district: "Quận 1",
    province: "TP.HCM",
    note: "Gọi trước khi giao"
  },
  paymentMethod: "COD",
  itemsPrice: 29990000,
  shippingPrice: 30000,
  taxPrice: 2999000,
  discountAmount: 0,
  totalPrice: 33019000,
  status: "pending",
  statusHistory: [
    {
      status: "pending",
      timestamp: ISODate("2024-01-15T10:30:00Z"),
      note: "Đơn hàng đã được tạo"
    }
  ],
  createdAt: ISODate("2024-01-15T10:30:00Z"),
  updatedAt: ISODate("2024-01-15T10:30:00Z")
}
```

#### API Endpoint:

```http
POST /api/orders/create
Authorization: Bearer <accessToken>
Content-Type: application/json

Request Body:
{
  "shippingAddress": {
    "fullName": "Nguyễn Văn A",
    "phone": "0901234567",
    "address": "123 Đường ABC",
    "ward": "Phường 1",
    "district": "Quận 1",
    "province": "TP.HCM",
    "note": "Gọi trước khi giao"
  },
  "paymentMethod": "COD"
}

Response (201 Created):
{
  "success": true,
  "data": {
    "orderId": "65f789...",
    "totalPrice": 33019000,
    "status": "pending"
  }
}
```

---

### UC10: Thanh Toán VNPay

**Tên Use Case**: Thanh toán online qua VNPay  
**Tác nhân**: Khách hàng đã đăng nhập  
**Mục tiêu**: Xử lý thanh toán online an toàn qua cổng VNPay  
**Điều kiện tiên quyết**:

- Đơn hàng đã được tạo với status `pending_payment`
- Người dùng có thẻ ATM/Visa/MasterCard  
  **Service**: Payment Service (Port 3004), Order Service (Port 3002)

#### Luồng chính:

1. Sau khi tạo đơn hàng (UC9), hệ thống tạo payment record:

   - `POST /api/payments/create`
   - Tạo Payment document với status `pending`

2. Hệ thống tạo VNPay payment URL:

   - Lấy thông tin từ config (TMN_CODE, HASH_SECRET, VNP_URL)
   - Tạo các tham số:
     ```javascript
     {
       vnp_TmnCode: "SMARTBUY01",
       vnp_Amount: 3301900000,  // amount * 100
       vnp_OrderInfo: "Thanh toan don hang #65f789...",
       vnp_ReturnUrl: "http://localhost/payment/vnpay-return",
       vnp_TxnRef: "65fabc...",  // paymentId
       vnp_CreateDate: "20240115103000",
       vnp_IpAddr: "14.231.12.34"
     }
     ```
   - Tạo chữ ký hash HMAC SHA512
   - Ghép thành payment URL

3. Chuyển hướng user đến VNPay payment gateway

4. User nhập thông tin thẻ/chọn ngân hàng trên VNPay

5. VNPay callback về `vnp_ReturnUrl` với các tham số:

   - `vnp_ResponseCode`: "00" (thành công) hoặc khác (thất bại)
   - `vnp_TransactionNo`: Mã giao dịch VNPay
   - `vnp_BankCode`: Mã ngân hàng
   - `vnp_CardType`: Loại thẻ (ATM/VISA/...)
   - `vnp_SecureHash`: Chữ ký để verify

6. Hệ thống verify callback:

   - Kiểm tra `vnp_SecureHash` có hợp lệ
   - Kiểm tra `vnp_TxnRef` (paymentId) có tồn tại
   - Kiểm tra payment chưa được xử lý (status = `pending`)

7. Nếu `vnp_ResponseCode = "00"`:

   - Cập nhật Payment: status = `paid`, lưu thông tin giao dịch
   - Cập nhật Order: status = `pending`, isPaid = true
   - Xóa giỏ hàng
   - Gửi email xác nhận thanh toán thành công

8. Nếu `vnp_ResponseCode != "00"`:

   - Cập nhật Payment: status = `failed`
   - Cập nhật Order: status = `cancelled`
   - Hiển thị thông báo lỗi tương ứng

9. Chuyển hướng user đến trang kết quả thanh toán

#### Luồng thay thế:

**6a. SecureHash không hợp lệ:**

- Log cảnh báo bảo mật
- Trả về lỗi 400 Bad Request

**6b. Payment không tồn tại:**

- Hiển thị thông báo "Giao dịch không tồn tại"
- Chuyển về trang chủ

**6c. Payment đã được xử lý:**

- Hiển thị thông báo "Giao dịch đã được xử lý trước đó"
- Chuyển đến trang chi tiết đơn hàng

**8a. User hủy thanh toán trên VNPay:**

- `vnp_ResponseCode = "24"`
- Payment status = `cancelled`
- Order status giữ nguyên `pending_payment`
- Cho phép user thử thanh toán lại

#### Kết quả thành công:

- Payment status: `paid`
- Order status: `pending` (chờ xác nhận)
- Order.isPaid: true
- Giỏ hàng đã xóa
- Email xác nhận đã gửi

#### Mã lỗi VNPay thường gặp:

| Mã  | Ý nghĩa                                      |
| --- | -------------------------------------------- |
| 00  | Giao dịch thành công                         |
| 07  | Trừ tiền thành công nhưng giao dịch nghi ngờ |
| 09  | Thẻ chưa đăng ký Internet Banking            |
| 10  | Xác thực thông tin thẻ thất bại              |
| 11  | Hết hạn chờ thanh toán (15 phút)             |
| 12  | Thẻ bị khóa                                  |
| 13  | Sai OTP                                      |
| 24  | Khách hàng hủy giao dịch                     |
| 51  | Tài khoản không đủ số dư                     |
| 65  | Vượt quá số lần nhập OTP                     |

#### Công nghệ sử dụng:

- Payment Service (Node.js + Express)
- VNPay API với HMAC SHA512 signature
- MongoDB để lưu payment records
- Crypto module để tạo hash
- Query-string để parse callback params

#### API Endpoints:

**1. Tạo Payment URL:**

```http
POST /api/payments/create
Authorization: Bearer <accessToken>
Content-Type: application/json

Request Body:
{
  "orderId": "65f789...",
  "amount": 33019000,
  "returnUrl": "http://localhost/payment/vnpay-return"
}

Response (200 OK):
{
  "success": true,
  "data": {
    "paymentId": "65fabc...",
    "paymentUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?..."
  }
}
```

**2. VNPay Callback:**

```http
GET /api/payments/vnpay-return?vnp_ResponseCode=00&vnp_TransactionNo=14123456&...

Response: Redirect to
- Success: /order-success?orderId=65f789...
- Failed: /order-failed?error=payment_failed
```

---

## 3. SEQUENCE DIAGRAMS

### 3.1. Sequence Diagram - Đăng Nhập

```
┌──────┐        ┌────────┐      ┌─────────────┐     ┌──────────────┐
│Client│        │API GW  │      │User Service │     │  MongoDB     │
└──┬───┘        └───┬────┘      └──────┬──────┘     └──────┬───────┘
   │                │                  │                    │
   │ 1. POST /login │                  │                    │
   ├───────────────►│                  │                    │
   │ {email, pwd}   │                  │                    │
   │                │ 2. Forward       │                    │
   │                ├─────────────────►│                    │
   │                │                  │ 3. Find user       │
   │                │                  ├───────────────────►│
   │                │                  │   by email         │
   │                │                  │◄───────────────────┤
   │                │                  │ 4. User document   │
   │                │                  │                    │
   │                │                  │ 5. bcrypt.compare()│
   │                │                  ├────┐               │
   │                │                  │    │ password      │
   │                │                  │◄───┘               │
   │                │                  │                    │
   │                │                  │ 6. Generate tokens │
   │                │                  ├────┐               │
   │                │                  │    │ - accessToken │
   │                │                  │    │ - refreshToken│
   │                │                  │◄───┘               │
   │                │                  │                    │
   │                │                  │ 7. Save refresh    │
   │                │                  │    token to DB     │
   │                │                  ├───────────────────►│
   │                │                  │◄───────────────────┤
   │                │                  │                    │
   │                │ 8. Return tokens │                    │
   │                │    & user info   │                    │
   │                │◄─────────────────┤                    │
   │ 9. 200 OK      │                  │                    │
   │ {accessToken,  │                  │                    │
   │  refreshToken, │                  │                    │
   │  user}         │                  │                    │
   │◄───────────────┤                  │                    │
   │                │                  │                    │
   │ 10. Store      │                  │                    │
   │     tokens     │                  │                    │
   ├────┐           │                  │                    │
   │    │localStorage│                 │                    │
   │◄───┘           │                  │                    │
```

---

### 3.2. Sequence Diagram - Đặt Hàng & Thanh Toán VNPay

```
┌───────┐  ┌───────┐  ┌────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  ┌───────┐
│Client │  │API GW │  │Cart Svc│  │Order Svc │  │Payment   │  │VNPay   │  │Email  │
│       │  │       │  │        │  │          │  │Service   │  │Gateway │  │Service│
└───┬───┘  └───┬───┘  └───┬────┘  └────┬─────┘  └────┬─────┘  └───┬────┘  └───┬───┘
    │          │          │            │             │            │          │
    │ 1. GET   │          │            │             │            │          │
    │  /cart   │          │            │             │            │          │
    ├─────────►│          │            │             │            │          │
    │          ├─────────►│            │             │            │          │
    │          │          │ 2. Get cart│             │            │          │
    │          │          │   items    │             │            │          │
    │          │◄─────────┤            │             │            │          │
    │◄─────────┤          │            │             │            │          │
    │          │          │            │             │            │          │
    │ 4. POST  │          │            │             │            │          │
    │  /orders │          │            │             │            │          │
    ├─────────►│          │            │             │            │          │
    │          ├────────────────────────┤             │            │          │
    │          │          │            │ 5. Create   │            │          │
    │          │          │            │    order    │            │          │
    │          │          │            ├────┐        │            │          │
    │          │          │            │    │Calculate            │          │
    │          │          │            │◄───┘prices  │            │          │
    │          │          │            ├────────────►│            │          │
    │          │          │            │ 7. Create   │            │          │
    │          │          │            │    payment  │            │          │
    │          │          │            │             ├───────────►│          │
    │          │          │            │             │ 8. Create  │          │
    │          │          │            │             │   VNPay URL│          │
    │          │          │            │             │◄───────────┤          │
    │          │◄───────────────────────┴─────────────┤            │          │
    │◄─────────┤          │            │             │            │          │
    │          │          │            │             │            │          │
    │ 11. Redirect to VNPay            │             │            │          │
    ├────────────────────────────────────────────────────────────►│          │
    │          │          │            │             │            │          │
    │ 12. Pay  │          │            │             │            │          │
    ├─────────►│          │            │             │            │          │
    │          │          │            │             │◄───────────┤          │
    │          │          │            │             │ 13. Callback          │
    │          │          │            │             │            │          │
    │          │          │            │◄────────────┤            │          │
    │          │          │            │ 15. Update  │            │          │
    │          │          │            │     payment │            │          │
    │          │          │            ├────┐        │            │          │
    │          │          │            │    │Update  │            │          │
    │          │          │            │◄───┘order   │            │          │
    │          │          │◄───────────┤             │            │          │
    │          │          │ 17. Clear  │             │            │          │
    │          │          │     cart   │             │            │          │
    │          │          │            ├───────────────────────────────────►│
    │          │          │            │ 18. Send email          │          │
    │◄─────────────────────────────────┤             │            │          │
    │ 20. Success page    │            │             │            │          │
```

---

## 4. CLASS DIAGRAM TOÀN HỆ THỐNG

```
┌─────────────────────────────────────┐
│           User                      │
├─────────────────────────────────────┤
│ - _id: ObjectId                     │
│ - email: String {unique, required}  │
│ - password: String {required}       │
│ - firstName: String                 │
│ - lastName: String                  │
│ - avatarUrl: String                 │
│ - phoneNumber: String               │
│ - dateOfBirth: Date                 │
│ - isAdmin: Boolean {default: false} │
│ - isVerified: Boolean               │
│ - tokens: {                         │
│     refreshToken: String,           │
│     verificationToken: String,      │
│     passwordResetToken: String,     │
│     passwordResetExpires: Date      │
│   }                                 │
│ - createdAt: Date                   │
│ - updatedAt: Date                   │
├─────────────────────────────────────┤
│ + hashPassword(): Promise<void>     │
│ + comparePassword(pwd): Boolean     │
│ + generateAuthToken(): String       │
│ + generateRefreshToken(): String    │
│ + generateResetToken(): String      │
└─────────────────────────────────────┘
           │
           │ 1
           │
           │ *
┌──────────▼──────────────────────────┐
│           Cart                      │
├─────────────────────────────────────┤
│ - _id: ObjectId                     │
│ - userId: ObjectId {ref: 'User'}    │
│ - items: CartItem[]                 │
│ - subtotal: Number                  │
│ - createdAt: Date                   │
│ - updatedAt: Date                   │
├─────────────────────────────────────┤
│ + calculateSubtotal(): Number       │
│ + addItem(product, variant): void   │
│ + updateQuantity(itemId, qty): void │
│ + removeItem(itemId): void          │
│ + clearCart(): void                 │
└─────────────────────────────────────┘
           │
           │ contains
           │ 1..*
┌──────────▼──────────────────────────┐         ┌─────────────────────────────┐
│        CartItem                     │         │         Product             │
├─────────────────────────────────────┤         ├─────────────────────────────┤
│ - _id: ObjectId                     │   *     │ - _id: ObjectId             │
│ - productId: ObjectId ──────────────┼────────►│ - name: String {required}   │
│ - name: String                      │   ref   │ - slug: String {unique}     │
│ - thumbUrl: String                  │         │ - description: String       │
│ - variant: {                        │         │ - thumbUrl: String          │
│     color: String,                  │         │ - basePrice: Number         │
│     memory: String,                 │         │ - discountPercentage: Number│
│     sku: String                     │         │ - brandId: ObjectId         │
│   }                                 │         │ - categoryId: ObjectId      │
│ - quantity: Number {min: 1}         │         │ - variants: Variant[]       │
│ - price: Number                     │         │ - images: String[]          │
│ - subtotal: Number                  │         │ - isActive: Boolean         │
├─────────────────────────────────────┤         │ - createdAt: Date           │
│ + calculateSubtotal(): Number       │         │ - updatedAt: Date           │
└─────────────────────────────────────┘         ├─────────────────────────────┤
                                                │ + generateSlug(): String    │
                                                │ + getFinalPrice(): Number   │
                                                └─────────────────────────────┘
                                                           │
                                                           │ 1
                                                           │ *
                                                ┌──────────▼──────────────────┐
                                                │       Variant               │
                                                ├─────────────────────────────┤
                                                │ - color: String             │
                                                │ - memory: String            │
                                                │ - sku: String {unique}      │
                                                │ - price: Number             │
                                                │ - stock: Number             │
                                                │ - images: String[]          │
                                                └─────────────────────────────┘


┌─────────────────────────────────────┐
│           Order                     │
├─────────────────────────────────────┤
│ - _id: ObjectId                     │
│ - userId: ObjectId {ref: 'User'} ◄──┼─────────── User (1)
│ - orderItems: OrderItem[]           │
│ - shippingAddress: {                │
│     fullName: String,               │
│     phone: String,                  │
│     address: String,                │
│     ward: String,                   │
│     district: String,               │
│     province: String,               │
│     note: String                    │
│   }                                 │
│ - paymentMethod: String             │
│   {enum: ['COD', 'VNPAY', 'MOMO']}  │
│ - itemsPrice: Number                │
│ - shippingPrice: Number             │
│ - taxPrice: Number                  │
│ - discountAmount: Number            │
│ - totalPrice: Number                │
│ - status: String {enum}             │
│ - isPaid: Boolean                   │
│ - paidAt: Date                      │
│ - isDelivered: Boolean              │
│ - deliveredAt: Date                 │
│ - statusHistory: StatusHistoryItem[]│
│ - couponCode: String                │
│ - createdAt: Date                   │
│ - updatedAt: Date                   │
├─────────────────────────────────────┤
│ + calculateTotalPrice(): Number     │
│ + updateStatus(status, note): void  │
│ + canBeCancelled(): Boolean         │
│ + canBeReturned(): Boolean          │
└─────────────────────────────────────┘
           │
           │ contains
           │ 1..*
┌──────────▼──────────────────────────┐
│        OrderItem                    │
├─────────────────────────────────────┤
│ - productId: ObjectId               │
│ - name: String                      │
│ - slug: String                      │
│ - thumbUrl: String                  │
│ - variant: {                        │
│     color: String,                  │
│     memory: String,                 │
│     sku: String                     │
│   }                                 │
│ - quantity: Number                  │
│ - price: Number                     │
│ - subtotal: Number                  │
└─────────────────────────────────────┘


┌─────────────────────────────────────┐              ┌─────────────────────────┐
│          Payment                    │              │        Order            │
├─────────────────────────────────────┤        1     ├─────────────────────────┤
│ - _id: ObjectId                     │   ◄──────────┤ (from above)            │
│ - orderId: ObjectId {ref: 'Order'}  │              └─────────────────────────┘
│ - userId: ObjectId {ref: 'User'}    │
│ - amount: Number {required}         │
│ - currency: String {default: 'VND'} │
│ - paymentMethod: String {enum}      │
│ - status: String {enum: [           │
│     'pending', 'processing',        │
│     'paid', 'failed',               │
│     'cancelled', 'refunded'         │
│   ]}                                │
│ - transactionId: String             │
│ - externalTransactionId: String     │
│ - bankCode: String                  │
│ - cardType: String                  │
│ - paymentUrl: String                │
│ - paidAt: Date                      │
│ - failedReason: String              │
│ - refundedAt: Date                  │
│ - refundAmount: Number              │
│ - metadata: Object                  │
│ - createdAt: Date                   │
│ - updatedAt: Date                   │
├─────────────────────────────────────┤
│ + createVNPayUrl(): String          │
│ + verifyVNPayCallback(params): Bool │
│ + processPayment(): Promise         │
│ + refund(amount): Promise           │
└─────────────────────────────────────┘


┌─────────────────────────────────────┐
│          Review                     │
├─────────────────────────────────────┤
│ - _id: ObjectId                     │      *
│ - userId: String (ref: 'User')  ────┼──────────► User
│ - productId: String (ref: 'Product')┼──────────► Product
│ - rating: Number {min:1, max:5}     │      *
│ - comment: String {maxlength: 1000} │
│ - userName: String                  │
│ - productName: String               │
│ - images: String[]                  │
│ - helpfulCount: Number {default: 0} │
│ - helpfulBy: String[]               │
│ - isVisible: Boolean {default: true}│
│ - hiddenReason: String              │
│ - hiddenBy: String                  │
│ - hiddenAt: Date                    │
│ - createdAt: Date                   │
│ - updatedAt: Date                   │
├─────────────────────────────────────┤
│ + markHelpful(userId): void         │
│ + hide(adminId, reason): void       │
│ + show(): void                      │
└─────────────────────────────────────┘
```

### Giải thích quan hệ giữa các Class:

| Quan hệ            | Loại             | Cardinality | Mô tả                                          |
| ------------------ | ---------------- | ----------- | ---------------------------------------------- |
| User → Cart        | Virtual Populate | 1:\*        | Một user có nhiều cart (thực tế 1 active cart) |
| Cart → CartItem    | Embedded         | 1:\*        | Một giỏ hàng chứa nhiều CartItem               |
| CartItem → Product | Reference        | \*:1        | Nhiều CartItem tham chiếu đến cùng Product     |
| Product → Variant  | Embedded         | 1:\*        | Một sản phẩm có nhiều variants                 |
| User → Order       | Reference        | 1:\*        | Một user tạo nhiều đơn hàng                    |
| Order → OrderItem  | Embedded         | 1:\*        | Một đơn hàng chứa nhiều OrderItem (snapshot)   |
| Order → Payment    | Reference        | 1:1         | Một đơn hàng có một payment record             |
| User → Payment     | Reference        | 1:\*        | Một user có nhiều payment transactions         |
| User → Review      | String Ref       | 1:\*        | Một user viết nhiều reviews                    |
| Product → Review   | String Ref       | 1:\*        | Một sản phẩm có nhiều reviews                  |

---

## 5. DESIGN PATTERNS

### 5.1. Repository Pattern

**Mục đích**: Tách biệt logic truy cập dữ liệu khỏi business logic

**Cấu trúc**:

```
Controller (HTTP) → Service (Business Logic) → Model (Database)
```

**Ví dụ**:

```javascript
// userService.js
class UserService {
  async createUser(userData) {
    // Business logic: validate, hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Repository: save to DB
    const user = await User.create({
      ...userData,
      password: hashedPassword,
    });

    return user;
  }
}

// userController.js
exports.register = async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(201).json({ user });
};
```

---

### 5.2. DTO Pattern (Data Transfer Object)

**Mục đích**: Chỉ trả về dữ liệu cần thiết cho client, bảo mật thông tin nhạy cảm

**Ví dụ**:

```javascript
// Không trả về password và refresh token
const userDTO = {
  _id: user._id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  isAdmin: user.isAdmin,
  avatarUrl: user.avatarUrl,
  // KHÔNG có: password, tokens.refreshToken
};
```

---

### 5.3. Snapshot Pattern

**Mục đích**: Lưu trữ dữ liệu tại thời điểm cụ thể, không bị ảnh hưởng bởi thay đổi sau này

**Ví dụ**: OrderItem lưu snapshot của Product

```javascript
// Khi tạo đơn hàng, lưu thông tin sản phẩm hiện tại
const orderItem = {
  productId: product._id,
  name: product.name,           // Snapshot tên
  price: product.finalPrice,    // Snapshot giá
  thumbUrl: product.thumbUrl,   // Snapshot ảnh
  variant: { ... }              // Snapshot variant
};

// Sau này product có thể đổi tên/giá, nhưng OrderItem không thay đổi
```

---

### 5.4. Strategy Pattern

**Mục đích**: Cho phép chọn thuật toán/chiến lược khác nhau tại runtime

**Ví dụ**: Payment strategies

```javascript
class CODPaymentStrategy {
  async process(order) {
    order.status = "pending";
    order.isPaid = false;
    return { success: true };
  }
}

class VNPayPaymentStrategy {
  async process(order) {
    const paymentUrl = await this.createVNPayUrl(order);
    order.status = "pending_payment";
    return { success: true, paymentUrl };
  }
}

// Sử dụng
const strategy =
  paymentMethod === "COD"
    ? new CODPaymentStrategy()
    : new VNPayPaymentStrategy();

await strategy.process(order);
```

---

### 5.5. Observer Pattern

**Mục đích**: Tự động thực hiện actions khi có sự kiện xảy ra

**Ví dụ**: Event-driven notifications

```javascript
// Sau khi đơn hàng được tạo
orderSchema.post("save", async function () {
  // Gửi email xác nhận
  await emailService.sendOrderConfirmation(this);

  // Thông báo cho admin
  await notificationService.notifyNewOrder(this);

  // Log analytics
  await analyticsService.trackOrder(this);
});
```

---

### 5.6. State Pattern

**Mục đích**: Quản lý trạng thái phức tạp với các transition rules

**Ví dụ**: Order status workflow

```javascript
const ORDER_STATUS_TRANSITIONS = {
  pending_payment: ["pending", "cancelled"],
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing"],
  processing: ["ready_to_ship", "cancelled"],
  ready_to_ship: ["shipping"],
  shipping: ["delivered", "return_requested"],
  delivered: ["completed", "return_requested"],
  // ...
};

orderSchema.methods.canTransitionTo = function (newStatus) {
  const allowedTransitions = ORDER_STATUS_TRANSITIONS[this.status] || [];
  return allowedTransitions.includes(newStatus);
};
```

---

## PHỤ LỤC

### Order Status Workflow

```
┌─────────────────┐
│ pending_payment │ (Chờ thanh toán online)
└────────┬────────┘
         │
         ├──► cancelled (User hủy/timeout)
         │
         ▼
    ┌─────────┐
    │ pending │ (Chờ xác nhận)
    └────┬────┘
         │
         ├──► cancelled (User hủy)
         │
         ▼
  ┌───────────┐
  │ confirmed │ (Đã xác nhận)
  └─────┬─────┘
        │
        ▼
 ┌────────────┐
 │ processing │ (Đang xử lý)
 └──────┬─────┘
        │
        ├──► cancelled (Admin hủy)
        │
        ▼
┌───────────────┐
│ ready_to_ship │ (Sẵn sàng giao)
└───────┬───────┘
        │
        ▼
  ┌──────────┐
  │ shipping │ (Đang giao)
  └────┬─────┘
       │
       ├──► delivered (Giao thành công)
       │
       └──► return_requested (Yêu cầu trả hàng)
             │
             ├──► returning (Đang trả hàng)
             │     │
             │     └──► returned (Đã trả)
             │
             └──► delivered (Từ chối trả)

  ┌───────────┐
  │ delivered │ (Đã giao)
  └─────┬─────┘
        │
        └──► completed (Hoàn thành)
```

---

**Hết tài liệu**
