# MÔ HÌNH MỨC LUẬN LÝ (LDM) - DỰ ÁN SMARTBUY

## 3.2.2. Mô hình mức luận lý (LDM)

Dự án SmartBuy sử dụng kiến trúc Microservices với MongoDB (NoSQL). Mỗi service có database riêng biệt.

### **Tóm tắt cấu trúc Collections:**

**USER DOMAIN:**
- **users** (_id, username, email, password, avatar, isAdmin, isEmailVerified, isActive, phone, dateOfBirth, gender, resetPasswordToken, resetPasswordExpires, verificationToken, verificationTokenExpires, createdAt, updatedAt)
- **addresses** (_id, userId, label, recipientName, phoneNumber, province, district, ward, street, isDefault, createdAt, updatedAt)
- **pendingupdates** (_id, userId, updateType, updateData, token, expiresAt, createdAt, updatedAt)
- **wishlists** (_id, userId, items[productId, colorId, memoryId, notes, addedAt], createdAt, updatedAt)

**PRODUCT DOMAIN:**
- **products** (_id, name, description, detailSpecs, averageRating, slug, price, brandId, categoryId, createdAt, updatedAt)
- **categories** (_id, name, nameAscii, createdAt, updatedAt)
- **brands** (_id, name, description, createdAt, updatedAt)
- **colors** (_id, name, code, createdAt, updatedAt)
- **memories** (_id, ram, rom, memoryType, createdAt, updatedAt)
- **productvariants** (_id, stock, sold, productId, memoryId, colorId, createdAt, updatedAt)
- **productimages** (_id, name, url, alt, displayOrder, productId, colorId, createdAt, updatedAt)
- **specifications** (_id, name, createdAt, updatedAt)
- **productspecifications** (_id, value, productId, specificationId, createdAt, updatedAt)

**CART DOMAIN:**
- **carts** (_id, userId, items[productId, productName, image, slug, variant{variantId, color, memory, sku, price, stock}, quantity, price, discount, totalPrice, addedAt, updatedAt], totalPrice, totalItems, couponCode, couponDiscount, status, expiresAt, createdAt, updatedAt)

**ORDER & PAYMENT DOMAIN:**
- **orders** (_id, user, items[product, productName, productImage, quantity, price, sku, variant{color, memory, variantId}], shippingAddress{recipientName, phoneNumber, province, district, ward, street, addressId}, paymentMethod, paymentStatus, paymentResult{transactionId, status, paidAt, amount}, itemsPrice, shippingPrice, discount, couponCode, totalPrice, status, orderNotes, cancelReason, statusHistory[status, timestamp, updatedBy, role, note], isPaid, paidAt, isDelivered, createdAt, updatedAt)
- **payments** (_id, userId, orderId, amount, currency, paymentMethod, status, transactionId, gatewayResponse{code, message}, paymentDate, expiresAt, returnUrl, statusHistory[status, timestamp, reason], createdAt, updatedAt)

**REVIEW DOMAIN:**
- **reviews** (_id, userId, userName, rating, comment, productId, productName, images, helpfulCount, helpfulBy, isVisible, adminReply, adminReplyBy, adminReplyAt, orderDetailId, verifiedPurchase, purchaseDate, createdAt, updatedAt)

### **Ràng buộc tham chiếu:**
- addresses (userId) → users (_id)
- pendingupdates (userId) → users (_id)
- wishlists (userId) → users (_id)
- wishlists.items (productId) → products (_id) *[cross-service]*
- products (brandId) → brands (_id)
- products (categoryId) → categories (_id)
- productvariants (productId) → products (_id)
- productvariants (memoryId) → memories (_id)
- productvariants (colorId) → colors (_id)
- productimages (productId) → products (_id)
- productimages (colorId) → colors (_id)
- productspecifications (productId) → products (_id)
- productspecifications (specificationId) → specifications (_id)
- carts (userId) → users (_id) *[cross-service]*
- carts.items (productId) → products (_id) *[cross-service]*
- carts.items.variant (variantId) → productvariants (_id) *[cross-service]*
- orders (user) → users (_id) *[cross-service]*
- orders.items (product) → products (_id) *[cross-service]*
- orders.shippingAddress (addressId) → addresses (_id) *[cross-service]*
- orders.statusHistory (updatedBy) → users (_id) *[cross-service]*
- payments (userId) → users (_id) *[cross-service]*
- payments (orderId) → orders (_id) *[cross-service]*
- reviews (userId) → users (_id) *[cross-service]*
- reviews (productId) → products (_id) *[cross-service]*

