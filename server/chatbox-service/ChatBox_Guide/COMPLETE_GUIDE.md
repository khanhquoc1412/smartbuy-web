# 🚀 ROADMAP HOÀN CHỈNH: XÂY DỰNG AI CHATBOT CHO E-COMMERCE

## 📋 **TỔNG QUAN**

Hệ thống chatbot AI hoàn chỉnh cho SmartBuy E-commerce bao gồm:
- **Dialogflow**: NLP Engine để hiểu ngôn ngữ tự nhiên
- **Webhook Backend**: ChatBox Service xử lý logic nghiệp vụ
- **Frontend UI**: Widget chatbox trên website

---

## 🎯 **BƯỚC 1: SETUP DIALOGFLOW PROJECT** (30 phút)

### 1.1. Tạo Google Cloud Project

```bash
1. Truy cập: https://console.cloud.google.com/
2. Click "Create Project"
3. Project Name: "smartbuy-chatbot"
4. Click "Create"
```

### 1.2. Enable Dialogflow API

```bash
1. Trong project vừa tạo
2. Navigation Menu → APIs & Services → Library
3. Tìm "Dialogflow API"
4. Click "Enable"
```

### 1.3. Tạo Dialogflow Agent

```bash
1. Truy cập: https://dialogflow.cloud.google.com/
2. Click "Create Agent"
3. Agent Name: "SmartBuy-Assistant"
4. Default Language: Vietnamese (vi)
5. Default Time Zone: GMT+7
6. Google Project: chọn "smartbuy-chatbot"
7. Click "Create"
```

### 1.4. Tạo Service Account

```bash
1. Google Cloud Console → IAM & Admin → Service Accounts
2. Click "Create Service Account"
3. Name: "smartbuy-chatbot-sa"
4. Role: "Dialogflow API Admin"
5. Click "Create Key" → JSON
6. Download file JSON → Save as: chatbox-service/config/dialogflow-key.json
```

✅ **Checkpoint**: Agent đã được tạo, có Service Account key

---

## 🎯 **BƯỚC 2: TẠO INTENTS & ENTITIES** (60 phút)

> **🎁 NHANH HƠN:** Sử dụng file JSON có sẵn trong thư mục `dialogflow-export/` để import thay vì tạo thủ công!

### 2.1. Import Entities từ file JSON (KHUYẾN NGHỊ ⚡)

**Các file có sẵn trong `dialogflow-export/entities/`:**
- `product-category.json` - 6 danh mục sản phẩm
- `brand-name.json` - 12 thương hiệu
- `price-range.json` - 5 khoảng giá
- `order-id.json` - Regex pattern cho mã đơn

**Cách import:**
1. Vào Dialogflow Console → **Entities**
2. Click nút **"⋮"** (3 chấm) → **"Upload Entity"**
3. Chọn tất cả 4 file JSON trong `dialogflow-export/entities/`
4. Click "Open" → Entities được tạo tự động ✅

**Hoặc tạo thủ công (nếu muốn):**

Trong Dialogflow Console → Entities → Create Entity:

**@product-category**
```
Điện thoại | smartphone, phone, di động
Laptop | máy tính xách tay, macbook
Tablet | máy tính bảng, ipad
Tai nghe | headphone, earphone, airpods
Phụ kiện | accessory, case, ốp
Smartwatch | đồng hồ thông minh
```

**@brand-name**
```
Apple | iPhone, iPad, Mac
Samsung | Galaxy
Xiaomi | Mi, Redmi
Oppo
Vivo
Dell
HP
Asus
Sony
JBL
```

### 2.2. Import Intents từ file JSON (KHUYẾN NGHỊ ⚡)

**Các file có sẵn trong `dialogflow-export/intents/`:**
- `product.search.json` - Tìm kiếm sản phẩm chung
- `product.search.by-brand.json` - Tìm theo thương hiệu
- `product.search.by-price.json` - Tìm theo giá
- `order.track.json` - Tra cứu đơn hàng
- `policy.shipping.json` - Chính sách giao hàng

