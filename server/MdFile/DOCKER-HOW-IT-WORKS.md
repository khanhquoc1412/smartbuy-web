# 🔍 Docker Hoạt Động Như Thế Nào? - Giải Thích Chi Tiết

## 🎯 Mục Đích File Này

File này giải thích **chi tiết cơ chế hoạt động** của Docker trong dự án SmartBuy, giúp bạn hiểu:
- Containers là gì và chúng giao tiếp như thế nào
- Request từ browser đến database đi qua những gì
- Tại sao cần 12 containers thay vì 1 app duy nhất
- Docker Network, Volumes, Health Checks hoạt động ra sao

## 📦 Container là gì?

### So sánh với máy ảo (Virtual Machine)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    MÁY TÍNH CỦA BẠN (Host)                          │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │              Docker Engine                                   │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │   │
│  │  │  Container 1 │  │  Container 2 │  │  Container 3 │      │   │
│  │  │  (user-svc)  │  │ (product-svc)│  │  (MongoDB)   │      │   │
│  │  │              │  │              │  │              │      │   │
│  │  │ Node.js      │  │ Node.js      │  │ MongoDB      │      │   │
│  │  │ App code     │  │ App code     │  │ Database     │      │   │
│  │  │ 128MB RAM    │  │ 128MB RAM    │  │ 512MB RAM    │      │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘      │   │
│  │                                                              │   │
│  │  Share: Kernel, OS Libraries                                │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Windows / macOS / Linux Kernel                                    │
└─────────────────────────────────────────────────────────────────────┘
```

**Container vs Virtual Machine:**

| Đặc điểm | Container | Virtual Machine |
|----------|-----------|-----------------|
| Kích thước | ~100MB | ~5GB |
| Thời gian start | 1-2 giây | 30-60 giây |
| RAM overhead | Rất ít (~10MB) | Nhiều (~1GB) |
| Share OS kernel | ✅ Có | ❌ Không |
| Isolation | Process-level | OS-level |

**Ví dụ thực tế:**
- **Container:** Như một căn phòng trong chung cư (share hệ thống điện nước, nhưng có tường riêng)
- **VM:** Như một căn nhà riêng biệt (có hệ thống điện nước riêng, tốn nhiều tài nguyên hơn)

## 🌊 Luồng Request - Từ Browser Đến Database

### Ví dụ: User login vào hệ thống

```
┌─────────────────────────────────────────────────────────────────────────┐
│  BƯỚC 1: User gõ http://localhost và click "Đăng nhập"                 │
└─────────────────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────────────┐
│  Trình duyệt (Chrome/Firefox)                                           │
│  → POST http://localhost/api/auth/login                                 │
│  → Body: { email: "user@gmail.com", password: "123456" }               │
└─────────────────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────────────┐
│  BƯỚC 2: Request đến Docker Network (port 80)                           │
│  🖥️ Host Machine (Windows)                                              │
│    Port 80 (localhost:80) → Mapped to → Container client:80            │
└─────────────────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────────────┐
│  📦 Container: smartbuy-client (Nginx)                                  │
│  1. Nginx nhận request tại /api/auth/login                             │
│  2. Kiểm tra nginx.conf:                                                │
│     location /api/ {                                                    │
│       proxy_pass http://api-gateway:3000;  ← Chuyển đến API Gateway    │
│     }                                                                    │
│  3. Gửi request qua Docker Network                                      │
└─────────────────────────────────────────────────────────────────────────┘
                           ↓
      🌐 Docker Network: smartbuy-network (internal)
      DNS Resolution: api-gateway → 172.18.0.3:3000
                           ↓
