# Hướng dẫn chi tiết: userservice

## 1. Tổng quan (Lý thuyết)
`userservice` là service trung tâm chịu trách nhiệm quản lý người dùng và xác thực trong hệ thống SmartBuy. 
- **Chức năng chính**: Đăng ký, đăng nhập (Local, Google, Facebook), quản lý Profile, thay đổi mật khẩu, quên mật khẩu (OTP), và quản lý địa chỉ giao hàng.
- **Công nghệ**: Node.js, Express, MongoDB (Mongoose), JWT, Passport.js.
- **Cổng kết nối (Port)**: 3005.

---

## 2. Kết nối Database & Mô hình dữ liệu (Models)

### 2.1. Kết nối Database
Service sử dụng Mongoose để kết nối với MongoDB. Cấu hình được đặt tại `config/connectDB.js`.
- URL kết nối được lấy từ biến môi trường `MONGODB_URL`.
- Sử dụng cơ chế kết nối bất đồng bộ (`async/await`) để đảm bảo hệ thống chỉ chạy khi DB đã sẵn sàng.

### 2.2. Schema chính

#### User (`models/user.js`)
Lưu trữ thông tin cơ bản và trạng thái của người dùng.
- `userName`, `email`, `password` (đã mã hóa bcrypt).
- `avatarUrl`: Ảnh đại diện (được chọn ngẫu nhiên từ thư mục `avarta` khi đăng ký).
- `isAdmin`, `isVerified`, `isBlocked`: Các cờ trạng thái quan trọng.
- `refreshToken`: Lưu token để cấp lại Access Token mới mà không bắt user đăng nhập lại.
- `verificationToken`, `passwordToken`: Lưu mã OTP cho xác thực email hoặc quên mật khẩu.

#### Address (`models/address.js`)
Lưu trữ địa chỉ giao hàng của người dùng.
- Liên kết với User qua `userId` (ref: 'User').
- Các thông tin: `fullName`, `phone`, `province`, `district`, `ward`, `address`.
- `isDefault`: Đánh dấu địa chỉ mặc định khi đặt hàng.

---

## 3. API & Controllers

### 3.1. Xác thực (Auth Controller - `controllers/auth.controller.js`)
Đây là phần quan trọng nhất của service.

- **Đăng ký (`register`)**:
  - Nhận thông tin, kiểm tra email trùng lặp.
  - Tạo user mới với trạng thái `isVerified: false`.
  - Tạo OTP ngẫu nhiên, lưu vào DB và gửi email qua `mailer service`.
  - Yêu cầu Client chuyển sang bước nhập OTP.

- **Đăng nhập (`login`)**:
  - Kiểm tra thông tin, trạng thái `isVerified` và `isBlocked`.
  - Nếu hợp lệ, tạo cặp `accessToken` (ngắn hạn) và `refreshToken` (dài hạn).
  - Trả về thông tin user để Client lưu vào Store (Vuex/Pinia).

- **Quên mật khẩu (`forgotPassword` & `resetPassword`)**:
  - Gửi OTP qua email để xác nhận chủ sở hữu.
  - Cấp một `resetPasswordToken` (JWT) tạm thời để user truy cập form đổi mật khẩu.

- **Social Login (`google`, `facebook`)**:
  - Sử dụng Passport.js để giao tiếp với Google/Facebook.
  - Nếu thành công, redirect về Frontend kèm theo `userId`.

### 3.2. Quản lý Địa chỉ (Address Controller)
- Cung cấp các hàm CRUD (Create, Read, Update, Delete) cho địa chỉ.
- Hàm `setDefault` tự động bỏ mặc định các địa chỉ cũ và đặt mặc định cho địa chỉ mới được chọn.

---

## 4. Middleware & Bảo mật

- **JWT Auth (`middleware/auth.js`)**: 
  - Trích xuất token từ header `Authorization: Bearer <token>`.
  - Giải mã và kiểm tra tính hợp lệ của token.
  - Gắn thông tin User (`req.user`) vào request để các controller phía sau sử dụng.
  - Kiểm tra xem tài khoản có bị khóa (`isBlocked`) ngay tại middleware này.

- **Mã hóa mật khẩu**: Sử dụng `bcrypt` thông qua hàm `hashPassword` trong pre-save hook của Mongoose. Mật khẩu không bao giờ được lưu dưới dạng văn bản thuần túy.

---

## 5. Các hàm tương tác với Giao diện (Client)

1. **`useAuth` (Frontend Hook)**: Gọi các API `/api/auth/login`, `/register`, `/profile` để quản lý trạng thái đăng nhập.
2. **`uploadAvatar`**: API cho phép người dùng tải ảnh lên. Server lưu ảnh vào thư mục `avarta` và trả về URL để UI hiển thị ngay lập tức.
3. **`updateProfile`**: Khi user đổi tên hoặc email, UI sẽ gọi API này. Nếu đổi email, UI sẽ hiển thị thêm popup nhập OTP để xác thực email mới.

---

> [!TIP]
> Để debug service này, bạn nên theo dõi log terminal của `userservice` (Port 3005). Các mã OTP cũng được log ra đây để tiện test mà không cần mở email.
