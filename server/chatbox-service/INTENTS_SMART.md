# 🎯 INTENTS THÔNG MINH - DỰA TRÊN DATABASE THỰC TẾ

> **Generated from actual database structure and business logic**
> **Date**: November 20, 2025
> **Total Intents**: 20 intents

---

## 📋 **DANH SÁCH INTENTS**

| STT | Intent Name | Webhook | Parameters | Priority |
|-----|-------------|---------|------------|----------|
| 1 | Default Welcome Intent | ❌ | - | HIGH |
| 2 | Default Fallback Intent | ❌ | - | HIGH |
| 3 | product.search | ✅ | category, brand, price | HIGH |
| 4 | product.search.by-brand | ✅ | brand, category | HIGH |
| 5 | product.search.by-price | ✅ | price-range, category | HIGH |
| 6 | product.search.by-color | ✅ | color, brand | MEDIUM |
| 7 | product.search.by-memory | ✅ | memory, brand | MEDIUM |
| 8 | product.search.by-specs | ✅ | spec-name, brand | MEDIUM |
| 9 | product.detail | ✅ | product-name | MEDIUM |
| 10 | product.compare | ✅ | product-1, product-2 | LOW |
| 11 | order.track | ✅ | order-id | HIGH |
| 12 | order.check-status | ✅ | order-status | MEDIUM |
| 13 | order.cancel | ✅ | order-id | MEDIUM |
| 14 | promotion.check | ✅ | - | HIGH |
| 15 | policy.shipping | ❌ | - | MEDIUM |
| 16 | policy.return | ❌ | - | MEDIUM |
| 17 | policy.warranty | ❌ | - | MEDIUM |
| 18 | policy.payment | ❌ | - | LOW |
| 19 | store.location | ❌ | location | LOW |
| 20 | contact.support | ❌ | - | MEDIUM |

---

## 🤖 **1. DEFAULT WELCOME INTENT**

```yaml
Intent Name: Default Welcome Intent
Enable Webhook: NO (Static Response)
Training Phrases:
  - "Xin chào"
  - "Hello"
  - "Hi"
  - "Chào bạn"
  - "Chào shop"
  - "Hey"
  - "Cho tôi hỏi"
  - "Tôi muốn mua điện thoại"
  - "Hỗ trợ"

Responses:
  Custom Payload (Rich Content):
```json
{
  "richContent": [
    [
      {
        "type": "info",
        "title": "Xin chào! 👋 Tôi là SmartBuy Assistant",
        "subtitle": "Trợ lý mua sắm điện thoại thông minh của bạn!",
        "image": {
          "src": {
            "rawUrl": "https://i.imgur.com/smartbuy-logo.png"
          }
        }
      },
      {
        "type": "description",
        "title": "💬 Tôi có thể giúp bạn:",
        "text": [
          "📱 Tìm kiếm điện thoại (Hãng, giá, màu sắc)",
          "📦 Tra cứu đơn hàng",
          "🎁 Xem chương trình khuyến mãi",
          "📋 Tư vấn chính sách (Giao hàng, đổi trả, bảo hành)"
        ]
      },
      {
        "type": "chips",
        "options": [
          {"text": "Tìm iPhone dưới 20tr"},
          {"text": "Điện thoại Samsung giá rẻ"},
          {"text": "Tra đơn hàng"},
          {"text": "Khuyến mãi hot"}
        ]
      }
    ]
  ]
}
```
```

---

## 🔍 **2. PRODUCT SEARCH - TÌM THEO NHIỀU TIÊU CHÍ**

### **2.1. product.search (Tìm kiếm tổng hợp)**

```yaml
Intent Name: product.search
Enable Webhook: YES
Priority: HIGH

Training Phrases (30+ examples):
  # Tìm chung
  - "Tìm điện thoại"
  - "Có điện thoại nào không"
  - "Xem điện thoại"
  - "Cho tôi xem điện thoại"
  - "Tôi muốn mua điện thoại"
  - "Có điện thoại nào"
  - "Xem dt"
  - "Tôi cần mua điện thoại"
  
  # Tìm theo hãng (với giá trị thực tế)
  - "Tìm điện thoại Samsung"
  - "Có iPhone nào không"
  - "Xiaomi giá bao nhiêu"
  - "Xem OPPO"
  - "Điện thoại Apple"
  - "Có Vivo nào hot không"
  - "Realme có gì"
  - "Điện thoại của Samsung"
  - "iPhone mới nhất"
  - "Xem dt Samsung"
  
  # Tìm theo giá (với giá trị thực tế)
  - "Điện thoại dưới 10 triệu"
  - "Tìm điện thoại từ 5 đến 10 triệu"
  - "Samsung dưới 15 triệu"
  - "Có điện thoại nào dưới 3 triệu không"
  - "Điện thoại giá rẻ"
  - "Điện thoại tầm 20 triệu"
  - "iPhone dưới 20 triệu"
  - "Điện thoại cao cấp"
  
  # Kết hợp hãng + giá
  - "Tìm Samsung dưới 10 triệu"
  - "iPhone từ 15 đến 20 triệu"
  - "Xiaomi giá rẻ"
  - "OPPO tầm trung"
  - "Samsung cao cấp"
  
  # Kết hợp với màu
  - "Samsung màu đen dưới 10 triệu"
  - "iPhone màu hồng"
  - "Điện thoại màu xanh"
  - "Xiaomi có màu trắng không"

Parameters:
  - product-category (@product-category) - Optional
  - brand (@brand-name) - Optional
  - price_range (@price-range) - Optional
  - max_price (@sys.number-integer) - Optional
  - color (@color-name) - Optional

Webhook Fulfillment: YES
→ Handler: intentHandlers.handleProductSearch()
```

