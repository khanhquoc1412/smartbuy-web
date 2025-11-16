# 📦 ORDER MANAGEMENT - HƯỚNG DẪN XỬ LÝ ĐƠN HÀNG

> **Mục đích**: Tài liệu này hướng dẫn cách xử lý luồng đơn hàng từ khi khách hàng đặt hàng đến khi hoàn thành, bao gồm cách tích hợp với backend API.

---

## 🎯 TỔNG QUAN HỆ THỐNG

### Kiến trúc Service
```
order-manager-service (Port: 3003)
├── src/
│   ├── models/Order.js          # Schema đơn hàng
│   ├── controllers/orderController.js  # Logic xử lý
│   └── routes/orders.js         # API endpoints
```

### Base URL
```
http://localhost:3003/api/orders
```

---

## 📊 LUỒNG TRẠNG THÁI ĐƠN HÀNG

```
┌─────────────────┐
│ THANH TOÁN      │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
COD/Online  Online
    │         │
    │    pending_payment → payment_failed ❌
    │         │                  
    │    [Thanh toán]           
    │         │                  
    └────┬────┘                  
         │
         ▼
     pending (Chờ xác nhận)
         │
         ▼
    confirmed (Đã xác nhận)
         │
         ▼
   processing (Đang chuẩn bị)
         │
         ▼
  ready_to_ship (Sẵn sàng giao)
         │
         ▼
    shipping (Đang giao)
         │
         ▼
    delivered (Đã giao)
         │
    [Khách xác nhận]
         │
         ▼
    completed ✅ (Hoàn thành)

[Có thể hủy ở các bước: pending, confirmed, pending_payment]
         │
         ▼
    cancelled ❌ (Đã hủy)

[Sau khi completed, khách có thể trả hàng]
         │
         ▼
    returned 🔄 (Đã trả hàng)
```

---

## 🔑 CÁC TRẠNG THÁI CHI TIẾT

| Trạng thái | Mô tả | Ai thay đổi | Hành động tiếp theo |
|-----------|-------|-------------|-------------------|
| **pending_payment** | Chờ thanh toán online | System | Khách thanh toán → `pending` |
| **payment_failed** | Thanh toán thất bại | Payment Gateway | Cho phép thanh toán lại hoặc hủy |
| **pending** | Chờ shop xác nhận | System/User | Admin xác nhận → `confirmed` |
| **confirmed** | Shop đã xác nhận | Admin | Bắt đầu chuẩn bị → `processing` |
| **processing** | Đang đóng gói hàng | Admin | Đóng gói xong → `ready_to_ship` |
| **ready_to_ship** | Sẵn sàng giao shipper | Admin | Shipper nhận → `shipping` |
| **shipping** | Đang vận chuyển | Shipper | Giao tới khách → `delivered` |
| **delivered** | Đã giao (chờ xác nhận) | Shipper | Khách xác nhận → `completed` |
| **completed** | Hoàn thành | User | Có thể đánh giá sản phẩm |
| **cancelled** | Đã hủy | Admin/User | Hoàn tiền nếu đã thanh toán |
| **returned** | Đã trả hàng/hoàn trả | Admin | Xử lý hoàn tiền |

---

## 🔌 API ENDPOINTS

### 1️⃣ **Tạo đơn hàng mới**
```http
POST /api/orders
Content-Type: application/json

{
  "user": "673688a4fc13ae476c0ca13f",
  "orderItems": [
    {
      "product": "673656b2fc13ae476c0ca13a",
      "name": "iPhone 15 Pro Max",
      "sku": "IP15PM-256-BLK",
      "qty": 1,
      "price": 29990000,
      "image": "/images/iphone15.jpg",
      "variant": {
        "color": "Titan Đen",
        "memory": "256GB",
        "variantId": "673656b2fc13ae476c0ca13b"
      }
    }
  ],
  "shippingAddress": {
    "fullName": "Nguyễn Văn A",
    "phone": "0901234567",
    "province": "Hồ Chí Minh",
    "district": "Quận 1",
    "ward": "Phường Bến Nghé",
    "address": "123 Lê Lợi"
  },
  "paymentMethod": "COD",
  "itemsPrice": 29990000,
  "shippingPrice": 30000,
  "taxPrice": 0,
  "discountAmount": 0,
  "totalPrice": 30020000,
  "notes": "Giao hàng giờ hành chính"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tạo đơn hàng thành công",
  "data": {
    "_id": "673688a4fc13ae476c0ca140",
    "orderNumber": "ORD-20251115-A13F40",
    "status": "pending",
    "paymentStatus": "unpaid",
    ...
  }
}
```

