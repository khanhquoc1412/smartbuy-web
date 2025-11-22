# 💬 TÍCH HỢP CHATBOX UI VÀO WEBSITE

Hướng dẫn tích hợp chatbox AI vào website SmartBuy (Vue 3).

---

## 🎯 **CÁC LỰA CHỌN TÍCH HỢP**

### **Option 1: Dialogflow Messenger (Recommend ⭐)**
- Widget có sẵn từ Dialogflow
- Dễ tích hợp nhất (chỉ cần thêm script tag)
- Có đầy đủ tính năng: Rich response, chips, cards
- Responsive, mobile-friendly

### **Option 2: Custom Chatbox với Dialogflow ES API**
- Tự design UI chatbox
- Gọi trực tiếp Dialogflow API
- Linh hoạt nhất nhưng phức tạp hơn

### **Option 3: Kommunicate.io (Third-party)**
- Service chatbot platform có sẵn
- Tích hợp Dialogflow dễ dàng
- Có analytics, multi-channel

---

## 📦 **OPTION 1: DIALOGFLOW MESSENGER (KHUYẾN NGHỊ)**

### **Bước 1: Lấy Integration Code từ Dialogflow**

1. Vào [Dialogflow Console](https://dialogflow.cloud.google.com/)
2. Chọn Agent `SmartBuy-Assistant`
3. Click **Integrations** ở sidebar trái
4. Click **Dialogflow Messenger**
5. Click **ENABLE**
6. Copy đoạn code được generate

Code mẫu:
```html
<script src="https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1"></script>
<df-messenger
  intent="WELCOME"
  chat-title="SmartBuy Assistant"
  agent-id="YOUR-AGENT-ID"
  language-code="vi"
></df-messenger>
```

### **Bước 2: Tích hợp vào Vue 3 App**

Tạo file: `client/src/components/common/ChatboxWidget.vue`

```vue
<template>
  <div class="chatbox-widget">
    <!-- Dialogflow Messenger sẽ tự render tại đây -->
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  // Load Dialogflow Messenger script
  const script = document.createElement('script');
  script.src = 'https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1';
  script.async = true;
  document.head.appendChild(script);

  // Add Dialogflow Messenger element
  const dfMessenger = document.createElement('df-messenger');
  dfMessenger.setAttribute('intent', 'WELCOME');
  dfMessenger.setAttribute('chat-title', 'SmartBuy Assistant 🤖');
  dfMessenger.setAttribute('agent-id', 'YOUR-AGENT-ID'); // Thay bằng Agent ID thực
  dfMessenger.setAttribute('language-code', 'vi');
  
  // Thêm vào DOM
  document.body.appendChild(dfMessenger);
});
</script>

<style>
/* Custom styling cho Dialogflow Messenger */
df-messenger {
  --df-messenger-bot-message: #DC143C; /* Màu crimson */
  --df-messenger-button-titlebar-color: #DC143C;
  --df-messenger-chat-background-color: #fafafa;
  --df-messenger-font-color: #333;
  --df-messenger-send-icon: #DC143C;
  --df-messenger-user-message: #f0f0f0;
}
</style>
```

### **Bước 3: Thêm vào Layout**

Mở file: `client/src/layouts/default.vue`

```vue
<template>
  <div>
    <!-- Header, Nav, etc. -->
    <slot />
    
    <!-- Chatbox Widget -->
    <ChatboxWidget v-if="showChatbox" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ChatboxWidget from '@/components/common/ChatboxWidget.vue';

const showChatbox = ref(true); // Hiển thị chatbox
</script>
```

### **Bước 4: Tùy chỉnh CSS (Optional)**

Tạo file: `client/src/assets/scss/chatbox.scss`

```scss
/* Override Dialogflow Messenger styles */
df-messenger {
  z-index: 999;
  position: fixed;
  bottom: 20px;
  right: 20px;
  
  --df-messenger-bot-message: #DC143C;
  --df-messenger-button-titlebar-color: #DC143C;
  --df-messenger-button-titlebar-font-color: #fff;
  --df-messenger-chat-background-color: #ffffff;
  --df-messenger-font-color: #333333;
  --df-messenger-send-icon: #DC143C;
  --df-messenger-user-message: #f3f4f6;
  
  // Custom button
  --df-messenger-minimized-chat-close-icon-color: #DC143C;
  
  // Animation
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Hide on mobile (optional)
@media (max-width: 768px) {
  df-messenger {
    bottom: 10px;
    right: 10px;
  }
}
```

Import trong `main.ts`:
```typescript
import '@/assets/scss/chatbox.scss';
```

---

## 🎨 **OPTION 2: CUSTOM CHATBOX UI**

Nếu muốn tự design chatbox UI hoàn toàn:

### **Bước 1: Install Dialogflow Client**

```bash
cd client
npm install @google-cloud/dialogflow uuid
```

### **Bước 2: Tạo Chatbox Component**

File: `client/src/components/common/CustomChatbox.vue`

```vue
<template>
  <div class="custom-chatbox" v-if="isOpen">
    <!-- Header -->
    <div class="chatbox-header">
      <div class="chatbox-title">
        <span class="bot-icon">🤖</span>
        <span>SmartBuy Assistant</span>
      </div>
      <button @click="toggleChat" class="close-btn">✕</button>
    </div>

    <!-- Messages -->
    <div class="chatbox-messages" ref="messagesContainer">
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="['message', message.sender]"
      >
        <div class="message-avatar" v-if="message.sender === 'bot'">🤖</div>
        <div class="message-bubble">
          <div v-html="formatMessage(message.text)"></div>
          
          <!-- Rich Content (Cards) -->
          <div v-if="message.cards" class="message-cards">
            <div
              v-for="(card, idx) in message.cards"
              :key="idx"
              class="product-card"
            >
              <img :src="card.image" :alt="card.title" />
              <h4>{{ card.title }}</h4>
              <p class="price">{{ card.subtitle }}</p>
              <a :href="card.link" target="_blank" class="view-btn">Xem chi tiết</a>
            </div>
          </div>

          <!-- Suggestion Chips -->
          <div v-if="message.chips" class="message-chips">
            <button
              v-for="(chip, idx) in message.chips"
              :key="idx"
              @click="sendMessage(chip)"
              class="chip-btn"
            >
              {{ chip }}
            </button>
          </div>
        </div>
        <div class="message-avatar" v-if="message.sender === 'user'">👤</div>
      </div>

      <!-- Typing Indicator -->
      <div v-if="isTyping" class="message bot">
        <div class="message-avatar">🤖</div>
        <div class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>

    <!-- Input -->
    <div class="chatbox-input">
      <input
        v-model="userInput"
        @keyup.enter="sendMessage()"
        placeholder="Nhập câu hỏi..."
        :disabled="isTyping"
      />
      <button @click="sendMessage()" :disabled="!userInput || isTyping">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        </svg>
      </button>
    </div>
  </div>

  <!-- Floating Button -->
  <button v-else @click="toggleChat" class="chat-floating-btn">
    💬
  </button>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue';
import { detectIntent } from '@/api/chatbot';

const isOpen = ref(false);
const userInput = ref('');
const messages = ref([]);
const isTyping = ref(false);
const messagesContainer = ref(null);
const sessionId = ref('');

// Generate session ID
onMounted(() => {
  sessionId.value = `smartbuy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Welcome message
  messages.value.push({
    sender: 'bot',
    text: 'Xin chào! Tôi là trợ lý ảo SmartBuy. Tôi có thể giúp gì cho bạn? 😊',
    chips: ['Tìm sản phẩm', 'Kiểm tra đơn hàng', 'Xem khuyến mãi']
  });
});