**Cách import:**
1. Vào Dialogflow Console → **Intents**
2. Click nút **"⋮"** (3 chấm) → **"Upload Intent"**
3. Chọn tất cả 5 file JSON trong `dialogflow-export/intents/`
4. Click "Open" → Intents được tạo tự động ✅

**⚠️ LƯU Ý:** Phải import Entities TRƯỚC rồi mới import Intents!

### 2.3. Tạo Intent thủ công (nếu không dùng import)

```yaml
Training Phrases (20+ câu):
- Tìm điện thoại
- Có điện thoại nào không
- Tôi muốn mua laptop
- Xem tai nghe
- Sản phẩm nào đang khuyến mãi
- Cho tôi xem điện thoại
- Tìm laptop giá rẻ
- Có tai nghe không dây không
- Xem phụ kiện
- Sản phẩm mới về

Parameters:
- @product-category (Required)
  Prompt: "Bạn muốn tìm sản phẩm gì? (điện thoại, laptop, tai nghe...)"

Fulfillment:
- Enable "Webhook call for this intent"
```

### 2.3. Tạo Intent: product.search.by-brand

```yaml
Training Phrases:
- Điện thoại Samsung có gì
- Laptop Dell giá bao nhiêu
- iPhone mới nhất
- Tai nghe Sony
- Macbook có không
- Xiaomi có gì hot
- Oppo ra gì mới
- Samsung flagship

Parameters:
- @brand-name (Required)
- @product-category (Optional)

Fulfillment:
- Enable webhook
```

### 2.4. Tạo Intent: product.search.by-price

```yaml
Training Phrases:
- Điện thoại dưới 10 triệu
- Laptop từ 15 đến 20 triệu
- Sản phẩm giá rẻ
- Có gì dưới 5 triệu
- Điện thoại tầm 15 triệu
- Laptop giá 20 triệu

Parameters:
- @sys.number-integer as min_price
- @sys.number-integer as max_price
- @product-category (Optional)

Fulfillment:
- Enable webhook
```

### 2.5. Tạo Intent: order.track

```yaml
Training Phrases:
- Kiểm tra đơn hàng ORD-20251118-ABC123
- Đơn hàng của tôi đâu rồi
- Tra đơn ORD-20251118-XYZ789
- Order status
- Xem đơn hàng

Parameters:
- @order-id (Entity: @sys.any, Pattern: ORD-\d{8}-[A-Z0-9]{6})

Fulfillment:
- Enable webhook
```

### 2.6. Tạo các Intent còn lại

Theo file `DIALOGFLOW_INTENTS.md` đã tạo:
- order.cancel
- promotion.check
- price.compare
- policy.shipping
- policy.return
- policy.warranty

### 2.7. Kiểm tra Import thành công

Vào **"Try it now"** (góc phải) và test:

```bash
# Test 1: Entity recognition
User: "Tìm điện thoại Samsung"
Expected: Intent = product.search.by-brand
          Parameters: product-category = "dien-thoai", brand-name = "samsung"

# Test 2: Price range
User: "Laptop dưới 20 triệu"
Expected: Intent = product.search.by-price
          Parameters: max-price = 20

# Test 3: Order tracking
User: "Kiểm tra đơn ORD-20251119-ABC123"
Expected: Intent = order.track
          Parameters: order-id = "ORD-20251119-ABC123"

# Test 4: Policy
User: "Chính sách giao hàng"
Expected: Intent = policy.shipping
          Response: Text về chính sách ship
```

✅ **Checkpoint**: Có ít nhất 5 intents hoạt động, entities nhận diện đúng

---

## 🎯 **BƯỚC 3: XÂY DỰNG CHATBOX SERVICE** (90 phút)

### 3.1. Cài đặt Dependencies

```bash
cd server/chatbox-service
npm install
```

### 3.2. Cấu hình Environment

```bash
cp config.env.example config.env
```

