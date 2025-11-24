# 📝 HƯỚNG DẪN TẠO INTENT THỦ CÔNG (5 PHÚT/INTENT)

## ⚠️ TẠI SAO PHẢI TẠO THỦ CÔNG?

**Dialogflow ES UI không support upload Intent JSON tốt:**
- ❌ Upload qua "Upload Intent" → Hay bị lỗi "Error"
- ❌ Format JSON phức tạp → Dễ bị reject
- ✅ Tạo thủ công → Nhanh, đơn giản, không lỗi

---

## 🎯 INTENT 1: product.search (Tìm sản phẩm chung)

### Bước 1: Tạo Intent mới
```
Intents → CREATE INTENT
```

### Bước 2: Đặt tên
```
Intent name: product.search
```

### Bước 3: Thêm Training Phrases

Click **"Add training phrases"** và nhập:

```
Tìm điện thoại
Có điện thoại nào không
Tôi muốn mua điện thoại
Xem điện thoại
Sản phẩm nào đang khuyến mãi
Cho tôi xem điện thoại
Điện thoại gì đẹp
Có điện thoại mới không
Xem smartphone
Điện thoại mới về
Có phone nào hot không
Tìm smartphone
```

**💡 Mẹo:** Khi bạn nhập "điện thoại", Dialogflow sẽ tự động highlight và gợi ý Entity `@product-category`

**⚠️ Lưu ý:** Vì shop bạn chỉ bán điện thoại, nên tập trung training phrases về điện thoại thay vì nhiều loại sản phẩm

### Bước 4: Kiểm tra Parameters

Scroll xuống **"Action and parameters"**

Dialogflow tự động tạo:
```
PARAMETER NAME    | ENTITY              | VALUE
------------------|---------------------|-------------------
product-category  | @product-category   | $product-category
```

**Nếu không tự động:** Click "+ New parameter" và thêm thủ công

### Bước 5: Enable Webhook

Scroll xuống **"Fulfillment"**
```
✅ Enable webhook call for this intent
```

### Bước 6: Save
```
Click "SAVE" button (góc trên)
```

---

## 🎯 INTENT 2: product.search.by-brand (Tìm theo hãng)

### Training Phrases:
```
Điện thoại Samsung có gì
Samsung có điện thoại nào
iPhone mới nhất
Có Apple không
Tìm điện thoại Samsung
Xiaomi có gì hot
Oppo ra gì mới
Samsung flagship
Vivo có gì mới
Realme giá tốt không
Điện thoại Xiaomi
Phone Samsung
```

### Parameters (tự động detect):
```
PARAMETER NAME    | ENTITY              | REQUIRED | VALUE
------------------|---------------------|----------|-------------------
brand-name        | @brand-name         | ✅ Yes   | $brand-name
product-category  | @product-category   | ❌ No    | $product-category
```

**Đặt REQUIRED cho brand-name:**
- Click checkbox "REQUIRED"
- Prompt: "Bạn muốn tìm hãng nào?"

### Webhook: ✅ Enable

### Save ✅

---

## 🎯 INTENT 3: product.search.by-price (Tìm theo giá)

### Training Phrases:
```
Điện thoại dưới 10 triệu
Điện thoại từ 5 đến 10 triệu
Sản phẩm giá rẻ
Có gì dưới 5 triệu
Điện thoại tầm 15 triệu
Phone giá 20 triệu
Tìm điện thoại dưới 5 triệu
Điện thoại từ 10 đến 15 triệu
Smartphone dưới 20 triệu
Có điện thoại giá rẻ không
```

### Parameters:

**Cách highlight số tiền:**
1. Nhập training phrase: "Điện thoại dưới **10** triệu"
2. Click vào số **10** → Chọn Entity `@sys.number-integer`
3. Đặt tên parameter: `max-price`

```
PARAMETER NAME    | ENTITY                | REQUIRED | VALUE
------------------|---------------------- |----------|-------------------
min-price         | @sys.number-integer   | ❌ No    | $min-price
max-price         | @sys.number-integer   | ❌ No    | $max-price
price-range       | @price-range          | ❌ No    | $price-range
product-category  | @product-category     | ❌ No    | $product-category
```

### Webhook: ✅ Enable

### Save ✅

---

## 🎯 INTENT 4: order.track (Tra cứu đơn hàng)

