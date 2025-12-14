<template>
  <div class="app-product-detail tw-flex tw-flex-col tw-gap-3 tw-pb-5">
    <BreadScrumb
      v-if="product"
      :name-page="productFullName"
      :sub-navs="[{ name: getNameCategory(product?.categoryName) as string, path: `/category/${product?.categoryName?.toLowerCase()}` }]"
    />
    <Container class="tw-flex tw-gap-4 tw-flex-col">
      <div class="product-title">
        <!-- <p>
          {{ getNameCategory(product?.categoryName) }}
          {{ product?.name }}
        </p> -->
        <AddToCartModal
          :is-open="showAddToCartModal"
          :product-info="addedProductInfo"
          :total-items="totalItems"
          @close="showAddToCartModal = false"
          @update-quantity="handleUpdateQuantity"
          @view-cart="handleViewCart"
        />
        <p>
          {{ getNameCategory(product?.categoryName) }}
          {{ productFullName }}
        </p>
      </div>
      <div class="product-main">
        <!-- <div class="product-swiper">
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
        </div> -->
        <div class="product-swiper">
          <swiper
            :spaceBetween="10"
            :pagination="true"
            :navigation="true"
            :thumbs="{ swiper: thumbsSwiper }"
            :modules="modules"
            class="swiper-view"
          >
            <swiper-slide
              class="swiper-img"
              v-for="image in filteredImages"
              :key="image._id"
            >
              <img :src="getImageUrl(image.imageUrl)" :alt="image.name" />
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
            <swiper-slide
              class="swiper-img"
              v-for="image in filteredImages"
              :key="image._id"
            >
              <img :src="getImageUrl(image.imageUrl)" :alt="image.name" />
            </swiper-slide>
          </swiper>
        </div>
        <div class="product-info">
          <div class="product-rating">
            <div class="rating">
              <span class="title"> Đánh giá: </span>
              <span
                >{{
                  productRating.averageRating > 0
                    ? productRating.averageRating.toFixed(1)
                    : "5.0"
                }}
              </span>
              <font-awesome-icon icon="star" />
              <span
                v-if="productRating.totalReviews > 0"
                class="tw-text-sm tw-text-gray-600"
                >({{ productRating.totalReviews }} đánh giá)</span
              >
            </div>
            <div class="sold">Đã bán: {{ productRating.soldCount || 0 }}</div>
          </div>
          <!-- <div class="product-price tw-flex tw-gap-4 tw-items-center">
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
          </div> -->
          <div class="product-price tw-flex tw-gap-4 tw-items-center">
            <!-- Giá sau giảm (màu đỏ) - Hiển thị trước -->
            <span class="base-price tw-text-red tw-font-medium">
              {{ formatMoney(
      getPriceByVariant(
        productSelected?.colorId as number,
        productSelected?.memoryId as number,
        product?.productVariants,
        product?.basePrice
      ) * (1 - ((product?.discountPercentage as number) || 0) / 100)
    ) }}
            </span>

            <!-- Giá gốc (bị gạch ngang) - Chỉ hiển thị nếu có giảm giá -->
            <span
              v-if="
                product?.discountPercentage && product.discountPercentage > 0
              "
              class="disc-price tw-text-gray-500 tw-line-through"
            >
              {{ formatMoney(
      getPriceByVariant(
        productSelected?.colorId as number,
        productSelected?.memoryId as number,
        product?.productVariants,
        product?.basePrice
      )
    ) }}
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
            <WishlistButton
              v-if="product"
              :product-id="String(product._id || product.id)"
              :variant-id="
                selectedVariantId ? String(selectedVariantId) : undefined
              "
              :color-id="productSelected.colorId || undefined"
              :memory-id="productSelected.memoryId || undefined"
              :is-in-wishlist="isInWishlist"
              @update="handleWishlistUpdate"
              class="tw-self-center"
            />
            <div class="btn-buy--now tw-flex-1" @click="handleBuyNow">
              Mua ngay
            </div>
            <div class="btn-add" v-if="!isAddLoading" @click="handleAddToCart">
              <img :src="cartColorIcon" alt="" />
              <span> Thêm vào giỏ hàng </span>
            </div>
            <div class="btn-add disable" v-else>
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

    <!-- Product Reviews Section -->
    <ProductReviews
      v-if="product"
      :product-id="String(product._id || product.id || '')"
      :product-name="productFullName"
    />
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
import ProductReviews from "@/components/product/ProductReviews.vue";
import Heading from "@/components/base/Heading.vue";
import { getImageUrl } from "@utils/imageUrl";
// // Thay dòng này
// import { useAddProductToCartMutation, useGetProductDetails, useListProductsSale } from "@/api/product/query";
import { useGetProductDetails, useListProductsSale } from "@/api/product/query";
import { useAddToCartMutation } from "@/api/cart/query";
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
import AddToCartModal from "@/components/cart/AddToCartModal.vue";
import WishlistButton from "@/components/wishlist/WishlistButton.vue";
import { $axios } from "@/plugins/axios/axios";