---

### 2️⃣ **Lấy danh sách đơn hàng (có phân trang & filter)**
```http
GET /api/orders?page=1&limit=10&status=pending&search=ORD-20251115

Query Parameters:
- page: Trang số (default: 1)
- limit: Số item/trang (default: 10, max: 100)
- status: Lọc theo trạng thái (pending, confirmed, ...)
- paymentStatus: Lọc theo thanh toán (paid, unpaid, ...)
- paymentMethod: Lọc theo phương thức (COD, VNPAY, ...)
- startDate: Lọc từ ngày (YYYY-MM-DD)
- endDate: Lọc đến ngày (YYYY-MM-DD)
- search: Tìm theo mã đơn hàng (orderNumber)
```

**Response:**
```json
{
  "success": true,
  "items": [
    {
      "_id": "673688a4fc13ae476c0ca140",
      "orderNumber": "ORD-20251115-A13F40",
      "user": { "_id": "...", "userName": "..." },
      "status": "pending",
      "totalPrice": 30020000,
      "createdAt": "2025-11-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 50,
    "totalPages": 5
  }
}
```

---

### 3️⃣ **Lấy chi tiết 1 đơn hàng**
```http
GET /api/orders/:id

Example: GET /api/orders/673688a4fc13ae476c0ca140
```

**Response:** Trả về toàn bộ thông tin đơn hàng bao gồm:
- Thông tin khách hàng
- Danh sách sản phẩm (orderItems)
- Địa chỉ giao hàng (shippingAddress)
- Thông tin thanh toán (paymentResult)
- Lịch sử thay đổi trạng thái (statusHistory)

---

### 4️⃣ **Cập nhật trạng thái đơn hàng**
```http
PATCH /api/orders/:id/status
Content-Type: application/json

{
  "status": "confirmed",
  "note": "Shop đã xác nhận và bắt đầu chuẩn bị hàng"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cập nhật trạng thái thành công",
  "data": {
    "_id": "673688a4fc13ae476c0ca140",
    "status": "confirmed",
    "statusHistory": [
      {
        "status": "pending",
        "timestamp": "2025-11-15T10:30:00.000Z",
        "actorType": "system",
        "note": "Đơn hàng được tạo"
      },
      {
        "status": "confirmed",
        "timestamp": "2025-11-15T11:00:00.000Z",
        "actorType": "admin",
        "note": "Shop đã xác nhận và bắt đầu chuẩn bị hàng"
      }
    ]
  }
}
```

---

### 5️⃣ **Cập nhật thông tin đơn hàng (không phải status)**
```http
PATCH /api/orders/:id
Content-Type: application/json

{
  "shippingInfo": {
    "carrier": "Giao Hàng Nhanh",
    "trackingNumber": "GHN123456789",
    "shippingMethod": "Express"
  },
  "adminNotes": "Khách yêu cầu gọi trước khi giao"
}
```

---

### 6️⃣ **Xóa đơn hàng (soft delete hoặc hard delete)**
```http
DELETE /api/orders/:id
```

**Lưu ý:** Nên implement soft delete (thêm field `deletedAt`) thay vì xóa hẳn trong database để giữ lại dữ liệu thống kê.

---

### 7️⃣ **Lấy thống kê đơn hàng**
```http
GET /api/orders/stats

Trả về:
- Tổng đơn hàng hôm nay
- Đơn hàng chưa xử lý (pending)
- Doanh thu hôm nay
- Dữ liệu biểu đồ doanh thu 7 ngày
- Dữ liệu biểu đồ phân bổ trạng thái
```

---

## 💡 XỬ LÝ CÁC TÌNH HUỐNG ĐẶC BIỆT

### 🔴 1. Khách hàng hủy đơn hàng

**Điều kiện:** Chỉ cho phép hủy khi status là:
- `pending` (chờ xác nhận)
- `confirmed` (đã xác nhận nhưng chưa chuẩn bị)
- `pending_payment` (chưa thanh toán)

