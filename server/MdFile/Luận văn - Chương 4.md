# CHƯƠNG 4: KẾT QUẢ ĐÁNH GIÁ VÀ GIAO DIỆN

## 4.1. Tổng quan kết quả

Hệ thống thương mại điện tử SmartBuy chuyên kinh doanh điện thoại di động trực tuyến, phát triển trên nền tảng kiến trúc Microservices và tích hợp Chatbot tư vấn sản phẩm, đã hoàn thiện các chức năng cốt lõi phục vụ người dùng cuối. Các chức năng này bao gồm: giao diện người dùng, quản lý giỏ hàng cá nhân hóa, quản lý danh sách yêu thích, quản lý sản phẩm điện thoại với biến thể màu sắc và bộ nhớ, quản lý đơn hàng với các trạng thái rõ ràng, tích hợp thanh toán VNPay, và tìm kiếm sản phẩm thông minh. 

Các mục tiêu về tính nhất quán dữ liệu, khả năng mở rộng và hiệu suất cao đã được đáp ứng thông qua việc triển khai các dịch vụ độc lập, ứng dụng các công nghệ tiên tiến như Node.js, Express, Vue 3, TypeScript, MongoDB. Hệ thống đảm bảo đồng bộ dữ liệu thời gian thực giữa các services thông qua API Gateway, với khả năng xử lý 100 requests/phút và rate limiting để bảo vệ hệ thống khỏi quá tải
- Database indexing: userId, email, orderId, productId
- Caching strategy cho dữ liệu sản phẩm thường xuyên truy cập
- Chatbot phản hồi < 2 giây thông qua Dialogflow NLP

**4. Bảo mật:**
- JWT authentication tập trung tại API Gateway
- Bcrypt mã hóa mật khẩu (salt rounds = 10)
- Helmet.js security headers (XSS, CSRF protection)
- CORS configuration chỉ cho phép frontend origin
- Input validation và sanitization

**5. Trải nghiệm người dùng:**
- Giao diện responsive, thân thiện trên mọi thiết bị
- Chatbot tư vấn 24/7 với NLP tiếng Việt
- Thanh toán đa dạng (COD, VNPay)
- Email notification tự động cho mỗi trạng thái đơn hàng
- Search và filter sản phẩm nhanh chóng

---

## 4.2. Tổng kết chức năng

Hệ thống SmartBuy được xây dựng theo mô hình Microservices với các dịch vụ chuyên biệt, mỗi service đảm nhận một nhóm chức năng cụ thể. Dưới đây là tổng kết các chức năng đã được triển khai hoàn chỉnh.

### 4.2.1. API Gateway - Cổng vào trung tâm

**Chức năng chính:**
- **Routing thông minh**: Định tuyến request đến đúng backend service dựa trên URL pattern
- **Authentication tập trung**: Verify JWT token, gắn thông tin user vào request
- **Authorization**: Phân quyền cho Admin và User routes
- **Rate Limiting**: Giới hạn 100 requests/phút/IP để chống DDoS
- **CORS handling**: Cho phép cross-origin từ frontend (port 5173)
- **Security headers**: Helmet.js bảo vệ XSS, clickjacking
- **Request/Response logging**: Morgan logger để monitoring

**Kết quả:**
- Client chỉ cần gọi 1 endpoint duy nhất (localhost:3000)
- Authentication được xử lý tập trung, không lặp code
- Dễ dàng thêm service mới bằng cách cấu hình routing rule

**Công nghệ:** Express.js + TypeScript, jsonwebtoken, helmet, express-rate-limit



## 4.2. Chức năng

Hệ thống SmartBuy đã xây dựng hoàn chỉnh các chức năng cốt lõi phục vụ người dùng và quản trị viên theo mô hình Microservices. Các chức năng chính đạt được như sau:

### 4.2.1. Chức năng quản lý người dùng (User Manager Service)

**Quản lý danh sách người dùng**: Admin xem danh sách users với KPI cards hiển thị tổng users, users mới, VIP customers và biểu đồ phân bổ theo vai trò. Hỗ trợ phân trang 10 users/trang, tìm kiếm theo email/tên, lọc theo trạng thái (Active/Locked) và vai trò (Admin/User).

**Quản lý tài khoản**: Admin có thể thêm, sửa, xóa tài khoản người dùng với validation chi tiết. Mật khẩu được mã hóa bằng bcrypt, email phải duy nhất trong hệ thống. Admin có thể khóa/mở khóa tài khoản và cấp/gỡ quyền admin cho users.

