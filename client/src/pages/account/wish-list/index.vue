<template>
    <div class="account-wishList">
        <h1 class="wishList-title">
            Sản phẩm yêu thích
        </h1>

    </div>
</template>
  
<script lang="ts" setup>


</script>
<route lang="yaml">
    name: Sản phẩm yêu thích
    meta:
      requiresAuth: true
      layout: "accountLayout"
  </route>
<style lang="scss">
.account-wishList {
    .wishList-title {
        font-size: 14px;
        font-weight: 600;
        line-height: 120%;
        text-transform: uppercase;
        padding-bottom: 20px;
        border-bottom: 1px solid $border-section;
    }
}
</style>