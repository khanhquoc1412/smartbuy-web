# 📦 DIALOGFLOW IMPORT FILES

## ⚠️ QUAN TRỌNG - ĐỌC TRƯỚC KHI LÀM

**Dialogflow ES UI không support upload Intent JSON tốt!**

### ✅ Entities - Upload file JSON hoạt động TỐT
### ❌ Intents - Upload file JSON HAY BỊ LỖI

**👉 GIẢI PHÁP:**
- ✅ Upload Entities bằng file JSON (2 phút, không lỗi)
- ✅ Tạo Intents THỦ CÔNG (25 phút, đáng tin cậy)

---

## 📚 HƯỚNG DẪN SỬ DỤNG

### 🚀 Bạn muốn setup NHANH (30 phút)?
👉 Đọc: **`QUICK_START_30MIN.md`**

### 📖 Bạn muốn hướng dẫn CHI TIẾT từng bước?
👉 Đọc: **`MANUAL_INTENT_GUIDE.md`**

### ⚠️ Bạn gặp lỗi khi upload?
👉 Đọc: **`UPLOAD_GUIDE.md`** → Troubleshooting

---

```
dialogflow-export/
├── entities/              # Custom Entities
│   ├── product-category.json
│   ├── brand-name.json
│   ├── price-range.json
│   └── order-id.json
│
├── intents/              # Intents
│   ├── product.search.json
│   ├── product.search.by-brand.json
│   ├── product.search.by-price.json
│   ├── order.track.json
│   └── policy.shipping.json
│
└── README.md            # File này
```

---

## 🚀 HƯỚNG DẪN IMPORT

### **Bước 1: Import Entities** ✅ HOẠT ĐỘNG TỐT

1. Vào **Dialogflow Console** → Chọn Agent `SmartBuy-Assistant`
2. Click **"Entities"** ở sidebar
3. Click nút **"⋮"** (3 chấm dọc) ở góc phải → Chọn **"Upload Entity"**
4. Chọn **4 file** từ thư mục `entities/`:
   - `product-category.json` ✅
   - `brand-name.json` ✅
   - `price-range.json` ✅
   - `order-id.json` ✅
5. Click "Open" → Upload thành công!

**Kết quả:** 4 Entities được tạo tự động

---

### **Bước 2: Tạo Intents** ⚠️ PHẢI TẠO THỦ CÔNG

**❌ KHÔNG dùng "Upload Intent" trong UI** → Hay bị lỗi "Error"

**✅ TẠO THỦ CÔNG** theo hướng dẫn chi tiết:

📖 **Mở file:** `MANUAL_INTENT_GUIDE.md`

Hoặc làm theo các bước sau:

#### **Intent 1: product.search**
1. CREATE INTENT → Tên: `product.search`
2. Training phrases: "Tìm điện thoại", "Có điện thoại nào không"...
3. Enable webhook ✅
4. SAVE

#### **Intent 2: product.search.by-brand**
1. CREATE INTENT → Tên: `product.search.by-brand`
2. Training phrases: "Điện thoại Samsung", "iPhone có gì"...
3. Parameters: `brand-name`, `product-category`
4. Enable webhook ✅
5. SAVE

#### **Intent 3: product.search.by-price**
1. CREATE INTENT → Tên: `product.search.by-price`
2. Training phrases: "Laptop dưới 20 triệu"...
3. Parameters: `min-price`, `max-price`, `price-range`
4. Enable webhook ✅
5. SAVE

#### **Intent 4: order.track**
1. CREATE INTENT → Tên: `order.track`
2. Training phrases: "Kiểm tra đơn ORD-20251119-ABC123"...
3. Parameters: `order-id` (REQUIRED ✅)
4. Enable webhook ✅
5. SAVE

#### **Intent 5: policy.shipping**
1. CREATE INTENT → Tên: `policy.shipping`
2. Training phrases: "Chính sách giao hàng"...
3. Response: Text về shipping policy
4. ❌ Không enable webhook
5. SAVE

**⏱️ Thời gian:** ~25 phút cho 5 intents

**📖 Chi tiết:** Xem `MANUAL_INTENT_GUIDE.md`

---

## ✅ Kiểm tra sau khi Import

### **Test Entities:**

Vào **"Try it now"** → Nhập:
```
"Tìm điện thoại Samsung"
```

Kết quả mong đợi:
```json
{
  "parameters": {
    "product-category": "dien-thoai",
    "brand-name": "samsung"
  }
}
```

---

### **Test Intents:**

1. **Test product.search:**
   ```
   User: "Tìm laptop"
   Expected: Intent detected = product.search
   ```

2. **Test product.search.by-brand:**
   ```
   User: "iPhone có gì"
   Expected: Intent detected = product.search.by-brand
   ```

3. **Test product.search.by-price:**
   ```
   User: "Điện thoại dưới 10 triệu"
   Expected: Intent detected = product.search.by-price
   ```

4. **Test order.track:**
   ```
   User: "Kiểm tra đơn ORD-20251119-ABC123"
   Expected: Intent detected = order.track
   ```

5. **Test policy.shipping:**
   ```
   User: "Chính sách giao hàng"
   Expected: Response hiển thị thông tin giao hàng
   ```

---

## 🔧 Troubleshooting

### **Lỗi: "Failed to upload entity"**
- ✅ Kiểm tra file JSON có đúng format không
- ✅ Đảm bảo tên entity không trùng với entity có sẵn
- ✅ Upload từng file một thay vì upload cùng lúc

### **Lỗi: "Intent parameters not detected"**
- ✅ Đảm bảo đã import tất cả Entities TRƯỚC
- ✅ Re-upload Intent sau khi import xong Entities
- ✅ Kiểm tra `dataType` trong Intent JSON có khớp với Entity name

### **Entity không nhận diện từ đồng nghĩa**
- ✅ Kiểm tra lại synonyms trong Entity JSON
- ✅ Thêm synonyms nếu thiếu
- ✅ Click "Save" để retrain Agent

---

## 📝 Tùy chỉnh sau khi Import

### **Thêm Training Phrases:**
1. Vào Intent → "Training phrases"
2. Click "Add training phrases"
3. Nhập câu mới
4. Dialogflow tự động highlight entities
5. Save

### **Thêm Response:**
1. Vào Intent → "Responses"
2. Thêm text response hoặc custom payload
3. Save

### **Enable Webhook:**
1. Vào Intent → "Fulfillment"
2. Enable "Webhook call for this intent"
3. Save

---

## 🎯 Các Intent còn thiếu (cần tạo thêm)

Sau khi import xong, bạn có thể tạo thêm các Intent sau:

- [ ] `order.cancel` - Hủy đơn hàng
- [ ] `promotion.check` - Kiểm tra khuyến mãi
- [ ] `price.compare` - So sánh giá
- [ ] `policy.return` - Chính sách đổi trả
- [ ] `policy.warranty` - Chính sách bảo hành
- [ ] `account.login` - Đăng nhập
- [ ] `account.register` - Đăng ký

Tham khảo file `DIALOGFLOW_INTENTS.md` để biết chi tiết Training Phrases cho mỗi Intent.

---

## 📞 Support

Nếu gặp vấn đề khi import, kiểm tra:
1. Dialogflow Console có hiển thị lỗi gì không
2. File JSON có bị corrupt không (dùng JSONLint.com để validate)
3. Agent language có đúng là "Vietnamese (vi)" không

---

✅ **Sau khi import xong, bạn có thể tiếp tục với Bước 3 trong COMPLETE_GUIDE.md!**
