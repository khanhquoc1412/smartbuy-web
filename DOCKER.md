# 🐳 Hướng Dẫn Triển Khai SmartBuy với Docker

## 🎯 Docker là gì và tại sao cần dùng?

**Docker** là nền tảng containerization giúp đóng gói ứng dụng cùng toàn bộ dependencies vào một "container" độc lập.

**🔍 Giải thích đơn giản:**
- **Container** giống như một "máy tính ảo mini" - có đầy đủ hệ điều hành, Node.js, code, dependencies
- Mỗi service (user-service, product-service, cart-service...) chạy trong container riêng
- Các container giao tiếp với nhau qua **Docker Network** (như LAN nội bộ)
- Docker đảm bảo môi trường giống hệt nhau trên mọi máy tính

**📦 So sánh cách chạy:**

| Trước đây (Không Docker) | Với Docker |
|---------------------------|------------|
| Mở 12 terminals riêng biệt | 1 lệnh duy nhất |
| `cd server/api-gateway && npm start` | `docker-compose up` |
| `cd server/user-service && npm start` | ✅ Tự động |
| `cd server/cart-service && npm start` | ✅ Tự động |
| ... (12 lần) | ✅ Tự động |
| Phải nhớ port nào cho service nào | ✅ Cấu hình sẵn |
| Xung đột dependencies | ✅ Mỗi service độc lập |

**Lợi ích khi dùng Docker cho SmartBuy:**

### 1. **Triển khai đơn giản - Từ 12 services xuống 1 lệnh**
- ❌ **Trước đây:** 
  - Phải start thủ công 12 services: MongoDB + api-gateway + user-service + user-manager + product-service + product-manager + cart-service + order-service + order-manager + payment-service + review-service + client
  - Mỗi service cần terminal riêng
  - Quên start 1 service → toàn bộ hệ thống lỗi
- ✅ **Với Docker:** 
  - Chỉ cần `docker-compose up -d` 
  - Tất cả 12 containers tự động chạy song song
  - Tự động restart nếu crash

### 2. **Môi trường nhất quán**
- ❌ **Vấn đề thường gặp:** "Code chạy được trên máy tôi nhưng không chạy trên máy bạn"
- ✅ **Docker giải quyết:** Môi trường dev = staging = production, không bao giờ lỗi vì khác phiên bản Node.js

### 3. **Quản lý dependencies dễ dàng**
- ❌ **Trước đây:** Mỗi service phải `npm install`, conflict version, mất thời gian
- ✅ **Với Docker:** Mỗi service chạy trong container riêng, không bao giờ conflict

### 4. **Scaling linh hoạt**
- Cần xử lý nhiều đơn hàng? `docker-compose up --scale order-manager=5` (chạy 5 instances)
- Black Friday có 10,000 users? Scale lên chỉ trong vài giây!

### 5. **Deploy lên cloud siêu nhanh**
- AWS, Azure, Google Cloud đều hỗ trợ Docker
- Từ local lên production chỉ cần `docker push` → `cloud deploy`

## 📋 Yêu Cầu Hệ Thống

- Docker Desktop (Windows/Mac) hoặc Docker Engine (Linux)
- Docker Compose V2
- RAM: Tối thiểu 4GB dành cho Docker
- Ổ cứng trống: 10GB

## 🚀 Bắt Đầu Nhanh

### Bước 1: Chuẩn bị môi trường

```bash
cd "D:\LV chuyên nghành 2025\smartbuy-web"

# Copy file cấu hình mẫu
copy .env.example .env

# Chỉnh sửa với thông tin thực tế
notepad .env
```

**Cấu hình tối thiểu trong .env:**
```env
# Mật khẩu MongoDB (đổi trong production!)
MONGO_ROOT_PASSWORD=smartbuy123

# Secret key cho JWT (dùng mật khẩu mạnh!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Email để gửi thông báo đơn hàng
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### Bước 2: Build và Khởi động tất cả Services

**Chế độ Production (tối ưu hiệu suất):**
```bash
docker-compose up -d
```

**Chế độ Development (tự động reload khi code thay đổi):**
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

**Hoặc dùng script tiện lợi (Windows):**
```bash
.\docker-start.bat
```

### Bước 3: Kiểm tra trạng thái

```bash
docker-compose ps
```

**Kết quả mong đợi - Tất cả phải "Up (healthy)":**
```
NAME                       STATUS                    PORTS
smartbuy-mongodb           Up (healthy)             0.0.0.0:27017->27017/tcp
smartbuy-api-gateway       Up (healthy)             0.0.0.0:3000->3000/tcp
smartbuy-user-service      Up (healthy)             0.0.0.0:3005->3005/tcp
smartbuy-user-manager      Up (healthy)             0.0.0.0:3006->3006/tcp
smartbuy-product-service   Up (healthy)             0.0.0.0:3001->3001/tcp
smartbuy-product-manager   Up (healthy)             0.0.0.0:5002->5002/tcp
smartbuy-cart-service      Up (healthy)             0.0.0.0:3002->3002/tcp
smartbuy-order-service     Up (healthy)             0.0.0.0:3003->3002/tcp
smartbuy-order-manager     Up (healthy)             0.0.0.0:5003->5003/tcp
smartbuy-payment-service   Up (healthy)             0.0.0.0:3004->3004/tcp
smartbuy-review-service    Up (healthy)             0.0.0.0:5006->5006/tcp
smartbuy-client            Up (healthy)             0.0.0.0:80->80/tcp
```

> **Giải thích:** `(healthy)` nghĩa là service đã pass health check - MongoDB đã kết nối thành công, API endpoints hoạt động bình thường.

### Bước 4: Truy cập ứng dụng

**🌐 QUAN TRỌNG - Đây là cách bạn truy cập website:**

- **🏠 Trang web chính (Giao diện người dùng)**: http://localhost:8080
  - Mở trình duyệt và gõ: `http://localhost:8080`
  - Đây là nơi khách hàng vào mua sắm, xem sản phẩm, đặt hàng
  - ⚠️ **Lưu ý:** Port 8080 thay vì 80 để tránh conflict với Apache2/IIS
  
- **🔌 API Gateway (Backend API)**: http://localhost:3000
  - Đây là entry point cho tất cả API requests
  - Frontend (port 80) gọi API qua địa chỉ này
  