interface IProductSelected {
  id: string | null;
  variantId?: number | null;
  colorId?: number | null;
  memoryId?: number | null;
}
import { computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const productFullName = computed(() => {
  if (!product.value) return "";
  let name = product.value.name || "";
  // Tìm variant đang chọn
  const variant = (product.value.productVariants || []).find(
    (v: any) =>
      String(v.color?.id ?? v.color?._id) === String(productSelected.colorId) &&
      String(v.memory?.id ?? v.memory?._id) === String(productSelected.memoryId)
  );
  // Ghép cấu hình nếu có
  if (variant?.memory?.ram && variant?.memory?.rom) {
    name += ` ${variant.memory.ram}/${variant.memory.rom}`;
  }
  // Ghép màu nếu có
  if (variant?.color?.name) {
    name += ` ${variant.color.name}`;
  }
  return name;
});

const filteredImages = computed(() => {
  if (!product.value?.images) return [];
  if (!productSelected.colorId) return product.value.images;
  return product.value.images.filter((img: any) => {
    const imgCid =
      img?.colorId?._id ?? img?.colorId ?? img?.color?._id ?? img?.color;
    return String(imgCid) === String(productSelected.colorId);
  });
});

const thumbsSwiper = ref<any>(null);

const setThumbsSwiper = (swiper: any) => {
  thumbsSwiper.value = swiper;
};

const modules: SwiperModule[] = [FreeMode, Navigation, Thumbs, Pagination];
const {
  params: { slug },
} = useRoute();

const { userId, loggedIn } = useAuth();
const { addToCart, isAddLoading, isAddError } = useCart();
const {
  data: product,
  isFetching,
  refetch,
} = useGetProductDetails(slug as string);
// Gọi refetch() trực tiếp, không dùng .value

const { data: products } = useListProductsSale(10);

// State for rating and sold count
const productRating = reactive({
  averageRating: 0,
  totalReviews: 0,
  soldCount: 0,
});

const productSelected = reactive<IProductSelected>({
  id: null,
  colorId: null,
  memoryId: null,
});

// Wishlist Logic
const wishlistItems = ref<any[]>([]);
const fetchWishlist = async () => {
  if (!loggedIn.value) return;
  try {
    const res = await $axios.get("/user/wishlist");
    wishlistItems.value = res.data.data?.items || res.data.items || [];
  } catch (e) {
    console.error("Error fetching wishlist", e);
  }
};

const isInWishlist = computed(() => {
  if (!product.value) return false;
  return wishlistItems.value.some((item: any) => {
    const sameProduct =
      String(item.product) === String(product.value._id || product.value.id);
    if (!sameProduct) return false;

    // If variant is selected, check exact match
    if (selectedVariantId.value) {
      return String(item.variantId) === String(selectedVariantId.value);
    }

    // If color/memory selected
    if (productSelected.colorId && productSelected.memoryId) {
      return (
        String(item.colorId) === String(productSelected.colorId) &&
        String(item.memoryId) === String(productSelected.memoryId)
      );
    }

    return true;
  });
});

const handleWishlistUpdate = () => {
  fetchWishlist();
};

const sameId = (a: any, b: any) => {
  if (a === undefined || a === null || b === undefined || b === null)
    return false;
  return String(a) === String(b);
};

const findVariantByQuery = (
  qVariantId?: string,
  qColorId?: string,
  qMemoryId?: string
) => {
  const variants = product.value?.productVariants ?? [];
  if (!variants.length) return null;

  if (qVariantId) {
    const v = variants.find(
      (vv: any) =>
        sameId(vv._id ?? vv.id, qVariantId) || sameId(vv.id, qVariantId)
    );
    if (v) return v;
  }
  if (qColorId && qMemoryId) {
    const v = variants.find(
      (vv: any) =>
        sameId(vv.color?._id ?? vv.color?.id, qColorId) &&
        sameId(vv.memory?._id ?? vv.memory?.id, qMemoryId)
    );
    if (v) return v;
  }
  if (qColorId) {
    const v = variants.find((vv: any) =>
      sameId(vv.color?._id ?? vv.color?.id, qColorId)
    );
    if (v) return v;
  }
  return variants[0] ?? null;
};

const setProductSelectedValues = () => {
  if (!product.value?.productVariants) return;
  // lấy query từ route (string)
  const q = route.query;
  const qVariantId = q.variantId ? String(q.variantId) : "";
  const qColorId = q.colorId ? String(q.colorId) : "";
  const qMemoryId = q.memoryId ? String(q.memoryId) : "";

  const picked = findVariantByQuery(
    qVariantId || undefined,
    qColorId || undefined,
    qMemoryId || undefined
  );

  if (picked) {
    // đảm bảo gán số nếu backend trả number-like, dùng Number() để phù hợp so sánh trong template
    productSelected.id = product.value.id ?? null;
    const cId = picked.color?.id ?? picked.color?._id ?? null;
    const mId = picked.memory?.id ?? picked.memory?._id ?? null;
    productSelected.colorId =
      cId !== null
        ? isNaN(Number(cId))
          ? (String(cId) as any)
          : Number(cId)
        : null;
    productSelected.memoryId =
      mId !== null
        ? isNaN(Number(mId))
          ? (String(mId) as any)
          : Number(mId)
        : null;
  } else {
    // fallback mặc định variant[0]
    const def = product.value.productVariants[0];
    productSelected.id = product.value.id ?? null;
    const cId = def?.color?.id ?? def?.color?._id ?? null;
    const mId = def?.memory?.id ?? def?.memory?._id ?? null;
    productSelected.colorId =
      cId !== null
        ? isNaN(Number(cId))
          ? (String(cId) as any)
          : Number(cId)
        : null;
    productSelected.memoryId =
      mId !== null
        ? isNaN(Number(mId))
          ? (String(mId) as any)
          : Number(mId)
        : null;
  }
};

// const setProductSelectedValues = () => {
//   if (product.value?.productVariants) {
//     productSelected.id = product.value.id;
//     productSelected.colorId = product.value.productVariants[0]?.color?.id;
//     productSelected.memoryId = product.value.productVariants[0]?.memory?.id;
//   }
// };
const swiperRef = ref<any>(null);

const onSwiperInit = (swiper: any) => {
  swiperRef.value = swiper;
};
const handleUpdateProductSelected = (colorId?: number, memoryId?: number) => {
  if (colorId) {
    productSelected.colorId = colorId;
  }
  if (memoryId) {
    productSelected.memoryId = memoryId;
  }
};
const { totalItems, updateQuantity, cart, refetchCart } = useCart();

const showAddToCartModal = ref(false);
const addedProductInfo = ref<{
  name: string;
  image: string;
  price: number;
  quantity: number;
  color?: string;
  memory?: string;
  maxStock?: number;
  cartItemId?: string;
} | null>(null);

// ✅ Get cart data

// ...existing code...

// ✅ Handle update quantity từ modal
const handleUpdateQuantity = async (newQuantity: number) => {
  console.log("🔄 Updating quantity to:", newQuantity);
  // Nếu cần update quantity trên server, gọi API ở đây
  // await updateQuantity(cartItemId, newQuantity);
  // updateModalQuantity(newQuantity); // ✅ Gọi method từ useCart composable
};

const handleViewCart = async (newQuantity: number) => {
  try {
    console.log(
      "🛒 [PARENT] handleViewCart called with quantity:",
      newQuantity
    );
    console.log("📊 [PARENT] addedProductInfo:", addedProductInfo.value);
    console.log(
      "📊 [PARENT] Cart item ID:",
      addedProductInfo.value?.cartItemId
    );

    const itemId = addedProductInfo.value?.cartItemId;

    if (!itemId) {
      console.error("❌ [PARENT] No cart item ID found");
      showToast(
        "❌ Không tìm thấy thông tin giỏ hàng. Vui lòng thử lại.",
        "error"
      );
      return;
    }

    // ✅ Only update if quantity changed and > 1
    if (newQuantity > 1) {
      console.log(`📝 [PARENT] Updating quantity from 1 to ${newQuantity}...`);

      await updateQuantity(itemId, newQuantity);

      console.log("✅ [PARENT] Quantity updated successfully");
    } else {
      console.log("ℹ️ [PARENT] Quantity = 1, no update needed");
    }
  } catch (error) {
    console.error("❌ [PARENT] Error updating cart item:", error);
    showToast("Có lỗi xảy ra khi cập nhật số lượng", "error");
    throw error;
  }
};

const selectedVariant = computed(() => {
  if (!product.value?.productVariants) return null;

  return product.value.productVariants.find((variant: any) => {
    const colorId = variant.color?.id ?? variant.color?._id;
    const memoryId = variant.memory?.id ?? variant.memory?._id;

    return (
      String(colorId) === String(productSelected.colorId) &&
      String(memoryId) === String(productSelected.memoryId)
    );
  });
});

// ========== COMPUTED: Lấy ID của variant đang chọn ==========
const selectedVariantId = computed(() => {
  return selectedVariant.value?._id ?? selectedVariant.value?.id ?? null;
});

// ========== COMPUTED: Danh sách variant (để tiện sử dụng) ==========
const variants = computed(() => {
  return product.value?.productVariants ?? [];
});

// ...existing code...

// const handleAddToCart = async () => {
//   if (!product.value) {
//     alert("❌ Không tìm thấy thông tin sản phẩm");
//     return;
//   }

//   if (!selectedVariant.value) {
//     alert("❌ Vui lòng chọn phiên bản sản phẩm (màu sắc và cấu hình)");
//     return;
//   }

//   const payload = {
//     productId: String(product.value._id || product.value.id || ""),
//     variantId: String(
//       selectedVariant.value._id || selectedVariant.value.id || ""
//     ),
//     quantity: 1,
//   };

//   if (!payload.productId || !payload.variantId) {
//     alert("❌ Không tìm thấy ID sản phẩm hoặc phiên bản");
//     return;
//   }

//   try {
//     await addToCart(payload);

//     // ✅ Lưu thông tin sản phẩm vừa thêm (bao gồm stock)
//     addedProductInfo.value = {
//       name: product.value.name,
//       image: product.value.thumbUrl || "",
//       price: selectedVariant.value.price || 0,
//       quantity: 1,
//       color: selectedVariant.value.color?.name,
//       memory: `${selectedVariant.value.memory?.ram}/${selectedVariant.value.memory?.rom}`,
//       maxStock: selectedVariant.value.stock || 99,
//     };

//     // ✅ Hiển thị modal
//     showAddToCartModal.value = true;
//   } catch (error: any) {
//     console.error("❌ Error adding to cart:", error);
//     alert(`❌ ${error.response?.data?.message || "Có lỗi xảy ra"}`);
//   }
// };

const handleAddToCart = async () => {
  if (!product.value) {
    showToast("❌ Không tìm thấy thông tin sản phẩm", "error");
    return;
  }

  if (!selectedVariant.value) {
    showToast(
      "❌ Vui lòng chọn phiên bản sản phẩm (màu sắc và cấu hình)",
      "error"
    );
    return;
  }

  const payload = {
    productId: String(product.value._id || product.value.id || ""),
    variantId: String(
      selectedVariant.value._id || selectedVariant.value.id || ""
    ),
    quantity: 1,
  };

  if (!payload.productId || !payload.variantId) {
    showToast("❌ Không tìm thấy ID sản phẩm hoặc phiên bản", "error");
    return;
  }

  try {
    // ✅ STEP 1: Add to cart
    console.log("🛒 [STEP 1] Adding to cart...");
    await addToCart(payload);

    console.log("✅ [STEP 1] Added to cart successfully");

    // ✅ STEP 2: Refetch cart to get updated data with item IDs
    console.log("🔄 [STEP 2] Refetching cart to get cart item ID...");
    await refetchCart();

    console.log("✅ [STEP 2] Cart refetched");
    console.log("📦 [STEP 2] Cart data:", cart.value);
    console.log("📦 [STEP 2] Cart items:", cart.value?.items);

    // ✅ STEP 3: Find the added item from cart
    let cartItemId: string | null = null;

    if (
      cart.value?.items &&
      Array.isArray(cart.value.items) &&
      cart.value.items.length > 0
    ) {
      console.log(`📦 [STEP 3] Found ${cart.value.items.length} items in cart`);

      // ✅ Tìm item theo variantId
      const addedItem = cart.value.items.find((item: any) => {
        const itemVariantId = String(item.variantId?._id || item.variantId);
        const targetVariantId = String(payload.variantId);

        console.log(`🔍 Comparing: ${itemVariantId} === ${targetVariantId}`);

        return itemVariantId === targetVariantId;
      });

      if (addedItem) {
        cartItemId = String(addedItem._id || addedItem.id || "");
        console.log("✅ [STEP 3] Found item by variantId:", cartItemId);
        console.log("📦 [STEP 3] Item details:", addedItem);
      } else {
        console.warn("⚠️ [STEP 3] No item matched variantId, using last item");
        const lastItem = cart.value.items[cart.value.items.length - 1];
        cartItemId = String(lastItem?._id || lastItem?.id || "");
        console.log("⚠️ [STEP 3] Last item ID:", cartItemId);
      }
    } else {
      console.error("❌ [STEP 3] Cart items is empty or not an array");
    }

    console.log("💾 [FINAL] Cart item ID:", cartItemId);

    // ✅ Determine correct image based on selected color
    let displayImage = product.value.thumbUrl || "";
    if (filteredImages.value && filteredImages.value.length > 0) {
      displayImage = filteredImages.value[0].imageUrl;
    }

    // ✅ STEP 4: Save product info with cartItemId
    addedProductInfo.value = {
      name: product.value.name,
      image: displayImage,
      price: selectedVariant.value.price || 0,
      quantity: 1,
      color: selectedVariant.value.color?.name,
      memory: `${selectedVariant.value.memory?.ram}/${selectedVariant.value.memory?.rom}`,
      maxStock: selectedVariant.value.stock || 99,
      cartItemId: cartItemId || undefined,
    };

    if (!cartItemId) {
      console.error("❌ [FINAL] No cartItemId found, update will NOT work");
      console.error("❌ [FINAL] addedProductInfo:", addedProductInfo.value);
    } else {
      console.log("✅ [FINAL] Cart item ID saved:", cartItemId);
    }

    // ✅ STEP 5: Show modal
    showAddToCartModal.value = true;
  } catch (error: any) {
    console.error("❌ Error adding to cart:", error);
    showToast(
      `❌ ${error.response?.data?.message || "Có lỗi xảy ra"}`,
      "error"
    );
  }
};

const handleBuyNow = async () => {
  if (!product.value) {
    showToast("❌ Không tìm thấy thông tin sản phẩm", "error");
    return;
  }

  if (!selectedVariant.value) {
    showToast(
      "❌ Vui lòng chọn phiên bản sản phẩm (màu sắc và cấu hình)",
      "error"
    );
    return;
  }

  if (userId.value) {
    // User đã login → Thêm vào cart → Chuyển sang checkout
    try {
      const payload = {
        productId: String(product.value._id || product.value.id || ""),
        variantId: String(
          selectedVariant.value._id || selectedVariant.value.id || ""
        ),
        quantity: 1,
      };

      console.log("🛒 Thêm vào giỏ hàng để mua ngay...");
      await addToCart(payload);

      // Refetch giỏ hàng
      await refetchCart();

      // Chuyển sang trang checkout
      await router.push("/cart/checkout");
    } catch (error: any) {
      console.error("❌ Error in buy now:", error);
      showToast(`❌ ${error.response?.data?.message || "Có lỗi xảy ra"}`);
    }
  } else {
    // Guest → Lưu variantId vào localStorage → Chuyển checkout
    const productForBuy = useStorage(PRODUCT_GUEST, "");
    const variantId = selectedVariant.value._id || selectedVariant.value.id;

    if (variantId) {
      productForBuy.value = String(variantId);
      await router.push("/cart/checkout");
    }
  }
};

// Fetch rating and sold count
const fetchProductStats = async () => {
  if (!product.value) return;

  const productId = String(product.value._id || product.value.id || "");
  if (!productId) return;

  try {
    // Fetch rating from review-service
    console.log("🌟 [Slug] Fetching product reviews...");
    const reviewResponse = await $axios.get(
      `/reviews/product/${productId}?limit=1`
    );

    console.log("🌟 [Slug] Review Response:", reviewResponse);
    console.log("🌟 [Slug] Review Response Data:", reviewResponse.data);

    // Handle both wrapped and unwrapped responses
    let stats = null;
    if (reviewResponse.data.stats) {
      // Direct stats (axios interceptor unwrapped it)
      stats = reviewResponse.data.stats;
      console.log("🌟 [Slug] Found stats (unwrapped):", stats);
    } else if (reviewResponse.data.success && reviewResponse.data.data?.stats) {
      // Wrapped response { success: true, data: { stats: {...} } }
      stats = reviewResponse.data.data.stats;
      console.log("🌟 [Slug] Found stats (wrapped):", stats);
    }

    if (stats) {
      productRating.averageRating = stats.averageRating || 0;
      productRating.totalReviews = stats.totalReviews || 0;
      console.log("✅ [Slug] Rating set to:", productRating.averageRating);
      console.log("✅ [Slug] Total reviews:", productRating.totalReviews);
    } else {
      console.warn("⚠️ [Slug] No stats found in review response");
    }
  } catch (error) {
    console.error("❌ [Slug] Error fetching product rating:", error);
  }

  try {
    // Fetch sold count from top-selling API (same logic as ProductItem)
    console.log("🚀 [Slug] Fetching top selling products...");
    const topSellingResponse = await $axios.get(
      `/order/stats/top-selling-products?limit=100`
    );

    console.log(
      "🚀 [Slug] Top Selling Response Status:",
      topSellingResponse.status
    );
    console.log(
      "📊 [Slug] Top Selling Response Data:",
      topSellingResponse.data
    );
    console.log("📦 [Slug] Current Product:", product.value);

    // Handle both wrapped and unwrapped responses
    let allItems = [];
    if (Array.isArray(topSellingResponse.data)) {
      // Direct array response (axios interceptor unwrapped it)
      allItems = topSellingResponse.data;
    } else if (
      topSellingResponse.data.success &&
      topSellingResponse.data.data
    ) {
      // Wrapped response { success: true, data: [...] }
      allItems = topSellingResponse.data.data;
    }

    if (allItems.length > 0) {
      const currentSlug = product.value.slug;

      console.log("🚀 [Slug] Filtering by slug:", currentSlug);
      console.log("📊 [Slug] Total items to filter:", allItems.length);

      // Filter all items that match the current product slug (to include all variants)
      const matchingItems = allItems.filter((item: any) => {
        const match = item.slug === currentSlug;
        console.log(
          `   - Checking item: ${item.slug} (Sold: ${item.sold}) -> Match: ${match}`
        );
        return match;
      });

      console.log("✅ [Slug] Matching Items Count:", matchingItems.length);

      if (matchingItems.length > 0) {
        // Sum up sold count from all matching variants
        const totalSold = matchingItems.reduce(
          (sum: number, item: any) => sum + (item.sold || 0),
          0
        );
        console.log("💰 [Slug] Total Sold Calculated:", totalSold);
        productRating.soldCount = totalSold;
      } else {
        console.warn("⚠️ [Slug] No matching items found in top selling list");
      }
    } else {
      console.error("❌ [Slug] Top selling API returned empty data");
    }
  } catch (error) {
    console.error("Error fetching sold count:", error);
  }
};

// Lifecycle hooks
onMounted(() => {
  if (product.value) {
    setProductSelectedValues();
    fetchProductStats();
  }
  fetchWishlist();
});

watch(
  () => product.value,
  (newVal) => {
    if (newVal) {
      setProductSelectedValues();
      fetchProductStats();
    }
  }
);

watch(
  () => route.query,
  () => {
    if (product.value) {
      setProductSelectedValues();
    }
  }
);

watch(
  () => route.params.slug,
  async (newSlug, oldSlug) => {
    if (!newSlug || newSlug === oldSlug) return;
    window.location.reload();
  }
);

const showToast = (message: string, type: "success" | "error" = "success") => {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === "success" ? "#4CAF50" : "#f44336"};
    color: white;
    padding: 16px 24px;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    font-size: 14px;
    animation: slideIn 0.3s ease;
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "slideOut 0.3s ease";
    setTimeout(() => document.body.removeChild(toast), 300);
  }, 3000);
};
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
