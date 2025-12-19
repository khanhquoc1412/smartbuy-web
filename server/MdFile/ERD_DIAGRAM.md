# 📊 SƠ ĐỒ ERD - SMARTBUY E-COMMERCE SYSTEM

> **Hệ thống quản lý bán hàng điện thoại trực tuyến - Kiến trúc Microservices**

---

## 🗂️ TỔNG QUAN CÁC DATABASE

```mermaid
graph LR
    A[User Service DB] --> |userId| B[Cart Service DB]
    A --> |userId| C[Order Service DB]
    A --> |userId| D[Payment Service DB]
    A --> |userId| E[Review Service DB]
    
    F[Product Service DB] --> |productId| B
    F --> |productId| C
    F --> |productId| E
    F --> |productId| A
    
    C --> |orderId| D
    
    style A fill:#e1f5fe
    style B fill:#fff3e0
    style C fill:#c8e6c9
    style D fill:#f8bbd0
    style E fill:#e1bee7
    style F fill:#fff9c4
```

---

## 📐 SƠ ĐỒ ERD CHI TIẾT - CHIA THEO DOMAIN

> MongoDB là NoSQL nên không có foreign key constraints thực sự, nhưng các collections liên kết với nhau thông qua **ObjectId references**. Dưới đây là sơ đồ ERD chia theo từng domain để dễ hiểu.

---

### 🔵 **3.2.1.1. Tài khoản người dùng - Địa chỉ - Giỏ hàng**

```mermaid
erDiagram
    User ||--o{ Address : "has many"
    User ||--o| Wishlist : "has one"
    User ||--o{ Cart : "has many"
    User ||--o{ PendingUpdate : "has OTP verification"
    
    User {
        ObjectId _id PK
        string userName
        string email UK "unique"
        string password "hashed"
        string avatarUrl
        boolean isAdmin
        boolean isVerified
        boolean isBlocked
        string refreshToken
        date verifiedDate
        string verificationToken
        date verificationExpires
        string passwordToken
        date passwordTokenExpire
        date createdAt
        date updatedAt
    }
    
    Address {
        ObjectId _id PK
        ObjectId userId FK
        string label "Nhà riêng, Văn phòng"
        string fullName
        string phone
        string province
        string district
        string ward
        string address
        boolean isDefault
        date createdAt
        date updatedAt
    }
    
    Wishlist {
        ObjectId _id PK
        ObjectId userId FK "unique, indexed"
        array items "embedded WishlistItem"
        date createdAt
        date updatedAt
    }
    
    WishlistItem {
        ObjectId product FK
        string variantId "optional"
        string colorId "optional"
        string memoryId "optional"
        date addedAt
    }
    
    Wishlist ||--o{ WishlistItem : "contains"
    WishlistItem }o--|| Product : "references"
    
    PendingUpdate {
        ObjectId _id PK
        ObjectId userId FK
        string type "email, phone, password"
        string otp "6-digit code"
        date expiresAt "TTL index"
        object data "dynamic update data"
        date createdAt
    }
    
    Cart {
        ObjectId _id PK
        ObjectId userId FK "indexed"
        array items "embedded CartItem"
        number subtotal
        number discount
        number total
        string couponCode
        number itemCount
        string status "active, ordered, expired"
        date expiresAt
        date createdAt
        date updatedAt
    }
    
    CartItem {
        ObjectId _id
        ObjectId productId "reference to Product"
        string variantId "reference to ProductVariant"
        number quantity
        number price
        string name
        string image
        object color
        object memory
        date addedAt
    }
    
    Cart ||--o{ CartItem : "contains"
```

**Mô tả:** Domain này quản lý toàn bộ thông tin người dùng, địa chỉ giao hàng, danh sách yêu thích và giỏ hàng. User có thể có nhiều địa chỉ, một wishlist, và nhiều cart (nhưng chỉ 1 active cart).

---

### 🟢 **3.2.1.2. Sản phẩm - Danh mục - Thương hiệu**

