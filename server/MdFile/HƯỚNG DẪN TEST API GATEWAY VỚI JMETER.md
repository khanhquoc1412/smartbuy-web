# HƯỚNG DẪN TEST API GATEWAY VỚI JMETER

## 📋 MỤC LỤC
1. [Cài đặt JMeter](#1-cài-đặt-jmeter)
2. [Test 1: Routing và Response Time](#2-test-1-routing-và-response-time)
3. [Test 2: Rate Limiting (100 req/phút)](#3-test-2-rate-limiting-100-reqphút)
4. [Test 3: Authentication & Authorization](#4-test-3-authentication--authorization)
5. [Test 4: Concurrent Users (Khả năng chịu tải)](#5-test-4-concurrent-users-khả-năng-chịu-tải)
6. [Test 5: Stress Test](#6-test-5-stress-test)
7. [Tạo báo cáo và xuất hình ảnh](#7-tạo-báo-cáo-và-xuất-hình-ảnh)

---

## 1. Cài đặt JMeter

### Bước 1.1: Download JMeter
1. Truy cập: https://jmeter.apache.org/download_jmeter.cgi
2. Download file `apache-jmeter-5.6.3.zip` (hoặc version mới nhất)
3. Giải nén vào folder (ví dụ: `C:\JMeter`)

### Bước 1.2: Chạy JMeter
- Windows: Double click `C:\JMeter\bin\jmeter.bat`
- Hoặc chạy command: `cd C:\JMeter\bin && jmeter.bat`

### Bước 1.3: Cài plugin (Optional nhưng recommended)
1. Download JMeter Plugins Manager: https://jmeter-plugins.org/install/Install/
2. Copy file `jmeter-plugins-manager-x.x.jar` vào folder `C:\JMeter\lib\ext`
3. Restart JMeter
4. Menu: Options → Plugins Manager
5. Cài các plugin:
   - Custom Thread Groups (cho Ultimate Thread Group)
   - 3 Basic Graphs
   - Response Times Over Time
   - Transactions per Second

---

## 2. Test 1: Routing và Response Time

### Mục đích:
- Test các route khác nhau qua API Gateway
- Đo response time, throughput
- Verify routing đến đúng backend services

### Bước 2.1: Tạo Test Plan mới
1. JMeter → File → New (hoặc Ctrl+N)
2. Right click "Test Plan" → Add → Threads → Thread Group
3. Đặt tên: "Test Routing - API Gateway"

### Bước 2.2: Cấu hình Thread Group
```
Thread Properties:
- Number of Threads (users): 100
- Ramp-up period (seconds): 10
- Loop Count: 10
- Duration: 60 seconds (optional)
```

### Bước 2.3: Thêm HTTP Requests
Right click Thread Group → Add → Sampler → HTTP Request

**Request 1: Get All Products**
```
Name: GET /api/products
Protocol: http
Server Name or IP: localhost
Port Number: 3000
HTTP Request: GET
Path: /api/v1/products
```

**Request 2: Get All Users (Admin)**
```
Name: GET /api/users
Protocol: http
Server Name or IP: localhost
Port Number: 3000
HTTP Request: GET
Path: /api/users
```

**Request 3: Get All Orders**
```
Name: GET /api/orders
Protocol: http
Server Name or IP: localhost
Port Number: 3000
HTTP Request: GET
Path: /api/orders
```

**Request 4: Chatbox Webhook**
```
Name: POST /api/chatbox/webhook
Protocol: http
Server Name or IP: localhost
Port Number: 3000
HTTP Request: POST
Path: /api/chatbox/webhook
Body Data (tab Body Data):
{
  "queryResult": {
    "intent": {
      "displayName": "product.search"
    }
  }
}
```

### Bước 2.4: Thêm HTTP Header Manager (cho POST request)
Right click "POST /api/chatbox/webhook" → Add → Config Element → HTTP Header Manager
```
Add header:
Name: Content-Type
Value: application/json
```

### Bước 2.5: Thêm Listeners để xem kết quả
Right click Thread Group → Add → Listener

Thêm các listeners sau:
1. **View Results Tree** (xem chi tiết từng request)
2. **Summary Report** (tổng quan metrics)
3. **Aggregate Report** (chi tiết hơn)
4. **Graph Results** (biểu đồ đường như hình 4.4)
5. **Response Time Graph** (đồ thị response time theo thời gian)

### Bước 2.6: Chạy test
1. Đảm bảo API Gateway đang chạy: `docker compose up -d`
2. Click nút Play (▶) màu xanh ở toolbar
3. Hoặc menu: Run → Start (Ctrl+R)

### Bước 2.7: Thu thập kết quả
**Summary Report - Cần chụp:**
- Label (tên request)
- Samples (số lượng)
- Average (ms)
- Median (ms)
- 90% Line
- 95% Line
- 99% Line
- Min/Max
- Error %
- Throughput (req/sec)
- KB/sec

**Graph Results - Cần chụp:**
- Biểu đồ đường hiển thị response time theo thời gian
- Chú thích: "Hình 4.X: Response time của các API endpoints qua Gateway"

### Bước 2.8: Xuất hình ảnh
- Right click Graph Results → Save As Image
- Lưu với tên: `test1-routing-response-time.png`

---

## 3. Test 2: Rate Limiting (100 req/phút)

### Mục đích:
- Verify Gateway block requests sau 100 req/phút từ 1 IP
- Kiểm tra response status 429 "Too Many Requests"

### Bước 3.1: Tạo Test Plan mới
File → New → Right click Test Plan → Add → Thread Group
Đặt tên: "Test Rate Limiting - 150 Requests"

### Bước 3.2: Cấu hình Thread Group
```
Thread Properties:
- Number of Threads (users): 1 (quan trọng: chỉ 1 IP)
- Ramp-up period (seconds): 0 (gửi ngay lập tức)
- Loop Count: 150
- Duration: 60 seconds
```

**Hoặc cách 2 (nhanh hơn):**
```
- Number of Threads: 150
- Ramp-up: 1 second (gửi 150 requests trong 1s)
- Loop Count: 1
```

### Bước 3.3: Thêm HTTP Request
Right click Thread Group → Add → Sampler → HTTP Request
```
Name: GET Products (Rate Limit Test)
Protocol: http
Server Name: localhost
Port: 3000
Method: GET
Path: /api/v1/products
```

### Bước 3.4: Thêm Response Assertion (check status 429)
Right click HTTP Request → Add → Assertions → Response Assertion
```
Apply to: Main sample only
Field to Test: Response Code
Pattern Matching Rules: Matches
Patterns to Test: Add 2 patterns
  - 200 (cho 100 requests đầu)
  - 429 (cho requests tiếp theo)
```

**Hoặc tạo 2 assertions riêng:**
- Assertion 1: If Sample # <= 100 then expect 200
- Assertion 2: If Sample # > 100 then expect 429

### Bước 3.5: Thêm Listeners
1. **View Results Tree** (xem chi tiết response)
2. **Summary Report**
3. **Graph Results**
4. **Assertion Results** (xem pass/fail)

### Bước 3.6: Chạy test và quan sát
1. Start test
2. Trong View Results Tree:
   - Request 1-100: Status 200 OK (màu xanh)
   - Request 101-150: Status 429 Too Many Requests (màu đỏ)

### Bước 3.7: Thu thập kết quả
**Chụp View Results Tree:**
- Chọn request thứ 99-100: Status 200 OK
- Chọn request thứ 101-102: Status 429
- Chụp response body: "Too many requests..."

**Chụp Graph Results:**
- Biểu đồ sẽ show spike ở request 101+
- Chú thích: "Hình 4.Y: Rate limiting kích hoạt sau 100 requests"

**Chụp Summary Report:**
- Hiển thị Error % = ~33% (50/150 requests bị block)

---

## 4. Test 3: Authentication & Authorization

### Mục đích:
- Test các trường hợp: no token, valid token, expired token, wrong role
- Verify Gateway verify JWT và phân quyền đúng

### Chuẩn bị: Lấy JWT tokens

**Bước 4.0: Tạo tokens**
1. Đăng nhập vào hệ thống bằng Postman:
   ```
   POST http://localhost:3003/api/auth/login
   Body: {
     "email": "user@example.com",
     "password": "123456"
   }
   ```
2. Copy `accessToken` từ response
3. Lưu vào file `tokens.csv`:
   ```csv
   token,role
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...,user
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...,admin
   invalid_token,invalid
   ```

### Bước 4.1: Tạo Test Plan
File → New → Add Thread Group
Đặt tên: "Test Authentication & Authorization"

### Bước 4.2: Cấu hình Thread Group
```
- Number of Threads: 4 (4 scenarios)
- Ramp-up: 1
- Loop Count: 1
```

### Bước 4.3: Thêm CSV Data Set Config
Right click Thread Group → Add → Config Element → CSV Data Set Config
```
Filename: D:\LV chuyên nghành 2025\smartbuy-web\tokens.csv
Variable Names: token,role
Delimiter: ,
Recycle on EOF: False
```

### Bước 4.4: Tạo HTTP Requests cho 4 scenarios

**Scenario 1: No Token (401)**
```
Name: GET Orders - No Token
Path: /api/orders
(không add header Authorization)
```

**Scenario 2: Valid User Token (200)**
```
Name: GET Orders - Valid User Token
Path: /api/orders
Add → Config Element → HTTP Header Manager:
  Name: Authorization
  Value: Bearer ${token}
```

**Scenario 3: Invalid Token (401)**
```
Name: GET Orders - Invalid Token
Path: /api/orders
HTTP Header Manager:
  Name: Authorization
  Value: Bearer invalid_token_here
```

**Scenario 4: User Token on Admin Route (403)**
```
Name: GET All Users - User Token (should fail)
Path: /api/users (admin only)
HTTP Header Manager:
  Name: Authorization
  Value: Bearer ${token} (user token)
```

**Scenario 5: Admin Token on Admin Route (200)**
```
Name: GET All Users - Admin Token (should pass)
Path: /api/users
HTTP Header Manager:
  Name: Authorization
  Value: Bearer ${token} (admin token)
```

### Bước 4.5: Thêm Assertions cho từng scenario
- Scenario 1: Response Code = 401
- Scenario 2: Response Code = 200
- Scenario 3: Response Code = 401
- Scenario 4: Response Code = 403
- Scenario 5: Response Code = 200

### Bước 4.6: Thêm Listeners
1. View Results Tree
2. Assertion Results
3. Summary Report

### Bước 4.7: Chạy test và chụp kết quả
**Chụp View Results Tree:**
- 5 requests với status code tương ứng
- Chú thích: "Hình 4.Z: Test authentication và authorization"

**Chụp response headers:**
- Request có token → show `Authorization: Bearer ...`
- Response có `WWW-Authenticate` header

---

## 5. Test 4: Concurrent Users (Khả năng chịu tải)

### Mục đích:
- Test khả năng xử lý nhiều users đồng thời
- Đo response time khi load tăng
- Xác định threshold của hệ thống

### Bước 5.1: Tạo Test Plan
File → New → Add Thread Group
Đặt tên: "Load Test - 500 Concurrent Users"

### Bước 5.2: Cấu hình Thread Group
```
Thread Properties:
- Number of Threads: 500
- Ramp-up: 30 seconds (tăng dần 16-17 users/giây)
- Loop Count: 10
- Duration: 120 seconds
```

### Bước 5.3: Thêm HTTP Requests (mix các endpoints)

**Request 1: Get Products (60% traffic)**
```
Path: /api/v1/products
Throughput Controller: 60%
```

**Request 2: Get Orders (20% traffic)**
```
Path: /api/orders
Throughput Controller: 20%
```

**Request 3: Post to Cart (15% traffic)**
```
Path: /api/cart
Method: POST
Body: {"productId": "123", "quantity": 1}
Throughput Controller: 15%
```

**Request 4: Create Review (5% traffic)**
```
Path: /api/reviews
Method: POST
Throughput Controller: 5%
```

### Bước 5.4: Thêm Throughput Controller
Right click Thread Group → Add → Logic Controller → Throughput Controller
- Drag các HTTP Requests vào Throughput Controller tương ứng
- Cấu hình Percent Executions (60, 20, 15, 5)

### Bước 5.5: Thêm Think Time (mô phỏng user thật)
Right click Thread Group → Add → Timer → Uniform Random Timer
```
Random Delay Maximum: 3000 ms
Constant Delay Offset: 1000 ms
(user đợi 1-4 giây giữa các requests)
```

### Bước 5.6: Thêm Listeners
1. **Active Threads Over Time** (plugin)
2. **Response Times Over Time** (plugin)
3. **Transactions per Second** (plugin)
4. **Aggregate Report**
5. **Summary Report**

### Bước 5.7: Chạy test
1. Start test
2. Quan sát real-time:
   - Active Threads tăng từ 0 → 500 trong 30s
   - Response Time tăng dần khi có nhiều users
   - TPS (Transactions per Second)

### Bước 5.8: Thu thập kết quả
**Aggregate Report - Chú ý các metrics:**
- Average response time: ~150ms (ví dụ)
- Median: ~110ms
- 90% Line: ~250ms
- 95% Line: ~300ms
- 99% Line: ~500ms
- Error %: < 0.1%
- Throughput: ~320 requests/second

**Response Times Over Time:**
- Biểu đồ tăng dần khi số users tăng
- Chú thích: "Hình 4.W: Response time tăng theo số lượng concurrent users"

**Transactions per Second:**
- Throughput ổn định ở ~320 TPS
- Chú thích: "Hình 4.V: Throughput của hệ thống đạt 320 req/s"

---

## 6. Test 5: Stress Test (Tìm Breaking Point)

### Mục đích:
- Tìm giới hạn của hệ thống
- Xem hệ thống xử lý như thế nào khi quá tải
- Recovery time sau khi giảm load

### Bước 6.1: Install Ultimate Thread Group Plugin
Options → Plugins Manager → Available Plugins → Search "Custom Thread Groups" → Install

### Bước 6.2: Tạo Test Plan với Ultimate Thread Group
Right click Test Plan → Add → Threads → jp@gc - Ultimate Thread Group
Đặt tên: "Stress Test - Find Breaking Point"

### Bước 6.3: Cấu hình Ultimate Thread Group
```
Row 1: Ramp up stage
- Start Threads Count: 0
- Initial Delay: 0
- Startup Time: 30s
- Hold Load For: 30s
- Shutdown Time: 0
- Target Threads: 100

Row 2: Increase to 300
- Start: 100, Target: 300
- Startup: 30s, Hold: 30s

Row 3: Increase to 500
- Start: 300, Target: 500
- Startup: 30s, Hold: 30s

Row 4: Increase to 1000
- Start: 500, Target: 1000
- Startup: 30s, Hold: 30s

Row 5: Ramp down
- Start: 1000, Target: 0
- Startup: 30s, Hold: 0s
```

### Bước 6.4: Thêm HTTP Request
```
GET /api/v1/products
```

### Bước 6.5: Thêm Listeners
1. **jp@gc - Active Threads Over Time**
2. **jp@gc - Response Times Over Time**
3. **jp@gc - Transactions per Second**
4. **Aggregate Report**
5. **Graph Results**

### Bước 6.6: Chạy test
- Duration: ~4-5 phút
- Quan sát khi nào response time tăng đột biến
- Quan sát khi nào error rate bắt đầu tăng

### Bước 6.7: Thu thập kết quả
**Active Threads Over Time:**
- Biểu đồ bậc thang từ 0 → 100 → 300 → 500 → 1000 → 0
- Chú thích: "Hình 4.X: Stress test với load tăng dần đến 1000 users"

**Response Times Over Time:**
- Đường cong tăng dần
- Highlight điểm mà response time > 1000ms (threshold)
- Chú thích: "Hình 4.Y: Response time breakdown tại 800 concurrent users"

**Kết luận:**
- Hệ thống xử lý tốt đến 500 users (response time < 300ms)
- Tại 800+ users: response time > 1000ms, bắt đầu có errors
- Breaking point: ~900-1000 concurrent users

---

## 7. Tạo báo cáo và xuất hình ảnh

### Bước 7.1: Xuất HTML Report (JMeter 3.0+)
**Cách 1: Chạy từ command line (recommended)**
```bash
cd C:\JMeter\bin

jmeter -n -t "D:\LV chuyên nghành 2025\smartbuy-web\test-plan.jmx" ^
       -l "D:\LV chuyên nghành 2025\smartbuy-web\results.jtl" ^
       -e -o "D:\LV chuyên nghành 2025\smartbuy-web\html-report"
```

Giải thích:
- `-n`: chạy non-GUI mode
- `-t`: test plan file (.jmx)
- `-l`: output results file (.jtl)
- `-e`: generate HTML report
- `-o`: output folder

**Cách 2: Từ GUI sau khi đã chạy test**
```
Menu: Tools → Generate HTML report
Dashboard generation:
- Results file (CSV): results.jtl
- user.properties file: (để trống)
- Output directory: html-report
Click "Generate report"
```

### Bước 7.2: Mở HTML Report
- Navigate to `html-report` folder
- Double click `index.html`
- Sẽ có dashboard với:
  - Test and Report Information
  - APDEX (Application Performance Index)
  - Requests Summary
  - Statistics
  - Errors
  - Top 5 Errors
  - Response Times Over Time
  - Throughput

### Bước 7.3: Chụp màn hình từ JMeter GUI

**Listeners hỗ trợ Save Image:**
1. Graph Results
2. Response Time Graph
3. jp@gc - Active Threads Over Time
4. jp@gc - Response Times Over Time
5. jp@gc - Transactions per Second

**Cách chụp:**
- Right click Listener → Save As Image
- Hoặc Right click chart area → Save Graph as PNG

**Cách chụp bảng:**
- View Results Tree, Aggregate Report, Summary Report
- Click vào bảng → Ctrl+A (select all) → Ctrl+C (copy)
- Paste vào Excel → Format → Chụp screenshot

### Bước 7.4: Xuất CSV để phân tích thêm
Right click Listener → Save Table Data
- Lưu file `.csv`
- Import vào Excel
- Tạo charts custom (Line, Bar, Scatter...)

### Bước 7.5: Export full data cho báo cáo
Menu: Tools → Save Selection Data
- Chọn output file: `test-results-full.csv`
- Mở Excel:
  - Tạo Pivot Table
  - Tạo biểu đồ đẹp hơn
  - Tính toán metrics custom

---

## 📊 CHECKLIST KẾT QUẢ CẦN THU THẬP CHO LUẬN VĂN

### Test 1: Routing
- ✅ Hình 4.X: Graph Results - Response time các endpoints
- ✅ Bảng 4.X: Aggregate Report với metrics chi tiết
- ✅ Screenshot View Results Tree cho 1 request thành công

### Test 2: Rate Limiting
- ✅ Hình 4.Y: Graph Results - Spike tại request 101+
- ✅ Screenshot View Results Tree: Request 100 (200 OK) vs Request 101 (429)
- ✅ Screenshot response body: "Too many requests" message

### Test 3: Authentication
- ✅ Hình 4.Z: View Results Tree với 5 scenarios
- ✅ Bảng: Status codes tương ứng (401, 200, 403)
- ✅ Screenshot JWT token trong header

### Test 4: Load Test
- ✅ Hình 4.W: Response Times Over Time
- ✅ Hình 4.V: Transactions per Second
- ✅ Hình 4.U: Active Threads Over Time
- ✅ Bảng 4.Y: Aggregate Report với 500 users

### Test 5: Stress Test
- ✅ Hình 4.T: Ultimate Thread Group - Bậc thang load
- ✅ Hình 4.S: Response time breakdown point
- ✅ Bảng: So sánh metrics ở các mức load (100, 300, 500, 1000)

### Bonus: HTML Report
- ✅ Screenshot dashboard tổng quan
- ✅ Charts từ HTML report (đẹp hơn GUI)

---

## 🎯 TIPS & BEST PRACTICES

### 1. Khi chạy test:
- Đóng các ứng dụng khác để tránh ảnh hưởng performance
- Chạy trên server/máy tính có cấu hình tốt
- Monitor CPU, RAM, Network trong quá trình test (Task Manager)

### 2. Để kết quả chính xác:
- Chạy mỗi test ít nhất 2-3 lần
- Lấy giá trị trung bình
- Warm-up system trước khi test chính thức (chạy 1 lần nhỏ)

### 3. Khi viết báo cáo:
- So sánh với benchmark của industry (ví dụ: response time < 200ms là tốt)
- Giải thích tại sao có metrics cao/thấp
- Đề xuất cải thiện dựa trên kết quả

### 4. Common Issues:
- **Error: Connection refused** → Check API Gateway đang chạy
- **Error: Address already in use** → Port conflict, đổi port
- **Out of memory** → Giảm số threads hoặc tăng RAM cho JMeter: `set HEAP=-Xms1g -Xmx4g`

### 5. Tham khảo thêm:
- JMeter Documentation: https://jmeter.apache.org/usermanual/index.html
- Best practices: https://jmeter.apache.org/usermanual/best-practices.html
- Plugins: https://jmeter-plugins.org/

---

## 📞 Troubleshooting

### Issue 1: JMeter chạy chậm
**Solution:**
```bash
# Tăng heap memory cho JMeter
# Edit file: C:\JMeter\bin\jmeter.bat
# Tìm dòng:
set HEAP=-Xms1g -Xmx4g
# (Thay đổi 4g thành 8g nếu máy có RAM đủ)
```

### Issue 2: Không chạy được Ultimate Thread Group
**Solution:**
- Install plugin: Options → Plugins Manager → Custom Thread Groups

### Issue 3: Graph Results không hiển thị
**Solution:**
- Save test plan
- Close và reopen JMeter
- Hoặc dùng command: jmeter -t test-plan.jmx

### Issue 4: API Gateway trả về 502/503
**Solution:**
- Check backend services đang chạy: `docker ps`
- Restart services: `docker compose restart`
- Check logs: `docker compose logs api-gateway`

---

## ✅ DONE!

Sau khi hoàn thành các test trên, bạn sẽ có:
- 10-15 hình ảnh minh chứng cho luận văn
- 5-7 bảng metrics chi tiết
- HTML report đầy đủ
- Data để phân tích và so sánh

**Chúc bạn test thành công! 🚀**

Nếu cần hỗ trợ thêm về JMeter hoặc giải thích kết quả, hãy hỏi thêm nhé!
