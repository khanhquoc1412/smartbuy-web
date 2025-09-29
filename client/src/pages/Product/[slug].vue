<template>
  <div class="app-product-detail tw-flex tw-flex-col tw-gap-3 tw-pb-5">
    <BreadScrumb
      v-if="product"
      :name-page="(product?.name as string)"
      :sub-navs="[{ name: getNameCategory(product?.categoryName) as string, path: `/category/${product?.categoryName?.toLowerCase()}` }]"
    />
    <Container class="tw-flex tw-gap-4 tw-flex-col">
      <div class="product-title">
        <p>
          {{ getNameCategory(product?.categoryName) }}
          {{ product?.name }}
        </p>
      </div>
      <div class="product-main">
        <div class="product-swiper">
          <swiper
            :spaceBetween="10"
            :pagination="true"
            :navigation="true"
            :thumbs="{ swiper: thumbsSwiper }"
            :modules="modules"
            class="swiper-view"
          >
            <swiper-slide class="swiper-img" v-for="image in product?.images">
              <img :src="image.imageUrl" :alt="image.name" />
            </swiper-slide>
          </swiper>
          <swiper
            @swiper="setThumbsSwiper"
            :navigation="true"
            :spaceBetween="10"
            :slidesPerView="8"
            :freeMode="true"
            :watchSlidesProgress="true"
            :modules="modules"
            class="swiper-slider"
          >
            <swiper-slide class="swiper-img" v-for="image in product?.images">
              <img :src="image.imageUrl" :alt="image.name" />
            </swiper-slide>
          </swiper>
        </div>
        <div class="product-info">
          <div class="product-rating">
            <div class="rating">
              <span class="title"> Đánh giá: </span>
              <span> 4.9 </span>
              <font-awesome-icon icon="star" />
            </div>
            <div class="sold">Đã bán: 125</div>
          </div>
          <div class="product-price tw-flex tw-gap-4 tw-items-center">
            <span class="base-price">
              {{ formatMoney(getPriceByVariant(productSelected?.colorId as number, productSelected.memoryId as number,
                product?.productVariants, product?.basePrice)) }}
              {{ console.log(formatMoney(getPriceByVariant(productSelected?.colorId as number, productSelected.memoryId as
                number,
                product?.productVariants, product?.basePrice))) }}
            </span>
            <span class="disc-price">
              {{ formatMoney(getPriceByVariant(productSelected?.colorId as number, productSelected.memoryId as number,
                product?.productVariants, product?.basePrice) * (100 + (product?.discountPercentage as number)) / 100) }}
            </span>
          </div>
          <div class="product-options">
            <div class="option-specs">
              <div class="title">Cấu hình:</div>
              <div
                v-for="memory in getListVariant(product?.productVariants as IProductVariant[]).memoriesArray"
                :key="memory.id"
                :class="[
                  productSelected?.memoryId === memory.id ? 'active' : '',
                  'spec hover:tw-opacity-60 tw-transition-all',
                ]"
                @click="handleUpdateProductSelected(0, memory.id)"
              >
                {{ memory.ram }}/{{ memory.rom }}
              </div>
            </div>
            <div class="option-colors">
              <h3 class="title">Màu sắc:</h3>
              <div
                v-for="color in getListVariant(product?.productVariants as IProductVariant[]).colorsArray"
                :key="color.id"
                :class="[
                  productSelected?.colorId === color.id ? 'active' : '',
                  'color hover:tw-opacity-60  tw-transition-all',
                ]"
                @click="handleUpdateProductSelected(color.id)"
              >
                {{ color.name }}
              </div>
            </div>
            <span class="tw-text-gray-500 tw-text-xs tw-italic">
              {{
                getStockByVariant(productSelected?.colorId as number, productSelected.memoryId as number,
                  product?.productVariants)
              }}
              sản phẩm có sẵn
            </span>
          </div>
          <div class="product-benefit">
            <h3 class="title">
              <span>Khuyến mãi:</span>
            </h3>
            <div class="desc-coupon">
              <ul>
                <li>
                  <img :src="checkIcon" alt="" />
                  <span> Tặng phiếu mua hàng trị giá 500k </span>
                </li>
                <li>
                  <img :src="checkIcon" alt="" />
                  <span>
                    Trả góp tới 12 tháng không lãi suất, trả trước 0 đồng với
                    VNPay.
                  </span>
                </li>
                <li>
                  <img :src="checkIcon" alt="" />
                  <img
                    src="https://cdn2.cellphones.com.vn/insecure/rs:fill:70:0/q:80/plain/https://cellphones.com.vn/media/wysiwyg/momo_1.png"
                    alt=""
                  />
                  <span>
                    Giảm thêm 2% tối đa 800.000đ khi thanh toán qua MoMo
                  </span>
                </li>
                <li>
                  <img :src="checkIcon" alt="" />
                  <span> Tặng phiếu mua hàng trị giá 500k </span>
                </li>
              </ul>
            </div>
          </div>
          <div class="product-btn tw-flex tw-gap-3 tw-w-full tw-py-2">
            <div class="btn-buy--now tw-flex-1" @click="handleBuyNow">
              Mua ngay
            </div>
            <div class="btn-add" v-if="!isAddLoading" @click="handleAddToCart">
              <img :src="cartColorIcon" alt="" />
              <span> Thêm vào giỏ hàng </span>
            </div>
            <div class="btn-add disable" v-else>
              <!-- <img :src="cartColorIcon" alt="">
              <span>
                Loading ...
              </span> -->
              <LoadIcon />
            </div>
          </div>
          <div class="product-accept-payment">
            <h3 class="title">Thanh toán:</h3>
            <ul>
              <li>
                <img :src="payIcon" alt="" />
                <span>
                  Ưu đãi Youtube Premium dành cho chủ sở hữu Samsung Galaxy (Áp
                  dụng một số sản phẩm)
                </span>
              </li>
              <li>
                <img :src="payIcon" alt="" />
                <span>
                  Giảm ngay 150.000đ khi mua kèm SIM số đẹp Vinaphone Happy - Ưu
                  đãi 2GB Data/ngày - Miễn phí 1000 phút nội mạng.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="product-desc-technical">
        <div class="title">Thông số kỹ thuật</div>
        <div class="desc">
          <ul class="technical">
            <li v-for="(specData, index) in product?.productSpecs" :key="index">
              <h5>{{ specData?.specification?.specName }}:</h5>
              <div>{{ specData?.specValue }}</div>
            </li>
          </ul>
          <div class="introduce">
            <span>Giới thiệu</span>
            <p>
              {{ product?.description }}
            </p>
          </div>
        </div>
      </div>
      <div class="product-similar tw-flex tw-gap-5 tw-flex-col">
        <Heading
          toptitle="Sản phẩm"
          title="Sản phẩm tương tự"
          :allowViewAll="true"
        />
        <div class="list-product">
          <swiper
            :modules="modules"
            :slides-per-view="4.5"
            :navigation="true"
            :space-between="24"
            id="swiper-slider"
            :breakpoints="breakpoints"
          >
            <swiper-slide
              class="swiper-item"
              v-for="product in products"
              :key="product.id"
            >
              <ProductItem :product="product" :path="product.slug" />
            </swiper-slide>
          </swiper>
        </div>
      </div>
    </Container>
  </div>