**Webhook Response Example**:
```json
{
  "fulfillmentMessages": [
    {
      "text": {
        "text": ["Tìm được 12 sản phẩm Samsung dưới 10 triệu:"]
      }
    },
    {
      "payload": {
        "richContent": [[
          {
            "type": "info",
            "title": "Samsung Galaxy A54 5G",
            "subtitle": "8.990.000₫ (-10%)",
            "image": { "src": { "rawUrl": "..." }},
            "actionLink": "https://smartbuy.com/product/galaxy-a54"
          }
        ]]
      }
    },
    {
      "payload": {
        "richContent": [[
          {
            "type": "chips",
            "options": [
              { "text": "Xem thêm Galaxy" },
              { "text": "So sánh với iPhone" },
              { "text": "Kiểm tra khuyến mãi" }
            ]
          }
        ]]
      }
    }
  ]
}
```

---

### **2.2. product.search.by-brand (Tìm theo hãng)**

```yaml
Intent Name: product.search.by-brand
Enable Webhook: YES
Priority: HIGH

Training Phrases (20+ examples):
  # Apple/iPhone
  - "Điện thoại iPhone có gì"
  - "iPhone mới nhất"
  - "iPhone giá rẻ"
  - "Xem iPhone"
  - "Có Apple nào hot không"
  - "iPhone bán chạy"
  - "iPhone flagship"
  - "ip cao cấp"
  - "Điện thoại của Apple"
  - "iPhone ra mắt mới"
  - "iPhone 2024"
  - "Apple 2025"
  
  # Samsung
  - "Điện thoại Samsung có gì"
  - "Samsung mới nhất"
  - "Samsung giá rẻ"
  - "Xem Samsung"
  - "Có Samsung nào hot không"
  - "Galaxy bán chạy"
  - "Samsung flagship"
  - "Samsung cao cấp"
  - "Samsung tầm trung"
  - "SS giá tốt"
  
  # Xiaomi
  - "Điện thoại Xiaomi có gì"
  - "Xiaomi mới nhất"
  - "Xiaomi giá rẻ"
  - "Xem Xiaomi"
  - "Có Redmi nào hot không"
  - "Xiaomi bán chạy"
  - "Mi flagship"
  - "Tiểu Mễ tầm trung"
  
  # OPPO/Vivo/Realme
  - "Điện thoại OPPO có gì"
  - "OPPO mới nhất"
  - "Vivo giá rẻ"
  - "Xem Realme"
  - "Có Vivo nào hot không"
  - "Realme bán chạy"
  - "OPPO cao cấp"

Parameters:
  - brand (@brand-name) - REQUIRED ✅
  - category (@product-category) - Optional (default: dien-thoai)

Webhook: YES
```

---

### **2.3. product.search.by-price (Tìm theo giá)**

```yaml
Intent Name: product.search.by-price
Enable Webhook: YES
Priority: HIGH

Training Phrases (30+ examples):
  # Theo khoảng giá cụ thể
  - "Điện thoại dưới 3 triệu"
  - "Tìm điện thoại từ 3 đến 5 triệu"
  - "Điện thoại từ 5 đến 10 triệu"
  - "Có điện thoại nào từ 10 đến 15 triệu không"
  - "Điện thoại từ 15 đến 20 triệu"
  - "Tìm điện thoại từ 20 đến 30 triệu"
  - "Điện thoại trên 30 triệu"
  - "Điện thoại giá rẻ"
  - "Điện thoại tầm trung"
  - "Điện thoại cao cấp"
  - "Điện thoại flagship"
  - "Điện thoại bình dân"
  
  # Kết hợp hãng + giá
  - "Samsung dưới 10 triệu"
  - "iPhone dưới 20 triệu"
  - "Xiaomi giá rẻ"
  - "OPPO tầm trung"
  - "Apple cao cấp"
  - "Có Samsung nào dưới 15 triệu không"
  - "Dưới 5 triệu có Xiaomi nào"
  
  # Theo số tiền cụ thể (sys.number)
  - "Điện thoại dưới 5 triệu"
  - "Điện thoại từ 10 đến 15 triệu"
  - "Điện thoại giá 8 triệu"
  - "Điện thoại tầm 12 triệu"
  - "Điện thoại khoảng 20 triệu"
  - "Điện thoại 7 triệu"
  - "dt tầm 10tr"
  - "Điện thoại dưới 10tr"
  - "dt từ 5 đến 10 củ"

Parameters:
  - price_range (@price-range) - Optional
  - min_price (@sys.number-integer) - Optional
  - max_price (@sys.number-integer) - Optional
  - brand (@brand-name) - Optional

Webhook: YES

⚠️ Parameter Extraction Logic:
  IF price_range exists → Use price_range
  ELSE IF min_price AND max_price exist → Use numeric range
  ELSE IF max_price only → Search price <= max_price
```

---

### **2.4. product.search.by-color (Tìm theo màu)**

```yaml
Intent Name: product.search.by-color
Enable Webhook: YES
Priority: MEDIUM

Training Phrases (25+ examples):
  # Màu cơ bản
  - "Điện thoại màu đen"
  - "Điện thoại màu trắng"
  - "Điện thoại màu xanh"
  - "Điện thoại màu hồng"
  - "Điện thoại màu xám"
  - "Điện thoại màu vàng"
  - "Điện thoại màu bạc"
  - "Điện thoại màu tím"
  - "Điện thoại màu đỏ"
  
  # Kết hợp hãng + màu
  - "iPhone màu đen"
  - "Samsung màu trắng"
  - "Có iPhone màu hồng không"
  - "Xiaomi màu xanh"
  - "OPPO màu bạc"
  - "Vivo màu tím"
  - "Realme màu đỏ"
  - "Apple màu vàng"
  - "Galaxy màu xám"
  
  # Kết hợp màu + giá
  - "Điện thoại màu đen giá rẻ"
  - "iPhone màu trắng dưới 20 triệu"
  - "Samsung màu hồng tầm trung"
  - "Điện thoại màu xanh dưới 10 triệu"
  
  # Thứ tự đảo
  - "Đen iPhone"
  - "Trắng Samsung"
  - "Hồng Xiaomi"
  - "Tìm điện thoại đen"
  - "Xem điện thoại trắng"

Parameters:
  - color (@color-name) - REQUIRED ✅
  - brand (@brand-name) - Optional
  - price_range (@price-range) - Optional

Webhook: YES
```

