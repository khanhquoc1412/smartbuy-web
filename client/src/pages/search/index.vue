<template>
  <div class="app-product-list tw-flex tw-flex-col tw-gap-5 tw-pb-4">
    <BreadScrumb
      name-page="Tìm kiếm sản phẩm"
      :sub-navs="[{ name: 'Tất cả sản phẩm', path: '/product' }]"
    />
    <Container class="main tw-flex tw-gap-8 tw-flex-col">
      <div class="ads tw-flex tw-justify-center">
        <img :src="noen_1" alt="" />
      </div>
      <div class="main-product-list tw-flex tw-gap-4 tw-flex-col">
        <div class="filter-box tw-flex tw-flex-col tw-gap-2">
          <div class="title">Lọc sản phẩm</div>
          <div class="filter-main tw-flex tw-flex-wrap tw-gap-3">
            <SelectBox
              v-model="params.brand"
              title="Thương hiệu"
              :items="fBrands"
            />
            <!-- <SelectBox v-model="selectedItem.option" title="Cấu hình" :items="fOptions" />
              <SelectBox v-model="selectedItem.price" title="Giá bán" :items="fPrices" /> -->
          </div>
        </div>
        <div class="sort-box tw-flex tw-flex-col tw-gap-2">
          <div class="title">Sắp xếp theo</div>
          <div class="sort-main tw-flex tw-flex-wrap tw-gap-3">
            <div
              v-for="(option, index) in sortOptions"
              :key="index"
              @click="handleSort(option.dir as string)"
              :class="{
                'tw-text-red active': option.dir?.toLowerCase() === params.dir,
              }"
              class="sort-item tw-rounded-lg tw-py-2 tw-pl-3 tw-pr-3 hover:tw-opacity-80 tw-transition-all"
            >
              {{ option.label }}
            </div>
          </div>
        </div>
        <ProductBox v-if="isFetching">
          <ProductSkeleton v-for="n in 5" :key="n" />
        </ProductBox>
        <ProductBox v-else>
          <Container>
            <div class="product-list tw-grid tw-grid-cols-4 tw-gap-6">
              <ProductItem
                v-for="item in productVariantsList"
                :key="item._id"
                :product="item.product"
                :variant="item.variant"
              />
            </div>
          </Container>
        </ProductBox>
        <div
          v-if="!data?.products.length && !isFetching"
          class="product-empty-result tw-flex tw-justify-center tw-w-full tw-p-8"
        >
          <span class="tw-font-semibold"> Không tìm thấy sản phẩm nào </span>
        </div>
        <div
          v-if="!isFetching"
          class="product-pagination tw-pt-3 tw-flex tw-justify-center"
        >
          <VPagination
            v-if="data?.products.length && !isFetching"
            v-model="params.page"
            :pages="data?.total"
            :range-size="1"
            active-color="#FFF"
            @update:modelValue="updateHandler"
          />
        </div>
      </div>
    </Container>
  </div>
</template>

<script lang="ts" setup>
import MyInput from "@/components/common/MyInput/index.vue";
import SelectBox from "@components/common/SelectBox.vue";
import ProductItem from "@/components/product/ProductItem.vue";
import Container from "@/components/base/Container.vue";
import BreadScrumb from "@/components/base/BreadScrumb.vue";
import noen_1 from "@/assets/images/gif/noen-1.gif";
import Heading from "@/components/base/Heading.vue";
import { fOptions, fPrices } from "@utils/filter-sort/filter";
import { Swiper, SwiperSlide } from "swiper/vue";
import {
  Navigation,
  Pagination,
  Autoplay,
  EffectCube,
} from "swiper/modules";
import { breakpoints } from "@utils/breackpoints";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-cube";
import { getNameCategory } from "@/utils/getNameCategory";
import { useGetProductByKeyword } from "@/api/product/query";
import { IParams, IProduct, IProductVariant } from "@/types/product.types";
import VPagination from "@/components/base/VPagination.vue";
import ProductBox from "@/components/product/ProductBox.vue";
import ProductSkeleton from "@/components/base/ProductSkeleton.vue";

// ✅ State for brands
const fBrands = ref<any[]>([]);