Chỉnh sửa `config.env`:
```env
PORT=3007
GOOGLE_PROJECT_ID=smartbuy-chatbot
GOOGLE_APPLICATION_CREDENTIALS=./config/dialogflow-key.json

PRODUCT_SERVICE_URL=http://localhost:3004
ORDER_SERVICE_URL=http://localhost:3005
USER_SERVICE_URL=http://localhost:3003

CORS_ORIGIN=http://localhost:5173
```

### 3.3. Copy Dialogflow Key

```bash
# Copy file JSON key đã download
cp ~/Downloads/smartbuy-chatbot-*.json config/dialogflow-key.json
```

### 3.4. Test Service

```bash
npm run dev
```

Mở browser: `http://localhost:3007/health`

Kết quả:
```json
{
  "success": true,
  "service": "chatbox-service",
  "status": "healthy"
}
```

✅ **Checkpoint**: ChatBox Service chạy thành công

---

## 🎯 **BƯỚC 4: KẾT NỐI WEBHOOK VỚI DIALOGFLOW** (30 phút)

### 4.1. Expose Local Server với Ngrok

```bash
# Install ngrok
npm install -g ngrok

# Start ngrok
ngrok http 3007
```

Kết quả:
```
Forwarding   https://pliant-burnoosed-sherwood.ngrok-free.dev -> http://localhost:3007 
```

### 4.2. Cấu hình Webhook trong Dialogflow

```bash
1. Dialogflow Console → Fulfillment
2. Enable "Webhook"
3. URL: https://abc123.ngrok.io/webhook/dialogflow
4. Headers (Optional):
   Key: x-webhook-secret
   Value: your-secret-key-from-config
5. Click "Save"
```

### 4.3. Test Webhook

Trong Dialogflow "Try it now":
```
User: "Tìm điện thoại Samsung"
```

Kiểm tra terminal ChatBox Service:
```
🤖 Dialogflow Webhook Request Received
📝 Intent: product.search.by-brand
💬 Query: Tìm điện thoại Samsung
```

✅ **Checkpoint**: Webhook nhận được request từ Dialogflow

---

## 🎯 **BƯỚC 5: TÍCH HỢP CHATBOX VÀO WEBSITE** (45 phút)

### Option A: Dialogflow Messenger (Recommend)

#### 5.1. Get Integration Code

```bash
1. Dialogflow Console → Integrations
2. Click "Dialogflow Messenger"
3. Click "Enable"
4. Copy code được generate
```

#### 5.2. Tạo Vue Component

File: `client/src/components/common/ChatboxWidget.vue`

```vue
<template>
  <div id="chatbox-widget"></div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  const script = document.createElement('script');
  script.src = 'https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1';
  script.async = true;
  document.head.appendChild(script);

  const dfMessenger = document.createElement('df-messenger');
  dfMessenger.setAttribute('intent', 'WELCOME');
  dfMessenger.setAttribute('chat-title', 'SmartBuy Assistant 🤖');
  dfMessenger.setAttribute('agent-id', 'YOUR-AGENT-ID'); // Lấy từ Dialogflow
  dfMessenger.setAttribute('language-code', 'vi');
  
  document.body.appendChild(dfMessenger);
});
</script>

<style>
df-messenger {
  --df-messenger-bot-message: #DC143C;
  --df-messenger-button-titlebar-color: #DC143C;
}
</style>
```

#### 5.3. Thêm vào Layout

File: `client/src/layouts/default.vue`

```vue
<template>
  <div>
    <slot />
    <ChatboxWidget />
  </div>
</template>

<script setup>
import ChatboxWidget from '@/components/common/ChatboxWidget.vue';
</script>
```

#### 5.4. Test

```bash
cd client
npm run dev
```

Mở `http://localhost:5173` → Chatbox xuất hiện góc dưới phải

✅ **Checkpoint**: Chatbox hoạt động trên website

---

## 🎯 **BƯỚC 6: DEPLOY & PRODUCTION** (60 phút)

### 6.1. Deploy ChatBox Service lên Railway

