<template>
  <div class="wishlist-page tw-flex tw-flex-col tw-gap-5 tw-pb-4">
    <!-- Header Section -->
    <div class="wishlist-header">
      <div class="header-content">
        <div class="header-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"
            />
          </svg>
        </div>
        <div class="header-text">
          <h1 class="header-title">Danh sách yêu thích</h1>
          <p class="header-subtitle">
            Lưu những sản phẩm bạn yêu thích để mua sau
          </p>
        </div>
      </div>
    </div>

    <div
      class="cart-section tw-flex tw-gap-8 tw-flex-col tw-mx-auto tw-w-full"
      style="max-width: 800px"
    >
      <!-- Loading State -->
      <div
        v-if="isLoading"
        class="cart-main tw-py-20 tw-flex tw-justify-center"
      >
        <div class="loading-spinner">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="10" opacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" opacity="0.75" />
          </svg>
        </div>
        <p class="tw-ml-3">Đang tải danh sách yêu thích...</p>
      </div>

      <!-- Wishlist Items (List View like Cart) -->
      <div
        v-else-if="wishlistItems.length > 0"
        class="cart-main tw-flex tw-flex-col tw-gap-5 tw-pb-20"
      >
        <div
          class="cart-product tw-flex tw-justify-between tw-gap-3"
          v-for="item in wishlistItems"
          :key="item._id"
        >
          <div class="cart-product__left tw-flex tw-gap-3">
            <div class="product-img">
              <router-link
                :to="{
                  path: `/product/${item.product?.slug || item.product?._id}`,
                  query: {
                    variantId: item.variantId,
                    colorId: item.colorId,
                    memoryId: item.memoryId,
                  },
                }"
              >
                <img
                  class="tw-w-full tw-h-full tw-object-cover"
                  :src="getVariantImage(item)"
                  :alt="item.product?.name"
                />
              </router-link>
            </div>
            <div
              class="product-desc tw-py-2 tw-flex tw-flex-col tw-justify-between"
            >
              <router-link
                :to="{
                  path: `/product/${item.product?.slug || item.product?._id}`,
                  query: {
                    variantId: item.variantId,
                    colorId: item.colorId,
                    memoryId: item.memoryId,
                  },
                }"
                class="product-desc--name tw-cursor-pointer hover:tw-text-red tw-transition-all"
              >
                {{ item.product?.name }} {{ getVariantName(item) }}
              </router-link>
              <div class="product-desc--option tw-justify-self-start">
                <!-- Display variant info if available -->
              </div>
              <div class="product-desc__price tw-flex tw-gap-2">
                <div class="product-desc__price--show">
                  {{ formatMoney(item.product?.price || 0) }}
                </div>
                <!-- Base price if discounted (optional, if data available) -->
                <div
                  class="product-desc__price--throw"
                  v-if="
                    item.product?.basePrice &&
                    item.product?.basePrice > item.product?.price
                  "
                >
                  {{ formatMoney(item.product?.basePrice) }}
                </div>
              </div>
            </div>
          </div>

          <div
            class="cart-product__right tw-flex tw-flex-col tw-justify-between tw-items-end"
          >
            <!-- Remove Button -->
            <div
              class="remove-btn hover:tw-opacity-75 tw-transition-all"
              @click="handleRemoveFromWishlist(item._id)"
              title="Xóa khỏi yêu thích"
            >
              <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M13.9999 4H10.6666V2.88666C10.6509 2.45988 10.4667 2.0567 10.1543 1.76553C9.84188 1.47435 9.42675 1.31893 8.99992 1.33333H6.99992C6.57309 1.31893 6.15796 1.47435 5.84554 1.76553C5.53312 2.0567 5.34889 2.45988 5.33325 2.88666V4H1.99992C1.82311 4 1.65354 4.07024 1.52851 4.19526C1.40349 4.32028 1.33325 4.48985 1.33325 4.66666C1.33325 4.84348 1.40349 5.01305 1.52851 5.13807C1.65354 5.26309 1.82311 5.33333 1.99992 5.33333H2.66659V12.6667C2.66659 13.1971 2.8773 13.7058 3.25237 14.0809C3.62744 14.456 4.13615 14.6667 4.66659 14.6667H11.3333C11.8637 14.6667 12.3724 14.456 12.7475 14.0809C13.1225 13.7058 13.3333 13.1971 13.3333 12.6667V5.33333H13.9999C14.1767 5.33333 14.3463 5.26309 14.4713 5.13807C14.5963 5.01305 14.6666 4.84348 14.6666 4.66666C14.6666 4.48985 14.5963 4.32028 14.4713 4.19526C14.3463 4.07024 14.1767 4 13.9999 4ZM6.66659 2.88666C6.66659 2.78 6.80659 2.66666 6.99992 2.66666H8.99992C9.19325 2.66666 9.33325 2.78 9.33325 2.88666V4H6.66659V2.88666ZM11.9999 12.6667C11.9999 12.8435 11.9297 13.013 11.8047 13.1381C11.6796 13.2631 11.5101 13.3333 11.3333 13.3333H4.66659C4.48977 13.3333 4.32021 13.2631 4.19518 13.1381C4.07016 13.013 3.99992 12.8435 3.99992 12.6667V5.33333H11.9999V12.6667Z"
                ></path>
                <path
                  d="M5.99992 11.3333C6.17673 11.3333 6.3463 11.2631 6.47132 11.1381C6.59635 11.013 6.66658 10.8435 6.66658 10.6667V8C6.66658 7.82319 6.59635 7.65362 6.47132 7.5286C6.3463 7.40357 6.17673 7.33334 5.99992 7.33334C5.82311 7.33334 5.65354 7.40357 5.52851 7.5286C5.40349 7.65362 5.33325 7.82319 5.33325 8V10.6667C5.33325 10.8435 5.40349 11.013 5.52851 11.1381C5.65354 11.2631 5.82311 11.3333 5.99992 11.3333Z"
                ></path>
                <path
                  d="M9.99992 11.3333C10.1767 11.3333 10.3463 11.2631 10.4713 11.1381C10.5963 11.013 10.6666 10.8435 10.6666 10.6667V8C10.6666 7.82319 10.5963 7.65362 10.4713 7.5286C10.3463 7.40357 10.1767 7.33334 9.99992 7.33334C9.82311 7.33334 9.65354 7.40357 9.52851 7.5286C9.40349 7.65362 9.33325 7.82319 9.33325 8V10.6667C9.33325 10.8435 9.40349 11.013 9.52851 11.1381C9.65354 11.2631 9.82311 11.3333 9.99992 11.3333Z"
                ></path>
              </svg>
            </div>

            <!-- Add to Cart Button -->
            <button
              @click="handleAddToCart(item.product)"
              class="btn-add-cart tw-mt-auto tw-flex tw-items-center tw-gap-2 tw-px-4 tw-py-2 tw-rounded-lg tw-bg-red-600 tw-text-white hover:tw-bg-red-700 tw-transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="tw-w-4 tw-h-4"
              >
                <path
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span class="tw-text-sm tw-font-medium">Thêm vào giỏ</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="cart-main tw-py-20 tw-flex tw-gap-3 tw-flex-col tw-items-center tw-justify-center"
      >
        <div class="nothing-in-cart">
          <img
            src="https://cdn2.cellphones.com.vn/x,webp/media/cart/Cart-empty-v2.png"
            alt=""
          />
        </div>
        <div class="sub-text tw-text-center">
          <span>Danh sách yêu thích trống.</span>
          <br />
          <span>Hãy chọn thêm sản phẩm để mua sắm nhé</span>
        </div>
        <router-link to="/" class="btn-browse tw-mt-4">
          <span>Khám phá sản phẩm</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { $axios } from '@/plugins/axios/axios';
