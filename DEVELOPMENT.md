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
- ✅ **PRODUCT-MGR** (port 5002) - Product Manager Service
- ✅ **ORDER-MGR** (port 5003) - Order Manager Service  
- ✅ **USER-MGR** (port 3006) - User Manager Service
- ✅ **REVIEW** (port 5006) - Review Service

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
```

## 📦 Install Dependencies Cho Tất Cả Services

```bash
npm run install:all
```

## 🎨 Màu Sắc Terminal

Mỗi service sẽ có màu riêng trong terminal để dễ phân biệt:
- 🔵 **CLIENT** - Blue
- 🟣 **GATEWAY** - Magenta
- 🟢 **PRODUCT-MGR** - Green
- 🟡 **ORDER-MGR** - Yellow
- 🔷 **USER-MGR** - Cyan
- 🔴 **REVIEW** - Red

## 🛑 Dừng Tất Cả Services

Nhấn `Ctrl + C` một lần để dừng tất cả services.

## 🔧 Ports Sử dụng

| Service | Port | Description |
|---------|------|-------------|
| Client | 5173 | Vue.js Frontend |
| API Gateway | 3000 | API Gateway (TypeScript) |
| Product Manager | 5002 | Quản lý sản phẩm, variants, stock |
| Order Manager | 5003 | Quản lý đơn hàng, thống kê |
| User Manager | 3006 | Quản lý users, addresses |
| Review Service | 5006 | Quản lý đánh giá sản phẩm |

## 📝 Lưu Ý

- Đảm bảo MongoDB đang chạy trước khi start services
- API Gateway sử dụng TypeScript và sẽ tự động compile khi chạy
- Tất cả services đều có nodemon/hot reload
- Nếu port bị chiếm, cần kill process trước khi chạy lại
