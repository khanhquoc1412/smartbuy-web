<template>
  <div
    v-if="isOpen"
    class="tw-fixed tw-inset-0 tw-z-[1000] tw-flex tw-items-center tw-justify-center tw-bg-black tw-bg-opacity-50 tw-p-4"
    @click.self="closeModal"
  >
    <div
      class="tw-bg-white tw-rounded-2xl tw-w-full tw-max-w-2xl tw-max-h-[90vh] tw-overflow-hidden tw-shadow-2xl"
    >
      <!-- Header -->
      <div class="tw-flex tw-items-center tw-justify-between tw-p-6 tw-border-b tw-bg-gray-50">
        <div class="tw-flex tw-items-center tw-gap-4">
          <img
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='75' font-size='75'%3E⭐%3C/text%3E%3C/svg%3E"
            alt="Review"
            class="tw-w-12 tw-h-12"
          />
          <div>
            <h2 class="tw-text-xl tw-font-bold tw-text-gray-900">
              Đánh giá & nhận xét
            </h2>
            <p class="tw-text-sm tw-text-gray-600 tw-mt-1">
              {{ productName }}
            </p>
          </div>
        </div>
        <button
          @click="closeModal"
          class="tw-text-gray-400 hover:tw-text-gray-600 tw-transition"
        >
          <svg
            class="tw-w-6 tw-h-6"
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
      </div>

      <!-- Body -->
      <div class="tw-p-6 tw-overflow-y-auto tw-max-h-[calc(90vh-140px)]">
        <form @submit.prevent="submitReview">
          <!-- Rating -->
          <div class="tw-mb-6">
            <label class="tw-block tw-text-sm tw-font-semibold tw-text-gray-700 tw-mb-3">
              Đánh giá chung
            </label>
            <div class="tw-flex tw-items-center tw-gap-2">
              <button
                v-for="star in 5"
                :key="star"
                type="button"
                @click="rating = star"
                @mouseenter="hoverRating = star"
                @mouseleave="hoverRating = 0"
                class="tw-text-4xl tw-transition-all tw-transform hover:tw-scale-110"
                :class="
                  star <= (hoverRating || rating)
                    ? 'tw-text-amber-400'
                    : 'tw-text-gray-300'
                "
              >
                ★
              </button>
              <span
                v-if="rating > 0"
                class="tw-ml-2 tw-text-sm tw-font-medium tw-text-gray-700"
              >
                {{ getRatingText(rating) }}
              </span>
            </div>
            <p v-if="errors.rating" class="tw-text-crimson-500 tw-text-sm tw-mt-1">
              {{ errors.rating }}
            </p>
          </div>

          <!-- Comment -->
          <div class="tw-mb-6">
            <label
              for="comment"
              class="tw-block tw-text-sm tw-font-semibold tw-text-gray-700 tw-mb-2"
            >
              Xin mời chia sẻ một số cảm nhận về sản phẩm (nhập tối thiểu 15 kí tự)
            </label>
            <textarea
              id="comment"
              v-model="comment"
              rows="5"
              placeholder="Ví dụ: Sản phẩm rất tốt, pin trâu, camera đẹp..."
              class="tw-w-full tw-px-4 tw-py-3 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 tw-resize-none"
              :class="{ 'tw-border-crimson-500': errors.comment }"
            ></textarea>
            <div class="tw-flex tw-justify-between tw-items-center tw-mt-1">
              <p v-if="errors.comment" class="tw-text-crimson-500 tw-text-sm">
                {{ errors.comment }}
              </p>
              <p class="tw-text-sm tw-text-gray-500 tw-ml-auto">
                {{ comment.length }} ký tự
              </p>
            </div>
          </div>

          <!-- Images Upload -->
          <div class="tw-mb-6">
            <label class="tw-block tw-text-sm tw-font-semibold tw-text-gray-700 tw-mb-2">
              Thêm hình ảnh
            </label>
            <div class="tw-flex tw-gap-3 tw-flex-wrap">
              <!-- Preview Images -->
              <div
                v-for="(image, index) in imagePreview"
                :key="index"
                class="tw-relative tw-w-24 tw-h-24 tw-rounded-lg tw-overflow-hidden tw-border-2 tw-border-gray-200"
              >
                <img
                  :src="image"
                  alt="Preview"
                  class="tw-w-full tw-h-full tw-object-cover"
                />
                <button
                  type="button"
                  @click="removeImage(index)"
                  class="tw-absolute tw-top-1 tw-right-1 tw-bg-crimson-500 tw-text-white tw-rounded-full tw-w-6 tw-h-6 tw-flex tw-items-center tw-justify-center hover:tw-bg-crimson-600 tw-transition"
                >
                  ×
                </button>
              </div>

              <!-- Upload Button -->
              <label
                v-if="imagePreview.length < 5"
                class="tw-w-24 tw-h-24 tw-border-2 tw-border-dashed tw-border-gray-300 tw-rounded-lg tw-flex tw-flex-col tw-items-center tw-justify-center tw-cursor-pointer hover:tw-border-blue-500 hover:tw-bg-blue-50 tw-transition"
              >
                <svg
                  class="tw-w-8 tw-h-8 tw-text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span class="tw-text-xs tw-text-gray-500 tw-mt-1">Thêm ảnh</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  class="tw-hidden"
                  @change="handleImageUpload"
                />
              </label>
            </div>
            <p class="tw-text-xs tw-text-gray-500 tw-mt-2">
              Tối đa 5 hình ảnh
            </p>
          </div>

          <!-- Submit Button -->
          <div class="tw-flex tw-gap-3 tw-pt-4 tw-border-t">
            <button
              type="button"
              @click="closeModal"
              class="tw-flex-1 tw-px-6 tw-py-3 tw-border tw-border-gray-300 tw-rounded-lg tw-font-semibold tw-text-gray-700 hover:tw-bg-gray-50 tw-transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="tw-flex-1 tw-px-6 tw-py-3 tw-bg-crimson-600 tw-text-white tw-rounded-lg tw-font-semibold hover:tw-bg-crimson-700 tw-transition disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
            >
              {{ isSubmitting ? 'Đang gửi...' : 'GỬI ĐÁNH GIÁ' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Toast Notification -->
    <div
      v-if="showToast"
      class="tw-fixed tw-top-4 tw-right-4 tw-z-[1010] tw-animate-bounce"
    >
      <div
        class="tw-px-6 tw-py-4 tw-rounded-lg tw-shadow-lg tw-flex tw-items-center tw-gap-3"
        :class="toastType === 'success' ? 'tw-bg-green-500 tw-text-white' : 'tw-bg-crimson-500 tw-text-white'"
      >
        <svg
          v-if="toastType === 'success'"
          class="tw-w-6 tw-h-6"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
        <svg
          v-else
          class="tw-w-6 tw-h-6"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="tw-font-medium">{{ toastMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { createReview } from '@/api/review/review';
import { useAuth } from '@/composables/useAuth';

interface Props {
  productId: string;
  productName: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  success: [];
}>();

const { userId, user, getUserInfo } = useAuth();

const isOpen = ref(true);
const rating = ref(0);
const hoverRating = ref(0);
const comment = ref('');
const images = ref<string[]>([]);
const imagePreview = ref<string[]>([]);
const isSubmitting = ref(false);
const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref<'success' | 'error'>('success');
const errors = ref<{
  rating?: string;
  comment?: string;
}>({});

const getRatingText = (r: number): string => {
  const texts: Record<number, string> = {
    1: 'Rất tệ',
    2: 'Tệ',
    3: 'Bình thường',
    4: 'Tốt',
    5: 'Tuyệt vời',
  };
  return texts[r] || '';
};

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (!files) return;

  Array.from(files).forEach((file) => {
    if (imagePreview.value.length >= 5) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      imagePreview.value.push(result);
      images.value.push(result);
    };
    reader.readAsDataURL(file);
  });
};

const removeImage = (index: number) => {
  imagePreview.value.splice(index, 1);
  images.value.splice(index, 1);
};

const validateForm = (): boolean => {
  errors.value = {};
  let isValid = true;

  if (rating.value === 0) {
    errors.value.rating = 'Vui lòng chọn đánh giá sao';
    isValid = false;
  }

  if (comment.value.trim().length < 15) {
    errors.value.comment = 'Vui lòng nhập tối thiểu 15 ký tự';
    isValid = false;
  }

  return isValid;
};

const submitReview = async () => {
  if (!validateForm()) return;

  if (!userId.value) {
    showToastNotification('Vui lòng đăng nhập để đánh giá sản phẩm', 'error');
    return;
  }

  // Ensure user info is loaded
  if (!user.value || !user.value.userName) {
    showToastNotification('Đang tải thông tin người dùng, vui lòng thử lại', 'error');
    return;
  }

  try {
    isSubmitting.value = true;

    const reviewData = {
      userId: userId.value,
      productId: props.productId,
      productName: props.productName,
      rating: rating.value,
      comment: comment.value.trim(),
      userName: user.value.userName,
      images: images.value,
    };

    await createReview(reviewData);
    
    showToastNotification('Gửi đánh giá thành công!', 'success', 1500);
    setTimeout(() => {
      emit('success');
      closeModal();
    }, 1500);
  } catch (error: any) {
    console.error('Error submitting review:', error);
    showToastNotification(error.response?.data?.message || 'Mỗi tài khoản chỉ được gửi một đánh giá cho mỗi sản phẩm', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

const showToastNotification = (message: string, type: 'success' | 'error', duration: number = 3000) => {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, duration);
};

const closeModal = () => {
  isOpen.value = false;
  emit('close');
};

// Load user info when modal opens
onMounted(async () => {
  if (userId.value && (!user.value || !user.value.userName)) {
    try {
      await getUserInfo(userId.value);
    } catch (error) {
      console.error('Error loading user info:', error);
    }
  }
});
</script>

<style scoped>
/* Add any additional styles here */
</style>