import { formatMoney } from '@/utils/formatMoney';

interface Product {
  _id: string;
  name: string;
  slug?: string;
  price: number;
  basePrice?: number;
  images?: { imageUrl: string; colorId?: string }[];
  productVariants?: any[];
}

interface WishlistItem {
  _id: string;
  product: Product;
  variantId?: string;
  colorId?: string;
  memoryId?: string;
  addedAt: string;
}

const wishlistItems = ref<WishlistItem[]>([]);
const isLoading = ref(false);

const totalWishlistValue = computed(() => {
  return wishlistItems.value.reduce((sum, item) => {
    return sum + (item.product?.price || 0);
  }, 0);
});

const getVariantName = (item: WishlistItem) => {
  if (!item.product?.productVariants) return "";

  const variant = item.product.productVariants.find(
    (v: any) =>
      String(v._id || v.id) === String(item.variantId) ||
      (String(v.colorId?._id || v.colorId?.id || v.color?.id) ===
        String(item.colorId) &&
        String(v.memoryId?._id || v.memoryId?.id || v.memory?.id) ===
          String(item.memoryId))
  );

  if (variant) {
    // Handle both populated object and direct property structure if necessary
    const colorName = variant.colorId?.name || variant.color?.name || "";
    const ram = variant.memoryId?.ram || variant.memory?.ram || "";
    const rom = variant.memoryId?.rom || variant.memory?.rom || "";

    const parts = [];
    if (ram || rom) parts.push(`${ram}/${rom}`);
    if (colorName) parts.push(colorName);

    return parts.length > 0 ? parts.join(" ") : "";
  }
  return "";
};

