# ĐẠI HỌC CẦN THƠ

## KHOA CÔNG NGHỆ THÔNG TIN VÀ TRUYỀN THÔNG

---

<div align="center">

# LUẬN VĂN TỐT NGHIỆP ĐẠI HỌC

## HỆ THỐNG KINH DOANH ĐIỆN THOẠI DỰA TRÊN KIẾN TRÚC MICROSERVICE TÍCH HỢP CHATBOX TƯ VẤN SẢN PHẨM

### PHÂN HỆ: QUẢN LÝ SẢN PHẨM, ĐỢN HÀNG VÀ TÌM KIẾM SẢN PHẨM

**Online mobile phone business system based on microservice architecture integrating chatbox of product consulting - Module: Product, order management and product search**

</div>

---

**Ngành:** Công nghệ Thông tin  
**Chuyên ngành:** Công nghệ Phần mềm

**Sinh viên thực hiện:** [Họ tên sinh viên]  
**MSSV:** [Mã số sinh viên]  
**Lớp:** [Lớp]

**Giảng viên hướng dẫn:** [Họ tên giảng viên]

---

Cần Thơ, tháng 12 năm 2025

---

# LỜI CAM ĐOAN

Tôi xin cam đoan đây là công trình nghiên cứu của riêng tôi.

Các số liệu, kết quả nêu trong luận văn là trung thực và chưa từng được ai công bố trong bất kỳ công trình nào khác.

Tôi xin cam đoan rằng mọi sự giúp đỡ cho việc thực hiện luận văn này đã được cảm ơn và các thông tin trích dẫn trong luận văn đã được chỉ rõ nguồn gốc.

---

**Cần Thơ, ngày ... tháng ... năm 2025**

**Sinh viên thực hiện**

_(Ký và ghi rõ họ tên)_

---

# LỜI CẢM ƠN

Lời đầu tiên, em xin gửi lời cảm ơn sâu sắc đến Thầy/Cô [Tên giảng viên hướng dẫn], người đã tận tình hướng dẫn, chỉ bảo và động viên em trong suốt quá trình thực hiện luận văn tốt nghiệp này. Những kiến thức, kinh nghiệm quý báu mà Thầy/Cô truyền đạt đã giúp em hoàn thành tốt đề tài nghiên cứu.

Em xin chân thành cảm ơn quý Thầy Cô trong Khoa Công nghệ Thông tin và Truyền thông, Đại học Cần Thơ đã trang bị cho em những kiến thức nền tảng vững chắc về công nghệ thông tin, đặc biệt là các kiến thức về kiến trúc phần mềm, cơ sở dữ liệu, lập trình web và các công nghệ hiện đại.

Em xin cảm ơn gia đình, bạn bè đã luôn bên cạnh, động viên và tạo điều kiện tốt nhất để em có thể hoàn thành luận văn này.

Cuối cùng, em xin cảm ơn tất cả những người đã đóng góp ý kiến, giúp đỡ em trong quá trình thực hiện đề tài.

Mặc dù đã cố gắng hết sức, nhưng luận văn không tránh khỏi những thiếu sót. Em rất mong nhận được sự góp ý của quý Thầy Cô và các bạn để luận văn được hoàn thiện hơn.

Em xin chân thành cảm ơn!

---

**Cần Thơ, ngày ... tháng ... năm 2025**

**Sinh viên thực hiện**

---

# TÓM TẮT

Trong bối cảnh thương mại điện tử phát triển mạnh mẽ, đặc biệt là lĩnh vực kinh doanh điện thoại di động, việc xây dựng một hệ thống có khả năng mở rộng, dễ bảo trì và đáp ứng nhu cầu ngày càng cao của người dùng là vô cùng cần thiết. Luận văn này trình bày quá trình phân tích, thiết kế và triển khai hệ thống kinh doanh điện thoại di động **SmartBuy** dựa trên kiến trúc microservices, tích hợp chatbox tư vấn sản phẩm sử dụng trí tuệ nhân tạo.

Hệ thống được xây dựng gồm 11 microservices độc lập, bao gồm: API Gateway, User Service, User Manager Service, Product Service, Product Manager Service, Cart Service, Order Service, Order Manager Service, Payment Service, Review Service và Chatbox Service. Mỗi service đảm nhận một chức năng nghiệp vụ riêng biệt, giao tiếp với nhau thông qua RESTful API, đảm bảo tính độc lập, dễ bảo trì và khả năng mở rộng cao.

Đề tài tập trung vào phân hệ **Quản lý sản phẩm, đơn hàng và tìm kiếm sản phẩm**, bao gồm các chức năng chính:

- **Quản lý sản phẩm**: Thêm, sửa, xóa sản phẩm; quản lý danh mục, thương hiệu; quản lý tồn kho; upload hình ảnh sản phẩm.
- **Quản lý đơn hàng**: Tạo đơn hàng, theo dõi trạng thái đơn hàng, xử lý thanh toán, quản lý lịch sử đơn hàng, gửi email thông báo.
- **Tìm kiếm sản phẩm**: Tìm kiếm theo từ khóa, lọc theo danh mục, thương hiệu, khoảng giá; sắp xếp kết quả.
- **Chatbox tư vấn**: Tích hợp Dialogflow NLP để tư vấn sản phẩm, tra cứu đơn hàng, kiểm tra khuyến mãi thông qua hội thoại tự nhiên.

Hệ thống được phát triển sử dụng công nghệ hiện đại: **Node.js** và **Express.js** cho backend, **Vue.js 3** với **TypeScript** cho frontend, **MongoDB** làm cơ sở dữ liệu, **Docker** và **Docker Compose** để containerization và triển khai. Chatbox được xây dựng với **Google Dialogflow** cho xử lý ngôn ngữ tự nhiên và webhook để tích hợp với các services backend.

Kết quả đạt được là một hệ thống thương mại điện tử hoàn chỉnh, có khả năng xử lý đồng thời nhiều người dùng, dễ dàng mở rộng và bảo trì. Hệ thống đã được triển khai thành công trên môi trường Docker, đáp ứng các yêu cầu nghiệp vụ của một website bán hàng điện thoại di động hiện đại.

**Từ khóa:** Microservices, E-commerce, Chatbox, Dialogflow, Node.js, Vue.js, MongoDB, Docker, RESTful API, Product Management, Order Management.

---

# ABSTRACT

In the context of rapidly developing e-commerce, especially in the mobile phone business sector, building a system with scalability, maintainability, and the ability to meet increasingly high user demands is essential. This thesis presents the process of analyzing, designing, and implementing the **SmartBuy** mobile phone business system based on microservices architecture, integrating an AI-powered product consulting chatbox.

The system consists of 11 independent microservices: API Gateway, User Service, User Manager Service, Product Service, Product Manager Service, Cart Service, Order Service, Order Manager Service, Payment Service, Review Service, and Chatbox Service. Each service handles a specific business function and communicates through RESTful APIs, ensuring independence, easy maintenance, and high scalability.

The thesis focuses on the **Product, Order Management and Product Search** module, including main features:

- **Product Management**: Add, edit, delete products; manage categories and brands; inventory management; product image upload.
- **Order Management**: Create orders, track order status, process payments, manage order history, send notification emails.
- **Product Search**: Search by keywords, filter by category, brand, price range; sort results.
- **Consulting Chatbox**: Integrate Dialogflow NLP for product consultation, order tracking, and promotion checking through natural conversation.

The system is developed using modern technologies: **Node.js** and **Express.js** for backend, **Vue.js 3** with **TypeScript** for frontend, **MongoDB** as the database, **Docker** and **Docker Compose** for containerization and deployment. The chatbox is built with **Google Dialogflow** for natural language processing and webhooks for backend service integration.

The result is a complete e-commerce system capable of handling multiple concurrent users, easy to scale and maintain. The system has been successfully deployed on a Docker environment, meeting the business requirements of a modern mobile phone sales website.

**Keywords:** Microservices, E-commerce, Chatbox, Dialogflow, Node.js, Vue.js, MongoDB, Docker, RESTful API, Product Management, Order Management.

---

# MỤC LỤC

**LỜI CAM ĐOAN**

**LỜI CẢM ƠN**

**TÓM TẮT**

**ABSTRACT**

**MỤC LỤC**

**DANH MỤC CÁC KÝ HIỆU, CHỮ VIẾT TẮT**

**DANH MỤC CÁC BẢNG**

**DANH MỤC CÁC HÌNH**

---

## CHƯƠNG 1: TỔNG QUAN VỀ ĐỀ TÀI

### 1.1. Lý do chọn đề tài

#### 1.1.1. Bối cảnh và xu hướng phát triển

Trong thời đại chuyển đổi số, thương mại điện tử (E-commerce) đã và đang trở thành xu hướng tất yếu của nền kinh tế hiện đại. Theo báo cáo của Cục Thương mại điện tử và Kinh tế số (Bộ Công Thương Việt Nam), quy mô thị trường thương mại điện tử Việt Nam năm 2024 đạt khoảng 20,5 tỷ USD, tăng trưởng 25% so với năm 2023. Đặc biệt, ngành hàng điện tử - công nghệ, trong đó có **điện thoại di động**, luôn chiếm vị trí top 3 ngành hàng có doanh thu cao nhất với tỷ trọng khoảng 30% tổng doanh thu thương mại điện tử.

Điện thoại thông minh đã trở thành thiết bị không thể thiếu trong cuộc sống hiện đại, từ công việc, học tập đến giải trí. Theo số liệu từ Viện Nghiên cứu Thị trường IDC, Việt Nam có hơn 70 triệu người dùng smartphone với tỷ lệ thâm nhập đạt 72% dân số, tạo ra một thị trường tiềm năng khổng lồ cho ngành kinh doanh điện thoại trực tuyến.

#### 1.1.2. Những thách thức của hệ thống thương mại điện tử truyền thống

Mặc dù thương mại điện tử phát triển mạnh mẽ, các hệ thống truyền thống vẫn gặp phải nhiều thách thức:

**1. Về kiến trúc hệ thống:**

- **Kiến trúc Monolithic khó mở rộng**: Các hệ thống truyền thống thường được xây dựng theo kiến trúc nguyên khối (monolithic), khiến việc mở rộng quy mô trở nên khó khăn khi lượng truy cập tăng cao, đặc biệt trong các đợt khuyến mãi lớn.
- **Triển khai và bảo trì phức tạp**: Mọi thay đổi nhỏ đều yêu cầu build và deploy lại toàn bộ hệ thống, gây gián đoạn dịch vụ và tăng rủi ro lỗi.
- **Khó khăn trong việc áp dụng công nghệ mới**: Kiến trúc monolithic hạn chế khả năng áp dụng các công nghệ mới cho từng module riêng biệt.

**2. Về trải nghiệm người dùng:**

- **Thiếu tương tác thời gian thực**: Khách hàng thường phải tự tìm kiếm thông tin sản phẩm, so sánh cấu hình mà không có sự hỗ trợ tức thì.
- **Quy trình mua hàng chưa tối ưu**: Nhiều bước trong quy trình đặt hàng, thanh toán còn rườm rà, gây khó khăn cho người dùng mới.
- **Thiếu tính cá nhân hóa**: Hệ thống chưa có khả năng gợi ý sản phẩm phù hợp dựa trên nhu cầu và lịch sử mua hàng của khách hàng.

**3. Về quản lý và vận hành:**

- **Khó quản lý khi quy mô tăng**: Quản lý hàng nghìn sản phẩm với nhiều biến thể (màu sắc, bộ nhớ) trở nên phức tạp.
- **Thiếu công cụ hỗ trợ**: Chưa có chatbot tư vấn tự động, khiến đội ngũ chăm sóc khách hàng phải xử lý nhiều câu hỏi lặp lại.
- **Quản lý đơn hàng chưa đồng bộ**: Thiếu hệ thống theo dõi trạng thái đơn hàng theo thời gian thực.

#### 1.1.3. Giải pháp từ kiến trúc Microservices và Chatbox AI

**Kiến trúc Microservices** đã nổi lên như một xu hướng công nghệ tiên tiến, được các tập đoàn lớn như Amazon, Netflix, Uber áp dụng thành công. Microservices mang lại những lợi ích vượt trội:

- **Khả năng mở rộng linh hoạt**: Mỗi service có thể scale độc lập dựa trên nhu cầu thực tế (VD: Product Service cần xử lý nhiều request hơn trong đợt ra mắt sản phẩm mới).
- **Triển khai độc lập**: Mỗi service có thể deploy riêng mà không ảnh hưởng đến các service khác, giảm downtime.
- **Công nghệ đa dạng**: Mỗi service có thể sử dụng công nghệ phù hợp nhất cho chức năng của nó.
- **Dễ bảo trì và phát triển**: Team có thể làm việc độc lập trên từng service, tăng năng suất phát triển.
- **Fault Isolation**: Lỗi ở một service không làm sập toàn bộ hệ thống.

**Chatbox tích hợp AI (Dialogflow)** giúp tự động hóa quy trình chăm sóc khách hàng:

- **Tư vấn sản phẩm 24/7**: Hỗ trợ khách hàng tìm điện thoại phù hợp dựa trên nhu cầu (giá cả, cấu hình, thương hiệu).
- **Xử lý ngôn ngữ tự nhiên**: Hiểu câu hỏi của khách hàng và trả lời chính xác.
- **Tích hợp với hệ thống**: Tra cứu thông tin sản phẩm, kiểm tra đơn hàng, khuyến mãi trực tiếp từ database.
- **Giảm tải cho nhân viên**: Xử lý các câu hỏi thường gặp tự động, nhân viên chỉ xử lý các vấn đề phức tạp.

#### 1.1.4. Lý do lựa chọn đề tài

Xuất phát từ những phân tích trên, em nhận thấy cần có một giải pháp kết hợp cả kiến trúc hiện đại và công nghệ AI để xây dựng hệ thống thương mại điện tử bán điện thoại. Những lý do cụ thể khiến em lựa chọn đề tài này:

**1. Tính thực tiễn cao:**

- Thị trường điện thoại trực tuyến đang tăng trưởng mạnh, có nhu cầu thực tế.
- Các doanh nghiệp nhỏ và vừa cần giải pháp thương mại điện tử linh hoạt, chi phí hợp lý.

**2. Tính học thuật:**

- Nghiên cứu sâu về kiến trúc microservices - xu hướng công nghệ hiện đại.
- Tích hợp AI vào hệ thống thương mại điện tử - lĩnh vực đang được quan tâm.
- Áp dụng các design patterns, best practices trong phát triển phần mềm.

**3. Cơ hội học hỏi công nghệ:**

- Làm việc với stack công nghệ hiện đại: Node.js, Vue.js 3, MongoDB, Docker.
- Tích hợp các dịch vụ bên thứ ba: Dialogflow, VNPay.
- Triển khai hệ thống phân tán với 11 microservices.

**4. Khả năng mở rộng trong tương lai:**

- Hệ thống có thể mở rộng thêm các tính năng như: quản lý kho, vận chuyển, analytics, recommendation system.
- Có thể áp dụng cho các lĩnh vực kinh doanh khác (thời trang, mỹ phẩm, điện tử).

Chính vì những lý do trên, em quyết định chọn đề tài **"Hệ thống kinh doanh điện thoại dựa trên kiến trúc Microservice tích hợp Chatbox tư vấn sản phẩm - Phân hệ: Quản lý sản phẩm, đơn hàng và tìm kiếm sản phẩm"** làm đề tài luận văn tốt nghiệp, với mong muốn xây dựng một hệ thống hoàn chỉnh, có giá trị thực tiễn và đáp ứng xu hướng công nghệ hiện đại.

### 1.2. Mục tiêu nghiên cứu

#### 1.2.1. Mục tiêu chung

Xây dựng hệ thống kinh doanh điện thoại di động trực tuyến **SmartBuy** dựa trên kiến trúc microservices, tích hợp chatbox tư vấn sản phẩm thông minh, đáp ứng các yêu cầu về quản lý sản phẩm, quản lý đơn hàng và tìm kiếm sản phẩm một cách hiệu quả, có khả năng mở rộng và dễ bảo trì.

#### 1.2.2. Mục tiêu cụ thể

1. **Nghiên cứu và phân tích**:

   - Nghiên cứu kiến trúc microservices, các mô hình thiết kế và best practices.
   - Tìm hiểu công nghệ chatbox và xử lý ngôn ngữ tự nhiên (NLP) với Dialogflow.
   - Phân tích các hệ thống thương mại điện tử hiện có để rút ra ưu nhược điểm.

2. **Thiết kế hệ thống**:

   - Thiết kế kiến trúc microservices với 11 services độc lập.
   - Thiết kế cơ sở dữ liệu phân tán cho từng service.
   - Thiết kế API Gateway để điều phối các request.
   - Thiết kế giao diện người dùng thân thiện, responsive.

3. **Triển khai phân hệ quản lý sản phẩm**:

   - Xây dựng Product Service và Product Manager Service.
   - Chức năng CRUD sản phẩm, quản lý danh mục, thương hiệu.
   - Quản lý tồn kho, upload và quản lý hình ảnh sản phẩm.
   - Tính năng tìm kiếm, lọc và sắp xếp sản phẩm.

4. **Triển khai phân hệ quản lý đơn hàng**:

   - Xây dựng Order Service và Order Manager Service.
   - Chức năng tạo đơn hàng, theo dõi trạng thái đơn hàng.
   - Tích hợp thanh toán qua VNPay.
   - Quản lý lịch sử đơn hàng, gửi email thông báo tự động.

5. **Triển khai chatbox tư vấn**:

   - Tích hợp Google Dialogflow cho xử lý ngôn ngữ tự nhiên.
   - Xây dựng Chatbox Service với webhook để kết nối với backend.
   - Chức năng tư vấn sản phẩm, tra cứu đơn hàng qua hội thoại.

6. **Containerization và triển khai**:

   - Sử dụng Docker để đóng gói các services.
   - Triển khai hệ thống với Docker Compose.
   - Đảm bảo khả năng mở rộng và dễ dàng triển khai.

7. **Kiểm thử và đánh giá**:
   - Kiểm thử chức năng, tích hợp và hiệu năng.
   - Đánh giá khả năng đáp ứng yêu cầu của hệ thống.

### 1.3. Đối tượng và phạm vi nghiên cứu

#### 1.3.1. Đối tượng nghiên cứu

- Kiến trúc microservices và các design pattern liên quan.
- Công nghệ phát triển web hiện đại: Node.js, Express.js, Vue.js, TypeScript.
- Cơ sở dữ liệu NoSQL: MongoDB.
- Chatbox và xử lý ngôn ngữ tự nhiên với Google Dialogflow.
- Công nghệ containerization: Docker, Docker Compose.
- RESTful API và cơ chế giao tiếp giữa các services.

#### 1.3.2. Phạm vi nghiên cứu

**Phạm vi chức năng:**

Hệ thống SmartBuy bao gồm các chức năng chính:

1. **Đối với khách hàng**:

   - Đăng ký, đăng nhập, quản lý thông tin cá nhân.
   - Tìm kiếm, lọc, xem chi tiết sản phẩm.
   - Thêm sản phẩm vào giỏ hàng, quản lý giỏ hàng.
   - Đặt hàng, thanh toán online qua VNPay.
   - Theo dõi trạng thái đơn hàng.
   - Đánh giá và nhận xét sản phẩm.
   - Tương tác với chatbox để tư vấn sản phẩm, tra cứu đơn hàng.

2. **Đối với quản trị viên**:

   - Quản lý sản phẩm: thêm, sửa, xóa sản phẩm.
   - Quản lý danh mục, thương hiệu sản phẩm.
   - Quản lý tồn kho, giá sản phẩm.
   - Quản lý đơn hàng: xem, cập nhật trạng thái đơn hàng.
   - Quản lý người dùng.
   - Xem thống kê, báo cáo.

3. **Chatbox tư vấn**:
   - Tư vấn sản phẩm theo nhu cầu.
   - Tra cứu thông tin đơn hàng.
   - Kiểm tra khuyến mãi, so sánh giá.
   - Hướng dẫn mua hàng.

**Phạm vi kỹ thuật:**

- Backend: Node.js, Express.js, TypeScript
- Frontend: Vue.js 3, TypeScript, Vuetify, Tailwind CSS
- Database: MongoDB (11 databases riêng biệt cho các services)
- Chatbox: Google Dialogflow, Webhook
- Containerization: Docker, Docker Compose
- API: RESTful API
- Authentication: JWT (JSON Web Token)
- Payment Gateway: VNPay
- Email Service: Nodemailer

