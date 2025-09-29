<template>
  <footer
    class="app-footer tw-bg-black tw-py-10 lg:tw-pt-20 lg:tw-pb-6 tw-text-gray-400"
  >
    <Container>
      <div
        class="footer-main tw-border-b tw-border-gray-500 tw-pb-3 tw-flex tw-flex-col tw-gap-5 lg:tw-flex-row tw-justify-between"
      >
        <div class="footer-col tw-flex tw-flex-col tw-gap-4">
          <router-link to="/" class="item tw-overflow-hidden tw-w-28">
            <img :src="logo" alt="" class="tw-w-full" />
          </router-link>
          <div class="item text">Giảm giá 10% lần đầu order</div>
          <form class="item tw-flex tw-flex-col tw-gap-2">
            <input
              type="text"
              placeholder="Nhập email của bạn"
              class="tw-border tw-p-2 tw-outline-none tw-border-gray-300 tw-rounded-sm tw-bg-white tw-text-black"
            />
            <input
              type="submit"
              class="tw-cursor-pointer tw-underline tw-self-start tw-p-2 tw-text-white tw-font-bold"
              value="Send"
            />
          </form>
        </div>
        <div class="footer-col tw-flex tw-flex-col tw-gap-4">
          <div class="item title tw-font-bold">Hỗ trợ</div>
          <div class="item text">x2-Giao Long - Giao Thuy - Nam Dinh.</div>
          <div class="item text">khanhquoc1412@gmail.com</div>
          <div class="item text">+8436-999-9999</div>
        </div>
        <div class="footer-col tw-flex tw-flex-col tw-gap-4">
          <div class="item title tw-font-bold">Tài khoản</div>
          <div class="item">Tài khoản của tôi</div>
          <div class="item">Login/Register</div>
          <div class="item">Giỏ hàng</div>
          <div class="item">Shop</div>
          <div class="item">Sản phẩm yêu thích</div>
        </div>
        <div class="footer-col tw-flex tw-flex-col tw-gap-4">
          <div class="item title tw-font-bold">Thông tin và chính sách</div>
          <div class="item">Privacy Policy</div>
          <div class="item">Terms of use</div>
          <div class="item">FQA</div>
          <div class="item">Contact</div>
        </div>
        <div class="footer-col tw-flex tw-flex-col tw-gap-4">
          <div class="item title tw-font-bold">Thông tin thanh toán</div>
          <div class="box-payment tw-flex tw-gap-3">
            <img :src="masterCardPng" class="tw-h-8" alt="" />
            <img :src="paypalPng" class="tw-h-8" alt="" />
            <img :src="visaPng" class="tw-h-8" alt="" />
          </div>
          <div class="item tw-font-bold">Liên hệ</div>
          <div class="box-social">Email: khanhquoc1412@gmail.com</div>
        </div>
      </div>
      <div class="footer-bottom tw-flex tw-justify-center tw-pt-2 tw-text-sm">
        <span> C. Copyright 2023 </span>
      </div>
    </Container>
  </footer>
</template>

<script lang="ts" setup>
import Container from "./Container.vue";
import logo from "@/assets/svg/logo7.svg";
import paypalPng from "@/assets/images/payments/paypal.png";
import visaPng from "@/assets/images/payments/visa.png";
import masterCardPng from "@/assets/images/payments/master_card.png";
</script>

<script lang="ts">
export default {
  name: "Footer",
};
</script>

<style lang="scss" scoped>
footer {
  .item {
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
    &:hover {
      color: $white;
    }
  }
  .item.title {
    cursor: auto;
    color: $white;
    font-size: 16px;
  }
  .item.text {
    cursor: auto;
    &:hover {
      color: unset;
    }
  }
}
</style>