const getVariantImage = (item: WishlistItem) => {
  if (item.colorId && item.product?.images) {
    const variantImage = item.product.images.find(
      (img) => String(img.colorId) === String(item.colorId)
    );
    if (variantImage) return variantImage.imageUrl;
  }
  return item.product?.images?.[0]?.imageUrl || '/placeholder.jpg';
};

const fetchWishlist = async () => {
  isLoading.value = true;
  try {
    const wishlistResponse = await $axios.get("/user/wishlist");
    const wishlistData = wishlistResponse.data.data || wishlistResponse.data;

    console.log("📋 Wishlist data:", wishlistData);

    if (
      !wishlistData ||
      !wishlistData.items ||
      wishlistData.items.length === 0
    ) {
      wishlistItems.value = [];
      return;
    }

    // Fetch product details for each item from productservice
    const productPromises = wishlistData.items.map(async (item: any) => {
      try {
        // ✅ Fix: Use /product/id/:id endpoint to avoid matching /product/:slug
        const productResponse = await $axios.get(`/product/id/${item.product}`);
        const productData = productResponse.data.data || productResponse.data;

        // If item has variant info, find the specific variant details
        let variantInfo: any = null;
        if (item.variantId && productData.productVariants) {
          variantInfo = productData.productVariants.find(
            (v: any) => String(v._id || v.id) === String(item.variantId)
          );
        } else if (
          item.colorId &&
          item.memoryId &&
          productData.productVariants
        ) {
          variantInfo = productData.productVariants.find(
            (v: any) =>
              String(v.color?.id || v.color?._id) === String(item.colorId) &&
              String(v.memory?.id || v.memory?._id) === String(item.memoryId)
          );
        }

        // Construct product with variant details
        const productWithVariant = {
          ...productData,
          price:
            variantInfo?.price || productData.price || productData.basePrice,
          images: variantInfo?.images || productData.images,
        };

        return {
          _id: item._id,
          product: productWithVariant,
          variantId: item.variantId,
          colorId: item.colorId,
          memoryId: item.memoryId,
          addedAt: item.addedAt,
        };
      } catch (error: any) {
        // ✅ Self-healing: Auto-remove invalid items (404)
        const isNotFound =
          error?.response?.status === 404 ||
          error?.message === "Product not found" ||
          error?.status === 404;

        if (isNotFound) {
          console.warn(
            `⚠️ Product ${item.product} not found. Auto-removing from wishlist...`
          );
          try {
            await $axios.delete(`/user/wishlist/${item.product}`);
          } catch (deleteError) {
            console.error("❌ Failed to auto-remove item:", deleteError);
          }
        } else {
          console.error(`❌ Error fetching product ${item.product}:`, error);
        }
        return null;
      }
    });

    const products = await Promise.all(productPromises);
    wishlistItems.value = products.filter(
      (item) => item !== null
    ) as WishlistItem[];

    console.log("✅ Wishlist items with products:", wishlistItems.value);
  } catch (error: any) {
    console.error("❌ Lỗi khi tải wishlist:", error);
  } finally {
    isLoading.value = false;
  }
};

