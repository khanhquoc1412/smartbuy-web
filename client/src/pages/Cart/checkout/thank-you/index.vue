<template>
    <div class="thank-you">
        <div class="box">
            <p>Cảm ơn bạn đã đặt hàng</p>
        </div>
        <div id="stickyBottomBar" class="tw-fixed">
            <router-link to="/" class="go-back tw-transition-all hover:tw-opacity-75">
                Quay lại trang chủ
            </router-link>
        </div>
    </div>
</template>
    
<script setup lang="ts">

</script>
<route lang="yaml">
    name: Thank you
    meta:
      layout: "cartLayout"
  </route>
<style scoped lang="scss">
.thank-you {
    min-height: calc(100vh - 80px);

    .box {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
    }

    #stickyBottomBar {
        padding: 10px;
        padding-bottom: 15px;
        background-color: #fff;
        border: 1px solid $border-section;
        max-width: 600px;
        width: 100%;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        z-index: 99;
        box-shadow: 0 -4px 20px -1px rgba(40, 124, 234, 0.15);
        left: 50%;
        transform: translateX(-50%);
        bottom: 0;

        .go-back {
            display: block;
            text-align: center;
            font-size: 14px;
            font-weight: 500;
            color: $white;
            // max-width: 600px;
            padding: 10px;
            background-color: $red;
            width: 100%;
            border-radius: 5px;
        }

    }
}
</style>