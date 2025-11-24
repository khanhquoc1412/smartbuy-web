# 🔧 HƯỚNG DẪN SỬA LỖI INTENT CONFLICT

## ⚠️ Vấn đề
Khi gõ **"iPhone"** hoặc **"tìm điện thoại iPhone"**, chatbot match nhầm vào intent `product.compare` thay vì `product.search.by-brand`.

## 🎯 Nguyên nhân
- Intent `product.compare` có training phrase: "iPhone hay Samsung"
- Intent `product.search.by-brand` có training phrase: "Tìm iPhone"
- Cả 2 đều có priority = 500000 → Dialogflow bị confused

## ✅ Giải pháp
Tăng priority của `product.search.by-brand` lên **600000** để ưu tiên match brand search trước comparison.

---

## 📋 BƯỚC 1: Cập nhật Intent Priority trên Dialogflow Console

### 1.1. Truy cập Dialogflow Console
1. Mở: https://dialogflow.cloud.google.com/
2. Chọn agent: **SmartBuy Assistant**
3. Vào tab **Intents** (bên trái)

### 1.2. Cập nhật product.search.by-brand
1. Click vào intent: **product.search.by-brand**
2. Scroll xuống phần **Priority**
3. Thay đổi từ `500000` → **`600000`**
4. Click **SAVE** ở góc trên

### 1.3. Verify product.compare (không cần sửa)
1. Click vào intent: **product.compare**
2. Kiểm tra Priority = `500000` (giữ nguyên)
3. Không cần save

---

## 🎨 BƯỚC 2: Kiểm tra CSS hình ảnh đã áp dụng

File `client/src/components/common/ChatboxWidget.vue` đã được cập nhật với CSS:

```css
/* Tăng kích thước hình ảnh trong info card */
df-messenger df-messenger-chat .df-messenger-message-list .info-card-image {
  min-height: 120px !important;
  max-height: 180px !important;
  height: auto !important;
  object-fit: cover !important;
  width: 100% !important;
}

/* Đảm bảo container của image đủ cao */
df-messenger df-messenger-chat .df-messenger-message-list .info-card {
  display: flex !important;
  flex-direction: row !important;
}

df-messenger df-messenger-chat .df-messenger-message-list .info-card .image-container {
  min-width: 120px !important;
  max-width: 150px !important;
  flex-shrink: 0 !important;
}
```

**Hình ảnh bây giờ sẽ**:
- Cao tối thiểu 120px, tối đa 180px
- Cover toàn bộ container
- Không bị méo, tỷ lệ chuẩn
- Responsive trên mobile (100-150px)

---

## 🧪 BƯỚC 3: Test sau khi cập nhật

### 3.1. Restart Frontend (để CSS có hiệu lực)
```bash
# Terminal Frontend
cd client
npm run dev
```

### 3.2. Test Intent Routing

| Input | Expected Intent | Expected Response |
|-------|----------------|-------------------|
| `iPhone` | **product.search.by-brand** | Danh sách iPhone + brand chips |
| `Tìm iPhone` | **product.search.by-brand** | Danh sách iPhone |
| `Điện thoại iPhone` | **product.search.by-brand** | Danh sách iPhone |
| `Samsung` | **product.search.by-brand** | Danh sách Samsung |
| `iPhone hay Samsung` | **product.compare** | So sánh 2 sản phẩm |
| `So sánh iPhone 15 và S24` | **product.compare** | So sánh chi tiết |

### 3.3. Test Hình ảnh

1. Gõ: **"Tìm iPhone"**
2. Kiểm tra product cards:
   - ✅ Hình ảnh to hơn (120-180px)
   - ✅ Hình cao từ title xuống subtitle
   - ✅ Không bị nhỏ, không bị méo
   - ✅ Responsive trên mobile

---

## 🔍 Troubleshooting

### Vấn đề 1: Vẫn match nhầm intent

**Triệu chứng**: Gõ "iPhone" vẫn match vào product.compare

**Giải pháp**:
1. Xác nhận đã save intent với priority 600000
2. Đợi 1-2 phút để Dialogflow cập nhật model
3. Clear cache và test lại
4. Nếu vẫn lỗi, thử training thêm phrases:
   - Vào `product.search.by-brand`
   - Thêm training phrases:
     - "iPhone"
     - "Điện thoại iPhone"
     - "Xem iPhone"
   - Save và test lại

### Vấn đề 2: CSS hình ảnh không áp dụng

**Triệu chứng**: Hình vẫn nhỏ sau khi restart

**Giải pháp**:
1. Hard refresh browser: `Ctrl + Shift + R` (Windows) hoặc `Cmd + Shift + R` (Mac)
2. Clear browser cache
3. Inspect element để kiểm tra CSS có load không:
   ```
   Right click vào hình ảnh → Inspect → Check styles tab
   ```
4. Nếu không thấy CSS, kiểm tra file `ChatboxWidget.vue` đã save chưa

### Vấn đề 3: Hình bị méo

**Triệu chứng**: Hình to nhưng bị kéo giãn

**Giải pháp**:
- `object-fit: cover` đã được set để giữ tỷ lệ
- Nếu vẫn méo, thêm CSS:
  ```css
  df-messenger df-messenger-chat .df-messenger-message-list .info-card-image {
    object-position: center !important;
  }
  ```

---

## 📊 Kết quả mong đợi

### Before (Lỗi)
```
User: "iPhone"
❌ Match vào product.compare (wrong!)
❌ Hình ảnh nhỏ (50x50px)
```

### After (Đúng)
```
User: "iPhone"
✅ Match vào product.search.by-brand (correct!)
✅ Hình ảnh to (120-180px)
✅ Hình cao từ title xuống subtitle
```

---

## 📝 Ghi chú quan trọng

1. **Priority Range**:
   - Default: 500000
   - product.search.by-brand: **600000** (cao hơn)
   - product.compare: 500000 (thấp hơn)
   - Nguyên tắc: Intent nào priority cao hơn sẽ được match trước

2. **CSS Specificity**:
   - Sử dụng `!important` để override default styles của Dialogflow
   - Nested selectors để target đúng element

3. **Training Phrases**:
   - Nếu vẫn có conflict, thêm nhiều training phrases cho brand search:
     - "Tìm [brand]"
     - "Xem [brand]"
     - "Có [brand] không"
     - "Điện thoại [brand]"

---

## ✅ Checklist hoàn thành

- [ ] Cập nhật priority của product.search.by-brand lên 600000 trên Dialogflow Console
- [ ] Save intent
- [ ] Restart frontend (`npm run dev`)
- [ ] Hard refresh browser (Ctrl + Shift + R)
- [ ] Test: "iPhone" → match product.search.by-brand
- [ ] Test: "iPhone hay Samsung" → match product.compare
- [ ] Kiểm tra hình ảnh to hơn (120-180px)
- [ ] Test responsive trên mobile

---

**Thời gian ước tính**: 5-10 phút  
**Độ khó**: ⭐⭐☆☆☆ (Dễ)

🎉 **Chúc bạn sửa lỗi thành công!**
