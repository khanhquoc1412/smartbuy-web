<template>
  <Container class="tw-py-4">
    <div class="app-home tw-flex tw-flex-col tw-gap-4">
      <div
        class="block-top-home tw-bg-white tw-flex tw-gap-5 tw-justify-between"
      >
        <div class="menu-main">
          <Menu />
        </div>
        <div class="home-slider tw-relative tw-rounded-lg">
          <div class="home-slider-main">
            <swiper
              :modules="modules"
              :slides-per-view="1"
              :space-between="10"
              :pagination="{ clickable: true }"
              :navigation="true"
              id="swiper-slider"
            >
              <swiper-slide
                class="swiper-item tw-overflow-hidden"
                v-for="n in 6"
                :key="n"
              >
                <img :src="banner" alt="" />
              </swiper-slide>
            </swiper>
          </div>
          <div class="home-slider__bottom">
            <div class="home-slider__bottom-item">
              <p>Apple iPhone</p>
              <span>Giảm đến 14%</span>
            </div>
            <div class="home-slider__bottom-item">
              <p>Máy tính bảng</p>
              <span>Giảm đến 38%</span>
            </div>
            <div class="home-slider__bottom-item">
              <p>Phụ kiện điện thoại</p>
              <span>Giảm đến 20%</span>
            </div>
            <div class="home-slider__bottom-item">
              <p>Samsung S24 ultra</p>
              <span>Giảm đến 15%</span>
            </div>
          </div>
        </div>
        <div class="home__right-banner">
          <router-link class="banner-item" to="/">
            <img :src="banner1" alt="banner1" />
          </router-link>
          <router-link class="banner-item" to="/">
            <img :src="banner2" alt="banner2" />
          </router-link>
          <router-link class="banner-item" to="/">
            <img :src="banner3" alt="banner3" />
          </router-link>
        </div>
      </div>
      <div class="home-banner">
        <img :src="tetBanner" alt="" />
      </div>
      <div
        class="home-sale tw-rounded-xl tw-overflow-hidden tw-flex tw-flex-col tw-gap-6 tw-px-4 tw-py-5"
      >
        <Heading event-title="HOT SALE GIÁ SỐC" :timer="true" />
        <div class="list-product">
          <swiper
            :modules="modules"
            :slides-per-view="3"
            :navigation="true"
            :space-between="24"
            id="swiper-slider"
            :breakpoints="breakpoints"
          >
            <swiper-slide
              class="swiper-item"
              v-for="item in productVariantsList"
              :key="
                item.product.id + '-' + (item.variant?.id ?? item.variant?._id)
              "
            >
              <product-item
                :product="item.product"
                :variant="item.variant"
                :path="item.product.slug"
              />
            </swiper-slide>
          </swiper>
        </div>
      </div>

      <div
        class="best-seller tw-bg-white tw-rounded-xl tw-overflow-hidden tw-flex tw-flex-col tw-gap-6 tw-px-4 tw-py-5"
      >
        <Heading toptitle="Tháng này" title="Sản phẩm bán chạy" />
        <div class="list-product">
          <swiper
            :modules="modules"
            :slides-per-view="3"
            :navigation="true"
            :space-between="24"
            id="swiper-slider"
            :breakpoints="breakpoints"
          >
            <swiper-slide
              class="swiper-item"
              v-for="item in productVariantsList"
              :key="
                item.product.id + '-' + (item.variant?.id ?? item.variant?._id)
              "
            >
              <ProductItem
                :product="item.product"
                :variant="item.variant"
                :path="item.product.slug"
              />
            </swiper-slide>
          </swiper>
        </div>
      </div>
      <div class="home-banner">
        <img
          src="https://cdn.hoanghamobile.com/i/home/Uploads/2024/01/23/zflip-1899000.png"
          alt=""
        />
      </div>
      <div
        class="home-brand tw-rounded-xl tw-bg-white tw-flex tw-flex-col tw-gap-6 tw-px-4 tw-py-5"
      >
        <Heading toptitle="Brands" title="Thương hiệu nổi tiếng" />
        <Brands />
      </div>
      <div
        class="best-seller tw-bg-white tw-rounded-xl tw-overflow-hidden tw-flex tw-flex-col tw-gap-6 tw-px-4 tw-py-5"
      >
        <Heading
          toptitle="Sản phẩm khác"
          title="Có thể bạn sẽ thích"
          :allow-view-all="false"
        />
        <div class="list-product tw-grid tw-grid-cols-5 tw-gap-5">
          <div
            class="product-item"
            v-for="product in products"
            :key="product.id"
          >
            <product-item :product="product" :path="product.slug" />
          </div>
        </div>
        <div
          class="btn-view tw-self-center tw-p-3 tw-bg-red tw-text-white hover:tw-opacity-70 tw-transition-all tw-rounded-sm"
        >
          <router-link
            to="/product"
            class="btn-view tw-self-center tw-p-3 tw-bg-red tw-text-white hover:tw-opacity-70 tw-transition-all tw-rounded-sm"
          >
            Xem thêm sản phẩm
          </router-link>
        </div>
      </div>
    </div>
  </Container>
</template>

