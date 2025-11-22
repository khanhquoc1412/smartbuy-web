# 📝 DANH SÁCH INTENT CHO DIALOGFLOW

## 🎯 **1. INTENT CƠ BẢN (Welcome & Fallback)**

### 1.1. Default Welcome Intent
```yaml
Intent Name: Default Welcome Intent
Training Phrases:
  - "Xin chào"
  - "Hello"
  - "Chào bạn"
  - "Hi"
  - "Cho tôi hỏi"

Responses:
  - "Xin chào! Tôi là trợ lý ảo SmartBuy. Tôi có thể giúp gì cho bạn? 😊"
  - "Chào bạn! Bạn muốn tìm sản phẩm hay kiểm tra đơn hàng?"
```

### 1.2. Default Fallback Intent
```yaml
Intent Name: Default Fallback Intent
Responses:
  - "Xin lỗi, tôi chưa hiểu ý bạn. Bạn có thể hỏi về sản phẩm, đơn hàng, hoặc chính sách của chúng tôi."
  - "Tôi chưa được huấn luyện để trả lời câu này. Bạn cần hỗ trợ gì về sản phẩm không?"
```

---

## 🛍️ **2. INTENT TÌM KIẾM SẢN PHẨM**

### 2.1. product.search - Tìm sản phẩm chung
```yaml
Intent Name: product.search
Enable Webhook: ✅ YES

Training Phrases:
  - "Tìm điện thoại"
  - "Có điện thoại nào không"
  - "Tôi muốn mua laptop"
  - "Xem tai nghe"
  - "Sản phẩm nào đang khuyến mãi"

Parameters:
  - @product-category (Entity)
  - @price-range (Entity)

Webhook Response: YES 
```

### 2.2. product.search.by-brand - Tìm theo hãng
```yaml
Intent Name: product.search.by-brand
Enable Webhook: ✅ YES

Training Phrases:
  - "Điện thoại Samsung có gì"
  - "Laptop Dell giá bao nhiêu"
  - "iPhone mới nhất"
  - "Tai nghe Sony"

Parameters:
  - @brand-name (Entity)
  - @product-category (Entity)

Webhook Response: YES
```

### 2.3. product.search.by-price - Tìm theo giá
```yaml
Intent Name: product.search.by-price
Enable Webhook: ✅ YES

Training Phrases:
  - "Điện thoại dưới 10 triệu"
  - "Laptop từ 15 đến 20 triệu"
  - "Sản phẩm giá rẻ"
  - "Có gì dưới 5 triệu"

Parameters:
  - @sys.number-integer (min_price)
  - @sys.number-integer (max_price)
  - @product-category (Entity)

Webhook Response: YES
```

### 2.4. product.detail - Chi tiết sản phẩm
```yaml
Intent Name: product.detail
Enable Webhook: ✅ YES

Training Phrases:
  - "Cho tôi xem chi tiết [product-name]"
  - "Thông số kỹ thuật của [product-name]"
  - "Sản phẩm này có gì đặc biệt"

Parameters:
  - @product-name (Entity)

Webhook Response: YES
```

---

## 📦 **3. INTENT QUẢN LÝ ĐỎN HÀNG**

### 3.1. order.track - Tra cứu đơn hàng
```yaml
Intent Name: order.track
Enable Webhook: ✅ YES

Training Phrases:
  - "Kiểm tra đơn hàng [order-id]"
  - "Đơn hàng của tôi đâu rồi"
  - "Tra đơn [order-id]"
  - "Order status"

Parameters:
  - @order-id (Entity - Regex: ORD-\d{8}-[A-F0-9]{6})

Context: Require user authentication
Webhook Response: YES
```

### 3.2. order.cancel - Hủy đơn hàng
```yaml
Intent Name: order.cancel
Enable Webhook: ✅ YES

Training Phrases:
  - "Tôi muốn hủy đơn [order-id]"
  - "Hủy đơn hàng"
  - "Cancel order [order-id]"

Parameters:
  - @order-id (Entity)

Webhook Response: YES
```