**Flow:**
```javascript
// Frontend gọi API
PATCH /api/orders/:id/status
{
  "status": "cancelled",
  "note": "Khách hàng yêu cầu hủy đơn"
}

// Backend xử lý:
const order = await Order.findById(id);
if (!order.canCancel()) {
  return res.status(400).json({
    success: false,
    message: 'Không thể hủy đơn hàng ở trạng thái này'
  });
}

// Nếu đã thanh toán → cần hoàn tiền
if (order.paymentStatus === 'paid') {
  // TODO: Gọi API hoàn tiền của payment gateway
  order.paymentStatus = 'refunded';
}

// Giải phóng tồn kho nếu đã reserve
if (order.stockReserved) {
  // TODO: Gọi product service để release stock
  order.stockReleased = true;
}

order.addStatusHistory('cancelled', userId, 'user', note);
await order.save();
```

---

### 🟢 2. Thanh toán online thành công

**Flow sau khi nhận webhook từ VNPAY/MOMO:**
```javascript
// Payment gateway gọi webhook
POST /api/orders/payment-callback
{
  "orderId": "673688a4fc13ae476c0ca140",
  "transactionId": "VNP2025111511234567",
  "status": "SUCCESS",
  "amount": 30020000,
  "responseCode": "00",
  "paymentGateway": "VNPAY"
}

// Backend xử lý:
const order = await Order.findById(orderId);

order.paymentStatus = 'paid';
order.paymentResult = {
  transactionId: data.transactionId,
  paymentGateway: data.paymentGateway,
  status: data.status,
  paidAt: new Date(),
  amount: data.amount,
  responseCode: data.responseCode
};

// Chuyển từ pending_payment → pending
order.addStatusHistory('pending', null, 'system', 
  'Thanh toán thành công, chờ shop xác nhận');

await order.save();

// TODO: Gửi email xác nhận thanh toán
```

---

### 🔵 3. Khách xác nhận đã nhận hàng

**Flow:**
```javascript
// Frontend (khách hàng) gọi API
PATCH /api/orders/:id/status
{
  "status": "completed",
  "note": "Đã nhận hàng, sản phẩm tốt"
}

// Backend:
const order = await Order.findById(id);

if (order.status !== 'delivered') {
  return res.status(400).json({
    success: false,
    message: 'Đơn hàng chưa được giao'
  });
}

order.addStatusHistory('completed', userId, 'user', note);
await order.save();

// TODO: Mở khóa chức năng đánh giá sản phẩm
// TODO: Tính điểm thưởng cho khách hàng (nếu có)
```

---

### 🟡 4. Admin cập nhật mã vận đơn

**Flow:**
```javascript
// Admin cập nhật tracking khi bàn giao shipper
PATCH /api/orders/:id
{
  "shippingInfo": {
    "carrier": "Giao Hàng Nhanh",
    "trackingNumber": "GHN987654321",
    "shippingMethod": "Express",
    "estimatedDelivery": "2025-11-17T18:00:00Z"
  },
  "status": "shipping"
}

// Backend tự động cập nhật status history
order.addStatusHistory('shipping', adminId, 'admin',
  `Đơn hàng đang được giao bởi ${carrier} - Mã vận đơn: ${trackingNumber}`);

// TODO: Gửi SMS/Email thông báo mã vận đơn cho khách
```

---

## 🛠️ HELPER METHODS (Sử dụng trong code)

### Kiểm tra có thể hủy đơn
```javascript
const order = await Order.findById(orderId);
if (order.canCancel()) {
  // Cho phép hủy
  order.addStatusHistory('cancelled', userId, 'user', 'Hủy đơn');
  await order.save();
}
```

### Kiểm tra có thể hoàn tiền
```javascript
if (order.canRefund()) {
  // Gọi API payment gateway hoàn tiền
  // Cập nhật paymentStatus = 'refunded'
}
```

### Tính tổng tiền
```javascript
order.calculateTotal(); // Tự động tính itemsPrice + shippingPrice + taxPrice - discountAmount
```

### Lấy mã đơn hàng (Virtual field)
```javascript
console.log(order.orderNumber); // "ORD-20251115-A13F40"
```

---