// ✅ Fetch brands from API
const fetchBrands = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/product/brands");
    const data = await response.json();
    if (data.success) {
      fBrands.value = data.brands.map((b: any) => ({
        displayName: b.name,
        value: b.nameAscii || b.name.toLowerCase(), // Use nameAscii or lowercase name as value
        type: "brand",
      }));
    }
  } catch (error) {
    console.error("Error fetching brands:", error);
  }
};

onMounted(() => {
  fetchBrands();
});

const modules = [Navigation, Pagination, Autoplay, EffectCube];
interface iSort {
  label: string;
  order?: string;
  dir?: string;
}
const sortOptions: iSort[] = [
  { label: "Mới nhất", dir: "" },
  { label: "Giá tăng dần", dir: "ASC" },
  { label: "Giá giảm dần", dir: "DESC" },
];
const route = useRoute();
const router = useRouter();
const params = ref<IParams>({
  page: route?.query?.page ? parseInt(route.query.page as string) : 1,
  limit: 12,
  brand: route?.query?.brand ? (route.query.brand as string) : "",
  order: route?.query?.order ? (route.query.order as string) : "",
  dir: route?.query?.dir ? (route.query.dir as string) : "",
});

// ✅ Tạo computed để track keyword thay đổi
const searchKeyword = computed(() => (route.query.keyword as string) || "");

const { data, refetch, isLoading, isFetching } = useGetProductByKeyword(
  searchKeyword,
  params
);

const productVariantsList = computed(() => {
  if (!data.value?.products) return [];

  const result: Array<{
    _id: string;
    product: IProduct;
    variant: IProductVariant | null;
  }> = [];

  data.value.products.forEach((product: IProduct) => {
    const variants = product.productVariants || [];

    // ✅ Lấy _id an toàn từ product (có thể là id hoặc _id)
    const productId = String((product as any)._id || (product as any).id || "");

    if (variants.length === 0) {
      // Sản phẩm không có variant
      result.push({
        _id: productId,
        product: product,
        variant: null,
      });
    } else {
      // Tạo 1 item cho mỗi variant unique
      const seenKeys = new Set<string>();

      variants.forEach((variant: IProductVariant) => {
        const colorId = String(
          (variant.color as any)?.id || (variant.color as any)?._id || ""
        );
        const memoryId = String(
          (variant.memory as any)?.id || (variant.memory as any)?._id || ""
        );
        const key = `${colorId}-${memoryId}`;

        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          result.push({
            _id: `${productId}-${key}`,
            product: product,
            variant: variant,
          });
        }
      });
    }
  });

  return result;
});

watch([() => params.value.brand], ([newBrand]) => {
  if (!newBrand) {
    const { brand, ...restQuery } = route.query;
    router.replace({
      query: restQuery,
    });
  } else {
    params.value.page = 1;
    router.replace({
      query: {
        ...route.query,
        brand: newBrand,
        page: 1,
      },
    });
  }
  refetch();
});
const handleSort = async (dir: string) => {
  if (dir.length <= 0) {
    const { order, dir, ...restQuery } = route.query;
    router.replace({
      query: restQuery,
    });
    params.value.dir = "";
    params.value.order = "";
  } else {
    params.value.dir = dir.toLowerCase();
    params.value.order = "basePrice";
    params.value.page = 1;

    router.replace({
      query: {
        ...route.query,
        order: "basePrice",
        dir: dir.toLowerCase(),
        page: 1,
      },
    });
  }
  refetch();
};
const updateHandler = async (newPage: number) => {
  if (newPage === 1) {
    const { page, ...restQuery } = route.query;
    router.replace({
      query: restQuery,
    });
  } else {
    router.replace({
      query: {
        ...route.query,
        page: newPage,
      },
    });
  }
  refetch();
};
</script>
<route lang="yaml">
name: "Tìm kiếm"
meta:
  layout: "default"
</route>
<style lang="scss">
.app-product-list {
  .product-selling {
    background-color: #013c34;

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

  .main-product-list {
    .title {
      font-size: 16px;
      font-weight: 600;
      line-height: 125%;
    }

    .sort-box {
      .sort-main {
        font-size: 13px;

        .sort-item {
          border: 1px solid #e5e7eb;
          background-color: #f3f4f6;
          cursor: pointer;

          &.box-active {
            border: 2px solid #4b4b4b5d;
            color: #000;
            font-weight: 600;
          }
        }
      }
    }
  }
}
</style>
