# 🤖 SmartBuy ChatBox Service

AI-powered chatbot service using Dialogflow và Webhook để hỗ trợ khách hàng trên nền tảng e-commerce SmartBuy.

## 📋 Tính năng

- ✅ Tìm kiếm sản phẩm thông minh (theo danh mục, thương hiệu, giá)
- ✅ Tra cứu đơn hàng realtime
- ✅ Hủy đơn hàng qua chatbot
- ✅ Kiểm tra khuyến mãi hiện tại
- ✅ So sánh giá sản phẩm
- ✅ Tích hợp Dialogflow NLP
- ✅ Rich responses (Card, Image, Chips)
- ✅ Rate limiting & Security

## 🏗️ Kiến trúc

```
User → Chatbox UI → Dialogflow → Webhook (ChatBox Service) → Backend Services
                                                           ├── Product Service
                                                           ├── Order Service
                                                           └── User Service
```

## 📦 Cài đặt

### Bước 1: Clone & Install Dependencies

```bash
cd server/chatbox-service
npm install
```

### Bước 2: Cấu hình Environment

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
```

### Bước 3: Setup Dialogflow Credentials

1. Vào [Google Cloud Console](https://console.cloud.google.com/)
2. Chọn project `smartbuy-chatbot`
3. IAM & Admin → Service Accounts
4. Tạo Service Account mới hoặc dùng existing
5. Tạo JSON key
6. Download và lưu vào `chatbox-service/config/dialogflow-key.json`

### Bước 4: Chạy Service

```bash
# Development
npm run dev

# Production
npm start
```

Service sẽ chạy tại: `http://localhost:3007`

## 🔌 API Endpoints

### Health Check
```
GET /health
```

### Webhook
```
POST /webhook/dialogflow
```

### Test Webhook
```
POST /webhook/test
Body: { "message": "test" }
```

## 🎯 Dialogflow Setup

### Bước 1: Tạo Agent

1. Truy cập [Dialogflow Console](https://dialogflow.cloud.google.com/)
2. Create new Agent: `SmartBuy-Assistant`
3. Language: Vietnamese (vi)

### Bước 2: Tạo Intents

Tạo các intent theo file `DIALOGFLOW_INTENTS.md`:

- `product.search`
- `product.search.by-brand`
- `product.search.by-price`
- `product.detail`
- `order.track`
- `order.cancel`
- `promotion.check`
- `price.compare`

### Bước 3: Cấu hình Webhook

1. Vào Fulfillment trong Dialogflow
2. Enable Webhook
3. URL: `https://your-domain.com/webhook/dialogflow`
4. Headers (optional):
   ```
   x-webhook-secret: your-secret-key
   ```

### Bước 4: Test

1. Vào "Try it now" ở góc phải Dialogflow Console
2. Nhập: "Tìm điện thoại Samsung"
3. Kiểm tra response

## 🚀 Deployment

### Option 1: Deploy lên Heroku

```bash
# Install Heroku CLI
heroku login

# Create app
heroku create smartbuy-chatbox

# Set environment variables
heroku config:set PORT=3007
heroku config:set GOOGLE_PROJECT_ID=smartbuy-chatbot
# ... other env vars

# Deploy
git push heroku main
```

### Option 2: Deploy lên Railway

1. Truy cập [Railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Chọn repository
4. Add environment variables
5. Deploy

### Option 3: Deploy lên VPS (Ubuntu)

```bash
# SSH to VPS
ssh user@your-vps-ip

# Clone repository
git clone https://github.com/your-repo/smartbuy-web.git
cd smartbuy-web/server/chatbox-service

# Install dependencies
npm install --production

# Setup PM2
npm install -g pm2
pm2 start src/index.js --name chatbox-service

# Setup Nginx reverse proxy
sudo nano /etc/nginx/sites-available/chatbox
```

Nginx config:
```nginx
server {
    listen 80;
    server_name chatbox.yourdomain.com;

    location / {
        proxy_pass http://localhost:3007;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/chatbox /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 🌐 Sử dụng Ngrok cho Development

Dialogflow cần HTTPS webhook URL. Dùng ngrok để expose localhost:

```bash
# Install ngrok
npm install -g ngrok

# Start ngrok
ngrok http 3007
```

Copy HTTPS URL (vd: `https://abc123.ngrok.io`) và update trong Dialogflow Fulfillment.

## 📝 Example Requests

### Test Webhook Locally

```bash
curl -X POST http://localhost:3007/webhook/dialogflow \
  -H "Content-Type: application/json" \
  -d '{
    "queryResult": {
      "intent": {
        "displayName": "product.search"
      },
      "parameters": {
        "product-category": "điện thoại"
      },
      "queryText": "Tìm điện thoại"
    },
    "session": "projects/smartbuy-chatbot/agent/sessions/12345"
  }'
```

## 🔒 Security

- ✅ CORS configured
- ✅ Rate limiting
- ✅ Webhook secret validation
- ✅ Input sanitization
- ✅ Error handling

## 📊 Monitoring

### Health Check

```bash
curl http://localhost:3007/health
```

### Logs

```bash
# Development
npm run dev  # Auto logging with morgan

# Production with PM2
pm2 logs chatbox-service
```

## 🐛 Troubleshooting

### Issue: Webhook không nhận được request từ Dialogflow

**Solution:**
1. Kiểm tra Fulfillment URL trong Dialogflow
2. Verify HTTPS (ngrok hoặc SSL certificate)
3. Check firewall/security groups
4. Test với POST request trực tiếp

### Issue: Service không kết nối được backend services

**Solution:**
1. Kiểm tra `config.env` có đúng URLs
2. Verify backend services đang chạy
3. Test với curl:
   ```bash
   curl http://localhost:3004/api/products/search
   ```

### Issue: Dialogflow không nhận diện intent

**Solution:**
1. Thêm nhiều Training Phrases hơn
2. Kiểm tra Entity configuration
3. Tăng ML Classification Threshold

## 📚 Tài liệu tham khảo

- [Dialogflow Documentation](https://cloud.google.com/dialogflow/docs)
- [Dialogflow Fulfillment](https://cloud.google.com/dialogflow/es/docs/fulfillment-overview)
- [Webhook Format](https://cloud.google.com/dialogflow/es/docs/fulfillment-webhook)

## 👥 Contributors

- SmartBuy Development Team

## 📄 License

MIT License