- **🗄️ MongoDB (Database)**: mongodb://admin:smartbuy123@localhost:27017
  - Kết nối từ MongoDB Compass hoặc code

**📱 Các trang bạn có thể truy cập:**
- Trang chủ: http://localhost:8080/
- Đăng ký: http://localhost:8080/register
- Đăng nhập: http://localhost:8080/login
- Sản phẩm: http://localhost:8080/products
- Giỏ hàng: http://localhost:8080/cart
- Admin: http://localhost:8080/admin (nếu đã đăng nhập admin)

**🔍 Test API trực tiếp:**
```powershell
# Test API Gateway
Invoke-WebRequest -Uri http://localhost:3000/health

# Test các services
Invoke-WebRequest -Uri http://localhost:3005/health  # user-service
Invoke-WebRequest -Uri http://localhost:3001/health  # product-service
Invoke-WebRequest -Uri http://localhost:3002/health  # cart-service
Invoke-WebRequest -Uri http://localhost:3004/health  # payment-service
```

## 🏗️ Kiến Trúc Hệ Thống - Cách Docker Hoạt Động

### 📊 Sơ đồ luồng dữ liệu (Request Flow)

```
👤 Người dùng gõ: http://localhost
         ↓
    [Trình duyệt]
         ↓
┌────────────────────────────────────────────────────────────┐
│  🖥️ DOCKER HOST (Máy tính của bạn)                         │
│                                                             │
│  Port 80 → 📦 Container: smartbuy-client (Nginx)           │
│            ├─ Serve file HTML, CSS, JS của Vue.js          │
│            └─ Proxy /api/* → http://api-gateway:3000       │
│                     ↓                                       │
│  Port 3000 → 📦 Container: smartbuy-api-gateway            │
│              ├─ Authentication (JWT)                        │
│              ├─ Rate limiting                               │
│              └─ Route requests đến các microservices:      │
│                  ↓                                          │
│         ┌────────┼────────┬──────────┬───────────┐         │
│         ↓        ↓        ↓          ↓           ↓         │
│    📦 User   📦 Product  📦 Cart  📦 Order  📦 Payment     │
│    Service   Service   Service  Service   Service          │
│    :3005     :3001     :3002    :3003     :3004            │
│         │        │        │          │           │         │
│         └────────┴────────┴──────────┴───────────┘         │
│                         ↓                                   │
│              📦 Container: MongoDB                          │
│              Port 27017                                     │
│              ├─ smartbuy_users (database)                   │
│              ├─ smartbuy_products (database)                │
│              ├─ smartbuy_carts (database)                   │
│              ├─ smartbuy_orders (database)                  │
│              └─ smartbuy_payments (database)                │
│                                                             │
│  🌐 Docker Network: smartbuy-network                        │
│     Tất cả containers giao tiếp qua network này            │
└─────────────────────────────────────────────────────────────┘
```

### 🔄 Ví dụ: User đặt hàng (Luồng xử lý thực tế)

**Bước 1:** User click "Đặt hàng" trên web http://localhost
```
Browser → Nginx (port 80) 
→ POST /api/orders
```

**Bước 2:** Nginx chuyển tiếp đến API Gateway
```
Nginx → API Gateway (port 3000)
→ Kiểm tra JWT token
→ Xác thực user
```

**Bước 3:** API Gateway phân tán requests
```
API Gateway → Cart Service (port 3002) 
              "Lấy giỏ hàng của user"
              ↓
            Product Service (port 3001)
              "Kiểm tra tồn kho sản phẩm"
              ↓
            Order Service (port 3003)
              "Tạo đơn hàng mới"
              ↓
            Payment Service (port 3004)
              "Khởi tạo thanh toán"
              ↓
            Order Manager (port 5003)
              "Gửi email xác nhận"
```

**Bước 4:** Mỗi service lưu data vào MongoDB
```
All Services → MongoDB (port 27017)
            └─ Lưu vào database tương ứng
```

### 🔐 Docker Network - Giao tiếp nội bộ

**Quan trọng:** Các containers giao tiếp với nhau qua **tên container**, không qua `localhost`!

❌ **SAI:**
```javascript
// Trong api-gateway code
fetch('http://localhost:3005/api/users') // ❌ Không hoạt động!
```

✅ **ĐÚNG:**
```javascript
// Trong api-gateway code
fetch('http://user-service:3005/api/users') // ✅ Đúng!
// Docker tự động resolve "user-service" → IP của container
```

**Docker Network Magic:**
```
Container Name        Docker DNS Resolution
─────────────────    ─────────────────────
user-service      →  172.18.0.5:3005
product-service   →  172.18.0.6:3001
cart-service      →  172.18.0.7:3002
mongodb           →  172.18.0.2:27017
```

### 📦 Containers vs Ports

**Port Mapping giải thích:**

| Container | Internal Port | External Port | Ý nghĩa |
|-----------|--------------|---------------|---------|
| user-service | 3005 | 3005 | Bạn truy cập: `localhost:3005` → Container: `user-service:3005` |
| cart-service | 3002 | 3002 | Bạn truy cập: `localhost:3002` → Container: `cart-service:3002` |
| order-service | 3002 | 3003 | Bạn truy cập: `localhost:3003` → Container: `order-service:3002` ⚠️ |
| client | 80 | 80 | Bạn truy cập: `localhost:80` → Container: `client:80` |

> **Chú ý:** order-service internal port là 3002 (trùng cart-service), nhưng expose ra ngoài là 3003 để tránh conflict!

### 🗄️ Docker Volumes - Lưu trữ dữ liệu

**Vấn đề:** Container bị xóa → Data mất hết!  
**Giải pháp:** Docker Volumes - Lưu data ra ngoài container

```
Volume Name          Mount Point             Dữ liệu lưu gì?
─────────────────   ─────────────────────   ─────────────────────
mongodb_data     →  /data/db                Database files MongoDB
mongodb_config   →  /data/configdb          MongoDB config
user_avatars     →  /app/avarta             Avatar người dùng
product_uploads  →  /app/uploads            Hình ảnh sản phẩm
```

**Vị trí thực tế trên máy bạn (Windows):**
```
C:\Users\<YourName>\AppData\Local\Docker\wsl\data\
```

