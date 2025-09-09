<template>
  <div class="app-checkout tw-flex tw-flex-col tw-gap-5 tw-pb-4">
    <BreadScrumb name-page="Thông tin thanh toán" :sub-navs="[{ name: 'Giỏ hàng', path: '/cart' }]" />

    <Container class="checkout-section tw-flex tw-gap-4 tw-flex-col">
      <div class="title">Thông tin</div>
      <div v-if="userId" class="list-product tw-flex tw-justify-between tw-gap-3" v-for="cartItem in carts">
        <div class="list-product__left tw-flex tw-gap-4 ">
          <div class="product-img">
            <img class="tw-w-full tw-h-full tw-object-cover" :src="cartItem.productVariant.product?.thumbUrl" alt="" />
          </div>
          <div class="product-desc tw-py-2 tw-flex tw-flex-col tw-justify-between">
            <router-link :to="`/product/${cartItem.productVariant.product?.slug}`"
              class="product-desc--name tw-cursor-pointer hover:tw-text-red tw-transition-all">
              {{ cartItem.productVariant.product?.name }}
              {{ cartItem.productVariant.memory?.ram }}
              /
              {{ cartItem.productVariant.memory?.rom }}
              -
              {{ cartItem.productVariant.color?.name }}
            </router-link>
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
        <div class="list-product__right tw-flex tw-flex-col tw-justify-between tw-items-end">
          <div class="product-quantity tw-flex tw-gap-1">
            <span class="product-quantity__title">
              Số lượng:
            </span>
            <span class="product-quantity__number">
              {{ cartItem.quantity }}
            </span>
          </div>
        </div>
      </div>
      <div v-else class="list-product tw-flex tw-justify-between tw-gap-3">
        <div v-if="productGuest" class="list-product__left tw-flex tw-gap-4 ">
          <div class="product-img">
            <img class="tw-w-full tw-h-full tw-object-cover" :src="productGuest.product?.thumbUrl" alt="" />
          </div>
          <div class="product-desc tw-py-2 tw-flex tw-flex-col tw-justify-between">
            <router-link :to="`/product/${productGuest.product?.slug}`"
              class="product-desc--name tw-cursor-pointer hover:tw-text-red tw-transition-all">
              {{ productGuest.product?.name }}
              {{ productGuest.memory?.ram }}
              /
              {{ productGuest.memory?.rom }}
              -
              {{ productGuest.color?.name }}
            </router-link>
            <div class="product-desc__price tw-flex tw-gap-2">
              <div class="product-desc__price--show">
                {{ formatMoney(productGuest.price as number) }}
              </div>
              <div class="product-desc__price--throw">
                {{
                  formatMoney(getRealPrice(productGuest.price as number,
                    productGuest.product?.discountPercentage as number)) }}
              </div>
            </div>
          </div>
        </div>
        <div class="list-product__right tw-flex tw-flex-col tw-justify-between tw-items-end">
          <div class="product-quantity tw-flex tw-gap-1">
            <span class="product-quantity__title">
              Số lượng:
            </span>
            <span class="product-quantity__number">
              1
            </span>
          </div>
        </div>
      </div>
      <div class="box-customer tw-flex tw-flex-col tw-gap-2">
        <div class="box-customer__title tw-uppercase">
          Thông tin khách hàng
        </div>
        <div class="box-customer__wrapper tw-flex tw-gap-4 tw-flex-col">
          <div class="box-customer__input">
            <MyInput id="name" name="name" placeholder="Nhập họ tên" v-model="baseInfor.userName" />
          </div>
          <div class="box-customer__input">
            <MyInput id="phone" name="phone" placeholder="Số điện thoại" v-model="baseInfor.phoneNumber" />
          </div>
          <div class="box-customer__input">
            <MyInput placeholder="Email: example@gmail.com" />
          </div>
        </div>
      </div>
      <div class="box-address tw-flex tw-flex-col tw-gap-2">
        <div class="box-address__title tw-uppercase">
          Thông tin nhận hàng
        </div>
        <div class="box-address__wrapper">
          <div class="box-address__select">
            <SelectAddress title="Chọn Tỉnh/Thành phố" :type="1" v-model="address.province" :items="provinces" />
          </div>
          <div class="box-address__select ">
            <SelectAddress title="Chọn Quận/Huyện" :type="2" v-model="address.district" :items="districts" />
          </div>
          <div class="box-address__select">
            <SelectAddress title="Chọn Xã Phường" :type="3" v-model="address.ward" :items="wards" />
          </div>
          <div class="box-address__input">
            <MyInput class="" placeholder="Số nhà tên đường" v-model="address.houseNumber" />
          </div>
        </div>
      </div>
      <div class="box-payment tw-flex tw-flex-col tw-gap-2">
        <div class="box-payment__title tw-uppercase">
          Thanh toán
        </div>
        <div class="box-payment__wrapper">
          <div class="box-input coupon tw-flex tw-gap-5">
            <MyInput id="name" placeholder="Mã giảm giá" class="tw-flex-1" />
            <button class="hover:tw-opacity-75 tw-transition-all">
              Áp dụng
            </button>
          </div>
        </div>
        <div class="payment-option tw-bg-white tw-p-2 tw-mt-2 tw-rounded-sm tw-flex tw-gap-2 tw-flex-col">
          <div class="tw-flex tw-items-center tw-gap-2">
            <input id="tw-default-radio-1" type="radio" v-model="paymentSelected" :value="2" name="tw-default-radio"
              class="tw-w-4 tw-h-4 tw-text-blue-600 tw-bg-gray-100 tw-border-gray-300 tw-focus:tw-ring-blue-500 dark:tw-focus:tw-ring-blue-600 dark:tw-ring-offset-gray-800 tw-focus:tw-ring-2 dark:tw-bg-gray-700 dark:tw-border-gray-600" />
            <img class="tw-h-10 tw-w-10" :src="vnpayLogo" alt="">
            <label for="tw-default-radio-1" class="tw-ms-2 tw-text-sm tw-font-medium tw-text-gray-900">VNPAY</label>
          </div>
          <div class="tw-flex tw-items-center tw-gap-2">
            <input checked id="tw-default-radio-2" type="radio" v-model="paymentSelected" :value="1"
              name="tw-default-radio"
              class="tw-w-4 tw-h-4 tw-text-blue-600 tw-bg-gray-100 tw-border-gray-300 tw-focus:tw-ring-blue-500 dark:tw-focus:tw-ring-blue-600 dark:tw-ring-offset-gray-800 tw-focus:tw-ring-2 dark:tw-bg-gray-700 dark:tw-border-gray-600" />
            <img class="tw-h-10 tw-w-10" :src="shippingLogo" alt="">
            <label for="tw-default-radio-2" class="tw-ms-2 tw-text-sm tw-font-medium tw-text-gray-900">
              Thanh toán khi nhận hàng
            </label>
          </div>
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
          <button @click="handleOrder"
            class="btn-checkout tw-self-start tw-justify-self-start hover:tw-opacity-75 tw-transition-all tw-cursor-pointer">
            <span> Đặt hàng </span>
          </button>
        </div>
        <div v-if="productGuest" class="price-info tw-flex tw-justify-between">
          <div class="price-term tw-flex tw-flex-col tw-gap-2">
            <p class="tw-block">Tổng tiền sản phẩm:</p>
            <span class="tw-block">
              {{ formatMoney(productGuest.price as number) }}
            </span>
          </div>
          <button @click="handleOrderGuest"
            class="btn-checkout tw-self-start tw-justify-self-start hover:tw-opacity-75 tw-transition-all tw-cursor-pointer">
            <span> Đặt hàng </span>
          </button>
        </div>
      </div>
    </Container>
  </div>
