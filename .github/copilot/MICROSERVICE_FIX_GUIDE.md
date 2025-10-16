# Hướng Dẫn Sửa Kiến Trúc Microservice

## Vấn Đề Hiện Tại

Client đang gọi **TRỰC TIẾP** đến từng service thay vì qua API Gateway:

```
❌ SAI: Client → Service (localhost:3001, 3005, 3003...)
✅ ĐÚNG: Client → API Gateway (localhost:3000) → Service
```

## Cấu Trúc API Gateway

**API Gateway Port:** `3000` (hoặc theo `process.env.PORT`)

**Services đã được route:**
- `/api/users` → User Service (localhost:5001)
- `/api/products` → Product Service (localhost:5002)  
- `/api/categories` → Product Service (localhost:5002)
- `/api/brands` → Product Service (localhost:5002)
- `/api/colors` → Product Service (localhost:5002)
- `/api/orders` → Order Service (localhost:5003)
- `/api/locations` → Location Service (localhost:5004)
- `/api/promotions` → Promotion Service (localhost:5005)
- `/api/reviews` → Review Service (localhost:5006)
- `/api/search` → Search Service (localhost:5007)
- `/api/chatbot` → Chatbot Service (localhost:5008)

## Các File Cần Sửa

### 1. `client/src/plugins/axios/axios.ts` ⚠️ ƯU TIÊN CAO

**Hiện tại:**
```typescript
const userAxios = axios.create({
  baseURL: "http://localhost:3005/api", // ❌ Gọi trực tiếp User Service
});

const productAxios = axios.create({
  baseURL: "http://localhost:3001/api", // ❌ Gọi trực tiếp Product Service
});

const cartAxios = axios.create({
  baseURL: "http://localhost:3003/api", // ❌ Gọi trực tiếp Cart Service
});
```

**Cần sửa thành:**
```typescript
// Tất cả đều gọi qua API Gateway
const API_GATEWAY_URL = process.env.VITE_API_GATEWAY_URL || 'http://localhost:3000';

const userAxios = axios.create({
  baseURL: `${API_GATEWAY_URL}/api`, // ✅ Qua API Gateway
  timeout: 10000,
});

const productAxios = axios.create({
  baseURL: `${API_GATEWAY_URL}/api`, // ✅ Qua API Gateway  
  timeout: 10000,
});

const cartAxios = axios.create({
  baseURL: `${API_GATEWAY_URL}/api`, // ✅ Qua API Gateway
  timeout: 10000,
});
```

### 2. `client/src/pages/admin/products.vue` ⚠️

**Hiện tại (dòng 78):**
```typescript
const api = axios.create({ 
  baseURL: 'http://localhost:3001/api/product' // ❌ Gọi trực tiếp
})
```

**Cần sửa thành:**
```typescript
const api = axios.create({ 
  baseURL: 'http://localhost:3000/api/products' // ✅ Qua API Gateway
})
```

**LƯU Ý:** Endpoint path cũng cần thay đổi:
- `/get-all` → có thể cần sửa thành `/` hoặc theo API Gateway định nghĩa
- `/create` → `/`
- `/update/:id` → `/:id`
- `/delete/:id` → `/:id`

## Các File Khác Có Thể Cần Kiểm Tra

Tìm tất cả các file gọi API với pattern:
```bash
# PowerShell
Select-String -Path "client\src\**\*.vue","client\src\**\*.ts" -Pattern "localhost:\d+" -Context 0,2
```

Hoặc search trong VSCode:
- Pattern: `localhost:\d+`
- Include: `client/src/**/*.{vue,ts,js}`

## Lợi Ích Khi Sửa

✅ **Tính nhất quán:** Mọi request đều đi qua một điểm duy nhất  
✅ **Bảo mật:** API Gateway xử lý authentication, rate limiting  
✅ **Dễ bảo trì:** Chỉ cần thay đổi URL service tại API Gateway  
✅ **Logging & Monitoring:** Tập trung tại API Gateway  
✅ **CORS:** Chỉ cần config CORS tại một nơi

## Các Bước Thực Hiện

1. ✅ Sửa `client/src/plugins/axios/axios.ts` (ƯU TIÊN)
2. ✅ Sửa `client/src/pages/admin/products.vue`
3. 🔍 Tìm kiếm tất cả `localhost:` trong client code
4. ✅ Thay thế tất cả bằng API Gateway URL
5. ✅ Test từng module sau khi sửa
6. ✅ Cập nhật .env với `VITE_API_GATEWAY_URL=http://localhost:3000`

## Biến Môi Trường

Tạo file `client/.env`:
```bash
VITE_API_GATEWAY_URL=http://localhost:3000
```

Trong production:
```bash
VITE_API_GATEWAY_URL=https://api.smartbuy.com
```