```mermaid
erDiagram
    Product ||--o{ ProductVariant : "has many variants"
    Product }o--|| Brand : "belongs to"
    Product }o--|| Category : "belongs to"
    Product ||--o{ ProductImage : "has many images"
    
    ProductVariant }o--|| Color : "has one color"
    ProductVariant }o--|| Memory : "has one config"
    
    Product {
        ObjectId _id PK
        string name UK "unique"
        string description
        string thumbUrl
        number discountPercentage "0-100"
        string slug UK "unique, indexed"
        number basePrice
        ObjectId brand FK
        ObjectId category FK
        date createdAt
        date updatedAt
    }
    
    ProductVariant {
        ObjectId _id PK
        ObjectId productId FK "indexed"
        ObjectId colorId FK
        ObjectId memoryId FK
        number stock "inventory"
        number price
        date createdAt
        date updatedAt
    }
    
    Brand {
        ObjectId _id PK
        string name UK "unique"
        string nameAscii UK "unique"
        date createdAt
        date updatedAt
    }
    
    Category {
        ObjectId _id PK
        string name UK "unique"
        string nameAscii UK "unique"
        date createdAt
        date updatedAt
    }
    
    Color {
        ObjectId _id PK
        string name "Đen, Trắng, Xanh"
        string code "hex color code"
        date createdAt
        date updatedAt
    }
    
    Memory {
        ObjectId _id PK
        string ram "4GB, 8GB, 12GB"
        string rom "64GB, 128GB, 256GB"
        string chipset "Snapdragon, Apple A15"
        date createdAt
        date updatedAt
    }
    
    ProductImage {
        ObjectId _id PK
        ObjectId productId FK
        string url
        boolean isDefault
        number order
        date createdAt
    }
    
    Sizes {
        ObjectId _id PK
        string size "S, M, L, XL, XXL"
        date createdAt
    }
    
    Promotions {
        ObjectId _id PK
        ObjectId productId FK
        string code_name
        date created_at
        string description
        number discount_percentage
        date end_date
        boolean is_active
        date start_date
        date updated_at
    }
    
    Product ||--o{ Promotions : "has promotions"
```

**Mô tả:** Domain này quản lý tất cả thông tin sản phẩm, bao gồm danh mục, thương hiệu, màu sắc, cấu hình, ảnh và khuyến mãi. Mỗi Product có nhiều ProductVariant (biến thể), mỗi variant có color + memory riêng.

---

### 🟡 **3.2.1.3. Đơn hàng - Thanh toán - Đánh giá**

```mermaid
erDiagram
    Order ||--o{ OrderItem : "contains"
    Order ||--o{ StatusHistory : "tracks changes"
    Order ||--o| Payment : "has payment"
    Order ||--o{ Review : "customer reviews"
    
    Payment ||--o{ Transaction : "has transactions"
    
    Order {
        ObjectId _id PK
        ObjectId user "reference to User"
        array orderItems "embedded OrderItem"
        object shippingAddress "embedded Address snapshot"
        string paymentMethod "COD, VNPAY, MOMO"
        string paymentStatus "unpaid, pending, paid, refunded, failed"
        object paymentResult
        number itemsPrice
        number shippingPrice
        number taxPrice
        number discountAmount
        string couponCode
        number totalPrice
        string status "pending, processing, shipping, delivered, completed, cancelled"
        object shippingInfo
        string notes
        string adminNotes
        string cancelReason
        array statusHistory
        date createdAt
        date updatedAt
    }
    
    OrderItem {
        ObjectId product "reference to Product"
        string name "snapshot"
        string sku
        number qty
        number price "price at order time"
        string image
        object variant "color, memory, variantId"
    }
    
    StatusHistory {
        string status
        date timestamp
        ObjectId actor
        string note
    }
    
    Payment {
        ObjectId _id PK
        string orderId "reference to Order"
        string userId "reference to User"
        number amount
        string currency "VND, USD"
        string paymentMethod "COD, VNPAY, MOMO"
        string status "pending, paid, failed, refunded"
        string paymentUrl
        string transactionId
        string gateway
        string bankCode
        string responseCode
        date paidAt
        date expiredAt
        date createdAt
        date updatedAt
    }
    
    Transaction {
        ObjectId _id PK
        string paymentId FK
        string transactionId UK
        string gateway
        string bankCode
        string responseCode
        string status
        number amount
        object rawResponse
        date createdAt
    }
    
    Review {
        ObjectId _id PK
        string userId "reference to User"
        string productId "reference to Product"
        number rating "1-5"
        string comment
        string userName "snapshot"
        string productName "snapshot"
        array images
        number helpfulCount
        array helpfulBy
        boolean isVisible
        string hiddenReason
        date createdAt
        date updatedAt
    }
    
    Deliveries {
        ObjectId _id PK
        string orderId "reference to Order"
        string address
        string district
        date end_date
        string phone
        string province
        string recipient_name
        date start_date
        string street
        string ward
    }
    
    OrderStatus {
        ObjectId _id PK
        string code_name
        string name
    }
    
    Order }o--|| OrderStatus : "has status"
    Order ||--o| Deliveries : "has delivery info"
```

