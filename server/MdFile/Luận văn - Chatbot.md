# 3.4. Xây dựng chat bot tư vấn (DialogFlow)

Hệ thống chatbot tư vấn được xây dựng nhằm hỗ trợ người dùng trong việc tìm kiếm và lựa chọn sản phẩm điện thoại phù hợp một cách nhanh chóng, tiện lợi. Việc tích hợp chatbot với hệ thống microservices giúp cải thiện trải nghiệm khách hàng, đồng thời giảm tải cho bộ phận chăm sóc khách hàng truyền thống.

Trong đồ án này, Dialogflow được lựa chọn là nền tảng xây dựng chatbot vì hỗ trợ xử lý ngôn ngữ tự nhiên (Natural Language Processing – NLP) mạnh mẽ, dễ tích hợp với các nền tảng backend thông qua webhook, và hỗ trợ triển khai đa kênh.

## 3.4.1. Tạo các Intents

Dialogflow hoạt động dựa trên khái niệm Intent, đại diện cho ý định người dùng trong một truy vấn. Mỗi Intent sẽ được gắn với các câu ví dụ (training phrases) nhằm giúp chatbot hiểu được ngữ cảnh và mục tiêu của người dùng.

Hệ thống SmartBuy xây dựng các nhóm Intent chính sau:

**Nhóm Intent Tìm kiếm sản phẩm:**
- **product.search**: Tìm kiếm điện thoại tổng quát
- **product.search.by-brand**: Tìm theo thương hiệu (Apple, Samsung, Xiaomi...)
- **product.search.by-color**: Tìm theo màu sắc (Đen, Trắng, Xanh...)
- **product.search.by-memory**: Tìm theo dung lượng bộ nhớ (128GB, 256GB, 512GB...)
- **product.search.by-price**: Tìm theo khoảng giá
- **product.search.by-specs**: Tìm theo thông số kỹ thuật (camera, pin, màn hình...)
- **product.detail**: Xem chi tiết sản phẩm cụ thể
- **product.compare**: So sánh các sản phẩm

**Nhóm Intent Chính sách & Hỗ trợ:**
- **policy.shipping**: Hỏi về chính sách giao hàng
- **policy.payment**: Hỏi về phương thức thanh toán
- **policy.return**: Hỏi về chính sách đổi trả
- **policy.warranty**: Hỏi về bảo hành
- **contact.support**: Liên hệ hỗ trợ
- **store.location**: Hỏi về địa chỉ cửa hàng

**Nhóm Intent Đơn hàng:**
- **order.track**: Theo dõi đơn hàng
- **order.check-status**: Kiểm tra trạng thái đơn
- **order.cancel**: Hủy đơn hàng

**Nhóm Intent Khuyến mãi:**
- **promotion.check**: Kiểm tra chương trình khuyến mãi

**Hình 3.11**: Trang tạo các intents

### 3.4.1.1. Huấn luyện đầu vào

Bước đầu tiên trong việc xây dựng chatbot là huấn luyện các câu đầu vào – tức là các mẫu câu người dùng có thể nhập khi cần tư vấn.

**Xác định Intent (ý định người dùng):** Mỗi nhu cầu tìm kiếm, ví dụ như "tìm điện thoại iPhone", "điện thoại Samsung màu đen 256GB", sẽ được gán vào một Intent tương ứng. 

**Ví dụ Intent "product.search"** => người dùng có thể nhập:
- "Tôi muốn mua điện thoại"
- "Có điện thoại nào tốt không?"
- "Giới thiệu cho tôi smartphone"
- "Tìm điện thoại giá rẻ"
- "Cho tôi xem các mẫu điện thoại mới"

**Intent "product.search.by-brand"** => người dùng có thể nhập:
- "Có iPhone không?"
- "Điện thoại Samsung mới nhất"
- "Tìm điện thoại Xiaomi"
- "Cho tôi xem các sản phẩm của Apple"
- "Samsung Galaxy có model nào mới?"

**Intent "product.search.by-memory"** => người dùng có thể nhập:
- "Điện thoại 256GB có không?"
- "Tôi cần điện thoại bộ nhớ lớn"
- "iPhone 512GB giá bao nhiêu?"
- "Tìm điện thoại 128GB"
- "Có điện thoại 1TB không?"