---

## 📋 **4. INTENT CHÍNH SÁCH & HỖ TRỢ**

### 4.1. policy.shipping - Chính sách giao hàng
```yaml
Intent Name: policy.shipping
Enable Webhook: NO (Static Response)

Training Phrases:
  - "Chính sách giao hàng"
  - "Giao hàng mất bao lâu"
  - "Phí ship bao nhiêu"
  - "Có giao hàng miễn phí không"

Responses:
  - "SmartBuy hỗ trợ giao hàng toàn quốc:
     ✅ Miễn phí với đơn từ 500.000đ
     ⏰ Nội thành: 1-2 ngày
     ⏰ Ngoại thành: 3-5 ngày
     📦 COD hỗ trợ toàn quốc"
```

### 4.2. policy.return - Chính sách đổi trả
```yaml
Intent Name: policy.return
Enable Webhook: NO

Training Phrases:
  - "Chính sách đổi trả"
  - "Đổi trả trong bao lâu"
  - "Sản phẩm lỗi thì sao"
  - "Hoàn tiền như thế nào"

Responses:
  - "Chính sách đổi trả SmartBuy:
     🔄 Đổi trả trong 7 ngày
     ✅ Miễn phí với sản phẩm lỗi
     📱 Giữ nguyên hộp và phụ kiện
     💰 Hoàn tiền sau 3-5 ngày làm việc"
```

### 4.3. policy.warranty - Bảo hành
```yaml
Intent Name: policy.warranty
Enable Webhook: NO

Training Phrases:
  - "Chính sách bảo hành"
  - "Bảo hành bao lâu"
  - "Bảo hành ở đâu"

Responses:
  - "Thông tin bảo hành SmartBuy:
     ⚡ Bảo hành chính hãng 12-24 tháng
     🏢 Bảo hành tại trung tâm hãng
     🆓 Đổi mới trong 30 ngày nếu lỗi NSX
     📞 Hotline: 1900-xxxx"
```

---

## 🎁 **5. INTENT KHUYẾN MÃI & GIÁ**

### 5.1. promotion.check - Kiểm tra khuyến mãi
```yaml
Intent Name: promotion.check
Enable Webhook: ✅ YES

Training Phrases:
  - "Có khuyến mãi gì không"
  - "Flash sale hôm nay"
  - "Mã giảm giá"
  - "Ưu đãi gì hot"

Webhook Response: YES
```

### 5.2. price.compare - So sánh giá
```yaml
Intent Name: price.compare
Enable Webhook: ✅ YES

Training Phrases:
  - "So sánh [product1] và [product2]"
  - "Cái nào tốt hơn giữa [product1] và [product2]"
  - "[product1] khác gì [product2]"

Parameters:
  - @product-name-1 (Entity)
  - @product-name-2 (Entity)

Webhook Response: YES
```

---

## 👤 **6. INTENT TÀI KHOẢN**

### 6.1. account.login - Yêu cầu đăng nhập
```yaml
Intent Name: account.login
Enable Webhook: NO

Training Phrases:
  - "Tôi muốn đăng nhập"
  - "Login"
  - "Đăng nhập tài khoản"

Responses:
  - "Để sử dụng đầy đủ tính năng, vui lòng đăng nhập tại: [URL]"
```

### 6.2. account.register - Đăng ký tài khoản
```yaml
Intent Name: account.register
Enable Webhook: NO

Training Phrases:
  - "Đăng ký tài khoản"
  - "Tạo tài khoản mới"
  - "Sign up"

Responses:
  - "Tạo tài khoản SmartBuy ngay để nhận ưu đãi: [URL]"
```

---

## 🏷️ **7. ENTITIES (Custom) - HƯỚNG DẪN TẠO**