**Giới hạn:**

- Hệ thống chỉ tập trung vào sản phẩm điện thoại di động.
- Phương thức thanh toán chỉ hỗ trợ VNPay và COD (thanh toán khi nhận hàng).
- Chatbox chỉ hỗ trợ tiếng Việt.
- Chưa triển khai lên môi trường production thực tế.

### 1.4. Phương pháp nghiên cứu

#### 1.4.1. Phương pháp nghiên cứu lý thuyết

- **Thu thập tài liệu**: Nghiên cứu các tài liệu, bài báo khoa học, sách chuyên ngành về kiến trúc microservices, thương mại điện tử, chatbox và NLP.
- **Phân tích và tổng hợp**: Phân tích các hệ thống thương mại điện tử hiện có (Shopee, Tiki, Lazada, Thế Giới Di Động) để rút ra ưu điểm, nhược điểm và kinh nghiệm triển khai.
- **Nghiên cứu công nghệ**: Tìm hiểu các công nghệ, framework, thư viện liên quan như Node.js, Vue.js, MongoDB, Docker, Dialogflow.

#### 1.4.2. Phương pháp thực nghiệm

- **Thiết kế và mô hình hóa**: Sử dụng UML để mô hình hóa hệ thống (Use Case Diagram, Sequence Diagram, ERD).
- **Phát triển theo mô hình Agile**: Chia nhỏ dự án thành các sprint, phát triển từng module một cách độc lập.
- **Triển khai và kiểm thử**:
  - Xây dựng từng microservice độc lập.
  - Tích hợp các services thông qua API Gateway.
  - Kiểm thử đơn vị, tích hợp và end-to-end.
  - Sử dụng Docker để containerization và triển khai.
- **Đánh giá và cải thiện**: Thu thập phản hồi, đánh giá hiệu năng và cải thiện hệ thống.

### 1.5. Ý nghĩa khoa học và thực tiễn

#### 1.5.1. Ý nghĩa khoa học

- Nghiên cứu và ứng dụng kiến trúc microservices trong xây dựng hệ thống thương mại điện tử, đóng góp vào việc phát triển các hệ thống phân tán quy mô lớn.
- Tích hợp công nghệ chatbox với NLP (Dialogflow) vào hệ thống bán hàng, cải thiện trải nghiệm người dùng và tự động hóa quy trình tư vấn.
- Đề xuất mô hình thiết kế và triển khai hệ thống microservices với MongoDB, Docker và RESTful API.

#### 1.5.2. Ý nghĩa thực tiễn

- **Đối với doanh nghiệp**:

  - Cung cấp giải pháp thương mại điện tử hiện đại, dễ mở rộng và bảo trì.
  - Giảm chi phí vận hành nhờ tự động hóa quy trình tư vấn và xử lý đơn hàng.
  - Tăng doanh thu thông qua việc cải thiện trải nghiệm khách hàng.

- **Đối với khách hàng**:

  - Trải nghiệm mua sắm trực tuyến thuận tiện, nhanh chóng.
  - Được tư vấn sản phẩm 24/7 qua chatbox thông minh.
  - Dễ dàng tìm kiếm, so sánh và lựa chọn sản phẩm phù hợp.

- **Đối với sinh viên**:
  - Tài liệu tham khảo cho các đề tài liên quan đến thương mại điện tử, microservices.
  - Codebase mẫu để học tập và phát triển thêm.

### 1.6. Nội dung nghiên cứu

Để đạt được các mục tiêu đã đề ra, nội dung nghiên cứu của luận văn được chia thành các phần sau:

#### 1.6.1. Nghiên cứu lý thuyết

**1. Nghiên cứu kiến trúc Microservices:**

- Tìm hiểu khái niệm, đặc điểm và ưu điểm của kiến trúc microservices.
- So sánh với kiến trúc monolithic truyền thống.
- Các design patterns trong microservices: API Gateway, Service Discovery, Circuit Breaker, Database per Service.
- Chiến lược giao tiếp giữa các services: Synchronous (REST) vs Asynchronous (Message Queue).

**2. Nghiên cứu công nghệ Chatbox và NLP:**

- Tìm hiểu về Google Dialogflow và cách thức hoạt động.
- Xử lý ngôn ngữ tự nhiên (NLP): Intent, Entity, Context.
- Webhook và tích hợp Dialogflow với backend.
- Thiết kế conversation flow cho chatbox tư vấn sản phẩm.

**3. Nghiên cứu các hệ thống thương mại điện tử:**

- Phân tích các hệ thống hiện có: Thế Giới Di Động, Shopee, Tiki.
- Nghiên cứu quy trình mua hàng, thanh toán, quản lý đơn hàng.
- Các tính năng nổi bật: tìm kiếm, lọc sản phẩm, giỏ hàng, đánh giá.

#### 1.6.2. Phân tích và thiết kế

**1. Phân tích yêu cầu:**

- Thu thập yêu cầu chức năng và phi chức năng.
- Xác định các actor: Khách hàng, Quản trị viên, Chatbox.
- Vẽ Use Case Diagram chi tiết.

**2. Thiết kế kiến trúc hệ thống:**

- Thiết kế kiến trúc microservices với 11 services:
  - API Gateway (Port 3000)
  - User Service (Port 3005)
  - User Manager Service (Port 3006)
  - Product Service (Port 3001)
  - Product Manager Service (Port 5002)
  - Cart Service (Port 3003)
  - Order Service (Port 3002)
  - Order Manager Service (Port 5003)
  - Payment Service (Port 3004)
  - Review Service (Port 5006)
  - Chatbox Service (Port 5008)
- Thiết kế API Gateway cho routing và authentication.

**3. Thiết kế cơ sở dữ liệu:**

- Áp dụng pattern "Database per Service".
- Thiết kế schema cho 6 databases riêng biệt:
  - smartbuy_db (User, Address)
  - smartbuy_db_product (Product, Category, Brand)
  - smartbuy_db_cart (Cart, CartItem)
  - smartbuy_db_order (Order, OrderItem)
  - smartbuy_db_payment (Payment, Transaction)
  - smartbuy_db_review (Review)
- Entity Relationship Diagram (ERD).

**4. Thiết kế giao diện:**

- Wireframe và mockup cho giao diện người dùng.
- Thiết kế responsive layout cho mobile và desktop.
- Thiết kế admin dashboard.

#### 1.6.3. Triển khai hệ thống

**1. Xây dựng Backend Microservices:**

- **User Service & User Manager**:

  - Đăng ký, đăng nhập với JWT authentication.
  - Quản lý thông tin cá nhân, địa chỉ giao hàng.
  - Password hashing với bcrypt.
  - Email verification và password reset.

- **Product Service & Product Manager**:

  - CRUD sản phẩm với variants (màu sắc, bộ nhớ).
  - Quản lý danh mục và thương hiệu.
  - Upload hình ảnh sản phẩm.
  - Tìm kiếm và lọc sản phẩm.

- **Cart Service**:

  - Thêm, sửa, xóa sản phẩm trong giỏ hàng.
  - Quản lý số lượng và variants.
  - Tính toán tự động giá trị giỏ hàng.

- **Order Service & Order Manager**:

  - Tạo đơn hàng từ giỏ hàng.
  - Quản lý workflow với 11 trạng thái.
  - Gửi email thông báo với Nodemailer.

- **Payment Service**:

  - Tích hợp VNPay payment gateway.
  - Xử lý callback và verify signature.
  - Hỗ trợ COD (Cash on Delivery).

- **Review Service**:

  - Đánh giá sản phẩm (rating 1-5 sao).
  - Upload hình ảnh đánh giá.
  - Hệ thống "helpful" votes.

- **Chatbox Service**:
  - Webhook nhận request từ Dialogflow.
  - Xử lý intent: tư vấn sản phẩm, tra cứu đơn hàng.
  - Kết nối với Product và Order services.

**2. Xây dựng Frontend:**

- Single Page Application (SPA) với Vue.js 3.
- State management với Pinia.
- UI Framework: Vuetify 3, Tailwind CSS.
- Routing với Vue Router.
- Tích hợp Dialogflow Messenger cho chatbox.

**3. Containerization:**

- Viết Dockerfile cho từng service.
- Docker Compose để orchestrate các services.
- Quản lý môi trường với .env files.

**4. Kiểm thử:**

- Unit testing cho các API endpoints.
- Integration testing cho luồng nghiệp vụ.
- Manual testing giao diện người dùng.

### 1.7. Công nghệ và công cụ sử dụng

#### 1.7.1. Công nghệ Backend

**Bảng 1.1: Công nghệ Backend**

| Công nghệ  | Phiên bản | Vai trò                                     |
| ---------- | --------- | ------------------------------------------- |
| Node.js    | 18.x      | Runtime environment cho JavaScript          |
| Express.js | 4.18.x    | Web framework xây dựng RESTful API          |
| TypeScript | 5.x       | Ngôn ngữ lập trình type-safe                |
| Mongoose   | 8.x       | ODM cho MongoDB                             |
| JWT        | 9.x       | Authentication và authorization             |
| Bcrypt     | 5.x       | Mã hóa password                             |
| Nodemailer | 6.x       | Gửi email thông báo                         |
| Multer     | 1.4.x     | Upload file/hình ảnh                        |
| Axios      | 1.6.x     | HTTP client cho inter-service communication |

#### 1.7.2. Công nghệ Frontend

**Bảng 1.2: Công nghệ Frontend**

| Công nghệ    | Phiên bản | Vai trò                           |
| ------------ | --------- | --------------------------------- |
| Vue.js       | 3.4.x     | Progressive JavaScript framework  |
| TypeScript   | 5.x       | Ngôn ngữ lập trình type-safe      |
| Vite         | 5.x       | Build tool và dev server nhanh    |
| Vue Router   | 4.x       | Client-side routing               |
| Pinia        | 2.x       | State management                  |
| Vuetify      | 3.x       | Material Design component library |
| Tailwind CSS | 3.x       | Utility-first CSS framework       |
| Axios        | 1.6.x     | HTTP client                       |

#### 1.7.3. Cơ sở dữ liệu và Chatbox

**Bảng 1.3: Database và AI**

| Công nghệ            | Phiên bản | Vai trò                                 |
| -------------------- | --------- | --------------------------------------- |
| MongoDB              | 7.0.x     | NoSQL database                          |
| Google Dialogflow ES | -         | Natural Language Processing cho chatbox |

#### 1.7.4. DevOps và Deployment

**Bảng 1.4: DevOps Tools**

| Công cụ        | Phiên bản | Vai trò                          |
| -------------- | --------- | -------------------------------- |
| Docker         | 24.x      | Containerization platform        |
| Docker Compose | 2.x       | Multi-container orchestration    |
| Git            | 2.x       | Version control system           |
| GitHub         | -         | Code repository và collaboration |
| Postman        | -         | API testing                      |

#### 1.7.5. Môi trường phát triển

**Bảng 1.5: Development Environment**

| Công cụ            | Vai trò                               |
| ------------------ | ------------------------------------- |
| Visual Studio Code | Code editor chính                     |
| MongoDB Compass    | GUI tool quản lý MongoDB              |
| Dialogflow Console | Quản lý và training chatbox           |
| Figma              | Thiết kế UI/UX                        |
| Draw.io            | Vẽ sơ đồ kiến trúc, ERD               |
| Nodemon            | Auto-restart server khi code thay đổi |

### 1.8. Bố cục luận văn

Luận văn được tổ chức thành 5 chương chính với cấu trúc logic và mạch lạc:

**CHƯƠNG 1: TỔNG QUAN VỀ ĐỀ TÀI**

Chương này giới thiệu tổng quan về đề tài, bao gồm:

- Lý do chọn đề tài với phân tích bối cảnh, thách thức và giải pháp.
- Mục tiêu nghiên cứu (mục tiêu chung và 7 mục tiêu cụ thể).
- Đối tượng và phạm vi nghiên cứu (chức năng, công nghệ, giới hạn).
- Phương pháp nghiên cứu (lý thuyết và thực nghiệm).
- Ý nghĩa khoa học và thực tiễn của đề tài.
- Nội dung nghiên cứu chi tiết.
- Công nghệ và công cụ sử dụng.

**CHƯƠNG 2: CƠ SỞ LÝ THUYẾT**

Chương này cung cấp nền tảng lý thuyết cho dự án:

- Tổng quan về thương mại điện tử (khái niệm, đặc điểm, mô hình).
- Kiến trúc Microservices (khái niệm, đặc điểm, ưu nhược điểm).
- RESTful API và các nguyên tắc thiết kế.
- Chatbox và xử lý ngôn ngữ tự nhiên (NLP).
- Google Dialogflow (Intent, Entity, Context, Webhook).
- Các công nghệ sử dụng (Node.js, Vue.js, MongoDB, Docker).
- JWT Authentication và bảo mật.
- Payment Gateway (VNPay).

**CHƯƠNG 3: PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG**

Chương này trình bày quá trình phân tích và thiết kế:

- Phân tích yêu cầu hệ thống (chức năng, phi chức năng).
- Use Case Diagram tổng quan và chi tiết.
- Mô tả chi tiết Use Cases quan trọng (Đăng nhập, Đặt hàng, Thanh toán).
- Sequence Diagrams cho các luồng nghiệp vụ chính.
- Class Diagram toàn hệ thống (6 main classes với relationships).
- Design Patterns áp dụng (Repository, DTO, Snapshot, Strategy, Observer, State).
- Thiết kế kiến trúc microservices (11 services).
- Thiết kế cơ sở dữ liệu (6 databases với schema chi tiết).
- Thiết kế API Gateway và RESTful API.
- Thiết kế giao diện người dùng (wireframe, mockup).

**CHƯƠNG 4: TRIỂN KHAI HỆ THỐNG**

Chương này trình bày chi tiết quá trình triển khai:

- Cài đặt môi trường phát triển.
- Triển khai Backend Microservices:
  - Chi tiết từng service (User, Product, Cart, Order, Payment, Review, Chatbox).
  - Cấu trúc thư mục và mã nguồn chính.
  - API endpoints và business logic.
- Triển khai Frontend:
  - Cấu trúc Vue.js project.
  - Các components chính.
  - State management với Pinia.
  - Routing và navigation.
- Tích hợp Dialogflow Chatbox:
  - Training intents và entities.
  - Xây dựng webhook service.
  - Kết nối với backend services.
- Tích hợp thanh toán VNPay:
  - Tạo payment URL.
  - Xử lý callback và verify signature.
- Containerization với Docker:
  - Dockerfile cho từng service.
  - Docker Compose configuration.
- Email notification với Nodemailer.

**CHƯƠNG 5: KẾT QUẢ VÀ ĐÁNH GIÁ**

Chương này trình bày kết quả và đánh giá hệ thống:

- Kết quả triển khai:
  - Giao diện người dùng (screenshots).
  - Giao diện admin.
  - Chatbox tư vấn sản phẩm.
- Kiểm thử hệ thống:
  - Kiểm thử chức năng (test cases).
  - Kiểm thử API (Postman).
  - Kiểm thử tích hợp.
  - Kiểm thử hiệu năng.
- Đánh giá:
  - So sánh với mục tiêu đề ra.
  - Ưu điểm của hệ thống.
  - Hạn chế và khó khăn gặp phải.
- Hướng phát triển tương lai:
  - Triển khai Kubernetes cho production.
  - Thêm tính năng recommendation system.
  - Tối ưu hiệu năng với caching (Redis).
  - Xây dựng mobile app.
  - Thêm analytics và reporting.

**KẾT LUẬN**

- Tổng kết những kết quả đạt được.
- Đóng góp của luận văn.
- Những bài học kinh nghiệm.
- Cam kết tiếp tục phát triển.

**TÀI LIỆU THAM KHẢO**

**PHỤ LỤC**

- Phụ lục A: Mã nguồn các API endpoints chính.
- Phụ lục B: Database schemas chi tiết.
- Phụ lục C: Dialogflow training phrases và responses.
- Phụ lục D: Docker configurations.
- Phụ lục E: Environment variables.

Bố cục trên đảm bảo tính logic, mạch lạc và toàn diện, từ lý thuyết đến thực hành, từ phân tích đến triển khai và đánh giá kết quả.

---

## CHƯƠNG 2: CƠ SỞ LÝ THUYẾT

### 2.1. Tổng quan về thương mại điện tử

#### 2.1.1. Khái niệm thương mại điện tử

Thương mại điện tử (E-commerce - Electronic Commerce) là việc mua bán, trao đổi hàng hóa, dịch vụ và thông tin qua mạng Internet hoặc các phương tiện điện tử khác. Theo định nghĩa của Tổ chức Thương mại Thế giới (WTO), thương mại điện tử là hoạt động sản xuất, quảng cáo, mua bán và phân phối sản phẩm thông qua các mạng viễn thông.

#### 2.1.2. Đặc điểm của thương mại điện tử

- **Tính toàn cầu**: Không bị giới hạn bởi ranh giới địa lý.
- **Hoạt động 24/7**: Khách hàng có thể mua sắm bất cứ lúc nào.
- **Chi phí thấp**: Tiết kiệm chi phí thuê mặt bằng, nhân sự.
- **Cá nhân hóa**: Có thể tùy chỉnh trải nghiệm cho từng khách hàng.
- **Dễ dàng so sánh**: Khách hàng có thể so sánh giá và chất lượng sản phẩm.

#### 2.1.3. Các mô hình thương mại điện tử

- **B2C (Business-to-Consumer)**: Doanh nghiệp bán hàng cho người tiêu dùng (Shopee, Tiki, Lazada).
- **B2B (Business-to-Business)**: Doanh nghiệp bán hàng cho doanh nghiệp.
- **C2C (Consumer-to-Consumer)**: Người tiêu dùng bán hàng cho người tiêu dùng (Chợ Tốt).
- **C2B (Consumer-to-Business)**: Người tiêu dùng cung cấp dịch vụ cho doanh nghiệp.

Hệ thống **SmartBuy** được xây dựng theo mô hình **B2C**, phục vụ nhu cầu mua sắm điện thoại di động trực tuyến của người tiêu dùng.

### 2.2. Kiến trúc Microservices

#### 2.2.1. Kiến trúc Monolithic

Kiến trúc Monolithic (nguyên khối) là mô hình truyền thống trong phát triển phần mềm, trong đó toàn bộ ứng dụng được xây dựng thành một khối duy nhất. Tất cả các thành phần như giao diện người dùng, logic nghiệp vụ và truy cập dữ liệu được đóng gói trong cùng một ứng dụng.

**Ưu điểm:**

- Đơn giản trong phát triển và triển khai ban đầu.
- Dễ dàng kiểm thử và debug.
- Hiệu năng cao do các thành phần giao tiếp nội bộ.

**Nhược điểm:**

- Khó mở rộng khi ứng dụng phát triển lớn.
- Thay đổi một phần nhỏ yêu cầu triển khai lại toàn bộ hệ thống.
- Khó áp dụng công nghệ mới cho từng module.
- Rủi ro cao: một lỗi có thể làm sập toàn bộ hệ thống.

#### 2.2.2. Kiến trúc Microservices

Microservices là một kiểu kiến trúc phần mềm trong đó ứng dụng được chia thành nhiều dịch vụ nhỏ, độc lập. Mỗi service đảm nhận một chức năng nghiệp vụ cụ thể, có thể được phát triển, triển khai và mở rộng độc lập.

**Đặc điểm chính:**

1. **Tính độc lập**: Mỗi service là một đơn vị độc lập, có database riêng.
2. **Phân tán**: Các services giao tiếp với nhau qua network (HTTP/REST, message queue).
3. **Decentralized**: Không có điểm trung tâm điều khiển tất cả.
4. **Đa công nghệ**: Mỗi service có thể sử dụng công nghệ, ngôn ngữ khác nhau.
5. **Failure Isolation**: Lỗi ở một service không ảnh hưởng đến toàn bộ hệ thống.

**Ưu điểm:**

- **Khả năng mở rộng cao**: Mỗi service có thể scale độc lập dựa trên nhu cầu.
- **Dễ bảo trì**: Code base nhỏ gọn, dễ hiểu và sửa đổi.
- **Triển khai linh hoạt**: Deploy từng service mà không ảnh hưởng đến hệ thống.
- **Chịu lỗi tốt**: Một service gặp sự cố không làm sập toàn bộ hệ thống.
- **Đa dạng công nghệ**: Mỗi team có thể chọn công nghệ phù hợp nhất.
- **Tái sử dụng**: Các service có thể được sử dụng lại cho các dự án khác.

