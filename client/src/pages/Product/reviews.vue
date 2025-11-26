<template>
  <div class="product-all-reviews tw-min-h-screen tw-bg-gray-50">
    <Container>
      <div class="tw-py-6">
        <!-- Breadcrumb -->
        <div class="tw-mb-6">
          <button
            @click="goBack"
            class="tw-flex tw-items-center tw-gap-2 tw-text-gray-600 hover:tw-text-gray-900 tw-transition"
          >
            <svg
              class="tw-w-5 tw-h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>Quay lại</span>
          </button>
        </div>

        <!-- Header -->
        <div class="tw-mb-6">
          <h1 class="tw-text-3xl tw-font-bold tw-text-gray-900">
            Đánh giá sản phẩm
          </h1>
        </div>

        <!-- Rating Summary (Compact) -->
        <div class="tw-bg-white tw-rounded-lg tw-p-6 tw-mb-6 tw-shadow-sm">
          <div class="tw-flex tw-items-center tw-gap-8">
            <div class="tw-text-center">
              <div class="tw-font-bold tw-text-gray-900">
                <span class="tw-text-6xl">{{ stats?.averageRating?.toFixed(1) || '0.0' }}</span>
                <span class="tw-text-xl tw-text-gray-500">/5</span>
              </div>
              <div class="tw-flex tw-gap-1 tw-my-2 tw-justify-center">
                <span
                  v-for="star in 5"
                  :key="star"
                  class="tw-text-2xl"
                  :class="
                    star <= Math.floor(stats?.averageRating || 0)
                      ? 'tw-text-yellow-400'
                      : 'tw-text-gray-300'
                  "
                >
                  ★
                </span>
              </div>
              <div class="tw-text-gray-600">
                {{ stats?.totalReviews || 0 }} lượt đánh giá
              </div>
            </div>

            <div class="tw-flex-1">
              <div
                v-for="rating in [5, 4, 3, 2, 1]"
                :key="rating"
                class="tw-flex tw-items-center tw-gap-3 tw-mb-1"
              >
                <div class="tw-flex tw-items-center tw-gap-1 tw-w-14">
                  <span class="tw-text-sm">{{ rating }}</span>
                  <span class="tw-text-yellow-400 tw-text-sm">★</span>
                </div>
                <div
                  class="tw-flex-1 tw-h-2 tw-bg-gray-200 tw-rounded-full tw-overflow-hidden"
                >
                  <div
                    class="tw-h-full tw-bg-red-500 tw-transition-all"
                    :style="{
                      width: `${getRatingPercentage(rating)}%`,
                    }"
                  ></div>
                </div>
                <div class="tw-text-sm tw-text-gray-600 tw-w-16 tw-text-right">
                  {{ getRatingCount(rating) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Filter Tabs -->
        <div class="tw-flex tw-gap-3 tw-mb-6 tw-flex-wrap">
          <button
            @click="selectedFilter = 'all'"
            class="tw-px-4 tw-py-2 tw-rounded-full tw-border tw-transition"
            :class="
              selectedFilter === 'all'
                ? 'tw-bg-blue-50 tw-border-blue-500 tw-text-blue-600'
                : 'tw-border-gray-300 tw-text-gray-700 hover:tw-border-gray-400'
            "
          >
            Tất cả
          </button>
          <button
            @click="selectedFilter = 'images'"
            class="tw-px-4 tw-py-2 tw-rounded-full tw-border tw-transition"
            :class="
              selectedFilter === 'images'
                ? 'tw-bg-blue-50 tw-border-blue-500 tw-text-blue-600'
                : 'tw-border-gray-300 tw-text-gray-700 hover:tw-border-gray-400'
            "
          >
            Có hình ảnh
          </button>
          <button
            v-for="star in [5, 4, 3, 2, 1]"
            :key="star"
            @click="selectedFilter = star"
            class="tw-px-4 tw-py-2 tw-rounded-full tw-border tw-transition"
            :class="
              selectedFilter === star
                ? 'tw-bg-blue-50 tw-border-blue-500 tw-text-blue-600'
                : 'tw-border-gray-300 tw-text-gray-700 hover:tw-border-gray-400'
            "
          >
            {{ star }} sao
          </button>
        </div>

        <!-- Reviews List -->
        <div v-if="loading" class="tw-text-center tw-py-12">
          <LoadIcon />
        </div>

        <div
          v-else-if="reviews.length === 0"
          class="tw-text-center tw-py-12 tw-text-gray-500"
        >
          Chưa có đánh giá nào
        </div>

        <div v-else class="tw-space-y-4">
          <div
            v-for="review in reviews"
            :key="review._id"
            class="tw-bg-white tw-rounded-lg tw-p-6 tw-shadow-sm"
          >
            <!-- User Info -->
            <div class="tw-flex tw-items-start tw-gap-4 tw-mb-4">
              <div
                class="tw-w-12 tw-h-12 tw-rounded-full tw-bg-gradient-to-br tw-from-blue-500 tw-to-purple-600 tw-flex tw-items-center tw-justify-center tw-text-white tw-font-bold tw-text-lg"
              >
                {{ review.userName.charAt(0).toUpperCase() }}
              </div>
              <div class="tw-flex-1">
                <div class="tw-font-semibold tw-text-gray-900">
                  {{ review.userName }}
                </div>
                <div class="tw-flex tw-items-center tw-gap-2 tw-mt-1">
                  <div class="tw-flex tw-gap-0.5">
                    <span
                      v-for="star in 5"
                      :key="star"
                      class="tw-text-lg"
                      :class="
                        star <= review.rating
                          ? 'tw-text-yellow-400'
                          : 'tw-text-gray-300'
                      "
                    >
                      ★
                    </span>
                  </div>
                  <span class="tw-text-sm tw-text-gray-500">
                    {{ getRatingText(review.rating) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Review Content -->
            <div class="tw-mb-4">
              <p class="tw-text-gray-700 tw-leading-relaxed">
                {{ review.comment }}
              </p>
            </div>

            <!-- Images -->
            <div
              v-if="review.images && review.images.length > 0"
              class="tw-flex tw-gap-2 tw-mb-4 tw-flex-wrap"
            >
              <img
                v-for="(image, index) in review.images"
                :key="index"
                :src="image"
                :alt="`Review image ${index + 1}`"
                class="tw-w-20 tw-h-20 tw-object-cover tw-rounded-lg tw-cursor-pointer hover:tw-opacity-80 tw-transition"
                @click="openLightbox(image)"
              />
            </div>

            <!-- Footer -->
            <div class="tw-flex tw-items-center tw-gap-4 tw-text-sm tw-text-gray-500">
              <span>Đánh giá đã đăng vào {{ formatDate(review.createdAt) }}</span>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div
          v-if="totalPages > 1"
          class="tw-flex tw-justify-center tw-items-center tw-gap-2 tw-mt-8"
        >
          <button
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="tw-px-4 tw-py-2 tw-border tw-rounded-lg disabled:tw-opacity-50 disabled:tw-cursor-not-allowed hover:tw-bg-gray-50"
          >
            ← Trước
          </button>

          <button
            v-for="page in displayPages"
            :key="page"
            @click="goToPage(page)"
            class="tw-px-4 tw-py-2 tw-border tw-rounded-lg tw-transition"
            :class="
              currentPage === page
                ? 'tw-bg-blue-500 tw-text-white tw-border-blue-500'
                : 'hover:tw-bg-gray-50'
            "
          >
            {{ page }}
          </button>

          <button
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="tw-px-4 tw-py-2 tw-border tw-rounded-lg disabled:tw-opacity-50 disabled:tw-cursor-not-allowed hover:tw-bg-gray-50"
          >
            Sau →
          </button>
        </div>
      </div>
    </Container>

    <!-- Image Lightbox Modal -->
    <div
      v-if="showLightbox"
      class="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-90 tw-z-50 tw-flex tw-items-center tw-justify-center"
      @click="closeLightbox"
    >
      <button
        @click="closeLightbox"
        class="tw-absolute tw-top-4 tw-right-4 tw-text-white tw-text-4xl tw-font-bold hover:tw-text-gray-300 tw-transition tw-z-10"
      >
        ×
      </button>
      <img
        :src="selectedImage"
        alt="Review image"
        class="tw-max-w-[90vw] tw-max-h-[90vh] tw-object-contain"
        @click.stop
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Container from '@/components/base/Container.vue';
import LoadIcon from '@/components/common/LoadIcon.vue';
import { getReviewsByProduct, type Review, type ReviewStats } from '@/api/review/review';

const router = useRouter();
const route = useRoute();

const reviews = ref<Review[]>([]);
const stats = ref<ReviewStats | null>(null);
const loading = ref(false);
const selectedFilter = ref<'all' | 'images' | number>('all');
const currentPage = ref(1);
const totalPages = ref(1);
const limit = 20;
const showLightbox = ref(false);
const selectedImage = ref<string>('');

const productId = computed(() => route.params.id as string);

const displayPages = computed(() => {
  const pages: number[] = [];
  const maxDisplay = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxDisplay / 2));
  let end = Math.min(totalPages.value, start + maxDisplay - 1);

  if (end - start < maxDisplay - 1) {
    start = Math.max(1, end - maxDisplay + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

const loadReviews = async () => {
  try {
    loading.value = true;
    const params: any = {
      page: currentPage.value,
      limit: limit,
      sortBy: 'createdAt',
    };

    if (selectedFilter.value !== 'all' && selectedFilter.value !== 'images') {
      params.rating = selectedFilter.value;
    }

    const response = await getReviewsByProduct(productId.value, params);

    if (response.success && response.data) {
      let reviewsList = response.data.reviews;

      // Filter by images if selected
      if (selectedFilter.value === 'images') {
        reviewsList = reviewsList.filter((r) => r.images && r.images.length > 0);
      }

      reviews.value = reviewsList;
      stats.value = response.data.stats || null;
      totalPages.value = response.data.pagination.pages || 1;
    }
  } catch (error) {
    console.error('Error loading reviews:', error);
  } finally {
    loading.value = false;
  }
};

const getRatingCount = (rating: number): number => {
  if (!stats.value) return 0;
  return (stats.value[`rating${rating}` as keyof ReviewStats] as number) || 0;
};

const getRatingPercentage = (rating: number): number => {
  if (!stats.value || !stats.value.totalReviews) return 0;
  const count = getRatingCount(rating);
  return (count / stats.value.totalReviews) * 100;
};

const getRatingText = (rating: number): string => {
  const texts: Record<number, string> = {
    5: 'Tuyệt vời',
    4: 'Tốt',
    3: 'Bình thường',
    2: 'Tệ',
    1: 'Rất tệ',
  };
  return texts[rating] || '';
};

const formatDate = (date: Date): string => {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);

  if (days === 0) return 'Hôm nay';
  if (days === 1) return 'Hôm qua';
  if (days < 7) return `${days} ngày trước`;
  if (days < 30) return `${Math.floor(days / 7)} tuần trước`;
  if (months < 12) return `${months} tháng trước`;
  return d.toLocaleDateString('vi-VN');
};

const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const openLightbox = (imageUrl: string) => {
  selectedImage.value = imageUrl;
  showLightbox.value = true;
};

const closeLightbox = () => {
  showLightbox.value = false;
  selectedImage.value = '';
};

const goBack = () => {
  router.back();
};

watch([selectedFilter], () => {
  currentPage.value = 1;
  loadReviews();
});

watch(currentPage, () => {
  loadReviews();
});

onMounted(() => {
  loadReviews();
});
</script>

<style scoped>
/* Add any additional styles here */
</style>
