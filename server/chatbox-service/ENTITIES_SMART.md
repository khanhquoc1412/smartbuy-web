# 🎯 ENTITIES THÔNG MINH - DỰA TRÊN DATABASE THỰC TẾ

> **Generated from actual database structure analysis**
> **Date**: November 20, 2025
> **Database**: SmartBuy - Phone Store

---

## 📱 **1. @product-category (Danh mục sản phẩm)**

**Type**: List Entity với synonyms
**Auto-expansion**: OFF (chỉ bán điện thoại)

```yaml
Reference Value | Synonyms
----------------|--------------------------------------------------
dien-thoai      | điện thoại, smartphone, phone, di động, mobile, điện thoại di động, điện thoại thông minh, smart phone, dt, đt, dien thoai
```

**Lý do**: Database chỉ có 1 category "Điện thoại" → Tập trung 100% vào phones

---

## 🏷️ **2. @brand-name (Thương hiệu)**

**Type**: List Entity với synonyms
**Auto-expansion**: ON (nhận diện thương hiệu mới)

```yaml
Reference Value | Synonyms
----------------|--------------------------------------------------
apple           | Apple, iPhone, iPad, Mac, MacBook, Apple Inc, táo, táo khuyết, ip, apo, appo
samsung         | Samsung, Galaxy, Sam Sung, SS, sam sung, Sam sung, Sâm Sốt
xiaomi          | Xiaomi, Mi, Redmi, Poco, Tiểu Mễ, Siêu mì, Xao mi, Xao Mi, Xiaomi Mi
oppo            | Oppo, OPPO, ốp pô, op po
vivo            | Vivo, VIVO, vi vo, Vi Vo
realme          | Realme, Real me, Real Me, reo me, Reo Mi
honor           | HONOR, Honor, Hon or, Hoa Vi
```

**Nguồn dữ liệu**:
```json
"brands": [
  { "name": "Apple" },
  { "name": "Samsung" },
  { "name": "Xiaomi" },
  { "name": "OPPO" },
  { "name": "Vivo" },
  { "name": "Realme" },
  { "name": "HONOR" }
]
```

---

## 💰 **3. @price-range (Khoảng giá)**

**Type**: List Entity với synonyms
**Auto-expansion**: OFF

**Phân tích giá từ database**:
- Thấp nhất: 2.490.000đ (OPPO A17k)
- Cao nhất: 34.990.000đ (iPhone 16 Pro Max)
- Phổ biến: 5M - 30M

```yaml
Reference Value | Synonyms
----------------|--------------------------------------------------
duoi-3-trieu    | dưới 3 triệu, <3tr, dưới 3tr, giá rẻ, bình dân, học sinh, dưới ba triệu, dưới 3 củ
3-5-trieu       | từ 3 đến 5 triệu, 3-5tr, tầm 3 triệu, tầm 5 triệu, khoảng 3 triệu, khoảng 5 triệu, 3 đến 5 củ
5-10-trieu      | từ 5 đến 10 triệu, 5-10tr, tầm 10 triệu, giá vừa phải, tầm trung, tầm 7 triệu, 5 đến 10 củ
10-15-trieu     | từ 10 đến 15 triệu, 10-15tr, tầm 15 triệu, khoảng 12 triệu, 10 đến 15 củ
15-20-trieu     | từ 15 đến 20 triệu, 15-20tr, tầm 20 triệu, khoảng 18 triệu, 15 đến 20 củ
20-30-trieu     | từ 20 đến 30 triệu, 20-30tr, tầm 25 triệu, cao cấp, flagship, 20 đến 30 củ
tren-30-trieu   | trên 30 triệu, >30tr, siêu cao cấp, ultra flagship, sang chảnh, trên 30 củ
```

**💡 Kết hợp với @sys.number-integer**:
```
User: "Điện thoại dưới 10 triệu"
→ Parameter: price_range = "10-15-trieu" (Entity)

User: "Điện thoại giá 8 triệu 500"
→ Parameter: max_price = 8500000 (System Entity @sys.number-integer)
```

---

## 🎨 **4. @color-name (Màu sắc)**

**Type**: List Entity với synonyms
**Auto-expansion**: ON

**Từ database có 20 màu**:

```yaml
Reference Value | Synonyms
----------------|--------------------------------------------------
den             | đen, black, đen bóng, đen nhám, đen mờ, đen huyền bí
trang           | trắng, white, trắng ngà, trắng sáng, trắng tinh
xanh            | xanh, blue, xanh dương, xanh da trời
hong            | hồng, pink, hồng nhạt, hồng đậm, màu hồng
xam             | xám, gray, grey, xám đậm, xám nhạt, xám không gian
vang            | vàng, yellow, vàng kim, gold, vàng óng, vàng đồng
bac             | bạc, silver, bạc sáng, bạc ánh kim
tim             | tím, purple, violet, tím nhạt, tím than
cam             | cam, orange, cam đậm, cam nhạt
xanh-la         | xanh lá, green, xanh lá cây, xanh non
xanh-duong      | xanh dương, blue, xanh biển
xanh-luu-ly     | xanh lưu ly, blue glass, xanh lưu ly ánh kim
xanh-mong-ket   | xanh mồng két, turquoise, xanh ngọc
xanh-nhat       | xanh nhạt, light blue, xanh pastel
do              | đỏ, red, đỏ tươi, đỏ thẫm
xanh-titan      | xanh titan, titanium blue, xanh xám
nau             | nâu, brown, nâu đậm, nâu nhạt
xanh-dam        | xanh đậm, dark blue, xanh navy
```

**Nguồn từ database**:
```json
"colors": [
  {"name": "Đen", "code": "#000000"},
  {"name": "Trắng", "code": "#FFFFFF"},
  {"name": "Xanh", "code": "#0066CC"},
  ... (20 colors total)
]
```

---

## 💾 **5. @memory-capacity (Dung lượng)**

**Type**: List Entity với synonyms
**Auto-expansion**: ON

**RAM từ database**: 3GB, 4GB, 6GB, 8GB, 12GB, 16GB
**ROM từ database**: 32GB, 64GB, 128GB, 256GB, 512GB, 1TB

```yaml
Reference Value | Synonyms
----------------|--------------------------------------------------
32gb            | 32GB, 32 GB, 32g, 32 ghi ga
64gb            | 64GB, 64 GB, 64g
128gb           | 128GB, 128 GB, 128g, 128 ghi ga
256gb           | 256GB, 256 GB, 256g, 256 ghi ga
512gb           | 512GB, 512 GB, 512g, 512 ghi ga
1tb             | 1TB, 1 TB, 1T, 1 tera, 1024GB
3gb-ram         | 3GB RAM, 3 GB RAM, RAM 3GB, 3 ghi ga RAM
4gb-ram         | 4GB RAM, 4 GB RAM, RAM 4GB
6gb-ram         | 6GB RAM, 6 GB RAM, RAM 6GB
8gb-ram         | 8GB RAM, 8 GB RAM, RAM 8GB
12gb-ram        | 12GB RAM, 12 GB RAM, RAM 12GB
16gb-ram        | 16GB RAM, 16 GB RAM, RAM 16GB
```

**Variants phổ biến từ database**:
- 6GB/128GB (iPhone 15)
- 8GB/128GB (iPhone 16)
- 8GB/256GB (iPhone 16 Pro Max)
- 12GB/256GB (Galaxy S24 Ultra)

---

## 📦 **6. @order-id (Mã đơn hàng)**

**Type**: Regexp Entity
**Pattern**: `ORD-\d{8}-[A-F0-9]{6}`

```yaml
Regex Pattern:
  ORD-\d{8}-[A-F0-9]{6}

Examples:
  - ORD-20241120-A1B2C3
  - ORD-20251115-F9E8D7
  - ORD-20241201-123ABC
```

**Nguồn từ Order Model**:
```javascript
OrderSchema.virtual("orderNumber").get(function () {
  const date = this.createdAt.toISOString().slice(0, 10).replace(/-/g, "");
  const id = this._id.toString().slice(-6).toUpperCase();
  return `ORD-${date}-${id}`;
});
```

---

## 🚚 **7. @order-status (Trạng thái đơn hàng)**

**Type**: List Entity
**Auto-expansion**: OFF

