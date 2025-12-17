# 🚀 SmartBuy Docker Quick Commands

## Khởi động nhanh

```bash
# Windows - Double click file này
docker-start.bat

# Hoặc dùng lệnh
docker-compose up -d
```

## Các lệnh thường dùng

### Quản lý services

```bash
# Khởi động tất cả
docker-compose up -d

# Khởi động development mode
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# Dừng tất cả
docker-compose down

# Khởi động lại
docker-compose restart

# Khởi động lại 1 service
docker-compose restart order-manager
```

### Xem logs

```bash
# Tất cả logs
docker-compose logs -f

# 1 service cụ thể
docker-compose logs -f order-manager

# 100 dòng cuối
docker-compose logs --tail=100 api-gateway
```

### Kiểm tra trạng thái

```bash
# Danh sách services đang chạy
docker-compose ps

# Chi tiết resources
docker stats
```

### Rebuild sau khi sửa code

```bash
# Rebuild 1 service
docker-compose up -d --build order-manager

# Rebuild tất cả
docker-compose up -d --build

# Rebuild from scratch (xóa cache)
docker-compose build --no-cache
```

### Truy cập vào container

```bash
# Vào MongoDB shell
docker-compose exec mongodb mongosh -u admin -p smartbuy123

# Vào shell của service
docker-compose exec order-manager sh

# Chạy lệnh trong container
docker-compose exec order-manager node -v
```

### Backup & Restore

```bash
# Backup MongoDB
docker-compose exec mongodb mongodump --username admin --password smartbuy123 --authenticationDatabase admin --out /data/backup

# Restore MongoDB
docker-compose exec mongodb mongorestore --username admin --password smartbuy123 --authenticationDatabase admin /data/backup
```

### Debug

```bash
# Xem logs error
docker-compose logs --tail=50 order-manager | findstr "ERROR"

# Kiểm tra health
curl http://localhost:5003/health

# Xem network
docker network ls
docker network inspect smartbuy-network
```

### Dọn dẹp

```bash
# Xóa containers & networks (giữ volumes)
docker-compose down

# Xóa cả data (⚠️ CẢNH BÁO: Mất hết dữ liệu!)
docker-compose down -v

# Xóa images không dùng
docker image prune -a

# Xóa tất cả (hệ thống sạch)
docker system prune -a --volumes
```

## URLs truy cập

- **Frontend**: http://localhost
- **API Gateway**: http://localhost:3000
- **User Manager**: http://localhost:3006
- **Product Manager**: http://localhost:5002
- **Order Manager**: http://localhost:5003
- **Review Service**: http://localhost:5006
- **Cart Service**: http://localhost:5004
- **Payment Service**: http://localhost:5005
- **MongoDB**: mongodb://admin:smartbuy123@localhost:27017

## Troubleshooting

### Service không start được

```bash
# Xem logs chi tiết
docker-compose logs service-name

# Rebuild service
docker-compose build --no-cache service-name
docker-compose up -d service-name
```

### Port bị chiếm

```bash
# Windows - Tìm process
netstat -ano | findstr :3000

# Kill process
taskkill /PID <process_id> /F
```

### Hết disk space

```bash
# Xóa images cũ
docker image prune -a

# Xóa volumes không dùng
docker volume prune

# Xóa tất cả
docker system prune -a --volumes
```

### MongoDB không connect được

```bash
# Check logs
docker-compose logs mongodb

# Restart
docker-compose restart mongodb

# Test connection
docker-compose exec mongodb mongosh -u admin -p smartbuy123 --eval "db.adminCommand('ping')"
```

## Performance Tips

### Tăng RAM cho Docker

- Docker Desktop > Settings > Resources > Memory
- Đề xuất: Tối thiểu 4GB

### Tăng tốc build

```bash
# Enable BuildKit
set DOCKER_BUILDKIT=1
set COMPOSE_DOCKER_CLI_BUILD=1

docker-compose build
```

### Monitor resources

```bash
# Real-time stats
docker stats

# Xem disk usage
docker system df
```

## Production Checklist

- [ ] Đổi `MONGO_ROOT_PASSWORD` trong `.env`
- [ ] Tạo JWT secret mạnh: `openssl rand -base64 64`
- [ ] Cấu hình email credentials
- [ ] Cấu hình payment gateway keys
- [ ] Enable HTTPS
- [ ] Setup backup tự động
- [ ] Configure firewall
- [ ] Enable monitoring (Prometheus/Grafana)
- [ ] Setup log aggregation
- [ ] Test disaster recovery

---

**Need help?** Check `DOCKER.md` for detailed documentation.
