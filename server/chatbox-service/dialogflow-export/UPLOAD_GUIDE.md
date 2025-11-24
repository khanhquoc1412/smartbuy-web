# ⚡ HƯỚNG DẪN NHANH: UPLOAD ENTITIES & INTENTS

## 🎯 Mục tiêu
Upload tất cả Entities và Intents vào Dialogflow trong **5 phút** bằng file JSON có sẵn.

---

## 📋 CHECKLIST

### ⚠️ LƯU Ý QUAN TRỌNG

**Dialogflow ES có 2 cách import Intent:**

1. **Upload Intent File (UI)** - KHÔNG ỔN ĐỊNH, thường báo lỗi ❌
2. **Export/Import Agent** - ĐÁNG TIN CẬY, luôn hoạt động ✅

**👉 KHUYẾN NGHỊ: Tạo Intent thủ công hoặc dùng Export/Import Agent (xem cuối trang)**

---

### ✅ Bước 1: Upload Entities (2 phút) - HOẠT ĐỘNG TỐT

1. **Mở Dialogflow Console**
   ```
   https://dialogflow.cloud.google.com/
   ```

2. **Chọn Agent:** `SmartBuy-Assistant`

3. **Vào Entities:**
   - Click **"Entities"** ở sidebar bên trái
   - Click nút **"⋮"** (3 chấm dọc) ở góc phải
   - Chọn **"Upload Entity"**

4. **Chọn 4 file Entity:**
   ```
   dialogflow-export/entities/
   ├── product-category.json  ← Chọn
   ├── brand-name.json        ← Chọn
   ├── price-range.json       ← Chọn
   └── order-id.json          ← Chọn
   ```
   > **Mẹo:** Ctrl + Click để chọn nhiều file cùng lúc

5. **Click "Open"** → Chờ upload hoàn tất

6. **Kiểm tra:**
   - Vào tab **"Entities"**
   - Xem có 4 entities mới: ✅ product-category, ✅ brand-name, ✅ price-range, ✅ order-id

---

### ✅ Bước 2A: TẠO INTENT THỦ CÔNG (KHUYẾN NGHỊ) ⭐

**Vì Dialogflow UI không hỗ trợ upload Intent tốt, hãy tạo thủ công:**

#### **Intent 1: product.search**

1. Click **"Create Intent"**
2. Intent name: `product.search`
3. **Training phrases** (thêm 5-10 câu):
   ```
   Tìm điện thoại
   Có điện thoại nào không
   Tôi muốn mua laptop
   Xem tai nghe
   Sản phẩm nào đang khuyến mãi
   ```

4. **Action and parameters:**
   - Dialogflow tự động nhận diện `@product-category` trong training phrases
   - Nếu không tự động, thêm parameter:
     - Parameter name: `product-category`
     - Entity: `@product-category`
     - Value: `$product-category`

5. **Fulfillment:**
   - ✅ Enable webhook call for this intent

6. Click **SAVE**

---

#### **Intent 2: product.search.by-brand**

1. Click **"Create Intent"**
2. Intent name: `product.search.by-brand`
3. **Training phrases:**
   ```
   Điện thoại Samsung có gì
   Laptop Dell giá bao nhiêu
   iPhone mới nhất
   Tai nghe Sony
   Có Apple không
   Tìm điện thoại Samsung
   ```

4. **Parameters:** (tự động detect)
   - `brand-name` → `@brand-name`
   - `product-category` → `@product-category` (optional)

5. **Fulfillment:** ✅ Enable webhook

6. Click **SAVE**

---

#### **Intent 3: product.search.by-price**

1. Intent name: `product.search.by-price`
2. **Training phrases:**
   ```
   Điện thoại dưới 10 triệu
   Laptop từ 15 đến 20 triệu
   Sản phẩm giá rẻ
   Có gì dưới 5 triệu
   ```

3. **Parameters:**
   - `min-price` → `@sys.number-integer`
   - `max-price` → `@sys.number-integer`
   - `price-range` → `@price-range` (optional)

4. **Fulfillment:** ✅ Enable webhook

5. Click **SAVE**

---

#### **Intent 4: order.track**

1. Intent name: `order.track`
2. **Training phrases:**
   ```
   Kiểm tra đơn hàng ORD-20251119-ABC123
   Đơn hàng của tôi đâu rồi
   Tra đơn ORD-20251119-XYZ789
   Order status
   ```

3. **Parameters:**
   - `order-id` → `@order-id`
   - ✅ Mark as REQUIRED
   - Prompt: "Vui lòng cung cấp mã đơn hàng"

4. **Fulfillment:** ✅ Enable webhook

5. Click **SAVE**

---

#### **Intent 5: policy.shipping**

1. Intent name: `policy.shipping`
2. **Training phrases:**
   ```
   Chính sách giao hàng
   Giao hàng mất bao lâu
   Phí ship bao nhiêu
   Có giao hàng miễn phí không
   ```