```bash
1. Truy cập: https://railway.app
2. Login với GitHub
3. Click "New Project"
4. Chọn "Deploy from GitHub repo"
5. Chọn repository smartbuy-web
6. Root Directory: server/chatbox-service
7. Add Variables:
   - PORT=3007
   - GOOGLE_PROJECT_ID=smartbuy-chatbot
   - PRODUCT_SERVICE_URL=https://your-product-service.railway.app
   - ORDER_SERVICE_URL=https://your-order-service.railway.app
   - CORS_ORIGIN=https://your-frontend.vercel.app

8. Upload dialogflow-key.json:
   - Railway Dashboard → Settings → Variables
   - Add "GOOGLE_APPLICATION_CREDENTIALS_JSON"
   - Paste toàn bộ content của dialogflow-key.json

9. Deploy
```

### 6.2. Update Webhook URL trong Dialogflow

```bash
1. Dialogflow Console → Fulfillment
2. URL: https://your-chatbox-service.railway.app/webhook/dialogflow
3. Save
```

### 6.3. Deploy Frontend lên Vercel

```bash
cd client
vercel --prod
```

### 6.4. Test Production

Truy cập website production → Test chatbox

✅ **Checkpoint**: Chatbox hoạt động trên production

---

## 📊 **TESTING CHECKLIST**

### Intent Testing

- [ ] product.search: "Tìm điện thoại"
- [ ] product.search.by-brand: "iPhone có gì"
- [ ] product.search.by-price: "Laptop dưới 20 triệu"
- [ ] product.detail: "Chi tiết iPhone 15"
- [ ] order.track: "Kiểm tra đơn ORD-20251118-ABC123"
- [ ] order.cancel: "Hủy đơn ORD-20251118-ABC123"
- [ ] promotion.check: "Có khuyến mãi gì không"
- [ ] price.compare: "So sánh iPhone 15 và Samsung S24"
- [ ] policy.shipping: "Chính sách giao hàng"
- [ ] policy.return: "Đổi trả như thế nào"

### UI Testing

- [ ] Chatbox hiển thị đúng vị trí
- [ ] Responsive trên mobile
- [ ] Typing indicator hoạt động
- [ ] Rich responses (cards) hiển thị
- [ ] Suggestion chips clickable
- [ ] Animation mượt mà

### Integration Testing

- [ ] Webhook nhận request từ Dialogflow
- [ ] Backend services trả về đúng data
- [ ] Error handling hoạt động
- [ ] Session management
- [ ] Rate limiting

---

## 🎉 **HOÀN THÀNH**

Bạn đã có hệ thống chatbot AI hoàn chỉnh với:

✅ Dialogflow NLP Engine  
✅ Webhook Backend xử lý nghiệp vụ  
✅ Tích hợp với Product/Order/User Services  
✅ UI Chatbox đẹp mắt  
✅ Deploy lên Production  

---

## 📚 **TÀI LIỆU THAM KHẢO**

- [Dialogflow Documentation](https://cloud.google.com/dialogflow/docs)
- [Webhook Format](https://cloud.google.com/dialogflow/es/docs/fulfillment-webhook)
- [Rich Responses](https://cloud.google.com/dialogflow/es/docs/intents-rich-messages)
- [Best Practices](https://cloud.google.com/dialogflow/es/docs/best-practices)

---

## 🔧 **MAINTENANCE**

### Thêm Intent mới
1. Tạo Intent trong Dialogflow
2. Thêm handler trong `intentHandlers.js`
3. Update switch case trong `webhookController.js`
4. Deploy

### Update Training Phrases
1. Vào Dialogflow Console
2. Chọn Intent
3. Thêm Training Phrases
4. Save (tự động retrain)

### Monitor Logs
```bash
# Railway
railway logs

# Vercel
vercel logs

# Local
npm run dev
```

---

**🎯 NEXT LEVEL**

- Analytics & Metrics
- A/B Testing cho responses
- Multi-language support
- Voice integration
- WhatsApp/Facebook Messenger integration

**Chúc mừng bạn đã hoàn thành! 🚀**