---

### **2.5. product.search.by-memory (Tìm theo dung lượng)**

```yaml
Intent Name: product.search.by-memory
Enable Webhook: YES
Priority: MEDIUM

Training Phrases (30+ examples):
  # ROM/Bộ nhớ trong
  - "Điện thoại 128GB"
  - "Điện thoại 256GB"
  - "Điện thoại 512GB"
  - "Điện thoại 64GB"
  - "Điện thoại 1TB"
  - "Điện thoại 32GB"
  - "Tìm điện thoại 128GB"
  - "Tìm điện thoại 256GB"
  - "Điện thoại dung lượng 512GB"
  - "dt 128gb"
  - "dt 256g"
  
  # RAM
  - "Điện thoại RAM 8GB"
  - "Điện thoại RAM 6GB"
  - "Điện thoại RAM 12GB"
  - "Điện thoại RAM 4GB"
  - "Điện thoại 8GB RAM"
  - "Điện thoại 6 GB RAM"
  
  # Kết hợp hãng + memory
  - "iPhone 128GB"
  - "Samsung 256GB"
  - "Có iPhone 512GB không"
  - "Xiaomi 128GB"
  - "OPPO RAM 8GB"
  - "Vivo 256GB"
  - "Samsung RAM 12GB"
  - "Apple 1TB"
  
  # Kết hợp memory + giá
  - "Điện thoại 128GB giá rẻ"
  - "Điện thoại 256GB dưới 10 triệu"
  - "Samsung 128GB tầm trung"
  - "iPhone 512GB dưới 30 triệu"
  
  # Thứ tự đảo
  - "128GB Samsung"
  - "256GB iPhone"
  - "8GB RAM Xiaomi"

Parameters:
  - memory (@memory-capacity) - REQUIRED ✅
  - brand (@brand-name) - Optional
  - price_range (@price-range) - Optional

Webhook: YES
```

---

### **2.6. product.search.by-specs (Tìm theo thông số)**

```yaml
Intent Name: product.search.by-specs
Enable Webhook: YES
Priority: MEDIUM

Training Phrases (35+ examples):
  # Màn hình
  - "Điện thoại màn hình tốt"
  - "Điện thoại màn hình đẹp"
  - "Điện thoại màn hình lớn"
  - "Samsung màn hình như nào"
  - "iPhone màn hình đẹp"
  - "Tìm điện thoại màn hình cao cấp"
  - "Màn hình của Samsung"
  - "Điện thoại màn hình giá rẻ"
  - "dt màn hình đẹp"
  
  # Camera sau/chính
  - "Điện thoại camera tốt"
  - "Điện thoại camera đẹp"
  - "Điện thoại camera sau mạnh"
  - "Samsung camera như nào"
  - "iPhone camera chụp đẹp"
  - "Tìm điện thoại camera cao cấp"
  - "Camera của Xiaomi"
  - "Điện thoại camera giá rẻ"
  - "dt chụp hình đẹp"
  - "Điện thoại camera chính tốt"
  
  # Camera trước/Selfie
  - "Điện thoại camera selfie tốt"
  - "Điện thoại camera trước đẹp"
  - "OPPO camera selfie như nào"
  - "Camera trước của Vivo"
  - "dt selfie đẹp"
  
  # Chip/Vi xử lý
  - "Điện thoại chip mạnh"
  - "Điện thoại chip tốt"
  - "Điện thoại vi xử lý cao cấp"
  - "iPhone chip như nào"
  - "Samsung chip mạnh"
  - "Chip của Xiaomi"
  - "dt chip tốt"
  
  # Pin
  - "Điện thoại pin trâu"
  - "Điện thoại pin tốt"
  - "Điện thoại pin khỏe"
  - "Điện thoại pin lâu"
  - "Samsung pin như nào"
  - "iPhone pin tốt"
  - "Pin của Xiaomi"
  - "Điện thoại pin giá rẻ"
  - "dt pin trâu"
  - "Điện thoại dung lượng pin lớn"

Parameters:
  - spec_name (@product-spec) - REQUIRED ✅
  - brand (@brand-name) - Optional

Webhook: YES

Examples:
  - "Điện thoại camera tốt" → spec_name: "camera-sau"
  - "iPhone pin trâu" → brand: "apple", spec_name: "pin"
  - "Samsung màn hình đẹp" → brand: "samsung", spec_name: "man-hinh"
```

---

### **2.7. product.detail (Chi tiết sản phẩm)**