3. **Responses** (text):
   ```
   SmartBuy hỗ trợ giao hàng toàn quốc:
   ✅ Miễn phí với đơn từ 500.000đ
   ⏰ Nội thành: 1-2 ngày
   ⏰ Ngoại thành: 3-5 ngày
   📦 COD hỗ trợ toàn quốc
   ```

4. **Fulfillment:** ❌ Không cần webhook (static response)

5. Click **SAVE**

---

### ✅ Bước 2B: HOẶC EXPORT/IMPORT TOÀN BỘ AGENT (Nâng cao)

**Nếu bạn muốn import hàng loạt:**

1. **Tải Agent Template:**
   - Tôi sẽ tạo file `agent.zip` chứa toàn bộ

2. **Import Agent:**
   - Settings (⚙️) → Export and Import
   - Click "IMPORT FROM ZIP"
   - Chọn file `agent.zip`
   - Select "RESTORE" (ghi đè Agent hiện tại)

**⚠️ Cách này sẽ GHI ĐÈ toàn bộ Agent, chỉ dùng nếu Agent còn trống!**

---

### ❌ Bước 2 (CŨ): Upload Intents - KHÔNG HOẠT ĐỘNG

~~1. Vào **"Intents"**~~  
~~2. Click nút **"⋮"** (3 chấm dọc)~~  
~~3. Chọn **"Upload Intent"**~~

**→ Dialogflow ES UI không support upload Intent JSON tốt, hay bị lỗi!**

---

### ✅ Bước 3: Test (1 phút)

1. **Mở "Try it now"** (góc phải màn hình)

2. **Test Entity nhận diện:**
   ```
   Nhập: "Tìm điện thoại Samsung"
   ```
   
   Kết quả mong đợi:
   ```json
   {
     "intent": "product.search.by-brand",
     "parameters": {
       "product-category": "dien-thoai",
       "brand-name": "samsung"
     }
   }
   ```

3. **Test thêm các câu:**
   ```
   ✅ "Laptop dưới 20 triệu"
   ✅ "Kiểm tra đơn ORD-20251119-ABC123"
   ✅ "Chính sách giao hàng"
   ```

---

## 🎉 HOÀN THÀNH!

Bạn đã có:
- ✅ 4 Custom Entities
- ✅ 5 Intents với Training Phrases
- ✅ Parameters tự động map với Entities
- ✅ Webhook enabled cho các Intent cần thiết

---

## 🔧 Troubleshooting

### ❌ Lỗi: "Intent upload failed" / "Error" khi upload Intent
**Nguyên nhân:** Dialogflow ES UI không support upload Intent JSON qua UI tốt

**Cách fix (KHUYẾN NGHỊ):**
1. ❌ KHÔNG dùng "Upload Intent" trong UI
2. ✅ TẠO THỦ CÔNG từng Intent theo hướng dẫn **Bước 2A** ở trên
3. ✅ Hoặc dùng Export/Import toàn bộ Agent (nếu biết cách)

**Lý do:** 
- Upload Intent qua UI của Dialogflow ES rất không ổn định
- Format JSON phức tạp, dễ bị reject
- Tạo thủ công nhanh hơn và đáng tin cậy hơn (5 phút/intent)

---
**Nguyên nhân:** File JSON bị lỗi format

**Cách fix:**
1. Mở file JSON bằng VS Code
2. Kiểm tra syntax highlight (phải màu xanh/vàng, không có đỏ)
3. Validate JSON tại: https://jsonlint.com/
4. Upload lại

---

### ❌ Lỗi: "Intent parameters not recognized"
**Nguyên nhân:** Chưa upload Entities trước

**Cách fix:**
1. Xóa Intent vừa upload: Click intent → Delete
2. Upload lại tất cả Entities trước
3. Sau đó mới upload Intents

---

### ❌ Entity không nhận diện từ tiếng Việt
**Nguyên nhân:** Agent language không đúng

**Cách fix:**
1. Vào Settings (⚙️) của Agent
2. Kiểm tra **"Default Language"** = **Vietnamese (vi)**
3. Nếu sai, tạo lại Agent với language đúng

---

## 📞 TIẾP THEO

Sau khi upload xong, bạn có thể:

1. **Thêm Training Phrases:** Vào mỗi Intent → Thêm câu mới
2. **Thêm Entities:** Tạo thêm Entity cho sản phẩm cụ thể
3. **Test nhiều hơn:** Thử các câu phức tạp hơn
4. **Enable Webhook:** Đã enable sẵn cho các Intent cần thiết

---

## 🚀 Next Step

Chuyển sang **BƯỚC 3** trong `COMPLETE_GUIDE.md`:
```
📖 Xây dựng ChatBox Service Backend
```

**File:** `COMPLETE_GUIDE.md` → Section "BƯỚC 3"

---

**🎯 Thời gian hoàn thành:** 5 phút  
**✅ Độ khó:** Dễ (chỉ cần upload file)
