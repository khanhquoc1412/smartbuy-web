<template>
  <div
    class="app-header tw-bg-red tw-fixed tw-w-full"
    :class="{ 'app-header-scrolled': isScrolled }"
  >
    <Container class="container tw-transition-all tw-h-20">
      <header
        class="tw-w-full tw-flex tw-justify-between tw-h-full tw-items-center tw-gap-9"
      >
        <div
          class="header-left tw-h-full tw-transition-all tw-flex tw-justify-center tw-items-center"
        >
          <router-link
            to="/"
            class="header-logo tw-transition-all tw-h-12 tw-w-auto"
          >
            <img :src="Logo" alt="" class="tw-w-auto tw-h-full" />
          </router-link>
        </div>
        <form
          class="header-search tw-flex-1 tw-relative"
          @submit.prevent="handleSearch"
          ref="searchContainer"
        >
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm"
            v-model="keyword"
            @focus="showSuggestions = true"
            class="tw-h-11 tw-rounded tw-transition-all tw-w-full tw-px-3 focus:tw-border-none tw-bg-white/20 tw-border tw-border-white/30 tw-placeholder-white tw-outline-none"
          />

          <!-- Search Suggestions Dropdown -->
          <div
            v-if="
              showSuggestions &&
              (suggestions.keywords.length > 0 ||
                suggestions.products.length > 0)
            "
            class="search-suggestions tw-absolute tw-top-full tw-left-0 tw-w-full tw-bg-white tw-rounded-b-md tw-shadow-lg tw-z-50 tw-mt-1 tw-overflow-hidden"
          >
            <!-- Keywords Section -->
            <div
              v-if="suggestions.keywords.length > 0"
              class="tw-bg-gray-50 tw-p-2"
            >
              <div class="tw-text-xs tw-text-gray-500 tw-mb-2 tw-px-2">
                Có phải bạn muốn tìm
              </div>
              <div
                v-for="(item, index) in suggestions.keywords"
                :key="index"
                class="tw-px-2 tw-py-1.5 tw-text-sm tw-text-gray-700 hover:tw-bg-gray-200 tw-cursor-pointer tw-rounded"
                @click="handleKeywordClick(item)"
              >
                {{ item }}
              </div>
            </div>

            <!-- Products Section -->
            <div v-if="suggestions.products.length > 0" class="tw-p-2">
              <div class="tw-text-xs tw-text-gray-500 tw-mb-2 tw-px-2">
                Sản phẩm gợi ý
              </div>
              <div
                v-for="product in suggestions.products"
                :key="product.id"
                class="tw-flex tw-gap-3 tw-p-2 hover:tw-bg-gray-100 tw-cursor-pointer tw-rounded tw-items-center"
                @click="handleProductClick(product.slug)"
              >
                <img
                  :src="product.thumbUrl"
                  :alt="product.name"
                  class="tw-w-10 tw-h-10 tw-object-cover tw-rounded"
                />
                <div class="tw-flex-1">
                  <div
                    class="tw-text-sm tw-font-medium tw-text-gray-800 tw-line-clamp-1"
                  >
                    {{ product.name }}
                  </div>
                  <div class="tw-flex tw-gap-2 tw-items-center">
                    <span class="tw-text-red-500 tw-text-sm tw-font-bold">{{
                      formatMoney(product.price)
                    }}</span>
                    <span
                      v-if="
                        product.discountPercentage &&
                        product.discountPercentage > 0
                      "
                      class="tw-text-xs tw-text-gray-400 tw-line-through"
                    >
                      {{
                        formatMoney(
                          (product.price * (100 + product.discountPercentage)) /
                            100
                        )
                      }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
        <div class="header-right">
          <div class="header-item tw-h-full tw-flex tw-gap-2">
            <div
              class="header-right-box tw-transition-all tw-flex tw-gap-2 tw-items-center tw-flex-row tw-text-white"
            >
              <div class="box-icon">
                <font-awesome-icon icon="headset" />
              </div>
              <div class="box-text tw-flex tw-flex-col tw-font-normal">
                <span> Hotline </span>
                <span> 1900.9999 </span>
              </div>
            </div>
            <router-link
              to="/cart"
              class="header-right-box tw-transition-all tw-flex tw-gap-2 tw-items-center tw-flex-row tw-text-white"
            >
              <div class="box-icon tw-relative">
                <font-awesome-icon icon="cart-plus" />
                <span
                  class="cart-badge tw-absolute tw--top-4 tw--right-3 tw-bg-yellow-500 tw-text-white tw-text-[14px] tw-font-bold tw-rounded-full tw-h-5 tw-w-5 tw-flex tw-items-center tw-justify-center"
                >
                  {{ totalItems }}
                </span>
              </div>
              <div class="box-text tw-flex tw-flex-col tw-font-normal">
                <span> Giỏ </span>
                <span> hàng </span>
              </div>
            </router-link>
            <router-link
              v-if="loggedIn"
              to="/account"
              class="header-right-box header-right-box__login tw-transition-all tw-flex tw-gap-2 tw-items-center tw-flex-row tw-text-white"
            >
              <div class="box-icon">
                <font-awesome-icon icon="fa-regular fa-user" />
              </div>
              <div class="box-text tw-flex tw-flex-col tw-font-normal">
                <span> Tài </span>
                <span> khoản </span>
              </div>
            </router-link>
            <router-link
              v-else
              to="/login"
              class="header-right-box header-right-box__login tw-transition-all tw-flex tw-gap-2 tw-items-center tw-flex-row tw-text-white"
            >
              <div class="box-icon">
                <font-awesome-icon icon="fa-regular fa-user" />
              </div>
              <div class="box-text tw-flex tw-flex-col tw-font-normal">
                <span> Đăng </span>
                <span> nhập </span>
              </div>
            </router-link>
          </div>
        </div>
      </header>
    </Container>
  </div>
</template>

<script lang="ts" setup>
import Container from "@components/base/Container.vue";
import Logo from "@assets/svg/logo6.svg";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { ICategory, IHeaderItem } from "@/types/category.types";
import { useAuth } from "@composables/useAuth";
import { onClickOutside } from "@vueuse/core";
import { formatMoney } from "@/utils/formatMoney";
import { getImageUrl } from "@/utils/imageUrl";

const { loggedIn, user } = useAuth();
const { totalItems } = useCart();
const router = useRouter();
const keyword = ref<string>("");
const isScrolled = ref(false);

// Search Suggestions State
const showSuggestions = ref(false);
const suggestions = ref({
  keywords: [] as string[],
  products: [] as any[],
});
const searchContainer = ref(null);
let debounceTimeout: any = null;

// Close suggestions when clicking outside
onClickOutside(searchContainer, () => {
  showSuggestions.value = false;
});

// Watch keyword for suggestions
watch(keyword, (newVal) => {
  if (debounceTimeout) clearTimeout(debounceTimeout);

  if (!newVal || newVal.trim().length < 2) {
    suggestions.value = { keywords: [], products: [] };
    return;
  }

  debounceTimeout = setTimeout(async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/product/suggestions?keyword=${encodeURIComponent(
          newVal
        )}`
      );
      const data = await response.json();
      if (data.success) {
        suggestions.value = {
          keywords: data.keywords || [],
          products: data.products || [],
        };
        showSuggestions.value = true;
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  }, 300); // Debounce 300ms
});

const handleKeywordClick = (item: string) => {
  keyword.value = item;
  showSuggestions.value = false;
  handleSearch();
};

const handleProductClick = (slug: string) => {
  showSuggestions.value = false;
  keyword.value = "";
  router.push(`/product/${slug}`);
};
// const handleSearch = () => {
//   router.push(`/search/${keyword.value}`);
// };

// ✅ Handle search submission
const handleSearch = () => {
  const searchTerm = keyword.value.trim();

  if (!searchTerm) {
    return;
  }

  showSuggestions.value = false;
  // Navigate to search results page with 'keyword' param
  router.push(`/search?keyword=${encodeURIComponent(searchTerm)}`);
  keyword.value = ""; // Clear search input
};

// ✅ Handle scroll event for header shrinking
onMounted(() => {
  window.addEventListener("scroll", () => {
    isScrolled.value = window.scrollY > 50;
  });
});
</script>

<style scoped lang="scss">
.app-header {
  z-index: 998;

  &.app-header-scrolled {
    height: 60px;
    padding: 5px 0 !important;

    .container {
      height: 50px;
    }

    .header-logo {
      height: 30px;
    }

    .header-right-box {
      font-size: 11px !important;
      line-height: 125%;
      padding: 3px 5px;

      .box-icon {
        font-size: 13px !important;
      }

      .box-text {
        gap: 5px;
      }

      &:hover,
      &__login {
        background-color: hsla(0, 0%, 100%, 0.2);
        border-radius: 8px;
      }
    }
  }

  header {
    .header-search {
      input {
        padding-right: 120px;
        // Space for button
        color: white;
        &::placeholder {
          color: white;
        }

        &:focus {
          box-shadow: 0 0 0 2px rgba(235, 231, 231, 0.2);
        }
      }
    }

    .header-right {
      .header-item {
        .header-right-box {
          font-size: 13px;
          line-height: 125%;
          padding: 3px 5px;

          .box-icon {
            font-size: 18px;
          }

          .box-text {
            gap: 5px;
          }

          &:hover,
          &__login {
            background-color: hsla(0, 0%, 100%, 0.2);
            border-radius: 8px;
          }
        }
      }
    }
  }
}
</style>