**Intent "product.search.by-price"** => người dùng có thể nhập:
- "Điện thoại dưới 10 triệu"
- "Tìm điện thoại giá rẻ"
- "Điện thoại từ 15-20 triệu"
- "Có điện thoại tầm 5 triệu không?"

**Huấn luyện đa dạng mẫu câu:** Càng nhiều mẫu câu, khả năng chatbot hiểu chính xác càng cao. Các mẫu nên đa dạng về cách nói, từ ngữ địa phương, cách rút gọn, viết tắt... Ví dụ: 
- "ip 15" (viết tắt của iPhone 15)
- "ip15 pro max"
- "con ip mới nhất"
- "Sam sung" (cách viết sai chính tả)
- "xài mi" (Xiaomi)

**Tận dụng mô hình học máy (Machine Learning):** Dialogflow sử dụng các thuật toán NLP để tự động hiểu các câu nói có ngữ nghĩa tương đồng, từ đó mở rộng khả năng hiểu ngôn ngữ tự nhiên của chatbot. Khi người dùng nhập "cho xem ip mới", chatbot vẫn hiểu đây là yêu cầu tìm iPhone mới nhất.

**Hình 3.12**: Giao diện nhập các mẫu huấn luyện đầu vào trong Dialogflow

### 3.4.1.2. Huấn luyện đầu ra

Khi hệ thống đã xác định được Intent phù hợp từ câu hỏi của người dùng, bước tiếp theo là xây dựng phản hồi đầu ra sao cho đúng ngữ cảnh và tự nhiên.

**Phản hồi tĩnh (Static response):** Có thể là văn bản đơn giản cho các câu hỏi về chính sách, hỗ trợ. Ví dụ:

- **Intent "policy.shipping"**: 
  ```
  "SmartBuy miễn phí giao hàng toàn quốc cho đơn hàng từ 500.000đ. 
  Thời gian giao hàng từ 1-3 ngày tùy khu vực. 
  Đơn hàng nội thành Hồ Chí Minh giao trong 24h."
  ```

- **Intent "policy.warranty"**: 
  ```
  "Tất cả sản phẩm điện thoại đều được bảo hành chính hãng 12 tháng. 
  Một đổi một trong 30 ngày nếu có lỗi từ nhà sản xuất. 
  Hỗ trợ sửa chữa miễn phí trong thời gian bảo hành."
  ```

- **Intent "policy.payment"**:
  ```
  "SmartBuy hỗ trợ các hình thức thanh toán:
  ✅ COD (Thanh toán khi nhận hàng)
  ✅ VNPay (Chuyển khoản, thẻ ATM, thẻ tín dụng)
  ✅ Trả góp 0% qua thẻ tín dụng
  ✅ Trả góp qua công ty tài chính"
  ```

**Phản hồi động (Dynamic response):** Sử dụng webhook để gửi truy vấn đến hệ thống backend (ChatService), lấy dữ liệu sản phẩm thực tế từ Product Manager Service để phản hồi.

**Tối ưu hóa nội dung phản hồi:**
- Nội dung ngắn gọn, thân thiện, đúng trọng tâm
- Kèm thông tin chi tiết: tên sản phẩm, giá, màu sắc, bộ nhớ, tình trạng còn hàng
- Hiển thị hình ảnh sản phẩm và nút "Xem chi tiết"
- Ví dụ phản hồi:
  ```
  "🎉 Chúng tôi tìm thấy 3 mẫu iPhone 15 Pro 256GB phù hợp với bạn:
  
  📱 iPhone 15 Pro 256GB - Titan Đen
  💰 27.990.000đ
  ✅ Còn 15 sản phẩm
  
  📱 iPhone 15 Pro 256GB - Titan Trắng
  💰 27.990.000đ
  ✅ Còn 8 sản phẩm
  
  📱 iPhone 15 Pro 256GB - Titan Xanh
  💰 27.990.000đ
  ✅ Còn 12 sản phẩm
  
  Bạn quan tâm mẫu nào? Mời bạn tham khảo!"
  ```

**Hình 3.13**: Cấu hình các mẫu phản hồi trong Dialogflow

## 3.4.2. Tạo các Entity

**Hình 3.14**: Giao diện tạo các Entities

