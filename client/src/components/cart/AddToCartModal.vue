<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="tw-fixed tw-inset-0 tw-z-[9999] tw-flex tw-items-center tw-justify-center"
      >
        <!-- Backdrop -->
        <div
          class="tw-absolute tw-inset-0 tw-bg-black/50 tw-backdrop-blur-sm"
          @click="close"
        ></div>

        <!-- Modal Content -->
        <div
          class="tw-relative tw-bg-white tw-rounded-2xl tw-shadow-2xl tw-max-w-lg tw-w-full tw-mx-4 tw-overflow-hidden"
          @click.stop
        >
          <!-- Close Button -->
          <button
            @click="close"
            class="tw-absolute tw-top-4 tw-right-4 tw-w-8 tw-h-8 tw-flex tw-items-center tw-justify-center tw-rounded-full tw-bg-gray-100 hover:tw-bg-gray-200 tw-transition-colors tw-z-10"
          >
            <svg
              class="tw-w-5 tw-h-5 tw-text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <!-- Success Header -->
          <div
            class="tw-bg-gradient-to-r tw-from-green-50 tw-to-emerald-50 tw-p-6 tw-text-center tw-border-b"
          >
            <div
              class="tw-inline-flex tw-items-center tw-justify-center tw-w-16 tw-h-16 tw-bg-white tw-rounded-full tw-shadow-lg tw-mb-3"
            >
              <svg
                class="tw-w-8 tw-h-8 tw-text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 class="tw-text-2xl tw-font-bold tw-text-gray-900 tw-mb-1">
              Thêm vào giỏ hàng thành công!
            </h3>
            <p class="tw-text-sm tw-text-gray-600">
              Giỏ hàng hiện có
              <span class="tw-font-semibold tw-text-green-600">{{
                totalItems
              }}</span>
              sản phẩm
            </p>
          </div>

          <!-- Product Details -->
          <div v-if="productInfo" class="tw-p-6">
            <div class="tw-flex tw-gap-4 tw-mb-6">
              <!-- Product Image -->
              <div class="tw-flex-shrink-0">
                <img
                  :src="productInfo.image"
                  :alt="productInfo.name"
                  class="tw-w-24 tw-h-24 tw-object-cover tw-rounded-xl tw-border-2 tw-border-gray-100"
                  @error="handleImageError"
                />
              </div>

              <!-- Product Info -->
              <div class="tw-flex-1">
                <h4
                  class="tw-font-bold tw-text-gray-900 tw-text-lg tw-mb-2 tw-line-clamp-2"
                >
                  {{ productInfo.name }}
                </h4>

                <!-- Variant Info -->
                <div class="tw-space-y-1 tw-mb-3">
                  <div
                    v-if="productInfo.color"
                    class="tw-flex tw-items-center tw-gap-2 tw-text-sm"
                  >
                    <span class="tw-text-gray-500">Màu sắc:</span>
                    <span class="tw-font-medium tw-text-gray-900">{{
                      productInfo.color
                    }}</span>
                  </div>
                  <div
                    v-if="productInfo.memory"
                    class="tw-flex tw-items-center tw-gap-2 tw-text-sm"
                  >
                    <span class="tw-text-gray-500">Cấu hình:</span>
                    <span class="tw-font-medium tw-text-gray-900">{{
                      productInfo.memory
                    }}</span>
                  </div>
                </div>

                <!-- Price -->
                <div class="tw-flex tw-items-baseline tw-gap-2">
                  <span class="tw-text-2xl tw-font-bold tw-text-red-600">
                    {{ formatMoney(productInfo.price) }}
                  </span>
                  <span class="tw-text-sm tw-text-gray-500">/sản phẩm</span>
                </div>
              </div>
            </div>

            <!-- Quantity Selector -->
            <div class="tw-bg-gray-50 tw-rounded-xl tw-p-4 tw-mb-4">
              <div class="tw-flex tw-items-center tw-justify-between tw-mb-3">
                <label class="tw-text-sm tw-font-medium tw-text-gray-700">
                  Số lượng:
                </label>
                <div class="tw-flex tw-items-center tw-gap-3">
                  <button
                    @click="decreaseQuantity"
                    :disabled="localQuantity <= 1"
                    class="tw-w-8 tw-h-8 tw-flex tw-items-center tw-justify-center tw-rounded-lg tw-bg-white tw-border tw-border-gray-300 hover:tw-bg-gray-50 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed tw-transition-colors"
                  >
                    <svg
                      class="tw-w-4 tw-h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M20 12H4"
                      />
                    </svg>
                  </button>

                  <input
                    v-model.number="localQuantity"
                    type="number"
                    min="1"
                    :max="maxQuantity"
                    class="tw-w-16 tw-h-8 tw-text-center tw-border tw-border-gray-300 tw-rounded-lg tw-font-semibold focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-red-500"
                    @input="validateQuantity"
                  />

                  <button
                    @click="increaseQuantity"
                    :disabled="localQuantity >= maxQuantity"
                    class="tw-w-8 tw-h-8 tw-flex tw-items-center tw-justify-center tw-rounded-lg tw-bg-white tw-border tw-border-gray-300 hover:tw-bg-gray-50 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed tw-transition-colors"
                  >
                    <svg
                      class="tw-w-4 tw-h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Stock Info -->
              <div
                class="tw-text-xs tw-text-gray-500 tw-flex tw-items-center tw-gap-1"
              >
                <svg
                  class="tw-w-4 tw-h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Còn {{ maxQuantity }} sản phẩm</span>
              </div>
            </div>

            <!-- Total Price -->
            <div
              class="tw-bg-gradient-to-r tw-from-red-50 tw-to-orange-50 tw-rounded-xl tw-p-4 tw-border tw-border-red-100"
            >
              <div class="tw-flex tw-items-center tw-justify-between">
                <div>
                  <p class="tw-text-sm tw-text-gray-600 tw-mb-1">Tổng tiền</p>
                  <p class="tw-text-xs tw-text-gray-500">
                    {{ localQuantity }} sản phẩm
                  </p>
                </div>
                <div class="tw-text-right">
                  <p class="tw-text-3xl tw-font-bold tw-text-red-600">
                    {{ formatMoney(totalAmount) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="tw-px-6 tw-pb-6 tw-flex tw-gap-3">
            <button
              @click="close"
              class="tw-flex-1 tw-px-6 tw-py-3 tw-bg-white tw-border-2 tw-border-gray-300 tw-rounded-xl tw-font-semibold tw-text-gray-700 hover:tw-bg-gray-50 hover:tw-border-gray-400 tw-transition-all tw-duration-200"
            >
              Tiếp tục mua hàng
            </button>
            <button
              @click="handleAddAndGoToCart"
              :disabled="isUpdating"
              class="tw-flex-1 tw-px-6 tw-py-3 tw-bg-gradient-to-r tw-from-red-600 tw-to-red-700 tw-rounded-xl tw-font-semibold tw-text-white hover:tw-from-red-700 hover:tw-to-red-800 tw-shadow-lg hover:tw-shadow-xl tw-transition-all tw-duration-200 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed tw-flex tw-items-center tw-justify-center tw-gap-2"
            >
              <svg
                v-if="!isUpdating"
                class="tw-w-5 tw-h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span v-if="isUpdating">Đang xử lý...</span>
              Xem giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { formatMoney } from "@/utils/formatMoney";

interface ProductInfo {
  name: string;
  image: string;
  price: number;
  quantity: number;
  color?: string;
  memory?: string;
  maxStock?: number;
}

interface Props {
  isOpen: boolean;
  productInfo: ProductInfo | null;
  totalItems: number;
}

interface Emits {
  (e: "close"): void;
  (e: "update-quantity", quantity: number): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const router = useRouter();

// Local state
const localQuantity = ref(1);
const isUpdating = ref(false);

// Computed
const maxQuantity = computed(() => props.productInfo?.maxStock || 99);

const totalAmount = computed(() => {
  if (!props.productInfo) return 0;
  return props.productInfo.price * localQuantity.value;
});

// Watch for productInfo changes
watch(
  () => props.productInfo,
  (newInfo) => {
    if (newInfo) {
      localQuantity.value = newInfo.quantity || 1;
    }
  },
  { immediate: true }
);

// Methods
const validateQuantity = () => {
  if (localQuantity.value < 1) {
    localQuantity.value = 1;
  }
  if (localQuantity.value > maxQuantity.value) {
    localQuantity.value = maxQuantity.value;
  }
};

const increaseQuantity = () => {
  if (localQuantity.value < maxQuantity.value) {
    localQuantity.value++;
  }
};

const decreaseQuantity = () => {
  if (localQuantity.value > 1) {
    localQuantity.value--;
  }
};

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  target.src = "/placeholder-product.png";
};

const close = () => {
  emit("close");
};

const handleAddAndGoToCart = async () => {
  // Nếu số lượng thay đổi, emit event để update
  if (localQuantity.value !== props.productInfo?.quantity) {
    isUpdating.value = true;
    emit("update-quantity", localQuantity.value);

    // Giả lập delay để UX tốt hơn
    await new Promise((resolve) => setTimeout(resolve, 300));
    isUpdating.value = false;
  }

  close();
  router.push("/cart");
};
</script>

<style scoped>
/* Hide number input arrows */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .tw-relative,
.modal-leave-active .tw-relative {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-enter-from .tw-relative {
  transform: scale(0.9) translateY(-20px);
}

.modal-leave-to .tw-relative {
  transform: scale(0.95) translateY(10px);
}
</style>
