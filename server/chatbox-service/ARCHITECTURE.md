# 🏗️ KIẾN TRÚC HỆ THỐNG CHATBOT

## 📊 **LUỒNG HOẠT ĐỘNG TỔNG QUAN**

```
┌─────────────┐
│   User UI   │ → "Tìm điện thoại Samsung"
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Chatbox Widget │ (Dialogflow Messenger hoặc Custom UI)
│  - Capture input│
│  - Display msgs │
└──────┬──────────┘
       │
       ▼
┌──────────────────────────────────┐
│       DIALOGFLOW ENGINE          │
│  ┌────────────────────────────┐  │
│  │  1. NLP Processing         │  │ → Phân tích ngôn ngữ tự nhiên
│  │  2. Intent Detection       │  │ → Nhận diện intent: product.search.by-brand
│  │  3. Entity Extraction      │  │ → Extract: brand="Samsung", category="điện thoại"
│  │  4. Context Management     │  │ → Quản lý ngữ cảnh hội thoại
│  └────────────────────────────┘  │
└──────┬───────────────────────────┘
       │
       │ Webhook Request (JSON)
       ▼
┌────────────────────────────────────────┐
│     CHATBOX SERVICE (Backend)          │
│  ┌──────────────────────────────────┐  │
│  │  webhookController.js            │  │
│  │  - Receive request               │  │
│  │  - Route to intent handler       │  │
│  └────────────┬─────────────────────┘  │
│               │                         │
│               ▼                         │
│  ┌──────────────────────────────────┐  │
│  │  intentHandlers.js               │  │
│  │  - handleProductSearchByBrand()  │  │
│  │  - Call productService           │  │
│  └────────────┬─────────────────────┘  │
│               │                         │
│               ▼                         │
│  ┌──────────────────────────────────┐  │
│  │  productService.js               │  │
│  │  - searchProductsByBrand()       │  │
│  │  - HTTP request to backend       │  │
│  └────────────┬─────────────────────┘  │
└───────────────┼─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  BACKEND SERVICES                       │
│  ┌─────────────────┐                    │
│  │ Product Service │ → Get products     │
│  │ (Port 3004)     │    matching query  │
│  └─────────────────┘                    │
│  ┌─────────────────┐                    │
│  │ Order Service   │ → Get order info   │
│  │ (Port 3005)     │                    │
│  └─────────────────┘                    │
│  ┌─────────────────┐                    │
│  │ User Service    │ → Get user data    │
│  │ (Port 3003)     │                    │
│  └─────────────────┘                    │
└─────────┬───────────────────────────────┘
          │
          │ Response (Products data)
          ▼
┌────────────────────────────────────────┐
│     CHATBOX SERVICE                    │
│  ┌──────────────────────────────────┐  │
│  │  formatters.js                   │  │
│  │  - Format price, date, status    │  │
│  └────────────┬─────────────────────┘  │
│               │                         │
│               ▼                         │
│  ┌──────────────────────────────────┐  │
│  │  Build Fulfillment Response      │  │
│  │  - fulfillmentText               │  │
│  │  - richContent (cards)           │  │
│  │  - suggestionChips               │  │
│  └────────────┬─────────────────────┘  │
└───────────────┼─────────────────────────┘
                │
                │ Webhook Response (JSON)
                ▼
┌──────────────────────────────────┐
│       DIALOGFLOW ENGINE          │
│  - Parse response                │
│  - Format for display            │
└──────┬───────────────────────────┘
       │
       ▼
┌─────────────────┐
│  Chatbox Widget │
│  - Display text │
│  - Show cards   │
│  - Show chips   │
└──────┬──────────┘
       │
       ▼
┌─────────────┐
│   User UI   │ → Thấy kết quả: "Tìm thấy 5 sản phẩm Samsung..."
└─────────────┘
```

---

## 🔄 **CHI TIẾT WEBHOOK REQUEST/RESPONSE**

### **Request từ Dialogflow → ChatBox Service**

```json
{
  "responseId": "abc-123-xyz",
  "queryResult": {
    "queryText": "Tìm điện thoại Samsung",
    "languageCode": "vi",
    "intent": {
      "name": "projects/.../intents/...",
      "displayName": "product.search.by-brand"
    },
    "parameters": {
      "brand-name": "Samsung",
      "product-category": "điện thoại"
    },
    "intentDetectionConfidence": 0.95
  },
  "session": "projects/smartbuy-chatbot/agent/sessions/user-123"
}
```

### **Response từ ChatBox Service → Dialogflow**

```json
{
  "fulfillmentText": "Tìm thấy 5 sản phẩm Samsung điện thoại",
  "fulfillmentMessages": [
    {
      "text": {
        "text": ["Đây là các sản phẩm Samsung hiện có:"]
      }
    },
    {
      "payload": {
        "richContent": [
          [
            {
              "type": "info",
              "title": "Samsung Galaxy S24 Ultra",
              "subtitle": "29.990.000đ",
              "image": {
                "src": {
                  "rawUrl": "https://cdn.example.com/s24.jpg"
                }
              },
              "actionLink": "https://smartbuy.com/product/s24"
            }
          ]
        ]
      }
    },
    {
      "payload": {
        "richContent": [
          [
            {
              "type": "chips",
              "options": [
                { "text": "Xem chi tiết" },
                { "text": "So sánh giá" },
                { "text": "Thêm vào giỏ" }
              ]
            }
          ]
        ]
      }
    }
  ]
}
```

---

## 📁 **CẤU TRÚC THƯ MỤC**