**Nhược điểm:**

- **Phức tạp trong quản lý**: Nhiều service cần orchestration và monitoring.
- **Overhead mạng**: Giao tiếp giữa các service qua network chậm hơn in-process.
- **Distributed transaction**: Khó quản lý transaction across services.
- **Testing phức tạp**: Cần test integration giữa nhiều services.

#### 2.2.3. So sánh Monolithic và Microservices

| Tiêu chí             | Monolithic             | Microservices                |
| -------------------- | ---------------------- | ---------------------------- |
| **Kiến trúc**        | Một khối duy nhất      | Nhiều services độc lập       |
| **Độ phức tạp**      | Đơn giản ban đầu       | Phức tạp hơn                 |
| **Scalability**      | Scale toàn bộ ứng dụng | Scale từng service riêng     |
| **Deployment**       | Deploy toàn bộ         | Deploy từng service          |
| **Technology Stack** | Một stack duy nhất     | Đa dạng stack                |
| **Database**         | Shared database        | Database per service         |
| **Development**      | Team tập trung         | Team độc lập cho mỗi service |
| **Failure Impact**   | Toàn bộ hệ thống       | Chỉ ảnh hưởng service bị lỗi |
| **Phù hợp**          | Dự án nhỏ, startup     | Dự án lớn, cần scale cao     |

#### 2.2.4. API Gateway Pattern

API Gateway là một design pattern quan trọng trong kiến trúc microservices. Nó đóng vai trò là single entry point cho tất cả các client requests, sau đó routing requests đến các microservices tương ứng.

**Chức năng của API Gateway:**

- **Request Routing**: Điều hướng request đến service phù hợp.
- **Authentication & Authorization**: Xác thực và phân quyền người dùng.
- **Rate Limiting**: Giới hạn số lượng request.
- **Load Balancing**: Phân phối tải giữa các instances của service.
- **Caching**: Cache response để tăng performance.
- **Logging & Monitoring**: Ghi log và giám sát.
- **Request/Response Transformation**: Chuyển đổi định dạng dữ liệu.

### 2.3. Công nghệ RESTful API

#### 2.3.1. REST và RESTful API

**REST (Representational State Transfer)** là một kiến trúc thiết kế cho các hệ thống phân tán, được Roy Fielding đề xuất năm 2000. RESTful API là API tuân thủ các nguyên tắc của REST.

**Nguyên tắc của REST:**

1. **Client-Server**: Tách biệt client và server.
2. **Stateless**: Mỗi request từ client phải chứa đầy đủ thông tin, server không lưu state.
3. **Cacheable**: Response có thể được cache để tăng performance.
4. **Uniform Interface**: Giao diện thống nhất giữa client và server.
5. **Layered System**: Hệ thống có thể có nhiều lớp trung gian.
6. **Code on Demand (tùy chọn)**: Server có thể gửi code để client thực thi.

#### 2.3.2. HTTP Methods trong RESTful API

| Method     | Chức năng         | Ví dụ                                        |
| ---------- | ----------------- | -------------------------------------------- |
| **GET**    | Lấy dữ liệu       | `GET /api/products` - Lấy danh sách sản phẩm |
| **POST**   | Tạo mới           | `POST /api/products` - Tạo sản phẩm mới      |
| **PUT**    | Cập nhật toàn bộ  | `PUT /api/products/123` - Cập nhật sản phẩm  |
| **PATCH**  | Cập nhật một phần | `PATCH /api/products/123` - Cập nhật giá     |
| **DELETE** | Xóa               | `DELETE /api/products/123` - Xóa sản phẩm    |

#### 2.3.3. HTTP Status Codes

- **2xx Success**:

  - `200 OK`: Request thành công.
  - `201 Created`: Tạo resource thành công.
  - `204 No Content`: Xóa thành công.

- **4xx Client Errors**:

  - `400 Bad Request`: Request không hợp lệ.
  - `401 Unauthorized`: Chưa xác thực.
  - `403 Forbidden`: Không có quyền truy cập.
  - `404 Not Found`: Không tìm thấy resource.

- **5xx Server Errors**:
  - `500 Internal Server Error`: Lỗi server.
  - `503 Service Unavailable`: Service không khả dụng.

#### 2.3.4. Thiết kế RESTful API

**Best Practices:**

1. **Sử dụng danh từ số nhiều**: `/api/products`, `/api/orders`
2. **Sử dụng HTTP methods đúng ngữ nghĩa**
3. **Versioning**: `/api/v1/products`
4. **Filtering, Sorting, Pagination**:
   - `GET /api/products?category=phone&price_min=1000000`
   - `GET /api/products?sort=price&order=asc&page=2&limit=20`
5. **Nested resources**: `GET /api/products/123/reviews`
6. **Response format nhất quán** (JSON)
7. **Error handling**: Trả về error message rõ ràng

### 2.4. Chatbox và xử lý ngôn ngữ tự nhiên (NLP)

#### 2.4.1. Chatbox là gì?

Chatbox (hay Chatbot) là một chương trình máy tính được thiết kế để mô phỏng cuộc trò chuyện với người dùng thông qua văn bản hoặc giọng nói. Chatbox sử dụng trí tuệ nhân tạo (AI) và xử lý ngôn ngữ tự nhiên (NLP) để hiểu và phản hồi các câu hỏi của người dùng.

**Phân loại Chatbox:**

1. **Rule-based Chatbox**: Hoạt động dựa trên các quy tắc được định nghĩa trước.
2. **AI Chatbox**: Sử dụng machine learning và NLP để học và cải thiện theo thời gian.
3. **Hybrid Chatbox**: Kết hợp cả rule-based và AI.

#### 2.4.2. Xử lý ngôn ngữ tự nhiên (NLP)

**Natural Language Processing (NLP)** là một lĩnh vực của trí tuệ nhân tạo tập trung vào việc giúp máy tính hiểu, phân tích và sinh ra ngôn ngữ tự nhiên của con người.

**Các thành phần chính của NLP:**

1. **Intent Recognition**: Nhận diện ý định của người dùng.
2. **Entity Extraction**: Trích xuất thông tin quan trọng (tên sản phẩm, giá, ngày tháng).
3. **Context Management**: Quản lý ngữ cảnh cuộc hội thoại.
4. **Response Generation**: Sinh ra câu trả lời phù hợp.

#### 2.4.3. Google Dialogflow

**Dialogflow** là nền tảng của Google dùng để xây dựng chatbox và ứng dụng hội thoại. Dialogflow cung cấp công cụ NLP mạnh mẽ để hiểu ngôn ngữ tự nhiên và xây dựng các cuộc hội thoại phức tạp.

**Các khái niệm chính trong Dialogflow:**

1. **Agent**: Là chatbot, chứa tất cả các cấu hình.
2. **Intent**: Mục đích của người dùng (ví dụ: tìm kiếm sản phẩm, tra cứu đơn hàng).
3. **Entity**: Thực thể cần trích xuất (ví dụ: tên sản phẩm, giá cả).
4. **Training Phrases**: Các mẫu câu để train chatbot.
5. **Response**: Câu trả lời của chatbot.
6. **Fulfillment/Webhook**: Endpoint để xử lý logic phức tạp, kết nối với backend.

**Quy trình hoạt động:**

```
User Input → Dialogflow NLP → Intent Matching → Webhook (nếu cần) → Response
```

#### 2.4.4. Ứng dụng Chatbox trong E-commerce

- **Tư vấn sản phẩm**: Gợi ý sản phẩm dựa trên nhu cầu.
- **Hỗ trợ khách hàng 24/7**: Trả lời câu hỏi thường gặp.
- **Theo dõi đơn hàng**: Kiểm tra trạng thái đơn hàng.
- **Quản lý giỏ hàng**: Thêm, xóa sản phẩm qua chatbox.
- **Thông báo khuyến mãi**: Cập nhật ưu đãi mới nhất.
- **Thu thập phản hồi**: Đánh giá sản phẩm và dịch vụ.

### 2.5. Các công nghệ sử dụng

#### 2.5.1. Node.js

**Node.js** là một JavaScript runtime được xây dựng trên Chrome's V8 JavaScript engine. Node.js cho phép chạy JavaScript trên server-side, sử dụng mô hình event-driven, non-blocking I/O.

**Ưu điểm:**

- **Hiệu năng cao**: Non-blocking I/O phù hợp cho ứng dụng real-time.
- **Một ngôn ngữ**: Sử dụng JavaScript cho cả frontend và backend.
- **NPM**: Hệ sinh thái package phong phú.
- **Scalability**: Dễ dàng scale với microservices.

**Ứng dụng**: Xây dựng tất cả các backend services trong hệ thống SmartBuy.

#### 2.5.2. Express.js

**Express.js** là một web framework tối giản và linh hoạt cho Node.js, cung cấp các tính năng mạnh mẽ để xây dựng web và mobile applications.

**Tính năng:**

- Routing mạnh mẽ.
- Middleware system linh hoạt.
- Template engine integration.
- Static file serving.
- Error handling.

**Ứng dụng**: Framework chính để xây dựng RESTful API cho các microservices.

#### 2.5.3. MongoDB

**MongoDB** là một hệ quản trị cơ sở dữ liệu NoSQL, lưu trữ dữ liệu dưới dạng document (JSON-like).

**Ưu điểm:**

- **Schema linh hoạt**: Dễ dàng thay đổi cấu trúc dữ liệu.
- **Scalability**: Hỗ trợ sharding để scale horizontal.
- **High Performance**: Truy vấn nhanh với index.
- **Rich Query Language**: Hỗ trợ truy vấn phức tạp.

**Ứng dụng**: Sử dụng 11 databases riêng biệt cho từng microservice (Product DB, Order DB, User DB, Cart DB, Payment DB, Review DB).

#### 2.5.4. Vue.js 3

**Vue.js** là một progressive JavaScript framework để xây dựng giao diện người dùng. Vue.js 3 là phiên bản mới nhất với nhiều cải tiến về performance và API.

**Tính năng chính:**

- **Reactive Data Binding**: Tự động cập nhật UI khi data thay đổi.
- **Component-based**: Xây dựng UI từ các component tái sử dụng.
- **Composition API**: API mới giúp organize code tốt hơn.
- **TypeScript Support**: Hỗ trợ TypeScript tốt.
- **Virtual DOM**: Tối ưu performance.

**Ecosystem:**

- **Vue Router**: Quản lý routing.
- **Pinia**: State management (thay thế Vuex).
- **Vuetify**: UI component library (Material Design).
- **Vite**: Build tool nhanh.

**Ứng dụng**: Xây dựng toàn bộ frontend của hệ thống SmartBuy.

#### 2.5.5. TypeScript

**TypeScript** là một superset của JavaScript, thêm static typing và các tính năng OOP mạnh mẽ.

**Ưu điểm:**

- **Type Safety**: Phát hiện lỗi sớm trong quá trình phát triển.
- **Better IDE Support**: Autocomplete, refactoring tốt hơn.
- **Maintainability**: Code dễ đọc và bảo trì hơn.
- **OOP Features**: Class, Interface, Generics.

**Ứng dụng**: Sử dụng cho cả frontend (Vue.js) và một số backend services (API Gateway).

#### 2.5.6. Docker

**Docker** là một platform để develop, ship và run applications trong containers. Container là một đơn vị chuẩn hóa phần mềm, đóng gói code và tất cả dependencies.

**Ưu điểm:**

- **Consistency**: Chạy giống nhau trên mọi môi trường.
- **Isolation**: Mỗi container độc lập.
- **Lightweight**: Nhẹ hơn so với Virtual Machines.
- **Scalability**: Dễ dàng scale bằng cách tạo thêm container.
- **Version Control**: Quản lý image versions.

**Docker Compose**:

Công cụ để define và run multi-container Docker applications. Sử dụng file `docker-compose.yml` để cấu hình tất cả services.

**Ứng dụng**: Containerization toàn bộ hệ thống SmartBuy (11 backend services, 1 frontend, MongoDB).

#### 2.5.7. JWT (JSON Web Token)

**JWT** là một chuẩn mở (RFC 7519) để truyền thông tin an toàn giữa các bên dưới dạng JSON object.

**Cấu trúc JWT:**

```
Header.Payload.Signature
```

- **Header**: Algorithm và loại token.
- **Payload**: Claims (thông tin user).
- **Signature**: Chữ ký để verify token.

**Ưu điểm:**

- **Stateless**: Server không cần lưu session.
- **Scalable**: Phù hợp với microservices.
- **Cross-domain**: Dễ dàng sử dụng cho nhiều services.

**Ứng dụng trong SmartBuy:**

Hệ thống SmartBuy sử dụng JWT để xác thực và phân quyền người dùng:

1. **Access Token**: Thời hạn 15 phút, chứa thông tin user (id, email, isAdmin).
2. **Refresh Token**: Thời hạn 7 ngày, lưu trong database để có thể revoke.
3. **Authentication Flow**:
   - User đăng nhập → Server tạo Access Token + Refresh Token
   - Client lưu Access Token trong localStorage
   - Refresh Token lưu trong httpOnly cookie
   - Mỗi request gửi Access Token trong header `Authorization: Bearer <token>`
   - Khi Access Token hết hạn → Dùng Refresh Token để lấy token mới

**Phân quyền người dùng:**

Hệ thống SmartBuy sử dụng trường `isAdmin` trong User model để phân biệt quyền:

```javascript
// User Schema
{
  email: String,
  password: String,
  isAdmin: Boolean,  // true = Admin, false = Khách hàng
  isVerified: Boolean,
  isBlocked: Boolean,
  refreshToken: String
}
```

**Cơ chế xác thực:**

1. **Auth Middleware**: Kiểm tra JWT token trong mỗi request

   ```javascript
   const auth = async (req, res, next) => {
     // 1. Lấy token từ header
     const token = req.headers.authorization.split(" ")[1];

     // 2. Verify token với JWT_SECRET
     const decoded = jwt.verify(token, process.env.JWT_SECRET);

     // 3. Kiểm tra user trong database
     const user = await User.findById(decoded.id);

     // 4. Kiểm tra user có bị block không
     if (user.isBlocked) {
       return res.status(403).json({ message: "Tài khoản bị khóa" });
     }

     // 5. Set req.user cho các controller sử dụng
     req.user = {
       userId: decoded.id,
       isAdmin: user.isAdmin,
     };

     next();
   };
   ```

2. **Admin Middleware**: Kiểm tra quyền admin
   ```javascript
   const requireAdmin = (req, res, next) => {
     if (!req.user.isAdmin) {
       return res.status(403).json({
         message: "Chỉ admin mới có quyền thực hiện",
       });
     }
     next();
   };
   ```

**So sánh với Clerk:**

Clerk là dịch vụ bên thứ ba cung cấp authentication với nhiều tính năng như đăng nhập Google/Facebook, magic links, v.v. Tuy nhiên, SmartBuy không sử dụng Clerk mà tự xây dựng hệ thống authentication với JWT vì:

- **Kiểm soát hoàn toàn**: Không phụ thuộc vào dịch vụ bên thứ ba
- **Tùy chỉnh linh hoạt**: Có thể thay đổi logic authentication theo nhu cầu
- **Chi phí thấp**: Không phải trả phí monthly subscription
- **Phù hợp quy mô**: Đủ đáp ứng cho hệ thống thương mại điện tử vừa và nhỏ

#### 2.5.8. Các công nghệ khác

- **Axios**: HTTP client cho JavaScript (frontend và backend communication).
- **Mongoose**: ODM (Object Data Modeling) library cho MongoDB.
- **Multer**: Middleware xử lý file upload.
- **Nodemailer**: Gửi email.
- **bcryptjs**: Mã hóa password.
- **CORS**: Cross-Origin Resource Sharing middleware.
- **dotenv**: Quản lý environment variables.
- **Tailwind CSS**: Utility-first CSS framework.

### 2.6. Tổng kết chương

Chương 2 đã trình bày các kiến thức nền tảng cần thiết để xây dựng hệ thống SmartBuy:

- **Thương mại điện tử**: Khái niệm, đặc điểm và mô hình B2C.
- **Kiến trúc Microservices**: Ưu điểm, nhược điểm và so sánh với Monolithic. API Gateway pattern.
- **RESTful API**: Nguyên tắc REST, HTTP methods, status codes và best practices.
- **Chatbox và NLP**: Google Dialogflow, quy trình xử lý ngôn ngữ tự nhiên.
- **Công nghệ sử dụng**: Node.js, Express.js, MongoDB, Vue.js 3, TypeScript, Docker, JWT và các công nghệ hỗ trợ khác.

Những kiến thức này là nền tảng quan trọng để hiểu rõ các quyết định thiết kế và triển khai hệ thống trong các chương tiếp theo.

---

## CHƯƠNG 3: PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG

---

## CHƯƠNG 3: PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG

### 3.1. Phân tích yêu cầu hệ thống

#### 3.1.1. Yêu cầu chức năng

Hệ thống **SmartBuy** cần đáp ứng các yêu cầu chức năng sau:

**A. Quản lý người dùng**

| ID    | Yêu cầu           | Mô tả                                                       |
| ----- | ----------------- | ----------------------------------------------------------- |
| RF-01 | Đăng ký tài khoản | Người dùng có thể đăng ký tài khoản mới với email, mật khẩu |
| RF-02 | Đăng nhập         | Đăng nhập bằng email/password, hỗ trợ Remember Me           |
| RF-03 | Quên mật khẩu     | Khôi phục mật khẩu qua email                                |
| RF-04 | Quản lý hồ sơ     | Cập nhật thông tin cá nhân, avatar, địa chỉ                 |
| RF-05 | Phân quyền        | Phân biệt Admin và Customer                                 |

**B. Quản lý sản phẩm**

| ID    | Yêu cầu                  | Mô tả                                            |
| ----- | ------------------------ | ------------------------------------------------ |
| RF-06 | Xem danh sách sản phẩm   | Hiển thị sản phẩm với phân trang                 |
| RF-07 | Tìm kiếm sản phẩm        | Tìm kiếm theo tên, từ khóa                       |
| RF-08 | Lọc sản phẩm             | Lọc theo danh mục, thương hiệu, khoảng giá       |
| RF-09 | Sắp xếp                  | Sắp xếp theo giá, tên, độ phổ biến               |
| RF-10 | Xem chi tiết             | Xem thông tin chi tiết, hình ảnh, specifications |
| RF-11 | CRUD sản phẩm (Admin)    | Thêm, sửa, xóa sản phẩm                          |
| RF-12 | Quản lý danh mục (Admin) | Quản lý categories và brands                     |
| RF-13 | Quản lý tồn kho (Admin)  | Theo dõi số lượng tồn kho                        |
| RF-14 | Upload hình ảnh          | Upload và quản lý hình ảnh sản phẩm              |

**C. Quản lý giỏ hàng**

| ID    | Yêu cầu           | Mô tả                                 |
| ----- | ----------------- | ------------------------------------- |
| RF-15 | Thêm vào giỏ      | Thêm sản phẩm vào giỏ hàng            |
| RF-16 | Cập nhật số lượng | Tăng/giảm số lượng sản phẩm trong giỏ |
| RF-17 | Xóa khỏi giỏ      | Xóa sản phẩm khỏi giỏ hàng            |
| RF-18 | Xem giỏ hàng      | Hiển thị danh sách sản phẩm trong giỏ |
| RF-19 | Tính tổng         | Tự động tính tổng tiền                |

**D. Quản lý đơn hàng**

| ID    | Yêu cầu             | Mô tả                                       |
| ----- | ------------------- | ------------------------------------------- |
| RF-20 | Tạo đơn hàng        | Tạo đơn hàng từ giỏ hàng                    |
| RF-21 | Nhập địa chỉ        | Nhập hoặc chọn địa chỉ giao hàng            |
| RF-22 | Chọn thanh toán     | Chọn COD hoặc VNPay                         |
| RF-23 | Xác nhận đơn        | Xác nhận và đặt hàng                        |
| RF-24 | Theo dõi đơn        | Xem trạng thái đơn hàng                     |
| RF-25 | Lịch sử đơn hàng    | Xem danh sách đơn hàng đã đặt               |
| RF-26 | Hủy đơn hàng        | Hủy đơn hàng (khi còn ở trạng thái pending) |
| RF-27 | Quản lý đơn (Admin) | Xem, cập nhật trạng thái đơn hàng           |
| RF-28 | Email thông báo     | Gửi email khi tạo/cập nhật đơn hàng         |