**Lợi ích:**
- ✅ Xóa container → Data vẫn còn
- ✅ Rebuild image → Data không mất
- ✅ Backup dễ dàng: Copy volumes ra ngoài

### ⚡ Health Checks - Tự động phát hiện lỗi

Mỗi service có **health check** - Docker tự động ping `/health` endpoint mỗi 30s:

```yaml
# Ví dụ: user-service healthcheck
healthcheck:
  test: ["CMD", "node", "-e", "require('http').get('http://localhost:3005/health')"]
  interval: 30s      # Kiểm tra mỗi 30 giây
  timeout: 10s       # Timeout sau 10 giây
  retries: 3         # Thử 3 lần trước khi báo unhealthy
```

**Cơ chế:**
1. Docker gọi `http://user-service:3005/health`
2. Service trả về `{"status": "healthy"}`
3. Docker đánh dấu container = **healthy** ✅
4. Nếu fail 3 lần → **unhealthy** ❌ → Tự động restart

**Xem trạng thái:**
```powershell
docker-compose ps
# STATUS column sẽ hiện: Up (healthy) hoặc Up (unhealthy)
```

### 🚀 Dependency Management - Thứ tự khởi động

Docker đảm bảo services start đúng thứ tự:

```
1. MongoDB (database)           ← Khởi động đầu tiên
   └─ Wait until healthy
        ↓
2. All Backend Services         ← Khởi động song song
   ├─ user-service
   ├─ product-service
   ├─ cart-service
   ├─ order-service
   ├─ payment-service
   ├─ user-manager
   ├─ product-manager
   ├─ order-manager
   └─ review-service
   └─ Wait for MongoDB healthy
        ↓
3. API Gateway                  ← Đợi MongoDB ready
   └─ Wait for MongoDB healthy
        ↓
4. Client (Nginx)              ← Start cuối cùng
```

**Cấu hình trong docker-compose.yml:**
```yaml
user-service:
  depends_on:
    mongodb:
      condition: service_healthy  # Đợi MongoDB healthy mới start
```

### 🔍 Environment Variables - Cấu hình linh hoạt

**3 cấp độ biến môi trường:**

**1. File .env (Shared - Dùng chung):**
```env
MONGO_ROOT_PASSWORD=smartbuy123
JWT_SECRET=your-secret-key
```

**2. docker-compose.yml (Per-service):**
```yaml
user-service:
  environment:
    - NODE_ENV=production
    - DB_PROD_URL=mongodb://admin:${MONGO_ROOT_PASSWORD}@mongodb:27017/smartbuy_users
    - JWT_SECRET=${JWT_SECRET}
```

**3. Container runtime (Automatic):**
```javascript
// Trong user-service code
process.env.DB_PROD_URL  // → "mongodb://admin:smartbuy123@mongodb:27017/..."
process.env.NODE_ENV     // → "production"
```

**Lợi ích:**
- ✅ Không hardcode password trong code
- ✅ Dễ dàng thay đổi config không cần rebuild
- ✅ Dev/staging/production dùng config khác nhau

## 🎛️ Các Lệnh Thường Dùng

### Xem Logs (Theo dõi hoạt động)

```bash
# Xem logs của tất cả services
docker-compose logs -f

# Xem logs của service cụ thể
docker-compose logs -f order-manager

# Xem 100 dòng cuối cùng
docker-compose logs --tail=100 api-gateway
```

### Khởi động lại Services

```bash
# Khởi động lại tất cả
docker-compose restart

# Khởi động lại service cụ thể
docker-compose restart order-manager
```

### Dừng Services

```bash
# Dừng tất cả (giữ data)
docker-compose down

# Dừng và XÓA HẾT data (⚠️ cẩn thận!)
docker-compose down -v
```

### Rebuild sau khi thay đổi code

```bash
# Rebuild service cụ thể
docker-compose build order-manager

# Rebuild và khởi động lại
docker-compose up -d --build order-manager

# Rebuild tất cả (xóa cache)
docker-compose build --no-cache
```

### Chạy lệnh trong Container

```bash
# Mở terminal trong container
docker-compose exec order-manager sh

# Chạy lệnh Node.js
docker-compose exec order-manager node -v

# Kết nối MongoDB shell
docker-compose exec mongodb mongosh -u admin -p smartbuy123
```

## 🔧 Xử Lý Sự Cố - Các Lỗi Thực Tế

### ❌ Lỗi 1: Port đã được sử dụng

**Triệu chứng:** 
```
Error: Bind for 0.0.0.0:3005 failed: port is already allocated
```

**Nguyên nhân:** Có service khác (hoặc bản dev chạy ngoài Docker) đang dùng port

**Giải pháp:**

```powershell
# Tìm process đang dùng port
netstat -ano | findstr :3005

# Output: TCP  0.0.0.0:3005  0.0.0.0:0  LISTENING  12345
# → Process ID = 12345

# Kill process
taskkill /PID 12345 /F

# Hoặc đổi port trong docker-compose.yml
# ports:
#   - "13005:3005"  # External port 13005, internal vẫn 3005
```

### ❌ Lỗi 2: Cannot find module 'validator'

**Triệu chứng:**
```
Error: Cannot find module 'validator'
Container status: Restarting (1) 20 seconds ago
```

**Nguyên nhân:** Thiếu dependency trong package.json

**Giải pháp:**

```powershell
# Xem logs để tìm module bị thiếu
docker-compose logs --tail=50 user-service

# Thêm dependency vào package.json
cd server/userservice
# Thêm: "validator": "^13.15.23" vào dependencies

# Regenerate package-lock.json
Remove-Item package-lock.json
npm install

# Rebuild container
docker-compose up -d --build user-service
```

### ❌ Lỗi 3: MongoDB connection failed - querySrv ENOTFOUND

**Triệu chứng:**
```
❌ Unable to connect to MongoDB: querySrv ENOTFOUND _mongodb._tcp.cluster.mongodb.net
```

**Nguyên nhân:** Sử dụng connection string MongoDB Atlas (cloud) thay vì local Docker MongoDB

**Giải pháp:**