> **⚠️ LƯU Ý:** Bạn PHẢI tạo các Entity này TRƯỚC KHI tạo Intent để sử dụng!

### 7.1. @product-category (Danh mục sản phẩm)

**Các bước tạo trên Dialogflow:**
1. Vào **Entities** → Click **"CREATE ENTITY"**
2. Nhập tên: `product-category`
3. Bật **"Define synonyms"** (cho phép nhiều cách gọi)
4. Thêm các giá trị:

```yaml
Entity Name: product-category
Auto-expansion: OFF (tắt để control chính xác)

Reference Value | Synonyms (Từ đồng nghĩa)
----------------|----------------------------------
dien-thoai      | điện thoại, smartphone, phone, di động, mobile, điện thoại di động
laptop          | laptop, máy tính xách tay, macbook, ultrabook, notebook
tablet          | tablet, máy tính bảng, ipad, samsung tab
tai-nghe        | tai nghe, headphone, earphone, airpods, earbud, tai nghe bluetooth
phu-kien        | phụ kiện, accessory, case, ốp, sạc, cáp
smartwatch      | smartwatch, đồng hồ thông minh, smart watch, apple watch
```

**Ví dụ cụ thể khi nhập:**
- Reference value: `dien-thoai`
- Synonyms: `điện thoại`, `smartphone`, `phone`, `di động`, `mobile`

**Screenshot tham khảo:**
```
┌─────────────────────────────────────────────────────┐
│ Entity name: product-category                       │
│ ☑ Define synonyms                                   │
│ ☐ Allow automated expansion                         │
│                                                      │
│ Reference value        │ Synonyms                   │
│ ─────────────────────────────────────────────────── │
│ dien-thoai            │ điện thoại, smartphone...  │
│ laptop                │ laptop, máy tính xách tay  │
│ ...                   │ ...                         │
└─────────────────────────────────────────────────────┘
```

### 7.2. @brand-name (Thương hiệu)

**Các bước tạo:**
1. Click **"CREATE ENTITY"** tiếp
2. Nhập tên: `brand-name`
3. Bật **"Define synonyms"**
4. Thêm các thương hiệu:

```yaml
Entity Name: brand-name
Auto-expansion: ON (bật để nhận diện thương hiệu mới)

Reference Value | Synonyms
----------------|----------------------------------
apple           | Apple, iPhone, iPad, Mac, MacBook, Apple Inc
samsung         | Samsung, Galaxy, Sam Sung
xiaomi          | Xiaomi, Mi, Redmi, Poco, Tiểu mễ
oppo            | Oppo, OPPO
vivo            | Vivo, VIVO
realme          | Realme, Real me
dell            | Dell, DELL
hp              | HP, Hewlett Packard
asus            | Asus, ASUS
lenovo          | Lenovo
sony            | Sony, SONY
jbl             | JBL, J.B.L
```

**Lưu ý:** Bật **"Allow automated expansion"** để Dialogflow tự nhận diện các thương hiệu tương tự chưa khai báo.

### 7.3. @price-range (Khoảng giá)

**Các bước tạo:**
1. Click **"CREATE ENTITY"**
2. Nhập tên: `price-range`
3. Bật **"Define synonyms"**
4. Thêm các mức giá:

```yaml
Entity Name: price-range
Auto-expansion: OFF

Reference Value | Synonyms
----------------|------------------------------------------
duoi-5-trieu    | dưới 5 triệu, <5tr, dưới 5tr, giá rẻ, tầm 5 triệu
5-10-trieu      | từ 5 đến 10 triệu, 5-10tr, tầm 10 triệu
10-15-trieu     | từ 10 đến 15 triệu, 10-15tr, tầm 15 triệu
15-20-trieu     | từ 15 đến 20 triệu, 15-20tr, tầm 20 triệu
tren-20-trieu   | trên 20 triệu, >20tr, cao cấp, flagship
```

**💡 Mẹo:** Bạn có thể dùng **@sys.number** (system entity) để bắt số tiền trực tiếp thay vì dùng khoảng giá cố định.

