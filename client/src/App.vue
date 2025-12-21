<template>
  <div class="my-app">
    <router-view></router-view>
    <loading-page />
    <ToastContainer />
    <ChatboxWidget />
  </div>
</template>
  
<script lang="ts" setup>
import LoadingPage from "@components/base/LoadingPage.vue";
import ToastContainer from "@components/common/ToastContainer.vue";
import ChatboxWidget from "@components/common/ChatboxWidget.vue";

</script>

<style scoped lang="scss">
.my-app {
  background-color: #f4f6f8;
}
</style>