---

## **I. USER DOMAIN**

### **1. users** (User-Manager-Service, UserService)
- **Collection:** `users`
- **Fields:**
  - `_id`: ObjectId (Primary Key)
  - `username`: String (default: "username")
  - `email`: String (required, unique, validated)
  - `password`: String (required, min: 6, hashed)
  - `avatar`: String (nullable)
  - `isAdmin`: Boolean (default: false)
  - `isEmailVerified`: Boolean (default: false)
  - `isActive`: Boolean (default: false)
  - `phone`: String (nullable)
  - `dateOfBirth`: Date (nullable)
  - `gender`: String (nullable)
  - `resetPasswordToken`: String (nullable)
  - `resetPasswordExpires`: Date (nullable)
  - `verificationToken`: String (nullable)
  - `verificationTokenExpires`: Date (nullable)
  - `createdAt`: Date (auto-generated)
  - `updatedAt`: Date (auto-generated)
- **Indexes:**
  - `email` (unique)
- **Virtual References:**
  - → `carts` (one-to-many)
  - → `addresses` (one-to-many)

### **2. addresses** (User-Manager-Service, UserService)
- **Collection:** `addresses`
- **Fields:**
  - `_id`: ObjectId (Primary Key)
  - `userId`: ObjectId (required, indexed)
  - `label`: String (default: "Nhà riêng")
  - `recipientName`: String (required)
  - `phoneNumber`: String (required)
  - `province`: String (required)
  - `district`: String (required)
  - `ward`: String (required)
  - `street`: String (required)
  - `isDefault`: Boolean (default: false)
  - `createdAt`: Date (auto-generated)
  - `updatedAt`: Date (auto-generated)
- **References:**
  - `userId` → users._id
- **Indexes:**
  - `userId`
- **Virtual References:**
  - → `orders` (one-to-many)

### **3. pendingupdates** (UserService)
- **Collection:** `pendingupdates`
- **Fields:**
  - `_id`: ObjectId (Primary Key)
  - `userId`: ObjectId (required)
  - `updateType`: String (enum: ['change_email'], required)
  - `updateData`: Mixed (required) - e.g., { newEmail: '...' }
  - `token`: String (required)
  - `expiresAt`: Date (required)
  - `createdAt`: Date (auto-generated)
  - `updatedAt`: Date (auto-generated)
- **References:**
  - `userId` → users._id
- **Indexes:**
  - `expiresAt` (TTL index, expireAfterSeconds: 0)

### **4. wishlists** (UserService)
- **Collection:** `wishlists`
- **Fields:**
  - `_id`: ObjectId (Primary Key)
  - `userId`: ObjectId (required, unique, indexed)
  - `items`: Array of WishlistItem (embedded)
    - `productId`: ObjectId (required)
    - `colorId`: String (optional)
    - `memoryId`: String (optional)
    - `notes`: String (optional)
    - `addedAt`: Date (default: now)
  - `createdAt`: Date (auto-generated)
  - `updatedAt`: Date (auto-generated)
- **References:**
  - `userId` → users._id
  - `items.productId` → products._id (cross-service)
- **Indexes:**
  - `userId` (unique)

---

## **II. PRODUCT DOMAIN**

### **5. products** (Product-Manager-Service, ProductService)
- **Collection:** `products`
- **Fields:**
  - `_id`: ObjectId (Primary Key)
  - `name`: String (required, unique)
  - `description`: String (nullable)
  - `detailSpecs`: String (nullable)
  - `averageRating`: Number (default: 0)
  - `slug`: String (required, unique, auto-generated)
  - `price`: Number (required)
  - `brandId`: ObjectId (required)
  - `categoryId`: ObjectId (required)
  - `createdAt`: Date (auto-generated)
  - `updatedAt`: Date (auto-generated)
- **References:**
  - `brandId` → brands._id
  - `categoryId` → categories._id