### Training Phrases:
```
Kiểm tra đơn hàng ORD-20251119-ABC123
Đơn hàng của tôi đâu rồi
Tra đơn ORD-20251119-XYZ789
Order status
Xem đơn hàng
Đơn hàng ORD-20251119-ABC123 đang ở đâu
```

### Parameters:

**Để Dialogflow nhận diện mã đơn hàng:**
1. Nhập: "Kiểm tra đơn ORD-20251119-ABC123"
2. Highlight **ORD-20251119-ABC123**
3. Chọn Entity `@order-id`
4. Parameter name: `order-id`

```
PARAMETER NAME | ENTITY      | REQUIRED | PROMPTS
---------------|-------------|----------|--------------------------------
order-id       | @order-id   | ✅ Yes   | "Vui lòng cung cấp mã đơn hàng"
```

### Webhook: ✅ Enable

### Save ✅

---

## 🎯 INTENT 5: policy.shipping (Chính sách giao hàng)

### Training Phrases:
```
Chính sách giao hàng
Giao hàng mất bao lâu
Phí ship bao nhiêu
Có giao hàng miễn phí không
Có COD không
Thời gian giao hàng
Free ship không
```

### Parameters: ❌ Không có

### Responses (Text response):

Scroll xuống **"Responses"** → Thêm text:

```
SmartBuy hỗ trợ giao hàng toàn quốc:
✅ Miễn phí với đơn từ 500.000đ
⏰ Nội thành: 1-2 ngày
⏰ Ngoại thành: 3-5 ngày
📦 COD hỗ trợ toàn quốc
```

### Webhook: ❌ KHÔNG enable (dùng static response)

### Save ✅

---

## 📊 TỔNG KẾT

Sau khi tạo xong 5 Intent, bạn có:

| Intent Name | Training Phrases | Parameters | Webhook | Time |
|-------------|-----------------|------------|---------|------|
| product.search | 12 câu về điện thoại | 1 param | ✅ | 5 min |
| product.search.by-brand | 12 câu về hãng điện thoại | 2 params | ✅ | 5 min |
| product.search.by-price | 10 câu về giá điện thoại | 4 params | ✅ | 6 min |
| order.track | 6 câu về tra đơn | 1 param (required) | ✅ | 5 min |
| policy.shipping | 7 câu về giao hàng | 0 params | ❌ | 3 min |

**Tổng thời gian:** ~24 phút cho 5 intents

**💡 Tối ưu cho shop điện thoại:** Tất cả training phrases đều tập trung vào điện thoại/smartphone

---

## ✅ TEST

Vào **"Try it now"** (góc phải):

```bash
# Test 1 - Tìm sản phẩm chung
User: "Tìm điện thoại"
Expected: Intent = product.search

# Test 2 - Tìm theo hãng
User: "Điện thoại Samsung"
Expected: Intent = product.search.by-brand
          Parameters: brand-name = "samsung"

# Test 3 - Tìm theo giá
User: "Điện thoại dưới 10 triệu"
Expected: Intent = product.search.by-price
          Parameters: max-price = 10

# Test 4 - Tìm theo hãng + giá
User: "iPhone dưới 20 triệu"
Expected: Intent = product.search.by-price
          Parameters: brand-name = "apple", max-price = 20

# Test 5 - Tra đơn hàng
User: "Kiểm tra đơn ORD-20251119-ABC123"
Expected: Intent = order.track

# Test 6 - Chính sách
User: "Chính sách giao hàng"
Expected: Intent = policy.shipping
         Response = Text về shipping policy
```

---

## 💡 MẸO

### Thêm Training Phrase nhanh:
- Copy/paste cả list vào → Dialogflow tự động tách từng dòng
- Dùng synonyms trong Entity để giảm số training phrases

### Highlight Entity:
- Double-click từ → Chọn Entity → Done
- Hoặc nhập `@entity-name` trong training phrase

### Clone Intent:
- Vào Intent → Click "⋮" → "Copy"
- Paste → Đổi tên → Sửa training phrases

---

## 🚀 TIẾP THEO

Sau khi tạo xong 5 Intent cơ bản:

1. ✅ Test trong "Try it now"
2. ✅ Chuyển sang **BƯỚC 3** trong `COMPLETE_GUIDE.md`
3. ✅ Setup ChatBox Service Backend
4. ✅ Kết nối Webhook

---

**⏱️ Tổng thời gian:** 25-30 phút  
**✅ Kết quả:** 5 Intents hoạt động tốt, không lỗi