**Mô tả:** Domain này quản lý toàn bộ quy trình đặt hàng, từ tạo đơn, thanh toán, giao hàng đến đánh giá. Order chứa OrderItems (embedded), có Payment liên kết, và tracking qua StatusHistory.

---

## 📊 SƠ ĐỒ TỔNG QUAN - RELATIONSHIPS GIỮA CÁC DOMAIN

```mermaid
graph TB
    subgraph "👤 USER DOMAIN"
        U[User]
        A[Address]
        W[Wishlist]
        C[Cart]
    end
    
    subgraph "📦 PRODUCT DOMAIN"
        P[Product]
        PV[ProductVariant]
        B[Brand]
        CAT[Category]
        COL[Color]
        MEM[Memory]
    end
    
    subgraph "🛒 ORDER DOMAIN"
        O[Order]
        PAY[Payment]
        R[Review]
        D[Delivery]
    end
    
    U -->|userId| C
    U -->|userId| O
    U -->|userId| R
    
    P -->|productId| PV
    P -->|productId| C
    P -->|productId| O
    P -->|productId| R
    
    O -->|orderId| PAY
    O -->|orderId| D
    
    style U fill:#e1f5fe
    style P fill:#fff9c4
    style O fill:#c8e6c9
```

---

## 🔗 PHÂN NHÓM DATABASE THEO SERVICE

### 1️⃣ **USER SERVICE DATABASE**
**Collections:**
- ✅ `users` - Tài khoản người dùng
- ✅ `addresses` - Địa chỉ giao hàng
- ✅ `wishlists` - Danh sách yêu thích
- ✅ `pendingupdates` - OTP verification

**Relationships:**
```
User (1) ──→ (N) Address
User (1) ──→ (1) Wishlist
User (1) ──→ (N) PendingUpdate

Wishlist (1) ──→ (N) WishlistItem (embedded)
WishlistItem ──→ Product (reference - cross service)
```

**Indexes:**
- `users.email` (unique)
- `users.isAdmin` 
- `addresses.userId`
- `wishlists.userId` (unique)
- `pendingupdates.expiresAt` (TTL)

---

### 2️⃣ **PRODUCT SERVICE DATABASE**
**Collections:**
- ✅ `products` - Sản phẩm chính
- ✅ `productvariants` - Biến thể (màu + cấu hình)
- ✅ `brands` - Nhãn hiệu
- ✅ `categories` - Danh mục
- ✅ `colors` - Màu sắc
- ✅ `memories` - Cấu hình RAM/ROM
- ✅ `productimages` - Ảnh sản phẩm

**Relationships:**
```
Product (N) ──→ (1) Brand
Product (N) ──→ (1) Category
Product (1) ──→ (N) ProductVariant
Product (1) ──→ (N) ProductImage

ProductVariant (N) ──→ (1) Color
ProductVariant (N) ──→ (1) Memory
```