┌─────────────────────────────────────────────────────────────────────────┐
│  📦 Container: smartbuy-api-gateway                                     │
│  1. Express.js nhận POST /api/auth/login                               │
│  2. Middleware kiểm tra:                                                │
│     - Rate limiting (max 100 requests/minute)                          │
│     - CORS (allow localhost origin)                                     │
│  3. Route matching:                                                     │
│     /api/auth/* → proxy to http://user-service:3005                    │
│  4. Gửi request qua Docker Network                                      │
└─────────────────────────────────────────────────────────────────────────┘
                           ↓
      🌐 Docker Network: smartbuy-network
      DNS Resolution: user-service → 172.18.0.5:3005
                           ↓
┌─────────────────────────────────────────────────────────────────────────┐
│  📦 Container: smartbuy-user-service                                    │
│  1. Express.js nhận POST /api/auth/login                               │
│  2. Controller: authController.login()                                  │
│     - Validate email format                                             │
│     - Check required fields                                             │
│  3. Service: authService.authenticateUser()                            │
│     - Query MongoDB để tìm user                                         │
│  4. Kết nối MongoDB qua Docker Network                                  │
└─────────────────────────────────────────────────────────────────────────┘
                           ↓
      🌐 Docker Network: smartbuy-network
      DNS Resolution: mongodb → 172.18.0.2:27017
                           ↓
┌─────────────────────────────────────────────────────────────────────────┐
│  📦 Container: smartbuy-mongodb                                         │
│  1. MongoDB nhận connection từ user-service                            │
│     Connection string:                                                  │
│     mongodb://admin:smartbuy123@mongodb:27017/smartbuy_users           │
│  2. Authenticate với username/password                                  │
│  3. Query database:                                                     │
│     db.users.findOne({ email: "user@gmail.com" })                      │
│  4. Trả về user document                                                │
└─────────────────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────────────┐
│  📦 Container: smartbuy-user-service                                    │
│  5. So sánh password hash (bcrypt)                                      │
│  6. Tạo JWT token:                                                      │
│     const token = jwt.sign(                                             │
│       { userId: user._id, email: user.email },                         │
│       process.env.JWT_SECRET,                                           │
│       { expiresIn: '7d' }                                               │
│     );                                                                  │
│  7. Response:                                                           │
│     {                                                                   │
│       success: true,                                                    │
│       token: "eyJhbGc...",                                              │
│       user: { id, email, name }                                         │
│     }                                                                   │
└─────────────────────────────────────────────────────────────────────────┘
                           ↑
      Response đi ngược lại theo đường cũ:
      user-service → api-gateway → nginx → browser
                           ↓
┌─────────────────────────────────────────────────────────────────────────┐
│  Trình duyệt (Chrome/Firefox)                                           │
│  1. Nhận response JSON                                                  │
│  2. Vue.js lưu token vào localStorage                                   │
│  3. Redirect user đến trang chủ                                         │
│  4. Hiển thị "Đăng nhập thành công!"                                    │
└─────────────────────────────────────────────────────────────────────────┘
```

**⏱️ Thời gian xử lý thực tế:**
- Nginx → API Gateway: ~2ms (Docker network rất nhanh)
- API Gateway → user-service: ~3ms
- user-service → MongoDB: ~5ms
- Query database: ~10ms
- Bcrypt compare password: ~50ms
- Total: **~70ms** cho toàn bộ luồng

## 🌐 Docker Network - Cách Containers Giao Tiếp

### Internal DNS Resolution

Docker tự động tạo DNS server nội bộ:

```
Container Name          Internal IP          Ports
─────────────────      ──────────────       ──────────────────
mongodb             →  172.18.0.2:27017    (database)
api-gateway         →  172.18.0.3:3000     (reverse proxy)
user-service        →  172.18.0.5:3005     (auth service)
product-service     →  172.18.0.6:3001     (product API)
cart-service        →  172.18.0.7:3002     (cart API)
order-service       →  172.18.0.8:3002     (order API)
payment-service     →  172.18.0.9:3004     (payment API)
user-manager        →  172.18.0.10:3006    (admin users)
product-manager     →  172.18.0.11:5002    (admin products)
order-manager       →  172.18.0.12:5003    (admin orders)
review-service      →  172.18.0.13:5006    (reviews)
client              →  172.18.0.14:80      (nginx frontend)
```

### Ví dụ Giao Tiếp

**Code trong api-gateway:**
```javascript
// api-gateway/src/routes.js
app.use('/api/auth', proxy({
  target: 'http://user-service:3005',  // ← Docker tự resolve IP
  changeOrigin: true
}));

// Docker DNS magic:
// 'user-service' → 172.18.0.5
// Equivalent to: proxy({ target: 'http://172.18.0.5:3005' })
```

**Code trong user-service:**
```javascript
// userservice/config/config.js
const mongoUrl = process.env.DB_PROD_URL;
// = 'mongodb://admin:smartbuy123@mongodb:27017/smartbuy_users'
//                                  ↑
//                       Docker resolves to 172.18.0.2
```

### Test DNS Resolution

```powershell
# Vào container api-gateway
docker-compose exec api-gateway sh

# Test ping (nếu có ping command)
ping mongodb          # → 172.18.0.2

# Test DNS lookup
nslookup mongodb      # → 172.18.0.2

# Test HTTP connection
wget -O- http://user-service:3005/health
# → {"success":true,"message":"User service is running"}
```

## 🗄️ Docker Volumes - Persistent Storage

### Vấn đề: Container Ephemeral (Tạm thời)

```
┌──────────────────────────────────────────────────────────────────┐
│  Scenario: Không dùng volumes                                    │
│                                                                   │
│  1. Start MongoDB container                                      │
│     docker-compose up -d mongodb                                 │
│     → MongoDB lưu data trong container: /data/db                 │
│     → Insert 1000 users vào database                             │
│                                                                   │
│  2. Rebuild container                                            │
│     docker-compose up -d --build mongodb                         │
│     → Container cũ bị xóa                                        │
│     → ❌ 1000 users mất hết!                                     │
└──────────────────────────────────────────────────────────────────┘
```

### Giải pháp: Docker Volumes

```
┌──────────────────────────────────────────────────────────────────┐
│  Host Machine (Windows)                                           │
│  C:\Users\YourName\AppData\Local\Docker\wsl\data\               │
│                                                                   │
│  ┌──────────────────────────────────────────────────────┐       │
│  │  Volume: mongodb_data                                │       │
│  │  ├── collection-0.wt                                 │       │
│  │  ├── collection-1.wt                                 │       │
│  │  └── WiredTiger.wt                                   │       │
│  └────────────────────────┬───────────────────────────────┘     │
│                            │ Mount to                            │
│  ┌─────────────────────────▼─────────────────────────────┐      │
│  │  📦 Container: smartbuy-mongodb                       │      │
│  │  /data/db ← Mounted from volume                       │      │
│  │                                                        │      │
│  │  Container bị xóa → Volume vẫn còn ✅                 │      │
│  │  Start container mới → Mount volume cũ → Data nguyên! │      │
│  └────────────────────────────────────────────────────────┘      │
└──────────────────────────────────────────────────────────────────┘
```

### Volume Configuration trong docker-compose.yml

```yaml
services:
  mongodb:
    image: mongo:7
    volumes:
      - mongodb_data:/data/db           # Database files
      - mongodb_config:/data/configdb   # Config files
    
  user-service:
    volumes:
      - user_avatars:/app/avarta        # User profile images
  
  product-manager:
    volumes:
      - product_uploads:/app/uploads    # Product images

volumes:
  mongodb_data:      # Docker tự động tạo và quản lý
  mongodb_config:
  user_avatars:
  product_uploads:
```

### Quản Lý Volumes

```powershell
# Xem danh sách volumes
docker volume ls
# OUTPUT:
# DRIVER    VOLUME NAME
# local     smartbuy-web_mongodb_data
# local     smartbuy-web_user_avatars

# Inspect volume
docker volume inspect smartbuy-web_mongodb_data
# OUTPUT:
# [
#     {
#         "CreatedAt": "2025-12-05T10:30:00Z",
#         "Driver": "local",
#         "Mountpoint": "/var/lib/docker/volumes/smartbuy-web_mongodb_data/_data",
#         "Name": "smartbuy-web_mongodb_data",
#         "Scope": "local"
#     }
# ]

# Backup volume
docker run --rm -v smartbuy-web_mongodb_data:/data -v ${PWD}:/backup alpine tar czf /backup/mongodb-backup.tar.gz /data

# Restore volume
docker run --rm -v smartbuy-web_mongodb_data:/data -v ${PWD}:/backup alpine sh -c "cd /data && tar xzf /backup/mongodb-backup.tar.gz --strip 1"

# ⚠️ Xóa volume (MẤT DATA!)
docker volume rm smartbuy-web_mongodb_data
```

## 💚 Health Checks - Tự Động Phát Hiện Lỗi

### Cơ Chế Hoạt Động

```
┌──────────────────────────────────────────────────────────────────┐
│  Docker Engine                                                    │
│                                                                   │
│  Every 30 seconds:                                               │
│  1. Run health check command in container                        │
│  2. Check exit code:                                             │
│     - 0 = healthy ✅                                             │
│     - 1 = unhealthy ❌                                           │
│  3. Update container status                                      │
│  4. If unhealthy 3 times in a row → Mark unhealthy → Restart    │
└──────────────────────────────────────────────────────────────────┘
```

### Ví dụ: user-service Health Check

```yaml
# docker-compose.yml
user-service:
  healthcheck:
    test: ["CMD", "node", "-e", "require('http').get('http://localhost:3005/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"]
    interval: 30s       # Kiểm tra mỗi 30 giây
    timeout: 10s        # Timeout sau 10 giây
    retries: 3          # Thử 3 lần trước khi báo unhealthy
    start_period: 40s   # Đợi 40 giây sau khi start mới bắt đầu check
```

**Giải thích command:**
```javascript
// Health check command
node -e "
  require('http').get('http://localhost:3005/health', (response) => {
    // Nếu response.statusCode === 200 → exit(0) → healthy
    // Nếu response.statusCode !== 200 → exit(1) → unhealthy
    process.exit(response.statusCode === 200 ? 0 : 1)
  })
"
```

**Code health endpoint trong user-service:**
```javascript
// server/userservice/index.js
app.get('/health', (req, res) => {
  // Kiểm tra database connection
  if (mongoose.connection.readyState === 1) {
    res.status(200).json({
      success: true,
      message: 'User service is running',
      port: process.env.PORT,
      database: mongoose.connection.name,
      routes: ['/api/auth', '/api/user/addresses', '/api/user/wishlist']
    });
  } else {
    res.status(503).json({
      success: false,
      message: 'Database not connected'
    });
  }
});
```

### Timeline Health Check

```
T=0s     Container starts
         ├─ npm install dependencies
         ├─ Connect to MongoDB
         └─ Start Express server on port 3005

T=40s    [Start Period] Health check begins
         ├─ Docker runs: node -e "require('http').get(...)"
         ├─ GET http://localhost:3005/health
         ├─ Response: 200 OK
         └─ ✅ Status: healthy

T=70s    [Interval] Second health check
         ├─ GET http://localhost:3005/health
         ├─ Response: 200 OK
         └─ ✅ Status: healthy

T=100s   [Interval] Third health check
         ├─ GET http://localhost:3005/health
         ├─ ❌ Timeout after 10s (MongoDB down)
         └─ ⚠️ Attempt 1/3 failed

T=130s   [Interval] Fourth health check
         ├─ ❌ Timeout
         └─ ⚠️ Attempt 2/3 failed

T=160s   [Interval] Fifth health check
         ├─ ❌ Timeout
         └─ ❌ Attempt 3/3 failed → Status: unhealthy
         └─ 🔄 Docker restarts container
```

### Xem Health Status

```powershell
# Cách 1: docker-compose ps
docker-compose ps
# STATUS column:
# - Up (healthy)           → ✅ Tốt
# - Up (health: starting)  → ⏳ Đang kiểm tra
# - Up (unhealthy)         → ❌ Có lỗi
# - Up                     → ⚠️ Không có health check

# Cách 2: Docker inspect
docker inspect smartbuy-user-service --format='{{.State.Health.Status}}'
# OUTPUT: healthy / unhealthy / starting

# Cách 3: Health check logs
docker inspect smartbuy-user-service --format='{{json .State.Health}}' | ConvertFrom-Json
# OUTPUT:
# {
#   "Status": "healthy",
#   "FailingStreak": 0,
#   "Log": [
#     {
#       "Start": "2025-12-05T15:30:00Z",
#       "End": "2025-12-05T15:30:00.5Z",
#       "ExitCode": 0,
#       "Output": ""
#     }
#   ]
# }
```

## 🔄 Container Lifecycle

### Từ `docker-compose up` đến Running

```
1️⃣ PULL IMAGES (First time only)
   ├─ docker pull node:20-alpine
   ├─ docker pull mongo:7
   └─ docker pull nginx:alpine
   Time: 2-5 minutes

2️⃣ BUILD IMAGES
   ├─ Read Dockerfile
   ├─ Execute each instruction:
   │  ├─ FROM node:20-alpine         (Base image)
   │  ├─ WORKDIR /app                (Set working dir)
   │  ├─ COPY package*.json ./       (Copy dependencies)
   │  ├─ RUN npm ci                  (Install dependencies)
   │  ├─ COPY . .                    (Copy source code)
   │  └─ CMD ["node", "index.js"]    (Start command)
   └─ Tag image: smartbuy-web-user-service:latest
   Time: 3-8 minutes (with cache: 30s)

3️⃣ CREATE NETWORK
   └─ docker network create smartbuy-network
   Time: 1 second

4️⃣ CREATE VOLUMES
   ├─ docker volume create smartbuy-web_mongodb_data
   ├─ docker volume create smartbuy-web_user_avatars
   └─ docker volume create smartbuy-web_product_uploads
   Time: 1 second

5️⃣ START CONTAINERS (Respect depends_on)
   
   Level 1: MongoDB
   ├─ docker run mongo:7
   │  ├─ Mount volumes
   │  ├─ Set environment variables
   │  ├─ Start MongoDB
   │  └─ Wait for health check: healthy ✅
   Time: 10-15 seconds
   
   Level 2: Backend Services (parallel)
   ├─ user-service
   ├─ product-service
   ├─ cart-service
   ├─ order-service
   ├─ payment-service
   ├─ user-manager
   ├─ product-manager
   ├─ order-manager
   └─ review-service
   │  Each:
   │  ├─ Create container
   │  ├─ Mount volumes
   │  ├─ Connect to network
   │  ├─ Run: npm start / node index.js
   │  ├─ Connect to MongoDB
   │  └─ Wait for health check
   Time: 20-30 seconds
   
   Level 3: API Gateway
   ├─ Depends on MongoDB
   ├─ Start Express server
   └─ Health check: healthy ✅
   Time: 5-10 seconds
   
   Level 4: Client (Nginx)
   ├─ Depends on API Gateway
   ├─ Serve static files
   └─ Health check: healthy ✅
   Time: 2-5 seconds

6️⃣ ALL READY! 🎉
   Total time: 40-70 seconds (after images built)
   URL: http://localhost
```

### Container States

```
┌─────────────────────────────────────────────────────────────────┐
│                    Container Lifecycle                           │
│                                                                  │
│    ┌──────────┐                                                 │
│    │ Created  │ (docker-compose up)                             │
│    └────┬─────┘                                                 │
│         ↓                                                        │
│    ┌────────┐                                                   │
│    │Starting│ (Executing CMD)                                   │
│    └────┬───┘                                                   │
│         ↓                                                        │
│    ┌────────┐    [Health Check]                                │
│    │Running │ ─────────┬────────────────────────┐              │
│    └────┬───┘          ↓                        ↓              │
│         │         ┌────────┐              ┌──────────┐         │
│         │         │Healthy │              │Unhealthy │         │
│         │         └────┬───┘              └────┬─────┘         │
│         │              │                       │               │
│         │              │                       ↓               │
│         │              │              (Auto restart 3x)        │
│         │              │                       │               │
│         ↓              ↓                       ↓               │
│    ┌─────────────────────────────────────────────┐            │
│    │            (docker-compose down)            │            │
│    └──────────────────┬──────────────────────────┘            │
│                       ↓                                        │
│                  ┌────────┐                                    │
│                  │ Exited │                                    │
│                  └────────┘                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 🎓 Quiz - Kiểm Tra Hiểu Biết

### Câu 1: Request Flow
**Q:** User truy cập `http://localhost/api/products`, request đi qua những container nào?

<details>
<summary>Xem đáp án</summary>

**Đáp án:**
1. Browser → `localhost:80`
2. Nginx (client container) nhận request
3. Nginx proxy đến `api-gateway:3000`
4. API Gateway route đến `product-service:3001`
5. Product Service query `mongodb:27017`
6. Response đi ngược lại: MongoDB → Product → Gateway → Nginx → Browser

**Containers đi qua:** client → api-gateway → product-service → mongodb
</details>

### Câu 2: Docker Network
**Q:** Tại sao trong code dùng `http://mongodb:27017` thay vì `http://localhost:27017`?

<details>
<summary>Xem đáp án</summary>

**Đáp án:**
- `localhost` trong container = chính container đó (không phải host machine)
- Docker DNS resolve `mongodb` → IP của MongoDB container (172.18.0.2)
- Containers giao tiếp qua Docker Network, không qua localhost

**Nếu dùng localhost:**
- `http://localhost:27017` → Tìm MongoDB trong chính container user-service
- MongoDB không chạy trong user-service → Connection refused ❌
</details>

### Câu 3: Volumes
**Q:** Lệnh nào sau đây XÓA tất cả data MongoDB?

A. `docker-compose down`  
B. `docker-compose restart`  
C. `docker-compose down -v`  
D. `docker-compose stop`

<details>
<summary>Xem đáp án</summary>

**Đáp án: C** - `docker-compose down -v`

- **A:** `down` chỉ xóa containers, giữ volumes → Data safe ✅
- **B:** `restart` chỉ restart containers → Data safe ✅
- **C:** `down -v` xóa cả volumes → **Data mất hết** ❌
- **D:** `stop` chỉ dừng containers → Data safe ✅
</details>

### Câu 4: Port Mapping
**Q:** order-service có port mapping `3003:3002`. Ý nghĩa?

<details>
<summary>Xem đáp án</summary>

**Đáp án:**
- **3003:** Port trên host machine (Windows) - Bạn truy cập `localhost:3003`
- **3002:** Port trong container - order-service chạy trên port 3002

**Tại sao không dùng 3002:3002?**
- cart-service đã dùng port 3002 trên host
- Conflict! Phải dùng port khác (3003) cho external access
- Internal vẫn là 3002, không ảnh hưởng code

**Từ bên ngoài:** `http://localhost:3003`  
**Từ containers khác:** `http://order-service:3002`
</details>

### Câu 5: Health Checks
**Q:** Service có status "Up (unhealthy)" nghĩa là gì?

<details>
<summary>Xem đáp án</summary>

**Đáp án:**
- Container **đang chạy** (Up)
- Nhưng **health check fail** (unhealthy)
- Docker đã thử 3 lần, đều timeout hoặc status !== 200
- Docker sẽ **tự động restart** container

**Nguyên nhân thường gặp:**
- Service chưa có `/health` endpoint
- MongoDB chưa connect được
- Port bị block
- Process crash nhưng container vẫn running
</details>

## 📊 Performance & Resource Usage

### Tài nguyên thực tế khi chạy đầy đủ 12 containers

```powershell
# Xem resource usage realtime
docker stats

# Output mẫu:
CONTAINER               CPU %   MEM USAGE / LIMIT   MEM %   NET I/O
smartbuy-mongodb        5.2%    487MB / 8GB        6.08%   12KB / 8KB
smartbuy-api-gateway    0.8%    142MB / 8GB        1.77%   450KB / 320KB
smartbuy-user-service   1.2%    156MB / 8GB        1.95%   230KB / 180KB
smartbuy-product-svc    0.9%    138MB / 8GB        1.72%   180KB / 140KB
smartbuy-cart-service   0.7%    124MB / 8GB        1.55%   120KB / 90KB
smartbuy-order-service  0.6%    118MB / 8GB        1.47%   100KB / 80KB
smartbuy-payment-svc    0.5%    112MB / 8GB        1.40%   85KB / 70KB
smartbuy-user-manager   0.8%    145MB / 8GB        1.81%   95KB / 75KB
smartbuy-product-mgr    1.1%    151MB / 8GB        1.88%   110KB / 88KB
smartbuy-order-manager  0.9%    148MB / 8GB        1.85%   105KB / 82KB
smartbuy-review-svc     0.6%    115MB / 8GB        1.43%   78KB / 65KB
smartbuy-client         0.1%    28MB / 8GB         0.35%   2MB / 1.5MB

TOTAL:                  ~13%    ~2.16GB / 8GB      27%     4.5MB / 3.3MB
```

**Giải thích:**
- **CPU:** ~13% khi idle (không có traffic) - rất thấp!
- **RAM:** ~2.16GB / 12 containers = ~180MB/container average
- **Network:** Internal Docker network rất nhanh (< 1ms latency)

**So sánh với không dùng Docker:**
- Mỗi Node.js process: ~150-200MB
- 11 services × 200MB = ~2.2GB (tương đương!)
- **Kết luận:** Docker **KHÔNG** làm tăng RAM usage đáng kể

## 🚀 Kết Luận

### Docker giải quyết những vấn đề gì?

1. **"Works on my machine"** → Môi trường nhất quán
2. **Dependency hell** → Mỗi container độc lập
3. **Complex setup** → 1 lệnh deploy tất cả
4. **Scaling** → `docker-compose up --scale service=5`
5. **Deployment** → Build once, run anywhere (local/cloud)

### Khi nào NÊN dùng Docker?

✅ Microservices architecture (như SmartBuy)  
✅ Nhiều services phụ thuộc nhau  
✅ Cần deploy lên cloud (AWS/Azure/GCP)  
✅ Team collaboration (môi trường dev giống nhau)  
✅ CI/CD pipelines  

### Khi nào KHÔNG cần Docker?

❌ App đơn giản 1 file (vd: script Python nhỏ)  
❌ Desktop app (Electron, WPF...)  
❌ Legacy app không thể containerize  
❌ Môi trường dev cá nhân, không deploy  

---

**🎉 Chúc mừng! Bạn đã hiểu Docker hoạt động như thế nào!**

Tham khảo thêm:
- `DOCKER.md` - Hướng dẫn chi tiết
- `DOCKER-ARCHITECTURE.md` - Kiến trúc hệ thống
- `DOCKER-TEST.md` - Test cases
