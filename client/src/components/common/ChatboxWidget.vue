<template>
  <div class="chatbox-widget">
    <!-- Dialogflow Messenger sẽ tự động render tại đây -->
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue';

let dfMessenger = null;
let scriptElement = null;

onMounted(() => {
  // Load Dialogflow Messenger script
  scriptElement = document.createElement('script');
  scriptElement.src = 'https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1';
  scriptElement.async = true;
  document.head.appendChild(scriptElement);

  // Wait for script to load then create messenger element
  scriptElement.onload = () => {
    dfMessenger = document.createElement('df-messenger');
    
    // ⚠️ QUAN TRỌNG: Thay YOUR-AGENT-ID bằng Agent ID thực tế từ Dialogflow
    // Cách lấy Agent ID:
    // 1. Vào Dialogflow Console: https://dialogflow.cloud.google.com/
    // 2. Chọn Agent "SmartBuy-Assistant"
    // 3. Click Settings (⚙️) → General tab
    // 4. Copy "Agent ID" (dạng: abc123-xyz789-...)
    
    dfMessenger.setAttribute('intent', 'WELCOME');
    dfMessenger.setAttribute('chat-title', 'SmartBuy Assistant 🤖');
    dfMessenger.setAttribute('agent-id', '10078610-1040-4b0b-ba0d-b256881df896'); // ← Agent ID từ Dialogflow Messenger
    dfMessenger.setAttribute('language-code', 'vi');
    dfMessenger.setAttribute('chat-icon', 'https://cdn-icons-png.flaticon.com/512/4712/4712109.png');
    
    // Custom styling
    dfMessenger.style.cssText = `
      --df-messenger-bot-message: #DC143C;
      --df-messenger-button-titlebar-color: #DC143C;
      --df-messenger-send-icon: #DC143C;
      --df-messenger-user-message: #333333;
      z-index: 999;
    `;
    
    document.body.appendChild(dfMessenger);
    
    console.log('✅ Dialogflow Messenger loaded successfully');
  };

  scriptElement.onerror = () => {
    console.error('❌ Failed to load Dialogflow Messenger script');
  };
});

onBeforeUnmount(() => {
  // Clean up khi component bị destroy
  if (dfMessenger && document.body.contains(dfMessenger)) {
    document.body.removeChild(dfMessenger);
  }
  if (scriptElement && document.head.contains(scriptElement)) {
    document.head.removeChild(scriptElement);
  }
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