Entity trong Dialogflow giúp chatbot hiểu rõ hơn về các thành phần dữ liệu trong câu người dùng nói – ví dụ như thương hiệu, dung lượng bộ nhớ, màu sắc, khoảng giá...

**System Entities (Mặc định):** Được tích hợp sẵn trong Dialogflow như:
- @sys.number: số lượng, giá tiền
- @sys.date: ngày tháng
- @sys.email: email liên hệ

**Custom Entities (Tùy chỉnh)** - Hệ thống SmartBuy xây dựng các Entity sau:

### brand-name (Thương hiệu điện thoại)
Các giá trị:
- Apple, iPhone, IP
- Samsung, Galaxy, Sam
- Xiaomi, Redmi, Mi
- Oppo
- Vivo
- Realme
- OnePlus

**Đồng nghĩa (Synonyms):**
- "iPhone" → "IP", "ip", "Iphone", "iphone"
- "Samsung" → "Sam", "SS", "sam sung"
- "Xiaomi" → "xài mi", "xao mi", "xaomi"

### memory-capacity (Dung lượng bộ nhớ)
Các giá trị:
- 64GB, 64G, 64 GB
- 128GB, 128G, 128 GB
- 256GB, 256G, 256 GB
- 512GB, 512G, 512 GB
- 1TB, 1T, 1 TB

**Đồng nghĩa:**
- "128GB" → "128G", "128 GB", "bộ nhớ 128", "128gb"
- "256GB" → "256G", "256 GB", "bộ nhớ 256", "256gb"

### color-name (Màu sắc)
Các giá trị:
- Đen, Black, Đ, Đen nhám
- Trắng, White, T, Trắng ngà
- Xanh, Blue, X, Xanh dương, Xanh lá
- Đỏ, Red, Đỏ đô
- Vàng, Yellow, Gold, Vàng gold
- Tím, Purple, Tím than
- Hồng, Pink, Hồng pastel
- Titan Đen, Titan Black
- Titan Trắng, Titan White
- Titan Xanh, Titan Blue
- Titan Tự Nhiên, Natural Titanium

**Đồng nghĩa:**
- "Đen" → "den", "black", "đ", "màu đen"
- "Trắng" → "trang", "white", "t", "màu trắng"

### product-category (Danh mục sản phẩm)
Các giá trị:
- Smartphone, Điện thoại thông minh, Điện thoại
- Flagship, Cao cấp, High-end
- Tầm trung, Mid-range
- Phổ thông, Budget, Giá rẻ
- Gaming Phone, Điện thoại chơi game

### price-range (Khoảng giá)
Các giá trị:
- Dưới 5 triệu, < 5tr, dưới 5tr
- 5-10 triệu, 5tr-10tr, từ 5 đến 10 triệu
- 10-15 triệu, 10tr-15tr
- 15-20 triệu, 15tr-20tr
- Trên 20 triệu, > 20tr, trên 20tr

**Đồng nghĩa:**
- "Dưới 5 triệu" → "giá rẻ", "bình dân", "phổ thông"
- "15-20 triệu" → "tầm trung cao", "khá đắt"
- "Trên 20 triệu" → "cao cấp", "flagship", "xịn"

### product-spec (Thông số kỹ thuật)
Các giá trị:
- Camera, Camera tốt, Chụp ảnh đẹp
- Pin, Pin trâu, Pin khỏe, Pin lâu
- Màn hình, Màn hình đẹp, Màn hình lớn
- Chip, Chip mạnh, Hiệu năng cao
- RAM, RAM lớn
- Sạc nhanh, Sạc siêu nhanh
- 5G, Hỗ trợ 5G

### product-name (Tên sản phẩm cụ thể)
Các giá trị:
- iPhone 15, iPhone 15 Pro, iPhone 15 Pro Max, iPhone 15 Plus
- iPhone 14, iPhone 14 Pro, iPhone 14 Pro Max
- Samsung Galaxy S24, Galaxy S24 Plus, Galaxy S24 Ultra
- Samsung Galaxy A54, Galaxy A34
- Xiaomi 14, Xiaomi 14 Pro, Xiaomi 14 Ultra
- Xiaomi Redmi Note 13, Redmi Note 13 Pro

### order-status (Trạng thái đơn hàng)
Các giá trị:
- Chờ xác nhận, Pending
- Đã xác nhận, Confirmed
- Đang giao, Shipping
- Đã giao, Delivered
- Đã hủy, Cancelled
- Hoàn thành, Completed

