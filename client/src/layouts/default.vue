<template>
  <div class="default-layout">
    <Header></Header>
    <div class="app-main">
      <router-view></router-view>
    </div>
    <Footer></Footer>
    
    <!-- Chatbox AI Assistant -->
    <ChatboxWidget />
  </div>
</template>

<script lang="ts" setup>
import Container from "@/components/base/Container.vue";
import Header from "@/components/base/Header.vue"
import Footer from "@/components/base/Footer.vue";
import ChatboxWidget from "@/components/common/ChatboxWidget.vue";
</script>

<style lang="scss">
.default-layout {
  .app-main {
    padding-top: 80px;
    min-height: calc(100vh - 354.8px);

  }
}
</style>