- **Indexes:**
  - `name` (unique)
  - `slug` (unique)
- **Related Collections:**
  - → `productvariants` (one-to-many)
  - → `productimages` (one-to-many)
  - → `productspecifications` (one-to-many)

### **6. categories** (Product-Manager-Service, ProductService)
- **Collection:** `categories`
- **Fields:**
  - `_id`: ObjectId (Primary Key)
  - `name`: String (required, unique)
  - `nameAscii`: String (required, unique)
  - `createdAt`: Date (auto-generated)
  - `updatedAt`: Date (auto-generated)
- **Indexes:**
  - `name` (unique)
  - `nameAscii` (unique)

### **7. brands** (Product-Manager-Service, ProductService)
- **Collection:** `brands`
- **Fields:**
  - `_id`: ObjectId (Primary Key)
  - `name`: String (required, unique)
  - `description`: String (nullable)
  - `createdAt`: Date (auto-generated)
  - `updatedAt`: Date (auto-generated)
- **Indexes:**
  - `name` (unique)

### **8. colors** (Product-Manager-Service, ProductService)
- **Collection:** `colors`
- **Fields:**
  - `_id`: ObjectId (Primary Key)
  - `name`: String (required, unique)
  - `code`: String (required, unique) - Hex color code
  - `createdAt`: Date (auto-generated)
  - `updatedAt`: Date (auto-generated)
- **Indexes:**
  - `name` (unique)
  - `code` (unique)

### **9. memories** (Product-Manager-Service, ProductService)
- **Collection:** `memories`
- **Fields:**
  - `_id`: ObjectId (Primary Key)
  - `ram`: String (nullable)
  - `rom`: String (nullable)
  - `memoryType`: String (nullable) - ProductService only
  - `createdAt`: Date (auto-generated)
  - `updatedAt`: Date (auto-generated)

### **10. productvariants** (Product-Manager-Service, ProductService)
- **Collection:** `productvariants`
- **Fields:**
  - `_id`: ObjectId (Primary Key)
  - `stock`: Number (default: 0)
  - `sold`: Number (default: 0)
  - `productId`: ObjectId (required)
  - `memoryId`: ObjectId (required)
  - `colorId`: ObjectId (required)
  - `createdAt`: Date (auto-generated)
  - `updatedAt`: Date (auto-generated)
- **References:**
  - `productId` → products._id
  - `memoryId` → memories._id
  - `colorId` → colors._id

### **11. productimages** (Product-Manager-Service, ProductService)
- **Collection:** `productimages`
- **Fields:**
  - `_id`: ObjectId (Primary Key)
  - `name`: String (nullable)
  - `url`: String (required)
  - `alt`: String (nullable)
  - `displayOrder`: Number (nullable)
  - `productId`: ObjectId (required)
  - `colorId`: ObjectId (nullable)
  - `createdAt`: Date (auto-generated)
  - `updatedAt`: Date (auto-generated)
- **References:**
  - `productId` → products._id
  - `colorId` → colors._id

### **12. specifications** (Product-Manager-Service, ProductService)
- **Collection:** `specifications`
- **Fields:**
  - `_id`: ObjectId (Primary Key)
  - `name`: String (required)
  - `createdAt`: Date (auto-generated)
  - `updatedAt`: Date (auto-generated)

### **13. productspecifications** (Product-Manager-Service, ProductService)
- **Collection:** `productspecifications`
- **Fields:**
  - `_id`: ObjectId (Primary Key)
  - `value`: String (nullable)
  - `productId`: ObjectId (required)
  - `specificationId`: ObjectId (required)
  - `createdAt`: Date (auto-generated)
  - `updatedAt`: Date (auto-generated)
- **References:**
  - `productId` → products._id
  - `specificationId` → specifications._id

---

## **III. CART DOMAIN**

