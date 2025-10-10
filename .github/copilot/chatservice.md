# 💬 chat-service – Chatbot tư vấn sản phẩm

## Chức năng
- Chatbot hỗ trợ tìm kiếm & tư vấn sản phẩm.
- Sử dụng socket.io để chat thời gian thực.

## Cấu trúc
chatservice/
├── config/socket.js
├── controllers/chat.controller.js
├── models/chat.model.js
├── routes/chat.routes.js
├── services/chatbot.service.js
└── index.js
└── package.json

## Ghi chú
- Chatbot có thể gọi API của `product-service` để gợi ý.
- Giao tiếp realtime với client qua WebSocket.