```yaml
Reference Value  | Synonyms
-----------------|--------------------------------------------------
pending_payment  | chờ thanh toán, chưa thanh toán, pending payment
payment_failed   | thanh toán thất bại, thanh toán lỗi, payment failed
pending          | chờ xác nhận, đang chờ, chờ shop duyệt
confirmed        | đã xác nhận, shop đã duyệt, đã duyệt
processing       | đang chuẩn bị, đang đóng gói, đang xử lý
ready_to_ship    | sẵn sàng giao, chờ shipper, chờ lấy hàng
shipping         | đang giao, đang ship, đang vận chuyển
delivered        | đã giao, đã nhận hàng, giao thành công
completed        | hoàn thành, đã hoàn thành, completed
cancelled        | đã hủy, hủy đơn, cancelled
returned         | đã trả hàng, trả lại, returned
```

**Nguồn từ Order Model**:
```javascript
status: {
  type: String,
  enum: [
    "pending_payment", "payment_failed", "pending",
    "confirmed", "processing", "ready_to_ship",
    "shipping", "delivered", "completed",
    "cancelled", "returned"
  ]
}
```

---

## 💳 **8. @payment-method (Phương thức thanh toán)**

**Type**: List Entity
**Auto-expansion**: OFF

```yaml
Reference Value | Synonyms
----------------|--------------------------------------------------
cod             | COD, Ship COD, tiền mặt, trả tiền khi nhận hàng, thanh toán khi nhận hàng, cash
vnpay           | VNPAY, VNPay, VN Pay, ví điện tử VNPAY
momo            | MOMO, MoMo, Momo, ví MoMo, Ví Momo
zalopay         | ZALOPAY, ZaloPay, Zalo Pay, ví ZaloPay
paypal          | PAYPAL, PayPal, Pay Pal
credit_card     | thẻ tín dụng, credit card, thẻ visa, thẻ master, visa, mastercard
```

**Nguồn từ Order Model**:
```javascript
paymentMethod: {
  enum: ["COD", "VNPAY", "MOMO", "ZALOPAY", "PAYPAL", "CREDIT_CARD"]
}
```

---

## 🔍 **9. @product-name (Tên sản phẩm cụ thể)**

**Type**: List Entity
**Auto-expansion**: ON

**Top products từ database**:

```yaml
Reference Value      | Synonyms
---------------------|--------------------------------------------------
iphone-15            | iPhone 15, ip 15, i phone 15, iphone15, iphone mười lăm
iphone-16            | iPhone 16, ip 16, i phone 16, iphone16, iphone mười sáu
iphone-16-pro-max    | iPhone 16 Pro Max, ip 16 pro max, i phone 16 pm, iphone 16pm
galaxy-s24-ultra     | Galaxy S24 Ultra, samsung s24 ultra, s24 ultra, s24u
xiaomi-14t           | Xiaomi 14T, mi 14t, xiaomi 14 t, 14t
oppo-find-n3-flip    | OPPO Find N3 Flip, oppo n3 flip, find n3 flip
vivo-v30             | Vivo V30, vivo v 30, v30
realme-c67           | Realme C67, realme c 67, c67
```

**Có thể kết hợp với Webhook để query động từ Product Service.**

---

## 📊 **10. @product-spec (Thông số kỹ thuật)**

**Type**: List Entity
**Auto-expansion**: ON

```yaml
Reference Value | Synonyms
----------------|--------------------------------------------------
man-hinh        | màn hình, screen, display, kích thước màn hình, độ phân giải
camera-sau      | camera sau, camera chính, main camera, rear camera
camera-truoc    | camera trước, camera selfie, front camera, camera tự sướng
chip            | chip, vi xử lý, processor, CPU, chipset
pin             | pin, battery, dung lượng pin, thời lượng pin
ram             | RAM, bộ nhớ tạm, bộ nhớ đệm
rom             | ROM, bộ nhớ trong, internal storage, dung lượng lưu trữ
he-dieu-hanh    | hệ điều hành, OS, operating system, iOS, Android
```

**Nguồn từ Specification Model**:
```json
"specifications": [
  { "specName": "Màn hình" },
  { "specName": "Camera sau" },
  { "specName": "Camera trước" },
  { "specName": "Chip" },
  { "specName": "Pin" },
  { "specName": "Hệ điều hành" }
]
```

---

## 🎁 **11. @promotion-type (Loại khuyến mãi)**

**Type**: List Entity
**Auto-expansion**: ON