### **14. carts** (CartService)
- **Collection:** `carts`
- **Fields:**
  - `_id`: ObjectId (Primary Key)
  - `userId`: ObjectId (required, indexed)
  - `items`: Array of CartItem (embedded documents)
    - `productId`: ObjectId (required)
    - `productName`: String (required)
    - `image`: String (required)
    - `slug`: String
    - `variant`: Object (embedded)
      - `variantId`: ObjectId (required)
      - `color`: { id, name, code }
      - `memory`: { id, ram, rom }
      - `sku`: String (required, indexed)
      - `price`: Number (required, min: 0)
      - `stock`: Number (default: 0)
    - `quantity`: Number (required, min: 1, default: 1)
    - `price`: Number (required, min: 0)
    - `discount`: Number (default: 0, min: 0, max: 100)
    - `totalPrice`: Number (required, min: 0)
    - `addedAt`: Date (auto-generated)
    - `updatedAt`: Date (auto-generated)
  - `totalPrice`: Number (default: 0, min: 0)
  - `totalItems`: Number (default: 0, min: 0)
  - `couponCode`: String (uppercase, trimmed)
  - `couponDiscount`: Number (default: 0, min: 0)
  - `status`: String (enum: ['active', 'ordered', 'expired'], default: 'active', indexed)
  - `expiresAt`: Date (indexed)
  - `createdAt`: Date (auto-generated)
  - `updatedAt`: Date (auto-generated)
- **References:**
  - `userId` → users._id (cross-service)
  - `items.productId` → products._id (cross-service)
  - `items.variant.variantId` → productvariants._id (cross-service)
- **Indexes:**
  - `userId`
  - `status`
  - `{ userId: 1, status: 1 }` (compound)
  - `expiresAt`
  - `"items.variant.sku"`
- **Virtual Fields:**
  - `finalPrice`: Computed (totalPrice - couponDiscount)
- **Methods:**
  - `calculateTotals()`
  - `applyDiscount()`

---

## **IV. ORDER & PAYMENT DOMAIN**

### **15. orders** (OrderService, Order-Manager-Service)
- **Collection:** `orders`
- **Fields:**
  - `_id`: ObjectId (Primary Key)
  - `user`: ObjectId (required, indexed)
  - `items`: Array of OrderItem (embedded)
    - `product`: ObjectId (required)
    - `productName`: String (required)
    - `productImage`: String
    - `quantity`: Number (required, min: 1)
    - `price`: Number (required, min: 0)
    - `sku`: String
    - `variant`: Object
      - `color`: String
      - `memory`: String
      - `variantId`: ObjectId
  - `shippingAddress`: Object (embedded)
    - `recipientName`: String (required)
    - `phoneNumber`: String (required)
    - `province`: String (required)
    - `district`: String (required)
    - `ward`: String (required)
    - `street`: String (required)
    - `addressId`: ObjectId (ref: addresses._id)
  - `paymentMethod`: String (enum: ['COD', 'VNPAY', 'MOMO', 'ZALOPAY', 'PAYPAL', 'CREDIT_CARD'], required, default: 'COD')
  - `paymentStatus`: String (enum: ['unpaid', 'pending', 'paid', 'refunded', 'failed'], default: 'unpaid')
  - `paymentResult`: Object
    - `transactionId`: String
    - `paymentMethod`: String
    - `status`: String
    - `paidAt`: Date
    - `amount`: Number
    - `currency`: String
    - `paymentGatewayResponse`: String
  - `itemsPrice`: Number (required, min: 0)
  - `shippingPrice`: Number (default: 0, min: 0)
  - `discount`: Number (default: 0, min: 0)
  - `taxPrice`: Number (default: 0, min: 0)
  - `couponCode`: String (uppercase)
  - `totalPrice`: Number (required, min: 0)
  - `status`: String (enum: ['pending_payment', 'payment_failed', 'pending', 'confirmed', 'processing', 'ready_to_ship', 'shipping', 'delivered', 'completed', 'cancelled', 'returned'], default: 'pending', indexed)
  - `shippingInfo`: Object
    - `carrier`: String
    - `trackingNumber`: String
    - `shippedAt`: Date
    - `estimatedDelivery`: Date
    - `deliveryNote`: String
  - `orderNotes`: String (max: 500)
  - `cancelReason`: String (max: 500)
  - `cancelledBy`: String
  - `returnReason`: String
  - `statusHistory`: Array
    - `status`: String (required)
    - `timestamp`: Date (default: now)
    - `updatedBy`: ObjectId (ref: users._id, optional)
    - `role`: String (enum: ['user', 'admin', 'system'], default: 'system')
    - `note`: String
  - `isPaid`: Boolean (default: false)
  - `paidAt`: Date
  - `isDelivered`: Boolean (default: false)
  - `deliveredAt`: Object
    - `confirmed`: Boolean (default: false)
    - `confirmedAt`: Date
    - `confirmedBy`: String
  - `createdAt`: Date (auto-generated)
  - `updatedAt`: Date (auto-generated)
