3.4. Xây dựng chat bot tư vấn (DialogFlow) 
Hệ thống chatbot tư vấn được xây dựng nhằm hỗ trợ người dùng trong việc tìm kiếm 
và lựa chọn sản phẩm phù hợp một cách nhanh chóng, tiện lợi. Việc tích hợp chatbot 
PHÂN TÍCH THIẾT KẾ HỆ THỐNG 
với hệ thống microservices giúp cải thiện trải nghiệm khách hàng, đồng thời giảm tải 
cho bộ phận chăm sóc khách hàng truyền thống. 
Trong đồ án này, Dialogflow được lựa chọn là nền tảng xây dựng chatbot vì hỗ trợ 
xử lý ngôn ngữ tự nhiên (Natural Language Processing – NLP) mạnh mẽ, dễ tích hợp 
với các nền tảng backend thông qua webhook, và hỗ trợ triển khai đa kênh. 
3.4.1. Tạo các Intents 
Dialogflow hoạt động dựa trên khái niệm Intent, đại diện cho ý định người dùng trong 
một truy vấn. Mỗi Intent sẽ được gắn với các câu ví dụ (training phrases) nhằm giúp 
chatbot hiểu được ngữ cảnh và mục tiêu của người dùng. 
Hình 3.11 Trang tạo các intents 
3.4.1.1. Huấn luyện đầu vào 
Bước đầu tiên trong việc xây dựng chatbot là huấn luyện các câu đầu vào – tức là 
các mẫu câu người dùng có thể nhập khi cần tư vấn. - - - 
Xác định Intent (ý định người dùng): Mỗi nhu cầu tìm kiếm, ví dụ như “tìm giày 
thể thao”, “giày màu trắng size 40”, sẽ được gán vào một Intent, chẳng hạn như 
ITuVan. Ví dụ: 
Intent: “ITuVan” => người dùng có thể nhập: 
+ “Có giày thể thao không ?” 
+ “Giày bóng rổ size 38 có không?” 
+ “Tôi muốn mua giày” 
+ “Tôi muốn mua giày cỡ chân 40” 
Huấn luyện đa dạng mẫu câu: Càng nhiều mẫu câu, khả năng chatbot hiểu chính 
xác càng cao. Các mẫu nên đa dạng về cách nói, từ ngữ địa phương, cách rút gọn,... 
GVHD: TS. Hà Duy An   
SVTH: Nguyễn Trung Tín B2110979 
65    
PHÂN TÍCH THIẾT KẾ HỆ THỐNG - 
Tận dụng mô hình học máy (Machine Learning): Dialogflow sử dụng các thuật 
toán NLP để tự động hiểu các câu nói có ngữ nghĩa tương đồng, từ đó mở rộng khả 
năng hiểu ngôn ngữ tự nhiên của chatbot. 
Hình 3.12 Giao diện nhập các mẫu huấn luyện đầu vào trong Dialogflow 
3.4.1.2. Huấn luyện đầu ra 
Khi hệ thống đã xác định được Intent phù hợp từ câu hỏi của người dùng, bước tiếp 
theo là xây dựng phản hồi đầu ra sao cho đúng ngữ cảnh và tự nhiên. - - - 
Phản hồi tĩnh (Static response): Có thể là văn bản đơn giản, hoặc thẻ hiển thị thông 
tin sản phẩm. 
Phản hồi động (Dynamic response): Sử dụng webhook để gửi truy vấn đến hệ 
thống backend (ChatService), lấy dữ liệu sản phẩm thực tế để phản hồi. 
Tối ưu hóa nội dung phản hồi: 
+ Nội dung ngắn gọn, thân thiện, đúng trọng tâm. 
+ Có thể kèm nút chuyển hướng (button), ảnh minh họa, giá sản phẩm. 
+ Ví dụ: “Chúng tôi tìm thấy 3 mẫu giày thể thao size 39 phù hợp với bạn. Mời bạn 
tham khảo!” 
GVHD: TS. Hà Duy An   
SVTH: Nguyễn Trung Tín B2110979 
66    
PHÂN TÍCH THIẾT KẾ HỆ THỐNG 
Hình 3.13 Cấu hình các mẫu phản hồi trong Dialogflow. 
GVHD: TS. Hà Duy An   
SVTH: Nguyễn Trung Tín B2110979 
67    
PHÂN TÍCH THIẾT KẾ HỆ THỐNG 
3.4.2. Tạo các Entity 
Hình 3.14 Giao diện tạo các Entities 
Entity trong Dialogflow giúp chatbot hiểu rõ hơn về các thành phần dữ liệu trong câu 
người dùng nói – ví dụ như kích cỡ, danh mục sản phẩm, màu sắc,...  - - - 
System Entities (Mặc định): Được tích hợp sẵn trong Dialogflow như 
@sys.number, @sys.date, @sys.email,... 
Custom Entities (Tuỳ chỉnh): 
+ ECategory: danh mục sản phẩm như thể thao, bóng rổ, chạy bộ,... 
+ ESize: kích cỡ giày, như 36, 37, 38, 39, 40,... 
+ EColor: màu sắc như trắng, đen, đỏ, vàng,... 
Session Entities (Thực thể theo ngữ cảnh): Được tạo trong thời gian thực, lưu giữ 
thông tin theo từng đoạn hội thoại, giúp chatbot giữ ngữ cảnh xuyên suốt. 
GVHD: TS. Hà Duy An   
SVTH: Nguyễn Trung Tín B2110979 
68    
PHÂN TÍCH THIẾT KẾ HỆ THỐNG 
Hình 3.15 Mẫu Entities của ECategory 
3.4.3. Xây dựng câu phản hồi bằng webhook thông qua ChatService 
Webhook trong Dialogflow đóng vai trò như một cổng trung gian giúp chatbot kết 
nối với hệ thống backend để lấy dữ liệu động theo nhu cầu người dùng. 
Quy trình hoạt động: 
1. Người dùng nhập câu hỏi, ví dụ: “Tôi muốn mua giày thể thao size 39 màu 
trắng.” 
2. Dialogflow: 
a. Xác định Intent là ITuVan. 
b. Trích xuất các Entity: thể thao (ECategory), 39 (ESize), trắng (EColor). 
3. Gửi request đến ChatService thông qua webhook kèm các entity đã nhận. 
4. ChatService: 
a. Truy vấn cơ sở dữ liệu sản phẩm theo các điều kiện: category, size, 
color. 
b. Trả về danh sách 1–3 sản phẩm phù hợp (nếu có), theo định dạng 
custom payload. 
5. Dialogflow nhận dữ liệu và gửi về cho người dùng dưới dạng thẻ sản phẩm 
hoặc tin nhắn tùy chỉnh. 
Chatbot không tích hợp chức năng mua hàng trực tiếp, nhằm giữ cho việc quản lý 
đơn hàng, xác thực người dùng và thanh toán được thực hiện tập trung qua hệ thống 
GVHD: TS. Hà Duy An   
SVTH: Nguyễn Trung Tín B2110979 
69    
PHÂN TÍCH THIẾT KẾ HỆ THỐNG 
chính. Chatbot chỉ có chức năng tư vấn và gợi ý sản phẩm, sau đó điều hướng người 
dùng đến trang chi tiết để thực hiện quyết định mua hàng. 
Ưu điểm của giải pháp: - 
Tự động hóa quy trình tư vấn sản phẩm. - - - 
Giảm tải khối lượng công việc cho bộ phận chăm sóc khách hàng. 
Nâng cao trải nghiệm người dùng nhờ phản hồi nhanh, chính xác. 
Dễ dàng mở rộng thêm các intent và thực thể để phù hợp với nhiều ngữ cảnh khác 
nhau.