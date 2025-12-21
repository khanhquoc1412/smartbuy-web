# 🧪 SmartBuy Docker Testing Guide

## Pre-flight Checklist

### 1. Verify Docker Installation

```powershell
# Check Docker version
docker --version
docker-compose --version

# Check Docker is running
docker info
```

Expected output:
- Docker version 24.0+ or higher
- Docker Compose version 2.0+ or higher

### 2. Verify File Structure

All services should have:
- ✅ `Dockerfile`
- ✅ `.dockerignore`
- ✅ `package.json`

```powershell
# Check Dockerfiles exist
dir server\*\Dockerfile
dir client\Dockerfile

# Check .dockerignore exists
dir server\*\.dockerignore
dir client\.dockerignore
```

## 🚀 Test Deployment

### Step 1: Create .env File

```powershell
cd "D:\LV chuyên nghành 2025\smartbuy-web"

# Copy template
copy .env.example .env

# Edit with your credentials
notepad .env
```

**Minimum required settings:**
```env
MONGO_ROOT_PASSWORD=smartbuy123
JWT_SECRET=your-secret-key-min-32-characters-long
```

### Step 2: Build Images

```powershell
# Build all images (takes 5-10 minutes first time)
docker-compose build

# Or build specific service
docker-compose build order-manager
```

**Expected output:**
```
Building api-gateway
Building user-manager
Building product-manager
Building order-manager
Building review-service
Building cart-service
Building payment-service
Building client
Successfully built
Successfully tagged
```

### Step 3: Start Services

```powershell
# Start all services in background
docker-compose up -d
```

**Expected output:**
```
Creating network "smartbuy-network"
Creating volume "smartbuy_mongodb_data"
Creating smartbuy-mongodb
Creating smartbuy-user-manager
Creating smartbuy-product-manager
Creating smartbuy-order-manager
Creating smartbuy-review-service
Creating smartbuy-cart-service
Creating smartbuy-payment-service
Creating smartbuy-api-gateway
Creating smartbuy-client
```

### Step 4: Verify Services are Running

```powershell
# Check status
docker-compose ps
```

**Expected output - All should be "Up":**
```
NAME                         STATUS          PORTS
smartbuy-mongodb            Up (healthy)    0.0.0.0:27017->27017/tcp
smartbuy-api-gateway        Up (healthy)    0.0.0.0:3000->3000/tcp
smartbuy-user-manager       Up              0.0.0.0:3006->3006/tcp
smartbuy-product-manager    Up              0.0.0.0:5002->5002/tcp
smartbuy-order-manager      Up              0.0.0.0:5003->5003/tcp
smartbuy-review-service     Up              0.0.0.0:5006->5006/tcp
smartbuy-cart-service       Up              0.0.0.0:5004->5004/tcp
smartbuy-payment-service    Up              0.0.0.0:5005->5005/tcp
smartbuy-client             Up (healthy)    0.0.0.0:80->80/tcp
```

### Step 5: Test Health Endpoints

```powershell
# Test each service
curl http://localhost:3000/health
curl http://localhost:5002/health
curl http://localhost:5003/health
curl http://localhost:5006/health
curl http://localhost:3006/health
```

**Expected response from each:**
```json
{
  "status": "healthy",
  "service": "service-name",
  "timestamp": "2025-12-04T..."
}
```

### Step 6: Test Frontend

Open browser and navigate to:
- http://localhost

**Expected:**
- ✅ Page loads without errors
- ✅ Can see products
- ✅ Can register/login
- ✅ Can add to cart

### Step 7: Test API Gateway

```powershell
# Test API endpoints
curl http://localhost:3000/api/products
curl http://localhost:3000/api/orders/stats
```

## 🔍 Troubleshooting

### Problem: Service won't start

```powershell
# Check logs
docker-compose logs service-name

# Common issues:
# 1. Port already in use
netstat -ano | findstr :5003
taskkill /PID <pid> /F

# 2. MongoDB not ready
docker-compose restart mongodb
sleep 10
docker-compose restart order-manager
```

### Problem: "Cannot connect to MongoDB"

```powershell
# Check MongoDB is healthy
docker-compose ps mongodb

# Should show: Up (healthy)
# If not, check logs:
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

### Problem: Build fails with "ENOENT" or file not found

```powershell
# Clean and rebuild
docker-compose down
docker-compose build --no-cache service-name
docker-compose up -d
```

### Problem: Port conflicts

**Error:** "Bind for 0.0.0.0:5003 failed: port is already allocated"

**Solution:**
```powershell
# Find process using the port
netstat -ano | findstr :5003

# Kill the process
taskkill /PID <process_id> /F

# Or change port in docker-compose.yml:
# ports:
#   - "15003:5003"  # Use different external port
```

### Problem: Service crashes immediately

```powershell
# View crash logs
docker-compose logs --tail=50 service-name

# Common causes:
# 1. Missing environment variables
# 2. Wrong MongoDB connection string
# 3. Missing dependencies
```

## 🧹 Cleanup

### Remove all containers and networks

```powershell
docker-compose down
```

### Remove all data (⚠️ WARNING: Deletes database!)

```powershell
docker-compose down -v
```

### Remove all images

```powershell
docker-compose down --rmi all
```

### Full cleanup

```powershell
docker-compose down -v --rmi all
docker system prune -a -f
```

## 📊 Monitoring

### View logs

```powershell
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f order-manager

# Last 100 lines
docker-compose logs --tail=100 api-gateway
```

### Check resource usage

```powershell
docker stats
```

### Execute commands in container

```powershell
# Open shell
docker-compose exec order-manager sh

# Run Node command
docker-compose exec order-manager node --version

# Check environment
docker-compose exec order-manager env
```

## ✅ Success Criteria

Your Docker deployment is successful when:

1. ✅ All services show "Up" status
2. ✅ All health checks pass (mongodb, api-gateway, client)
3. ✅ Frontend loads at http://localhost
4. ✅ API responds at http://localhost:3000
5. ✅ No error logs in `docker-compose logs`
6. ✅ Can perform CRUD operations (create user, add product, place order)

## 📝 Performance Benchmarks

**First build:** 5-10 minutes  
**Subsequent builds:** 1-2 minutes (with cache)  
**Startup time:** 30-60 seconds  
**Memory usage:** ~2-3GB total  

## 🎯 Next Steps After Successful Test

1. Set up proper `.env` with production credentials
2. Configure SSL certificates for HTTPS
3. Set up backup automation
4. Configure monitoring (Prometheus/Grafana)
5. Deploy to cloud (AWS/Azure/GCP)

---

**If all tests pass, your Docker setup is ready! 🎉**