- **References:**
  - `user` → users._id (cross-service)
  - `items.product` → products._id (cross-service)
  - `shippingAddress.addressId` → addresses._id (cross-service)
  - `statusHistory.updatedBy` → users._id (cross-service)
- **Indexes:**
  - `user`
  - `status`
  - `{ user: 1, createdAt: -1 }` (compound)
  - `{ status: 1, createdAt: -1 }` (compound)
  - `"shippingInfo.trackingNumber"`
  - `"paymentResult.transactionId"`
- **Virtual Fields:**
  - `orderNumber`: Computed (ORD-YYYYMMDD-XXXXXX)
- **Methods:**
  - `updateStatus(status, note, updatedBy, role)`
  - `markAsPaid() / confirmPayment()`
  - `markAsDelivered()`
  - `calculateTotalPrice()`
- **Static Methods:**
  - `getUserOrders(userId, filters)`
  - `getOrdersByStatus(status)`
  - `getRecentOrders(limit)`
  - `searchOrders(query)`

### **16. payments** (PaymentService)
- **Collection:** `payments`
- **Fields:**
  - `_id`: ObjectId (Primary Key)
  - `userId`: String (required, indexed)
  - `orderId`: String (required, indexed)
  - `amount`: Number (required, min: 0)
  - `currency`: String (default: 'VND', enum: ['VND', 'USD'])
  - `paymentMethod`: String (required, enum: ['COD', 'VNPAY', 'MOMO', 'ZALOPAY', 'PAYPAL', 'CREDIT_CARD'], indexed)
  - `status`: String (enum: ['pending', 'processing', 'paid', 'failed', 'cancelled', 'refunded', 'expired'], default: 'pending', indexed)
  - `description`: String
  - `transactionId`: String (indexed, sparse, unique)
  - `vnpayTransactionNo`: String (sparse)
  - `vnpayBankCode`: String
  - `vnpayCardType`: String
  - `momoTransId`: String
  - `zalopayTransId`: String
  - `paypalOrderId`: String
  - `gatewayResponse`: Object
    - `code`: String
    - `message`: String
    - `data`: String
  - `ipAddress`: String (max: 255)
  - `paymentDate`: Date
  - `expiresAt`: Date (indexed)
  - `returnUrl`: String
  - `metadata`: Mixed
  - `refundInfo`: Object
    - `amount`: Number
    - `refundedAt`: Date
    - `refundedBy`: String
    - `reason`: String
    - `refundStatus`: String (enum: ['pending', 'processing', 'completed', 'failed'])
  - `retryCount`: Number (default: 0)
  - `statusHistory`: Array
    - `status`: String
    - `timestamp`: Date (default: now)
    - `reason`: String
    - `metadata`: String
  - `isWebhookProcessed`: Boolean (default: false)
  - `webhookProcessedAt`: Date
  - `failureCount`: Number (default: 0)
  - `rawResponse`: Mixed
  - `createdAt`: Date (auto-generated)
  - `updatedAt`: Date (auto-generated)
- **References:**
  - `userId` → users._id (cross-service, stored as String)
  - `orderId` → orders._id (cross-service, stored as String)
- **Indexes:**
  - `orderId`
  - `userId`
  - `paymentMethod`
  - `status`
  - `{ orderId: 1, status: 1 }` (compound)
  - `{ userId: 1, createdAt: -1 }` (compound)
  - `transactionId` (sparse, unique)
  - `{ status: 1, expiresAt: 1 }` (compound)
  - `createdAt`
- **Methods:**
  - `addStatusHistory(status, reason, metadata)`

---

## **V. REVIEW DOMAIN**