---

### 7.4. @order-id (Mã đơn hàng - Regex Pattern)

**Các bước tạo:**
1. Click **"CREATE ENTITY"**
2. Nhập tên: `order-id`
3. Chọn **"Regexp entity"** (Entity dạng regex)
4. Nhập pattern:

```yaml
Entity Name: order-id
Entity Type: Regexp entity

Regexp Pattern:
  ORD-\d{8}-[A-F0-9]{6}

Examples:
  - ORD-20241119-A1B2C3
  - ORD-20241120-F9E8D7
```

**Giải thích pattern:**
- `ORD-` : Prefix cố định
- `\d{8}` : 8 chữ số (ngày tháng năm)
- `-` : Dấu gạch ngang
- `[A-F0-9]{6}` : 6 ký tự hex (A-F, 0-9)

---

### 7.5. Sử dụng System Entities (Có sẵn)

Dialogflow cung cấp sẵn các **System Entities** không cần tạo:

```yaml
@sys.number           # Số: "10", "100"
@sys.number-integer   # Số nguyên: "5", "20"
@sys.date             # Ngày: "hôm nay", "ngày mai"
@sys.date-time        # Ngày giờ: "2 giờ chiều"
@sys.currency         # Tiền tệ: "100k", "5 triệu"
@sys.email            # Email: "user@example.com"
@sys.phone-number     # SĐT: "0901234567"
```

**Cách dùng:**
- Trong Intent, chọn Entity → Tìm `@sys.number`
- Không cần tạo, chỉ cần reference

---

## 📊 **8. CONTEXT (Quản lý hội thoại)**

### 8.1. Input Context
```yaml
Contexts:
  - awaiting-order-id (Lifespan: 5)
  - user-authenticated (Lifespan: 100)
  - product-selected (Lifespan: 10)
```

### 8.2. Output Context
```yaml
Set Context:
  - product-category-selected
  - order-tracking-active
  - cart-session-active
```

---

## 🎨 **9. RICH RESPONSES (Custom Payload)**

### 9.1. Card Response (Hiển thị sản phẩm)
```json
{
  "richContent": [
    [
      {
        "type": "info",
        "title": "iPhone 15 Pro Max",
        "subtitle": "29.990.000đ",
        "image": {
          "src": {
            "rawUrl": "https://example.com/iphone15.jpg"
          }
        },
        "actionLink": "https://smartbuy.com/product/iphone15"
      }
    ]
  ]
}
```

### 9.2. Chips (Gợi ý câu hỏi)
```json
{
  "richContent": [
    [
      {
        "type": "chips",
        "options": [
          { "text": "Xem điện thoại" },
          { "text": "Kiểm tra đơn hàng" },
          { "text": "Chính sách đổi trả" }
        ]
      }
    ]
  ]
}
```

---

## ✅ **TỔNG KẾT INTENT**

| STT | Intent Name | Webhook | Priority |
|-----|-------------|---------|----------|
| 1 | Default Welcome | ❌ | High |
| 2 | product.search | ✅ | High |
| 3 | product.search.by-brand | ✅ | High |
| 4 | product.search.by-price | ✅ | High |
| 5 | product.detail | ✅ | Medium |
| 6 | order.track | ✅ | High |
| 7 | order.cancel | ✅ | Medium |
| 8 | policy.shipping | ❌ | Low |
| 9 | policy.return | ❌ | Low |
| 10 | policy.warranty | ❌ | Low |
| 11 | promotion.check | ✅ | High |
| 12 | price.compare | ✅ | Medium |

---

## 📝 **HƯỚNG DẪN TẠO INTENT TRÊN DIALOGFLOW**

> **⚠️ QUAN TRỌNG:** Tạo tất cả **Entities** (mục 7) TRƯỚC, sau đó mới tạo Intent!