```yaml
Intent Name: product.detail
Enable Webhook: YES
Priority: MEDIUM

Training Phrases (30+ examples):
  # iPhone
  - "Cho tôi xem chi tiết iPhone 15"
  - "Thông số kỹ thuật của iPhone 16"
  - "iPhone 16 Pro Max có gì đặc biệt"
  - "Review iPhone 15"
  - "iPhone 16 giá bao nhiêu"
  - "Đánh giá iPhone 16 Pro Max"
  - "iPhone 15 có tốt không"
  - "Xem iPhone 16"
  - "Chi tiết ip 15"
  
  # Samsung Galaxy
  - "Cho tôi xem chi tiết Galaxy S24 Ultra"
  - "Thông số kỹ thuật của Galaxy S24"
  - "Galaxy A54 có gì đặc biệt"
  - "Review Samsung S24 Ultra"
  - "Galaxy S24 giá bao nhiêu"
  - "Đánh giá S24 Ultra"
  - "Galaxy A54 có tốt không"
  - "Xem Galaxy S24"
  - "Chi tiết S24 Ultra"
  
  # Xiaomi
  - "Cho tôi xem chi tiết Xiaomi 14T"
  - "Thông số kỹ thuật của Redmi Note 13"
  - "Xiaomi 14T có gì đặc biệt"
  - "Review Redmi Note 13"
  - "Xiaomi 14T giá bao nhiêu"
  - "Đánh giá Mi 14T"
  
  # OPPO/Vivo/Realme
  - "Cho tôi xem chi tiết OPPO Find N3 Flip"
  - "Thông số kỹ thuật của OPPO A17k"
  - "Vivo V30 có gì đặc biệt"
  - "Review Realme C67"
  - "OPPO A17k giá bao nhiêu"
  - "Đánh giá Vivo V30"
  - "Realme C67 có tốt không"

Parameters:
  - product_name (@product-name) - REQUIRED ✅

Webhook: YES
```

---

### **2.8. product.compare (So sánh sản phẩm)**

```yaml
Intent Name: product.compare
Enable Webhook: YES
Priority: LOW

Training Phrases (25+ examples):
  # So sánh iPhone vs Samsung
  - "So sánh iPhone 15 và Galaxy S24"
  - "iPhone 16 khác gì Galaxy S24 Ultra"
  - "Cái nào tốt hơn giữa iPhone 15 và Samsung S24"
  - "iPhone 16 Pro Max với Galaxy S24 Ultra"
  - "Nên mua iPhone 15 hay Samsung S24"
  - "So sánh ip 15 và s24"
  
  # So sánh trong cùng hãng
  - "So sánh iPhone 15 và iPhone 16"
  - "Galaxy S24 khác gì Galaxy S24 Ultra"
  - "iPhone 16 với iPhone 16 Pro Max"
  - "Nên mua Galaxy S24 hay Galaxy A54"
  - "So sánh Xiaomi 14T và Redmi Note 13"
  
  # So sánh các hãng khác
  - "So sánh Xiaomi 14T và OPPO Find N3 Flip"
  - "Samsung S24 khác gì Xiaomi 14T"
  - "Cái nào tốt hơn giữa Vivo V30 và Realme C67"
  - "OPPO A17k với Realme C67"
  - "Nên mua Xiaomi hay OPPO"
  
  # So sánh giá
  - "So sánh iPhone 15 và Galaxy A54"
  - "Xiaomi 14T khác gì Samsung S24"
  - "iPhone dưới 20 triệu với Samsung dưới 20 triệu"
  
  # Câu hỏi ngắn gọn
  - "So sánh ip 15 và s24"
  - "iPhone hay Samsung"
  - "Xiaomi hay OPPO"
  - "Galaxy S24 hay iPhone 15"

Parameters:
  - product_1 (@product-name) - REQUIRED ✅
  - product_2 (@product-name) - REQUIRED ✅

Webhook: YES
```

---

## 📦 **3. ORDER MANAGEMENT - QUẢN LÝ ĐƠN HÀNG**

### **3.1. order.track (Tra cứu đơn hàng)**

```yaml
Intent Name: order.track
Enable Webhook: YES
Priority: HIGH

Training Phrases (20+ examples):
  # Với mã đơn cụ thể
  - "Kiểm tra đơn hàng ORD-20241120-A1B2C3"
  - "Đơn hàng ORD-20241115-XYZ123 của tôi đâu rồi"
  - "Tra đơn ORD-20241118-ABC456"
  - "Order ORD-20241120-DEF789"
  - "Đơn ORD-20241119-GHI012 đến đâu rồi"
  - "Xem đơn hàng ORD-20241117-JKL345"
  - "ORD-20241120-MNO678 đến đâu"
  - "Kiểm tra mã đơn ORD-20241116-PQR901"
  
  # Không có mã đơn (sẽ prompt)
  - "Kiểm tra đơn hàng"
  - "Tra đơn hàng của tôi"
  - "Đơn hàng của tôi đâu rồi"
  - "Xem đơn hàng"
  - "Đơn hàng đến đâu rồi"
  - "Kiểm tra tình trạng đơn"
  - "Mã đơn hàng"
  - "Tra cứu đơn hàng"
  - "Xem trạng thái đơn"
  - "Order của tôi"
  - "Đơn hàng tôi mua"
  - "Kiểm tra order"

Parameters:
  - order_id (@order-id) - REQUIRED ✅
  - Regex Pattern: ORD-\d{8}-[A-F0-9]{6}

Webhook: YES
→ Handler: intentHandlers.handleOrderTracking()

Prompts (nếu thiếu order_id):
  - "Vui lòng cho mình biết mã đơn hàng của bạn (dạng ORD-YYYYMMDD-XXXXXX)"
  - "Bạn có thể tìm mã đơn hàng trong email xác nhận hoặc mục 'Đơn hàng của tôi' nhé!"
```

**Webhook Response Example**:
```json
{
  "fulfillmentText": "Đơn hàng ORD-20241120-A1B2C3 của bạn:",
  "fulfillmentMessages": [
    {
      "payload": {
        "richContent": [[
          {
            "type": "info",
            "title": "📦 Đơn hàng ORD-20241120-A1B2C3",
            "subtitle": "Trạng thái: Đang giao hàng 🚚\nDự kiến: 22/11/2024\nTổng tiền: 25.990.000₫"
          },
          {
            "type": "accordion",
            "title": "Chi tiết đơn hàng",
            "text": "• iPhone 15 128GB Hồng x1\n• Giá: 25.990.000₫\n• Địa chỉ: 123 Nguyễn Văn Linh, Q7, HCM"
          }
        ]]
      }
    }
  ]
}
```