```yaml
Reference Value | Synonyms
----------------|--------------------------------------------------
giam-gia        | giảm giá, discount, sale, giảm giá trực tiếp
tra-gop         | trả góp, góp, trả góp 0%, trả góp không lãi
qua-tang        | quà tặng, tặng kèm, gift, freegift, quà tặng kèm
hoan-tien       | hoàn tiền, cashback, hoàn xu
mien-phi-ship   | miễn phí ship, free ship, miễn phí vận chuyển, ship 0đ
flash-sale      | flash sale, giờ vàng, sale sốc, giá sốc
```

---

## 🌍 **12. @location (Địa chỉ/Khu vực)**

**Type**: List Entity
**Auto-expansion**: ON

```yaml
Reference Value | Synonyms
----------------|--------------------------------------------------
ha-noi          | Hà Nội, Ha Noi, HN, thủ đô
ho-chi-minh     | Hồ Chí Minh, Ho Chi Minh, HCM, Sài Gòn, Saigon, SG
da-nang         | Đà Nẵng, Da Nang, DN
hai-phong       | Hải Phòng, Hai Phong, HP
can-tho         | Cần Thơ, Can Tho, CT
noi-thanh       | nội thành, khu vực nội thành, trong thành phố
ngoai-thanh     | ngoại thành, vùng ven, ngoại ô
```

---

## 🔢 **SYSTEM ENTITIES (Có sẵn - Không cần tạo)**

```yaml
@sys.number           # Số: "10", "100"
@sys.number-integer   # Số nguyên: "5", "20", "8500000"
@sys.currency         # Tiền tệ: "100k", "5 triệu", "8tr5"
@sys.date             # Ngày: "hôm nay", "ngày mai", "tuần sau"
@sys.date-time        # Ngày giờ: "2 giờ chiều", "sáng mai"
@sys.email            # Email: "user@example.com"
@sys.phone-number     # SĐT: "0901234567"
@sys.percentage       # Phần trăm: "10%", "5 phần trăm"
```

---

## ✅ **PRIORITY CHECKLIST**

### **Bắt buộc tạo** (Core Entities):
- [x] `@product-category` - Danh mục (1 value: dien-thoai)
- [x] `@brand-name` - Thương hiệu (7 brands)
- [x] `@price-range` - Khoảng giá (7 ranges)
- [x] `@order-id` - Mã đơn hàng (Regex)

### **Nên tạo** (Enhanced Experience):
- [x] `@color-name` - Màu sắc (20 colors)
- [x] `@memory-capacity` - Dung lượng (11 variants)
- [x] `@order-status` - Trạng thái đơn (11 statuses)
- [x] `@payment-method` - Phương thức TT (6 methods)

### **Tùy chọn** (Advanced):
- [x] `@product-name` - Tên sản phẩm cụ thể
- [x] `@product-spec` - Thông số kỹ thuật
- [x] `@promotion-type` - Loại khuyến mãi
- [x] `@location` - Khu vực giao hàng

---

## 📝 **HƯỚNG DẪN TẠO ENTITY TRÊN DIALOGFLOW**

### **Bước 1: Tạo Entity Core (4 cái bắt buộc)**

1. Vào Dialogflow Console → **Entities**
2. Click **CREATE ENTITY**
3. Tạo lần lượt:
   - `product-category` (Define synonyms: ON, Auto-expansion: OFF)
   - `brand-name` (Define synonyms: ON, Auto-expansion: ON)
   - `price-range` (Define synonyms: ON, Auto-expansion: OFF)
   - `order-id` (Regexp entity với pattern `ORD-\d{8}-[A-F0-9]{6}`)

### **Bước 2: Copy-Paste Synonyms**

Copy từng block synonyms từ bảng trên → Paste vào Dialogflow

### **Bước 3: Test Entity**

Vào **"Try it now"** → Nhập:
- "Tìm điện thoại Samsung dưới 10 triệu màu đen"
- Kiểm tra xem các entity có được nhận diện không

---

## 🎯 **ENTITY USAGE IN INTENTS**

```yaml
Intent: product.search
Parameters:
  - @product-category (Required)
  - @brand-name (Optional)
  - @price-range (Optional)
  - @color-name (Optional)

Intent: product.search.by-specs
Parameters:
  - @memory-capacity (Required)
  - @brand-name (Optional)
  - @color-name (Optional)

Intent: order.track
Parameters:
  - @order-id (Required)

Intent: order.check-status
Parameters:
  - @order-status (Optional)
```

---

🎉 **READY TO CREATE SMART INTENTS!**
