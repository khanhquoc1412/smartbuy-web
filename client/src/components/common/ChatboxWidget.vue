<template>
  <!-- Component không cần render gì vì df-messenger được thêm vào body -->
</template>

<script setup>
import { onMounted, onBeforeUnmount, watch } from 'vue';
import { storeToRefs } from 'pinia';
import useAuthStore from '@/store/auth';

const { loggedIn: isLoggedIn } = storeToRefs(useAuthStore());

let dfMessenger = null;
let scriptElement = null;
let scriptLoaded = false;

// Function để tạo hoặc lấy lại Dialogflow Messenger
const createMessenger = () => {
  // Kiểm tra xem đã có df-messenger trong DOM chưa
  const existing = document.querySelector('df-messenger');
  if (existing) {
    console.log('♻️ Reusing existing Dialogflow Messenger');
    dfMessenger = existing;
    dfMessenger.style.display = 'block';
    return;
  }
  
  if (dfMessenger) return; // Tránh tạo duplicate
  
  if (!scriptLoaded) {
    console.log('⏳ Waiting for script to load...');
    return;
  }
  
  dfMessenger = document.createElement('df-messenger');
  
  dfMessenger.setAttribute('intent', 'WELCOME');
  dfMessenger.setAttribute('chat-title', 'SmartBuy Assistant 🤖');
  dfMessenger.setAttribute('agent-id', '10078610-1040-4b0b-ba0d-b256881df896');
  dfMessenger.setAttribute('language-code', 'vi');
  dfMessenger.setAttribute('chat-icon', 'https://cdn-icons-png.flaticon.com/128/8277/8277577.png');
  
  // Custom styling
  dfMessenger.style.cssText = `
    --df-messenger-bot-message: #DC143C;
    --df-messenger-button-titlebar-color: #DC143C;
    --df-messenger-send-icon: #DC143C;
    --df-messenger-user-message: #333333;
    z-index: 1000;
  `;
  
  document.body.appendChild(dfMessenger);
  console.log('✅ Dialogflow Messenger created');
};

// Function để ẩn/hiện Dialogflow Messenger
const toggleMessenger = (show) => {
  if (dfMessenger) {
    dfMessenger.style.display = show ? 'block' : 'none';
    console.log(show ? '👁️ Chatbox shown' : '🙈 Chatbox hidden');
  }
};

onMounted(() => {
  // Kiểm tra xem script đã load chưa
  const existingScript = document.querySelector('script[src*="dialogflow-console"]');
  if (existingScript) {
    console.log('♻️ Script already loaded');
    scriptLoaded = true;
    scriptElement = existingScript;
    if (isLoggedIn.value) {
      createMessenger();
    }
    return;
  }
  
  // Load Dialogflow Messenger script
  scriptElement = document.createElement('script');
  scriptElement.src = 'https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1';
  scriptElement.async = true;
  document.head.appendChild(scriptElement);

  scriptElement.onload = () => {
    console.log('✅ Dialogflow Messenger script loaded');
    scriptLoaded = true;
    
    // Chỉ tạo messenger nếu đã đăng nhập
    if (isLoggedIn.value) {
      createMessenger();
    }
  };

  scriptElement.onerror = () => {
    console.error('❌ Failed to load Dialogflow Messenger script');
  };
});

// Watch trạng thái đăng nhập 
watch(isLoggedIn, (newValue) => {
  if (newValue) {
    // Đăng nhập → Hiển thị chatbox
    if (!dfMessenger && scriptLoaded) {
      createMessenger();
    } else if (dfMessenger) {
      toggleMessenger(true);
    }
  } else {
    // Đăng xuất → Ẩn chatbox (không xóa để giữ lịch sử)
    toggleMessenger(false);
  }
});

onBeforeUnmount(() => {
  // Không xóa messenger để giữ lịch sử chat khi chuyển route
  // Script cũng giữ lại để tránh load lại nhiều lần
});
</script>

<style scoped>
.chatbox-widget {
  /* Component này không cần style vì Dialogflow Messenger tự render */
}
</style>

<style>
/* Global styles cho Dialogflow Messenger */
df-messenger {
  --df-messenger-bot-message: #DC143C;
  --df-messenger-button-titlebar-color: #DC143C;
  --df-messenger-send-icon: #DC143C;
  --df-messenger-user-message: #333333;
  --df-messenger-font-color: white;
  --df-messenger-chat-background-color: #fafafa;
  --df-messenger-message-bot-background-color: #DC143C;
  --df-messenger-message-user-background-color: #333333;
  z-index: 999;
}

/* Custom position cho chatbox */
df-messenger {
  position: fixed;
  bottom: 20px;
  right: 20px;
}

/* Responsive cho mobile */
@media (max-width: 768px) {
  df-messenger {
    bottom: 10px;
    right: 10px;
  }
}
</style>