</template>

<script lang="ts" setup>
import Container from "@components/base/Container.vue";
import BreadScrumb from "@/components/base/BreadScrumb.vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import checkIcon from "@assets/svg/check.svg";
import payIcon from "@assets/svg/payIcon.svg";
import cartColorIcon from "@assets/svg/cart-color.svg";
import LoadIcon from "@components/common/LoadIcon.vue";
import { FreeMode, Navigation, Thumbs, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import {
  SwiperModule,
  SwiperOptions,
  Swiper as SwiperClass,
} from "swiper/types";
import { breakpoints } from "@utils/breackpoints";
import ProductItem from "@/components/product/ProductItem.vue";
import Heading from "@/components/base/Heading.vue";
import { useAddProductToCartMutation, useGetProductDetails, useListProductsSale } from "@/api/product/query";
import { formatMoney } from "@/utils/formatMoney";
import { getNameCategory } from "@/utils/getNameCategory";
import { getListVariant } from "@/utils/product/getListVariant";
import {
  getPriceByVariant,
  getStockByVariant,
} from "@/utils/product/getPriceByVariant";
import { IProductVariant } from "@/types/product.types";
import { useAuth } from "@/composables/useAuth";
import { useCart } from "@/composables/useCart";
import { useStorage } from "@vueuse/core";
import { PRODUCT_GUEST } from "@/utils/constants";
interface IProductSelected {
  id: string | null;
  variantId?: number | null;
  colorId?: number | null;
  memoryId?: number | null;
}
const thumbsSwiper = ref<any>(null);

const setThumbsSwiper = (swiper: any) => {
  thumbsSwiper.value = swiper;
};

const modules: SwiperModule[] = [FreeMode, Navigation, Thumbs, Pagination];
const {
  params: { slug },
} = useRoute();
const router = useRouter();
const { userId, loggedIn } = useAuth();
const { addToCart, isAddLoading, isAddError } = useCart();
const { data: product, isFetching } = useGetProductDetails(slug as string);
const { data: products } = useListProductsSale(10);
const productSelected = reactive<IProductSelected>({
  id: null,
  colorId: null,
  memoryId: null,
});

const setProductSelectedValues = () => {
  if (product.value?.productVariants) {
    productSelected.id = product.value.id;
    productSelected.colorId = product.value.productVariants[0]?.color?.id;
    productSelected.memoryId = product.value.productVariants[0]?.memory?.id;
  }
};
const handleUpdateProductSelected = (colorId?: number, memoryId?: number) => {
  if (colorId) {
    productSelected.colorId = colorId;
  }
  if (memoryId) {
    productSelected.memoryId = memoryId;
  }
};
const handleAddToCart = async () => {
  if (!loggedIn.value) {
    router.push("/login");
  }
  if (product.value?.productVariants) {
    const variant = product.value?.productVariants?.find((variant) => {
      return (
        variant.color?.id === productSelected.colorId &&
        variant.memory?.id === productSelected.memoryId
      );
    });
    if (variant?.id) {
      await addToCart({ userId: userId.value, productVariantId: variant?.id });
    }
  } else {
    alert("Error ..");
  }
};
const handleBuyNow = async () => {
  if (userId) {
    await handleAddToCart();
    router.push("/cart");
  } else {
    const productForBuy = useStorage(PRODUCT_GUEST, "");
    if (product.value?.productVariants) {
      const variant = product.value?.productVariants?.find((variant) => {
        return (
          variant.color?.id === productSelected.colorId &&
          variant.memory?.id === productSelected.memoryId
        );
      });
      if (variant?.id) {
        productForBuy.value = (variant?.id).toString();
        router.push("/cart/checkout");
      }
    } else {
      alert("Error ..");
    }
  }
};
onMounted(() => {
  setProductSelectedValues();
});

watch(product, () => {
  setProductSelectedValues();
});
</script>
<route lang="yaml">
name: iPhone 15 Pro Max
meta:
  layout: "default"
</route>
<style lang="scss">
.app-product-detail {
  .product-title {
    font-size: 20px;
    font-weight: 600;
    padding-bottom: 10px;
    border-bottom: 1px solid $border-section;
  }

  .product-main {
    display: flex;
    gap: 20px;
    width: 100%;
    flex-direction: column;

    @include min-lg {
      flex-direction: row;
    }

    .product-swiper {
      user-select: none;
      width: 100%;
      // background-color: $light-primary;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      cursor: pointer;
      border-radius: 8px;
      overflow: hidden;

      @include min-lg {
        width: 60%;
      }

      .swiper-button-prev,
      .swiper-button-next {
        &.swiper-button-disabled {
          display: none;
        }
      }

      .swiper-button-prev:after,
      .swiper-button-next:after {
        padding: 10px;
        font-size: 20px;
        border-radius: 10px;
        font-weight: 600;
        background-color: rgba(255, 255, 255, 0.163);
        color: $gray;
        box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;

        &:hover {
          color: red !important;
          background-color: rgba(255, 255, 255, 0.326);
        }
      }

      .swiper-view {
        .swiper-img {
          display: flex;
          align-items: center;
        }

        width: 100%;

        img {
          width: 100%;
        }
      }

      .swiper-slider {
        display: flex;
        align-items: center;
        max-width: 100%;

        .swiper-slide {
          background-color: $white;
        }

        // width: 100%;

        // .swiper-wrapper {
        //     display: flex;
        //     justify-content: center !important;
        // }

        .swiper-img {
          cursor: pointer;
          height: 60px;
          width: 60px !important;
          padding: 5px;
          border-radius: 4px;
          overflow: hidden;
          border: 1px solid $border-section;

          img {
            height: 100%;
            width: 100%;
            object-fit: contain;
          }
        }

        .swiper-slide-thumb-active {
          border: 1px solid $red;
        }
      }
    }

    .product-info {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 10px;

      @include min-lg {
        width: 40%;
      }

      .product-rating {
        display: flex;
        gap: 32px;
        font-size: 13px;

        .rating {
          display: flex;
          gap: 5px;
          font-weight: 600;
          color: $orange;

          .title {
            color: $black;
          }
        }

        .sold {
          color: $gray;
        }
      }

      .product-desc-short {
        ul {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
      }
    }

    .product-price {
      padding: 5px;

      .base-price {
        color: red;
        font-size: 22px;
        font-weight: 700;
        border-radius: 8px;
      }

      .disc-price {
        color: $gray;
        text-decoration: line-through;
        // font-weight: 400;
        font-size: 16px;
      }
    }

    .product-options {
      display: flex;
      flex-direction: column;
      gap: 24px;

      .option-specs {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        font-size: 13px;

        .title {
          align-self: center;
          font-weight: 600;
        }

        .spec {
          padding: 10px;
          border-radius: 4px;
          border: 2px solid $border-section;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);

          &:hover,
          &.active {
            border: 2px solid $red;
            background-color: rgba(255, 0, 0, 0.035);
          }
        }
      }

      .option-colors {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        font-size: 13px;
        padding: 5px 0;

        .title {
          align-self: center;
          font-weight: 600;
        }

        .color {
          cursor: pointer;
          padding: 5px 10px;
          border-radius: 2px;
          border: 2px solid $border-section;

          &:hover,
          &.active {
            border: 2px solid $red;
            background-color: rgba(255, 0, 0, 0.035);
          }

          // &.active::after {
          //   content: "";
          //   width: 46px;
          //   height: 46px;
          //   border: 2px solid #000;
          //   position: absolute;
          //   box-sizing: border-box;
          //   border-radius: 50%;
          //   left: -5px;
          //   top: -5px;
          // }
        }
      }
    }

    .product-benefit {
      display: flex;
      gap: 5px;
      flex-direction: column;
      background-color: $white;
      border: 1px solid $border-section;
      padding: 15px 10px;
      border-radius: 10px;
      position: relative;

      .icon {
        position: absolute;
        width: 80px;
        top: -35px;
        left: -10px;
      }

      .title {
        font-size: 14px;
        font-weight: 600;
        text-transform: uppercase;
        color: $red;
      }

      .desc-coupon {
        ul {
          font-size: 12px;
          display: flex;
          flex-direction: column;
          gap: 5px;

          li {
            display: flex;
            gap: 5px;
            align-items: center;

            img {
              height: 13px;
              width: 13px;

              svg {
                height: 100%;
                width: 100%;
              }
            }
          }
        }
      }
    }

    .product-accept-payment {
      padding: 10px 20px;
      border-radius: 4px;
      background-color: $light-primary;

      .title {
        font-size: 14px;
        font-weight: 600;
        line-height: 120%;
        text-transform: uppercase;
      }

      ul {
        li {
          line-height: 150%;
          font-size: 14px;

          img {
            height: 13px;
            width: 13px;

            svg {
              height: 100%;
              width: 100%;
            }
          }

          span {
            font-size: 12px;
            color: $black;
            font-style: italic;
          }
        }
      }
    }

    .product-btn {
      .btn-buy--now {
        background-color: $red;
        color: $white;
        font-size: 16px;
        font-weight: 500;
        padding: 16px;
        cursor: pointer;
        border-radius: 4px;
        text-align: center;

        &:hover {
          opacity: 0.8;
        }
      }

      .btn-add {
        cursor: pointer;
        padding: 5px;
        box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
        background-color: rgba(254, 1, 1, 0.06);
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border: 2px solid $red;
        gap: 5px;
        width: 140px;
        height: 58px;
        transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);

        &.disable {
          opacity: 0.5;
        }

        span {
          color: red;
          font-size: 13px;
          font-weight: 500;
        }

        img {
          height: 20px;
          width: 20px;

          svg {
            height: 100%;
            width: 100%;
          }
        }

        &:hover {
          background-color: rgba(254, 1, 1, 0.034);
        }
      }
    }
  }

  .product-desc-technical {
    display: flex;
    gap: 24px;
    flex-direction: column;

    .title {
      font-size: 16px;
      font-weight: 600;
      color: $blue;
    }

    .desc {
      display: flex;
      flex-direction: column;
      gap: 32px;

      @include min-lg {
        flex-direction: row;
      }

      .technical {
        background-color: $white;
        border-radius: 4px;
        overflow: hidden;

        @include min-lg {
          width: 50%;
        }

        li {
          padding: 16px;
          display: flex;
          // flex-direction: column;
          gap: 16px;

          h5 {
            width: 140px;
          }

          @include min-lg {
            // flex-direction: row;
            gap: 0;

            h5 {
              overflow: hidden;
              display: inline-block;
              width: 140px;
              white-space: normal;
            }

            div {
              width: calc(100% - 140px);
              overflow: hidden;
              text-overflow: ellipsis;
              font-weight: 400;
              line-height: 20px;
            }
          }
        }

        li:nth-child(odd) {
          background-color: #f5f5f5;
        }
      }

      .introduce {
        span {
          font-size: 25px;
          font-weight: 600;
          padding-bottom: 20px;
        }

        display: flex;
        flex-direction: column;
        gap: 5px;

        p {
          line-height: 150%;
        }

        @include min-lg {
          width: 50%;
        }
      }
    }
  }

  .product-similar {
    .swiper {
      padding: 0 6px;
    }

    .swiper-button-prev:after,
    .swiper-button-next:after {
      background-color: $white;
      font-size: 16px;
      font-weight: 600;
      padding: 10px 15px;
      box-shadow: $box-shadow-prd;
      border-radius: 50%;
      color: $gray;
    }
  }
}
</style>
