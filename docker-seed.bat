@echo off
REM ========================================
REM SmartBuy - Seed Database Script
REM ========================================
echo.
echo ╔════════════════════════════════════════╗
echo ║  SmartBuy Database Seeding Tool       ║
echo ╚════════════════════════════════════════╝
echo.

echo 📊 Kiểm tra trạng thái containers...
docker-compose ps

echo.
echo 🌱 Bắt đầu seed database...
echo.

REM Seed Products Database
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 📦 [1/3] Seeding Products Database...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
docker-compose exec product-manager node scripts/seed-docker.js
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Lỗi khi seed products!
    pause
    exit /b 1
)
echo ✅ Products seeded successfully!
echo.

REM Seed Users Database (nếu có)
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 👥 [2/3] Seeding Users Database...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo (Tạo admin user mặc định: admin@smartbuy.vn / admin123)
REM Thêm lệnh seed users nếu có script
echo ⚠️  Chưa có seed script cho users
echo.

REM Seed Reviews Database (nếu có)
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo ⭐ [3/3] Seeding Reviews Database...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
docker-compose exec review-service node seed.js
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Review service seed bị lỗi hoặc chưa có data
)
echo.

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo ✅ Database Seeding HOÀN TẤT!
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 📋 Kiểm tra kết quả:
docker-compose exec mongodb mongosh "mongodb://admin:smartbuy123@localhost:27017/smartbuy_db_product?authSource=admin" --quiet --eval "db.products.countDocuments()"
echo.
echo 🌐 Truy cập website: http://localhost:8080
echo 🔌 API Gateway: http://localhost:3000
echo.
pause