**E. Thanh toán**

| ID    | Yêu cầu             | Mô tả                          |
| ----- | ------------------- | ------------------------------ |
| RF-29 | Thanh toán COD      | Thanh toán khi nhận hàng       |
| RF-30 | Thanh toán VNPay    | Tích hợp cổng thanh toán VNPay |
| RF-31 | Xác nhận thanh toán | Xác nhận trạng thái thanh toán |
| RF-32 | Lưu lịch sử         | Lưu lịch sử giao dịch          |

**F. Đánh giá sản phẩm**

| ID    | Yêu cầu       | Mô tả                                 |
| ----- | ------------- | ------------------------------------- |
| RF-33 | Viết đánh giá | Viết đánh giá, rating sản phẩm đã mua |
| RF-34 | Xem đánh giá  | Xem đánh giá của người khác           |
| RF-35 | Lọc đánh giá  | Lọc theo số sao                       |

**G. Chatbox tư vấn**

| ID    | Yêu cầu           | Mô tả                               |
| ----- | ----------------- | ----------------------------------- |
| RF-36 | Tư vấn sản phẩm   | Chatbox tư vấn sản phẩm phù hợp     |
| RF-37 | Tra cứu đơn hàng  | Kiểm tra trạng thái đơn qua chatbox |
| RF-38 | Tìm kiếm sản phẩm | Tìm sản phẩm theo yêu cầu           |
| RF-39 | So sánh giá       | So sánh giá các sản phẩm            |
| RF-40 | Hủy đơn qua chat  | Hủy đơn hàng qua chatbox            |

#### 3.1.2. Yêu cầu phi chức năng

**A. Hiệu năng (Performance)**

- Thời gian response của API < 500ms cho 95% requests.
- Trang web load trong vòng 2 giây.
- Hỗ trợ đồng thời ít nhất 1000 người dùng.

**B. Khả năng mở rộng (Scalability)**

- Kiến trúc microservices cho phép scale từng service độc lập.
- Sử dụng Docker để dễ dàng triển khai thêm instances.

**C. Bảo mật (Security)**

- Mã hóa mật khẩu bằng bcrypt.
- Sử dụng JWT cho authentication.
- HTTPS cho production.
- Validation input để tránh SQL injection, XSS.
- Rate limiting để chống DDoS.

**D. Khả dụng (Availability)**

- Uptime >= 99%.
- Failure isolation: lỗi một service không ảnh hưởng toàn bộ.

**E. Khả năng bảo trì (Maintainability)**

- Code structure rõ ràng, tuân thủ best practices.
- Documentation đầy đủ.
- Logging và monitoring.

**F. Tương thích (Compatibility)**

- Responsive design, hoạt động tốt trên mobile, tablet, desktop.
- Hỗ trợ các trình duyệt phổ biến: Chrome, Firefox, Safari, Edge.

#### 3.1.3. Phân tích actors

**1. Khách hàng (Customer)**

- Người dùng đã đăng ký hoặc chưa đăng ký.
- Mua sắm sản phẩm, quản lý đơn hàng cá nhân.

**2. Quản trị viên (Admin)**

- Quản lý toàn bộ hệ thống.
- Quản lý sản phẩm, đơn hàng, người dùng.

**3. Hệ thống thanh toán (VNPay)**

- External system xử lý thanh toán.

**4. Chatbox**

- AI assistant tự động hỗ trợ khách hàng.

#### 3.1.4. Use Case Diagram

**Use Case tổng quát:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    HỆ THỐNG SMARTBUY - USE CASE TỔNG QUAN                   │
└─────────────────────────────────────────────────────────────────────────────┘

     ┌──────────────┐                                        ┌──────────────┐
     │              │                                        │              │
     │  Khách Hàng  │                                        │  Quản Trị    │
     │              │                                        │   Viên       │
     └──────┬───────┘                                        └──────┬───────┘
            │                                                       │
            │                                                       │
    ┌───────┴────────────────────────────────────────────────────┬─┴────────┐
    │                                                            │          │
    ├── UC1: Đăng Ký Tài Khoản                                 │          │
    │                                                            │          │
    ├── UC2: Đăng Nhập Hệ Thống                                ├──────────┤
    │                                                            │          │
    ├── UC3: Quên Mật Khẩu / Đặt Lại Mật Khẩu                  │          │
    │                                                            │          │
    ├── UC4: Cập Nhật Thông Tin Cá Nhân                        │          │
    │                                                            │          │
    ├── UC5: Tìm Kiếm & Lọc Sản Phẩm                           │          │
    │                                                            │          │
    ├── UC6: Xem Chi Tiết Sản Phẩm                             │          │
    │                                                            │          │
    ├── UC7: Thêm Sản Phẩm Vào Giỏ Hàng                        │          │
    │                                                            │          │
    ├── UC8: Quản Lý Giỏ Hàng (Xem/Sửa/Xóa)                    │          │
    │                                                            │          │
    ├── UC9: Đặt Hàng                                          │          │
    │                                                            │          │
    ├── UC10: Thanh Toán (VNPay/COD)                           │          │
    │                                                            │          │
    ├── UC11: Theo Dõi Đơn Hàng                                │          │
    │                                                            │          │
    ├── UC12: Hủy Đơn Hàng                                     │          │
    │                                                            │          │
    ├── UC13: Viết Đánh Giá Sản Phẩm                           │          │
    │                                                            │          │
    ├── UC14: Tương Tác Chatbox AI                             │          │
    │                                                            │          │
    │                                                            ├── UC15: Quản Lý Sản Phẩm
    │                                                            │
    │                                                            ├── UC16: Quản Lý Đơn Hàng
    │                                                            │
    │                                                            ├── UC17: Quản Lý Người Dùng
    │                                                            │
    │                                                            ├── UC18: Xem Thống Kê & Báo Cáo
    │                                                            │
    └────────────────────────────────────────────────────────────┴──────────┘
```

**Mô tả các Use Case chính:**

**A. Use Cases Khách Hàng:**

- **UC1 - Đăng Ký Tài Khoản**: Người dùng tạo tài khoản mới với email/password
- **UC2 - Đăng Nhập**: Xác thực người dùng qua JWT token
- **UC3 - Quên Mật Khẩu**: Gửi email reset password với verification token
- **UC4 - Cập Nhật Thông Tin**: Sửa profile, avatar, địa chỉ giao hàng
- **UC5 - Tìm Kiếm Sản Phẩm**: Tìm kiếm theo tên, lọc theo brand/category/giá
- **UC6 - Xem Chi Tiết Sản Phẩm**: Xem thông tin, hình ảnh, variants, đánh giá
- **UC7 - Thêm Giỏ Hàng**: Chọn variant (màu/bộ nhớ), số lượng và thêm vào cart
- **UC8 - Quản Lý Giỏ Hàng**: Xem, cập nhật số lượng, xóa sản phẩm khỏi cart
- **UC9 - Đặt Hàng**: Tạo đơn hàng từ giỏ hàng, nhập địa chỉ giao hàng
- **UC10 - Thanh Toán**: Thanh toán qua VNPay hoặc COD (ship COD)
- **UC11 - Theo Dõi Đơn Hàng**: Xem trạng thái đơn hàng (11 trạng thái)
- **UC12 - Hủy Đơn Hàng**: Hủy đơn hàng ở trạng thái cho phép
- **UC13 - Viết Đánh Giá**: Đánh giá sản phẩm đã mua (rating 1-5, comment, hình ảnh)
- **UC14 - Chatbox AI**: Tương tác với Dialogflow bot để tư vấn sản phẩm

**B. Use Cases Quản Trị Viên:**

- **UC15 - Quản Lý Sản Phẩm**: CRUD sản phẩm, quản lý variants, tồn kho, hình ảnh
- **UC16 - Quản Lý Đơn Hàng**: Cập nhật trạng thái đơn hàng, xử lý hoàn/hủy
- **UC17 - Quản Lý Người Dùng**: Xem danh sách user, block/unblock, phân quyền
- **UC18 - Thống Kê**: Xem báo cáo doanh thu, sản phẩm bán chạy, đánh giá

### 3.1.5. Mô Tả Chi Tiết Use Case Quan Trọng

#### UC2: Đăng Nhập Hệ Thống

**Tên Use Case**: Đăng nhập hệ thống  
**Tác nhân**: Khách hàng, Quản trị viên  
**Mục tiêu**: Xác thực người dùng và cấp quyền truy cập hệ thống  
**Điều kiện tiên quyết**: Người dùng đã có tài khoản đăng ký

**Luồng chính:**

1. Người dùng truy cập trang đăng nhập
2. Người dùng nhập email và mật khẩu
3. Hệ thống kiểm tra thông tin đăng nhập
   - Tìm user theo email trong database
   - So sánh mật khẩu đã hash với bcrypt
4. Nếu thông tin hợp lệ:
   - Tạo Access Token (JWT, thời hạn 15 phút)
   - Tạo Refresh Token (JWT, thời hạn 7 ngày)
   - Lưu Refresh Token vào database (trường `tokens.refreshToken`)
   - Trả về tokens và thông tin user (email, isAdmin, avatarUrl)
5. Client lưu Access Token vào localStorage
6. Client lưu Refresh Token vào httpOnly cookie
7. Chuyển hướng về trang chủ hoặc trang yêu cầu trước đó

**Luồng thay thế:**

- **3a. Email không tồn tại:**

  - Hiển thị thông báo "Email hoặc mật khẩu không đúng"
  - Quay lại bước 2

- **3b. Mật khẩu sai:**

  - Hiển thị thông báo "Email hoặc mật khẩu không đúng"
  - Quay lại bước 2

- **3c. Tài khoản chưa verify email:**
  - Hiển thị thông báo "Vui lòng verify email trước khi đăng nhập"
  - Cung cấp link gửi lại email verification

**Kết quả:**

- User đăng nhập thành công với Access Token và Refresh Token
- Hệ thống nhận diện quyền của user (isAdmin: true/false)

**Công nghệ sử dụng:**

- `bcrypt` để hash/compare password
- `jsonwebtoken` để tạo JWT tokens
- MongoDB lưu trữ user và refresh tokens
- Express.js middleware xác thực token cho các request tiếp theo

---

#### UC9: Đặt Hàng

**Tên Use Case**: Đặt hàng  
**Tác nhân**: Khách hàng đã đăng nhập  
**Mục tiêu**: Tạo đơn hàng từ giỏ hàng và xác nhận thông tin giao hàng  
**Điều kiện tiên quyết**:

- Người dùng đã đăng nhập
- Giỏ hàng có ít nhất 1 sản phẩm

**Luồng chính:**

1. Người dùng vào giỏ hàng, click "Tiến hành đặt hàng"
2. Hệ thống lấy thông tin giỏ hàng từ Cart Service
   - GET `/api/cart/:userId`
   - Kiểm tra tồn kho cho từng sản phẩm
   - Tính tổng giá trị (itemsPrice)
3. Người dùng nhập/chọn thông tin giao hàng:
   - Họ tên người nhận
   - Số điện thoại
   - Địa chỉ cụ thể (số nhà, đường)
   - Phường/Xã
   - Quận/Huyện
   - Tỉnh/Thành phố
   - Ghi chú (optional)
4. Người dùng chọn phương thức thanh toán:
   - COD (Thanh toán khi nhận hàng)
   - VNPay (Thanh toán online)
5. Hệ thống tính toán chi tiết:
   ```
   itemsPrice = Σ(item.price × item.quantity)
   shippingPrice = 30000 VNĐ (cố định)
   taxPrice = itemsPrice × 0.1 (10%)
   totalPrice = itemsPrice + shippingPrice + taxPrice - discountAmount
   ```
6. Người dùng xác nhận đặt hàng
7. Hệ thống tạo đơn hàng:
   - POST `/api/orders/create`
   - Tạo Order document trong MongoDB với:
     - `userId`: ID người đặt
     - `orderItems`: Danh sách sản phẩm (snapshot từ cart)
     - `shippingAddress`: Thông tin giao hàng
     - `paymentMethod`: "COD" hoặc "VNPAY"
     - `itemsPrice`, `shippingPrice`, `taxPrice`, `totalPrice`
     - `status`: "pending_payment" (nếu VNPay) hoặc "pending" (nếu COD)
8. Nếu chọn VNPay:
   - Chuyển sang UC10 (Thanh toán VNPay)
9. Nếu chọn COD:
   - Đặt status = "pending"
   - Gửi email xác nhận đơn hàng
   - Xóa giỏ hàng
10. Hiển thị trang xác nhận đơn hàng thành công
11. Chuyển hướng đến trang theo dõi đơn hàng

**Luồng thay thế:**

- **2a. Giỏ hàng trống:**

  - Hiển thị thông báo "Giỏ hàng trống"
  - Chuyển về trang sản phẩm

- **2b. Sản phẩm hết hàng:**

  - Hiển thị thông báo "Sản phẩm [tên SP] đã hết hàng"
  - Tự động xóa sản phẩm khỏi giỏ hàng
  - Yêu cầu người dùng kiểm tra lại giỏ hàng

- **3a. Thông tin giao hàng không hợp lệ:**

  - Highlight các trường bị lỗi (validation)
  - Yêu cầu nhập lại

- **7a. Lỗi tạo đơn hàng (database error):**
  - Hiển thị thông báo "Không thể tạo đơn hàng, vui lòng thử lại"
  - Rollback các thay đổi

**Kết quả:**

- Đơn hàng được tạo thành công với mã đơn hàng (orderId)
- Giỏ hàng được xóa
- Email xác nhận được gửi
- Trạng thái đơn hàng: "pending" (COD) hoặc "pending_payment" (VNPay)

**Dữ liệu Order được lưu:**

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  orderItems: [
    {
      productId: ObjectId,
      name: "iPhone 15 Pro Max",
      slug: "iphone-15-pro-max",
      variant: {
        color: "Titan Tự Nhiên",
        memory: "256GB",
        sku: "IP15PM-256-TN"
      },
      quantity: 1,
      price: 29990000,
      thumbUrl: "https://...",
      subtotal: 29990000
    }
  ],
  shippingAddress: {
    fullName: "Nguyễn Văn A",
    phone: "0901234567",
    address: "123 Đường ABC",
    ward: "Phường 1",
    district: "Quận 1",
    province: "TP.HCM",
    note: "Gọi trước khi giao"
  },
  paymentMethod: "COD",
  itemsPrice: 29990000,
  shippingPrice: 30000,
  taxPrice: 2999000,
  discountAmount: 0,
  totalPrice: 33019000,
  status: "pending",
  statusHistory: [
    {
      status: "pending",
      timestamp: ISODate,
      note: "Đơn hàng đã được tạo"
    }
  ],
  createdAt: ISODate,
  updatedAt: ISODate
}
```

**Công nghệ sử dụng:**

- Order Service (Node.js + Express + MongoDB)
- Cart Service để lấy thông tin giỏ hàng
- Payment Service để xử lý thanh toán VNPay
- Order Manager Service để gửi email xác nhận
- JWT middleware để xác thực user

---

#### UC10: Thanh Toán VNPay

**Tên Use Case**: Thanh toán online qua VNPay  
**Tác nhân**: Khách hàng đã đăng nhập  
**Mục tiêu**: Xử lý thanh toán online an toàn qua cổng VNPay  
**Điều kiện tiên quyết**:

- Đơn hàng đã được tạo với status "pending_payment"
- Người dùng có thẻ ATM/Visa/MasterCard

**Luồng chính:**

1. Sau khi tạo đơn hàng (UC9), hệ thống tạo payment record:

   - POST `/api/payments/create`
   - Tạo Payment document:
     ```javascript
     {
       orderId: ObjectId,
       userId: ObjectId,
       amount: 33019000,
       paymentMethod: "VNPAY",
       status: "pending",
       createdAt: ISODate
     }
     ```

2. Hệ thống tạo VNPay payment URL:

   - Lấy thông tin từ config (TMN_CODE, HASH_SECRET, VNP_URL)
   - Tạo các tham số:
     ```
     vnp_TmnCode: Mã website
     vnp_Amount: 3301900000 (amount * 100)
     vnp_OrderInfo: "Thanh toan don hang #[orderId]"
     vnp_ReturnUrl: http://localhost/payment/vnpay-return
     vnp_TxnRef: [paymentId]
     vnp_CreateDate: yyyyMMddHHmmss
     vnp_IpAddr: IP của user
     ```
   - Tạo chữ ký hash HMAC SHA512
   - Ghép thành payment URL

3. Chuyển hướng user đến VNPay payment gateway

   - User nhập thông tin thẻ/chọn ngân hàng
   - VNPay xử lý thanh toán

4. VNPay callback về `vnp_ReturnUrl` với các tham số:

   - `vnp_ResponseCode`: "00" (thành công) hoặc khác (thất bại)
   - `vnp_TransactionNo`: Mã giao dịch VNPay
   - `vnp_BankCode`: Mã ngân hàng
   - `vnp_CardType`: Loại thẻ (ATM/VISA/...)
   - `vnp_SecureHash`: Chữ ký để verify

5. Hệ thống verify callback:

   - Kiểm tra `vnp_SecureHash` có hợp lệ
   - Kiểm tra `vnp_TxnRef` (paymentId) có tồn tại
   - Kiểm tra payment chưa được xử lý (status = "pending")

6. Nếu `vnp_ResponseCode = "00"`:

   - Cập nhật Payment:
     ```javascript
     {
       status: "paid",
       paidAt: ISODate,
       transactionId: vnp_TransactionNo,
       bankCode: vnp_BankCode,
       cardType: vnp_CardType
     }
     ```
   - Cập nhật Order:
     ```javascript
     {
       status: "pending",
       isPaid: true,
       paidAt: ISODate,
       paymentResult: {
         transactionId: vnp_TransactionNo,
         status: "paid"
       }
     }
     ```
   - Xóa giỏ hàng
   - Gửi email xác nhận thanh toán thành công

7. Nếu `vnp_ResponseCode != "00"`:

   - Cập nhật Payment: `status = "failed"`
   - Cập nhật Order: `status = "cancelled"`
   - Hiển thị thông báo lỗi tương ứng

8. Chuyển hướng user đến trang kết quả thanh toán

**Luồng thay thế:**

- **5a. SecureHash không hợp lệ:**

  - Log cảnh báo bảo mật
  - Trả về lỗi 400 Bad Request

- **5b. Payment không tồn tại:**

  - Hiển thị thông báo "Giao dịch không tồn tại"
  - Chuyển về trang chủ

- **5c. Payment đã được xử lý:**

  - Hiển thị thông báo "Giao dịch đã được xử lý trước đó"
  - Chuyển đến trang chi tiết đơn hàng

- **7a. User hủy thanh toán trên VNPay:**
  - `vnp_ResponseCode = "24"`
  - Payment status = "cancelled"
  - Order status giữ nguyên "pending_payment"
  - Cho phép user thử thanh toán lại

**Kết quả thành công:**

- Payment status: "paid"
- Order status: "pending" (chờ xác nhận)
- Order.isPaid: true
- Giỏ hàng đã xóa
- Email xác nhận đã gửi

**Mã lỗi VNPay thường gặp:**

| Mã  | Ý nghĩa                                      |
| --- | -------------------------------------------- |
| 00  | Giao dịch thành công                         |
| 07  | Trừ tiền thành công nhưng giao dịch nghi ngờ |
| 09  | Thẻ chưa đăng ký Internet Banking            |
| 10  | Xác thực thông tin thẻ thất bại              |
| 11  | Hết hạn chờ thanh toán (15 phút)             |
| 12  | Thẻ bị khóa                                  |
| 13  | Sai OTP                                      |
| 24  | Khách hàng hủy giao dịch                     |
| 51  | Tài khoản không đủ số dư                     |
| 65  | Vượt quá số lần nhập OTP                     |

**Công nghệ sử dụng:**

- Payment Service (Node.js + Express)
- VNPay API với HMAC SHA512 signature
- MongoDB để lưu payment records
- Crypto module để tạo hash
- Query-string để parse callback params

### 3.2. Thiết kế kiến trúc tổng thể

#### 3.2.1. Kiến trúc Microservices của SmartBuy

Hệ thống SmartBuy được thiết kế theo kiến trúc microservices với **11 services độc lập**:

**Bảng 3.2: Danh sách Microservices trong hệ thống SmartBuy**

