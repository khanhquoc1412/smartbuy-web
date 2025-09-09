<template>
    <div class="account-notification">
        <h1>Không có thông báo nào</h1>
    </div>
</template>
  
<script lang="ts" setup>


</script>
<route lang="yaml">
    name: Thông báo
    meta:
      requiresAuth: true
      layout: "accountLayout"
  </route>
<style lang="scss">
.account-notification {
    h1 {
        font-size: 13px;
        font-weight: 500;
        font-style: italic;
    }
}
</style>