---

### **3.2. order.check-status (Kiểm tra trạng thái)**

```yaml
Intent Name: order.check-status
Enable Webhook: YES
Priority: MEDIUM

Training Phrases (25+ examples):
  # Trạng thái chờ xác nhận
  - "Đơn hàng của tôi chờ xác nhận chưa"
  - "Có đơn nào chờ xác nhận không"
  - "Kiểm tra đơn chờ xác nhận"
  - "Đơn hàng chờ duyệt"
  
  # Trạng thái đã xác nhận
  - "Đơn hàng của tôi đã xác nhận chưa"
  - "Có đơn nào đã xác nhận không"
  - "Đơn hàng đã duyệt"
  - "Shop duyệt đơn chưa"
  
  # Trạng thái đang chuẩn bị
  - "Đơn hàng của tôi đang chuẩn bị chưa"
  - "Có đơn nào đang đóng gói không"
  - "Đơn hàng đang xử lý"
  
  # Trạng thái đang giao
  - "Đơn hàng của tôi đang giao chưa"
  - "Có đơn nào đang ship không"
  - "Kiểm tra đơn đang vận chuyển"
  - "Đơn hàng đang giao hàng"
  
  # Trạng thái đã giao
  - "Đơn hàng của tôi đã giao chưa"
  - "Có đơn nào đã nhận hàng không"
  - "Đơn hàng giao thành công"
  
  # Trạng thái hoàn thành
  - "Đơn hàng của tôi hoàn thành chưa"
  - "Có đơn nào đã hoàn thành không"
  - "Xem đơn hoàn tất"
  
  # Trạng thái hủy
  - "Đơn hàng của tôi đã hủy chưa"
  - "Có đơn nào bị hủy không"
  - "Xem đơn hủy"

Parameters:
  - status (@order-status) - Optional

Webhook: YES

Context: user-authenticated (Require login)
```

---

### **3.3. order.cancel (Hủy đơn hàng)**

```yaml
Intent Name: order.cancel
Enable Webhook: YES
Priority: MEDIUM

Training Phrases (20+ examples):
  # Với mã đơn cụ thể
  - "Tôi muốn hủy đơn ORD-20241120-A1B2C3"
  - "Hủy đơn hàng ORD-20241115-XYZ123"
  - "Cancel order ORD-20241118-ABC456"
  - "Không muốn mua ORD-20241119-DEF789 nữa"
  - "Hủy ORD-20241120-GHI012"
  - "Huỷ đơn ORD-20241117-JKL345"
  - "Không lấy ORD-20241116-MNO678 nữa"
  
  # Không có mã đơn (sẽ prompt)
  - "Tôi muốn hủy đơn"
  - "Hủy đơn hàng"
  - "Huỷ đơn"
  - "Cancel order"
  - "Không muốn mua nữa"
  - "Không lấy hàng"
  - "Huỷ đơn hàng của tôi"
  - "Tôi muốn huỷ"
  - "Không mua nữa"
  - "Không cần nữa"
  - "Huỷ order"
  - "Tôi đổi ý"
  - "Không lấy đơn"

Parameters:
  - order_id (@order-id) - REQUIRED ✅

Webhook: YES
→ Handler: intentHandlers.handleOrderCancel()

⚠️ Business Logic:
  - Chỉ cho phép hủy khi status = "pending" hoặc "confirmed"
  - Nếu status = "shipping" → Không thể hủy, phải đổi trả
```

---

## 🎁 **4. PROMOTION - KHUYẾN MÃI**

### **4.1. promotion.check (Kiểm tra khuyến mãi)**

```yaml
Intent Name: promotion.check
Enable Webhook: YES
Priority: HIGH

Training Phrases (35+ examples):
  # Chung chung
  - "Có khuyến mãi gì không"
  - "Flash sale hôm nay"
  - "Mã giảm giá"
  - "Ưu đãi gì hot"
  - "Có sale gì không"
  - "Giảm giá gì"
  - "Voucher"
  - "Mã giảm"
  - "Khuyến mãi hôm nay"
  - "Có giảm giá không"
  - "Ưu đãi"
  - "Sale sốc"
  - "Giờ vàng"
  - "Giá sốc"
  
  # Theo hãng
  - "Khuyến mãi iPhone"
  - "iPhone có giảm giá không"
  - "Khuyến mãi Samsung"
  - "Samsung có sale không"
  - "Khuyến mãi Xiaomi"
  - "OPPO có giảm giá không"
  - "Vivo khuyến mãi gì"
  - "Realme giảm giá"
  - "Apple sale"
  - "Galaxy khuyến mãi"
  
  # Theo loại khuyến mãi
  - "Có giảm giá trực tiếp không"
  - "Trả góp 0%"
  - "Có quà tặng không"
  - "Tặng kèm gì"
  - "Có hoàn tiền không"
  - "Miễn phí ship"
  - "Free ship"
  - "Cashback"
  - "Tích điểm"
  - "Hoàn xu"

Parameters:
  - brand (@brand-name) - Optional
  - promotion_type (@promotion-type) - Optional

Webhook: YES
```

---

## 📋 **5. POLICY - CHÍNH SÁCH (STATIC RESPONSES)**

### **5.1. policy.shipping**