| STT | Service             | Port | Database            | Chức năng chính                        |
| --- | ------------------- | ---- | ------------------- | -------------------------------------- |
| 1   | **API Gateway**     | 3000 | -                   | Routing, Authentication, Rate limiting |
| 2   | **User Service**    | 3005 | smartbuy_db         | Đăng ký, đăng nhập (Legacy)            |
| 3   | **User Manager**    | 3006 | smartbuy_db         | Quản lý người dùng, địa chỉ            |
| 4   | **Product Service** | 3001 | smartbuy_db_product | CRUD sản phẩm (Legacy)                 |
| 5   | **Product Manager** | 5002 | smartbuy_db_product | Quản lý sản phẩm, tồn kho              |
| 6   | **Cart Service**    | 3003 | smartbuy_db_cart    | Quản lý giỏ hàng                       |
| 7   | **Order Service**   | 3002 | smartbuy_db_order   | Tạo và quản lý đơn hàng (Legacy)       |
| 8   | **Order Manager**   | 5003 | smartbuy_db_order   | Quản lý đơn hàng, workflow             |
| 9   | **Payment Service** | 3004 | smartbuy_db_payment | Xử lý thanh toán VNPay                 |
| 10  | **Review Service**  | 5006 | smartbuy_db_review  | Đánh giá sản phẩm                      |
| 11  | **Chatbox Service** | 5008 | -                   | Dialogflow webhook, tư vấn AI          |

**Frontend Client:**

| Component      | Port | Technology                    |
| -------------- | ---- | ----------------------------- |
| **Web Client** | 80   | Vue.js 3, TypeScript, Vuetify |

#### 3.2.2. Sơ đồ kiến trúc tổng thể

```
┌───────────────────────────────────────────────────────────────┐
│                         INTERNET                              │
└──────────────────────────┬────────────────────────────────────┘
                           │
                  ┌────────▼────────┐
                  │  Load Balancer  │
                  │   (Optional)    │
                  └────────┬────────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
    ┌────▼─────┐     ┌────▼──────┐    ┌────▼──────┐
    │  Client  │     │   API     │    │ Dialogflow│
    │ (Vue.js) │────▶│  Gateway  │◀───│   Agent   │
    │  Port 80 │     │  Port 3000│    │  (Cloud)  │
    └──────────┘     └────┬──────┘    └───────────┘
                           │
         ┌─────────────────┼─────────────────────────────┐
         │                 │                             │
    ┌────▼─────┐     ┌────▼──────┐             ┌────────▼────────┐
    │   User   │     │  Product  │             │    Chatbox      │
    │ Services │     │  Services │             │    Service      │
    ├──────────┤     ├───────────┤             │   Port 5008     │
    │User:3005 │     │Prod:3001  │             └────────┬────────┘
    │UMgr:3006 │     │PMgr:5002  │                      │
    └────┬─────┘     └────┬──────┘             ┌────────▼────────┐
         │                │                    │  Product/Order  │
    ┌────▼─────┐     ┌────▼──────┐            │     Service     │
    │   Cart   │     │   Order   │            │   (Webhook)     │
    │ Service  │     │  Services │            └─────────────────┘
    │Port:3003 │     ├───────────┤
    └────┬─────┘     │Ord:3002   │
         │           │OMgr:5003  │
    ┌────▼─────┐     └────┬──────┘
    │ Payment  │          │
    │ Service  │     ┌────▼──────┐
    │Port:3004 │     │  Review   │
    └────┬─────┘     │  Service  │
         │           │ Port:5006 │
         │           └────┬──────┘
         │                │
    ┌────▼────────────────▼──────────────────────┐
    │            MongoDB Cluster                  │
    ├─────────────────────────────────────────────┤
    │ • smartbuy_db           (User)             │
    │ • smartbuy_db_product   (Product/Review)   │
    │ • smartbuy_db_cart      (Cart)             │
    │ • smartbuy_db_order     (Order)            │
    │ • smartbuy_db_payment   (Payment)          │
    └─────────────────────────────────────────────┘
```

#### 3.2.3. Luồng dữ liệu chính

**A. Luồng tìm kiếm sản phẩm:**

```
User → Client → API Gateway → Product Manager Service → MongoDB (Product DB)
                    → Response → Client → Display
```

**B. Luồng tạo đơn hàng:**

```
User → Client → API Gateway → Order Service
                                    ↓
                            Cart Service (Get cart items)
                                    ↓
                            Product Service (Verify stock)
                                    ↓
                            Payment Service (Process payment)
                                    ↓
                            Order Manager (Send email)
                                    ↓
                            MongoDB (Save order) → Response
```

**C. Luồng Chatbox tư vấn:**

```
User message → Client Chatbox UI → Dialogflow
                                        ↓
                                  Intent matching
                                        ↓
                                  Webhook call
                                        ↓
                            Chatbox Service → Product/Order Service
                                        ↓
                            Process & Generate response
                                        ↓
                            Return to Dialogflow → Client
```

#### 3.2.4. Communication Pattern

Hệ thống SmartBuy sử dụng **Synchronous REST API** để giao tiếp giữa các services:

1. **Client ↔ API Gateway**: HTTPS/REST
2. **API Gateway ↔ Services**: HTTP/REST (internal network)
3. **Service ↔ Service**: HTTP/REST (direct calls)
4. **Dialogflow ↔ Chatbox Service**: HTTPS Webhook
5. **Services ↔ MongoDB**: MongoDB Driver (Mongoose)

**Ưu điểm:**

- Đơn giản, dễ implement.
- Dễ debug và monitor.
- Phù hợp với quy mô hiện tại.

**Hạn chế:**

- Tight coupling giữa một số services.
- Có thể gặp cascading failure.

**Giải pháp cải thiện (future work):**

- Sử dụng Message Queue (RabbitMQ, Kafka) cho async communication.
- Implement Circuit Breaker pattern.

### 3.3. Thiết Kế Class Diagram Toàn Hệ Thống

#### 3.3.1. Class Diagram Tổng Quan

Dưới đây là Class Diagram chi tiết cho 6 services chính mà sinh viên đã triển khai:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SMARTBUY CLASS DIAGRAM                               │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────┐
│           User                      │
├─────────────────────────────────────┤
│ - _id: ObjectId                     │
│ - email: String {unique, required}  │
│ - password: String {required}       │
│ - firstName: String                 │
│ - lastName: String                  │
│ - avatarUrl: String                 │
│ - phoneNumber: String               │
│ - dateOfBirth: Date                 │
│ - isAdmin: Boolean {default: false} │
│ - isVerified: Boolean               │
│ - tokens: {                         │
│     refreshToken: String,           │
│     verificationToken: String,      │
│     passwordResetToken: String,     │
│     passwordResetExpires: Date      │
│   }                                 │
│ - createdAt: Date                   │
│ - updatedAt: Date                   │
├─────────────────────────────────────┤
│ + hashPassword(): Promise<void>     │
│ + comparePassword(pwd): Boolean     │
│ + generateAuthToken(): String       │
│ + generateRefreshToken(): String    │
│ + generateResetToken(): String      │
└─────────────────────────────────────┘
           │
           │ 1
           │
           │
           │ *
┌──────────▼──────────────────────────┐
│           Cart                      │
├─────────────────────────────────────┤
│ - _id: ObjectId                     │
│ - userId: ObjectId {ref: 'User'}    │
│ - items: CartItem[]                 │
│ - subtotal: Number                  │
│ - createdAt: Date                   │
│ - updatedAt: Date                   │
├─────────────────────────────────────┤
│ + calculateSubtotal(): Number       │
│ + addItem(product, variant): void   │
│ + updateQuantity(itemId, qty): void │
│ + removeItem(itemId): void          │
│ + clearCart(): void                 │
└─────────────────────────────────────┘
           │
           │ contains
           │
           │ 1..*
┌──────────▼──────────────────────────┐         ┌─────────────────────────────┐
│        CartItem                     │         │         Product             │
├─────────────────────────────────────┤         ├─────────────────────────────┤
│ - _id: ObjectId                     │   *     │ - _id: ObjectId             │
│ - productId: ObjectId ──────────────┼────────►│ - name: String {required}   │
│ - name: String                      │   ref   │ - slug: String {unique}     │
│ - thumbUrl: String                  │         │ - description: String       │
│ - variant: {                        │         │ - thumbUrl: String          │
│     color: String,                  │         │ - basePrice: Number         │
│     memory: String,                 │         │ - discountPercentage: Number│
│     sku: String                     │         │ - brandId: ObjectId         │
│   }                                 │         │ - categoryId: ObjectId      │
│ - quantity: Number {min: 1}         │         │ - variants: Variant[]       │
│ - price: Number                     │         │ - images: String[]          │
│ - subtotal: Number                  │         │ - isActive: Boolean         │
├─────────────────────────────────────┤         │ - createdAt: Date           │
│ + calculateSubtotal(): Number       │         │ - updatedAt: Date           │
└─────────────────────────────────────┘         ├─────────────────────────────┤
                                                │ + generateSlug(): String    │
                                                │ + getFinalPrice(): Number   │
                                                └─────────────────────────────┘
                                                           │
                                                           │ 1
                                                           │
                                                           │ *
                                                ┌──────────▼──────────────────┐
                                                │       Variant               │
                                                ├─────────────────────────────┤
                                                │ - color: String             │
                                                │ - memory: String            │
                                                │ - sku: String {unique}      │
                                                │ - price: Number             │
                                                │ - stock: Number             │
                                                │ - images: String[]          │
                                                └─────────────────────────────┘


┌─────────────────────────────────────┐
│           Order                     │
├─────────────────────────────────────┤
│ - _id: ObjectId                     │
│ - userId: ObjectId {ref: 'User'} ◄──┼─────────── User (1)
│ - orderItems: OrderItem[]           │
│ - shippingAddress: {                │
│     fullName: String,               │
│     phone: String,                  │
│     address: String,                │
│     ward: String,                   │
│     district: String,               │
│     province: String,               │
│     note: String                    │
│   }                                 │
│ - paymentMethod: String             │
│   {enum: ['COD', 'VNPAY', 'MOMO']}  │
│ - itemsPrice: Number                │
│ - shippingPrice: Number             │
│ - taxPrice: Number                  │
│ - discountAmount: Number            │
│ - totalPrice: Number                │
│ - status: String {enum}             │
│ - isPaid: Boolean                   │
│ - paidAt: Date                      │
│ - isDelivered: Boolean              │
│ - deliveredAt: Date                 │
│ - statusHistory: StatusHistoryItem[]│
│ - couponCode: String                │
│ - createdAt: Date                   │
│ - updatedAt: Date                   │
├─────────────────────────────────────┤
│ + calculateTotalPrice(): Number     │
│ + updateStatus(status, note): void  │
│ + canBeCancelled(): Boolean         │
│ + canBeReturned(): Boolean          │
└─────────────────────────────────────┘
           │
           │ contains
           │ 1..*
┌──────────▼──────────────────────────┐
│        OrderItem                    │
├─────────────────────────────────────┤
│ - productId: ObjectId               │
│ - name: String                      │
│ - slug: String                      │
│ - thumbUrl: String                  │
│ - variant: {                        │
│     color: String,                  │
│     memory: String,                 │
│     sku: String                     │
│   }                                 │
│ - quantity: Number                  │
│ - price: Number                     │
│ - subtotal: Number                  │
└─────────────────────────────────────┘


┌─────────────────────────────────────┐              ┌─────────────────────────┐
│          Payment                    │              │        Order            │
├─────────────────────────────────────┤        1     ├─────────────────────────┤
│ - _id: ObjectId                     │   ◄──────────┤ (from above)            │
│ - orderId: ObjectId {ref: 'Order'}  │              └─────────────────────────┘
│ - userId: ObjectId {ref: 'User'}    │
│ - amount: Number {required}         │
│ - currency: String {default: 'VND'} │
│ - paymentMethod: String {enum}      │
│ - status: String {enum: [           │
│     'pending', 'processing',        │
│     'paid', 'failed',               │
│     'cancelled', 'refunded'         │
│   ]}                                │
│ - transactionId: String             │
│ - externalTransactionId: String     │
│ - bankCode: String                  │
│ - cardType: String                  │
│ - paymentUrl: String                │
│ - paidAt: Date                      │
│ - failedReason: String              │
│ - refundedAt: Date                  │
│ - refundAmount: Number              │
│ - metadata: Object                  │
│ - createdAt: Date                   │
│ - updatedAt: Date                   │
├─────────────────────────────────────┤
│ + createVNPayUrl(): String          │
│ + verifyVNPayCallback(params): Bool │
│ + processPayment(): Promise         │
│ + refund(amount): Promise           │
└─────────────────────────────────────┘


┌─────────────────────────────────────┐
│          Review                     │
├─────────────────────────────────────┤
│ - _id: ObjectId                     │      *
│ - userId: String (ref: 'User')  ────┼──────────► User
│ - productId: String (ref: 'Product')┼──────────► Product
│ - rating: Number {min:1, max:5}     │      *
│ - comment: String {maxlength: 1000} │
│ - userName: String                  │
│ - productName: String               │
│ - images: String[]                  │
│ - helpfulCount: Number {default: 0} │
│ - helpfulBy: String[]               │
│ - isVisible: Boolean {default: true}│
│ - hiddenReason: String              │
│ - hiddenBy: String                  │
│ - hiddenAt: Date                    │
│ - createdAt: Date                   │
│ - updatedAt: Date                   │
├─────────────────────────────────────┤
│ + markHelpful(userId): void         │
│ + hide(adminId, reason): void       │
│ + show(): void                      │
└─────────────────────────────────────┘


┌─────────────────────────────────────┐
│     StatusHistoryItem               │
├─────────────────────────────────────┤
│ - status: String                    │
│ - timestamp: Date                   │
│ - note: String                      │
│ - updatedBy: String                 │
└─────────────────────────────────────┘
```

**Giải thích quan hệ giữa các Class:**

1. **User ─── Cart (1:\*)**: Một user có thể có nhiều cart (mặc dù thực tế chỉ 1 cart active)

   - Virtual populate trong User schema

2. **Cart ─── CartItem (1:\*)**: Một giỏ hàng chứa nhiều CartItem

   - Embedded documents trong Cart

3. **CartItem ─── Product (\*:1)**: Nhiều CartItem tham chiếu đến cùng một Product

   - Reference relationship qua `productId`

4. **Product ─── Variant (1:\*)**: Một sản phẩm có nhiều variants (màu sắc, bộ nhớ)

   - Embedded documents trong Product

5. **User ─── Order (1:\*)**: Một user có thể tạo nhiều đơn hàng

   - Reference relationship qua `userId`

6. **Order ─── OrderItem (1:\*)**: Một đơn hàng chứa nhiều OrderItem

   - Embedded documents (snapshot của sản phẩm tại thời điểm đặt hàng)

7. **Order ─── Payment (1:1)**: Một đơn hàng có một payment record

   - Reference relationship qua `orderId`

8. **User ─── Payment (1:\*)**: Một user có nhiều payment transactions

   - Reference relationship qua `userId`

9. **User ─── Review (\*:1)**: Một user có thể viết nhiều reviews

   - String reference (không dùng ObjectId populate)

10. **Product ─── Review (1:\*)**: Một sản phẩm có nhiều reviews

    - String reference để tránh cross-database join

11. **Order ─── StatusHistoryItem (1:\*)**: Một đơn hàng có lịch sử thay đổi trạng thái
    - Embedded array trong Order

#### 3.3.2. Design Patterns Sử Dụng

**1. Repository Pattern:**

- Mỗi model có controller và service layer riêng
- Service xử lý business logic, controller xử lý HTTP
- VD: `UserService`, `ProductService`, `OrderService`

**2. DTO Pattern (Data Transfer Object):**

- Không trả về toàn bộ model cho client
- VD: User không trả về `password`, `tokens.refreshToken`

**3. Observer Pattern:**

- Sau khi tạo đơn hàng → Gửi email notification
- Sau khi thanh toán → Cập nhật Order status
- Sử dụng events hoặc message queue

**4. Strategy Pattern:**

- Payment method: `CODPaymentStrategy`, `VNPayPaymentStrategy`
- Shipping calculation: có thể mở rộng nhiều strategy

**5. Snapshot Pattern:**

- OrderItem lưu snapshot của Product (không reference)
- Đảm bảo dữ liệu đơn hàng không bị ảnh hưởng khi sản phẩm thay đổi

**6. State Pattern:**

- Order status workflow với 11 trạng thái
- Mỗi transition có validation logic

### 3.4. Thiết Kế Sequence Diagrams

#### 3.4.1. Sequence Diagram - Đăng Nhập

```
┌──────┐        ┌────────┐      ┌─────────────┐     ┌──────────────┐
│Client│        │API GW  │      │User Service │     │  MongoDB     │
└──┬───┘        └───┬────┘      └──────┬──────┘     └──────┬───────┘
   │                │                  │                    │
   │ 1. POST /login │                  │                    │
   ├───────────────►│                  │                    │
   │ {email, pwd}   │                  │                    │
   │                │ 2. Forward       │                    │
   │                ├─────────────────►│                    │
   │                │                  │ 3. Find user       │
   │                │                  ├───────────────────►│
   │                │                  │   by email         │
   │                │                  │◄───────────────────┤
   │                │                  │ 4. User document   │
   │                │                  │                    │
   │                │                  │ 5. bcrypt.compare()│
   │                │                  ├────┐               │
   │                │                  │    │ password      │
   │                │                  │◄───┘               │
   │                │                  │                    │
   │                │                  │ 6. Generate tokens │
   │                │                  ├────┐               │
   │                │                  │    │ - accessToken │
   │                │                  │    │ - refreshToken│
   │                │                  │◄───┘               │
   │                │                  │                    │
   │                │                  │ 7. Save refresh    │
   │                │                  │    token to DB     │
   │                │                  ├───────────────────►│
   │                │                  │◄───────────────────┤
   │                │                  │                    │
   │                │ 8. Return tokens │                    │
   │                │    & user info   │                    │
   │                │◄─────────────────┤                    │
   │ 9. 200 OK      │                  │                    │
   │ {accessToken,  │                  │                    │
   │  refreshToken, │                  │                    │
   │  user}         │                  │                    │
   │◄───────────────┤                  │                    │
   │                │                  │                    │
   │ 10. Store      │                  │                    │
   │     tokens     │                  │                    │
   ├────┐           │                  │                    │
   │    │localStorage│                 │                    │
   │◄───┘           │                  │                    │
   │                │                  │                    │