### Bước 1: Tạo Intent
1. Vào Dialogflow Console → Chọn Agent
2. Click "Intents" → "Create Intent"
3. Đặt tên Intent (vd: `product.search`)

### Bước 2: Thêm Training Phrases
1. Scroll xuống "Training Phrases"
2. Click "Add Training Phrases"
3. Nhập các câu mẫu (tối thiểu 10-20 câu)

### Bước 3: Cấu hình Parameters
1. Dialogflow **tự động nhận diện entities** trong Training Phrases
2. Đánh dấu **Required** cho parameter bắt buộc
3. Set **Prompts** để bot hỏi lại nếu thiếu thông tin

**Ví dụ với Intent `product.search`:**
```
Training Phrase: "Tìm điện thoại Samsung"
                       ^^^^^^^^^ ^^^^^^^ 
                       auto      auto
                       detected  detected
                       as        as
                   @product-category  @brand-name
```

**Khi bạn nhập Training Phrase có chứa từ "điện thoại":**
- Dialogflow sẽ **tự động highlight** và gợi ý Entity `@product-category`
- Bạn click vào → Chọn Entity phù hợp
- Parameter tự động được thêm vào bảng dưới

### Bước 4: Enable Webhook
1. Scroll xuống "Fulfillment"
2. Enable "Webhook call for this intent"
3. Save Intent

### Bước 5: Test Intent
1. Click "Try it now" ở góc phải
2. Nhập câu hỏi test
3. Kiểm tra parameter extraction

---

## 🎬 **VIDEO HƯỚNG DẪN TẠO ENTITY TỪNG BƯỚC**

### **Luồng tạo Entity hoàn chỉnh:**

```
1. Vào Dialogflow Console
   ↓
2. Chọn Agent "SmartBuy-Assistant"
   ↓
3. Click "Entities" ở sidebar
   ↓
4. Click nút "CREATE ENTITY" (màu xanh)
   ↓
5. Điền thông tin:
   - Entity name: product-category
   - ☑ Define synonyms
   - ☐ Allow automated expansion (TẮT cho category, BẬT cho brand)
   ↓
6. Thêm từng dòng:
   - Reference value: dien-thoai
   - Synonyms: điện thoại, smartphone, phone
   ↓
7. Click "SAVE"
   ↓
8. Lặp lại cho các Entity khác
```

---

## 🧪 **TEST ENTITY SAU KHI TẠO**

### Cách test Entity vừa tạo:

1. **Vào "Try it now"** (góc phải màn hình)
2. **Nhập câu test:** "Tìm điện thoại Samsung"
3. **Kiểm tra kết quả:**

```json
{
  "queryResult": {
    "parameters": {
      "product-category": "dien-thoai",  ✅ Nhận diện đúng
      "brand-name": "samsung"            ✅ Nhận diện đúng
    }
  }
}
```

4. **Nếu không nhận diện:**
   - Kiểm tra lại synonyms trong Entity
   - Thêm từ đồng nghĩa bị thiếu
   - Re-train Agent (Dialogflow tự động train)

---

## 📋 **CHECKLIST TẠO ENTITY**

- [ ] **Bước 1:** Tạo Entity `@product-category` (6 giá trị)
- [ ] **Bước 2:** Tạo Entity `@brand-name` (12+ thương hiệu)
- [ ] **Bước 3:** Tạo Entity `@price-range` (5 mức giá)
- [ ] **Bước 4:** Tạo Entity `@order-id` (Regex pattern)
- [ ] **Bước 5:** Test từng Entity bằng "Try it now"
- [ ] **Bước 6:** Kiểm tra synonyms hoạt động đúng
- [ ] **Bước 7:** Bật Auto-expansion cho `@brand-name`

✅ **Sau khi hoàn thành checklist này, bạn mới bắt đầu tạo Intent!**

---

🎯 **TIẾP THEO: Chúng ta sẽ xây dựng ChatService Backend để xử lý các webhook này!**
