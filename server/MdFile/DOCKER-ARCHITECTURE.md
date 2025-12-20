# 🏗️ Kiến Trúc Docker SmartBuy

## 📋 Tổng Quan

SmartBuy sử dụng kiến trúc microservices với **11 services** chạy trên Docker:
- **1 Database**: MongoDB
- **8 Backend Services**: Gồm monolithic services (cũ) và microservices (mới)
- **1 API Gateway**: Điều phối traffic
- **1 Frontend**: Vue.js SPA với Nginx

## 🎯 Sơ Đồ Kiến Trúc

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT (Browser)                              │
│                         http://localhost                                │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                   NGINX (Frontend - Port 80)                            │
│  • Serve Vue.js static files                                            │
│  • Proxy /api/* → API Gateway:3000                                      │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                  API GATEWAY (Port 3000)                                │
│  • Authentication & Rate Limiting                                       │
│  • Proxy routes to microservices                                        │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                 ┌───────────────┼───────────────┐
                 │               │               │
        ┌────────▼──────┐   ┌───▼────────┐  ┌──▼─────────────┐
        │  MONOLITHIC   │   │ MICROSERV. │  │   DATABASE     │
        │   SERVICES    │   │  SERVICES  │  │   MongoDB      │
        │   (Port cũ)   │   │ (Port mới) │  │   Port 27017   │
        └───────────────┘   └────────────┘  └────────────────┘
```

## 🔌 Port Mapping Chi Tiết

### Database Layer
| Service | Port | Container Name | Database |
|---------|------|----------------|----------|
| MongoDB | 27017 | smartbuy-mongodb | All databases |

### API Gateway Layer
| Service | Port | Container Name | Mô Tả |
|---------|------|----------------|-------|
| API Gateway | 3000 | smartbuy-api-gateway | Entry point cho tất cả API requests |

### Backend Services - Monolithic (Legacy)
| Service | Port | Container Name | Chức Năng |
|---------|------|----------------|-----------|
| user-service | 3005 | smartbuy-user-service | Auth, login, register, wishlist |
| product-service | 3001 | smartbuy-product-service | Product listing, details |
| cart-service | 3002 | smartbuy-cart-service | Shopping cart CRUD |
| order-service | 3002* | smartbuy-order-service | User order history |
| payment-service | 3004 | smartbuy-payment-service | VNPAY, MoMo, ZaloPay |

> **Lưu ý:** order-service chạy internal port 3002, exposed ra host port 3003 (tránh conflict với cart-service)

### Backend Services - Microservices (New)
| Service | Port | Container Name | Chức Năng |
|---------|------|----------------|-----------|
| user-manager | 3006 | smartbuy-user-manager | Admin CRUD users, addresses |
| product-manager | 5002 | smartbuy-product-manager | Admin CRUD products, categories, brands |
| order-manager | 5003 | smartbuy-order-manager | Admin order management, email notifications |
| review-service | 5006 | smartbuy-review-service | Product reviews & ratings |

### Frontend Layer
| Service | Port | Container Name | Mô Tả |
|---------|------|----------------|-------|
| Client (Nginx) | 80 | smartbuy-client | Vue.js SPA, static assets |

## 🔗 Service Dependencies

```
mongodb (database)
  ↑
  ├─→ user-service (3005)
  ├─→ product-service (3001)
  ├─→ cart-service (3002) ──┐
  ├─→ order-service (3002*) ←┘
  ├─→ payment-service (3004) ──┐
  │                             ↑
  ├─→ user-manager (3006)       │
  ├─→ product-manager (5002)    │
  ├─→ order-manager (5003) ─────┘
  └─→ review-service (5006)
       ↑
       │
  api-gateway (3000) ← client (80)
```

### Dependency Flow

1. **MongoDB** → Khởi động đầu tiên (với healthcheck)
2. **Backend Services** → Chờ MongoDB healthy
3. **API Gateway** → Chờ MongoDB healthy (không cần đợi backend services)
4. **Client** → Chờ API Gateway ready

**Cross-service dependencies:**
- `cart-service` → `product-service` + `user-service`
- `order-service` → `cart-service` + `product-service` + `user-service` + `payment-service`
- `payment-service` → `order-service`
- `order-manager` → `user-manager` + `product-manager`

## 🌐 API Routing

API Gateway proxy các requests đến services dựa vào path:

| Path | Target Service | Port |
|------|---------------|------|
| `/api/auth` | user-service | 3005 |
| `/api/user/addresses` | user-service | 3005 |
| `/api/user/wishlist` | user-service | 3005 |
| `/api/users` | user-manager | 3006 |
| `/api/addresses` | user-manager | 3006 |
| `/api/product` | product-service | 3001 |
| `/api/products` | product-manager | 5002 |
| `/api/categories` | product-manager | 5002 |
| `/api/brands` | product-manager | 5002 |
| `/api/colors` | product-manager | 5002 |
| `/api/memories` | product-manager | 5002 |
| `/api/specifications` | product-manager | 5002 |
| `/api/cart` | cart-service | 3002 |
| `/api/order` | order-service | 3002 |
| `/api/orders` | order-manager | 5003 |
| `/api/payments` | payment-service | 3004 |
| `/api/reviews` | review-service | 5006 |

## 🗄️ Database Structure

Mỗi service có database riêng (Database-per-Service pattern):

| Service | Database Name | Collections |
|---------|--------------|-------------|
| user-service | smartbuy_users | users, sessions, wishlists |
| user-manager | smartbuy_users | users, addresses |
| product-service | smartbuy_products | products |
| product-manager | smartbuy_products | products, categories, brands, colors, memories, specifications |
| cart-service | smartbuy_carts | carts, cartitems |
| order-service | smartbuy_orders | orders, orderitems |
| order-manager | smartbuy_orders | orders, statusHistory |
| payment-service | smartbuy_payments | payments, transactions |
| review-service | smartbuy_reviews | reviews, ratings |

## 📦 Docker Volumes

Persistent data được lưu trong volumes:

```yaml
volumes:
  mongodb_data:           # MongoDB data files
  mongodb_config:         # MongoDB config files
  user_avatars:           # User profile images (mounted to user-service & user-manager)
  product_uploads:        # Product images (mounted to product-manager)
```

**Mount points:**
- `user_avatars` → `/app/avarta` (trong user-service, user-manager)
- `product_uploads` → `/app/uploads` (trong product-manager)

## 🔐 Environment Variables

### Required Variables (.env file)

```env
# Database
MONGO_ROOT_PASSWORD=smartbuy123

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key

# Email (cho order-manager)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=SmartBuy <noreply@smartbuy.com>

# Payment Gateways
VNPAY_TMN_CODE=your-vnpay-code
VNPAY_HASH_SECRET=your-vnpay-secret
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html

MOMO_PARTNER_CODE=your-momo-code
MOMO_ACCESS_KEY=your-momo-access-key
MOMO_SECRET_KEY=your-momo-secret-key
```

### Internal Service URLs (tự động set bởi Docker)

API Gateway tự động kết nối đến services qua Docker network:

```env
USER_SERVICE_URL=http://user-service:3005
PRODUCT_SERVICE_URL=http://product-service:3001
CART_SERVICE_URL=http://cart-service:3002
ORDER_SERVICE_URL=http://order-service:3002
PAYMENT_SERVICE_URL=http://payment-service:3004
USER_MANAGER_SERVICE_URL=http://user-manager:3006
PRODUCT_MANAGER_SERVICE_URL=http://product-manager:5002
ORDER_MANAGER_SERVICE_URL=http://order-manager:5003
REVIEW_SERVICE_URL=http://review-service:5006
```

## 🚀 Quick Commands

### Start tất cả services
```bash
docker-compose up -d
```

### Check trạng thái
```bash
docker-compose ps
```

### View logs
```bash
# Tất cả services
docker-compose logs -f

# Một service cụ thể
docker-compose logs -f api-gateway
```

### Restart một service
```bash
docker-compose restart order-manager
```

### Stop tất cả
```bash
docker-compose down
```

### Clean everything (⚠️ XÓA DATA!)
```bash
docker-compose down -v
```

## 🧪 Health Checks

Tất cả services có `/health` endpoint:

```bash
# Check API Gateway
curl http://localhost:3000/health

# Check từng service (nếu expose port)
curl http://localhost:3005/health  # user-service
curl http://localhost:3001/health  # product-service
curl http://localhost:3002/health  # cart-service
curl http://localhost:3004/health  # payment-service
curl http://localhost:3006/health  # user-manager
curl http://localhost:5002/health  # product-manager
curl http://localhost:5003/health  # order-manager
curl http://localhost:5006/health  # review-service
```

## 📊 Resource Usage

Dự tính tài nguyên khi chạy full stack:

| Component | CPU | RAM | Disk |
|-----------|-----|-----|------|
| MongoDB | 0.5 core | 512MB | 1GB (data) |
| API Gateway | 0.1 core | 128MB | - |
| Backend Services (8x) | 0.1 core/each | 128MB/each | - |
| Client (Nginx) | 0.05 core | 64MB | - |
| **TOTAL** | ~1.5 cores | ~1.5GB | ~1GB disk |

**Khuyến nghị server:**
- **Development:** 2 CPU cores, 2GB RAM
- **Production:** 4 CPU cores, 4GB RAM (có thể scale từng service)

## 🔄 Scaling Strategy

Scale horizontal bằng cách tăng replicas:

```bash
# Chạy 3 instances của order-manager
docker-compose up -d --scale order-manager=3

# Chạy 5 instances của product-manager
docker-compose up -d --scale product-manager=5
```

**Lưu ý:** Cần cấu hình load balancer trong api-gateway để phân tải.

## 📝 Notes

1. **Port Conflicts:** order-service internal port 3002 trùng với cart-service → Exposed ra host port 3003
2. **Shared Volumes:** user-service và user-manager cùng dùng `user_avatars` volume
3. **Database:** Tất cả services kết nối MongoDB qua `mongodb:27017` (internal Docker network)
4. **CORS:** Frontend trên port 80, API Gateway cho phép CORS từ `http://localhost`
5. **JWT:** user-service dùng `ACCESS_TOKEN_PRIVATE_KEY`, services khác dùng `JWT_SECRET` (cần sync!)

## 🆘 Troubleshooting

### Service không start
```bash
docker-compose logs service-name
```

### Database connection failed
```bash
# Check MongoDB đã ready chưa
docker-compose exec mongodb mongosh -u admin -p smartbuy123 --authenticationDatabase admin

# Test từ bên trong container
docker-compose exec api-gateway ping mongodb
```

### Port đã được sử dụng
```bash
# Windows: Tìm process đang dùng port
netstat -ano | findstr :3000

# Kill process
taskkill /PID <process-id> /F
```

---

**✅ Document này tóm tắt toàn bộ kiến trúc Docker của SmartBuy.**

Tham khảo `DOCKER.md` để biết cách setup chi tiết và `DOCKER-TEST.md` để biết test cases.