<script lang="ts" setup>
import Menu from "@/components/categories/Menu.vue";
import Container from "@components/base/Container.vue";
import banner from "@/assets/images/banner.jpg";
import banner1 from "@/assets/images/banner/b1.png";
import banner2 from "@/assets/images/banner/b2.png";
import banner3 from "@/assets/images/banner/b3.png";
import adv from "@/assets/images/banner/adv.jpg";
import tetBanner from "@/assets/images/banner/tet-banner.gif";
import Brands from "@/components/brands/Brands.vue";
import Heading from "@/components/base/Heading.vue";
import ProductItem from "@/components/product/ProductItem.vue";
import { breakpoints } from "@utils/breackpoints";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination, Autoplay, EffectCube } from "swiper/modules";
import bgChistmas from "@assets/images/christmas-gift-box.png";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-cube";
import { SwiperModule } from "swiper/types";
import { IProduct } from "@/types/product.types";
import { useListProductsSale } from "@/api/product/query";

const modules: SwiperModule[] = [Navigation, Pagination, Autoplay, EffectCube];
import { computed, unref } from "vue";
// const productVariantsList = computed(() => {
//   const arr = unref(products) ?? [];
//   return arr.flatMap((p: any) => {
//     const variants =
//       p.productVariants && p.productVariants.length
//         ? p.productVariants
//         : [undefined];
//     const seen = new Set();
//     return variants
//       .filter((v: any) => {
//         const key = `${v?.color?.id ?? v?.color?._id ?? v?.color ?? ""}#${
//           v?.memory?.id ?? v?.memory?._id ?? v?.memory ?? ""
//         }`;
//         if (seen.has(key)) return false;
//         seen.add(key);
//         return true;
//       })
//       .map((v: any) => ({ product: p, variant: v }));
//   });
// });


const productVariantsList = computed(() => {
  const arr = unref(products) ?? [];
  return arr.flatMap((p: any) => {
    const variants: any[] = Array.isArray(p.productVariants) ? p.productVariants : [];
    // Nếu không có variant, giữ 1 entry với variant = null để vẫn render sản phẩm
    const variantsToUse = variants.length ? variants : [null];

    const seen = new Set();
    return variantsToUse
      .filter((v: any) => {
        // tạo key bao gồm product id để tránh trùng giữa các product khác
        const pid = String(p.id ?? p._id ?? "");
        const vid = String(v?.id ?? v?._id ?? v ?? "");
        const key = `${pid}#${vid}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map((v: any) => ({ product: p, variant: v }));
  });
});
// testing homepage
const product: IProduct = {
  id: "c7626d43-949b-4212-9084-86f747c6624f",
  name: "iPhone 15 Pro MAx",
  description: "iphone 15 pro max desc",
  thumbUrl:
    "https://cdn.tgdd.vn/Products/Images/42/305658/TimerThumb/iphone-15-pro-max-(4).jpg",
  slug: "iphone-15-pro-max",
  basePrice: 24900000,
  brandName: "apple",
  categoryName: "mobile",
};
const { data: products } = useListProductsSale(10);
console.log("products from API", products?.value ?? products);
</script>
<route lang="yaml">
name: Trang chủ
meta:
  layout: "default"
</route>
<style lang="scss">
.app-home {
  .block-top-home {
    .menu-main {
      z-index: 10;
      width: 230px;
      border-radius: 8px;
      box-shadow: $box-shadow-section;
    }

    .home-slider {
      flex: 1;
      box-shadow: $box-shadow-section;

      &-main {
        height: calc(100% - 80px);
        display: flex;
        justify-content: center;
        align-items: center;
      }

      &__bottom {
        height: 80px;
        width: 100%;
        position: absolute;
        bottom: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 10px;
        background-color: $bg-light-gray;

        &-item {
          cursor: pointer;
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;
          transition: opacity 0.2s ease-in-out;

          p {
            text-align: center;
            font-size: 12px;
            text-transform: uppercase;
          }

          span {
            font-size: 12px;
            font-weight: 300;
          }

          &:hover {
            opacity: 0.75;
          }
        }
      }
    }

    .home__right-banner {
      display: none;

      .right-banner {
        max-width: 265px;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      @include min-xl {
        display: block;
        width: 256px;
        padding: 8px;

        .banner-item {
          padding: 8px;

          img {
            width: 100%;
            border-radius: 8px;
          }
        }
      }
    }
  }

  .home-banner {
    img {
      width: 100%;
    }
  }

  .home-slider {
    width: 100%;
    overflow: hidden;
    border-radius: 8px;

    #swiper-slider {
      .swiper-slider {
        transition: all 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
      }

      .swiper-button-prev,
      .swiper-button-next {
        transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
        display: none;

        &::after {
          color: $navigation-btn-color;
          font-size: 1.5rem;
          font-weight: 600;
        }

        &:hover {
          transform: scale(1.1);
        }

        @include min-lg {
          display: flex;
        }
      }

      .swiper-pagination-bullet {
        &.swiper-pagination-bullet-active {
          border-radius: 4px;
          background-color: $red;
          transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
      }
    }

    img {
      width: 100%;
      object-fit: contain;
    }
  }

  .home-sale {
    background: linear-gradient(rgb(142, 2, 35), rgb(224, 0, 51)) 0% 0% / cover;
  }

  .home-brand {
    box-shadow: $box-shadow-section;
  }

  .home-sale,
  .best-seller {
    box-shadow: $box-shadow-section;

    .list-product {
      .swiper {
        padding: 0 6px;
      }

      #swiper-slider {
        .swiper-button-prev,
        .swiper-button-next {
          z-index: 1;

          &::after {
            font-size: 16px;
            font-weight: 600;
            padding: 10px 15px;
            box-shadow: $nav-slide-box-shadow;
            border-radius: 50%;
            color: $gray;
          }

          &.swiper-button-disabled {
            display: none;
          }
        }
      }
    }
  }
}
</style>