</template>
  
<script lang="ts" setup>
import Container from "@/components/base/Container.vue";
import BreadScrumb from "@/components/base/BreadScrumb.vue";
import MyInput from "@components/common/MyInput/index.vue";
import SelectAddress from "@/components/common/SelectAddress.vue";
import { _axios, } from "@plugins/axios/axios";
import vnpayLogo from "@/assets/svg/payments/vnpay-seeklogo.svg"
import shippingLogo from "@/assets/svg/payments/shipping_logo.svg"
import {
  IAddressForm,
  IAddress,
  IDistrict,
  IProvince,
  IWard,
} from "@/types/address.type";
import {
  IOrderInfor, IOrderInforGuest
} from "@/types/order.type"
import { useCart } from "@/composables/useCart";
import { useGetProductVariant } from "@/api/product/query";
import { useOrder } from "@/composables/useOrder";
import { useAuth } from "@/composables/useAuth"
import { ICart } from "@/types/cart.types";
import { formatMoney } from "@/utils/formatMoney";
import { getRealPrice } from "@/utils/product/getPriceAfterDiscount";
import { getTotalAmount } from "@/utils/product/getTotalPrice";
import { IProductVariant } from "@/types/product.types";
import { PRODUCT_GUEST } from "@/utils/constants";
const host = "https://vapi.vnappmob.com/api/";
// define inteface
interface IBaseInfor {
  userName: string,
  phoneNumber: string
}