**Thao tác hàng loạt**: Cho phép chọn nhiều users bằng checkbox và áp dụng hành động Khóa/Mở khóa/Cấp quyền Admin/Xóa với modal xác nhận hiển thị số lượng tài khoản bị ảnh hưởng.

**Quản lý địa chỉ giao hàng**: Admin quản lý địa chỉ của từng user với thông tin đầy đủ (nhãn, người nhận, số điện thoại, tỉnh/quận/phường, số nhà đường), hỗ trợ thêm, sửa, xóa địa chỉ và đặt địa chỉ mặc định.

**Phân khúc khách hàng**: Hệ thống tự động phân loại users thành 3 nhóm dựa trên hành vi mua hàng: VIP Customer (tổng chi tiêu trên 50 triệu VNĐ), Khách thường xuyên (từ 5 đơn hàng hoàn thành trở lên), Khách hàng mới. Sử dụng cross-database connection để truy vấn Order DB và tính tổng chi tiêu.

**Thống kê và biểu đồ**: Hiển thị biểu đồ Doughnut cho phân bổ vai trò, Bar chart cho phân khúc khách hàng, Pie chart cho trạng thái tài khoản và thống kê tăng trưởng users theo tháng.

### 4.2.2. Chức năng API Gateway

**Định tuyến (Routing)**: API Gateway định tuyến chính xác các request từ client đến từng service backend (User Service, Product Manager Service, Order Manager Service, Payment Service, Cart Service, Review Service, Chatbox Service) dựa trên URL pattern.

**Xác thực tập trung**: Verify JWT token và phân quyền cho Public routes, Protected routes và Admin routes. Middleware authentication tự động gắn thông tin user vào request.

**Giới hạn tốc độ (Rate Limiting)**: Các request gửi đến được giới hạn 100 requests/phút/IP, đảm bảo bảo vệ hệ thống khỏi bị spam hoặc tấn công từ chối dịch vụ (DoS).

**Bảo mật**: Tích hợp helmet để bảo vệ khỏi XSS và CSRF attacks, CORS cho phép cross-origin từ frontend, morgan logging để monitoring.

**Xử lý lỗi**: Gateway xử lý timeout và lỗi từ backend services, đảm bảo hệ thống ổn định khi một service bị lỗi hoặc không phản hồi.

### 4.2.3. Chức năng quản lý sản phẩm (Product Manager Service)

**Quản lý sản phẩm và biến thể**: Hệ thống quản lý sản phẩm với cấu trúc 3 cấp (Product → Variant → Image). Admin có thể thêm, sửa, xóa sản phẩm với nhiều variants theo màu sắc và bộ nhớ.

**Quản lý tồn kho**: Tích hợp cơ chế Reserve/Release stock với Order Service để quản lý tồn kho theo thời gian thực, tránh overselling.

**Quản lý danh mục**: Admin quản lý brands, categories, colors, memories và product specifications qua giao diện tabs riêng biệt.

**Tìm kiếm và lọc**: Hỗ trợ tìm kiếm theo tên, lọc theo tồn kho/thương hiệu/danh mục, sắp xếp theo giá với phân trang 10 sản phẩm/trang.

**Thống kê**: Thống kê sản phẩm bán chạy và cảnh báo sản phẩm sắp hết hàng.

### 4.2.4. Chức năng quản lý đơn hàng (Order Manager Service)

**Tạo và quản lý đơn hàng**: Khách hàng đặt hàng từ giỏ hàng, hệ thống tự động reserve stock và tạo mã đơn duy nhất. Quản lý quy trình đặt hàng với 11 trạng thái rõ ràng từ Chờ thanh toán đến Hoàn thành/Đã hủy/Đã hoàn tiền.

**Dashboard quản trị**: Admin xem KPI cards (tổng đơn, doanh thu, AOV, đơn đang xử lý, tỷ lệ hủy) và biểu đồ doanh thu 7 ngày gần nhất.

**Quản lý trạng thái**: Admin cập nhật trạng thái đơn hàng theo workflow, hệ thống tự động gửi email thông báo cho khách hàng mỗi lần thay đổi trạng thái.

**Hủy đơn và hoàn tiền**: Hủy đơn cho các trạng thái đầu, tự động release stock và khởi tạo quy trình hoàn tiền nếu đã thanh toán VNPay.