**Indexes:**
- `products.slug` (unique)
- `products.name` (unique)
- `products.brand`
- `products.category`
- `productvariants.productId`
- `brands.name` (unique)
- `categories.name` (unique)

---

### 3️⃣ **CART SERVICE DATABASE**
**Collections:**
- ✅ `carts` - Giỏ hàng

**Relationships:**
```
Cart (N) ──→ (1) User (reference - cross service)
Cart (1) ──→ (N) CartItem (embedded)

CartItem ──→ Product (reference - cross service)
CartItem ──→ ProductVariant (reference - cross service)
```

**Indexes:**
- `carts.userId` (unique for active status)
- `carts.status`
- `carts.expiresAt` (TTL)

**Embedded Structure:**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  items: [
    {
      _id: ObjectId,
      productId: ObjectId,
      variantId: String,
      quantity: Number,
      price: Number,
      name: String,
      image: String,
      color: { name, code },
      memory: { ram, rom }
    }
  ],
  subtotal: Number,
  total: Number,
  status: "active"
}
```

---

### 4️⃣ **ORDER SERVICE DATABASE**
**Collections:**
- ✅ `orders` - Đơn hàng

**Relationships:**
```
Order (N) ──→ (1) User (reference - cross service)
Order (1) ──→ (N) OrderItem (embedded)
Order (1) ──→ (N) StatusHistory (embedded)

OrderItem ──→ Product (reference - cross service)
Order copies Address data (embedded snapshot)
```

**Indexes:**
- `orders.user`
- `orders.status`
- `orders.paymentStatus`
- `orders.createdAt`

**Embedded Structure:**
```javascript
{
  _id: ObjectId,
  user: ObjectId,
  orderItems: [
    {
      product: ObjectId,
      name: String,
      qty: Number,
      price: Number,
      image: String,
      variant: { color, memory, variantId }
    }
  ],
  shippingAddress: {
    fullName, phone, province, district, ward, address
  },
  paymentMethod: "COD" | "VNPAY",
  status: "pending",
  statusHistory: [
    { status, timestamp, actor, note }
  ]
}
```

---

### 5️⃣ **PAYMENT SERVICE DATABASE**
**Collections:**
- ✅ `payments` - Thanh toán
- ✅ `transactions` - Giao dịch chi tiết

**Relationships:**
```
Payment (1) ──→ (1) Order (reference - cross service via orderId string)
Payment (N) ──→ (1) User (reference - cross service via userId string)
Payment (1) ──→ (N) Transaction
```

**Indexes:**
- `payments.orderId`
- `payments.userId`
- `payments.paymentMethod`
- `payments.status`
- `transactions.transactionId` (unique)
- `transactions.paymentId`

---

### 6️⃣ **REVIEW SERVICE DATABASE**
**Collections:**
- ✅ `reviews` - Đánh giá sản phẩm

**Relationships:**
```
Review (N) ──→ (1) User (reference - cross service via userId string)
Review (N) ──→ (1) Product (reference - cross service via productId string)
```

**Indexes:**
- `reviews.productId` + `createdAt` (compound)
- `reviews.userId`
- `reviews.rating`
- `reviews.isVisible`

---

## 🔄 CROSS-SERVICE REFERENCES

### **String References (Microservices Communication)**

```mermaid
graph TB
    subgraph "USER SERVICE"
        U[User ObjectId]
    end
    
    subgraph "PRODUCT SERVICE"
        P[Product ObjectId]
        PV[ProductVariant ObjectId]
    end
    
    subgraph "CART SERVICE"
        C[Cart]
        C -.userId String.-> U
        C -.productId String.-> P
        C -.variantId String.-> PV
    end
    
    subgraph "ORDER SERVICE"
        O[Order]
        O -.user ObjectId.-> U
        O -.product ObjectId.-> P
    end
    
    subgraph "PAYMENT SERVICE"
        PAY[Payment]
        PAY -.userId String.-> U
        PAY -.orderId String.-> O
    end
    
    subgraph "REVIEW SERVICE"
        R[Review]
        R -.userId String.-> U
        R -.productId String.-> P
    end
