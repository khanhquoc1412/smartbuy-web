# 🐳 Hướng Dẫn Chạy SmartBuy với Docker

## 📋 Yêu Cầu

- ✅ Docker Desktop đã cài đặt
- ✅ WSL2 Ubuntu 22.04 đã cài đặt
- ✅ Git đã cài đặt

## 🚀 Cách Chạy

### 1️⃣ Khởi động tất cả services

```bash
# Build và chạy tất cả containers
docker-compose up --build

# Hoặc chạy ở chế độ background (detached)
docker-compose up -d --build
```

### 2️⃣ Truy cập ứng dụng

- **Frontend (Client)**: http://localhost
- **API Gateway**: http://localhost:3000
- **MongoDB**: localhost:27017

### 3️⃣ Kiểm tra trạng thái containers

```bash
# Xem danh sách containers đang chạy
docker-compose ps

# Xem logs của tất cả services
docker-compose logs

# Xem logs của một service cụ thể
docker-compose logs -f client
docker-compose logs -f api-gateway
docker-compose logs -f mongodb
```

### 4️⃣ Dừng ứng dụng

```bash
# Dừng tất cả containers (giữ lại data)
docker-compose stop

# Dừng và xóa containers (giữ lại volumes)
docker-compose down

# Dừng và xóa tất cả (bao gồm volumes - XÓA DATA)
docker-compose down -v
```

## 📦 Danh Sách Services

| Service           | Port  | Container Name           | Mô Tả                       |
| ----------------- | ----- | ------------------------ | --------------------------- |
| MongoDB           | 27017 | smartbuy-mongodb         | Database                    |
| API Gateway       | 3000  | smartbuy-api-gateway     | API Gateway (TypeScript)    |
| Product Service   | 3001  | smartbuy-productservice  | Quản lý sản phẩm (legacy)   |
| Product Manager   | 5002  | smartbuy-product-manager | Quản lý sản phẩm mới        |
| Order Service     | 3002  | smartbuy-orderservice    | Quản lý đơn hàng (legacy)   |
| Order Manager     | 5003  | smartbuy-order-manager   | Quản lý đơn hàng mới        |
| Cart Service      | 3003  | smartbuy-cartservice     | Quản lý giỏ hàng            |
| Payment Service   | 3004  | smartbuy-paymentservice  | Thanh toán                  |
| User Service      | 3005  | smartbuy-userservice     | Quản lý người dùng (legacy) |
| User Manager      | 3006  | smartbuy-user-manager    | Quản lý người dùng mới      |
| Review Service    | 5006  | smartbuy-review-service  | Đánh giá sản phẩm           |
| Chatbox Service   | 5008  | smartbuy-chatbox-service | Chatbot hỗ trợ              |
| Client (Frontend) | 80    | smartbuy-client          | Vue.js Frontend             |

## 🔧 Quản Lý Services

### Khởi động lại một service cụ thể

```bash
docker-compose restart api-gateway
docker-compose restart client
```

### Rebuild một service cụ thể

```bash
docker-compose up -d --build api-gateway
docker-compose up -d --build client
```

### Xem logs realtime của một service

```bash
docker-compose logs -f api-gateway
docker-compose logs -f mongodb
```

### Truy cập vào container để debug

```bash
# Truy cập vào container
docker-compose exec api-gateway sh
docker-compose exec mongodb mongosh

# Chạy lệnh trong container
docker-compose exec api-gateway npm list
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"
```

## 🗄️ Quản Lý Database

### Kết nối MongoDB

```bash
# Kết nối vào MongoDB container
docker-compose exec mongodb mongosh -u admin -p smartbuy123 --authenticationDatabase admin

# Hoặc từ host machine (nếu đã cài MongoDB client)
mongosh mongodb://admin:smartbuy123@localhost:27017/smartbuy?authSource=admin
```

### Backup Database

```bash
# Backup
docker-compose exec mongodb mongodump --uri="mongodb://admin:smartbuy123@localhost:27017/smartbuy?authSource=admin" --out=/dump

# Copy backup ra host machine
docker cp smartbuy-mongodb:/dump ./mongodb-backup
```

### Restore Database

```bash
# Copy backup vào container
docker cp ./mongodb-backup smartbuy-mongodb:/dump

# Restore
docker-compose exec mongodb mongorestore --uri="mongodb://admin:smartbuy123@localhost:27017/smartbuy?authSource=admin" /dump/smartbuy
```

## 🔍 Debug & Troubleshooting

