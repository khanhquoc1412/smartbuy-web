# 📖 HƯỚNG DẪN TEST CHATBOX - SMARTBUY ASSISTANT

> **Tài liệu test toàn diện cho Dialogflow chatbot SmartBuy**
> 
> Phiên bản: 1.0 | Cập nhật: 23/11/2025

---

## 📋 MỤC LỤC

1. [Tổng quan](#tổng-quan)
2. [Chuẩn bị test](#chuẩn-bị-test)
3. [Test case theo chức năng](#test-case-theo-chức-năng)
4. [Test Rich Content UI](#test-rich-content-ui)
5. [Test lỗi và edge cases](#test-lỗi-và-edge-cases)
6. [Checklist đầy đủ](#checklist-đầy-đủ)

---

## 🎯 TỔNG QUAN

### Thông tin Agent
- **Agent ID**: `10078610-1040-4b0b-ba0d-b256881df896`
- **Ngôn ngữ**: Tiếng Việt (vi)
- **Số lượng Intent**: 20
- **Số lượng Entity**: 12
- **Webhook URL**: `http://localhost:3007/api/dialogflow/webhook`

### Các chức năng chính
- ✅ Tìm kiếm sản phẩm (theo brand, giá, màu, dung lượng)
- ✅ Tra cứu & hủy đơn hàng
- ✅ Kiểm tra khuyến mãi
- ✅ So sánh sản phẩm
- ✅ Tra cứu chính sách (giao hàng, đổi trả, bảo hành, thanh toán)
- ✅ Liên hệ hỗ trợ

---

## 🚀 CHUẨN BỊ TEST

### 1. Khởi động các service

```bash
# Terminal 1: Frontend (Port 5173)
cd client
npm run dev

# Terminal 2: Product Manager Service (Port 5002)
cd server/product-manager-service
npm run dev

# Terminal 3: Order Manager Service (Port 5003)
cd server/order-manager-service
npm run dev

# Terminal 4: Chatbox Service (Port 3007)
cd server/chatbox-service
npm run dev
```

### 2. Kiểm tra kết nối

```bash
# Test Product Service
curl http://localhost:5002/api/products/search?limit=5

# Test Order Service
curl http://localhost:5003/api/orders?limit=5

# Test Chatbox Webhook
curl http://localhost:3007/api/dialogflow/webhook
```

### 3. Truy cập Dialogflow Console

1. Mở: https://dialogflow.cloud.google.com/
2. Chọn agent: **SmartBuy Assistant**
3. Tab **Test Agent** ở bên phải
4. Sẵn sàng test!

### 4. Dữ liệu test mẫu

#### Mã đơn hàng test (sử dụng mã thật từ database):
- `ORD-20251115-E4AED6`
- `ORD-20251118-ABC123`
- Format: `ORD-YYYYMMDD-XXXXXX`

#### Tên sản phẩm test:
- iPhone 15, iPhone 15 Pro Max
- Samsung Galaxy S24, Samsung Galaxy A54
- Oppo A78, Xiaomi Redmi Note 13

---

## 🧪 TEST CASE THEO CHỨC NĂNG

### 1️⃣ WELCOME INTENT

**Intent**: `Default Welcome Intent`  
**Trigger**: Khởi đầu hội thoại

| # | Input | Expected Output | Status |
|---|-------|----------------|--------|
| 1.1 | `Xin chào` | Welcome message + info card + chips (iPhone, Samsung, Tra đơn, Khuyến mãi) | ⬜ |
| 1.2 | `Hello` | Giống 1.1 | ⬜ |
| 1.3 | `Chào bạn` | Giống 1.1 | ⬜ |
| 1.4 | `Hi` | Giống 1.1 | ⬜ |

**Kiểm tra Rich Content**:
- ✅ Info card hiển thị logo SmartBuy
- ✅ Description liệt kê 4 chức năng chính
- ✅ 4 suggestion chips hoạt động

---

### 2️⃣ TÌM KIẾM SẢN PHẨM - GENERAL

**Intent**: `product.search`  
**Parameters**: `product-category`, `price-range`

| # | Input | Expected Output | Status |
|---|-------|----------------|--------|
| 2.1 | `Tìm điện thoại` | Danh sách 5 sản phẩm + suggestion chips | ⬜ |
| 2.2 | `Xem sản phẩm` | Giống 2.1 | ⬜ |
| 2.3 | `Có điện thoại nào không` | Giống 2.1 | ⬜ |
| 2.4 | `Tìm điện thoại dưới 10 triệu` | Sản phẩm giá < 10tr + price chips | ⬜ |
| 2.5 | `Xem điện thoại từ 5 đến 15 triệu` | Sản phẩm 5-15tr | ⬜ |

**Kiểm tra Rich Content**:
- ✅ Mỗi sản phẩm hiển thị: tên, giá, brand, hình ảnh
- ✅ Click vào card → mở trang sản phẩm (slug-based URL)
- ✅ Divider ngăn cách giữa products và chips
- ✅ Suggestion chips: iPhone, Samsung, Dưới 5tr, Khuyến mãi

**Edge Cases**:
- Không có sản phẩm → Hiển thị message "không tìm thấy" + brand chips

---

### 3️⃣ TÌM KIẾM THEO THƯƠNG HIỆU

**Intent**: `product.search.by-brand`  
**Entity**: `@brand-name` (Apple, Samsung, Xiaomi, Oppo, Vivo, Realme, Honor)

| # | Input | Expected Output | Status |
|---|-------|----------------|--------|
| 3.1 | `Tìm iPhone` | Danh sách iPhone + chips (Tìm brand khác, Lọc giá) | ⬜ |
| 3.2 | `Xem điện thoại Samsung` | Danh sách Samsung | ⬜ |
| 3.3 | `Có Oppo nào không` | Danh sách Oppo | ⬜ |
| 3.4 | `Xiaomi giá rẻ` | Danh sách Xiaomi (có thể lọc giá) | ⬜ |
| 3.5 | `Vivo mới nhất` | Danh sách Vivo | ⬜ |
| 3.6 | `Điện thoại Apple` | Danh sách iPhone | ⬜ |

**Synonyms cần test**:
- Apple → iPhone, iphone, IPHONE
- Samsung → ss, samsung galaxy, Sam Sung
- Xiaomi → mi, redmi, poco

**Kiểm tra**:
- ✅ Subtitle hiển thị: `💰 Giá • 🏷️ Brand`
- ✅ Brand name chính xác trong subtitle

---

### 4️⃣ TÌM KIẾM THEO GIÁ

**Intent**: `product.search.by-price`  
**Entity**: `@price-range` (7 khoảng giá)

| # | Input | Expected Output | Status |
|---|-------|----------------|--------|
| 4.1 | `Tìm điện thoại dưới 5 triệu` | Sản phẩm < 5tr | ⬜ |
| 4.2 | `Điện thoại từ 5 đến 10 triệu` | Sản phẩm 5-10tr | ⬜ |
| 4.3 | `Điện thoại 10-20 triệu` | Sản phẩm 10-20tr | ⬜ |
| 4.4 | `Điện thoại trên 20 triệu` | Sản phẩm > 20tr | ⬜ |
| 4.5 | `Tầm 7 triệu` | Sản phẩm 5-10tr | ⬜ |
| 4.6 | `Giá rẻ` | Sản phẩm < 5tr | ⬜ |

**Price Range Mapping**:
```
duoi-3-trieu       → < 3,000,000đ
3-5-trieu          → 3,000,000 - 5,000,000đ
5-10-trieu         → 5,000,000 - 10,000,000đ
10-15-trieu        → 10,000,000 - 15,000,000đ
15-20-trieu        → 15,000,000 - 20,000,000đ
20-30-trieu        → 20,000,000 - 30,000,000đ
tren-30-trieu      → > 30,000,000đ
```

**Kiểm tra**:
- ✅ Header text hiển thị khoảng giá đang lọc
- ✅ Chips: 💵 Dưới 5tr, 💸 5-10tr, 💎 10-20tr, 👑 Trên 20tr

---

### 5️⃣ TÌM KIẾM THEO MÀU SẮC

**Intent**: `product.search.by-color`  
**Entity**: `@color-name` (20 màu)

| # | Input | Expected Output | Status |
|---|-------|----------------|--------|
| 5.1 | `Tìm điện thoại màu đen` | Sản phẩm màu đen + color chips | ⬜ |
| 5.2 | `iPhone màu hồng` | iPhone màu hồng | ⬜ |
| 5.3 | `Samsung màu xanh dương` | Samsung màu xanh | ⬜ |
| 5.4 | `Điện thoại trắng` | Sản phẩm màu trắng | ⬜ |

**⚠️ LƯU Ý CONFLICT**: 
- "hồng" có thể conflict với "hãng" → Test cẩn thận!
- Khuyến nghị: "màu hồng", "pink" thay vì "hồng"

**Color List** (20 màu):
- Đen, Trắng, Xám, Bạc, Vàng
- Hồng, Đỏ, Cam, Xanh lá, Xanh dương
- Tím, Nâu, Be, Xanh rêu, Xanh ngọc
- Gradient, Titanium, Gold, Midnight, Starlight

**Kiểm tra**:
- ✅ Subtitle: `💰 Giá • 🎨 Màu • Brand`
- ✅ Chips: ⚫ Đen, ⚪ Trắng, 🔵 Xanh, 🌸 Hồng

---

### 6️⃣ TÌM KIẾM THEO DUNG LƯỢNG

**Intent**: `product.search.by-memory`  
**Entity**: `@memory-capacity`

| # | Input | Expected Output | Status |
|---|-------|----------------|--------|
| 6.1 | `Tìm điện thoại 128GB` | Sản phẩm 128GB + memory chips | ⬜ |
| 6.2 | `iPhone 256GB` | iPhone 256GB | ⬜ |
| 6.3 | `Điện thoại 512GB` | Sản phẩm 512GB | ⬜ |
| 6.4 | `Dung lượng lớn` | Sản phẩm 512GB/1TB | ⬜ |

**Memory Options**:
- 64GB, 128GB, 256GB, 512GB, 1TB

**Kiểm tra**:
- ✅ Subtitle: `💰 Giá • 💾 128GB • Brand`
- ✅ Chips: 💾 128GB, 💾 256GB, 💾 512GB, 💾 1TB

---

### 7️⃣ CHI TIẾT SẢN PHẨM

**Intent**: `product.detail`  
**Parameters**: `product-name`

| # | Input | Expected Output | Status |
|---|-------|----------------|--------|
| 7.1 | `Thông tin iPhone 15` | Chi tiết iPhone 15 + info card | ⬜ |
| 7.2 | `Chi tiết Samsung S24` | Chi tiết Samsung S24 | ⬜ |
| 7.3 | `Xem cấu hình Oppo A78` | Chi tiết Oppo A78 | ⬜ |

**Thông tin hiển thị**:
- 📱 Tên sản phẩm
- 💰 Giá
- 📦 Tình trạng (Còn hàng/Hết hàng)
- ⭐ Đánh giá/5
- 🔥 Giảm giá %

**Kiểm tra**:
- ✅ Info card có hình ảnh + actionLink
- ✅ Click → mở trang `/product/slug`

---

### 8️⃣ TRA CỨU ĐƠN HÀNG

**Intent**: `order.track`  
**Entity**: `@order-id` (Regex: `ORD-\d{8}-[A-F0-9]{6}`)

| # | Input | Expected Output | Status |
|---|-------|----------------|--------|
| 8.1 | `Tra đơn hàng ORD-20251115-E4AED6` | Thông tin đơn + 2 accordion + chips | ⬜ |
| 8.2 | `Kiểm tra đơn ORD-20251118-ABC123` | Thông tin đơn | ⬜ |
| 8.3 | `Đơn hàng của tôi` | Yêu cầu nhập mã đơn | ⬜ |
| 8.4 | `Tra cứu ORD-99999999-XXXXXX` | "Không tìm thấy đơn hàng" | ⬜ |

**Thông tin hiển thị**:
- 🔖 Mã đơn
- 📍 Trạng thái (pending, confirmed, processing, shipped, delivered, cancelled)
- 💰 Tổng tiền
- 📅 Ngày đặt
- 🚚 Mã vận đơn (nếu có)

**Accordion 1: Chi tiết đơn hàng**
- Subtitle: `👇 Nhấn để xem danh sách sản phẩm`
- Text: Danh sách sản phẩm (tên, số lượng, giá)

**Accordion 2: Địa chỉ giao hàng**
- Subtitle: `{fullName} - {phone}`
- Text: Địa chỉ đầy đủ

**Kiểm tra**:
- ✅ Tất cả accordion có subtitle (không "undefined")
- ✅ Format giá, ngày tháng đúng
- ✅ Chips: ❌ Hủy đơn, 📞 Liên hệ, 🏠 Trang chủ

---

### 9️⃣ HỦY ĐƠN HÀNG

**Intent**: `order.cancel`  
**Entity**: `@order-id`

| # | Input | Expected Output | Status |
|---|-------|----------------|--------|
| 9.1 | `Hủy đơn ORD-20251115-E4AED6` | Success: Thông báo hủy thành công + hoàn tiền 3-5 ngày | ⬜ |
| 9.2 | `Huỷ đơn hàng` | Yêu cầu nhập mã đơn | ⬜ |
| 9.3 | `Không muốn mua nữa` | Yêu cầu nhập mã đơn | ⬜ |
| 9.4 | `Hủy ORD-99999999-XXXXXX` | Fail: "Không thể hủy đơn" + lý do + hotline | ⬜ |

**Logic kiểm tra**:
- ✅ Chỉ hủy được đơn có status: pending, confirmed, processing
- ❌ Không hủy được: shipped, delivered, cancelled

**Kiểm tra**:
- ✅ Success message: emoji ✅, thông tin hoàn tiền
- ✅ Error message: emoji ❌, lý do, hotline
- ✅ Chips: 📦 Xem đơn khác, 🛍️ Tiếp tục mua, 📞 Hotline

---

### 🔟 KIỂM TRA KHUYẾN MÃI

**Intent**: `promotion.check`

| # | Input | Expected Output | Status |
|---|-------|----------------|--------|
| 10.1 | `Khuyến mãi gì` | 3 accordion khuyến mãi + info card hướng dẫn | ⬜ |
| 10.2 | `Có giảm giá không` | Giống 10.1 | ⬜ |
| 10.3 | `Mã giảm giá` | Giống 10.1 | ⬜ |
| 10.4 | `Flash sale` | Giống 10.1 | ⬜ |

**3 Promotion hiển thị**:
1. **Flash Sale 12.12** - Mã: `FLASH1212`
   - Giảm 50%
   - Subtitle: `Mã: FLASH1212`
   
2. **Giảm 1 triệu cho iPhone** - Mã: `IPHONE1M`
   - Giảm 1,000,000đ
   - Subtitle: `Mã: IPHONE1M`
   
3. **Trả góp 0%** - Mã: `TRAGOP0`
   - Trả góp 0%
   - Subtitle: `Mã: TRAGOP0`

**Kiểm tra**:
- ✅ Tất cả accordion có subtitle hiển thị mã
- ✅ Info card "Cách sử dụng mã"
- ✅ Chips: 🛍️ Mua ngay, 📱 Xem sản phẩm

---

### 1️⃣1️⃣ SO SÁNH SẢN PHẨM

**Intent**: `product.compare`  
**Parameters**: `product-name-1`, `product-name-2`

| # | Input | Expected Output | Status |
|---|-------|----------------|--------|
| 11.1 | `So sánh iPhone 15 và Samsung S24` | 2 accordion sản phẩm + info kết luận + chips | ⬜ |
| 11.2 | `Nên mua Oppo A78 hay Xiaomi Redmi` | So sánh 2 sản phẩm | ⬜ |
| 11.3 | `So sánh giá iPhone 15 Pro và S24 Ultra` | So sánh 2 sản phẩm | ⬜ |

**Thông tin mỗi accordion**:
- Title: Tên sản phẩm
- Subtitle: Giá
- Text: Giá + Đánh giá + Tình trạng

**Info card kết luận**:
- Title: 💰 Kết luận
- Subtitle: "{Sản phẩm rẻ hơn} rẻ hơn {số tiền}"

**Kiểm tra**:
- ✅ 2 accordion có subtitle (giá)
- ✅ Kết luận chính xác (sản phẩm nào rẻ hơn)
- ✅ Chips với link đến từng sản phẩm

---

### 1️⃣2️⃣ CHÍNH SÁCH GIAO HÀNG

**Intent**: `policy.shipping`

| # | Input | Expected Output | Status |
|---|-------|----------------|--------|
| 12.1 | `Chính sách giao hàng` | Info card + 3 accordion + hotline + chips | ⬜ |
| 12.2 | `Phí ship` | Giống 12.1 | ⬜ |
| 12.3 | `Giao hàng bao lâu` | Giống 12.1 | ⬜ |
| 12.4 | `Thời gian giao hàng` | Giống 12.1 | ⬜ |

**3 Accordion**:
1. **⚡ Giao hàng nhanh**
   - Subtitle: `👇 Nhấn để xem chi tiết`
   - Text: Nội thành 2-4h, Ngoại thành 1-2 ngày...
   
2. **📦 Kiểm tra hàng**
   - Subtitle: `👇 Nhấn để xem chi tiết`
   - Text: Mở hộp kiểm tra, Từ chối nếu sai...
   
3. **🚚 Đơn vị vận chuyển** (nếu có)

**Kiểm tra**:
- ✅ Tất cả accordion có subtitle
- ✅ Info card "Hotline: 1900-xxxx"
- ✅ Chips: Chính sách đổi trả, Tìm điện thoại

---

### 1️⃣3️⃣ CHÍNH SÁCH ĐỔI TRẢ

**Intent**: `policy.return`

| # | Input | Expected Output | Status |
|---|-------|----------------|--------|
| 13.1 | `Chính sách đổi trả` | Info card + 3 accordion + hotline + chips | ⬜ |
| 13.2 | `Đổi trả như thế nào` | Giống 13.1 | ⬜ |
| 13.3 | `Hoàn tiền` | Giống 13.1 | ⬜ |
| 13.4 | `Máy bị lỗi` | Giống 13.1 | ⬜ |

**3 Accordion**:
1. **⏰ Thời gian đổi trả**
   - Subtitle: `👇 Nhấn để xem chi tiết`
   
2. **📝 Điều kiện**
   - Subtitle: `👇 Nhấn để xem chi tiết`
   
3. **💰 Chính sách hoàn tiền**
   - Subtitle: `👇 Nhấn để xem chi tiết`

**Kiểm tra**:
- ✅ Tất cả accordion có subtitle
- ✅ Không có "undefined"

---

### 1️⃣4️⃣ CHÍNH SÁCH BẢO HÀNH

**Intent**: `policy.warranty`

| # | Input | Expected Output | Status |
|---|-------|----------------|--------|
| 14.1 | `Chính sách bảo hành` | Info card + 3 accordion + button + chips | ⬜ |
| 14.2 | `Bảo hành bao lâu` | Giống 14.1 | ⬜ |
| 14.3 | `Cách bảo hành` | Giống 14.1 | ⬜ |

**3 Accordion**:
1. **🏢 Bảo hành chính hãng**
   - Subtitle: `👇 Nhấn để xem chi tiết`
   
2. **🆕 Đổi mới 1-1**
   - Subtitle: `👇 Nhấn để xem chi tiết`
   
3. **🔧 Trung tâm bảo hành**
   - Subtitle: `👇 Nhấn để xem chi tiết`

**Kiểm tra**:
- ✅ Button "Tra cứu trung tâm bảo hành" có icon + link

---

### 1️⃣5️⃣ CHÍNH SÁCH THANH TOÁN

**Intent**: `policy.payment`

| # | Input | Expected Output | Status |
|---|-------|----------------|--------|
| 15.1 | `Phương thức thanh toán` | Info card + 3 accordion + description + chips | ⬜ |
| 15.2 | `Thanh toán như thế nào` | Giống 15.1 | ⬜ |
| 15.3 | `COD` | Giống 15.1 | ⬜ |
| 15.4 | `Trả góp` | Giống 15.1 | ⬜ |

**3 Accordion**:
1. **💵 Tiền mặt (COD)**
   - Subtitle: `👇 Nhấn để xem chi tiết`
   
2. **💳 Chuyển khoản / Ví điện tử**
   - Subtitle: `👇 Nhấn để xem chi tiết`
   
3. **🏦 Trả góp 0%**
   - Subtitle: `👇 Nhấn để xem chi tiết`

---

### 1️⃣6️⃣ LIÊN HỆ HỖ TRỢ

**Intent**: `contact.support`

| # | Input | Expected Output | Status |
|---|-------|----------------|--------|
| 16.1 | `Liên hệ hỗ trợ` | 4 accordion (hotline, chat, email, showroom) + chips | ⬜ |
| 16.2 | `Gọi tổng đài` | Giống 16.1 | ⬜ |
| 16.3 | `Chat với tư vấn` | Giống 16.1 | ⬜ |
| 16.4 | `Hotline` | Giống 16.1 | ⬜ |

**4 Accordion**:
1. **📞 Hotline - 1900-xxxx**
   - Subtitle: `Hỗ trợ 24/7 - Miễn phí cuộc gọi`
   
2. **💬 Chat trực tuyến**
   - Subtitle: `Phản hồi trong 1 phút`
   
3. **📧 Email - support@smartbuy.vn**
   - Subtitle: `Phản hồi trong 24h`
   
4. **🏢 Địa chỉ showroom**
   - Subtitle: `Mở cửa: 8h - 22h (Hằng ngày)`

**Kiểm tra**:
- ✅ Tất cả accordion có subtitle
- ✅ Subtitle khác nhau cho từng kênh
- ✅ Chips: Gọi hotline, Chat FB, Chat Zalo

---

### 1️⃣7️⃣ XEM CỬA HÀNG

**Intent**: `store.location`

| # | Input | Expected Output | Status |
|---|-------|----------------|--------|
| 17.1 | `Cửa hàng ở đâu` | Info card + 3 accordion (HN, HCM, ĐN) + button + chips | ⬜ |
| 17.2 | `Địa chỉ showroom` | Giống 17.1 | ⬜ |
| 17.3 | `Chi nhánh` | Giống 17.1 | ⬜ |

**3 Accordion**:
1. **📍 Hà Nội (2 chi nhánh)**
   - Subtitle: `👇 Nhấn để xem chi tiết`
   
2. **📍 Hồ Chí Minh (2 chi nhánh)**
   - Subtitle: `👇 Nhấn để xem chi tiết`
   
3. **📍 Đà Nẵng (1 chi nhánh)**
   - Subtitle: `👇 Nhấn để xem chi tiết`

**Kiểm tra**:
- ✅ Button "Xem bản đồ" có icon location
- ✅ Tất cả accordion có subtitle

---

## 🎨 TEST RICH CONTENT UI

### Checklist Rich Content Components

| Component | Required Fields | Test Case | Status |
|-----------|----------------|-----------|--------|
| **info** | type, title, subtitle | Click → mở link | ⬜ |
| **accordion** | type, title, **subtitle**, text | Click → expand/collapse | ⬜ |
| **chips** | type, options[].text | Click → trigger intent | ⬜ |
| **divider** | type | Hiển thị đường gạch ngang | ⬜ |
| **button** | type, text, link, icon | Click → mở URL | ⬜ |
| **description** | type, title, text[] | Hiển thị bullet list | ⬜ |

### Test Accordion Subtitle (QUAN TRỌNG!)

**Tất cả accordion PHẢI có `subtitle`**, nếu không sẽ hiển thị "undefined":

```javascript
// ❌ SAI - Thiếu subtitle
{
  type: 'accordion',
  title: 'Tiêu đề',
  text: 'Nội dung'
}

// ✅ ĐÚNG
{
  type: 'accordion',
  title: 'Tiêu đề',
  subtitle: '👇 Nhấn để xem chi tiết',
  text: 'Nội dung'
}
```

**Danh sách tất cả accordion cần test**:

| Handler Function | Số lượng Accordion | Subtitle Type | Status |
|------------------|-------------------|---------------|--------|
| handleOrderTrack | 2 | Static + Dynamic | ⬜ |
| handlePolicyQuestions | 2-3 (dynamic) | Static | ⬜ |
| handlePromotionCheck | 3 | Dynamic (mã KM) | ⬜ |
| handlePriceCompare | 2 | Dynamic (giá) | ⬜ |
| handleContactSupport | 4 | Static unique | ⬜ |

---

## 🐛 TEST LỖI VÀ EDGE CASES

### 1. Test Entity không match

| # | Input | Expected Behavior | Status |
|---|-------|------------------|--------|
| E1 | `Tìm điện thoại XYZ Brand` | Không tìm thấy, gợi ý brand khác | ⬜ |
| E2 | `Đơn hàng ABC123` | "Vui lòng cung cấp mã đơn hàng đúng format" | ⬜ |
| E3 | `Màu cam chanh` | Không match → fallback | ⬜ |

### 2. Test Conflict Entity

| # | Input | Conflict | Expected Intent | Status |
|---|-------|----------|----------------|--------|
| C1 | `Hãng Apple` | hồng vs hãng | product.search.by-brand | ⬜ |
| C2 | `Màu hồng` | hồng vs hãng | product.search.by-color | ⬜ |
| C3 | `Điện thoại hồng` | Ambiguous | Test xem match intent nào | ⬜ |

**Giải pháp**:
- Sử dụng "màu hồng" thay vì "hồng"
- Tăng priority cho brand intent lên 600000

### 3. Test API Failure

| # | Scenario | Expected Fallback | Status |
|---|----------|------------------|--------|
| F1 | Product Service down | "Có lỗi xảy ra..." | ⬜ |
| F2 | Order Service down | "Có lỗi xảy ra..." | ⬜ |
| F3 | Không có sản phẩm | "Không tìm thấy..." + chips | ⬜ |
| F4 | Đơn hàng không tồn tại | "Không tìm thấy đơn..." | ⬜ |

### 4. Test Format

| # | Data Type | Expected Format | Status |
|---|-----------|----------------|--------|
| FT1 | Price | `9.990.000₫` | ⬜ |
| FT2 | Date | `23/11/2025` | ⬜ |
| FT3 | Order Status | Vietnamese (Đang xử lý, Đã giao...) | ⬜ |
| FT4 | URL slug | `/product/iphone-15-pro-max` | ⬜ |

---

## ✅ CHECKLIST ĐẦY ĐỦ

### Pre-Test Checklist

- [ ] Tất cả services đã khởi động
- [ ] Database có dữ liệu test
- [ ] Webhook URL chính xác trong Dialogflow
- [ ] CORS_ORIGIN configured đúng (`http://localhost:5173`)

### Testing Checklist

**Intents (20 total)**:
- [ ] Default Welcome Intent
- [ ] product.search
- [ ] product.search.by-brand
- [ ] product.search.by-price
- [ ] product.search.by-color
- [ ] product.search.by-memory
- [ ] product.detail
- [ ] order.track
- [ ] order.cancel
- [ ] promotion.check
- [ ] product.compare
- [ ] policy.shipping
- [ ] policy.return
- [ ] policy.warranty
- [ ] policy.payment
- [ ] contact.support
- [ ] store.location

**Low Priority (optional)**:
- [ ] product.search.by-specs
- [ ] order.check-status
- [ ] Default Fallback Intent

**Rich Content**:
- [ ] Tất cả info cards hiển thị đúng
- [ ] Tất cả accordion có subtitle (không "undefined")
- [ ] Tất cả chips clickable
- [ ] Tất cả dividers hiển thị
- [ ] Tất cả buttons có icon + link
- [ ] Tất cả actionLinks mở đúng trang

**Edge Cases**:
- [ ] Entity conflict (hồng vs hãng)
- [ ] API failure handling
- [ ] Empty results handling
- [ ] Invalid order ID format

### Post-Test Checklist

- [ ] Document các bug tìm được
- [ ] Screenshot các lỗi UI
- [ ] Verify tất cả accordion không có "undefined"
- [ ] Kiểm tra performance (response time < 2s)

---

## 📊 BÁO CÁO TEST

### Test Summary Template

```
📅 Ngày test: __________
👤 Người test: __________

📈 KẾT QUẢ TỔNG QUAN:
- Tổng số test cases: ____ / ____
- Pass: ____ (___%)
- Fail: ____ (___%)
- Blocked: ____

🐛 BUGS PHÁT HIỆN:
1. [Priority] Bug description
   - Steps to reproduce:
   - Expected: 
   - Actual:
   - Screenshot:

💡 GỢI Ý CẢI TIẾN:
1. ...

✅ APPROVED FOR PRODUCTION: YES / NO
```

---

## 🔧 TROUBLESHOOTING

### Issue: Webhook không hoạt động

**Triệu chứng**: Dialogflow không gọi webhook, chỉ trả về default response

**Giải pháp**:
1. Kiểm tra webhook URL trong Dialogflow Console
2. Verify chatbox service đang chạy: `curl http://localhost:3007/api/dialogflow/webhook`
3. Kiểm tra intent có enable webhook: ✅ "Enable webhook call for this intent"

### Issue: Accordion hiển thị "undefined"

**Triệu chứng**: Subtitle của accordion hiển thị chữ "undefined"

**Giải pháp**:
1. Mở file `intentHandlers.js`
2. Tìm tất cả `type: 'accordion'`
3. Đảm bảo có cả 3 fields: `title`, `subtitle`, `text`
4. Nếu thiếu subtitle, thêm: `subtitle: '👇 Nhấn để xem chi tiết'`

### Issue: Product links không hoạt động

**Triệu chứng**: Click vào product card không mở trang chi tiết

**Giải pháp**:
1. Kiểm tra `CORS_ORIGIN` trong `config.env`: `http://localhost:5173`
2. Verify product có `slug` field
3. Check actionLink format: `/product/${product.slug}`

### Issue: Entity conflict (hồng vs hãng)

**Triệu chứng**: "Hãng Apple" match vào color intent thay vì brand

**Giải pháp**:
1. Sử dụng cụm từ đầy đủ: "màu hồng" thay vì "hồng"
2. Thêm training phrases cho brand intent: "Hãng Apple", "Xem hãng Samsung"
3. Tăng priority của brand intent lên 600000

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề trong quá trình test:

1. **Check logs**: 
   ```bash
   # Chatbox service logs
   cd server/chatbox-service
   npm run dev
   
   # Xem console output để debug
   ```

2. **Test webhook trực tiếp**:
   ```bash
   curl -X POST http://localhost:3007/api/dialogflow/webhook \
     -H "Content-Type: application/json" \
     -d '{
       "queryResult": {
         "intent": {
           "displayName": "product.search"
         },
         "parameters": {}
       }
     }'
   ```

3. **Dialogflow Console**: https://dialogflow.cloud.google.com/
   - Tab "Intents" → Kiểm tra training phrases
   - Tab "Entities" → Verify entity values
   - Tab "Fulfillment" → Check webhook URL

---

## 📚 TÀI LIỆU THAM KHẢO

- [Dialogflow ES Documentation](https://cloud.google.com/dialogflow/es/docs)
- [Dialogflow Messenger Rich Content](https://cloud.google.com/dialogflow/es/docs/integrations/dialogflow-messenger#rich_response_messages)
- [SmartBuy API Documentation](../README.md)

---

**Phiên bản**: 1.0  
**Cập nhật cuối**: 23/11/2025  
**Tác giả**: SmartBuy Development Team

🎉 **Chúc bạn test thành công!**
