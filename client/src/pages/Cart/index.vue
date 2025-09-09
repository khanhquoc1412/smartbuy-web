<template>
  <div class="app-cart tw-flex tw-flex-col tw-gap-5 tw-pb-4">
    <BreadScrumb name-page="Giỏ hàng" />
    <Container class="cart-section tw-flex tw-gap-8 tw-flex-col">
      <div class="cart-title">Giỏ hàng của bạn</div>
      <div class="cart-main tw-flex tw-flex-col tw-gap-5 tw-pb-20" v-if="carts.length > 0">
        <div class="cart-product tw-flex tw-justify-between tw-gap-3" v-for="cartItem in carts" :key="cartItem.id">
          <div class="cart-product__left tw-flex tw-gap-3">
            <div class="product-img">
              <img class="tw-w-full tw-h-full tw-object-cover" :src="cartItem.productVariant.product?.thumbUrl" alt="" />
            </div>
            <div class="product-desc tw-py-2 tw-flex tw-flex-col tw-justify-between">
              <router-link :to="`/product/${cartItem.productVariant.product?.slug}`"
                class="product-desc--name tw-cursor-pointer hover:tw-text-red tw-transition-all">
                {{ cartItem.productVariant.product?.name }}
              </router-link>
              <div class="product-desc--option tw-justify-self-start">
                <span>
                  {{ cartItem.productVariant.memory?.ram }}/{{
                    cartItem.productVariant.memory?.rom
                  }}
                </span>
                <span> - </span>
                <span>
                  {{ cartItem.productVariant.color?.name }}
                </span>
              </div>
              <div class="product-desc__price tw-flex tw-gap-2">
                <div class="product-desc__price--show">
                  {{ formatMoney(cartItem.productVariant.price) }}
                </div>
                <div class="product-desc__price--throw">
                  {{
                    formatMoney(getRealPrice(cartItem.productVariant.price,
                      cartItem.productVariant.product?.discountPercentage as number)) }}
                </div>
              </div>
            </div>
          </div>
          <div class="cart-product__right tw-flex tw-flex-col tw-justify-between tw-items-end">
            <div class="remove-btn hover:tw-opacity-75 tw-transition-all" @click="activeModal">
              <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M13.9999 4H10.6666V2.88666C10.6509 2.45988 10.4667 2.0567 10.1543 1.76553C9.84188 1.47435 9.42675 1.31893 8.99992 1.33333H6.99992C6.57309 1.31893 6.15796 1.47435 5.84554 1.76553C5.53312 2.0567 5.34889 2.45988 5.33325 2.88666V4H1.99992C1.82311 4 1.65354 4.07024 1.52851 4.19526C1.40349 4.32028 1.33325 4.48985 1.33325 4.66666C1.33325 4.84348 1.40349 5.01305 1.52851 5.13807C1.65354 5.26309 1.82311 5.33333 1.99992 5.33333H2.66659V12.6667C2.66659 13.1971 2.8773 13.7058 3.25237 14.0809C3.62744 14.456 4.13615 14.6667 4.66659 14.6667H11.3333C11.8637 14.6667 12.3724 14.456 12.7475 14.0809C13.1225 13.7058 13.3333 13.1971 13.3333 12.6667V5.33333H13.9999C14.1767 5.33333 14.3463 5.26309 14.4713 5.13807C14.5963 5.01305 14.6666 4.84348 14.6666 4.66666C14.6666 4.48985 14.5963 4.32028 14.4713 4.19526C14.3463 4.07024 14.1767 4 13.9999 4ZM6.66659 2.88666C6.66659 2.78 6.80659 2.66666 6.99992 2.66666H8.99992C9.19325 2.66666 9.33325 2.78 9.33325 2.88666V4H6.66659V2.88666ZM11.9999 12.6667C11.9999 12.8435 11.9297 13.013 11.8047 13.1381C11.6796 13.2631 11.5101 13.3333 11.3333 13.3333H4.66659C4.48977 13.3333 4.32021 13.2631 4.19518 13.1381C4.07016 13.013 3.99992 12.8435 3.99992 12.6667V5.33333H11.9999V12.6667Z">
                </path>
                <path
                  d="M5.99992 11.3333C6.17673 11.3333 6.3463 11.2631 6.47132 11.1381C6.59635 11.013 6.66658 10.8435 6.66658 10.6667V8C6.66658 7.82319 6.59635 7.65362 6.47132 7.5286C6.3463 7.40357 6.17673 7.33334 5.99992 7.33334C5.82311 7.33334 5.65354 7.40357 5.52851 7.5286C5.40349 7.65362 5.33325 7.82319 5.33325 8V10.6667C5.33325 10.8435 5.40349 11.013 5.52851 11.1381C5.65354 11.2631 5.82311 11.3333 5.99992 11.3333Z">
                </path>
                <path
                  d="M9.99992 11.3333C10.1767 11.3333 10.3463 11.2631 10.4713 11.1381C10.5963 11.013 10.6666 10.8435 10.6666 10.6667V8C10.6666 7.82319 10.5963 7.65362 10.4713 7.5286C10.3463 7.40357 10.1767 7.33334 9.99992 7.33334C9.82311 7.33334 9.65354 7.40357 9.52851 7.5286C9.40349 7.65362 9.33325 7.82319 9.33325 8V10.6667C9.33325 10.8435 9.40349 11.013 9.52851 11.1381C9.65354 11.2631 9.82311 11.3333 9.99992 11.3333Z">
                </path>
              </svg>
            </div>
            <div class="box-action tw-flex tw-gap-2 tw-items-center">
              <div :class="{ 'tw-opacity-60': cartItem.quantity === 1 }" class="minus tw-cursor-pointer"
                @click="decreaseQuantity(cartItem.id)">
                -
              </div>
              <div class="quantity">
                {{ cartItem.quantity }}
              </div>
              <div class="plus tw-cursor-pointer" @click="increaseQuantity(cartItem.id)">
                +
              </div>
            </div>
          </div>
          <Modal :content="`Xóa ${cartItem.productVariant.product?.name} khỏi giỏ hàng?`"
            :is-active="activeModalDeleteProductToCart" @updateIsActive="closeModal"
            @confirmAction="() => { removeFromCart(cartItem.id); closeModal(false); }" />
        </div>
      </div>
      <div class="cart-main tw-py-20 tw-flex tw-gap-3 tw-flex-col tw-items-center tw-justify-center" v-else>
        <div class="nothing-in-cart">
          <img src="https://cdn2.cellphones.com.vn/x,webp/media/cart/Cart-empty-v2.png" alt="" />
        </div>
        <div class="sub-text tw-text-center">
          <span>Giỏ hàng của bạn đang trống.</span>
          <br />
          <span>Hãy chọn thêm sản phẩm để mua sắm nhé</span>
        </div>
      </div>
      <div id="stickyBottomBar" class="tw-fixed">
        <div v-if="carts.length > 0" class="price-info tw-flex tw-justify-between">
          <div class="price-term tw-flex tw-flex-col tw-gap-2">
            <p class="tw-block">Tổng tiền sản phẩm:</p>
            <span class="tw-block">
              {{ formatMoney(getTotalAmount(carts)) }}
            </span>
          </div>
          <router-link to="/cart/checkout"
            class="btn-checkout tw-self-start tw-justify-self-start hover:tw-opacity-75 tw-transition-all tw-cursor-pointer">
            <span> Mua ngay </span>
            <span> ({{ totalItem }}) </span>
          </router-link>
        </div>
        <router-link v-else to="/" class="go-back tw-transition-all hover:tw-opacity-75">
          Quay lại trang chủ
        </router-link>
      </div>
    </Container>

  </div>