## 📦 CẤU TRÚC DỮ LIỆU ĐẦY ĐỦ

### Order Schema (xem file `Order.js`)
```javascript
{
  _id: ObjectId,
  orderNumber: "ORD-20251115-A13F40", // Virtual field (tự sinh)
  
  // THÔNG TIN KHÁCH HÀNG
  user: ObjectId (ref: User),
  
  // SẢN PHẨM
  orderItems: [
    {
      product: ObjectId,
      name: String,
      sku: String,
      qty: Number,
      price: Number,
      image: String,
      variant: {
        color: String,
        memory: String,
        variantId: ObjectId
      }
    }
  ],
  
  // ĐỊA CHỈ GIAO HÀNG
  shippingAddress: {
    fullName: String,
    phone: String,
    province: String,
    district: String,
    ward: String,
    address: String,
    addressId: ObjectId
  },
  
  // THANH TOÁN
  paymentMethod: "COD" | "VNPAY" | "MOMO" | "ZALOPAY" | "PAYPAL" | "CREDIT_CARD",
  paymentStatus: "unpaid" | "paid" | "refunded" | "failed",
  paymentResult: {
    transactionId: String,
    paymentGateway: String,
    status: String,
    paidAt: Date,
    amount: Number,
    responseCode: String,
    bankCode: String
  },
  
  // GIÁ CẢ
  itemsPrice: Number,       // Tổng tiền sản phẩm
  shippingPrice: Number,    // Phí ship
  taxPrice: Number,         // Thuế VAT
  discountAmount: Number,   // Giảm giá
  couponCode: String,       // Mã giảm giá
  totalPrice: Number,       // Tổng cuối cùng
  
  // TRẠNG THÁI
  status: "pending_payment" | "payment_failed" | "pending" | "confirmed" | 
          "processing" | "ready_to_ship" | "shipping" | "delivered" | 
          "completed" | "cancelled" | "returned",
  
  // GIAO HÀNG
  shippingInfo: {
    carrier: String,
    trackingNumber: String,
    estimatedDelivery: Date,
    actualDelivery: Date,
    shippingMethod: String
  },
  
  // GHI CHÚ
  notes: String,            // Ghi chú của khách
  adminNotes: String,       // Ghi chú nội bộ
  cancelReason: String,     // Lý do hủy
  returnReason: String,     // Lý do trả hàng
  
  // LỊCH SỬ THAY ĐỔI
  statusHistory: [
    {
      status: String,
      timestamp: Date,
      actor: ObjectId,      // User ID của người thay đổi
      actorType: "user" | "admin" | "system",
      note: String
    }
  ],
  
  // TỒN KHO
  stockReserved: Boolean,
  stockReservedAt: Date,
  stockReleased: Boolean,
  
  // TỰ ĐỘNG HỦY
  autoCancel: {
    enabled: Boolean,
    scheduledAt: Date,
    reason: String
  },
  
  // TIMESTAMP
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎨 GỢI Ý THIẾT KẾ FRONTEND

### 1. Trang đặt hàng (Checkout)
```vue
<template>
  <div class="checkout-page">
    <!-- Bước 1: Xác nhận giỏ hàng -->
    <CartSummary :items="cartItems" />
    
    <!-- Bước 2: Chọn địa chỉ giao hàng -->
    <ShippingAddressForm v-model="shippingAddress" />
    
    <!-- Bước 3: Chọn phương thức thanh toán -->
    <PaymentMethodSelect v-model="paymentMethod" />
    
    <!-- Bước 4: Ghi chú -->
    <textarea v-model="notes" placeholder="Ghi chú cho shop..."></textarea>
    
    <!-- Tóm tắt giá -->
    <div class="order-summary">
      <div>Tạm tính: {{ formatPrice(itemsPrice) }}</div>
      <div>Phí vận chuyển: {{ formatPrice(shippingPrice) }}</div>
      <div>Giảm giá: -{{ formatPrice(discountAmount) }}</div>
      <div class="total">Tổng cộng: {{ formatPrice(totalPrice) }}</div>
    </div>
    
    <!-- Nút đặt hàng -->
    <button @click="createOrder" :disabled="loading">
      {{ paymentMethod === 'COD' ? 'Đặt hàng' : 'Thanh toán' }}
    </button>
  </div>