```yaml
Intent Name: policy.shipping
Enable Webhook: NO
Priority: MEDIUM

Training Phrases (25+ examples):
  - "Chính sách giao hàng"
  - "Giao hàng mất bao lâu"
  - "Phí ship bao nhiêu"
  - "Có giao hàng miễn phí không"
  - "Giao hàng như thế nào"
  - "Ship COD"
  - "Giao hàng toàn quốc không"
  - "Miễn phí vận chuyển"
  - "Free ship"
  - "Ship miễn phí"
  - "Giao hàng nhanh không"
  - "Bao lâu thì nhận hàng"
  - "Thời gian giao hàng"
  - "Giao hàng tận nơi"
  - "Đơn vị vận chuyển"
  - "Giao hàng bằng gì"
  - "Shipper nào"
  - "Phí giao hàng"
  - "Chi phí ship"
  - "Cước ship"
  - "Giao hàng Hà Nội"
  - "Giao hàng Sài Gòn"
  - "Giao hàng HCM"
  - "Giao hàng tỉnh"
  - "Có giao COD không"

Responses:
  Custom Payload (Rich Content):
```json
{
  "richContent": [
    [
      {
        "type": "info",
        "title": "📦 CHÍNH SÁCH GIAO HÀNG",
        "subtitle": "Giao hàng toàn quốc - Hỗ trợ COD"
      },
      {
        "type": "accordion",
        "title": "✅ Phí ship",
        "text": "• Miễn phí với đơn từ 500.000đ\n• 30.000đ với đơn dưới 500.000đ"
      },
      {
        "type": "accordion",
        "title": "⏰ Thời gian giao hàng",
        "text": "• Nội thành HCM/HN: 1-2 ngày\n• Ngoại thành: 3-5 ngày\n• Vùng xa: 5-7 ngày"
      },
      {
        "type": "accordion",
        "title": "🚚 Đơn vị vận chuyển",
        "text": "• Giao Hàng Nhanh\n• Viettel Post\n• J&T Express"
      },
      {
        "type": "chips",
        "options": [
          {"text": "Chính sách đổi trả"},
          {"text": "Chính sách bảo hành"},
          {"text": "Tìm điện thoại"}
        ]
      }
    ]
  ]
}
```
```

---

### **5.2. policy.return**

```yaml
Intent Name: policy.return
Enable Webhook: NO

Training Phrases (25+ examples):
  - "Chính sách đổi trả"
  - "Đổi trả trong bao lâu"
  - "Sản phẩm lỗi thì sao"
  - "Hoàn tiền như thế nào"
  - "Trả hàng được không"
  - "Đổi hàng như nào"
  - "Chính sách đổi hàng"
  - "Chính sách trả hàng"
  - "Đổi máy lỗi"
  - "Trả hàng lỗi"
  - "Điều kiện đổi trả"
  - "Máy lỗi đổi được không"
  - "Hoàn tiền khi nào"
  - "Phí đổi trả"
  - "Có mất phí đổi trả không"
  - "Miễn phí đổi trả"
  - "7 ngày đổi trả"
  - "Thời gian đổi trả"
  - "Cách đổi hàng"
  - "Cách trả hàng"
  - "Đổi sản phẩm"
  - "Trả sản phẩm"
  - "Không vừa ý đổi được không"
  - "Máy bị lỗi"
  - "Hàng bị hỏng"

Responses:
  Custom Payload (Rich Content):
```json
{
  "richContent": [
    [
      {
        "type": "info",
        "title": "🔄 CHÍNH SÁCH ĐỔI TRẢ",
        "subtitle": "Đổi trả trong 7 ngày - 100% miễn phí với sản phẩm lỗi"
      },
      {
        "type": "accordion",
        "title": "✅ Điều kiện đổi trả",
        "text": "• Đổi trả trong 7 ngày kể từ khi nhận hàng\n• Giữ nguyên hộp, phụ kiện đầy đủ\n• Máy chưa qua sử dụng (với lỗi do NSX)"
      },
      {
        "type": "accordion",
        "title": "🆓 Miễn phí đổi trả",
        "text": "• Đổi trả 100% miễn phí với sản phẩm lỗi\n• Shop chịu phí ship 2 chiều"
      },
      {
        "type": "accordion",
        "title": "💰 Chính sách hoàn tiền",
        "text": "• Hoàn tiền sau 3-5 ngày làm việc\n• Chuyển khoản về tài khoản đã thanh toán"
      },
      {
        "type": "description",
        "title": "📞 Hotline hỗ trợ: 1900.9999",
        "text": ["Thời gian: 8:00 - 22:00 (Tất cả các ngày)"]
      },
      {
        "type": "chips",
        "options": [
          {"text": "Chính sách bảo hành"},
          {"text": "Chính sách giao hàng"},
          {"text": "Tìm điện thoại"}
        ]
      }
    ]
  ]
}
```
```

---

### **5.3. policy.warranty**

```yaml
Intent Name: policy.warranty
Enable Webhook: NO

Training Phrases (25+ examples):
  - "Chính sách bảo hành"
  - "Bảo hành bao lâu"
  - "Bảo hành ở đâu"
  - "Bảo hành như nào"
  - "Bảo hành chính hãng không"
  - "Thời gian bảo hành"
  - "Chế độ bảo hành"
  - "Bảo hành 1 năm"
  - "Bảo hành 2 năm"
  - "Bảo hành 12 tháng"
  - "Bảo hành 24 tháng"
  - "Trung tâm bảo hành"
  - "TTBH ở đâu"
  - "Bảo hành iPhone"
  - "Bảo hành Samsung"
  - "Bảo hành Apple"
  - "Đổi mới 1-1"
  - "Đổi mới 30 ngày"
  - "Bảo hành toàn quốc"
  - "Chế độ đổi mới"
  - "Sửa chữa bảo hành"
  - "Máy lỗi bảo hành"
  - "Cách bảo hành"
  - "Quy định bảo hành"
  - "Tra cứu bảo hành"

Responses:
  Custom Payload (Rich Content):
```json
{
  "richContent": [
    [
      {
        "type": "info",
        "title": "⚡ CHÍNH SÁCH BẢO HÀNH",
        "subtitle": "Bảo hành chính hãng 12-24 tháng"
      },
      {
        "type": "accordion",
        "title": "🏢 Bảo hành chính hãng",
        "text": "• Điện thoại: 12-24 tháng (tùy hãng)\n• Phụ kiện: 6-12 tháng"
      },
      {
        "type": "accordion",
        "title": "🆕 Đổi mới 1-1",
        "text": "• Trong 30 ngày đầu nếu lỗi NSX\n• Áp dụng cho sản phẩm Apple, Samsung"
      },
      {
        "type": "accordion",
        "title": "🔧 Trung tâm bảo hành",
        "text": "• Apple: Apple Store, TTBH ủy quyền\n• Samsung: Samsung Service Center\n• Các hãng khác: TTBH chính hãng"
      },
      {
        "type": "button",
        "icon": {
          "type": "chevron_right",
          "color": "#FF0000"
        },
        "text": "📍 Tra cứu trung tâm bảo hành",
        "link": "https://smartbuy.com/warranty"
      },
      {
        "type": "chips",
        "options": [
          {"text": "Chính sách đổi trả"},
          {"text": "Chính sách giao hàng"},
          {"text": "Tìm điện thoại"}
        ]
      }
    ]
  ]
}
```
```