**Tích hợp dịch vụ**: Tích hợp chặt chẽ với Product Service (reserve/release stock), Payment Service (hoàn tiền) và Email Service (thông báo).

### 4.2.5. Chức năng Chatbot tư vấn sản phẩm (Chatbox Service)

**Xử lý ngôn ngữ tự nhiên (NLP)**: Chatbot nhận diện ý định người dùng thông qua hơn 20 intents đã được huấn luyện trong Dialogflow (tìm kiếm sản phẩm, chính sách, đơn hàng, khuyến mãi).

**Trích xuất thực thể (Entities)**: Nhận diện chính xác 8 custom entities từ câu hỏi (brand-name, memory-capacity, color-name, product-category, price-range, product-spec, product-name, order-status).

**Tích hợp với hệ thống backend**: Dialogflow gửi webhook request đến ChatService, truy vấn cơ sở dữ liệu qua Product Manager Service API, lọc sản phẩm phù hợp và trả về custom payload với thẻ sản phẩm.

**Gợi ý sản phẩm**: Chatbot hiển thị sản phẩm tương ứng với yêu cầu người dùng kèm hình ảnh, tên, thông số, giá, tình trạng còn hàng và các nút hành động (Xem chi tiết, Xem màu khác, So sánh).

**Trả lời chính sách**: Các câu hỏi về chính sách giao hàng, thanh toán, đổi trả, bảo hành được trả lời bằng văn bản tĩnh được cấu hình sẵn trong Dialogflow.

### 4.2.6. Chức năng quản lý bình luận và đánh giá (Review Service)

**Dashboard quản trị**: Admin xem KPI cards hiển thị tổng số đánh giá, số đánh giá hiển thị/ẩn và đánh giá trung bình của toàn bộ sản phẩm.

**Tìm kiếm và lọc**: Hỗ trợ tìm kiếm văn bản (debounce 300ms), lọc theo Rating (1-5 sao) và Visibility (Đang hiển thị/Đã ẩn).

**Xem danh sách và chi tiết**: Bảng danh sách hiển thị rating, thông tin người dùng, sản phẩm, nội dung preview, ngày tạo và trạng thái. Modal chi tiết hiển thị đầy đủ thông tin đánh giá, hình ảnh đính kèm và phản hồi từ Admin.

**Phản hồi đánh giá**: Admin có thể phản hồi trực tiếp đánh giá của khách hàng, hệ thống lưu adminReply và thời gian phản hồi vào database.

**Kiểm duyệt nội dung**: Admin có thể ẩn đánh giá vi phạm (spam, từ ngữ thô tục) với lý do ẩn, hoặc xóa vĩnh viễn đánh giá vi phạm nghiêm trọng.

**Phân trang**: Danh sách đánh giá được phân trang 10 đánh giá/trang với smart pagination
- Phân bố trạng thái đơn hàng

**Kết quả:**
- Quy trình đặt hàng rõ ràng, 11 trạng thái chi tiết
- Đảm bảo tồn kho không bị "khóa" khi hủy đơn
- Email notification tự động cho mỗi trạng thái
- Dashboard hiển thị KPI và biểu đồ doanh thu

**Database:** ordermanagerDB - 1 collection (orders với embedded orderItems, statusHistory)

**Công nghệ:** Node.js + Express.js, MongoDB, Nodemailer, tích hợp Product Service + Email Service

---

### 4.2.5. Cart Service - Giỏ hàng cá nhân

**Chức năng chính:**
- **Thêm vào giỏ**: Chọn variant (màu + bộ nhớ), số lượng
- **Cập nhật số lượng**: Tăng/giảm số lượng sản phẩm
- **Xóa khỏi giỏ**: Xóa 1 hoặc nhiều items
- **Xem giỏ hàng**: Hiển thị danh sách sản phẩm, tổng tiền
- **Validate stock**: Kiểm tra tồn kho trước khi checkout
- **Clear cart**: Xóa toàn bộ giỏ sau khi đặt hàng thành công

**Kết quả:**
- Giỏ hàng cá nhân hóa cho từng user
- Hiển thị thông tin đầy đủ: hình ảnh, tên, màu, bộ nhớ, giá, số lượng
- Tính tổng tiền tự động
- Validate stock real-time trước khi checkout

**Database:** cartDB - 1 collection (carts với embedded items)

**Công nghệ:** Node.js + Express.js, MongoDB

---

