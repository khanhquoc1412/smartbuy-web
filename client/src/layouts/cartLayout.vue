<template>
    <div class="cart-layout">
        <Header></Header>
        <div class="app-main">
            <router-view></router-view>
        </div>
        <!-- <Footer></Footer> -->
    </div>
</template>
  
<script lang="ts" setup>
import Container from "@/components/base/Container.vue";
import Header from "@/components/base/Header.vue"
import Footer from "@/components/base/Footer.vue";
</script>
  
<style lang="scss">
.cart-layout {

    .app-main {
        padding-top: 80px;
        min-height: calc(100vh - 80px);
    }
}
</style>