---

### **5.4. policy.payment**

```yaml
Intent Name: policy.payment
Enable Webhook: NO
Priority: LOW

Training Phrases (30+ examples):
  - "Thanh toán như thế nào"
  - "Có những hình thức thanh toán nào"
  - "Thanh toán online"
  - "Trả góp được không"
  - "Thanh toán bằng thẻ"
  - "Phương thức thanh toán"
  - "Thanh toán COD"
  - "Thanh toán tiền mặt"
  - "Thanh toán khi nhận hàng"
  - "Trả tiền như nào"
  - "Cách thanh toán"
  - "Thanh toán MoMo"
  - "Thanh toán VNPAY"
  - "Thanh toán ZaloPay"
  - "Thanh toán PayPal"
  - "Thanh toán thẻ tín dụng"
  - "Thanh toán thẻ Visa"
  - "Thanh toán chuyển khoản"
  - "Internet Banking"
  - "Ví điện tử"
  - "Trả góp 0%"
  - "Góp không lãi"
  - "Trả góp thẻ tín dụng"
  - "Trả góp Home Credit"
  - "Trả góp FE Credit"
  - "Thanh toán trực tuyến"
  - "Có giảm giá khi thanh toán online không"
  - "Hoàn tiền khi thanh toán"
  - "Cashback"
  - "Tích điểm"

Responses:
  Custom Payload (Rich Content):
```json
{
  "richContent": [
    [
      {
        "type": "info",
        "title": "💳 PHƯƠNG THỨC THANH TOÁN",
        "subtitle": "Đa dạng hình thức - An toàn & Tiện lợi"
      },
      {
        "type": "accordion",
        "title": "💰 Tiền mặt (COD)",
        "text": "• Ship COD toàn quốc\n• Thanh toán khi nhận hàng\n• Kiểm tra hàng trước khi thanh toán"
      },
      {
        "type": "accordion",
        "title": "💳 Chuyển khoản / Ví điện tử",
        "text": "• VNPAY, MoMo, ZaloPay\n• Visa, Mastercard, JCB\n• Internet Banking"
      },
      {
        "type": "accordion",
        "title": "📱 Trả góp 0% lãi suất",
        "text": "• Home Credit, FE Credit\n• Thẻ tín dụng các ngân hàng\n• Duyệt nhanh trong 15 phút"
      },
      {
        "type": "description",
        "title": "🎁 Ưu đãi thanh toán online",
        "text": [
          "• Giảm thêm 2-5%",
          "• Hoàn xu, tích điểm thành viên"
        ]
      },
      {
        "type": "chips",
        "options": [
          {"text": "Tìm điện thoại"},
          {"text": "Chính sách giao hàng"}
        ]
      }
    ]
  ]
}
```
```

---

## 🏪 **6. STORE & CONTACT**

### **6.1. store.location**

```yaml
Intent Name: store.location
Enable Webhook: NO
Priority: LOW

Training Phrases (30+ examples):
  - "Cửa hàng ở đâu"
  - "Địa chỉ cửa hàng"
  - "Cửa hàng gần tôi"
  - "Xem cửa hàng"
  - "Cửa hàng SmartBuy"
  - "Hệ thống cửa hàng"
  
  # Hà Nội
  - "Chi nhánh Hà Nội"
  - "Có cửa hàng Hà Nội không"
  - "Cửa hàng HN"
  - "Cửa hàng thủ đô"
  - "Địa chỉ cửa hàng Hà Nội"
  - "Chi nhánh HN"
  
  # Hồ Chí Minh
  - "Chi nhánh Hồ Chí Minh"
  - "Có cửa hàng Sài Gòn không"
  - "Cửa hàng HCM"
  - "Cửa hàng SG"
  - "Địa chỉ cửa hàng HCM"
  - "Chi nhánh Saigon"
  
  # Đà Nẵng
  - "Chi nhánh Đà Nẵng"
  - "Có cửa hàng Đà Nẵng không"
  - "Cửa hàng DN"
  - "Địa chỉ cửa hàng Đà Nẵng"
  
  # Các tỉnh khác
  - "Có cửa hàng Hải Phòng không"
  - "Chi nhánh Cần Thơ"
  - "Cửa hàng tỉnh"
  - "Cửa hàng toàn quốc"
  - "Cửa hàng quận 1"
  - "Shop gần nhà"

Parameters:
  - location (@location) - Optional

Responses:
  Custom Payload (Rich Content):
```json
{
  "richContent": [
    [
      {
        "type": "info",
        "title": "🏪 HỆ THỐNG CỬA HÀNG SMARTBUY",
        "subtitle": "5 chi nhánh trên toàn quốc"
      },
      {
        "type": "accordion",
        "title": "📍 Hà Nội (2 chi nhánh)",
        "text": "• 123 Trần Duy Hưng, Cầu Giấy\n• 456 Giải Phóng, Hai Bà Trưng\n\n☎️ Hotline: 024.xxxx.xxxx"
      },
      {
        "type": "accordion",
        "title": "📍 Hồ Chí Minh (2 chi nhánh)",
        "text": "• 789 Nguyễn Văn Linh, Quận 7\n• 321 Lê Văn Việt, Quận 9\n\n☎️ Hotline: 028.xxxx.xxxx"
      },
      {
        "type": "accordion",
        "title": "📍 Đà Nẵng (1 chi nhánh)",
        "text": "• 147 Hùng Vương, Hải Châu\n\n☎️ Hotline: 0236.xxxx.xxxx"
      },
      {
        "type": "button",
        "icon": {
          "type": "location_on",
          "color": "#DC143C"
        },
        "text": "🗺️ Xem bản đồ chi nhánh",
        "link": "https://smartbuy.com/stores"
      },
      {
        "type": "chips",
        "options": [
          {"text": "Liên hệ hotline"},
          {"text": "Tìm điện thoại"}
        ]
      }
    ]
  ]
}
```
```