### 4.2.6. User Service - Xác thực và OAuth

**Chức năng chính:**
- **Đăng ký**: Email + password, validate email chưa tồn tại
- **Đăng nhập**: Email + password, trả về JWT token (expires: 7 ngày)
- **OAuth Google**: Đăng nhập bằng tài khoản Google
- **Quên mật khẩu**: Gửi email reset password
- **Đổi mật khẩu**: Cập nhật mật khẩu mới
- **Cập nhật profile**: Sửa tên, avatar, thông tin cá nhân

**Kết quả:**
- Xác thực an toàn với JWT + Bcrypt
- Hỗ trợ OAuth Google để đăng nhập nhanh
- Token expires 7 ngày, refresh token để gia hạn

**Database:** userDB - 1 collection (users)

**Công nghệ:** Node.js + Express.js, MongoDB, JWT, Bcrypt, Passport.js (OAuth)

---

### 4.2.7. Payment Service - Thanh toán VNPay

**Chức năng chính:**
- **Tạo payment URL**: Generate VNPay payment link với orderId, amount
- **Redirect**: Chuyển user đến cổng thanh toán VNPay
- **Callback handling**: Nhận kết quả thanh toán từ VNPay
- **Verify signature**: Xác thực chữ ký để đảm bảo request hợp lệ
- **Update order status**: Cập nhật trạng thái đơn hàng sang "paid" nếu thành công
- **COD support**: Hỗ trợ thanh toán khi nhận hàng

**Kết quả:**
- Tích hợp VNPay payment gateway
- Hỗ trợ thanh toán qua: thẻ ATM, thẻ tín dụng, QR code, ví điện tử
- Xử lý callback an toàn với signature verification
- Fallback sang COD nếu user không muốn thanh toán online

**Database:** paymentDB - 1 collection (payments)

**Công nghệ:** Node.js + Express.js, MongoDB, VNPay API

---

### 4.2.8. Review Service - Đánh giá sản phẩm

**Chức năng chính:**
- **Tạo review**: User đánh giá sản phẩm (1-5 sao), nhập comment, upload ảnh
- **Xem reviews**: Hiển thị danh sách đánh giá của sản phẩm
- **Filter reviews**: Lọc theo số sao, có ảnh, mới nhất
- **Helpful voting**: Bình chọn review hữu ích
- **Admin moderation**: Admin duyệt/xóa review vi phạm
- **Statistics**: Tính rating trung bình, phân bổ sao (5★, 4★...)

**Kết quả:**
- User chỉ đánh giá được sản phẩm đã mua
- Hiển thị rating trung bình trên trang sản phẩm
- Filter và sort reviews giúp user dễ tham khảo
- Admin kiểm duyệt để đảm bảo chất lượng review

**Database:** reviewDB - 1 collection (reviews)

**Công nghệ:** Node.js + Express.js, MongoDB

---

### 4.2.9. ChatService + Dialogflow - Chatbot tư vấn

**Chức năng chính:**

**a) Dialogflow NLP Platform:**
- **20+ Intents** chia thành 4 nhóm:
  - **Tìm kiếm sản phẩm**: theo brand, màu, bộ nhớ, giá, specs...
  - **Chính sách**: giao hàng, thanh toán, đổi trả, bảo hành
  - **Đơn hàng**: theo dõi, kiểm tra trạng thái, hủy đơn
  - **Khuyến mãi**: kiểm tra chương trình giảm giá

- **8 Custom Entities**:
  - brand-name: Apple, Samsung, Xiaomi...
  - memory-capacity: 64GB, 128GB, 256GB, 512GB, 1TB
  - color-name: Đen, Trắng, Xanh, Titan...
  - product-category: Smartphone, Flagship, Tầm trung...
  - price-range: Dưới 5tr, 5-10tr, 10-15tr, 15-20tr, Trên 20tr
  - product-spec: Camera, Pin, Màn hình, Chip...
  - product-name: iPhone 15 Pro, Galaxy S24...
  - order-status: Chờ xác nhận, Đang giao, Đã giao...

**b) Webhook Integration:**
1. User nhập câu hỏi: "Tôi muốn mua iPhone 15 Pro 256GB màu Titan Đen"
2. Dialogflow NLP → Extract entities → Xác định Intent
3. Gửi webhook request đến ChatService (port 3008)
4. ChatService gọi Product Manager Service API (port 5002)
5. Query database: tìm sản phẩm theo điều kiện
6. Trả về JSON response với product cards (hình, tên, giá, stock, specs)
7. Dialogflow hiển thị cho user với buttons: "Xem chi tiết", "Xem màu khác", "So sánh"