</template>

<script setup>
const createOrder = async () => {
  try {
    const orderData = {
      user: currentUser.value._id,
      orderItems: cartItems.value.map(item => ({
        product: item.product._id,
        name: item.product.name,
        sku: item.variant?.sku,
        qty: item.qty,
        price: item.price,
        image: item.product.images[0],
        variant: item.variant
      })),
      shippingAddress: shippingAddress.value,
      paymentMethod: paymentMethod.value,
      itemsPrice: itemsPrice.value,
      shippingPrice: shippingPrice.value,
      taxPrice: taxPrice.value,
      discountAmount: discountAmount.value,
      totalPrice: totalPrice.value,
      notes: notes.value
    };
    
    const response = await axios.post('/api/orders', orderData);
    
    if (response.success) {
      // Nếu COD → Chuyển tới trang xác nhận
      if (paymentMethod.value === 'COD') {
        router.push(`/order-success/${response.data._id}`);
      } 
      // Nếu online → Chuyển tới cổng thanh toán
      else {
        const paymentUrl = await getPaymentUrl(response.data._id);
        window.location.href = paymentUrl;
      }
      
      // Xóa giỏ hàng
      clearCart();
    }
  } catch (error) {
    console.error('Lỗi tạo đơn hàng:', error);
    alert('Không thể tạo đơn hàng. Vui lòng thử lại!');
  }
};
</script>
```

---

### 2. Trang theo dõi đơn hàng (Order Tracking)
```vue
<template>
  <div class="order-detail">
    <h2>Đơn hàng {{ order.orderNumber }}</h2>
    
    <!-- Stepper hiển thị trạng thái -->
    <OrderStatusStepper :current="order.status" />
    
    <!-- Thông tin vận chuyển -->
    <div v-if="order.shippingInfo?.trackingNumber" class="tracking-info">
      <p>Đơn vị vận chuyển: {{ order.shippingInfo.carrier }}</p>
      <p>Mã vận đơn: {{ order.shippingInfo.trackingNumber }}</p>
      <button @click="trackShipping">Tra cứu vận chuyển</button>
    </div>
    
    <!-- Danh sách sản phẩm -->
    <OrderItemsList :items="order.orderItems" />
    
    <!-- Lịch sử thay đổi -->
    <div class="status-history">
      <h3>Lịch sử đơn hàng</h3>
      <div v-for="history in order.statusHistory" :key="history._id">
        <span>{{ formatDate(history.timestamp) }}</span>
        <span>{{ translateStatus(history.status) }}</span>
        <span>{{ history.note }}</span>
      </div>
    </div>
    
    <!-- Hành động -->
    <div class="actions">
      <button v-if="canCancel(order)" @click="cancelOrder">Hủy đơn hàng</button>
      <button v-if="order.status === 'delivered'" @click="confirmReceived">
        Đã nhận hàng
      </button>
      <button v-if="order.status === 'completed'" @click="reviewProduct">
        Đánh giá sản phẩm
      </button>
    </div>
  </div>
</template>

<script setup>
const canCancel = (order) => {
  return ['pending', 'confirmed', 'pending_payment'].includes(order.status);
};

const cancelOrder = async () => {
  if (!confirm('Bạn có chắc muốn hủy đơn hàng?')) return;
  
  try {
    await axios.patch(`/api/orders/${order._id}/status`, {
      status: 'cancelled',
      note: 'Khách hàng yêu cầu hủy'
    });
    
    alert('Đã hủy đơn hàng thành công');
    fetchOrder(); // Reload data
  } catch (error) {
    alert('Không thể hủy đơn hàng');
  }
};

