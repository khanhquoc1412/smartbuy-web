# ⚡ QUICK START - 15 PHÚT

Hướng dẫn nhanh để có chatbot AI hoạt động trong 15 phút!

---

## 🚀 **BƯỚC 1: SETUP DIALOGFLOW (5 phút)**

### 1. Tạo Agent

```
1. https://dialogflow.cloud.google.com/ → Login
2. Create Agent: "SmartBuy-Assistant"
3. Language: Vietnamese (vi)
```

### 2. Tạo Intent đầu tiên: product.search

```
Training Phrases:
- Tìm điện thoại
- Có điện thoại nào không
- Xem laptop

Actions: product.search
Enable Webhook: ✅ YES
```

### 3. Get Service Account Key

```
1. Google Cloud Console → IAM & Admin → Service Accounts
2. Create Service Account
3. Create Key (JSON)
4. Download → Save as: chatbox-service/config/dialogflow-key.json
```

---

## 🚀 **BƯỚC 2: CHẠY BACKEND (3 phút)**

```bash
cd server/chatbox-service

# Install
npm install

# Config
cp config.env.example config.env

# Edit config.env:
# - GOOGLE_PROJECT_ID=smartbuy-chatbot (your project ID)
# - GOOGLE_APPLICATION_CREDENTIALS=./config/dialogflow-key.json

# Copy key
cp ~/Downloads/your-key.json config/dialogflow-key.json

# Start
npm run dev
```

**✅ Service chạy tại: http://localhost:3007**

---

## 🚀 **BƯỚC 3: KẾT NỐI WEBHOOK (2 phút)**

### Install & Run Ngrok

```bash
npm install -g ngrok
ngrok http 3007
```

Kết quả: `https://abc123.ngrok.io`

### Cấu hình trong Dialogflow

```
1. Dialogflow Console → Fulfillment
2. Enable Webhook
3. URL: https://abc123.ngrok.io/webhook/dialogflow
4. Save
```

---

## 🚀 **BƯỚC 4: TEST (2 phút)**

### Test trong Dialogflow

```
Try it now: "Tìm điện thoại Samsung"
```

Kiểm tra terminal:
```
🤖 Dialogflow Webhook Request Received
📝 Intent: product.search
```

---

## 🚀 **BƯỚC 5: THÊM VÀO WEBSITE (3 phút)**

### Option 1: Dialogflow Messenger (Fastest)

1. Dialogflow → Integrations → Dialogflow Messenger → Enable
2. Copy code
3. Paste vào `client/index.html` trước tag `</body>`

```html
<script src="https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1"></script>
<df-messenger
  intent="WELCOME"
  chat-title="SmartBuy"
  agent-id="YOUR-AGENT-ID"
  language-code="vi"
></df-messenger>

<style>
df-messenger {
  --df-messenger-bot-message: #DC143C;
  --df-messenger-button-titlebar-color: #DC143C;
}
</style>
```

4. Chạy frontend:

```bash
cd client
npm run dev
```

5. Mở http://localhost:5173

**✅ Chatbox xuất hiện góc dưới phải!**

---

## 🎉 **DONE!**

Bạn đã có chatbot AI hoạt động trong 15 phút!

### Kiểm tra

- [ ] Backend chạy: http://localhost:3007/health
- [ ] Webhook kết nối: Dialogflow Fulfillment status = Connected
- [ ] Chatbox hiển thị trên website
- [ ] Test câu hỏi: "Tìm điện thoại"

---

## 📌 **NEXT STEPS**

Sau khi có chatbot cơ bản, làm theo `COMPLETE_GUIDE.md` để:

1. Thêm nhiều Intent hơn (order tracking, promotions...)
2. Tạo Rich Responses (cards, images)
3. Tích hợp với backend services
4. Deploy lên production
5. Custom UI chatbox

---

## 🆘 **TROUBLESHOOTING**

### Webhook không nhận request?
- Check ngrok đang chạy
- Verify URL trong Dialogflow Fulfillment
- Check logs: `npm run dev`

### Chatbox không hiển thị?
- Check console browser (F12)
- Verify agent-id đúng
- Clear cache

### Backend error?
- Check `config.env`
- Verify dialogflow-key.json exists
- Check product/order services đang chạy

---

**Need help? Check `README.md` và `COMPLETE_GUIDE.md`**
