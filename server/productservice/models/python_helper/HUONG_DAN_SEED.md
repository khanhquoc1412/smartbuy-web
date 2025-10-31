# 🌱 HƯỚNG DẪN SEED DỮ LIỆU SẢN PHẨM

## 📋 Yêu cầu

- ✅ Node.js đã cài đặt
- ✅ MongoDB đang chạy (local hoặc cloud)
- ✅ File `seed_data_complete.json` đã được tạo (✅ Đã có)
- ✅ Dependencies đã cài đặt (`npm install`)

## 📁 Cấu trúc file

```
server/productservice/models/
├── seed_data_complete.json      ← File dữ liệu (47 sản phẩm)
├── seed_complete.js              ← Script seed
├── category.js                   ← Model Category
├── brand.js                      ← Model Brand
├── product.js                    ← Model Product
├── color.js                      ← Model Color
├── memory.js                     ← Model Memory
├── specification.js              ← Model Specification
├── product_variant.js            ← Model ProductVariant
├── product_image.js              ← Model ProductImage
└── product_specification.js      ← Model ProductSpecification
```

## 🔧 Bước 1: Cấu hình MongoDB URI

### Option 1: Sử dụng file .env (Khuyến nghị)

Tạo hoặc chỉnh sửa file `.env` trong thư mục `server/productservice/`:

```env
MONGO_URI=mongodb://localhost:27017/smartbuy_db_product
```

Hoặc nếu dùng MongoDB Atlas:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/smartbuy_db_product
```

### Option 2: Sửa trực tiếp trong code

Mở file `seed_complete.js` và sửa dòng:

```javascript
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/smartbuy_db_product";
```

## 🚀 Bước 2: Chạy script seed

### Cách 1: Chạy từ thư mục models

```powershell
cd "d:\Luận văn chuyên nghành 2025-2026\Smartbuy-web-ori\smartbuy-web\server\productservice\models"
node seed_complete.js
```

### Cách 2: Chạy từ thư mục productservice

```powershell
cd "d:\Luận văn chuyên nghành 2025-2026\Smartbuy-web-ori\smartbuy-web\server\productservice"
node models/seed_complete.js
```

## 📊 Output mong đợi

Khi chạy thành công, bạn sẽ thấy:

```
🚀 BẮT ĐẦU SEED DỮ LIỆU TỪ seed_data_complete.json
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔗 Đang kết nối tới MongoDB...
✅ MongoDB connected successfully!
📖 Đang đọc file: d:\...\seed_data_complete.json
✅ Đã đọc file JSON thành công!
📊 Tổng quan dữ liệu:
   - Categories: 1
   - Brands: 7
   - Colors: 17
   - Memories: 14
   - Products: 47

🧹 Đang xóa dữ liệu cũ...
✅ Đã xóa dữ liệu cũ thành công!

🌱 Đang seed dữ liệu cơ bản...
1️⃣  Seeding Categories...
   ✅ Đã seed 1 categories
2️⃣  Seeding Brands...
   ✅ Đã seed 7 brands
3️⃣  Seeding Specifications...
   ✅ Đã seed 6 specifications
4️⃣  Seeding Colors...
   ✅ Đã seed 17 colors
5️⃣  Seeding Memories...
   ✅ Đã seed 14 memories

🔄 Đang tạo mapping ID...
✅ Đã tạo mapping ID thành công!

📱 Đang seed sản phẩm và quan hệ...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ [1/47] iPhone 15 (Apple)
✅ [2/47] iPhone 16 (Apple)
✅ [3/47] iPhone 16 Pro Max (Apple)
...
✅ [47/47] HONOR X8c (HONOR)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 HOÀN THÀNH SEED DỮ LIỆU!
📊 THỐNG KÊ:
   ✅ Thành công: 47 sản phẩm
   ❌ Lỗi: 0 sản phẩm
   📦 Tổng cộng: 47 sản phẩm

📊 CHI TIẾT THEO THƯƠNG HIỆU:
   • Apple: 8 sản phẩm
   • Samsung: 8 sản phẩm
   • Xiaomi: 8 sản phẩm
   • OPPO: 7 sản phẩm
   • Vivo: 6 sản phẩm
   • Realme: 6 sản phẩm
   • HONOR: 4 sản phẩm