</template>

<script lang="ts" setup>
import Container from "@components/base/Container.vue";
import BreadScrumb from "@/components/base/BreadScrumb.vue";
import { useGetUserCarts } from "@/api/product/query";
import { useAuth } from "@/composables/useAuth";
import { formatMoney } from "@/utils/formatMoney";
import { getRealPrice } from "@/utils/product/getPriceAfterDiscount";
import { IUserCarts } from "@/types/cart.types";
import { useCart } from "@/composables/useCart";
import { getTotalAmount } from "@/utils/product/getTotalPrice";
import Modal from "@/components/common/Modal.vue";
const { userId } = useAuth();
const {
  carts,
  addToCart,
  isLoadingCart,
  totalItem,
  getUserCarts,
  increaseQuantity,
  removeFromCart,
  decreaseQuantity,
} = useCart();
const activeModalDeleteProductToCart = ref<boolean>(false)
const activeModal = () => {
  activeModalDeleteProductToCart.value = true
}
const closeModal = (value: boolean) => {
  activeModalDeleteProductToCart.value = value
}
onMounted(async () => {
  if (userId) {
    await getUserCarts(userId.value);
  }
});


</script>
<route lang="yaml">
  name: Giỏ hàng
  meta:
    layout: "cartLayout"
</route>
<style lang="scss">
.app-cart {
  min-height: calc(100vh - 80px);

  .cart-section {
    max-width: 600px;
  }

  .cart-title {
    font-size: 20px;
    font-weight: 600;
    padding: 10px;
    border-bottom: 1px solid $border-section;
  }

  .cart-main {
    .cart-product {
      background-color: $white;
      border: 1px solid $border-prd;
      border-radius: 5px;
      padding: 15px 10px;

      &__left {
        .product-img {
          height: 100px;
          width: 100px;
        }

        .product-desc {
          &--name {
            font-size: 15px;
            font-weight: 500;
          }

          &--option {
            font-size: 13px;
            color: $gray;
          }

          &__price {
            span {
              display: block;
              text-align: center;
            }

            &--show {
              font-size: 16px;
              font-weight: 600;
              color: $red;
            }

            &--throw {
              font-size: 14px;
              font-weight: 400;
              color: $gray;
              text-decoration: line-through;
            }
          }
        }
      }

      &__right {
        .remove-btn {
          cursor: pointer;

          svg {
            height: 20px;
            width: 20px;
            fill: $red;
          }
        }

        .box-action {
          font-weight: 500;
          font-size: 13px;

          .quantity {
            font-size: 13px;
            font-weight: 600;
          }

          div {
            display: block;
            padding: 5px 10px;
            border-radius: 5px;
            background-color: $bg-light-gray;

            &:hover {
              background-color: $gray-light;
            }
          }
        }
      }
    }
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

    .price-info {
      .price-term {
        p {
          font-size: 14px;
          font-weight: 500;
          color: $black;
        }

        span {
          font-size: 16px;
          font-weight: 500;
          color: $red;
        }
      }

      .btn-checkout {
        padding: 10px;
        background-color: $red;
        color: $white;
        border-radius: 5px;
      }
    }
  }
}
</style>