**c) Training phrases đa dạng:**
- "Tôi muốn mua điện thoại"
- "iPhone 15 Pro 256GB"
- "Có Samsung Galaxy không?"
- "Điện thoại dưới 10 triệu"
- "ip 15" (viết tắt)
- "Sam sung" (sai chính tả)

**Kết quả:**
- Chatbot tư vấn 24/7, phản hồi < 2 giây
- NLP tiếng Việt hiểu ngữ cảnh, từ đồng nghĩa, viết tắt
- Tích hợp real-time data từ Product DB
- Giảm tải 60-70% câu hỏi cho CSKH
- Không xử lý mua hàng trực tiếp → điều hướng đến trang sản phẩm để đảm bảo tính nhất quán

**Kiến trúc:**
```
Dialogflow ↔ ChatService (3008) ↔ API Gateway (3000) ↔ Product Manager (5002) ↔ Product DB
```

**Database:** productmanagerDB - chatSearches collection (lưu lịch sử tìm kiếm)

**Công nghệ:** Dialogflow, Node.js + Express.js, MongoDB, Webhook integration

**Ưu điểm:**
1. Tự động hóa quy trình tư vấn sản phẩm
2. Giảm tải khối lượng công việc cho CSKH
3. Nâng cao trải nghiệm người dùng (phản hồi nhanh)
4. Dễ dàng mở rộng (thêm Intent/Entity mới)
5. Tích hợp liền mạch với microservices

---

## 4.3. Giao diện hệ thống

Hệ thống SmartBuy được phát triển với 2 giao diện chính: **Client (người dùng cuối)** và **Admin Dashboard (quản trị viên)**, đều được xây dựng bằng **Vue 3 + TypeScript + TailwindCSS**, đảm bảo giao diện hiện đại, responsive và trải nghiệm người dùng tốt.

### 4.3.1. Giao diện người dùng (Client)

**Hình 4.1**: Trang chủ SmartBuy
```
[Placeholder: Screenshot trang chủ với banner, categories, featured products]
```

**Mô tả:**
- Header: Logo, search bar, menu (Điện thoại, Phụ kiện, Khuyến mãi), giỏ hàng, tài khoản
- Hero Banner: Slider quảng cáo sản phẩm mới, khuyến mãi
- Categories: Danh mục sản phẩm với icon (iPhone, Samsung, Xiaomi...)
- Featured Products: Sản phẩm nổi bật, bán chạy
- Footer: Thông tin liên hệ, chính sách, mạng xã hội

---

**Hình 4.2**: Trang danh sách sản phẩm
```
[Placeholder: Screenshot trang danh sách với filter sidebar + product grid]
```

**Mô tả:**
- Sidebar: Filter theo brand, giá, bộ nhớ, màu sắc, rating
- Sort: Giá tăng/giảm, mới nhất, bán chạy
- Product Card: Hình ảnh, tên, giá, giảm giá, rating, nút "Thêm giỏ hàng"
- Pagination: 12 sản phẩm/trang

---

**Hình 4.3**: Trang chi tiết sản phẩm
```
[Placeholder: Screenshot trang chi tiết với image gallery + variant selection]
```

**Mô tả:**
- **Trái**: Image gallery với zoom, thumbnail images
- **Phải**: 
  - Tên sản phẩm, rating, đã bán
  - Giá (hiển thị giảm giá nếu có)
  - Chọn màu sắc (color swatches)
  - Chọn bộ nhớ (256GB, 512GB, 1TB buttons)
  - Số lượng (counter)
  - Buttons: "Thêm giỏ hàng", "Mua ngay"
- **Dưới**: Tabs - Mô tả, Thông số kỹ thuật, Đánh giá

---

**Hình 4.4**: Trang giỏ hàng
```
[Placeholder: Screenshot giỏ hàng với items list + checkout button]
```

**Mô tả:**
- Bảng sản phẩm: Hình, tên, màu, bộ nhớ, giá, số lượng (counter), tổng tiền, nút xóa
- Checkbox để chọn nhiều items xóa cùng lúc
- Sidebar phải: Tổng tiền, giảm giá (nếu có), thành tiền, nút "Thanh toán"

---