---

### **6.2. contact.support**

```yaml
Intent Name: contact.support
Enable Webhook: NO

Training Phrases (25+ examples):
  - "Liên hệ"
  - "Hỗ trợ"
  - "Gọi hotline"
  - "Số điện thoại"
  - "Email liên hệ"
  - "Chat với nhân viên"
  - "Tư vấn"
  - "Liên hệ hỗ trợ"
  - "Liên hệ shop"
  - "Gọi shop"
  - "Hotline"
  - "SĐT shop"
  - "SĐT liên hệ"
  - "Email shop"
  - "Facebook shop"
  - "Zalo shop"
  - "Chat Facebook"
  - "Nhắn tin Zalo"
  - "Liên lạc"
  - "Trụ sở"
  - "Trụ sở chính"
  - "Văn phòng"
  - "Hỗ trợ khách hàng"
  - "CSKH"
  - "Nhân viên tư vấn"

Responses:
  Custom Payload (Rich Content):
```json
{
  "richContent": [
    [
      {
        "type": "info",
        "title": "📞 LIÊN HỆ HỖ TRỢ",
        "subtitle": "Hỗ trợ khách hàng 24/7"
      },
      {
        "type": "description",
        "title": "☎️ Hotline: 1900.9999",
        "text": ["Thời gian: 8:00 - 22:00 (Tất cả các ngày)"]
      },
      {
        "type": "divider"
      },
      {
        "type": "list",
        "title": "Kênh liên hệ khác",
        "event": {
          "name": "",
          "languageCode": "",
          "parameters": {}
        }
      },
      {
        "type": "accordion",
        "title": "📧 Email",
        "text": "support@smartbuy.com\n\n(Phản hồi trong 24h)"
      },
      {
        "type": "button",
        "icon": {
          "type": "chat",
          "color": "#0084FF"
        },
        "text": "💬 Chat Facebook",
        "link": "https://fb.com/smartbuy.vn"
      },
      {
        "type": "button",
        "icon": {
          "type": "phone",
          "color": "#0068FF"
        },
        "text": "📱 Zalo OA SmartBuy",
        "link": "https://zalo.me/smartbuy"
      },
      {
        "type": "accordion",
        "title": "🏢 Trụ sở chính",
        "text": "📍 123 Nguyễn Huệ, Quận 1, HCM\n\n⏰ Giờ làm việc:\n• T2-T7: 8:00 - 20:00\n• CN: 9:00 - 18:00"
      },
      {
        "type": "chips",
        "options": [
          {"text": "Xem cửa hàng"},
          {"text": "Tìm điện thoại"}
        ]
      }
    ]
  ]
}
```
```

---

## ✅ **IMPLEMENTATION CHECKLIST**

### **Phase 1: Core Intents** (Bắt buộc)
- [ ] Default Welcome Intent
- [ ] Default Fallback Intent
- [ ] product.search
- [ ] product.search.by-brand
- [ ] product.search.by-price
- [ ] order.track
- [ ] policy.shipping
- [ ] policy.return
- [ ] policy.warranty

### **Phase 2: Enhanced** (Nên có)
- [ ] product.search.by-color
- [ ] product.search.by-memory
- [ ] product.detail
- [ ] order.check-status
- [ ] order.cancel
- [ ] promotion.check

### **Phase 3: Advanced** (Tùy chọn)
- [ ] product.search.by-specs
- [ ] product.compare
- [ ] policy.payment
- [ ] store.location
- [ ] contact.support

---

## 🎯 **TRAINING PHRASES GUIDELINES**

### **Best Practices:**
1. ✅ Mỗi intent cần **10-20 training phrases**
2. ✅ Bao gồm cả **tiếng Việt có dấu + không dấu**
3. ✅ Bao gồm **viết tắt** (ip = iPhone, dt = điện thoại)
4. ✅ Bao gồm **typo phổ biến** (samsumg, iphon)
5. ✅ Highlight **entities** trong training phrases
6. ✅ Test với **"Try it now"** sau khi tạo

### **Example Highlighting:**
```
Training Phrase: "Tìm điện thoại Samsung dưới 10 triệu"
                        ^^^^^^^^^ ^^^^^^^ ^^^^^^^^^^^^
                        category  brand   price-range
                        
Highlighted:     "Tìm @product-category @brand-name @price-range"
```

---

🚀 **READY TO CREATE INTENTS IN DIALOGFLOW!**