**Session Entities (Thực thể theo ngữ cảnh):** Được tạo trong thời gian thực, lưu giữ thông tin theo từng đoạn hội thoại, giúp chatbot giữ ngữ cảnh xuyên suốt. 

Ví dụ: Người dùng hỏi "Có màu nào khác không?" - chatbot nhớ sản phẩm đang được hỏi là iPhone 15 Pro từ câu hỏi trước và trả lời về các màu sắc còn lại của iPhone 15 Pro.

**Hình 3.15**: Mẫu Entities của brand-name

## 3.4.3. Xây dựng câu phản hồi bằng webhook thông qua ChatService

Webhook trong Dialogflow đóng vai trò như một cổng trung gian giúp chatbot kết nối với hệ thống backend để lấy dữ liệu động theo nhu cầu người dùng.

### Quy trình hoạt động:

**1. Người dùng nhập câu hỏi**

Ví dụ: "Tôi muốn mua iPhone 15 Pro 256GB màu Titan Đen."

**2. Dialogflow xử lý**
   - Xác định Intent: **product.search.by-brand**
   - Trích xuất các Entity:
     - iPhone 15 Pro (product-name)
     - 256GB (memory-capacity)
     - Titan Đen (color-name)

**3. Gửi request đến ChatService**

Dialogflow gửi webhook request đến ChatService (port 3007) kèm theo:
```json
{
  "queryResult": {
    "intent": {
      "displayName": "product.search.by-brand"
    },
    "parameters": {
      "product-name": "iPhone 15 Pro",
      "memory-capacity": "256GB",
      "color-name": "Titan Đen"
    }
  }
}
```

**4. ChatService xử lý**

a. Nhận request từ Dialogflow với các tham số: productName, memory, color

b. Gọi API Product Manager Service (port 5002):
```javascript
GET /api/products?search=iPhone 15 Pro
GET /api/products/:productId/variants?memory=256GB&color=Titan Đen
```

c. Tìm kiếm sản phẩm theo điều kiện:
   - Tên sản phẩm: "iPhone 15 Pro"
   - Variant có memory: "256GB"
   - Variant có color: "Titan Đen"

d. Lấy thông tin chi tiết từ Product DB:
   - Thông tin sản phẩm (tên, mô tả, brand)
   - Thông tin variant (màu sắc, bộ nhớ, giá, stock)
   - Hình ảnh sản phẩm

e. Trả về danh sách 1–3 sản phẩm phù hợp (nếu có), theo định dạng custom payload:

```json
{
  "fulfillmentMessages": [
    {
      "text": {
        "text": ["🎉 Tìm thấy sản phẩm phù hợp!"]
      }
    },
    {
      "payload": {
        "richContent": [[
          {
            "type": "info",
            "title": "iPhone 15 Pro 256GB - Titan Đen",
            "subtitle": "💰 Giá: 27.990.000đ\n✅ Còn hàng: 15 sản phẩm\n📷 Camera: 48MP | 🔋 Pin: 3274mAh",
            "image": {
              "src": {
                "rawUrl": "https://smartbuy.com/images/iphone-15-pro-black.jpg"
              }
            },
            "actionLink": "https://smartbuy.com/products/iphone-15-pro-256gb-titan-den"
          },
          {
            "type": "chips",
            "options": [
              {
                "text": "Xem chi tiết",
                "link": "https://smartbuy.com/products/iphone-15-pro-256gb-titan-den"
              },
              {
                "text": "Xem màu khác"
              },
              {
                "text": "So sánh với S24 Ultra"
              }
            ]
          }
        ]]
      }
    }
  ]
}
```

**5. Dialogflow hiển thị cho người dùng**

Dialogflow nhận dữ liệu từ ChatService và gửi về cho người dùng dưới dạng:
- **Thẻ sản phẩm (product card)** với:
  - Hình ảnh sản phẩm
  - Tên và thông số (màu sắc, bộ nhớ)
  - Giá tiền
  - Tình trạng còn hàng
  - Các thông số nổi bật
- **Nút hành động (buttons)**:
  - "Xem chi tiết" → chuyển đến trang sản phẩm
  - "Xem màu khác" → hiển thị các màu còn lại
  - "So sánh" → so sánh với sản phẩm tương tự