```
chatbox-service/
│
├── config.env.example          # Environment template
├── config.env                  # Environment variables (gitignored)
├── package.json                # Dependencies
├── README.md                   # Documentation
├── QUICK_START.md              # 15-min quick guide
├── COMPLETE_GUIDE.md           # Full roadmap
├── DIALOGFLOW_INTENTS.md       # Intent definitions
├── CHATBOX_UI_INTEGRATION.md  # UI integration guide
│
├── config/
│   └── dialogflow-key.json     # Google Service Account (gitignored)
│
└── src/
    ├── index.js                # Main entry point
    │
    ├── routes/
    │   ├── healthRoutes.js     # Health check endpoints
    │   └── webhookRoutes.js    # Webhook endpoints
    │
    ├── controllers/
    │   ├── webhookController.js    # Main webhook handler
    │   └── intentHandlers.js       # Intent-specific handlers
    │
    ├── services/
    │   ├── productService.js       # Product backend integration
    │   └── orderService.js         # Order backend integration
    │
    ├── middleware/
    │   └── validation.js           # Request validation
    │
    └── utils/
        └── formatters.js           # Data formatting utilities
```

---

## 🎯 **INTENT ROUTING FLOW**

```
User Query: "Tìm điện thoại Samsung"
    ↓
Dialogflow Intent Detection: product.search.by-brand
    ↓
Parameters Extracted: { brand: "Samsung", category: "điện thoại" }
    ↓
Webhook POST: /webhook/dialogflow
    ↓
webhookController.handleDialogflowWebhook()
    ↓
switch(intentName) → case 'product.search.by-brand'
    ↓
intentHandlers.handleProductSearchByBrand(parameters)
    ↓
productService.searchProductsByBrand({ brand: "Samsung", category: "điện thoại" })
    ↓
axios.get('http://localhost:3004/api/products/search?brand=Samsung&category=điện thoại')
    ↓
Product Service Response: [{ _id, name, price, image... }]
    ↓
Format Response with formatters.js
    ↓
Build Fulfillment Response (text + richContent + chips)
    ↓
Return to Dialogflow
    ↓
Display to User
```

---

## 🔐 **SECURITY FLOW**

```
Request → CORS Check → Rate Limiter → Webhook Secret Validation → Process
   ↓          ↓             ↓                    ↓                     ↓
 Pass      Pass         Pass                 Pass                 Success
 Fail      Reject       Reject               Reject               Error
```

---

## 📊 **DATA FLOW DIAGRAM**

```
                    ┌─────────────┐
                    │    User     │
                    └──────┬──────┘
                           │ Query
                           ▼
                    ┌─────────────┐
                    │ Dialogflow  │
                    │     NLP     │
                    └──────┬──────┘
                           │ Intent + Params
                           ▼
        ┌──────────────────────────────────────┐
        │       ChatBox Service                │
        │  ┌─────────────┐  ┌────────────────┐ │
        │  │  Controller │→│ Intent Handler │ │
        │  └─────────────┘  └───────┬────────┘ │
        │                           │          │
        │  ┌─────────────┐  ┌───────▼────────┐ │
        │  │ Formatters  │←│    Services    │ │
        │  └─────────────┘  └───────┬────────┘ │
        └────────────────────────────┼─────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    ▼                ▼                ▼
            ┌────────────┐  ┌────────────┐  ┌────────────┐
            │  Product   │  │   Order    │  │    User    │
            │  Service   │  │  Service   │  │  Service   │
            └────────────┘  └────────────┘  └────────────┘
```

---

## 🚦 **STATE DIAGRAM**

```
[Idle] → User sends message → [Processing]
                                    ↓
                            Dialogflow analyzes
                                    ↓
                            Webhook called
                                    ↓
                            Backend processes
                                    ↓
                            ┌──────┴──────┐
                            ↓             ↓
                        [Success]    [Error]
                            ↓             ↓
                    Response sent   Error message
                            ↓             ↓
                        [Waiting] ← [Waiting]
                            ↓
                    User continues or exits
                            ↓
                        [Idle]
```

---

## 🎨 **COMPONENT INTERACTION**

```
Frontend (Vue)          Backend (Node.js)        External
─────────────          ─────────────────        ──────────

ChatboxWidget  ←──────→  Dialogflow Messenger
     │                          │
     │                          ↓
     │                   Dialogflow API
     │                          │
     │                          ↓
     │                   Webhook Endpoint
     │                   (/webhook/dialogflow)
     │                          │
     │                          ↓
     │                   Controllers Layer
     │                          │
     │                          ↓
     │                   Services Layer
     │                          │
     │                          ├──────→ Product Service
     │                          │
     │                          ├──────→ Order Service
     │                          │
     │                          └──────→ User Service
     │                          
     └──────────── Response rendered in UI
```

---

## 📈 **SCALING STRATEGY**

```
Level 1: Single Instance
- 1 ChatBox Service
- Ngrok for development
- Suitable for: Dev/Testing

Level 2: Load Balanced
- Multiple ChatBox Service instances
- Nginx/ALB load balancer
- Suitable for: Small production

Level 3: Microservices
- Separate services per feature
- Message Queue (RabbitMQ/Kafka)
- Suitable for: Large scale

Level 4: Serverless
- AWS Lambda / Google Cloud Functions
- Auto-scaling
- Suitable for: Enterprise
```

---

## 🔧 **DEPLOYMENT OPTIONS**

```
Development:
- Local: npm run dev
- Ngrok: ngrok http 3007
- Test: Dialogflow Console

Staging:
- Railway.app
- Heroku
- DigitalOcean App Platform

Production:
- AWS EC2 + Nginx
- Google Cloud Run
- Kubernetes Cluster
```

---

**Visualization giúp hiểu rõ hơn kiến trúc và luồng hoạt động của hệ thống!**