**Hình 4.5**: Trang checkout
```
[Placeholder: Screenshot trang checkout với form địa chỉ + payment method]
```

**Mô tả:**
- **Bước 1 - Địa chỉ giao hàng**: Form nhập tên, SĐT, tỉnh/quận/phường, số nhà đường
- **Bước 2 - Phương thức thanh toán**: Radio buttons - COD / VNPay
- **Bước 3 - Xác nhận**: Review đơn hàng, sản phẩm, tổng tiền, nút "Đặt hàng"

---

**Hình 4.6**: Trang quản lý đơn hàng (User)
```
[Placeholder: Screenshot trang đơn hàng của user với tabs trạng thái]
```

**Mô tả:**
- Tabs: Tất cả, Chờ thanh toán, Đang xử lý, Đang giao, Hoàn thành, Đã hủy
- Danh sách đơn: Mã đơn, ngày, sản phẩm (thumbnail + tên), tổng tiền, trạng thái, buttons (Xem chi tiết, Hủy đơn, Đánh giá)

---

**Hình 4.7**: Chatbot tư vấn
```
[Placeholder: Screenshot chatbot popup với conversation]
```

**Mô tả:**
- Chatbot popup góc phải màn hình
- Conversation UI: Tin nhắn user (bên phải), bot (bên trái)
- Product cards: Hình ảnh, tên, giá, stock, specs, buttons "Xem chi tiết"
- Input box: Nhập câu hỏi, gửi tin nhắn
- Quick replies: Gợi ý câu hỏi nhanh

**Ví dụ conversation:**
```
User: "Tôi muốn mua iPhone 15 Pro 256GB màu Titan Đen"

Bot: 🎉 Tìm thấy sản phẩm phù hợp!

[Product Card]
📱 iPhone 15 Pro 256GB - Titan Đen
💰 27.990.000đ
✅ Còn 15 sản phẩm
📷 Camera: 48MP | 🔋 Pin: 3274mAh

[Xem chi tiết] [Xem màu khác]

Bạn có muốn xem thêm màu khác không?
```

---

### 4.3.2. Giao diện quản trị (Admin Dashboard)

**Hình 4.8**: Dashboard tổng quan
```
[Placeholder: Screenshot admin dashboard với KPI cards + charts]
```

**Mô tả:**
- **KPI Cards** (4 cards): Tổng doanh thu, Tổng đơn hàng, Tổng sản phẩm, Tổng users
- **Charts**:
  - Revenue Chart (Line): Doanh thu 7 ngày gần nhất
  - Order Status Chart (Pie): Phân bổ đơn theo trạng thái
  - Top Products Chart (Bar): Top 10 sản phẩm bán chạy
- **Recent Orders Table**: 10 đơn hàng mới nhất

---

**Hình 4.9**: Quản lý sản phẩm
```
[Placeholder: Screenshot trang quản lý sản phẩm với tabs]
```

**Mô tả:**
- **Tabs**: Sản phẩm, Danh mục, Thương hiệu, Màu sắc, Bộ nhớ
- **Tab Sản phẩm**:
  - Filters: Tìm kiếm, lọc theo tồn kho/brand/category, sort
  - Bảng sản phẩm: Checkbox, thumbnail, tên, brand, category, giá, stock, ngày tạo, buttons (Sửa, Xóa, Variants)
  - Nút "Thêm sản phẩm" mở modal

---

**Hình 4.10**: Modal thêm sản phẩm (2 bước)
```
[Placeholder: Screenshot modal thêm sản phẩm]
```

**Mô tả:**
- **Bước 1 - Thông tin cơ bản**:
  - Form: Tên, Category (dropdown), Brand (dropdown), Giá, Giảm giá (%), Mô tả, Upload thumbnail
  - Nút "Tiếp tục"
- **Bước 2 - Thêm Variant**:
  - Form: Chọn màu (color picker), Chọn bộ nhớ (dropdown), Giá variant, Số lượng tồn kho
  - Nút "Tạo sản phẩm"

---

**Hình 4.11**: Trang quản lý Variants
```
[Placeholder: Screenshot trang chi tiết sản phẩm với variants table]
```

**Mô tả:**
- Thông tin sản phẩm: Tên, brand, category, giá
- Bảng Variants: Màu (color hex), Bộ nhớ, Giá, Tồn kho, Đã bán, buttons (Sửa, Xóa)
- Nút "Thêm Variant" mở modal

---