const confirmReceived = async () => {
  try {
    await axios.patch(`/api/orders/${order._id}/status`, {
      status: 'completed',
      note: 'Khách hàng xác nhận đã nhận hàng'
    });
    
    alert('Cảm ơn bạn đã xác nhận!');
    fetchOrder();
  } catch (error) {
    alert('Có lỗi xảy ra');
  }
};
</script>
```

---

## ⚠️ LƯU Ý QUAN TRỌNG

### 1. Xử lý tồn kho (Stock Management)
- Khi tạo đơn → **Reserve stock** (giữ số lượng sản phẩm)
- Khi hủy/thất bại → **Release stock** (trả lại số lượng)
- Khi hoàn thành → Giảm stock thực sự

```javascript
// Cần implement trong product service
await axios.post('/api/products/reserve-stock', {
  items: order.orderItems.map(item => ({
    productId: item.product,
    variantId: item.variant?.variantId,
    qty: item.qty
  }))
});
```

---

### 2. Auto-cancel sau 24h nếu không thanh toán (Online payment)
```javascript
// Cron job chạy mỗi giờ
const autoCancelOrders = async () => {
  const now = new Date();
  const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);
  
  const expiredOrders = await Order.find({
    status: 'pending_payment',
    createdAt: { $lt: oneDayAgo }
  });
  
  for (const order of expiredOrders) {
    order.addStatusHistory('cancelled', null, 'system', 
      'Tự động hủy do quá thời gian thanh toán');
    await order.save();
    
    // Release stock
    await releaseStock(order.orderItems);
  }
};
```

---

### 3. Webhook Payment Gateway
```javascript
// Route nhận webhook từ VNPAY/MOMO
router.post('/payment-callback', async (req, res) => {
  const { orderId, transactionId, status, amount, signature } = req.body;
  
  // 1. Verify signature từ payment gateway
  if (!verifySignature(req.body, signature)) {
    return res.status(400).json({ success: false });
  }
  
  // 2. Cập nhật đơn hàng
  const order = await Order.findById(orderId);
  
  if (status === 'SUCCESS') {
    order.paymentStatus = 'paid';
    order.paymentResult = { transactionId, amount, paidAt: new Date() };
    order.addStatusHistory('pending', null, 'system', 'Thanh toán thành công');
  } else {
    order.addStatusHistory('payment_failed', null, 'system', 'Thanh toán thất bại');
  }
  
  await order.save();
  
  res.json({ success: true });
});
```

---

### 4. Gửi Email/SMS thông báo
```javascript
// Sau mỗi lần thay đổi trạng thái
const sendOrderNotification = async (order, status) => {
  const user = await User.findById(order.user);
  
  const messages = {
    confirmed: 'Đơn hàng của bạn đã được xác nhận',
    shipping: `Đơn hàng đang được giao. Mã vận đơn: ${order.shippingInfo.trackingNumber}`,
    delivered: 'Đơn hàng đã được giao. Vui lòng xác nhận đã nhận hàng',
    completed: 'Cảm ơn bạn đã mua hàng. Hãy đánh giá sản phẩm nhé!'
  };
  
  // Gửi email
  await sendEmail({
    to: user.email,
    subject: `[SmartBuy] ${messages[status]}`,
    body: renderEmailTemplate(order, status)
  });
  
  // Gửi SMS (optional)
  if (user.phone) {
    await sendSMS(user.phone, messages[status]);
  }
};
```

---

## 🚀 CHECKLIST TRIỂN KHAI

- [ ] Tạo API tạo đơn hàng (POST /api/orders)
- [ ] Tạo API lấy danh sách đơn (GET /api/orders với filter)
- [ ] Tạo API chi tiết đơn (GET /api/orders/:id)
- [ ] Tạo API cập nhật trạng thái (PATCH /api/orders/:id/status)
- [ ] Implement xử lý hủy đơn (release stock, refund)
- [ ] Tích hợp payment gateway (VNPAY/MOMO)
- [ ] Xử lý webhook payment
- [ ] Implement reserve/release stock
- [ ] Auto-cancel đơn quá hạn (cronjob)
- [ ] Gửi email/SMS thông báo
- [ ] Frontend: Trang checkout
- [ ] Frontend: Trang theo dõi đơn hàng
- [ ] Frontend: Lịch sử đơn hàng
- [ ] Testing toàn bộ luồng

---

## 📞 HỖ TRỢ

Nếu có thắc mắc về schema hoặc cách xử lý, vui lòng tham khảo:
- **Order Model**: `src/models/Order.js`
- **Controller**: `src/controllers/orderController.js`
- **Routes**: `src/routes/orders.js`

**Liên hệ:** Phần backend order đã được implement đầy đủ, frontend chỉ cần gọi API theo đúng format trong tài liệu này.

---

**Cập nhật lần cuối:** 15/11/2025
**Version:** 1.0.0