### Kiểm tra tài nguyên sử dụng

```bash
# Xem CPU, Memory usage
docker stats

# Xem disk space
docker system df
```

### Dọn dẹp Docker

```bash
# Xóa containers đã dừng
docker container prune

# Xóa images không dùng
docker image prune -a

# Xóa volumes không dùng
docker volume prune

# Xóa tất cả (CẢNH BÁO: Xóa hết data)
docker system prune -a --volumes
```

### Kiểm tra health của services

```bash
# Kiểm tra MongoDB health
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"

# Kiểm tra API Gateway
curl http://localhost:3000/health

# Kiểm tra Client
curl http://localhost
```

## 📝 Lưu Ý Quan Trọng

### 1. Cấu hình môi trường (.env files)

Đảm bảo các file `.env` đã được tạo trong mỗi service:

```bash
# API Gateway
server/api-gateway/.env

# Các services khác
server/cartservice/.env
server/orderservice/.env
server/paymentservice/.env
server/productservice/.env
server/userservice/.env
server/product-manager-service/.env
server/order-manager-service/.env
server/user-manager-service/.env
server/review-service/.env
server/chatbox-service/.env
```

**Template .env mẫu:**

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://admin:smartbuy123@mongodb:27017/smartbuy?authSource=admin
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
```

### 2. Thay đổi mật khẩu MongoDB

Trong file `docker-compose.yml`, thay đổi:

```yaml
environment:
  MONGO_INITDB_ROOT_USERNAME: admin
  MONGO_INITDB_ROOT_PASSWORD: smartbuy123 # ĐỔI MẬT KHẨU NÀY
```

### 3. Production Deployment

Khi deploy lên production, cần:

- ✅ Đổi mật khẩu MongoDB
- ✅ Cấu hình HTTPS/SSL cho nginx
- ✅ Sử dụng Docker Secrets cho sensitive data
- ✅ Cấu hình firewall và security groups
- ✅ Setup monitoring và logging
- ✅ Backup database định kỳ

## 🎯 Development Workflow

### Chạy một phần services để dev

```bash
# Chỉ chạy database và một vài services cần thiết
docker-compose up -d mongodb api-gateway client

# Dev các services khác ở local
cd server/productservice
npm run dev
```

### Hot reload trong Docker

Nếu muốn hot reload trong Docker, mount source code:

```yaml
# Thêm vào docker-compose.yml trong service cần dev
volumes:
  - ./server/api-gateway:/app
  - /app/node_modules # Không overwrite node_modules
```

## 📊 Monitoring

### Xem logs tổng hợp

```bash
# Tất cả logs
docker-compose logs --tail=100 -f

# Chỉ errors
docker-compose logs | grep -i error

# Logs của services backend
docker-compose logs -f api-gateway product-manager order-manager
```

## 🆘 Common Issues

### Issue 1: Port đã được sử dụng

```bash
# Tìm process đang dùng port
netstat -ano | findstr :3000

# Kill process (Windows)
taskkill /PID <PID> /F
```

### Issue 2: Lỗi kết nối MongoDB

- Kiểm tra MongoDB container đã chạy: `docker-compose ps`
- Kiểm tra logs: `docker-compose logs mongodb`
- Restart MongoDB: `docker-compose restart mongodb`

### Issue 3: Build lỗi do thiếu dependencies

```bash
# Rebuild từ đầu, không dùng cache
docker-compose build --no-cache

# Xóa tất cả và rebuild
docker-compose down
docker-compose up --build --force-recreate
```

### Issue 4: WSL2 hết dung lượng

```bash
# Kiểm tra disk usage trong WSL2
wsl -d Ubuntu-22.04 -e df -h

# Dọn dẹp Docker trong WSL2
wsl -d Ubuntu-22.04 -e docker system prune -a --volumes
```

## 🔐 Security Checklist

- [ ] Đổi mật khẩu MongoDB mặc định
- [ ] Thêm JWT_SECRET vào .env
- [ ] Không commit file .env lên Git
- [ ] Sử dụng HTTPS trong production
- [ ] Giới hạn CORS origins
- [ ] Enable rate limiting
- [ ] Setup firewall rules
- [ ] Regular security updates

## 📚 Tài Liệu Tham Khảo

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MongoDB Docker](https://hub.docker.com/_/mongo)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

**Chúc bạn deploy thành công! 🎉**

Nếu gặp vấn đề, hãy kiểm tra logs: `docker-compose logs -f`