```

**Lý do dùng String thay vì ObjectId:**
- ✅ Services nằm ở databases khác nhau
- ✅ Không thể populate() cross-database
- ✅ Phải fetch qua REST API giữa các services
- ✅ Tránh tight coupling giữa services

---

## 📊 DATA FLOW CHÍNH

### **1. User Registration & Login**
```
User registers
→ Create User document
→ Send OTP (PendingUpdate document)
→ Verify OTP
→ Update User.isVerified = true
→ Generate JWT tokens
```

### **2. Shopping Cart Flow**
```
User browses products
→ Add to Cart (Cart + CartItem embedded)
→ Update quantity
→ Apply coupon (if any)
→ Calculate total
→ Proceed to checkout
```

### **3. Order & Payment Flow**
```
User submits order
→ Create Order from Cart items
→ Order.status = "pending"
→ Create Payment document
→ Redirect to payment gateway

Payment Success:
→ Payment gateway webhook
→ Update Payment.status = "paid"
→ Update Order.paymentStatus = "paid"
→ Update Order.status = "processing"
→ Reserve stock (ProductVariant.stock - qty)
→ Clear Cart items
→ Send email confirmation

Payment Failed:
→ Update Payment.status = "failed"
→ Update Order.status = "payment_failed"
→ Don't reserve stock
```

### **4. Order Processing Flow**
```
pending → confirmed (admin)
→ processing (preparing)
→ ready_to_ship (ready)
→ shipping (on delivery)
→ delivered (customer receives)
→ completed (customer confirms)

Each status change:
→ Add to Order.statusHistory[]
→ Send email/SMS notification
```

### **5. Review Flow**
```
Order.status = "completed"
→ User can write review
→ Create Review document
→ Upload images (optional)
→ Admin can hide/show reviews
→ Other users can like (helpfulCount++)
```

---

## 🎯 EMBEDDED vs REFERENCED

### **✅ EMBEDDED (Nhúng trong document)**
**Khi nào dùng:**
- Dữ liệu nhỏ, cố định
- Luôn query cùng parent
- Không cần query riêng
- One-to-few relationship

**Examples:**
```javascript
// Cart contains CartItems (embedded)
{
  _id: ObjectId("cart123"),
  userId: ObjectId("user456"),
  items: [
    { productId, quantity, price, name, image },
    { productId, quantity, price, name, image }
  ]
}

// Order contains OrderItems (embedded)
{
  _id: ObjectId("order789"),
  user: ObjectId("user456"),
  orderItems: [
    { product, name, qty, price, image }
  ],
  shippingAddress: { fullName, phone, address } // snapshot
}

// Wishlist contains WishlistItems (embedded)
{
  _id: ObjectId("wishlist999"),
  userId: ObjectId("user456"),
  items: [
    { product, variantId, addedAt }
  ]
}
```

### **✅ REFERENCED (Tham chiếu ObjectId)**
**Khi nào dùng:**
- Dữ liệu lớn, phức tạp
- Cần query riêng biệt
- Dùng chung nhiều nơi
- Tránh duplicate
- One-to-many, many-to-many

**Examples:**
```javascript
// Product references Brand
{
  _id: ObjectId("product123"),
  name: "iPhone 15 Pro Max",
  brand: ObjectId("brand456") // reference
}

// ProductVariant references Product, Color, Memory
{
  _id: ObjectId("variant789"),
  productId: ObjectId("product123"),
  colorId: ObjectId("color111"),
  memoryId: ObjectId("memory222"),
  stock: 50,
  price: 30000000
}

