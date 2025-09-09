<template>
  <div class="product-item tw-relative tw-flex tw-flex-col tw-gap-4 tw-w-full tw-h-auto tw-bg-white tw-rounded-sm">
    <router-link  :to="`/product/${path}`" class="product-top tw-block tw-overflow-hidden">
      <div class="product-img tw-overflow-hidden">
        <img :src="product.thumbUrl" alt="" class="hover:tw-scale-90 tw-transition-all" />
      </div>
    </router-link>
    <div class="product-disc-persentage tw-absolute tw-flex tw-items-center tw-justify-center tw-text-white" :style="{
      backgroundImage: 'url(' + bgPercent + ')'
    }">
      <p>
        Giảm {{ product.discountPercentage }}%
      </p>
    </div>
    <div class="product-bottom tw-flex tw-flex-col tw-gap-1.5">
      <router-link :to="`/product/${path}`" class="product-name tw-cursor-pointer hover:tw-text-red tw-transition-all tw-font-bold">{{
        product.name }}</router-link>
      <div class="product-price lg:tw-flex-row tw-flex-col lg:tw-gap-3 tw-flex tw-gap-0.5">
        <div class="disc-price tw-text-gray-500 tw-line-through">{{ formatMoney(product.basePrice) }}</div>
        <div class="base-price tw-text-red tw-font-medium">{{ formatMoney(product.basePrice) }}</div>
      </div>
      <div class="product-rating tw-flex tw-flex-row tw-gap-1 tw-items-center">
        <img :src="goldStar" alt="" class="tw-h-3" />
        <img :src="goldStar" alt="" class="tw-h-3" />
        <img :src="goldStar" alt="" class="tw-h-3" />
        <img :src="goldStar" alt="" class="tw-h-3" />
        <img :src="goldStar" alt="" class="tw-h-3" />
        <span class="tw-block tw-text-xs tw-text-gray-400"> (20) </span>
      </div>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import heartSmall from "@assets/svg/heart-small.svg";
import goldStar from "@assets/svg/gold-star.svg";
import eyeIcon from "@assets/svg/group.svg";
import bgPercent from "@assets/svg/bg-percent.svg"
import { IProduct } from "@/types/product.types";
import { formatMoney } from "@utils/formatMoney"

const { product, path } = defineProps<{ product: IProduct, path?: string }>();
</script>

<style scoped lang="scss">
.product-item {
  padding: 50px 16px 20px 16px;
  border: 1px solid $border-prd;

  .product-disc-persentage {
    background-repeat: no-repeat;
    background-position: center;
    position: absolute;
    width: 79px;
    height: 31px;
    left: -6px;
    top: 12px;
    font-size: 12px;
    font-weight: 600;
  }

  .product-price {
    .disc-price {
      font-size: 13px;
    }
  }
}
</style>