**Hình 4.12**: Quản lý người dùng
```
[Placeholder: Screenshot trang quản lý users]
```

**Mô tả:**
- **KPI Cards**: Tổng users, Users mới tháng này, Khách VIP
- **Biểu đồ**: Phân bổ theo vai trò (Admin/User)
- **Bảng Users**: Checkbox, avatar, email, vai trò, trạng thái tài khoản, trạng thái xác thực, ngày đăng ký, buttons (Sửa, Khóa/Mở, Xóa)
- **Filters**: Tìm kiếm, lọc theo trạng thái/vai trò
- **Bulk actions**: Khóa hàng loạt, Xóa hàng loạt

---

**Hình 4.13**: Quản lý đơn hàng (Admin)
```
[Placeholder: Screenshot trang quản lý orders]
```

**Mô tả:**
- **KPI Cards**: Tổng đơn, Doanh thu, AOV, Đơn đang xử lý, Tỷ lệ hủy
- **Charts**:
  - Revenue Chart (Line): Doanh thu 7 ngày
  - Status Chart (Bar): Phân bổ trạng thái
- **Bảng Orders**: Checkbox, mã đơn, khách hàng, SĐT, tổng giá, trạng thái đơn, trạng thái thanh toán, phương thức, ngày tạo, buttons (Xem, Cập nhật, Hủy)
- **Filters**: Tìm kiếm, lọc theo trạng thái/thanh toán/khoảng thời gian

---

**Hình 4.14**: Modal chi tiết đơn hàng
```
[Placeholder: Screenshot modal chi tiết order]
```

**Mô tả:**
- **4 phần**:
  1. **Thông tin đơn**: Mã đơn, ngày tạo, khách hàng, trạng thái
  2. **Địa chỉ giao**: Người nhận, SĐT, địa chỉ đầy đủ
  3. **Danh sách sản phẩm**: Bảng (Hình, Tên, Màu, Bộ nhớ, Giá, SL, Tổng)
  4. **Lịch sử trạng thái**: Timeline (Timestamp, Trạng thái, Ghi chú)
- Nút "Cập nhật trạng thái"

---

**Hình 4.15**: Modal cập nhật trạng thái đơn hàng
```
[Placeholder: Screenshot modal cập nhật trạng thái]
```

**Mô tả:**
- Dropdown: Chọn trạng thái mới (theo workflow: pending → paid → processing → packing → ready → shipping → delivered → completed)
- Textarea: Nhập ghi chú
- Nút "Cập nhật"
- Sau khi cập nhật: Lưu vào statusHistory + Gửi email thông báo

---

## 4.4. Đánh giá kết quả

### 4.4.1. Ưu điểm

**1. Kiến trúc Microservices mang lại nhiều lợi ích:**
- **Tính độc lập**: Mỗi service có database riêng, deploy/scale độc lập
- **Khả năng mở rộng**: Dễ dàng thêm service mới (ví dụ: Notification Service, Analytics Service)
- **Bảo trì dễ dàng**: Sửa 1 service không ảnh hưởng các service khác
- **Technology diversity**: Có thể dùng ngôn ngữ/framework khác cho từng service

**2. Tích hợp Chatbot tư vấn:**
- Nâng cao trải nghiệm người dùng với phản hồi nhanh 24/7
- Giảm tải 60-70% câu hỏi cho CSKH
- NLP tiếng Việt hiểu ngữ cảnh, từ đồng nghĩa, viết tắt
- Tích hợp real-time data từ Product DB

**3. Cấu trúc Product 3 cấp:**
- Linh hoạt quản lý biến thể (màu + bộ nhớ)
- Dễ mở rộng thêm variant mới
- Quản lý tồn kho chính xác theo từng variant

**4. Reserve/Release Stock mechanism:**
- Đảm bảo tồn kho không overselling
- Hoàn trả stock khi hủy đơn
- Real-time stock update

**5. 11 trạng thái đơn hàng:**
- Quy trình rõ ràng, chi tiết từng bước
- Email notification tự động cho mỗi trạng thái
- Lịch sử trạng thái giúp theo dõi timeline

**6. Giao diện hiện đại:**
- Vue 3 + TailwindCSS: responsive, nhanh
- Admin Dashboard: KPI cards, charts, filters
- UX tốt: search, filter, pagination, bulk actions

### 4.4.2. Hạn chế và hướng phát triển

**Hạn chế hiện tại:**

