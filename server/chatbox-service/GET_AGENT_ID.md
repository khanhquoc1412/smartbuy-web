# 🔑 LẤY DIALOGFLOW AGENT ID

## Bước 1: Truy cập Dialogflow Console

1. Mở trình duyệt: https://dialogflow.cloud.google.com/
2. Đăng nhập bằng tài khoản Google đã tạo project
3. Chọn Agent **"SmartBuy-Assistant"**

## Bước 2: Lấy Agent ID

1. Click biểu tượng **⚙️ Settings** (góc trên bên trái, cạnh tên Agent)
2. Tab **General** sẽ hiển thị thông tin:
   ```
   Agent Name: SmartBuy-Assistant
   Agent ID: abc123-xyz789-...  ← COPY DÒNG NÀY
   ```
3. Copy Agent ID (dạng: `abc123-xyz789-abc123`)

## Bước 3: Update vào ChatboxWidget.vue

Mở file: `client/src/components/common/ChatboxWidget.vue`

Tìm dòng:
```javascript
dfMessenger.setAttribute('agent-id', 'YOUR-AGENT-ID'); // ← THAY ĐỔI TẠI ĐÂY
```

Thay thế bằng:
```javascript
dfMessenger.setAttribute('agent-id', 'abc123-xyz789-abc123'); // ← Agent ID thực tế
```

## Bước 4: Chạy Frontend

```bash
cd client
npm run dev
```

Mở trình duyệt: http://localhost:5173

✅ **Kết quả:** Chatbox icon xuất hiện góc dưới bên phải màn hình!

## Bước 5: Test Chatbox

Click vào icon chatbox → Gõ thử:

```
"Tìm điện thoại Samsung"
"Điện thoại dưới 10 triệu"
"Chính sách giao hàng như nào?"
```

---

## 🎨 TÙY CHỈNH GIAO DIỆN (Optional)

### Thay đổi màu chủ đạo

Trong file `ChatboxWidget.vue`, tìm phần:
```javascript
dfMessenger.style.cssText = `
  --df-messenger-bot-message: #DC143C;  // Màu tin nhắn bot (hiện tại: crimson)
  --df-messenger-button-titlebar-color: #DC143C;  // Màu thanh tiêu đề
  --df-messenger-send-icon: #DC143C;  // Màu nút gửi
`;
```

Thay `#DC143C` bằng màu khác (ví dụ: `#4CAF50` cho màu xanh lá)

### Thay đổi icon chatbox

```javascript
dfMessenger.setAttribute('chat-icon', 'https://link-to-your-icon.png');
```

### Thay đổi vị trí

Trong `<style>` section:
```css
df-messenger {
  position: fixed;
  bottom: 20px;  /* Khoảng cách từ đáy */
  right: 20px;   /* Khoảng cách từ bên phải */
  /* Đổi thành left: 20px; để hiển thị bên trái */
}
```

---

## ❗ TROUBLESHOOTING

### 1. Chatbox không xuất hiện

**Kiểm tra:**
- Agent ID đã đúng chưa?
- Console browser có lỗi? (F12 → Console tab)
- ChatBox Service + Ngrok đang chạy?

**Giải pháp:**
```bash
# Terminal 1: ChatBox Service
cd server/chatbox-service
npm run dev

# Terminal 2: Ngrok
ngrok http 3007

# Terminal 3: Frontend
cd client
npm run dev
```

### 2. Chatbox hiển thị nhưng không phản hồi

**Kiểm tra:**
- Dialogflow Fulfillment webhook URL đã đúng?
- Ngrok URL đã update vào Dialogflow?
- Intents đã enable webhook?

**Giải pháp:**
1. Copy Ngrok URL: `https://xxx.ngrok-free.dev`
2. Vào Dialogflow → Fulfillment
3. Paste URL: `https://xxx.ngrok-free.dev/webhook/dialogflow`
4. Save

### 3. CORS Error

**Lỗi trong Console:**
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Giải pháp:**
Kiểm tra file `server/chatbox-service/config.env`:
```env
CORS_ORIGIN=http://localhost:5173  # Phải khớp với URL frontend
```

---

## ✅ HOÀN THÀNH BƯỚC 5

Bạn đã tích hợp chatbox thành công! 🎉

**Checklist:**
- ✅ Tạo ChatboxWidget.vue
- ✅ Thêm vào default.vue layout
- ✅ Lấy Agent ID từ Dialogflow
- ✅ Update Agent ID vào code
- ✅ Chạy frontend và test chatbox

**Tiếp theo: BƯỚC 6 - DEPLOY LÊN PRODUCTION** 🚀