```powershell
# Kiểm tra docker-compose.yml
# ❌ SAI: MONGODB_URI=mongodb+srv://cluster.mongodb.net/...
# ✅ ĐÚNG: DB_PROD_URL=mongodb://admin:smartbuy123@mongodb:27017/smartbuy_users?authSource=admin

# Sửa docker-compose.yml
# environment:
#   - DB_PROD_URL=mongodb://admin:${MONGO_ROOT_PASSWORD}@mongodb:27017/database_name?authSource=admin

# Restart service
docker-compose restart user-service
```

### ❌ Lỗi 4: Cannot find module '../models/Payment' (Case-sensitivity)

**Triệu chứng:**
```
Error: Cannot find module '../models/Payment'
Required module: '/app/models/Payment.js'
```

**Nguyên nhân:** Windows không phân biệt chữ hoa/thường, Docker Linux có phân biệt

**Giải pháp:**

```powershell
# Kiểm tra tên file thực tế
dir server\paymentservice\models\

# Nếu file là payment.js (chữ thường):
# Sửa trong code: require('../models/Payment') → require('../models/payment')

# Rebuild
docker-compose up -d --build payment-service
```

### ❌ Lỗi 5: Service unhealthy (Health check timeout)

**Triệu chứng:**
```
STATUS: Up (unhealthy)
Health check timeout after 10s
```

**Nguyên nhân:** Service chưa có `/health` endpoint hoặc start chậm

**Giải pháp:**

```javascript
// Thêm health endpoint vào service
// File: server/product-service/index.js
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'product-service' });
});
```

```yaml
# Thêm healthcheck vào docker-compose.yml
product-service:
  healthcheck:
    test: ["CMD", "node", "-e", "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"]
    interval: 30s
    timeout: 10s
    retries: 3
```

```powershell
# Rebuild
docker-compose up -d --build product-service
```

### ❌ Lỗi 6: npm ci failed - package-lock.json out of sync

**Triệu chứng:**
```
npm ERR! Missing: validator@13.15.23 from lock file
npm ERR! npm ci can only install packages with an existing package-lock.json
```

**Nguyên nhân:** Đã thêm dependency vào package.json nhưng chưa regenerate package-lock.json

**Giải pháp:**

```powershell
cd server/userservice
Remove-Item package-lock.json
npm install  # Tạo lại package-lock.json
docker-compose up -d --build user-service
```

### ❌ Lỗi 7: Hết dung lượng ổ cứng

**Triệu chứng:**
```
Error: no space left on device
```

**Nguyên nhân:** Docker images và containers tích tụ quá nhiều

**Giải pháp:**

```powershell
# Xem dung lượng Docker đang dùng
docker system df

# Xóa images không dùng
docker image prune -a -f

# Xóa containers dừng
docker container prune -f

# Xóa volumes không dùng (⚠️ CẨN THẬN - Có thể mất data!)
docker volume prune -f

# Xóa tất cả (⚠️ NGUY HIỂM - Mất hết data!)
docker system prune -a --volumes -f
```

### ❌ Lỗi 8: Container exits immediately

**Triệu chứng:**
```
STATUS: Exited (1) 2 seconds ago
```

**Giải pháp - Debug từng bước:**

```powershell
# Bước 1: Xem logs chi tiết
docker-compose logs --tail=100 service-name

# Bước 2: Chạy container interactive mode
docker-compose run --rm service-name sh
# Trong container:
ls -la        # Kiểm tra files
cat .env      # Kiểm tra env variables
node index.js # Chạy thử

# Bước 3: Kiểm tra environment variables
docker-compose exec service-name env | grep MONGODB

# Bước 4: Test kết nối MongoDB từ trong container
docker-compose exec service-name sh -c "ping mongodb"
```

### 🆘 Khi tất cả đều fail - Reset hoàn toàn

```powershell
# Dừng và xóa tất cả
docker-compose down -v

# Xóa tất cả images của project
docker images | findstr smartbuy | ForEach-Object { docker rmi $_.Split()[2] -f }

# Xóa cache Docker
docker builder prune -a -f

# Build lại từ đầu
docker-compose build --no-cache

# Start lại
docker-compose up -d

# Đợi 30 giây và kiểm tra
Start-Sleep -Seconds 30
docker-compose ps
```

### 📊 Debug Tips

**1. Xem logs realtime:**
```powershell
docker-compose logs -f --tail=20 user-service
```

**2. Kiểm tra resources:**
```powershell
docker stats
# Xem CPU, RAM usage của từng container
```

**3. Inspect container:**
```powershell
docker inspect smartbuy-user-service
# Xem full config, network, volumes
```

**4. Test network connectivity:**
```powershell
# Từ api-gateway ping user-service
docker-compose exec api-gateway ping user-service

# Test HTTP
docker-compose exec api-gateway wget -O- http://user-service:3005/health
```

**5. Xem environment variables:**
```powershell
docker-compose exec user-service env
```

### Lỗi: Service khởi động rồi tắt liên tục

**Triệu chứng:** Status hiện "Restarting" hoặc "Exited"

**Giải pháp:**

```bash
# Xem logs để tìm nguyên nhân
docker-compose logs service-name

# Nguyên nhân thường gặp:
# 1. Thiếu biến môi trường trong .env
# 2. Connection string MongoDB sai
# 3. Thiếu dependencies trong package.json

# Rebuild từ đầu
docker-compose down
docker-compose build --no-cache service-name
docker-compose up -d
```

### Lỗi: Hết dung lượng ổ cứng

**Triệu chứng:** `no space left on device`

**Giải pháp:**

```bash
# Xóa các images không dùng
docker image prune -a

# Xóa các volumes không dùng
docker volume prune

# Xóa tất cả (⚠️ cẩn thận, sẽ mất data!)
docker system prune -a --volumes
```

### Lỗi: Build thất bại với "ENOENT"

**Triệu chứng:** `ENOENT: no such file or directory`

**Nguyên nhân:** File hoặc folder không tồn tại

**Giải pháp:**