const toggleChat = () => {
  isOpen.value = !isOpen.value;
};

const sendMessage = async (text = null) => {
  const messageText = text || userInput.value.trim();
  if (!messageText) return;

  // Add user message
  messages.value.push({
    sender: 'user',
    text: messageText
  });

  userInput.value = '';
  isTyping.value = true;

  // Scroll to bottom
  await nextTick();
  scrollToBottom();

  try {
    // Call backend webhook (hoặc gọi trực tiếp Dialogflow API)
    const response = await detectIntent(sessionId.value, messageText);

    isTyping.value = false;

    // Parse response
    const botMessage = {
      sender: 'bot',
      text: response.fulfillmentText || 'Xin lỗi, tôi không hiểu.',
      cards: response.cards || null,
      chips: response.chips || null
    };

    messages.value.push(botMessage);

    await nextTick();
    scrollToBottom();
  } catch (error) {
    isTyping.value = false;
    messages.value.push({
      sender: 'bot',
      text: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.'
    });
  }
};

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const formatMessage = (text) => {
  return text.replace(/\n/g, '<br>');
};
</script>

<style scoped lang="scss">
.custom-chatbox {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 380px;
  height: 600px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.chatbox-header {
  background: linear-gradient(135deg, #DC143C, #B00020);
  color: white;
  padding: 16px 20px;
  border-radius: 16px 16px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chatbox-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 16px;
}

.bot-icon {
  font-size: 24px;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
}

.chatbox-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f9fafb;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  display: flex;
  gap: 8px;
  
  &.user {
    flex-direction: row-reverse;
  }
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.message-bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 16px;
  line-height: 1.5;
  
  .user & {
    background: #DC143C;
    color: white;
    border-bottom-right-radius: 4px;
  }
  
  .bot & {
    background: white;
    color: #333;
    border-bottom-left-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
}

.message-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
}

.product-card {
  background: white;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  img {
    width: 100%;
    height: 120px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 8px;
  }
  
  h4 {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 4px;
  }
  
  .price {
    color: #DC143C;
    font-weight: 700;
    font-size: 16px;
    margin-bottom: 8px;
  }
  
  .view-btn {
    display: inline-block;
    background: #DC143C;
    color: white;
    padding: 8px 16px;
    border-radius: 8px;
    text-decoration: none;
    font-size: 14px;
    font-weight: 600;
    
    &:hover {
      background: #B00020;
    }
  }
}

.message-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.chip-btn {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #DC143C;
    color: white;
    border-color: #DC143C;
  }
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 12px 16px;
  
  span {
    width: 8px;
    height: 8px;
    background: #9ca3af;
    border-radius: 50%;
    animation: typing 1.4s infinite;
    
    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
}

.chatbox-input {
  display: flex;
  gap: 8px;
  padding: 16px 20px;
  background: white;
  border-radius: 0 0 16px 16px;
  border-top: 1px solid #e5e7eb;
  
  input {
    flex: 1;
    padding: 12px 16px;
    border: 1px solid #e5e7eb;
    border-radius: 24px;
    font-size: 14px;
    outline: none;
    
    &:focus {
      border-color: #DC143C;
    }
  }
  
  button {
    width: 48px;
    height: 48px;
    background: #DC143C;
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
    
    &:hover:not(:disabled) {
      background: #B00020;
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    svg {
      width: 24px;
      height: 24px;
    }
  }
}

.chat-floating-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #DC143C, #B00020);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 32px;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(220, 20, 60, 0.4);
  transition: transform 0.2s;
  z-index: 999;
  
  &:hover {
    transform: scale(1.1);
  }
}

@media (max-width: 768px) {
  .custom-chatbox {
    width: 100%;
    height: 100%;
    bottom: 0;
    right: 0;
    border-radius: 0;
  }
}
</style>
```

### **Bước 3: Tạo API Service**

File: `client/src/api/chatbot/index.ts`

```typescript
import axios from 'axios';

const CHATBOX_SERVICE_URL = import.meta.env.VITE_CHATBOX_SERVICE_URL || 'http://localhost:3007';

/**
 * Detect intent từ Dialogflow qua webhook
 */
export async function detectIntent(sessionId: string, text: string) {
  try {
    const response = await axios.post(`${CHATBOX_SERVICE_URL}/webhook/dialogflow`, {
      queryResult: {
        queryText: text,
        languageCode: 'vi',
        intent: {},
        parameters: {}
      },
      session: `projects/smartbuy-chatbot/agent/sessions/${sessionId}`
    });

    return {
      fulfillmentText: response.data.fulfillmentText,
      cards: parseRichContent(response.data.fulfillmentMessages),
      chips: parseSuggestionChips(response.data.fulfillmentMessages)
    };
  } catch (error) {
    console.error('Error detecting intent:', error);
    throw error;
  }
}

function parseRichContent(messages: any[]) {
  if (!messages) return null;
  
  const payload = messages.find(m => m.payload?.richContent);
  if (!payload) return null;
  
  const richContent = payload.payload.richContent[0];
  return richContent.filter((item: any) => item.type === 'info').map((item: any) => ({
    title: item.title,
    subtitle: item.subtitle,
    image: item.image?.src?.rawUrl,
    link: item.actionLink
  }));
}

function parseSuggestionChips(messages: any[]) {
  if (!messages) return null;
  
  const payload = messages.find(m => m.payload?.richContent);
  if (!payload) return null;
  
  const richContent = payload.payload.richContent[0];
  const chips = richContent.find((item: any) => item.type === 'chips');
  
  return chips?.options?.map((opt: any) => opt.text) || null;
}
```

---

## ✅ **TESTING**

### Test Dialogflow Messenger:
1. Chạy `npm run dev`
2. Mở website
3. Chatbox widget sẽ xuất hiện góc dưới bên phải
4. Click vào và test các câu hỏi

### Test Custom Chatbox:
1. Import component vào layout
2. Chạy backend chatbox-service
3. Test gửi tin nhắn

---

## 🎯 **NEXT STEPS**

1. ✅ Setup Dialogflow Project
2. ✅ Tạo Intents
3. ✅ Setup Webhook Backend
4. ✅ Tích hợp Chatbox UI
5. 🔜 Deploy lên production
6. 🔜 Monitor & Analytics

---

**🎉 DONE! Bạn đã có chatbot AI hoàn chỉnh!**
