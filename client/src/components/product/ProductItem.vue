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
          :src="displayImage"
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
const props = defineProps<{
  product: IProduct & Record<string, any>;
  path?: string;
  variant?: any;
}>();
const product = props.product;
// const linkTo = computed(() => {
//   const q: Record<string, any> = {};
//   if (variantId.value !== undefined) q.variantId = String(variantId.value);
//   if (colorId.value !== undefined) q.colorId = String(colorId.value);
//   if (memoryId.value !== undefined) q.memoryId = String(memoryId.value);
//   return { path: `/product/${product.slug}`, query: q };
// });

const linkTo = computed(() => {
  const v = defaultVariant.value;
  const q: Record<string, string> = {};
  if (v) {
    const vid = v.id ?? v._id;
    if (vid !== undefined) q.variantId = String(vid);
    const cid = v.color?.id ?? v.color?._id ?? v.color;
    if (cid !== undefined) q.colorId = String(cid);
    const mid = v.memory?.id ?? v.memory?._id ?? v.memory;
    if (mid !== undefined) q.memoryId = String(mid);
  }
  return { path: `/product/${product.slug}`, query: q };
});
// const productFullName = computed(() => {
//   let name = product?.name ?? "";
//   // Ưu tiên props.variant nếu có
//   const v = props.variant ?? defaultVariant.value;
//   const memStr = v?.memory
//     ? v.memory.ram && v.memory.rom
//       ? `${v.memory.ram}GB/${v.memory.rom}GB`
//       : v.memory.name ?? ""
//     : "";
//   const colorName = v?.color?.name ?? "";

//   if (memStr && !name.includes(memStr)) name = `${name} ${memStr}`;
//   if (colorName && !name.includes(colorName)) name = `${name} ${colorName}`;

//   return name.trim();
// });

const productFullName = computed(() => {
  let name = product?.name ?? "";
  const v = props.variant ?? defaultVariant.value;
  const colorName = v?.color?.name ?? "";
  if (colorName && !name.includes(colorName)) name = `${name} ${colorName}`;
  return name.trim();
});
// lấy variant mặc định nếu product.productVariants có
// const defaultVariant = computed(() =>
//   product?.productVariants && product.productVariants.length
//     ? product.productVariants[0]
//     : null
// );
const mainImage = computed(() => {
  const imgs = product?.images || [];
  if (props.variant) {
    const vid = String(props.variant?.color?.id ?? props.variant?.color?._id ?? props.variant?.color ?? "");
    if (vid) {
      const byVar = imgs.find(i => String(i.colorId ?? "") === vid);
      if (byVar) return byVar;
    }
  }
  // fallback
  const byThumb = imgs.find(i => String(i.imageUrl) === String(product?.thumbUrl));
  return byThumb || imgs[0] || undefined;
});

const displayImage = computed(() => {
  return mainImage.value?.imageUrl || product?.thumbUrl || "";
});

const defaultVariant = computed(() => {
  const variants: any[] = product?.productVariants || [];
  if (props.variant) return props.variant;
  const img = mainImage.value;
  if (img && variants.length) {
    const imgColorId = String(img.colorId ?? "");
    if (imgColorId) {
      const found = variants.find((v) => {
        const vid = String(v?.color?.id ?? v?.color?._id ?? v?.color ?? "");
        return vid === imgColorId;
      });
      if (found) return found;
    }
  }
  return variants[0] ?? null;
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