```bash
# Kiểm tra file package.json có tồn tại không
dir server\order-manager-service\package.json

# Rebuild sạch
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 🔐 Bảo Mật Production

### Checklist triển khai Production

- [ ] **Đổi mật khẩu mặc định** trong `.env`
  ```env
  MONGO_ROOT_PASSWORD=<tạo-mật-khẩu-mạnh-tối-thiểu-32-ký-tự>
  ```

- [ ] **Tạo JWT Secret mạnh** 
  ```bash
  # Tạo secret key ngẫu nhiên
  openssl rand -base64 64
  ```

- [ ] **Cập nhật thông tin email**
  ```env
  EMAIL_USER=your-business-email@company.com
  EMAIL_PASSWORD=app-specific-password
  ```

- [ ] **Cấu hình payment gateways**
  ```env
  VNPAY_TMN_CODE=<mã-merchant-thật>
  VNPAY_HASH_SECRET=<secret-key-thật>
  ```

- [ ] **Bật HTTPS** với SSL certificates (Let's Encrypt miễn phí)

- [ ] **Thiết lập firewall** - Chỉ mở ports cần thiết

- [ ] **Backup tự động** - Lên lịch backup MongoDB hàng ngày

- [ ] **Giới hạn tài nguyên** cho containers (CPU, RAM)

- [ ] **Cập nhật CORS** - Chỉ cho phép domain chính thức

### Cấu hình .env cho Production

```env
# Database - MẬT KHẨU MẠNH!
MONGO_ROOT_PASSWORD=<dùng-password-generator-để-tạo-64-ký-tự>

# JWT - SECRET KEY MẠNH!
JWT_SECRET=<chạy: openssl rand -base64 64>

# Environment
NODE_ENV=production

# Email - Dùng email doanh nghiệp
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=noreply@smartbuy.vn
EMAIL_PASSWORD=<app-password-từ-gmail>

# Payment - Credentials THẬT từ payment gateways
VNPAY_TMN_CODE=VNPAY_MERCHANT_CODE_REAL
VNPAY_HASH_SECRET=SECRET_KEY_FROM_VNPAY
MOMO_PARTNER_CODE=REAL_MOMO_PARTNER
```

## 💾 Sao Lưu & Phục Hồi Dữ Liệu

### Docker Volumes - Lưu trữ dữ liệu

Docker lưu data trong volumes, không mất khi container restart:

```bash
# Xem danh sách volumes
docker volume ls

# Xem chi tiết volume
docker volume inspect smartbuy_mongodb_data

# Sao lưu volume MongoDB
docker run --rm -v smartbuy_mongodb_data:/data -v ${PWD}:/backup alpine tar czf /backup/mongodb-backup.tar.gz /data
```

### Backup Database MongoDB

**Sao lưu thủ công:**

```bash
# Backup toàn bộ databases
docker-compose exec mongodb mongodump --username admin --password smartbuy123 --authenticationDatabase admin --out /data/backup

# Backup ra file nén
docker-compose exec mongodb mongodump --username admin --password smartbuy123 --authenticationDatabase admin --archive --gzip > backup-$(Get-Date -Format "yyyyMMdd-HHmmss").gz
```

**Phục hồi database:**

```bash
# Restore từ backup
docker-compose exec mongodb mongorestore --username admin --password smartbuy123 --authenticationDatabase admin /data/backup

# Restore từ file nén
docker-compose exec -T mongodb mongorestore --username admin --password smartbuy123 --authenticationDatabase admin --archive --gzip < backup-20251205-143022.gz
```

**Tự động backup hàng ngày (Windows Task Scheduler):**

Tạo file `backup-daily.bat`:
```batch
@echo off
cd "D:\LV chuyên nghành 2025\smartbuy-web"
docker-compose exec -T mongodb mongodump --username admin --password smartbuy123 --authenticationDatabase admin --archive --gzip > backups\backup-%date:~-4,4%%date:~-7,2%%date:~-10,2%.gz
```

Đặt lịch chạy lúc 2h sáng mỗi ngày qua Task Scheduler.

## ⚡ Scale & Tối Ưu Hiệu Suất

### Scale theo chiều ngang (Horizontal Scaling)

**Ví dụ: Black Friday có 10,000 đơn hàng/giây**

```bash
# Chạy 5 instances của order-manager
docker-compose up -d --scale order-manager=5

# Chạy 3 instances của product-manager
docker-compose up -d --scale product-manager=3

# Lưu ý: Cần cấu hình load balancer trong api-gateway
```

### Giới hạn tài nguyên (Resource Limits)

Thêm vào `docker-compose.yml` cho mỗi service:

```yaml
services:
  order-manager:
    # ... cấu hình khác ...
    deploy:
      resources:
        limits:
          cpus: '1.0'      # Tối đa 1 CPU core
          memory: 512M     # Tối đa 512MB RAM
        reservations:
          cpus: '0.5'      # Đảm bảo 0.5 CPU core
          memory: 256M     # Đảm bảo 256MB RAM
```

**Lợi ích:**
- Ngăn service "ăn hết" tài nguyên server
- Ổn định hơn khi có traffic cao
- Dự đoán chi phí cloud dễ hơn

## ☁️ Triển Khai Lên Cloud

### AWS (Amazon Web Services)

**Option 1: AWS ECS (Elastic Container Service) - Được khuyến nghị**

```bash
# 1. Cài AWS CLI
winget install Amazon.AWSCLI

# 2. Đăng nhập AWS
aws configure

# 3. Tạo ECR repository (lưu Docker images)
aws ecr create-repository --repository-name smartbuy-api-gateway
aws ecr create-repository --repository-name smartbuy-client
# ... tạo cho tất cả services

# 4. Build & push images lên ECR
aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin <your-account-id>.dkr.ecr.ap-southeast-1.amazonaws.com

docker tag smartbuy-api-gateway:latest <your-account-id>.dkr.ecr.ap-southeast-1.amazonaws.com/smartbuy-api-gateway:latest
docker push <your-account-id>.dkr.ecr.ap-southeast-1.amazonaws.com/smartbuy-api-gateway:latest

# 5. Tạo ECS Cluster & Deploy
aws ecs create-cluster --cluster-name smartbuy-cluster
# Tiếp tục với task definitions và services
```

**Ước tính chi phí AWS ECS:**
- MongoDB: RDS DocumentDB ~$200/tháng
- 8 containers: Fargate ~$150/tháng
- Load Balancer: ~$20/tháng
- **Tổng: ~$370/tháng**

**Option 2: AWS EC2 (Virtual Machine)**

```bash
# 1. Tạo EC2 instance (Ubuntu 22.04, t3.medium)
# 2. SSH vào server
ssh -i your-key.pem ubuntu@<ec2-public-ip>