//get info carts
const { userId } = useAuth()
const {
  orderProduct,
  orderData,
  orderError,
  isOrderLoading,
  orderProductGuest,
  orderGuestData,
  orderGuestError,
  isOrderGuestLoading
} = useOrder()

const { getUserCarts, carts } = useCart()

//get info provinces
const provinces = ref<IProvince[]>([]);
const districts = ref<IDistrict[]>([]);
const wards = ref<IWard[]>([]);
const address = ref<IAddressForm>({
  province: null,
  district: null,
  ward: null,
  houseNumber: null,
});
const { data: productGuest, isFetching } = useGetProductVariant(localStorage.getItem(PRODUCT_GUEST) as string)

onMounted(async () => {
  if (userId) {
    await getUserCarts(userId.value);
  }
});

const baseInfor = ref<IBaseInfor>({
  userName: '',
  phoneNumber: '',
})

const paymentSelected = ref<number>(1)
const handleOrder = async () => {
  if (Object.values(address.value).includes(null) ||
    !baseInfor.value.userName ||
    !baseInfor.value.phoneNumber ||
    carts.value.length === 0
  ) {
    console.log("Trống")
    return
  }
  const orderData = ref<IOrderInfor>({
    address: {
      province: address.value.province?.province_name as string,
      district: address.value.district?.district_name as string,
      ward: address.value.ward?.ward_name as string,
      houseNumber: address.value.houseNumber as string
    },
    carts: carts.value,
    userName: baseInfor.value.userName,
    phoneNumber: baseInfor.value.phoneNumber,
    paymentId: paymentSelected.value
  })
  console.log(orderData.value)
  await orderProduct(orderData.value)

}
const handleOrderGuest = async () => {
  if (Object.values(address.value).includes(null) ||
    !baseInfor.value.userName ||
    !baseInfor.value.phoneNumber
  ) {
    console.log("Trống")
    return
  }
  const orderData = ref<IOrderInforGuest>({
    address: {
      province: address.value.province?.province_name as string,
      district: address.value.district?.district_name as string,
      ward: address.value.ward?.ward_name as string,
      houseNumber: address.value.houseNumber as string
    },
    productVariantId: localStorage.getItem(PRODUCT_GUEST) as string,
    userName: baseInfor.value.userName,
    phoneNumber: baseInfor.value.phoneNumber,
    paymentId: paymentSelected.value
  })
  console.log(orderData.value)
  await orderProductGuest(orderData.value)

}
const getProvinceAddress = async () => {
  _axios.get(host + "province").then((res) => {
    provinces.value = res.data.results
  }).catch(error => {
    console.log(error)
  })
}
const getDistrictAddress = async (provinceId: string | number) => {
  _axios.get(host + `province/district/${provinceId}`).then((res) => {
    districts.value = res.data.results
  }).catch(error => {
    console.log(error)
  })
}
const getWardAddress = async (districtId: string | number) => {
  _axios.get(host + `province/ward/${districtId}`).then((res) => {
    wards.value = res.data.results
  }).catch(error => {
    console.log(error)
  })
}
onMounted(async () => {
  await getProvinceAddress()
  console.log(provinces.value)
});
watch(
  () => address.value.province,
  (selectedCity) => {
    console.log(selectedCity);
    districts.value = [];
    address.value.district = null;
    wards.value = [];
    address.value.ward = null;
    if (selectedCity) {
      getDistrictAddress(selectedCity.province_id)
    }
  }
);
watch(
  () => address.value.district,
  (selectedDistrict) => {
    wards.value = [];
    address.value.ward = null;
    if (selectedDistrict) {
      getWardAddress(selectedDistrict.district_id)
    }
  }
);
</script>