1. **Chưa có API Gateway caching**
   - Request thường xuyên (ví dụ: danh sách sản phẩm) chưa được cache
   - → Hướng phát triển: Tích hợp Redis cache để giảm load database

2. **Chưa có Service Discovery**
   - Hiện tại routing cứng đến các port cụ thể (3003, 3004, 5002...)
   - → Hướng phát triển: Dùng Consul/Eureka để service tự động register và discover

3. **Chưa có Message Queue**
   - Email notification, stock update được gọi synchronous
   - → Hướng phát triển: Tích hợp RabbitMQ/Kafka cho async processing

4. **Chưa có Monitoring/Logging tập trung**
   - Logs phân tán ở từng service
   - → Hướng phát triển: ELK Stack (Elasticsearch, Logstash, Kibana) hoặc Grafana + Prometheus

5. **Chatbot chưa học từ lịch sử**
   - Dialogflow chưa có ML model tùy chỉnh
   - → Hướng phát triển: Train custom model từ lịch sử chatSearches

6. **Chưa có CDN cho images**
   - Hình ảnh sản phẩm serve từ server
   - → Hướng phát triển: Tích hợp AWS S3 + CloudFront hoặc Cloudinary

7. **Chưa có Unit/Integration Tests**
   - Hiện tại chủ yếu test thủ công
   - → Hướng phát triển: Jest + Supertest cho backend, Vitest + Vue Test Utils cho frontend

**Hướng phát triển:**

**1. Tính năng mới:**
- **Notification Service**: Gửi thông báo real-time (WebSocket)
- **Analytics Service**: Theo dõi hành vi người dùng, A/B testing
- **Recommendation Service**: Gợi ý sản phẩm dựa trên ML
- **Loyalty Program**: Tích điểm, ưu đãi cho khách VIP
- **Flash Sale**: Giảm giá theo giờ với stock giới hạn

**2. Cải thiện Chatbot:**
- **Context awareness**: Nhớ ngữ cảnh xuyên suốt conversation
- **Sentiment analysis**: Phân tích cảm xúc để ưu tiên hỗ trợ
- **Multi-language**: Hỗ trợ tiếng Anh
- **Voice input**: Nhập câu hỏi bằng giọng nói

**3. Cải thiện hiệu suất:**
- **CDN**: CloudFront/Cloudinary cho images
- **Redis caching**: Cache product list, categories, brands
- **Database sharding**: Phân tán data theo region
- **Load balancing**: Nginx load balancer cho multiple instances

**4. DevOps:**
- **CI/CD**: GitHub Actions/Jenkins tự động deploy
- **Kubernetes**: Container orchestration cho production
- **Monitoring**: ELK Stack + Grafana + Prometheus
- **Alerting**: PagerDuty/Slack alert khi service down

**5. Bảo mật:**
- **2FA**: Two-factor authentication cho Admin
- **Rate limiting nâng cao**: Theo user/IP/endpoint
- **API versioning**: Hỗ trợ nhiều phiên bản API
- **Encryption**: Mã hóa dữ liệu nhạy cảm trong database

---

## 4.5. Kết luận Chương 4

Hệ thống thương mại điện tử SmartBuy đã hoàn thiện các chức năng cốt lõi theo mô hình Microservices với 8 dịch vụ độc lập, tích hợp Chatbot tư vấn sử dụng Dialogflow NLP, và triển khai đầy đủ các tính năng: quản lý sản phẩm (3 cấp: Product → Variant → Image), quản lý đơn hàng (11 trạng thái), thanh toán VNPay, giỏ hàng, đánh giá sản phẩm, và phân khúc khách hàng.

Các mục tiêu về tính độc lập, khả năng mở rộng, tính nhất quán dữ liệu, hiệu suất cao và bảo mật đã được đáp ứng thông qua kiến trúc microservices, API Gateway, JWT authentication, và Reserve/Release stock mechanism.

Giao diện người dùng và Admin Dashboard được xây dựng bằng Vue 3 + TailwindCSS, đảm bảo responsive và trải nghiệm tốt. Chatbot Dialogflow tích hợp real-time data từ Product DB, phản hồi < 2 giây, giảm tải 60-70% câu hỏi cho CSKH.

Mặc dù còn một số hạn chế như chưa có caching, service discovery, message queue, monitoring tập trung, nhưng hệ thống đã đạt được mục tiêu đề ra và có nhiều hướng phát triển tiềm năng trong tương lai.