# 3. Cài Docker trên EC2
sudo apt update
sudo apt install docker.io docker-compose -y

# 4. Clone project
git clone https://github.com/your-username/smartbuy.git
cd smartbuy

# 5. Deploy như local
docker-compose up -d

# 6. Mở ports (Security Group)
# - 80 (HTTP)
# - 443 (HTTPS)
# - 3000 (API Gateway)
```

**Ước tính chi phí EC2:**
- t3.medium instance: ~$35/tháng
- Elastic IP: ~$3/tháng
- **Tổng: ~$40/tháng** (rẻ hơn ECS nhưng phải tự quản lý server)

### Azure (Microsoft Azure)

**Option 1: Azure Container Apps - Được khuyến nghị**

```bash
# 1. Cài Azure CLI
winget install Microsoft.AzureCLI

# 2. Đăng nhập Azure
az login

# 3. Tạo resource group
az group create --name smartbuy-rg --location southeastasia

# 4. Tạo Container Registry
az acr create --resource-group smartbuy-rg --name smartbuyacr --sku Basic

# 5. Build & push images
az acr build --registry smartbuyacr --image api-gateway:latest ./server/api-gateway
az acr build --registry smartbuyacr --image client:latest ./client
# ... cho tất cả services

# 6. Tạo Container Apps Environment
az containerapp env create --name smartbuy-env --resource-group smartbuy-rg --location southeastasia

# 7. Deploy từng service
az containerapp create \
  --name api-gateway \
  --resource-group smartbuy-rg \
  --environment smartbuy-env \
  --image smartbuyacr.azurecr.io/api-gateway:latest \
  --target-port 3000 \
  --ingress external \
  --env-vars MONGODB_URI=<connection-string>
```

**Ước tính chi phí Azure:**
- Container Apps: ~$100/tháng (8 services)
- Azure Cosmos DB (MongoDB API): ~$150/tháng
- Container Registry: ~$5/tháng
- **Tổng: ~$255/tháng**

**Option 2: Azure App Service**

```bash
# Deploy từng service như Web App
az webapp create --resource-group smartbuy-rg --plan smartbuy-plan --name smartbuy-api --deployment-container-image-name smartbuyacr.azurecr.io/api-gateway:latest
```

### Google Cloud Platform (GCP)

**Google Cloud Run - Serverless, pay-per-request**

```bash
# 1. Cài gcloud CLI
# Download: https://cloud.google.com/sdk/docs/install

# 2. Đăng nhập
gcloud auth login

# 3. Enable APIs
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# 4. Build & deploy
gcloud builds submit --tag gcr.io/<project-id>/api-gateway ./server/api-gateway
gcloud run deploy api-gateway --image gcr.io/<project-id>/api-gateway --platform managed --region asia-southeast1 --allow-unauthenticated

# 5. Deploy tất cả services tương tự
```

**Ước tính chi phí GCP:**
- Cloud Run: ~$50/tháng (pay-per-request, idle = $0)
- Cloud SQL (MongoDB Atlas): ~$100/tháng
- **Tổng: ~$150/tháng** (rẻ nhất nếu traffic không cao)

### Heroku - Đơn giản nhất cho người mới

```bash
# 1. Cài Heroku CLI
winget install Heroku.CLI

# 2. Login
heroku login

# 3. Tạo app cho mỗi service
heroku create smartbuy-api-gateway
heroku create smartbuy-client
# ... cho tất cả services

# 4. Deploy
git push heroku main

# 5. Provision MongoDB
heroku addons:create mongolab:sandbox --app smartbuy-api-gateway
```

**Ước tính chi phí Heroku:**
- 8 Hobby dynos (services): $56/tháng ($7/dyno)
- MongoDB Atlas M10: ~$60/tháng
- **Tổng: ~$120/tháng**

### So Sánh Nhanh

| Platform | Chi Phí/Tháng | Độ Khó | Tốc Độ Deploy | Khuyến Nghị |
|----------|---------------|---------|---------------|-------------|
| **GCP Cloud Run** | ~$150 | Trung bình | Nhanh | ⭐ Tốt nhất cho startup (pay-per-use) |
| **Heroku** | ~$120 | Dễ nhất | Rất nhanh | ⭐ Tốt cho MVP/Demo nhanh |
| **AWS EC2** | ~$40 | Khó | Chậm | ⭐ Rẻ nhất nhưng phải tự quản lý |
| **Azure Container Apps** | ~$255 | Trung bình | Nhanh | Tốt nếu đã dùng Azure |
| **AWS ECS** | ~$370 | Khó | Trung bình | Tốt cho enterprise, scalable |

**Khuyến nghị theo giai đoạn:**
- **MVP/Testing:** Heroku hoặc GCP Cloud Run (dễ + nhanh)
- **Production nhỏ:** AWS EC2 (rẻ nhưng phải tự maintain)
- **Production lớn:** AWS ECS hoặc Azure Container Apps (auto-scale tốt)

## 🆘 Hỗ Trợ Thêm

### Tài liệu quan trọng

- **Docker Documentation:** https://docs.docker.com/
- **Docker Compose:** https://docs.docker.com/compose/
- **MongoDB Docker:** https://hub.docker.com/_/mongo
- **Nginx Docker:** https://hub.docker.com/_/nginx

### Các file cấu hình quan trọng

```
smartbuy-web/
├── docker-compose.yml           # Main orchestration
├── docker-compose.dev.yml       # Development override
├── .env                         # Environment variables (TỰ TẠO)
├── .env.example                 # Template
├── DOCKER.md                    # Tài liệu này
├── DOCKER-TEST.md               # Test cases
├── docker-start.bat             # Windows script
├── Makefile                     # Unix commands
├── client/
│   ├── Dockerfile               # Client multi-stage build
│   ├── nginx.conf               # Nginx config
│   └── .dockerignore
└── server/
    ├── api-gateway/
    │   ├── Dockerfile
    │   └── .dockerignore
    ├── user-manager-service/
    │   ├── Dockerfile
    │   └── .dockerignore
    └── ... (tương tự cho 6 services còn lại)