<route lang="yaml">
    name: Checkout
    meta:
      layout: "cartLayout"
  </route>
<style lang="scss">
.app-checkout {
  min-height: calc(100vh - 80px);
  padding-bottom: 80px;

  .checkout-section {
    padding-bottom: 40px;
    max-width: 600px;

    //test

    .title {
      font-size: 20px;
      font-weight: 600;
      padding: 10px;
      border-bottom: 1px solid $border-section;
    }

    .list-product {
      background-color: $white;
      border: 1px solid $border-prd;
      border-radius: 5px;
      padding: 10px 10px;

      &__left {
        .product-img {
          height: 65px;
          width: 65px;
        }

        .product-desc {
          &--name {
            font-size: 14px;
            font-weight: 400;
          }

          &--option {
            font-size: 12px;
            color: $gray;
          }

          &__price {
            span {
              display: block;
              text-align: center;
            }

            &--show {
              font-size: 14px;
              font-weight: 500;
              color: $red;
            }

            &--throw {
              font-size: 13px;
              font-weight: 400;
              color: $gray;
              text-decoration: line-through;
            }
          }
        }
      }

      &__right {
        .product-quantity {
          &__title {
            font-size: 14px;
          }

          &__number {
            color: red;
            font-size: 15px;
            font-weight: 500;
          }
        }
      }
    }

    .box-customer {
      &__title {
        font-size: 14px;
        font-weight: 400;
      }

      &__wrapper {
        padding: 15px;
        background-color: $white;
        border: 1px solid $border-section;
        border-radius: 4px;

        .box-customer__input {}
      }
    }

    .box-address {
      &__title {
        font-size: 14px;
        font-weight: 400;
      }

      &__wrapper {
        padding: 10px;
        background-color: $white;
        border: 1px solid $border-section;
        border-radius: 4px;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;

        .box-address__select {
          button {
            height: 43px;
          }
        }

        .box-address__input {
          position: relative;

          input {
            position: absolute;
            bottom: 0;
          }
        }
      }
    }

    .box-payment {
      &__title {
        font-size: 14px;
        font-weight: 600;
        color: $red;
      }

      &__wrapper {
        .box-input {
          button {
            padding: 8px 12px;
            border-radius: 5px;
            color: $white;
            background-color: $red;
            font-weight: 500;
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

    //test

    .checkout-main {
      gap: 20px;

      .info-shipment {
        .title {
          font-size: 16px;
          font-weight: 600;
        }

        .box-info {
          display: flex;
          flex-direction: column;
          gap: 16px;

          &>div {
            display: flex;
            flex-direction: column;
            gap: 10px;

            label {
              font-weight: 500;
              font-size: 13px;
            }
          }
        }

        .coupon {
          margin-top: 15px;
          padding-top: 10px;
          border-top: 1.5px solid $border-section;

          .coupon-title {
            font-weight: 500;
          }

          .box-input {
            button {
              padding: 8px 12px;
              border-radius: 5px;
              color: $white;
              background-color: $red;
              font-weight: 500;
            }
          }
        }
      }

      .info-payment {
        background-color: $white;
        padding: 10px;
        border-radius: 5px;

        table {
          thead {
            font-size: 13px;
          }

          tbody {
            font-size: 13px;
          }
        }

        .total-price,
        .discount-price,
        .shipment-price,
        .total-payment {
          display: flex;
          justify-content: space-between;
        }

        .total-price,
        .discount-price,
        .shipment-price {
          font-size: 13px;
          font-weight: 500;
          padding: 4px 15px;
        }

        .total-payment {
          font-size: 15px;
          font-weight: 500;
          line-height: 125%;
          border-top: 1px solid $border-section;
          padding: 10px 15px;

          span:last-child {
            font-weight: 600;
            color: $red;
          }
        }

        .payment-option {
          padding: 10px 15px;

          .title {
            font-size: 14px;
            font-weight: 500;
          }
        }

        .btn-order {
          button {
            padding: 10px 15px;
            color: $white;
            background-color: $azure;
            border-radius: 5px;
            transition: all 1s cubic-bezier(0.075, 0.82, 0.165, 1);
            font-weight: 500;

            &:hover {
              opacity: 0.75;
            }
          }
        }
      }
    }
  }
}
</style>