**Ví dụ phản hồi hiển thị trên chatbox:**

```
🎉 Tìm thấy sản phẩm phù hợp!

┌─────────────────────────────────┐
│ [Hình ảnh iPhone 15 Pro Đen]    │
│                                  │
│ 📱 iPhone 15 Pro 256GB           │
│    Titan Đen                     │
│                                  │
│ 💰 Giá: 27.990.000đ             │
│ ✅ Còn hàng: 15 sản phẩm        │
│                                  │
│ 📷 Camera: 48MP                  │
│ 🔋 Pin: 3274mAh                 │
│ 💾 Bộ nhớ: 256GB                │
│ 📱 Màn hình: 6.1" Super Retina  │
│                                  │
│ [Xem chi tiết] [Xem màu khác]   │
└─────────────────────────────────┘

Bạn có muốn xem thêm màu khác không?
Hoặc tôi có thể giúp bạn so sánh với Samsung S24 Ultra?
```

### Kiến trúc tích hợp

```
┌──────────────┐      ┌────────────────┐      ┌──────────────────┐
│              │      │                │      │                  │
│  Dialogflow  │◄────►│  ChatService   │◄────►│ Product Manager  │
│              │      │  (Port 3008)   │      │   (Port 5002)    │
│              │      │                │      │                  │
└──────────────┘      └────────────────┘      └──────────────────┘
       ▲                      │                        │
       │                      │                        │
       │                      ▼                        ▼
       │              ┌────────────────┐      ┌──────────────────┐
       │              │                │      │                  │
       └──────────────│  API Gateway   │      │   Product DB     │
                      │  (Port 3000)   │      │   (MongoDB)      │
                      │                │      │                  │
                      └────────────────┘      └──────────────────┘
```

### Lưu ý quan trọng

**Chatbot không tích hợp chức năng mua hàng trực tiếp**, nhằm giữ cho việc quản lý đơn hàng, xác thực người dùng và thanh toán được thực hiện tập trung qua hệ thống chính. 

Chatbot chỉ có **chức năng tư vấn và gợi ý sản phẩm**, sau đó điều hướng người dùng đến trang chi tiết để thực hiện quyết định mua hàng. Điều này đảm bảo:

- ✅ Quản lý giỏ hàng tập trung qua Cart Service
- ✅ Xác thực người dùng và JWT token thông qua API Gateway
- ✅ Xử lý thanh toán an toàn qua Payment Service
- ✅ Theo dõi đơn hàng thống nhất qua Order Manager Service
- ✅ Giữ tính nhất quán dữ liệu và logic nghiệp vụ

### Ưu điểm của giải pháp

1. **Tự động hóa quy trình tư vấn sản phẩm**
   - Chatbot phản hồi 24/7 không giới hạn
   - Xử lý đồng thời nhiều người dùng
   - Không cần nhân viên trực tuyến liên tục

2. **Giảm tải khối lượng công việc cho bộ phận CSKH**
   - Xử lý tự động các câu hỏi thường gặp về:
     - Thông tin sản phẩm, giá cả
     - Chính sách giao hàng, thanh toán, đổi trả
     - Kiểm tra trạng thái đơn hàng
   - Nhân viên chỉ cần xử lý các vấn đề phức tạp

3. **Nâng cao trải nghiệm người dùng**
   - Phản hồi nhanh (< 2 giây)
   - Kết quả chính xác với dữ liệu thực từ database
   - Gợi ý sản phẩm phù hợp dựa trên nhu cầu
   - Giao diện thân thiện, dễ sử dụng

4. **Dễ dàng mở rộng và bảo trì**
   - Thêm Intent mới không ảnh hưởng hệ thống
   - Cập nhật Entity và training phrases linh hoạt
   - Có thể mở rộng thêm các tính năng:
     - So sánh sản phẩm chi tiết
     - Đặt lịch bảo hành
     - Tư vấn chọn sản phẩm theo nhu cầu cụ thể
     - Hỗ trợ đa ngôn ngữ

5. **Tích hợp liền mạch với microservices**
   - Webhook kết nối với ChatService
   - ChatService gọi Product Manager Service qua API Gateway
   - Dữ liệu luôn đồng bộ và cập nhật theo thời gian thực
   - Đảm bảo tính nhất quán với hệ thống chính