```

### Debug Tips

**Xem logs chi tiết:**
```bash
# Logs của 1 service
docker-compose logs -f api-gateway

# Logs của tất cả services
docker-compose logs -f

# 100 dòng logs cuối
docker-compose logs --tail=100 order-manager
```

**Vào bên trong container:**
```bash
# Mở shell trong container đang chạy
docker-compose exec api-gateway sh

# Trong container, có thể check:
cd /app
ls -la
cat package.json
printenv | grep MONGO
```

**Check networking:**
```bash
# Xem container network
docker network inspect smartbuy_smartbuy-network

# Test connection từ 1 container sang container khác
docker-compose exec api-gateway ping mongodb
docker-compose exec api-gateway curl http://user-manager:3006/health
```

### Khi nào cần help

**Liên hệ team nếu:**
- Container không start sau 5 phút
- Database connection timeout liên tục
- Lỗi "Cannot find module" sau khi build
- Client hiển thị trắng xóa (check nginx logs)
- Payment gateway timeout (check firewall/network)

**Troubleshooting workflow chuẩn:**
```bash
1. docker-compose ps                    # Check trạng thái containers
2. docker-compose logs <service-name>   # Check logs lỗi
3. docker-compose exec <service> sh     # Vào container debug
4. docker-compose restart <service>     # Restart thử
5. docker-compose down && docker-compose up -d   # Full restart
```

## ❓ Câu Hỏi Thường Gặp (FAQ)

### Q1: Tôi truy cập website ở đâu khi chạy Docker?

**A:** Mở trình duyệt và gõ: **http://localhost:8080**

Đây là nơi Nginx (client container) serve giao diện Vue.js. Nginx tự động proxy API calls sang `http://api-gateway:3000` bên trong Docker network.

**Tại sao port 8080 thay vì 80?** Port 80 thường bị chiếm bởi Apache2/IIS trên Windows/Linux. Port 8080 tránh conflict.

### Q2: Tại sao phải có cả 12 containers? Không gộp lại được à?

**A:** Đây là **kiến trúc Microservices** - mỗi service có trách nhiệm riêng:

| Service | Chức năng | Lý do tách riêng |
|---------|-----------|------------------|
| MongoDB | Database | Data layer độc lập |
| API Gateway | Reverse proxy | Single entry point, security |
| user-service | Auth, login | Xử lý authentication |
| product-service | Sản phẩm | CRUD products |
| cart-service | Giỏ hàng | Quản lý giỏ hàng |
| order-service | Đơn hàng user | Order history |
| payment-service | Thanh toán | Payment gateway integration |
| user-manager | Admin users | Quản lý users từ admin |
| product-manager | Admin products | Quản lý sản phẩm từ admin |
| order-manager | Admin orders | Xử lý đơn hàng, gửi email |
| review-service | Đánh giá | Review & rating |
| client | Frontend | Vue.js SPA |

**Lợi ích:**
- ✅ Mỗi service scale độc lập
- ✅ Lỗi 1 service không crash toàn hệ thống
- ✅ Deploy từng service riêng không cần restart tất cả
- ✅ Team khác nhau làm service khác nhau

### Q3: Docker chạy trên máy tôi có ăn nhiều RAM không?

**A:** Tổng RAM usage: **~2-3GB** khi chạy đầy đủ 12 containers.

Breakdown:
- MongoDB: ~512MB
- Backend services (11 services): ~128MB/each = ~1.4GB
- Client (Nginx): ~64MB
- Docker overhead: ~500MB

**Khuyến nghị:** Máy tính có ít nhất **8GB RAM** (4GB cho Docker, 4GB cho Windows/macOS).

### Q4: Docker có làm máy tôi chậm không?

**A:** Có ảnh hưởng nhưng **ít hơn** so với chạy 12 services ngoài Docker!

**So sánh:**
- Không Docker: 12 Node.js processes + MongoDB = 100% CPU khi start
- Có Docker: Docker Engine quản lý tài nguyên tốt hơn, CPU idle khi không có request

### Q5: Tôi sửa code, phải rebuild Docker không?

**A:** Tùy loại file:

| File thay đổi | Cần rebuild? | Lệnh |
|---------------|--------------|------|
| `.js`, `.ts` backend | ✅ Cần | `docker-compose up -d --build service-name` |
| `.vue`, `.ts` frontend | ✅ Cần | `docker-compose up -d --build client` |
| `.env` | ❌ Không | `docker-compose restart service-name` |
| `docker-compose.yml` | ❌ Không | `docker-compose up -d` |
| `package.json` | ✅ Cần | `docker-compose build --no-cache service-name` |

**Development mode:** Sử dụng volumes để mount code vào container → Auto-reload khi sửa code!

### Q6: Làm sao biết service nào đang lỗi?

**A:** Dùng lệnh health check:

```powershell
# Cách 1: Xem status
docker-compose ps
# Cột STATUS sẽ hiện: Up (healthy) hoặc Up (unhealthy)

# Cách 2: Test health endpoint trực tiếp
Invoke-WebRequest http://localhost:3005/health  # user-service
Invoke-WebRequest http://localhost:3001/health  # product-service
# ... test từng service

# Cách 3: Xem logs
docker-compose logs --tail=50 service-name
```

### Q7: Data có mất khi tôi tắt Docker không?

**A:** **KHÔNG**, nhờ Docker Volumes!

```powershell
# Tắt containers (data VẪN CÒN)
docker-compose down

# Bật lại (data vẫn nguyên)
docker-compose up -d

# CHỈ MẤT KHI:
docker-compose down -v  # ⚠️ Flag -v xóa volumes
```

**Data được lưu ở đâu?**
- Windows: `C:\Users\<YourName>\AppData\Local\Docker\wsl\data\`
- Volumes: `mongodb_data`, `user_avatars`, `product_uploads`

### Q8: Tôi muốn xóa sạch tất cả để start lại từ đầu?

**A:**

```powershell
# Bước 1: Dừng và xóa containers + volumes
docker-compose down -v

# Bước 2: Xóa tất cả images của SmartBuy
docker images | findstr smartbuy | ForEach-Object { docker rmi ($_.Split()[0] + ':' + $_.Split()[1]) -f }