// Address references User
{
  _id: ObjectId("addr999"),
  userId: ObjectId("user456"),
  fullName: "Nguyễn Văn A",
  phone: "0909123456"
}
```

---

## 🚀 PERFORMANCE OPTIMIZATION

### **Indexes được tạo:**
```javascript
// User Service
users.email (unique)
users.isAdmin (boolean)
addresses.userId (reference)
wishlists.userId (unique)

// Product Service
products.slug (unique, text)
products.name (unique)
products.brand (reference)
products.category (reference)
productvariants.productId (reference)

// Cart Service
carts.userId (unique + status compound)
carts.status (enum)
carts.expiresAt (TTL index)

// Order Service
orders.user (reference)
orders.status (enum)
orders.paymentStatus (enum)
orders.createdAt (date, for sorting)

// Payment Service
payments.orderId (string reference)
payments.userId (string reference)
payments.status (enum)
transactions.transactionId (unique)

// Review Service
reviews.productId + createdAt (compound)
reviews.userId (string reference)
reviews.rating (number)
```

### **TTL Indexes (Auto-delete):**
```javascript
// Auto-delete expired OTP after 10 minutes
pendingupdates.expiresAt (TTL: 10 minutes)

// Auto-delete abandoned carts after 30 days
carts.expiresAt (TTL: 30 days for inactive)

// Auto-delete expired payment links after 15 minutes
payments.expiredAt (TTL: 15 minutes)
```

---

## 📝 NOTES & BEST PRACTICES

### ✅ **Schema Design Principles**
1. **Normalize when**: Dữ liệu dùng chung, thay đổi thường xuyên (Brand, Category, Color, Memory)
2. **Denormalize when**: Snapshot để giữ lịch sử (OrderItem, shippingAddress trong Order)
3. **Embed when**: One-to-few, luôn query cùng parent (CartItem, OrderItem)
4. **Reference when**: One-to-many, many-to-many, query riêng (Product → ProductVariant)

### ✅ **Data Consistency**
- **Order** snapshot shippingAddress để tránh thay đổi sau khi đặt
- **OrderItem** snapshot tên + giá sản phẩm tại thời điểm đặt
- **CartItem** lưu giá hiện tại, có thể outdate (recalculate khi checkout)
- **Review** snapshot userName, productName (tránh bị null khi xóa)

### ✅ **Cross-Service Communication**
- Dùng **String** thay vì ObjectId cho cross-service references
- Validate existence qua REST API calls giữa services
- Không dùng MongoDB populate() cross-database
- Cache frequently accessed data (Product details, User info)

### ✅ **Security**
- Hash passwords với bcrypt (User.password)
- Encrypt sensitive data (payment details, personal info)
- Validate user permissions (isAdmin, isVerified)
- Rate limit OTP requests (PendingUpdate)
- Sanitize user inputs (prevent NoSQL injection)

---

## 🛠️ TOOLS ĐỂ XEM SƠ ĐỒ

### **VS Code Extensions:**
1. **Markdown Preview Enhanced** - Xem mermaid diagrams
2. **Mermaid Preview** - Preview trực tiếp
3. **Draw.io Integration** - Export to PNG/SVG

### **Online Tools:**
1. **Mermaid Live Editor**: https://mermaid.live
2. **Draw.io**: https://app.diagrams.net
3. **Lucidchart**: https://www.lucidchart.com
4. **dbdiagram.io**: https://dbdiagram.io

### **Export Commands:**
```bash
# Install mermaid-cli
npm install -g @mermaid-js/mermaid-cli

# Convert to PNG
mmdc -i ERD_DIAGRAM.md -o erd.png

# Convert to SVG
mmdc -i ERD_DIAGRAM.md -o erd.svg
```

---

## 📚 REFERENCES

- MongoDB Schema Design: https://www.mongodb.com/docs/manual/data-modeling/
- Mermaid Syntax: https://mermaid.js.org/syntax/entityRelationshipDiagram.html
- Microservices Data Patterns: https://microservices.io/patterns/data/

---

**Last Updated:** December 14, 2025
**Version:** 1.0
**Author:** SmartBuy Development Team
