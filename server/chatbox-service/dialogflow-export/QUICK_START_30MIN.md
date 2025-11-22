# ⚡ QUICK START - 30 PHÚT

## 🎯 MỤC TIÊU
Hoàn thành setup Dialogflow với Entities & Intents trong 30 phút.

---

## ✅ BƯỚC 1: Upload Entities (5 phút)

### Làm gì?
Upload 4 file JSON Entity vào Dialogflow

### Làm thế nào?
1. Vào: https://dialogflow.cloud.google.com/
2. Chọn Agent: `SmartBuy-Assistant`
3. Click **Entities** → **⋮** → **"Upload Entity"**
4. Chọn 4 file trong `entities/` folder
5. Click "Open"

### Kết quả?
✅ 4 Entities được tạo:
- product-category (6 giá trị)
- brand-name (12 thương hiệu)
- price-range (5 khoảng)
- order-id (regex)

---

## ✅ BƯỚC 2: Tạo Intents thủ công (25 phút)

### Tại sao thủ công?
❌ Upload Intent JSON → Bị lỗi "Error"  
✅ Tạo thủ công → Nhanh, đơn giản, không lỗi

### Làm thế nào?
Mở file: **`MANUAL_INTENT_GUIDE.md`** và làm theo

### Tóm tắt nhanh:

#### Intent 1: product.search (5 phút)
```
- CREATE INTENT
- Name: product.search
- Training phrases: 10 câu về tìm sản phẩm
- Enable webhook ✅
- SAVE
```

#### Intent 2: product.search.by-brand (5 phút)
```
- Name: product.search.by-brand
- Training phrases: 10 câu về tìm theo hãng
- Parameters: brand-name (required), product-category
- Enable webhook ✅
- SAVE
```

#### Intent 3: product.search.by-price (6 phút)
```
- Name: product.search.by-price
- Training phrases: 8 câu về tìm theo giá
- Parameters: min-price, max-price, price-range
- Enable webhook ✅
- SAVE
```

#### Intent 4: order.track (5 phút)
```
- Name: order.track
- Training phrases: 6 câu về tra đơn
- Parameters: order-id (REQUIRED ✅)
- Enable webhook ✅
- SAVE
```

#### Intent 5: policy.shipping (4 phút)
```
- Name: policy.shipping
- Training phrases: 7 câu về shipping
- Response: Text về chính sách
- ❌ Không enable webhook
- SAVE
```

---

## ✅ BƯỚC 3: Test (5 phút bonus)

### Vào "Try it now" và test:

```bash
✅ "Tìm điện thoại Samsung"
   → Intent: product.search.by-brand

✅ "Laptop dưới 20 triệu"
   → Intent: product.search.by-price

✅ "Kiểm tra đơn ORD-20251119-ABC123"
   → Intent: order.track

✅ "Chính sách giao hàng"
   → Intent: policy.shipping
   → Response: Text về shipping
```

---

## 🎉 HOÀN THÀNH!

Bạn đã có:
- ✅ 4 Custom Entities
- ✅ 5 Intents hoạt động
- ✅ Webhook enabled cho 4 intents
- ✅ Parameters tự động nhận diện

---

## 🚀 TIẾP THEO

Chuyển sang **BƯỚC 3** trong `COMPLETE_GUIDE.md`:
```
Xây dựng ChatBox Service Backend
```

---

## 📞 HỖ TRỢ

### Nếu gặp lỗi khi upload Entity:
👉 Xem: `UPLOAD_GUIDE.md` → Troubleshooting

### Nếu không biết tạo Intent thế nào:
👉 Xem: `MANUAL_INTENT_GUIDE.md` → Chi tiết từng bước

### Nếu muốn hiểu cấu trúc Intent:
👉 Xem: `DIALOGFLOW_INTENTS.md` → Intent definitions

---

**⏱️ Tổng thời gian:** 30 phút  
**🎯 Độ khó:** Dễ → Trung bình  
**✅ Kết quả:** Dialogflow setup xong, sẵn sàng cho webhook
