# Migration sang API Gateway - Kiến trúc Microservice chuẩn

## 🎯 Mục tiêu
Chuyển toàn bộ API calls từ client sang gọi qua **API Gateway** (port 3000) thay vì gọi trực tiếp đến từng service.

## 📋 Hiện trạng

### API Gateway đã sẵn sàng
- **Port**: 3000
- **File**: `server/api-gateway/src/routes/proxyRoutes.ts`
- **Chức năng**: Proxy tất cả request đến các microservices

### Vấn đề đã phát hiện

#### 1. **Route mismatch giữa Service và API Gateway**

| Service | Route trong Service | Route trong API Gateway | Trạng thái |
|---------|-------------------|------------------------|-----------|
| User Service | `/api/auth/*` | ❌ Thiếu | ✅ **ĐÃ SỬA** - Thêm route `/api/auth` |
| User Service | `/api/users/*` | ✅ Có | ✅ OK |
| Product Service | `/api/product/*` (số ít) | `/api/products/*` (số nhiều) | ⚠️ **CẦN KIỂM TRA** |
| Product Service | `/api/categories/*` | ✅ Có | ✅ OK |
| Product Service | `/api/brands/*` | ✅ Có | ✅ OK |
| Product Service | `/api/colors/*` | ✅ Có | ✅ OK |

#### 2. **Client axios.ts đã được tối ưu**
- ✅ **ĐÃ SỬA**: Chỉ còn 1 axios instance duy nhất qua API Gateway
- ✅ Backward compatibility: `userAxios`, `productAxios`, `cartAxios` đều trỏ về cùng instance
- ✅ BaseURL: `http://localhost:3000`

## 🔧 Đã sửa

### 1. API Gateway - Thêm route `/api/auth`
```typescript
// server/api-gateway/src/routes/proxyRoutes.ts
const services = {
  user: { url: 'http://localhost:5001', path: '/api/users' },
  auth: { url: 'http://localhost:5001', path: '/api/auth' }, // ✅ MỚI
  // ...
}
```

### 2. Client axios.ts - Đơn giản hóa
```typescript
// client/src/plugins/axios/axios.ts
const $axios: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // ✅ Tất cả qua API Gateway
  timeout: 10000,
});

// Backward compatibility
export const userAxios = $axios;
export const productAxios = $axios;
export const cartAxios = $axios;
```

## ⚠️ Cần kiểm tra

### 1. Product Service route mismatch
**Vấn đề**: 
- Product Service: `/api/product/...` (số ít)
- API Gateway: `/api/products/...` (số nhiều)

**Giải pháp**:
- **Option A**: Sửa Product Service từ `/api/product` → `/api/products`
- **Option B**: Sửa API Gateway từ `/api/products` → `/api/product`
- **Khuyến nghị**: Chọn Option A (số nhiều chuẩn RESTful hơn)

### 2. Kiểm tra tất cả các API calls trong client
Cần đảm bảo các file sau gọi đúng route:
- ✅ `client/src/api/auth/auth.ts` - Dùng `/api/auth/*` (OK)
- ⚠️ `client/src/api/product/*.ts` - Cần kiểm tra dùng `/api/product` hay `/api/products`
- ⚠️ `client/src/api/cart/*.ts` - Cần kiểm tra route
- ⚠️ `client/src/api/order/*.ts` - Cần kiểm tra route

### 3. Các service chưa có trong API Gateway
Cần kiểm tra xem còn service nào khác không:
- Cart Service? (Có thể là phần của User hoặc Order Service)
- Payment Service?
- Notification Service?

## 📝 Checklist Migration

### Backend - API Gateway
- [x] Thêm route `/api/auth` cho User Service
- [ ] Kiểm tra và chuẩn hóa route `/api/product` vs `/api/products`
- [ ] Kiểm tra tất cả services có route trong Gateway chưa
- [ ] Test API Gateway với từng route

### Backend - Services
- [ ] Kiểm tra User Service routes
- [ ] Kiểm tra Product Service routes (đổi `/api/product` → `/api/products`?)
- [ ] Kiểm tra Cart Service routes
- [ ] Kiểm tra Order Service routes

### Frontend - Client
- [x] Đơn giản hóa axios.ts (1 instance duy nhất)
- [ ] Kiểm tra tất cả file trong `client/src/api/`
- [ ] Kiểm tra các component gọi API trực tiếp
- [ ] Test login/register
- [ ] Test product listing
- [ ] Test cart
- [ ] Test checkout

## 🚀 Cách test

### 1. Khởi động API Gateway
```bash
cd server/api-gateway
npm install
npm run dev
```

### 2. Khởi động các Services
```bash
# Terminal 1 - User Service
cd server/userservice
npm start

# Terminal 2 - Product Service
cd server/productservice
npm start

# Terminal 3 - Order Service (nếu có)
cd server/orderservice
npm start
```

### 3. Khởi động Client
```bash
cd client
npm run dev
```

### 4. Test API Gateway
```bash
# Health check
curl http://localhost:3000/health

# Service info
curl http://localhost:3000/api/info

# Test auth route
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

# Test products route
curl http://localhost:3000/api/products
```

## 📌 Lưu ý quan trọng

1. **Tất cả API calls phải qua API Gateway (port 3000)**
2. **KHÔNG được gọi trực tiếp đến service (5001, 5002, 5003...)**
3. **Route phải khớp giữa Service và API Gateway**
4. **Sử dụng biến môi trường cho API Gateway URL**

## 🔍 Bước tiếp theo

1. **Xác định route chuẩn**: `/api/product` hay `/api/products`?
2. **Liệt kê tất cả services**: Cart, Payment, Notification... có hay không?
3. **Kiểm tra từng file API trong client**: Đảm bảo dùng đúng route
4. **Test toàn bộ luồng**: Login → Browse → Add to Cart → Checkout