✅ Data Imported Successfully!
```

## 🔍 Bước 3: Kiểm tra dữ liệu đã seed

### Option 1: Sử dụng MongoDB Compass

1. Mở MongoDB Compass
2. Kết nối tới `mongodb://localhost:27017`
3. Chọn database `smartbuy_db_product`
4. Kiểm tra các collection:
   - `categories` (1 document)
   - `brands` (7 documents)
   - `products` (47 documents)
   - `colors` (17 documents)
   - `memories` (14 documents)
   - `specifications` (6 documents)
   - `productvariants` (~100+ documents)
   - `productimages` (~589 documents)
   - `productspecifications` (~282 documents)

### Option 2: Sử dụng MongoDB Shell

```bash
mongosh
use smartbuy_db_product
db.products.countDocuments()  # Kết quả: 47
db.brands.find()              # Xem danh sách brands
db.products.find({ brand: ObjectId("...") })  # Tìm sản phẩm theo brand
```

### Option 3: Sử dụng API

Sau khi seed xong, start server và gọi API:

```bash
GET http://localhost:3000/api/products
GET http://localhost:3000/api/brands
GET http://localhost:3000/api/products?brand=Apple
```

## ❓ Xử lý lỗi thường gặp

### Lỗi 1: Cannot find module

```
Error: Cannot find module './category'
```

**Giải pháp:** Đảm bảo bạn đang chạy từ đúng thư mục:

```powershell
cd "d:\Luận văn chuyên nghành 2025-2026\Smartbuy-web-ori\smartbuy-web\server\productservice\models"
node seed_complete.js
```

### Lỗi 2: MongoDB connection failed

```
MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017
```

**Giải pháp:**

1. Kiểm tra MongoDB đang chạy:

```powershell
# Windows - kiểm tra service MongoDB
Get-Service -Name MongoDB

# Hoặc start MongoDB
net start MongoDB
```

2. Nếu dùng MongoDB Atlas, kiểm tra connection string trong file `.env`

### Lỗi 3: Duplicate key error

```
MongoServerError: E11000 duplicate key error
```

**Giải pháp:** Script đã tự động xóa dữ liệu cũ. Nếu vẫn lỗi, xóa thủ công:

```javascript
// Trong MongoDB Shell
use smartbuy_db_product
db.dropDatabase()
```

Sau đó chạy lại script seed.

### Lỗi 4: File không tồn tại

```
Error: ENOENT: no such file or directory, open '...\seed_data_complete.json'
```

**Giải pháp:** Kiểm tra file `seed_data_complete.json` có trong thư mục `models/` không:

```powershell
ls "d:\Luận văn chuyên nghành 2025-2026\Smartbuy-web-ori\smartbuy-web\server\productservice\models\seed_data_complete.json"
```

## 📝 Lưu ý

- ⚠️ Script sẽ **XÓA TẤT CẢ** dữ liệu cũ trước khi seed
- 💾 Nên backup database trước khi chạy nếu có dữ liệu quan trọng
- 🔄 Có thể chạy lại script bao nhiêu lần cũng được (idempotent)
- 📊 Script sẽ tạo ~1000+ documents tổng cộng trong các collections

## 🎯 Kết quả sau khi seed

Bạn sẽ có:

- ✅ 1 Category: Điện thoại
- ✅ 7 Brands: Apple, Samsung, Xiaomi, OPPO, Vivo, Realme, HONOR
- ✅ 47 Products với đầy đủ thông tin
- ✅ ~589 Product Images
- ✅ ~100+ Product Variants (color + memory combinations)
- ✅ ~282 Product Specifications
- ✅ 17 Colors
- ✅ 14 Memory configurations
- ✅ 6 Specification types

## 🚀 Bước tiếp theo

Sau khi seed thành công:

1. ✅ Start product service:

```powershell
cd server/productservice
npm run dev
```

2. ✅ Test API endpoints:

```bash
GET /api/products          # Lấy danh sách sản phẩm
GET /api/brands            # Lấy danh sách thương hiệu
GET /api/products/:id      # Chi tiết sản phẩm
```

3. ✅ Kiểm tra frontend:

```powershell
cd client
npm run dev
```

Truy cập `http://localhost:5173` và xem danh sách sản phẩm!

## 📞 Hỗ trợ

Nếu gặp vấn đề, kiểm tra:

- ✅ MongoDB đang chạy
- ✅ Dependencies đã cài đặt (`npm install`)
- ✅ File paths chính xác
- ✅ Connection string đúng

---

**Chúc may mắn! 🎉**
