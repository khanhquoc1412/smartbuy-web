# SmartBuy Development Guide

## 🚀 Chạy Tất Cả Services Cùng Lúc

### Cách 1: Sử dụng npm script (Khuyến nghị)

```bash
# Bước 1: Install concurrently (chỉ cần làm 1 lần)
npm install

# Bước 2: Chạy tất cả services
npm run dev
```

Script này sẽ chạy đồng thời:
- ✅ **CLIENT** (port 5173) - Vue.js frontend
- ✅ **GATEWAY** (port 3000) - API Gateway (TypeScript)
- ✅ **PROD-MGR** (port 5002) - Product Manager Service
- ✅ **ORD-MGR** (port 5003) - Order Manager Service  
- ✅ **USER-MGR** (port 3006) - User Manager Service
- ✅ **REVIEW** (port 5006) - Review Service
- ✅ **CART** (port 3003) - Cart Service
- ✅ **CHATBOX** (port 5008) - Chatbox Service
- ✅ **ORDER** (port 3002) - Order Service
- ✅ **PAYMENT** (port 3004) - Payment Service
- ✅ **PRODUCT** (port 3001) - Product Service (legacy)
- ✅ **USER** (port 3005) - User Service (legacy)

### Cách 2: Chạy từng service riêng lẻ

```bash
# Client
npm run dev:client

# API Gateway (TypeScript)
npm run dev:gateway

# Product Manager Service
npm run dev:product-manager

# Order Manager Service
npm run dev:order-manager

# User Manager Service
npm run dev:user-manager

# Review Service
npm run dev:review

# Cart Service
npm run dev:cart

# Chatbox Service
npm run dev:chatbox

# Order Service (legacy)
npm run dev:order

# Payment Service
npm run dev:payment

# Product Service (legacy)
npm run dev:productservice

# User Service (legacy)
npm run dev:userservice
```

## 📦 Install Dependencies Cho Tất Cả Services

```bash
npm run install:all
```

## 🎨 Màu Sắc Terminal

Mỗi service sẽ có màu riêng trong terminal để dễ phân biệt:
- 🔵 **CLIENT** - Blue background
- 🟣 **GATEWAY** - Magenta background
- 🟢 **PROD-MGR** - Green background
- 🟡 **ORD-MGR** - Yellow background
- 🔷 **USER-MGR** - Cyan background
- 🔴 **REVIEW** - Red background
- 🔵 **CART** - Cyan text
- 🟣 **CHATBOX** - Magenta text
- 🟢 **ORDER** - Green text
- 🟡 **PAYMENT** - Yellow text
- 🔵 **PRODUCT** - Blue text
- ⚪ **USER** - White text

## 🛑 Dừng Tất Cả Services

Nhấn `Ctrl + C` một lần để dừng tất cả services.

## 🔧 Ports Sử dụng

| Service | Port | Description |
|---------|------|-------------|
| Client | 5173 | Vue.js Frontend |
| API Gateway | 3000 | API Gateway (TypeScript) |
| Product Manager | 5002 | Quản lý sản phẩm, variants, stock (microservice) |
| Order Manager | 5003 | Quản lý đơn hàng, thống kê (microservice) |
| User Manager | 3006 | Quản lý users, addresses (microservice) |
| Review Service | 5006 | Quản lý đánh giá sản phẩm (microservice) |
| Cart Service | 3003 | Quản lý giỏ hàng |
| Chatbox Service | 5008 | Chatbot service |
| Order Service | 3002 | Order service (legacy) |
| Payment Service | 3004 | Payment service |
| Product Service | 3001 | Product service (legacy) |
| User Service | 3005 | User service (legacy) |

## 📝 Lưu Ý

- Đảm bảo MongoDB đang chạy trước khi start services
- API Gateway sử dụng TypeScript và sẽ tự động compile khi chạy
- Tất cả services đều có nodemon/hot reload
- Nếu port bị chiếm, cần kill process trước khi chạy lại