# Bước 3: Xóa cache build
docker builder prune -a -f

# Bước 4: Build lại từ đầu
docker-compose build --no-cache
docker-compose up -d
```

### Q9: Port 80 bị chiếm bởi IIS/Apache, làm sao?

**A:** ✅ **ĐÃ GIẢI QUYẾT!** SmartBuy mặc định đã dùng port **8080** thay vì 80.

Nếu muốn đổi lại port 80:
```yaml
client:
  ports:
    - "80:80"  # Đổi từ 8080:80 → 80:80
```

Nhưng phải **tắt Apache2 trước:**
```bash
# Windows với WSL
wsl sudo service apache2 stop

# Linux
sudo systemctl stop apache2
```

### Q10: Có thể chạy Docker trên máy yếu không?

**A:** Có! Giảm số lượng services:

```yaml
# docker-compose.yml - Comment services không cần thiết
# Ví dụ: Chỉ chạy core services
services:
  mongodb: ...
  api-gateway: ...
  user-service: ...
  product-service: ...
  cart-service: ...
  client: ...
  
  # Comment các services này nếu máy yếu:
  # order-manager: ...
  # user-manager: ...
  # product-manager: ...
```

**Minimum setup:** MongoDB + API Gateway + 3 core services + Client = **~1GB RAM**

### Q11: Docker có tự động restart khi máy khởi động lại?

**A:** Có, nhờ `restart: unless-stopped`:

```yaml
services:
  mongodb:
    restart: unless-stopped  # Tự động start khi Docker Engine start
```

**Lưu ý:** Phải bật "Start Docker Desktop when you log in" trong Docker Desktop settings.

### Q12: Làm sao test API không cần Postman?

**A:** Dùng PowerShell:

```powershell
# GET request
Invoke-WebRequest -Uri http://localhost:3000/api/products | Select-Object -ExpandProperty Content | ConvertFrom-Json

# POST request
$body = @{ email = "test@gmail.com"; password = "123456" } | ConvertTo-Json
Invoke-WebRequest -Uri http://localhost:3000/api/auth/login -Method POST -Body $body -ContentType "application/json"
```

## 🎓 Best Practices

### ✅ Development

1. **Dùng `.env.local` cho dev config riêng:**
```bash
cp .env .env.local
# Edit .env.local với config dev
docker-compose --env-file .env.local up -d
```

2. **Mount code vào container để hot-reload:**
```yaml
# docker-compose.dev.yml
services:
  user-service:
    volumes:
      - ./server/userservice:/app  # Code changes auto-reload
```

3. **Tắt services không cần thiết:**
```bash
# Chỉ start MongoDB + API Gateway + Client
docker-compose up -d mongodb api-gateway client
```

4. **Xem logs nhiều services cùng lúc:**
```powershell
docker-compose logs -f api-gateway user-service product-service
```

### ✅ Production

1. **Luôn dùng specific versions trong package.json:**
```json
// ❌ SAI
"dependencies": {
  "express": "^4.18.0"  // ^ cho phép update minor version
}

// ✅ ĐÚNG
"dependencies": {
  "express": "4.18.0"  // Fix version cụ thể
}
```

2. **Set resource limits:**
```yaml
services:
  order-manager:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
```

3. **Enable health checks cho tất cả services:**
```yaml
healthcheck:
  test: ["CMD", "node", "-e", "require('http').get('http://localhost:3005/health')"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

4. **Backup MongoDB hàng ngày:**
```powershell
# Tạo scheduled task chạy script này mỗi ngày
docker-compose exec -T mongodb mongodump --username admin --password smartbuy123 --authenticationDatabase admin --archive --gzip > "backup-$(Get-Date -Format 'yyyyMMdd').gz"
```

5. **Monitor container health:**
```powershell
# Setup cron job/scheduled task
docker-compose ps | findstr "unhealthy"
if ($LASTEXITCODE -eq 0) {
    # Send alert email
}
```

### ✅ Security

1. **Đổi tất cả mật khẩu mặc định:**
```env
MONGO_ROOT_PASSWORD=<64-character-random-string>
JWT_SECRET=<64-character-random-string>
```

2. **Không commit `.env` vào git:**
```bash
# .gitignore
.env
.env.local
.env.production
```

3. **Dùng Docker secrets cho production:**
```yaml
# docker-compose.prod.yml
services:
  mongodb:
    environment:
      - MONGO_INITDB_ROOT_PASSWORD_FILE=/run/secrets/mongo_password
    secrets:
      - mongo_password

secrets:
  mongo_password:
    file: ./secrets/mongo_password.txt
```

4. **Scan images cho vulnerabilities:**
```powershell
docker scan smartbuy-web-user-service
```

5. **Update base images thường xuyên:**
```dockerfile
# Thay vì node:20
FROM node:20-alpine  # Alpine nhỏ hơn, ít vulnerabilities hơn

# Check for updates
FROM node:20-alpine@sha256:abc123...  # Pin specific digest
```

## 📚 Tài Liệu Tham Khảo

- **Docker Documentation:** https://docs.docker.com/
- **Docker Compose:** https://docs.docker.com/compose/
- **Best Practices:** https://docs.docker.com/develop/dev-best-practices/
- **Node.js Docker:** https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
- **MongoDB Docker:** https://hub.docker.com/_/mongo

---

**✅ Hoàn tất! Bạn đã sẵn sàng triển khai SmartBuy với Docker.**

**Checklist cuối cùng trước khi deploy:**
- [ ] Đã test tất cả services với `docker-compose ps` - All healthy
- [ ] Đã test website tại http://localhost - Hiển thị bình thường
- [ ] Đã đổi mật khẩu mặc định trong `.env`
- [ ] Đã setup backup MongoDB tự động
- [ ] Đã test thanh toán với payment sandbox
- [ ] Đã đọc phần Troubleshooting để biết xử lý lỗi

Nếu gặp vấn đề, tham khảo:
- `DOCKER-ARCHITECTURE.md` - Sơ đồ kiến trúc chi tiết
- `DOCKER-TEST.md` - Test cases và verification
- `DOCKER-QUICK-COMMANDS.md` - Các lệnh hay dùng

**Happy Dockerizing! 🐳🚀**