### **17. reviews** (Review-Service)
- **Collection:** `reviews`
- **Fields:**
  - `_id`: ObjectId (Primary Key)
  - `userId`: String (required)
  - `userName`: String (required)
  - `rating`: Number (required, min: 1, max: 5)
  - `comment`: String (required, max: 1000)
  - `productId`: String (required)
  - `productName`: String (required)
  - `images`: Array of String
  - `helpfulCount`: Number (default: 0)
  - `helpfulBy`: Array of String (default: [])
  - `isVisible`: Boolean (default: true)
  - `adminReply`: String (nullable)
  - `adminReplyBy`: String (nullable)
  - `adminReplyAt`: Date (nullable)
  - `orderDetailId`: String (nullable)
  - `verifiedPurchase`: String (nullable)
  - `purchaseDate`: Date (nullable)
  - `createdAt`: Date (auto-generated)
  - `updatedAt`: Date (auto-generated)
- **References:**
  - `userId` → users._id (cross-service, stored as String)
  - `productId` → products._id (cross-service, stored as String)
- **Indexes:**
  - `{ productId: 1, createdAt: -1 }` (compound)
  - `userId`
  - `rating`

---

## **RÀNG BUỘC THAM CHIẾU (CROSS-SERVICE REFERENCES)**

### **User Domain References:**
- addresses.userId → users._id
- pendingupdates.userId → users._id
- wishlists.userId → users._id
- wishlists.items.productId → products._id *(cross-service)*

### **Product Domain References:**
- products.brandId → brands._id
- products.categoryId → categories._id
- productvariants.productId → products._id
- productvariants.memoryId → memories._id
- productvariants.colorId → colors._id
- productimages.productId → products._id
- productimages.colorId → colors._id
- productspecifications.productId → products._id
- productspecifications.specificationId → specifications._id

### **Cart Domain References:**
- carts.userId → users._id *(cross-service)*
- carts.items.productId → products._id *(cross-service)*
- carts.items.variant.variantId → productvariants._id *(cross-service)*

### **Order Domain References:**
- orders.user → users._id *(cross-service)*
- orders.items.product → products._id *(cross-service)*
- orders.shippingAddress.addressId → addresses._id *(cross-service)*
- orders.statusHistory.updatedBy → users._id *(cross-service)*

### **Payment Domain References:**
- payments.userId → users._id *(cross-service, as String)*
- payments.orderId → orders._id *(cross-service, as String)*

### **Review Domain References:**
- reviews.userId → users._id *(cross-service, as String)*
- reviews.productId → products._id *(cross-service, as String)*

---

## **CHÚ THÍCH**

### **Kiến trúc Microservices:**
- Mỗi service có database MongoDB riêng biệt
- **Cross-service references** là tham chiếu một chiều:
  + Service A lưu ID của entity từ Service B (dưới dạng String hoặc ObjectId)
  + Không có foreign key constraints như SQL (không có referential integrity tự động)
  + Không có cascade delete giữa các services
  + Để lấy dữ liệu đầy đủ, service phải gọi API sang service khác (REST API)
  + Ví dụ: `carts.userId` → `users._id` (CartService lưu userId nhưng không biết user có tồn tại không)
- Communication giữa services qua REST API

### **Embedded vs Referenced:**
- **Embedded Documents:** Dữ liệu lồng nhau (items trong cart, orderItems trong order)
- **Referenced Documents:** Sử dụng ObjectId để liên kết (userId, productId)

### **Indexes:**
- Single field indexes: Tăng tốc truy vấn đơn
- Compound indexes: Tối ưu truy vấn phức tạp (userId + createdAt)
- Unique indexes: Đảm bảo tính duy nhất (email, slug)
- Sparse indexes: Chỉ index documents có field đó (transactionId)
- TTL indexes: Tự động xóa documents hết hạn (pendingupdates.expiresAt)

### **Virtual Fields:**
- Computed fields không lưu trong database
- Tính toán runtime (orderNumber, finalPrice)

### **Methods & Statics:**
- **Instance Methods:** Thao tác trên document cụ thể
- **Static Methods:** Thao tác trên collection level

---

## **THỐNG KÊ**

- **Tổng số Collections:** 17
- **Số Services:** 9
- **Domains:** 5 (User, Product, Cart, Order & Payment, Review)
- **Cross-service References:** 11
- **Total Indexes:** 40+
- **Embedded Collections:** 4 (CartItem, OrderItem, ShippingAddress, PaymentResult)