const handleRemoveFromWishlist = async (itemId: string) => {
  if (!itemId) return;

  if (!confirm("Bạn có chắc muốn xóa sản phẩm này khỏi danh sách yêu thích?")) {
    return;
  }

  try {
    // Call delete with the specific Item ID
    await $axios.delete(`/user/wishlist/${itemId}`);
    await fetchWishlist();
    showToast("Đã xóa khỏi danh sách yêu thích", "success");
  } catch (error: any) {
    console.error("❌ Lỗi khi xóa:", error);
    showToast(
      error.response?.data?.message || "Không thể xóa sản phẩm",
      "error"
    );
  }
};

const handleAddToCart = async (product: Product) => {
  if (!product) return;

  try {
    await $axios.post("/cart", {
      productId: product._id,
      quantity: 1,
    });
    showToast("Đã thêm vào giỏ hàng!", "success");
  } catch (error: any) {
    console.error("❌ Lỗi khi thêm vào giỏ:", error);
    showToast(
      error.response?.data?.message || "Không thể thêm vào giỏ hàng",
      "error"
    );
  }
};

// Toast notification function
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

onMounted(() => {
  fetchWishlist();
});
</script>

<route lang="yaml">
name: Sản phẩm yêu thích
meta:
  requiresAuth: true
  layout: "accountLayout"
</route>

<style lang="scss" scoped>
.wishlist-page {
  .wishlist-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 30px;
    border-radius: 20px;
    margin-bottom: 20px;
    color: white;

    .header-content {
      display: flex;
      align-items: center;
      gap: 20px;

      .header-icon {
        width: 50px;
        height: 50px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;

        svg {
          width: 28px;
          height: 28px;
        }
      }

      .header-text {
        .header-title {
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 4px 0;
        }

        .header-subtitle {
          font-size: 14px;
          opacity: 0.9;
          margin: 0;
        }
      }
    }
  }

  .cart-main {
    .cart-product {
      background-color: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 15px;
      transition: box-shadow 0.2s;

      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      }

      &__left {
        .product-img {
          height: 100px;
          width: 100px;
          border-radius: 8px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .product-desc {
          &--name {
            font-size: 16px;
            font-weight: 500;
            color: #333;
            text-decoration: none;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          &--option {
            font-size: 13px;
            color: #666;
          }

          &__price {
            &--show {
              font-size: 16px;
              font-weight: 700;
              color: #d70018;
            }

            &--throw {
              font-size: 14px;
              font-weight: 400;
              color: #999;
              text-decoration: line-through;
            }
          }
        }
      }

      &__right {
        .remove-btn {
          cursor: pointer;
          padding: 4px;

          svg {
            height: 20px;
            width: 20px;
            fill: #999;
            transition: fill 0.2s;
          }

          &:hover svg {
            fill: #d70018;
          }
        }
      }
    }
  }

  .loading-spinner {
    animation: spin 1s linear infinite;
    svg {
      width: 24px;
      height: 24px;
      color: #667eea;
    }
  }

  .btn-browse {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 14px;
    transition: transform 0.2s;

    &:hover {
      transform: translateY(-2px);
    }
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