```

**Giải thích:**

1. Client gửi POST request với email và password
2. API Gateway forward request đến User Service
   3-4. User Service tìm user trong MongoDB bằng email
3. So sánh password đã hash bằng bcrypt
4. Tạo JWT tokens (access token 15 phút, refresh token 7 ngày)
5. Lưu refresh token vào database để có thể revoke
   8-9. Trả về tokens và thông tin user
6. Client lưu tokens vào localStorage/cookie

---

#### 3.4.2. Sequence Diagram - Đặt Hàng & Thanh Toán VNPay

```
┌───────┐  ┌───────┐  ┌────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  ┌───────┐
│Client │  │API GW │  │Cart Svc│  │Order Svc │  │Payment   │  │VNPay   │  │Email  │
│       │  │       │  │        │  │          │  │Service   │  │Gateway │  │Service│
└───┬───┘  └───┬───┘  └───┬────┘  └────┬─────┘  └────┬─────┘  └───┬────┘  └───┬───┘
    │          │          │            │             │            │          │
    │ 1. GET   │          │            │             │            │          │
    │  /cart   │          │            │             │            │          │
    ├─────────►│          │            │             │            │          │
    │          ├─────────►│            │             │            │          │
    │          │          │ 2. Get cart│             │            │          │
    │          │          │   items    │             │            │          │
    │          │◄─────────┤            │             │            │          │
    │◄─────────┤          │            │             │            │          │
    │ 3. Cart  │          │            │             │            │          │
    │    data  │          │            │             │            │          │
    │          │          │            │             │            │          │
    │ 4. POST  │          │            │             │            │          │
    │  /orders │          │            │             │            │          │
    ├─────────►│          │            │             │            │          │
    │ {shipping│          │            │             │            │          │
    │  address,│          │            │             │            │          │
    │  payment │          │            │             │            │          │
    │  method} │          │            │             │            │          │
    │          │          │            │ 5. Create   │            │          │
    │          ├────────────────────────┤   order     │            │          │
    │          │          │            ├────┐        │            │          │
    │          │          │            │    │Calculate│            │          │
    │          │          │            │    │prices  │            │          │
    │          │          │            │◄───┘        │            │          │
    │          │          │            │             │            │          │
    │          │          │            │ 6. Save order│           │          │
    │          │          │            ├────────┐    │            │          │
    │          │          │            │        │    │            │          │
    │          │          │            │◄───────┘    │            │          │
    │          │          │            │             │            │          │
    │          │          │            │ 7. Create   │            │          │
    │          │          │            │    payment  │            │          │
    │          │          │            │    record   │            │          │
    │          │          │            ├────────────►│            │          │
    │          │          │            │             ├────┐       │          │
    │          │          │            │             │    │Save   │          │
    │          │          │            │             │◄───┘payment│          │
    │          │          │            │             │            │          │
    │          │          │            │             │ 8. Create  │          │
    │          │          │            │             │   VNPay URL│          │
    │          │          │            │             ├───────────►│          │
    │          │          │            │             │            │          │
    │          │          │            │             │ 9. Payment │          │
    │          │          │            │             │    URL     │          │
    │          │          │            │             │◄───────────┤          │
    │          │◄───────────────────────┴─────────────┤            │          │
    │◄─────────┤          │            │             │            │          │
    │ 10. Order│          │            │             │            │          │
    │  created │          │            │             │            │          │
    │  with    │          │            │             │            │          │
    │  payment │          │            │             │            │          │
    │  URL     │          │            │             │            │          │
    │          │          │            │             │            │          │
    │ 11. Redirect        │            │             │            │          │
    │    to VNPay         │            │             │            │          │
    ├────────────────────────────────────────────────────────────►│          │
    │          │          │            │             │            │          │
    │ 12. Enter│          │            │             │            │          │
    │     card │          │            │             │            │          │
    │     info │          │            │             │            │          │
    ├─────────►│          │            │             │            │          │
    │          │          │            │             │            │          │
    │          │          │            │             │ 13. Callback          │
    │          │          │            │             │            │          │
    │          │          │            │             │◄───────────┤          │
    │          │          │            │             │ vnp_ResponseCode      │
    │          │          │            │             │ vnp_TransactionNo     │
    │          │          │            │             │            │          │
    │          │          │            │             │ 14. Verify │          │
    │          │          │            │             │     hash   │          │
    │          │          │            │             ├────┐       │          │
    │          │          │            │             │◄───┘       │          │
    │          │          │            │             │            │          │
    │          │          │            │ 15. Update  │            │          │
    │          │          │            │     payment │            │          │
    │          │          │            │◄────────────┤            │          │
    │          │          │            │             │            │          │
    │          │          │            │ 16. Update  │            │          │
    │          │          │            │     order   │            │          │
    │          │          │            ├────┐        │            │          │
    │          │          │            │    │status  │            │          │
    │          │          │            │    │= paid  │            │          │
    │          │          │            │◄───┘        │            │          │
    │          │          │            │             │            │          │
    │          │          │ 17. Clear  │             │            │          │
    │          │          │     cart   │             │            │          │
    │          │          │◄───────────┤             │            │          │
    │          │          │            │             │            │          │
    │          │          │            │ 18. Send confirmation email         │
    │          │          │            ├───────────────────────────────────►│
    │          │          │            │             │            │          │
    │          │          │            │             │            │  19. Email│
    │          │          │            │             │            │      sent│
    │          │          │            │◄───────────────────────────────────┤
    │          │          │            │             │            │          │
    │◄─────────────────────────────────┴─────────────┼────────────┤          │
    │ 20. Redirect to success page    │             │            │          │
    │          │          │            │             │            │          │
```

**Giải thích từng bước:**

**Phase 1: Lấy Giỏ Hàng (Bước 1-3)**

- Client lấy thông tin giỏ hàng từ Cart Service
- Hiển thị danh sách sản phẩm và tổng tiền

**Phase 2: Tạo Đơn Hàng (Bước 4-6)**

- Client gửi thông tin địa chỉ giao hàng và phương thức thanh toán
- Order Service tính toán giá (itemsPrice, shippingPrice, taxPrice, totalPrice)
- Lưu order vào database với status "pending_payment"

**Phase 3: Tạo Payment Record (Bước 7-10)**

- Payment Service tạo payment record với status "pending"
- Tạo VNPay payment URL với các tham số:
  - vnp_Amount, vnp_OrderInfo, vnp_TxnRef, vnp_SecureHash
- Trả về payment URL cho client

**Phase 4: Thanh Toán Trên VNPay (Bước 11-12)**

- Client được redirect đến VNPay gateway
- Người dùng nhập thông tin thẻ/chọn ngân hàng
- VNPay xử lý thanh toán

**Phase 5: Xử Lý Callback (Bước 13-16)**

- VNPay callback về Payment Service với kết quả
- Payment Service verify secure hash
- Cập nhật payment status thành "paid" hoặc "failed"
- Cập nhật order status thành "pending" (nếu thành công)

**Phase 6: Hoàn Tất (Bước 17-20)**

- Xóa giỏ hàng của user
- Gửi email xác nhận đơn hàng
- Redirect user đến trang thành công

---

### 3.5. Thiết kế cơ sở dữ liệu

#### 3.5.1. Database per Service

Theo nguyên tắc của microservices, mỗi service có database riêng để đảm bảo tính độc lập:

**Danh sách databases:**

1. **smartbuy_db**: User, Address
2. **smartbuy_db_product**: Product, Category, Brand, ProductSpec
3. **smartbuy_db_cart**: Cart, CartItem
4. **smartbuy_db_order**: Order, OrderItem
5. **smartbuy_db_payment**: Payment, Transaction
6. **smartbuy_db_review**: Review, Rating

#### 3.5.2. Schema Design - Product Database

**Collection: products**

```javascript
{
  _id: ObjectId,
  name: String,              // Tên sản phẩm
  slug: String,              // URL-friendly name
  description: String,       // Mô tả chi tiết
  thumbUrl: String,          // Ảnh thumbnail
  basePrice: Number,         // Giá gốc
  discountPercentage: Number,// % giảm giá
  brandId: ObjectId,         // Ref Brand
  categoryId: ObjectId,      // Ref Category
  createdAt: Date,
  updatedAt: Date
}
```

**Collection: categories**

```javascript
{
  _id: ObjectId,
  name: String,              // Tên danh mục
  slug: String,
  description: String,
  parentId: ObjectId,        // Danh mục cha (nếu có)
  image: String
}
```

**Collection: brands**

```javascript
{
  _id: ObjectId,
  name: String,              // Tên thương hiệu
  slug: String,
  logo: String,
  description: String
}
```

**Collection: product_specs** (Thông số kỹ thuật)

```javascript
{
  _id: ObjectId,
  productId: ObjectId,       // Ref Product
  screen: String,            // Màn hình
  os: String,                // Hệ điều hành
  camera: String,            // Camera
  cpu: String,               // Vi xử lý
  ram: String,               // RAM
  storage: String,           // Bộ nhớ
  battery: String,           // Pin
  weight: String,            // Khối lượng
  variants: [                // Các phiên bản
    {
      color: String,
      memory: String,
      price: Number,
      stock: Number,
      images: [String]
    }
  ]
}
```

#### 3.5.3. Schema Design - Order Database

**Collection: orders**

```javascript
{
  _id: ObjectId,
  user: ObjectId,            // Ref User

  // Sản phẩm trong đơn
  orderItems: [
    {
      product: ObjectId,     // Ref Product
      name: String,          // Snapshot tên SP
      sku: String,
      qty: Number,
      price: Number,         // Giá tại thời điểm đặt
      image: String,
      variant: {
        color: String,
        memory: String,
        variantId: ObjectId
      }
    }
  ],

  // Địa chỉ giao hàng
  shippingAddress: {
    fullName: String,
    phone: String,
    province: String,
    district: String,
    ward: String,
    address: String
  },

  // Thanh toán
  paymentMethod: String,     // COD, VNPAY
  paymentStatus: String,     // pending, paid, failed
  paymentId: ObjectId,       // Ref Payment

  // Giá
  itemsPrice: Number,        // Tổng giá SP
  shippingPrice: Number,     // Phí ship
  taxPrice: Number,          // Thuế
  totalPrice: Number,        // Tổng cộng

  // Trạng thái
  status: String,            // pending, confirmed, shipping, delivered, cancelled

  // Tracking
  confirmedAt: Date,
  shippedAt: Date,
  deliveredAt: Date,
  cancelledAt: Date,

  // Notes
  customerNote: String,
  adminNote: String,

  createdAt: Date,
  updatedAt: Date
}
```

**Order Status Flow:**

```
pending → confirmed → shipping → delivered
   ↓
cancelled (chỉ khi pending hoặc confirmed)
```

#### 3.5.4. Schema Design - User Database

**Collection: users**

```javascript
{
  _id: ObjectId,
  email: String,             // Unique
  password: String,          // Hashed (bcrypt)
  firstName: String,
  lastName: String,
  phone: String,
  avatar: String,
  role: String,              // customer, admin
  isVerified: Boolean,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Collection: addresses**

```javascript
{
  _id: ObjectId,
  userId: ObjectId,          // Ref User
  fullName: String,
  phone: String,
  province: String,
  district: String,
  ward: String,
  address: String,
  isDefault: Boolean,
  createdAt: Date
}
```

#### 3.5.5. Schema Design - Cart Database

**Collection: carts**

```javascript
{
  _id: ObjectId,
  userId: ObjectId,          // Ref User
  items: [
    {
      productId: ObjectId,   // Ref Product
      name: String,
      price: Number,
      quantity: Number,
      image: String,
      variant: {
        color: String,
        memory: String
      }
    }
  ],
  totalPrice: Number,
  updatedAt: Date
}
```

#### 3.5.6. Schema Design - Review Database

**Collection: reviews**

```javascript
{
  _id: ObjectId,
  productId: ObjectId,       // Ref Product
  userId: ObjectId,          // Ref User
  orderId: ObjectId,         // Ref Order (verify purchase)
  rating: Number,            // 1-5 stars
  title: String,
  comment: String,
  images: [String],
  helpful: Number,           // Số người thấy hữu ích
  verified: Boolean,         // Đã mua hàng
  createdAt: Date,
  updatedAt: Date
}
```

#### 3.5.7. Indexes và Optimization

**Product Collection Indexes:**

```javascript
db.products.createIndex({ slug: 1 }, { unique: true });
db.products.createIndex({ categoryId: 1 });
db.products.createIndex({ brandId: 1 });
db.products.createIndex({ name: "text", description: "text" }); // Full-text search
db.products.createIndex({ basePrice: 1 });
```

**Order Collection Indexes:**

```javascript
db.orders.createIndex({ user: 1, createdAt: -1 });
db.orders.createIndex({ status: 1 });
db.orders.createIndex({ createdAt: -1 });
```

**Review Collection Indexes:**

```javascript
db.reviews.createIndex({ productId: 1, createdAt: -1 });
db.reviews.createIndex({ userId: 1 });
db.reviews.createIndex({ rating: 1 });
```

### 3.4. Thiết kế API Endpoints

#### 3.4.1. API Gateway Routes

**API Gateway** điều hướng requests đến các services:

```
Base URL: http://localhost:3000

/api/auth/*           → User Service (3005)
/api/users/*          → User Manager Service (3006)
/api/products/*       → Product Manager Service (5002)
/api/cart/*           → Cart Service (3003)
/api/orders/*         → Order Manager Service (5003)
/api/payments/*       → Payment Service (3004)
/api/reviews/*        → Review Service (5006)
/webhook/dialogflow   → Chatbox Service (5008)
```

#### 3.4.2. Product API Endpoints

**Base: /api/products**

| Method | Endpoint            | Description                                       | Auth   |
| ------ | ------------------- | ------------------------------------------------- | ------ |
| GET    | `/`                 | Lấy danh sách sản phẩm (pagination, filter, sort) | Public |
| GET    | `/:slug`            | Lấy chi tiết sản phẩm theo slug                   | Public |
| GET    | `/search?q=keyword` | Tìm kiếm sản phẩm                                 | Public |
| POST   | `/`                 | Tạo sản phẩm mới                                  | Admin  |
| PUT    | `/:id`              | Cập nhật sản phẩm                                 | Admin  |
| DELETE | `/:id`              | Xóa sản phẩm                                      | Admin  |
| GET    | `/categories`       | Lấy danh sách danh mục                            | Public |
| GET    | `/brands`           | Lấy danh sách thương hiệu                         | Public |
| GET    | `/top-selling`      | Lấy sản phẩm bán chạy                             | Public |

**Query Parameters cho GET /api/products:**

```
?category=phone
&brand=samsung
&price_min=5000000
&price_max=20000000
&sort=price
&order=asc
&page=1
&limit=20
```

#### 3.4.3. Order API Endpoints

**Base: /api/orders**

| Method | Endpoint      | Description             | Auth       |
| ------ | ------------- | ----------------------- | ---------- |
| POST   | `/`           | Tạo đơn hàng mới        | User       |
| GET    | `/my-orders`  | Lấy đơn hàng của user   | User       |
| GET    | `/:id`        | Lấy chi tiết đơn hàng   | User/Admin |
| PUT    | `/:id/cancel` | Hủy đơn hàng            | User       |
| PUT    | `/:id/status` | Cập nhật trạng thái đơn | Admin      |
| GET    | `/admin/all`  | Lấy tất cả đơn hàng     | Admin      |

#### 3.4.4. Cart API Endpoints

**Base: /api/cart**

| Method | Endpoint             | Description           | Auth |
| ------ | -------------------- | --------------------- | ---- |
| GET    | `/`                  | Lấy giỏ hàng          | User |
| POST   | `/add`               | Thêm sản phẩm vào giỏ | User |
| PUT    | `/update`            | Cập nhật số lượng     | User |
| DELETE | `/remove/:productId` | Xóa sản phẩm khỏi giỏ | User |
| DELETE | `/clear`             | Xóa toàn bộ giỏ hàng  | User |

#### 3.4.5. Chatbox Webhook Endpoint

**Base: /webhook/dialogflow**

| Method | Endpoint | Description                |
| ------ | -------- | -------------------------- |
| POST   | `/`      | Dialogflow webhook handler |

**Webhook Request Format:**

```javascript
{
  "queryResult": {
    "queryText": "Tìm điện thoại Samsung dưới 10 triệu",
    "intent": {
      "displayName": "search.product"
    },
    "parameters": {
      "brand": "Samsung",
      "price_max": 10000000
    }
  },
  "session": "projects/smartbuy/sessions/123"
}
```

**Webhook Response Format:**

```javascript
{
  "fulfillmentText": "Tôi tìm thấy 5 sản phẩm Samsung dưới 10 triệu...",
  "fulfillmentMessages": [
    {
      "card": {
        "title": "Samsung Galaxy A54",
        "subtitle": "8.990.000đ",
        "imageUri": "...",
        "buttons": [
          {
            "text": "Xem chi tiết",
            "postback": "..."
          }
        ]
      }
    }
  ]
}
```

### 3.5. Thiết kế giao diện người dùng

#### 3.5.1. Wireframe chính

**A. Trang chủ (Home Page)**

```
┌────────────────────────────────────────────────────────────┐
│  [Logo SmartBuy]    [Tìm kiếm...]         [Giỏ] [Đăng nhập]│
├────────────────────────────────────────────────────────────┤
│  [Banner Slider - Khuyến mãi]                              │
├────────────────────────────────────────────────────────────┤
│  Danh mục nổi bật:                                         │
│  [Samsung] [Apple] [Xiaomi] [Oppo] [Vivo]...              │
├────────────────────────────────────────────────────────────┤
│  Sản phẩm nổi bật:                                         │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐            │
│  │ [Img]  │ │ [Img]  │ │ [Img]  │ │ [Img]  │            │
│  │ Name   │ │ Name   │ │ Name   │ │ Name   │            │
│  │ Price  │ │ Price  │ │ Price  │ │ Price  │            │
│  │ [Mua]  │ │ [Mua]  │ │ [Mua]  │ │ [Mua]  │            │
│  └────────┘ └────────┘ └────────┘ └────────┘            │
├────────────────────────────────────────────────────────────┤
│  [Chatbox Icon - Góc phải dưới]                           │
└────────────────────────────────────────────────────────────┘
```

**B. Trang danh sách sản phẩm**

```
┌────────────────────────────────────────────────────────────┐
│  [Header]                                                  │
├──────────┬─────────────────────────────────────────────────┤
│ FILTER   │  PRODUCT LIST                                   │
│          │  ┌──────────────────────────────────────────┐  │
│ Danh mục │  │ [Img] Name       Price    [Thêm giỏ]    │  │
│ □ Samsung│  ├──────────────────────────────────────────┤  │
│ □ Apple  │  │ [Img] Name       Price    [Thêm giỏ]    │  │
│ □ Xiaomi │  ├──────────────────────────────────────────┤  │
│          │  │ [Img] Name       Price    [Thêm giỏ]    │  │
│ Giá      │  └──────────────────────────────────────────┘  │
│ [Min-Max]│  [Pagination: 1 2 3 ... 10]                    │
│          │                                                 │
│ [Áp dụng]│                                                 │
└──────────┴─────────────────────────────────────────────────┘
```

**C. Trang chi tiết sản phẩm**

```
┌────────────────────────────────────────────────────────────┐
│  [Header]                                                  │
├─────────────────────┬──────────────────────────────────────┤
│                     │  Samsung Galaxy S24 Ultra           │
│    [Main Image]     │  ★★★★★ 4.8 (256 đánh giá)          │
│                     │  23.990.000đ  [-15%]                │
│  [Thumb] [Thumb]    │                                     │
│  [Thumb] [Thumb]    │  Màu sắc: ○ Black ○ Gray ○ White    │
│                     │  Bộ nhớ: ○ 256GB ○ 512GB ○ 1TB     │
│                     │                                     │
│                     │  Số lượng: [-] 1 [+]                │
│                     │  [THÊM VÀO GIỎ]  [MUA NGAY]        │
├─────────────────────┴──────────────────────────────────────┤
│  [Tab: Mô tả] [Thông số] [Đánh giá]                       │
│  Thông số kỹ thuật:                                        │
│  - Màn hình: 6.8" Dynamic AMOLED 2X                       │
│  - Camera: 200MP + 12MP + 10MP + 10MP                     │
│  - CPU: Snapdragon 8 Gen 3                                │
│  ...                                                       │
├────────────────────────────────────────────────────────────┤
│  Đánh giá từ khách hàng:                                  │
│  ★★★★★ Rất hài lòng với sản phẩm... - Nguyễn Văn A       │
│  ★★★★☆ Chất lượng tốt nhưng giá hơi cao... - Trần B      │
└────────────────────────────────────────────────────────────┘
```

**D. Trang giỏ hàng**

```
┌────────────────────────────────────────────────────────────┐
│  GIỎ HÀNG CỦA BẠN                                          │
├────────────────────────────────────────────────────────────┤
│  ┌[Img] Samsung S24  │ 23.990.000đ │ [-] 1 [+] │ [X]      │
│  ├[Img] iPhone 15    │ 18.990.000đ │ [-] 2 [+] │ [X]      │
│  └───────────────────────────────────────────────────────┘ │
│                                                            │
│  Tạm tính:                            56.970.000đ         │
│  Phí vận chuyển:                          30.000đ         │
│  ─────────────────────────────────────────────────        │
│  Tổng cộng:                           57.000.000đ         │
│                                                            │
│  [TIẾP TỤC MUA SẮM]              [THANH TOÁN]            │
└────────────────────────────────────────────────────────────┘
```

**E. Chatbox UI**

```
┌──────────────────────────────────┐
│ SmartBuy Assistant      [_][X]   │
├──────────────────────────────────┤
│ Bot: Xin chào! Tôi có thể giúp  │
│      gì cho bạn?                 │
│                                  │
│           You: Tìm Samsung       │
│                dưới 10 triệu     │
│                                  │
│ Bot: Tôi tìm thấy 5 sản phẩm:   │
│      [Card: Samsung A54]         │
│      [Card: Samsung M34]         │
│      ...                         │
│                                  │
│      Chips: [Xem thêm] [So sánh]│
├──────────────────────────────────┤
│ [Nhập tin nhắn...]        [Gửi] │
└──────────────────────────────────┘
```

#### 3.5.2. Color Scheme và Typography

**Màu sắc chính:**

- **Primary**: #1976D2 (Blue)
- **Secondary**: #FF6F00 (Orange)
- **Success**: #4CAF50 (Green)
- **Error**: #F44336 (Red)
- **Background**: #F5F5F5 (Light Gray)
- **Text**: #212121 (Dark Gray)

**Typography:**

- **Font Family**: Inter, Roboto, sans-serif
- **Headings**: 24px - 32px, Bold
- **Body**: 14px - 16px, Regular
- **Small**: 12px

#### 3.5.3. Responsive Design

Giao diện được thiết kế responsive cho 3 breakpoints chính:

- **Mobile**: < 768px (1 column)
- **Tablet**: 768px - 1024px (2 columns)
- **Desktop**: > 1024px (3-4 columns)

### 3.6. Sequence Diagrams

#### 3.6.1. Sequence Diagram - Tìm kiếm sản phẩm qua Chatbox

```
User     Client    Dialogflow    Chatbox     Product
                                 Service     Service
 │          │           │           │           │
 │─Type────▶│           │           │           │
 │"Samsung  │           │           │           │
 │10 triệu" │           │           │           │
 │          │───POST───▶│           │           │
 │          │           │─Match─────│           │
 │          │           │ Intent    │           │
 │          │           │           │           │
 │          │           │──Webhook─▶│           │
 │          │           │           │──GET─────▶│
 │          │           │           │/products? │
 │          │           │           │brand=     │
 │          │           │           │samsung&   │
 │          │           │           │price_max= │
 │          │           │           │10000000   │
 │          │           │           │◀─Results──│
 │          │           │           │           │
 │          │           │◀─Response─│           │
 │          │◀─Message──│  (Cards)  │           │
 │◀─Display─│           │           │           │
 │  Cards   │           │           │           │
```

#### 3.6.2. Sequence Diagram - Đặt hàng

```
User    Client   Gateway  Cart    Product  Payment  Order   Email
 │        │        │       │        │        │       │       │
 │─Click──▶│       │       │        │        │       │       │
 │Checkout│       │       │        │        │       │       │
 │        │──GET──▶│──────▶│       │        │       │       │
 │        │  Cart  │       │       │        │       │       │
 │        │◀──────◀│◀──────│       │        │       │       │
 │        │        │       │        │        │       │       │
 │─Enter──▶│       │       │        │        │       │       │
 │Address │       │       │        │        │       │       │
 │        │       │       │        │        │       │       │
 │─Submit─▶│──────▶│──────────────▶│        │       │       │
 │Order   │       │ Verify Stock   │        │       │       │
 │        │       │◀──────────────◀│        │       │       │
 │        │       │  (OK)          │        │       │       │
 │        │       │                │        │       │       │
 │        │       │───────────────────────▶│       │       │
 │        │       │    Process Payment     │       │       │
 │        │       │◀───────────────────────│       │       │
 │        │       │    (Success)           │       │       │
 │        │       │                        │       │       │
 │        │       │──────────────────────────────▶│       │
 │        │       │     Create Order               │       │
 │        │       │◀──────────────────────────────│       │
 │        │       │     (Order created)            │       │
 │        │       │                                │       │
 │        │       │────────────────────────────────────────▶│
 │        │       │         Send confirmation email        │
 │        │       │                                         │
 │        │◀──────│                                         │
 │◀Success│       │                                         │
 │Message │       │                                         │
```

### 3.7. Tổng kết chương

Chương 3 đã trình bày chi tiết về phân tích và thiết kế hệ thống SmartBuy:

- **Phân tích yêu cầu**: 40 yêu cầu chức năng và các yêu cầu phi chức năng quan trọng.
- **Kiến trúc hệ thống**: 11 microservices độc lập với phân công rõ ràng.
- **Thiết kế database**: Database per service với MongoDB, schema design cho các collections chính.
- **API design**: RESTful API endpoints cho tất cả các chức năng.
- **UI/UX design**: Wireframes cho các trang chính, responsive design.
- **Sequence diagrams**: Mô tả luồng xử lý cho các use case quan trọng.

Thiết kế này đảm bảo hệ thống có khả năng mở rộng, dễ bảo trì và đáp ứng đầy đủ yêu cầu nghiệp vụ của một website thương mại điện tử hiện đại.

---

## CHƯƠNG 4: TRIỂN KHAI HỆ THỐNG

### 4.1. Môi trường phát triển

#### 4.1.1. Phần cứng

- **CPU**: Intel Core i5 hoặc tương đương
- **RAM**: 16GB
- **Ổ cứng**: 256GB SSD
- **Hệ điều hành**: Windows 10/11, macOS, hoặc Linux

#### 4.1.2. Phần mềm và công cụ

**Bảng 4.1: Công nghệ sử dụng trong dự án**

| Công nghệ          | Phiên bản | Mục đích sử dụng              |
| ------------------ | --------- | ----------------------------- |
| **Node.js**        | 18.x      | Runtime cho backend services  |
| **npm**            | 9.x       | Package manager               |
| **MongoDB**        | 7.0       | Database                      |
| **Docker**         | 24.x      | Containerization              |
| **Docker Compose** | 2.x       | Multi-container orchestration |
| **Vue.js**         | 3.4       | Frontend framework            |
| **TypeScript**     | 5.x       | Type-safe JavaScript          |
| **Express.js**     | 4.18      | Web framework                 |
| **Mongoose**       | 8.x       | MongoDB ODM                   |
| **Vite**           | 5.x       | Build tool cho frontend       |
| **Vuetify**        | 3.x       | UI component library          |
| **VS Code**        | Latest    | Code editor                   |
| **Postman**        | Latest    | API testing                   |
| **Git**            | 2.x       | Version control               |

#### 4.1.3. Cấu trúc thư mục dự án

```
smartbuy-web/
├── client/                    # Frontend application
│   ├── src/
│   │   ├── api/              # API calls
│   │   ├── components/       # Vue components
│   │   ├── pages/            # Page components
│   │   ├── router/           # Vue Router
│   │   ├── store/            # Pinia stores
│   │   ├── types/            # TypeScript types
│   │   └── utils/            # Utility functions
│   ├── public/               # Static assets
│   ├── Dockerfile
│   └── package.json
│
├── server/                    # Backend microservices
│   ├── api-gateway/          # API Gateway (Port 3000)
│   │   ├── src/
│   │   │   ├── middleware/   # Auth, CORS, Rate limiting
│   │   │   ├── routes/       # Route definitions
│   │   │   └── server.ts     # Main entry point
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── userservice/          # User Service (Port 3005)
│   │   ├── controllers/      # Request handlers
│   │   ├── models/           # Mongoose models
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   ├── middleware/       # Auth middleware
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── productservice/       # Product Service (Port 3001)
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── product-manager-service/  # Product Manager (Port 5002)
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   └── server.js
│   │   ├── uploads/          # Image uploads
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── cartservice/          # Cart Service (Port 3003)
│   ├── orderservice/         # Order Service (Port 3002)
│   ├── order-manager-service/ # Order Manager (Port 5003)
│   ├── paymentservice/       # Payment Service (Port 3004)
│   ├── review-service/       # Review Service (Port 5006)
│   ├── user-manager-service/ # User Manager (Port 3006)
│   └── chatbox-service/      # Chatbox Service (Port 5008)
│
├── docker-compose.yml        # Docker Compose configuration
├── package.json              # Root package.json
└── README.md                 # Documentation
```

### 4.2. Triển khai Backend Services

#### 4.2.1. API Gateway Service

API Gateway là điểm truy cập duy nhất cho tất cả client requests, thực hiện routing, authentication và rate limiting.

**Cấu trúc file:**

```
api-gateway/
├── src/
│   ├── server.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── cors.ts
│   │   └── rateLimiter.ts
│   └── routes/
│       └── index.ts
├── Dockerfile
├── package.json
└── tsconfig.json
```

**Code triển khai - server.ts:**

```typescript
import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost",
    credentials: true,
  })
);
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Proxy routes to microservices
app.use(
  "/api/users",
  createProxyMiddleware({
    target: process.env.USER_MANAGER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/api/users": "" },
  })
);

app.use(
  "/api/products",
  createProxyMiddleware({
    target: process.env.PRODUCT_MANAGER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/api/products": "" },
  })
);

app.use(
  "/api/cart",
  createProxyMiddleware({
    target: process.env.CART_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/api/cart": "" },
  })
);

app.use(
  "/api/orders",
  createProxyMiddleware({
    target: process.env.ORDER_MANAGER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/api/orders": "" },
  })
);

app.use(
  "/api/payments",
  createProxyMiddleware({
    target: process.env.PAYMENT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/api/payments": "" },
  })
);

app.use(
  "/api/reviews",
  createProxyMiddleware({
    target: process.env.REVIEW_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/api/reviews": "" },
  })
);

app.use(
  "/webhook/dialogflow",
  createProxyMiddleware({
    target: process.env.CHATBOT_SERVICE_URL,
    changeOrigin: true,
  })
);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
});
```

**Dockerfile cho API Gateway:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/server.js"]
```

#### 4.2.2. Product Manager Service

Service quản lý sản phẩm, danh mục, thương hiệu và tồn kho.

**Model - Product (src/models/Product.js):**

```javascript
const mongoose = require("mongoose");
const slugify = require("slugify");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Vui lòng nhập tên sản phẩm"],
      unique: true,
      trim: true,
      maxlength: [200, "Tên sản phẩm không quá 200 ký tự"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Vui lòng nhập mô tả sản phẩm"],
    },
    thumbUrl: {
      type: String,
      default: null,
    },
    basePrice: {
      type: Number,
      required: [true, "Vui lòng nhập giá sản phẩm"],
      min: [0, "Giá phải lớn hơn 0"],
    },
    discountPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    finalPrice: {
      type: Number,
    },
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug
ProductSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  // Calculate final price
  this.finalPrice = this.basePrice * (1 - this.discountPercentage / 100);
  next();
});

