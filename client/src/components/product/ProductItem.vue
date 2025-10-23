<template>
  <div
    class="product-item tw-relative tw-flex tw-flex-col tw-gap-4 tw-w-full tw-h-auto tw-bg-white tw-rounded-sm"
  >
    <!-- <router-link
      :to="`/product/${path}`"
      class="product-top tw-block tw-overflow-hidden"
    > -->
    <!-- <router-link :to="`/product/${product.slug}`" class="product-link">
      <div class="product-img tw-h-40 tw-overflow-hidden">
        <img
          :src="product.thumbUrl"
          alt=""
          class="hover:tw-scale-90 tw-transition-all"
        />
      </div>
    </router-link> -->
    <router-link :to="linkTo" class="product-link">
      <div class="product-img tw-h-40 tw-overflow-hidden">
        <img
          :src="mainImage?.imageUrl || product.thumbUrl"
          alt=""
          class="hover:tw-scale-90 tw-transition-all"
        />
      </div>
    </router-link>

    <div
      class="product-disc-persentage tw-absolute tw-flex tw-items-center tw-justify-center tw-text-white"
      :style="{
        backgroundImage: 'url(' + bgPercent + ')',
      }"
    >
      <p>Giảm {{ product.discountPercentage }}%</p>
    </div>
    <div class="product-bottom tw-flex tw-flex-col tw-gap-1.5">
      <!-- <router-link
        :to="`/product/${path}`"
        class="product-name tw-cursor-pointer hover:tw-text-red tw-transition-all tw-font-bold"
        >{{ product.name }}</router-link
      > -->
      <router-link
        :to="linkTo"
        class="product-name tw-cursor-pointer hover:tw-text-red tw-transition-all tw-font-bold"
      >
        {{ productFullName }}
      </router-link>
      <div
        class="product-price lg:tw-flex-row tw-flex-col lg:tw-gap-3 tw-flex tw-gap-0.5"
      >
        <!-- Giá gốc (gạch ngang) -->
        <div
          class="disc-price tw-text-gray-500 tw-line-through tw-whitespace-nowrap tw-text-sm"
        >
          {{ formatMoney(product.basePrice) }}
        </div>

        <!-- Giá sau giảm -->
        <div
          class="base-price tw-text-red tw-font-medium tw-whitespace-nowrap tw-overflow-hidden tw-text-sm"
        >
          {{
            formatMoney(
              product.basePrice * (1 - (product.discountPercentage || 0) / 100)
            )
          }}
        </div>
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
import bgPercent from "@assets/svg/bg-percent.svg";
import { IProduct } from "@/types/product.types";
import { formatMoney } from "@utils/formatMoney";

// const { product, path } = defineProps<{ product: IProduct; path?: string }>();
const { product, path } = defineProps<{
  product: IProduct & Record<string, any>;
  path?: string;
}>();
// const linkTo = computed(() => {
//   const q: Record<string, any> = {};
//   if (variantId.value !== undefined) q.variantId = String(variantId.value);
//   if (colorId.value !== undefined) q.colorId = String(colorId.value);
//   if (memoryId.value !== undefined) q.memoryId = String(memoryId.value);
//   return { path: `/product/${product.slug}`, query: q };
// });

const linkTo = computed(() => {
  const variant = defaultVariant.value;
  return {
    path: `/product/${product.slug}`,
    query: {
      colorId: variant?.color?.id ?? variant?.color?._id,
      memoryId: variant?.memory?.id ?? variant?.memory?._id,
      variantId: variant?.id ?? variant?._id
    }
  };
});
const productFullName = computed(() => {
  let name = product.name || "";
  const variant = defaultVariant.value;
  if (variant?.memory?.ram && variant?.memory?.rom) {
    name += ` ${variant.memory.ram}GB/${variant.memory.rom}GB`;
  }
  if (variant?.color?.name) {
    name += ` ${variant.color.name}`;
  }
  return name;
});
// lấy variant mặc định nếu product.productVariants có
// const defaultVariant = computed(() =>
//   product?.productVariants && product.productVariants.length
//     ? product.productVariants[0]
//     : null
// );
const mainImage = computed(() =>
  product.images?.find(img => img.imageUrl === product.thumbUrl) || product.images?.[0]
);

const defaultVariant = computed(() => {
  if (mainImage.value && product.productVariants) {
    const imgColorId = mainImage.value.colorId;
    // Tìm variant có colorId trùng với ảnh chính
    return product.productVariants.find(
      v => String(v.color?.id ?? v.color?._id) === String(imgColorId)
    ) || product.productVariants[0];
  }
  return product.productVariants?.[0] ?? null;
});



// xác định giá trị variantId/colorId/memoryId an toàn (ưu tiên trường trên product nếu tồn tại, sau đó fallback variant[0])
const variantId = computed(() => {
  return (
    product.variantId ??
    defaultVariant.value?._id ??
    defaultVariant.value?.id ??
    undefined
  );
});
const colorId = computed(() => {
  return (
    product.color?.id ??
    defaultVariant.value?.color?.id ??
    defaultVariant.value?.color?._id ??
    undefined
  );
});
const memoryId = computed(() => {
  return (
    product.memory?.id ??
    defaultVariant.value?.memory?.id ??
    defaultVariant.value?.memory?._id ??
    undefined
  );
});

// build to object, chỉ thêm query khi tồn tại giá trị

</script>

<style scoped lang="scss">
// .product-item {
//   padding: 50px 16px 20px 16px;
//   border: 1px solid $border-prd;

//   .product-disc-persentage {
//     background-repeat: no-repeat;
//     background-position: center;
//     position: absolute;
//     width: 79px;
//     height: 31px;
//     left: -6px;
//     top: 12px;
//     font-size: 12px;
//     font-weight: 600;
//   }

//   .product-price {
//     .disc-price {
//       font-size: 13px;
//     }
//   }
// }
.product-item {
  padding: 50px 16px 20px 16px;
  border: 1px solid $border-prd;
  position: relative;

  .product-top {
    z-index: 1; // đảm bảo vùng link phía trên
  }

  .product-disc-persentage {
    z-index: 2;
    pointer-events: none; // không chặn click
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