// Indexes for search optimization
ProductSchema.index({ name: "text", description: "text" });
ProductSchema.index({ categoryId: 1, brandId: 1 });
ProductSchema.index({ finalPrice: 1 });
ProductSchema.index({ sold: -1 });

module.exports = mongoose.model("Product", ProductSchema);
```

**Controller - Product (src/controllers/productController.js):**

```javascript
const Product = require("../models/Product");
const asyncHandler = require("express-async-handler");

// @desc    Get all products with filters, sorting, pagination
// @route   GET /products
// @access  Public
exports.getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  // Build filter
  const filter = { isActive: true };

  if (req.query.category) {
    filter.categoryId = req.query.category;
  }

  if (req.query.brand) {
    filter.brandId = req.query.brand;
  }

  if (req.query.price_min || req.query.price_max) {
    filter.finalPrice = {};
    if (req.query.price_min) {
      filter.finalPrice.$gte = parseFloat(req.query.price_min);
    }
    if (req.query.price_max) {
      filter.finalPrice.$lte = parseFloat(req.query.price_max);
    }
  }

  // Search by text
  if (req.query.search) {
    filter.$text = { $search: req.query.search };
  }

  // Build sort
  let sort = {};
  if (req.query.sort) {
    const order = req.query.order === "desc" ? -1 : 1;
    sort[req.query.sort] = order;
  } else {
    sort = { createdAt: -1 }; // Default: newest first
  }

  // Execute query
  const products = await Product.find(filter)
    .populate("categoryId", "name slug")
    .populate("brandId", "name slug logo")
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Product.countDocuments(filter);

  res.json({
    success: true,
    data: products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Get product by slug
// @route   GET /products/:slug
// @access  Public
exports.getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    slug: req.params.slug,
    isActive: true,
  })
    .populate("categoryId", "name slug")
    .populate("brandId", "name slug logo");

  if (!product) {
    res.status(404);
    throw new Error("Không tìm thấy sản phẩm");
  }

  res.json({
    success: true,
    data: product,
  });
});

// @desc    Create product
// @route   POST /products
// @access  Private/Admin
exports.createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    data: product,
  });
});

// @desc    Update product
// @route   PUT /products/:id
// @access  Private/Admin
exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    res.status(404);
    throw new Error("Không tìm thấy sản phẩm");
  }

  res.json({
    success: true,
    data: product,
  });
});

// @desc    Delete product (soft delete)
// @route   DELETE /products/:id
// @access  Private/Admin
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!product) {
    res.status(404);
    throw new Error("Không tìm thấy sản phẩm");
  }

  res.json({
    success: true,
    message: "Đã xóa sản phẩm",
  });
});

// @desc    Get top selling products
// @route   GET /products/top-selling
// @access  Public
exports.getTopSellingProducts = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  const products = await Product.find({ isActive: true })
    .populate("categoryId", "name")
    .populate("brandId", "name logo")
    .sort({ sold: -1 })
    .limit(limit);

  res.json({
    success: true,
    data: products,
  });
});
```

**Routes - Product (src/routes/productRoutes.js):**

```javascript
const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getTopSellingProducts,
} = require("../controllers/productController");
const { protect, authorize } = require("../middleware/auth");

// Public routes
router.get("/", getProducts);
router.get("/top-selling", getTopSellingProducts);
router.get("/:slug", getProductBySlug);

// Admin routes
router.post("/", protect, authorize("admin"), createProduct);
router.put("/:id", protect, authorize("admin"), updateProduct);
router.delete("/:id", protect, authorize("admin"), deleteProduct);

module.exports = router;
```

#### 4.2.3. Order Manager Service

Service quản lý đơn hàng, workflow và gửi email thông báo.

**Model - Order (src/models/Order.js):**

```javascript
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        sku: String,
        qty: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
        image: String,
        variant: {
          color: String,
          memory: String,
          variantId: mongoose.Schema.Types.ObjectId,
        },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      province: { type: String, required: true },
      district: { type: String, required: true },
      ward: { type: String, required: true },
      address: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "VNPAY"],
      required: true,
      default: "COD",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 30000,
    },
    taxPrice: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipping", "delivered", "cancelled"],
      default: "pending",
      index: true,
    },
    confirmedAt: Date,
    shippedAt: Date,
    deliveredAt: Date,
    cancelledAt: Date,
    cancelReason: String,
    customerNote: String,
    adminNote: String,
  },
  {
    timestamps: true,
  }
);

// Calculate prices before save
OrderSchema.pre("save", function (next) {
  if (this.isModified("orderItems")) {
    this.itemsPrice = this.orderItems.reduce((acc, item) => {
      return acc + item.price * item.qty;
    }, 0);
    this.totalPrice = this.itemsPrice + this.shippingPrice + this.taxPrice;
  }
  next();
});

// Indexes
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Order", OrderSchema);
```

**Controller - Order (src/controllers/orderController.js):**

```javascript
const Order = require("../models/Order");
const asyncHandler = require("express-async-handler");
const { sendOrderConfirmationEmail } = require("../services/emailService");

// @desc    Create new order
// @route   POST /orders
// @access  Private
exports.createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, customerNote } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("Giỏ hàng trống");
  }

  // Create order
  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    customerNote,
  });

  // Populate order
  await order.populate("user", "email firstName lastName");
  await order.populate("orderItems.product", "name slug");

  // Send confirmation email
  try {
    await sendOrderConfirmationEmail(order);
  } catch (error) {
    console.error("Email sending failed:", error);
  }

  res.status(201).json({
    success: true,
    data: order,
  });
});

// @desc    Get user orders
// @route   GET /orders/my-orders
// @access  Private
exports.getMyOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("orderItems.product", "name slug thumbUrl");

  const total = await Order.countDocuments({ user: req.user._id });

  res.json({
    success: true,
    data: orders,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Get order by ID
// @route   GET /orders/:id
// @access  Private
exports.getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "email firstName lastName phone")
    .populate("orderItems.product", "name slug thumbUrl");

  if (!order) {
    res.status(404);
    throw new Error("Không tìm thấy đơn hàng");
  }

  // Check authorization
  if (
    order.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Không có quyền truy cập đơn hàng này");
  }

  res.json({
    success: true,
    data: order,
  });
});

// @desc    Update order status
// @route   PUT /orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, adminNote } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Không tìm thấy đơn hàng");
  }

  // Update status and timestamp
  order.status = status;
  order.adminNote = adminNote || order.adminNote;

  switch (status) {
    case "confirmed":
      order.confirmedAt = Date.now();
      break;
    case "shipping":
      order.shippedAt = Date.now();
      break;
    case "delivered":
      order.deliveredAt = Date.now();
      order.paymentStatus = "paid";
      break;
    case "cancelled":
      order.cancelledAt = Date.now();
      break;
  }

  await order.save();

  res.json({
    success: true,
    data: order,
  });
});

// @desc    Cancel order
// @route   PUT /orders/:id/cancel
// @access  Private
exports.cancelOrder = asyncHandler(async (req, res) => {
  const { cancelReason } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Không tìm thấy đơn hàng");
  }

  // Check authorization
  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Không có quyền hủy đơn hàng này");
  }

  // Can only cancel pending or confirmed orders
  if (!["pending", "confirmed"].includes(order.status)) {
    res.status(400);
    throw new Error("Không thể hủy đơn hàng đã giao hoặc đang vận chuyển");
  }

  order.status = "cancelled";
  order.cancelledAt = Date.now();
  order.cancelReason = cancelReason;

  await order.save();

  res.json({
    success: true,
    message: "Đã hủy đơn hàng",
    data: order,
  });
});

// @desc    Get all orders (Admin)
// @route   GET /orders/admin/all
// @access  Private/Admin
exports.getAllOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.status) {
    filter.status = req.query.status;
  }

  const orders = await Order.find(filter)
    .populate("user", "email firstName lastName")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments(filter);

  res.json({
    success: true,
    data: orders,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});
```

**Email Service (src/services/emailService.js):**

```javascript
const nodemailer = require("nodemailer");

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Send order confirmation email
exports.sendOrderConfirmationEmail = async (order) => {
  const itemsList = order.orderItems
    .map(
      (item) =>
        `<li>${item.name} x ${item.qty} - ${item.price.toLocaleString(
          "vi-VN"
        )}đ</li>`
    )
    .join("");

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: order.user.email,
    subject: `Xác nhận đơn hàng #${order._id}`,
    html: `
      <h2>Cảm ơn bạn đã đặt hàng tại SmartBuy!</h2>
      <p>Xin chào ${order.user.firstName} ${order.user.lastName},</p>
      <p>Đơn hàng của bạn đã được tiếp nhận. Dưới đây là thông tin chi tiết:</p>
      
      <h3>Mã đơn hàng: #${order._id}</h3>
      
      <h4>Sản phẩm:</h4>
      <ul>${itemsList}</ul>
      
      <h4>Địa chỉ giao hàng:</h4>
      <p>
        ${order.shippingAddress.fullName}<br>
        ${order.shippingAddress.phone}<br>
        ${order.shippingAddress.address}, ${order.shippingAddress.ward}<br>
        ${order.shippingAddress.district}, ${order.shippingAddress.province}
      </p>
      
      <h4>Tổng tiền: ${order.totalPrice.toLocaleString("vi-VN")}đ</h4>
      
      <p>Chúng tôi sẽ liên hệ với bạn sớm để xác nhận đơn hàng.</p>
      <p>Trân trọng,<br>SmartBuy Team</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
```

### 4.3. Triển khai Frontend

#### 4.3.1. Cấu trúc Frontend

Frontend được xây dựng với **Vue.js 3**, **TypeScript**, **Vuetify** và **Pinia**.

**Main entry point (src/main.ts):**

```typescript
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import vuetify from "./plugins/vuetify";
import "@/assets/css/index.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(vuetify);

app.mount("#app");
```

#### 4.3.2. Pinia Store - Product Store

**store/product/index.ts:**

```typescript
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { productAPI } from "@/api/product";
import type { Product, ProductFilters } from "@/types/product.types";

export const useProductStore = defineStore("product", () => {
  const products = ref<Product[]>([]);
  const currentProduct = ref<Product | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  // Get products with filters
  const fetchProducts = async (filters: ProductFilters) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await productAPI.getProducts(filters);
      products.value = response.data;
      pagination.value = response.pagination;
    } catch (err: any) {
      error.value = err.message || "Lỗi khi tải sản phẩm";
      console.error("Error fetching products:", err);
    } finally {
      loading.value = false;
    }
  };

  // Get product by slug
  const fetchProductBySlug = async (slug: string) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await productAPI.getProductBySlug(slug);
      currentProduct.value = response.data;
    } catch (err: any) {
      error.value = err.message || "Không tìm thấy sản phẩm";
      console.error("Error fetching product:", err);
    } finally {
      loading.value = false;
    }
  };

  // Computed
  const hasProducts = computed(() => products.value.length > 0);

  return {
    products,
    currentProduct,
    loading,
    error,
    pagination,
    hasProducts,
    fetchProducts,
    fetchProductBySlug,
  };
});
```

#### 4.3.3. API Client - Product API

**api/product/product.ts:**

```typescript
import axios from "@/plugins/axios";
import type { Product, ProductFilters } from "@/types/product.types";

export const productAPI = {
  // Get products with filters
  async getProducts(filters: ProductFilters) {
    const params = new URLSearchParams();

    if (filters.category) params.append("category", filters.category);
    if (filters.brand) params.append("brand", filters.brand);
    if (filters.price_min)
      params.append("price_min", filters.price_min.toString());
    if (filters.price_max)
      params.append("price_max", filters.price_max.toString());
    if (filters.search) params.append("search", filters.search);
    if (filters.sort) params.append("sort", filters.sort);
    if (filters.order) params.append("order", filters.order);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());

    const response = await axios.get(`/api/products?${params.toString()}`);
    return response.data;
  },

  // Get product by slug
  async getProductBySlug(slug: string) {
    const response = await axios.get(`/api/products/${slug}`);
    return response.data;
  },

  // Get top selling products
  async getTopSelling(limit: number = 10) {
    const response = await axios.get(
      `/api/products/top-selling?limit=${limit}`
    );
    return response.data;
  },
};
```

#### 4.3.4. Product List Component

**pages/category/index.vue:**

```vue
<template>
  <v-container>
    <v-row>
      <!-- Filters Sidebar -->
      <v-col cols="12" md="3">
        <v-card>
          <v-card-title>Bộ lọc</v-card-title>
          <v-card-text>
            <!-- Category Filter -->
            <div class="mb-4">
              <h4>Danh mục</h4>
              <v-checkbox
                v-for="cat in categories"
                :key="cat.id"
                v-model="filters.category"
                :label="cat.name"
                :value="cat.id"
                hide-details
                density="compact"
              ></v-checkbox>
            </div>

            <!-- Price Filter -->
            <div class="mb-4">
              <h4>Khoảng giá</h4>
              <v-text-field
                v-model.number="filters.price_min"
                label="Từ"
                type="number"
                density="compact"
              ></v-text-field>
              <v-text-field
                v-model.number="filters.price_max"
                label="Đến"
                type="number"
                density="compact"
              ></v-text-field>
            </div>

            <v-btn @click="applyFilters" color="primary" block> Áp dụng </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Product List -->
      <v-col cols="12" md="9">
        <!-- Sort options -->
        <div class="d-flex justify-space-between mb-4">
          <div>
            <strong>{{ pagination.total }}</strong> sản phẩm
          </div>
          <v-select
            v-model="sortOption"
            :items="sortOptions"
            item-title="text"
            item-value="value"
            density="compact"
            style="max-width: 200px"
            @update:model-value="handleSort"
          ></v-select>
        </div>

        <!-- Loading -->
        <v-progress-linear v-if="loading" indeterminate></v-progress-linear>

        <!-- Products Grid -->
        <v-row v-if="!loading && hasProducts">
          <v-col
            v-for="product in products"
            :key="product._id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <ProductCard :product="product" />
          </v-col>
        </v-row>

        <!-- Empty State -->
        <v-alert v-if="!loading && !hasProducts" type="info">
          Không tìm thấy sản phẩm nào
        </v-alert>

        <!-- Pagination -->
        <v-pagination
          v-if="pagination.pages > 1"
          v-model="filters.page"
          :length="pagination.pages"
          @update:model-value="loadProducts"
          class="mt-4"
        ></v-pagination>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useProductStore } from "@/store/product";
import { storeToRefs } from "pinia";
import ProductCard from "@/components/product/ProductCard.vue";

const productStore = useProductStore();
const { products, loading, pagination, hasProducts } =
  storeToRefs(productStore);

const filters = ref({
  category: null,
  brand: null,
  price_min: null,
  price_max: null,
  search: "",
  sort: "createdAt",
  order: "desc",
  page: 1,
  limit: 20,
});

const sortOption = ref("newest");
const sortOptions = [
  { text: "Mới nhất", value: "newest" },
  { text: "Giá: Thấp đến cao", value: "price_asc" },
  { text: "Giá: Cao đến thấp", value: "price_desc" },
  { text: "Bán chạy", value: "best_selling" },
];

const categories = ref([
  { id: "samsung", name: "Samsung" },
  { id: "apple", name: "Apple" },
  { id: "xiaomi", name: "Xiaomi" },
]);

const loadProducts = async () => {
  await productStore.fetchProducts(filters.value);
};

const applyFilters = () => {
  filters.value.page = 1;
  loadProducts();
};

const handleSort = (value: string) => {
  switch (value) {
    case "price_asc":
      filters.value.sort = "finalPrice";
      filters.value.order = "asc";
      break;
    case "price_desc":
      filters.value.sort = "finalPrice";
      filters.value.order = "desc";
      break;
    case "best_selling":
      filters.value.sort = "sold";
      filters.value.order = "desc";
      break;
    default:
      filters.value.sort = "createdAt";
      filters.value.order = "desc";
  }
  loadProducts();
};

onMounted(() => {
  loadProducts();
});
</script>
```

### 4.4. Triển khai Chatbox Service

#### 4.4.1. Dialogflow Setup

**Tạo Agent và Intents:**

1. **Intent: search.product**

   - Training phrases: "Tìm điện thoại Samsung", "Có điện thoại nào dưới 10 triệu"
   - Parameters: @brand, @price_max, @category
   - Webhook: Enabled

2. **Intent: check.order**

   - Training phrases: "Kiểm tra đơn hàng", "Đơn hàng của tôi đến đâu rồi"
   - Parameters: @order_id
   - Webhook: Enabled

3. **Intent: cancel.order**
   - Training phrases: "Hủy đơn hàng", "Tôi muốn hủy đơn"
   - Parameters: @order_id
   - Webhook: Enabled

#### 4.4.2. Chatbox Webhook Service

**src/index.js:**

```javascript
const express = require("express");
const { WebhookClient } = require("dialogflow-fulfillment");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5008;

// Webhook endpoint
app.post("/webhook/dialogflow", async (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });

  // Search product intent
  async function searchProduct(agent) {
    const brand = agent.parameters.brand;
    const priceMax = agent.parameters.price_max;
    const category = agent.parameters.category;

    try {
      // Call Product Service
      const params = new URLSearchParams();
      if (brand) params.append("brand", brand);
      if (priceMax) params.append("price_max", priceMax);
      if (category) params.append("category", category);
      params.append("limit", "5");

      const response = await axios.get(
        `${process.env.PRODUCT_SERVICE_URL}/products?${params.toString()}`
      );

      const products = response.data.data;

      if (products.length === 0) {
        agent.add("Xin lỗi, tôi không tìm thấy sản phẩm phù hợp.");
        return;
      }

      agent.add(`Tôi tìm thấy ${products.length} sản phẩm cho bạn:`);

      // Add product cards
      products.forEach((product) => {
        const card = {
          card: {
            title: product.name,
            subtitle: `${product.finalPrice.toLocaleString("vi-VN")}đ`,
            imageUri: product.thumbUrl,
            buttons: [
              {
                text: "Xem chi tiết",
                postback: `/product/${product.slug}`,
              },
            ],
          },
        };
        agent.add(card);
      });
    } catch (error) {
      console.error("Error searching products:", error);
      agent.add("Xin lỗi, có lỗi xảy ra khi tìm kiếm sản phẩm.");
    }
  }

  // Check order intent
  async function checkOrder(agent) {
    const orderId = agent.parameters.order_id;
    const userId = agent.context.get("user_session")?.parameters?.userId;

    if (!orderId) {
      agent.add("Vui lòng cung cấp mã đơn hàng của bạn.");
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.ORDER_SERVICE_URL}/orders/${orderId}`
      );

      const order = response.data.data;

      let statusText = "";
      switch (order.status) {
        case "pending":
          statusText = "đang chờ xác nhận";
          break;
        case "confirmed":
          statusText = "đã xác nhận, đang chuẩn bị hàng";
          break;
        case "shipping":
          statusText = "đang vận chuyển";
          break;
        case "delivered":
          statusText = "đã giao thành công";
          break;
        case "cancelled":
          statusText = "đã bị hủy";
          break;
      }

      agent.add(
        `Đơn hàng #${orderId} của bạn ${statusText}. ` +
          `Tổng giá trị: ${order.totalPrice.toLocaleString("vi-VN")}đ`
      );
    } catch (error) {
      console.error("Error checking order:", error);
      agent.add("Không tìm thấy đơn hàng. Vui lòng kiểm tra lại mã đơn hàng.");
    }
  }

  // Cancel order intent
  async function cancelOrder(agent) {
    const orderId = agent.parameters.order_id;

    if (!orderId) {
      agent.add("Vui lòng cung cấp mã đơn hàng cần hủy.");
      return;
    }

    try {
      await axios.put(
        `${process.env.ORDER_SERVICE_URL}/orders/${orderId}/cancel`,
        { cancelReason: "Khách hàng yêu cầu hủy qua chatbot" }
      );

      agent.add(
        `Đơn hàng #${orderId} đã được hủy thành công. ` +
          `Nếu bạn đã thanh toán, chúng tôi sẽ hoàn tiền trong 3-5 ngày làm việc.`
      );
    } catch (error) {
      console.error("Error cancelling order:", error);
      agent.add(
        "Không thể hủy đơn hàng. " +
          "Đơn hàng có thể đã được vận chuyển hoặc không tồn tại."
      );
    }
  }

  // Map intents to functions
  const intentMap = new Map();
  intentMap.set("search.product", searchProduct);
  intentMap.set("check.order", checkOrder);
  intentMap.set("cancel.order", cancelOrder);

  agent.handleRequest(intentMap);
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", service: "Chatbox Service" });
});

app.listen(PORT, () => {
  console.log(`🤖 Chatbox Service running on port ${PORT}`);
});
```

### 4.5. Containerization với Docker

#### 4.5.1. Docker Compose Configuration

**docker-compose.yml:**

```yaml
services:
  # API Gateway
  api-gateway:
    build:
      context: ./server/api-gateway
      dockerfile: Dockerfile
    container_name: smartbuy-api-gateway
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      PORT: 3000
      MONGODB_URI: mongodb://host.docker.internal:27017/smartbuy
      USER_SERVICE_URL: http://userservice:3005
      USER_MANAGER_SERVICE_URL: http://user-manager:3006
      PRODUCT_SERVICE_URL: http://productservice:3001
      PRODUCT_MANAGER_SERVICE_URL: http://product-manager:5002
      CART_SERVICE_URL: http://cartservice:3003
      ORDER_SERVICE_URL: http://orderservice:3002
      PAYMENT_SERVICE_URL: http://paymentservice:3004
      ORDER_MANAGER_SERVICE_URL: http://order-manager:5003
      REVIEW_SERVICE_URL: http://review-service:5006
      CHATBOT_SERVICE_URL: http://chatbox-service:5008
    networks:
      - smartbuy-network

  # Product Manager Service
  product-manager:
    build:
      context: ./server/product-manager-service
      dockerfile: Dockerfile
    container_name: smartbuy-product-manager
    restart: unless-stopped
    ports:
      - "5002:5002"
    environment:
      NODE_ENV: production
      PORT: 5002
      MONGODB_URI: mongodb://host.docker.internal:27017/smartbuy_db_product
    networks:
      - smartbuy-network
    volumes:
      - ./client/src/assets/images:/app/uploads/images:ro

  # Order Manager Service
  order-manager:
    build:
      context: ./server/order-manager-service
      dockerfile: Dockerfile
    container_name: smartbuy-order-manager
    restart: unless-stopped
    ports:
      - "5003:5003"
    environment:
      NODE_ENV: production
      PORT: 5003
      MONGODB_URI: mongodb://host.docker.internal:27017/smartbuy_db_order
      EMAIL_USER: ${EMAIL_USER}
      EMAIL_PASSWORD: ${EMAIL_PASSWORD}
    networks:
      - smartbuy-network

  # Chatbox Service
  chatbox-service:
    build:
      context: ./server/chatbox-service
      dockerfile: Dockerfile
    container_name: smartbuy-chatbox
    restart: unless-stopped
    ports:
      - "5008:5008"
    environment:
      NODE_ENV: production
      PORT: 5008
      GOOGLE_PROJECT_ID: ${GOOGLE_PROJECT_ID}
      PRODUCT_SERVICE_URL: http://productservice:3001
      ORDER_SERVICE_URL: http://orderservice:3002
    networks:
      - smartbuy-network

  # Frontend Client
  client:
    build:
      context: ./client
      dockerfile: Dockerfile
    container_name: smartbuy-client
    restart: unless-stopped
    ports:
      - "80:80"
    depends_on:
      - api-gateway
    networks:
      - smartbuy-network

networks:
  smartbuy-network:
    driver: bridge

volumes:
  user_avatars:
```

#### 4.5.2. Service Dockerfile Examples

**Product Manager Dockerfile:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p uploads/images

EXPOSE 5002

CMD ["node", "src/server.js"]
```

**Frontend Dockerfile:**

```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf:**

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://api-gateway:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 4.5.3. Deployment Commands

**Build và khởi chạy hệ thống:**

```bash
# Build all services
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Restart a specific service
docker-compose restart product-manager
```

### 4.6. Tổng kết chương

Chương 4 đã trình bày chi tiết quá trình triển khai hệ thống SmartBuy:

1. **Môi trường phát triển**: Công nghệ, công cụ và cấu trúc thư mục dự án.

2. **Backend Services**:

   - API Gateway với routing và middleware
   - Product Manager Service với CRUD operations
   - Order Manager Service với workflow và email notifications
   - Code examples cho Models, Controllers, Routes và Services

3. **Frontend**:

   - Vue.js 3 với TypeScript
   - Pinia Store cho state management
   - API client và components
   - Responsive UI với Vuetify

4. **Chatbox Service**:

   - Dialogflow integration
   - Webhook implementation
   - Intent handling và response generation

5. **Containerization**:
   - Docker Compose configuration
   - Dockerfiles cho từng service
   - Nginx configuration cho frontend
   - Deployment commands

Hệ thống đã được triển khai hoàn chỉnh với kiến trúc microservices, sử dụng Docker để đảm bảo tính nhất quán và dễ dàng triển khai trên nhiều môi trường khác nhau.

---

---

## CHƯƠNG 5: KẾT QUẢ VÀ ĐÁNH GIÁ

5.1. Kết quả triển khai

5.2. Kiểm thử hệ thống

5.3. Đánh giá hệ thống

5.4. Hướng phát triển

5.5. Tổng kết chương

---

## KẾT LUẬN

**TÀI LIỆU THAM KHẢO**

**PHỤ LỤC**

---

---

# DANH MỤC CÁC KÝ HIỆU, CHỮ VIẾT TẮT

| Ký hiệu | Nghĩa                                                              |
| ------- | ------------------------------------------------------------------ |
| API     | Application Programming Interface - Giao diện lập trình ứng dụng   |
| CRUD    | Create, Read, Update, Delete - Tạo, Đọc, Cập nhật, Xóa             |
| CSS     | Cascading Style Sheets - Bảng mã định dạng phân tầng               |
| DBMS    | Database Management System - Hệ quản trị cơ sở dữ liệu             |
| DOM     | Document Object Model - Mô hình đối tượng tài liệu                 |
| HTML    | HyperText Markup Language - Ngôn ngữ đánh dấu siêu văn bản         |
| HTTP    | HyperText Transfer Protocol - Giao thức truyền tải siêu văn bản    |
| HTTPS   | HyperText Transfer Protocol Secure - Giao thức HTTP bảo mật        |
| JS      | JavaScript - Ngôn ngữ lập trình JavaScript                         |
| JSON    | JavaScript Object Notation - Định dạng dữ liệu JavaScript          |
| JWT     | JSON Web Token - Mã thông báo web JSON                             |
| MVC     | Model-View-Controller - Mô hình kiến trúc phần mềm                 |
| NLP     | Natural Language Processing - Xử lý ngôn ngữ tự nhiên              |
| NoSQL   | Not Only SQL - Cơ sở dữ liệu phi quan hệ                           |
| REST    | Representational State Transfer - Kiến trúc chuyển giao trạng thái |
| SMTP    | Simple Mail Transfer Protocol - Giao thức truyền thư đơn giản      |
| SQL     | Structured Query Language - Ngôn ngữ truy vấn có cấu trúc          |
| TS      | TypeScript - Ngôn ngữ lập trình TypeScript                         |
| UI      | User Interface - Giao diện người dùng                              |
| UX      | User Experience - Trải nghiệm người dùng                           |
| VNPay   | Vietnam Payment - Cổng thanh toán Việt Nam                         |

---

# DANH MỤC CÁC BẢNG

| Bảng     | Tên bảng                               | Trang |
| -------- | -------------------------------------- | ----- |
| Bảng 2.1 | So sánh Monolithic và Microservices    |       |
| Bảng 2.2 | Các phương thức HTTP trong RESTful API |       |
| Bảng 3.1 | Danh sách yêu cầu chức năng            |       |
| Bảng 3.2 | Danh sách microservices trong hệ thống |       |
| Bảng 3.3 | Mô tả Collection Products              |       |
| Bảng 3.4 | Mô tả Collection Orders                |       |
| Bảng 3.5 | Mô tả Collection Users                 |       |
| Bảng 3.6 | Mô tả Collection Carts                 |       |
| Bảng 4.1 | Công nghệ sử dụng trong dự án          |       |
| Bảng 4.2 | Cấu hình Docker Services               |       |
| Bảng 5.1 | Kết quả kiểm thử chức năng             |       |
| Bảng 5.2 | Kết quả kiểm thử hiệu năng             |       |

---

# DANH MỤC CÁC HÌNH

| Hình      | Tên hình                              | Trang |
| --------- | ------------------------------------- | ----- |
| Hình 2.1  | Kiến trúc Monolithic                  |       |
| Hình 2.2  | Kiến trúc Microservices               |       |
| Hình 2.3  | Mô hình RESTful API                   |       |
| Hình 2.4  | Quy trình xử lý NLP của Dialogflow    |       |
| Hình 3.1  | Use Case Diagram tổng quát            |       |
| Hình 3.2  | Use Case - Quản lý sản phẩm           |       |
| Hình 3.3  | Use Case - Quản lý đơn hàng           |       |
| Hình 3.4  | Use Case - Chatbox tư vấn             |       |
| Hình 3.5  | Kiến trúc tổng thể hệ thống SmartBuy  |       |
| Hình 3.6  | Sơ đồ luồng dữ liệu giữa các services |       |
| Hình 3.7  | ERD - Product Database                |       |
| Hình 3.8  | ERD - Order Database                  |       |
| Hình 3.9  | ERD - User Database                   |       |
| Hình 3.10 | Sequence Diagram - Tìm kiếm sản phẩm  |       |
| Hình 3.11 | Sequence Diagram - Tạo đơn hàng       |       |
| Hình 3.12 | Sequence Diagram - Chatbox tư vấn     |       |
| Hình 3.13 | Wireframe - Trang chủ                 |       |
| Hình 3.14 | Wireframe - Trang chi tiết sản phẩm   |       |
| Hình 3.15 | Wireframe - Trang quản lý đơn hàng    |       |
| Hình 4.1  | Cấu trúc thư mục Backend              |       |
| Hình 4.2  | Cấu trúc thư mục Frontend             |       |
| Hình 4.3  | Luồng xử lý trong Product Service     |       |
| Hình 4.4  | Luồng xử lý trong Order Service       |       |
| Hình 4.5  | Luồng xử lý Chatbox Webhook           |       |
| Hình 4.6  | Docker Container Architecture         |       |
| Hình 5.1  | Giao diện trang chủ                   |       |
| Hình 5.2  | Giao diện tìm kiếm và lọc sản phẩm    |       |
| Hình 5.3  | Giao diện chi tiết sản phẩm           |       |
| Hình 5.4  | Giao diện giỏ hàng                    |       |
| Hình 5.5  | Giao diện quản lý đơn hàng            |       |
| Hình 5.6  | Giao diện Admin - Quản lý sản phẩm    |       |
| Hình 5.7  | Giao diện Chatbox tư vấn              |       |
| Hình 5.8  | Kết quả kiểm thử API                  |       |

---
