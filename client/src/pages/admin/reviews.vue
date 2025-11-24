<template>
  <div class="tw-p-6 tw-bg-white tw-min-h-screen">
    <h1 class="tw-text-2xl tw-font-bold tw-text-crimson-600 tw-mb-4">
      Quản lý đánh giá sản phẩm
    </h1>

    <!-- KPI Cards -->
    <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-4 tw-mb-6">
      <div class="tw-bg-white tw-p-4 tw-rounded-xl tw-shadow-md tw-border tw-border-gray-200">
        <div class="tw-flex tw-flex-col tw-items-center tw-gap-3">
          <div class="tw-bg-amber-100 tw-p-3 tw-rounded-full">
            <svg class="tw-w-6 tw-h-6 tw-text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <div class="tw-text-center">
            <p class="tw-text-sm tw-text-gray-600">Tổng đánh giá</p>
            <p class="tw-text-2xl tw-font-bold tw-text-amber-600">{{ stats.totalReviews || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="tw-bg-white tw-p-4 tw-rounded-xl tw-shadow-md tw-border tw-border-gray-200">
        <div class="tw-flex tw-flex-col tw-items-center tw-gap-3">
          <div class="tw-bg-green-100 tw-p-3 tw-rounded-full">
            <svg class="tw-w-6 tw-h-6 tw-text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="tw-text-center">
            <p class="tw-text-sm tw-text-gray-600">Đang hiển thị</p>
            <p class="tw-text-2xl tw-font-bold tw-text-green-600">{{ visibleCount }}</p>
          </div>
        </div>
      </div>

      <div class="tw-bg-white tw-p-4 tw-rounded-xl tw-shadow-md tw-border tw-border-gray-200">
        <div class="tw-flex tw-flex-col tw-items-center tw-gap-3">
          <div class="tw-bg-crimson-100 tw-p-3 tw-rounded-full">
            <svg class="tw-w-6 tw-h-6 tw-text-crimson-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          </div>
          <div class="tw-text-center">
            <p class="tw-text-sm tw-text-gray-600">Đã ẩn</p>
            <p class="tw-text-2xl tw-font-bold tw-text-crimson-600">{{ hiddenCount }}</p>
          </div>
        </div>
      </div>

      <div class="tw-bg-white tw-p-4 tw-rounded-xl tw-shadow-md tw-border tw-border-gray-200">
        <div class="tw-flex tw-flex-col tw-items-center tw-gap-3">
          <div class="tw-bg-blue-100 tw-p-3 tw-rounded-full">
            <svg class="tw-w-6 tw-h-6 tw-text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <div class="tw-text-center">
            <p class="tw-text-sm tw-text-gray-600">Điểm đánh giá trung bình</p>
            <p class="tw-text-2xl tw-font-bold tw-text-blue-600">{{ stats.averageRating?.toFixed(1) || 0 }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="tw-flex tw-justify-between tw-items-center tw-mb-4">
      <div class="tw-relative tw-flex-1 tw-max-w-2xl">
        <input 
          type="text" 
          v-model="search" 
          @input="debouncedSearch"
          @keyup.enter="loadReviews"
          placeholder="Tìm kiếm theo tên khách hàng, sản phẩm, nội dung..." 
          class="tw-w-full tw-border tw-border-stone-300 tw-p-2 tw-pl-10 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500 focus:tw-border-transparent" 
        />
        <button @click="loadReviews" class="tw-absolute tw-left-3 tw-top-1/2 tw-transform -tw-translate-y-1/2 tw-text-gray-500 hover:tw-text-crimson-600 tw-transition-colors">
          <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>

      <div class="tw-flex tw-gap-2">
        <button 
          @click="refreshData" 
          class="tw-px-4 tw-py-2 tw-bg-white tw-border tw-border-stone-300 tw-text-stone-700 tw-rounded-lg hover:tw-bg-stone-50 tw-transition-colors tw-font-medium tw-flex tw-items-center tw-gap-2">
          <svg class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Làm mới
        </button>
      </div>
    </div>

    <!-- Filter Section -->
    <div class="tw-bg-stone-50 tw-border tw-border-stone-200 tw-rounded-lg tw-p-4 tw-mb-4">
      <div class="tw-flex tw-items-center tw-gap-4 tw-mb-3">
        <h3 class="tw-text-base tw-font-bold tw-text-stone-700">Bộ lọc</h3>
        <button 
          @click="resetFilters" 
          class="tw-px-3 tw-py-1 tw-text-sm tw-bg-white tw-border tw-border-stone-300 tw-rounded-lg hover:tw-bg-stone-100 tw-transition-colors tw-flex tw-items-center tw-gap-2">
          <svg class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Đặt lại bộ lọc
        </button>
      </div>

      <div class="tw-flex tw-flex-wrap tw-gap-3">
        <!-- Filter by Rating -->
        <div class="tw-relative">
          <button 
            @click="toggleDropdown('rating')"
            class="tw-px-4 tw-py-2 tw-bg-white tw-border tw-border-stone-300 tw-rounded-lg hover:tw-bg-stone-50 tw-transition-colors tw-flex tw-items-center tw-gap-2 tw-min-w-[140px]">
            <span class="tw-font-medium">Số sao</span>
            <span v-if="selectedRating" class="tw-bg-amber-100 tw-text-amber-600 tw-px-2 tw-py-0.5 tw-rounded-full tw-text-xs">{{ selectedRating }}★</span>
            <svg class="tw-w-4 tw-h-4 tw-ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div v-if="openDropdown === 'rating'" class="tw-absolute tw-mt-2 tw-bg-white tw-shadow-lg tw-border tw-border-stone-200 tw-rounded-lg tw-p-4 tw-z-10 tw-w-48">
            <div class="tw-space-y-2">
              <button 
                v-for="rating in [5, 4, 3, 2, 1]" 
                :key="rating"
                @click="selectRating(rating)"
                class="tw-w-full tw-px-4 tw-py-2 tw-rounded-lg tw-border tw-transition-colors tw-text-left tw-flex tw-items-center tw-gap-2"
                :class="selectedRating === rating
                  ? 'tw-bg-amber-600 tw-text-white tw-border-amber-600'
                  : 'tw-bg-white tw-text-stone-700 tw-border-stone-300 hover:tw-bg-stone-50'">
                <span v-for="i in rating" :key="i">⭐</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Filter by Visibility -->
        <div class="tw-relative">
          <button 
            @click="toggleDropdown('visibility')"
            class="tw-px-4 tw-py-2 tw-bg-white tw-border tw-border-stone-300 tw-rounded-lg hover:tw-bg-stone-50 tw-transition-colors tw-flex tw-items-center tw-gap-2 tw-min-w-[160px]">
            <span class="tw-font-medium">Trạng thái</span>
            <span v-if="selectedVisibility !== null" class="tw-bg-crimson-100 tw-text-crimson-600 tw-px-2 tw-py-0.5 tw-rounded-full tw-text-xs">
              {{ selectedVisibility ? 'Hiển thị' : 'Đã ẩn' }}
            </span>
            <svg class="tw-w-4 tw-h-4 tw-ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div v-if="openDropdown === 'visibility'" class="tw-absolute tw-mt-2 tw-bg-white tw-shadow-lg tw-border tw-border-stone-200 tw-rounded-lg tw-p-4 tw-z-10 tw-w-48">
            <div class="tw-space-y-2">
              <button 
                @click="selectVisibility(true)"
                class="tw-w-full tw-px-4 tw-py-2 tw-rounded-lg tw-border tw-transition-colors tw-text-left"
                :class="selectedVisibility === true
                  ? 'tw-bg-green-600 tw-text-white tw-border-green-600'
                  : 'tw-bg-white tw-text-stone-700 tw-border-stone-300 hover:tw-bg-stone-50'">
                Đang hiển thị
              </button>
              <button 
                @click="selectVisibility(false)"
                class="tw-w-full tw-px-4 tw-py-2 tw-rounded-lg tw-border tw-transition-colors tw-text-left"
                :class="selectedVisibility === false
                  ? 'tw-bg-crimson-600 tw-text-white tw-border-crimson-600'
                  : 'tw-bg-white tw-text-stone-700 tw-border-stone-300 hover:tw-bg-stone-50'">
                Đã ẩn
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reviews Table -->
    <div class="tw-bg-white tw-rounded-lg tw-shadow-md tw-border tw-border-stone-200 tw-overflow-hidden">
      <div class="tw-overflow-x-auto">
        <table class="tw-w-full">
          <thead class="tw-bg-stone-100 tw-border-b tw-border-stone-200">
            <tr>
              <th class="tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-font-semibold tw-text-stone-600 tw-uppercase tw-tracking-wider">Khách hàng</th>
              <th class="tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-font-semibold tw-text-stone-600 tw-uppercase tw-tracking-wider">Sản phẩm</th>
              <th class="tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-font-semibold tw-text-stone-600 tw-uppercase tw-tracking-wider">Đánh giá</th>
              <th class="tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-font-semibold tw-text-stone-600 tw-uppercase tw-tracking-wider">Nội dung</th>
              <th class="tw-px-4 tw-py-3 tw-text-center tw-text-xs tw-font-semibold tw-text-stone-600 tw-uppercase tw-tracking-wider">Hình ảnh</th>
              <th class="tw-px-4 tw-py-3 tw-text-center tw-text-xs tw-font-semibold tw-text-stone-600 tw-uppercase tw-tracking-wider">Hữu ích</th>
              <th class="tw-px-4 tw-py-3 tw-text-center tw-text-xs tw-font-semibold tw-text-stone-600 tw-uppercase tw-tracking-wider">Trạng thái</th>
              <th class="tw-px-4 tw-py-3 tw-text-center tw-text-xs tw-font-semibold tw-text-stone-600 tw-uppercase tw-tracking-wider">Thời gian</th>
              <th class="tw-px-4 tw-py-3 tw-text-center tw-text-xs tw-font-semibold tw-text-stone-600 tw-uppercase tw-tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody class="tw-divide-y tw-divide-stone-200">
            <tr v-if="loading" class="tw-text-center">
              <td colspan="9" class="tw-px-4 tw-py-8">
                <div class="tw-flex tw-justify-center tw-items-center tw-gap-2">
                  <svg class="tw-animate-spin tw-h-5 tw-w-5 tw-text-crimson-600" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span class="tw-text-stone-600">Đang tải...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="reviews.length === 0" class="tw-text-center">
              <td colspan="9" class="tw-px-4 tw-py-8 tw-text-stone-500">
                Không có đánh giá nào
              </td>
            </tr>
            <tr v-else v-for="review in reviews" :key="review._id" class="hover:tw-bg-stone-50 tw-transition-colors">
              <td class="tw-px-4 tw-py-3">
                <div class="tw-flex tw-flex-col">
                  <span class="tw-font-medium tw-text-stone-900">{{ review.userName }}</span>
                  <!-- <span class="tw-text-xs tw-text-stone-500">{{ review.userId }}</span> -->
                </div>
              </td>
              <td class="tw-px-4 tw-py-3">
                <span class="tw-text-sm tw-font-medium tw-text-stone-900">{{ review.productName }}</span>
                <!-- <span class="tw-block tw-text-xs tw-text-stone-500">ID: {{ review.productId }}</span> -->
              </td>
              <td class="tw-px-4 tw-py-3">
                <div class="tw-flex tw-items-center tw-gap-1">
                  <span v-for="i in 5" :key="i" class="tw-text-lg">
                    {{ i <= review.rating ? '⭐' : '☆' }}
                  </span>
                </div>
              </td>
              <td class="tw-px-4 tw-py-3">
                <div class="tw-max-w-xs">
                  <p class="tw-text-sm tw-text-stone-700 tw-line-clamp-2">{{ review.comment }}</p>
                  <button 
                    v-if="review.comment.length > 100"
                    @click="viewReviewDetail(review)"
                    class="tw-text-xs tw-text-crimson-600 hover:tw-underline tw-mt-1">
                    Xem thêm
                  </button>
                </div>
              </td>
              <td class="tw-px-4 tw-py-3 tw-text-center">
                <span v-if="review.images && review.images.length > 0" class="tw-text-blue-600 tw-font-medium">
                  {{ review.images.length }} ảnh
                </span>
                <span v-else class="tw-text-stone-400">-</span>
              </td>
              <td class="tw-px-4 tw-py-3 tw-text-center">
                <span class="tw-inline-flex tw-items-center tw-gap-1 tw-px-2 tw-py-1 tw-bg-blue-100 tw-text-blue-700 tw-rounded-full tw-text-xs tw-font-medium">
                  <svg class="tw-w-3 tw-h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                  {{ review.helpfulCount }}
                </span>
              </td>
              <td class="tw-px-4 tw-py-3 tw-text-center">
                <span 
                  class="tw-inline-flex tw-items-center tw-px-2 tw-py-1 tw-rounded-full tw-text-xs tw-font-medium"
                  :class="review.isVisible 
                    ? 'tw-bg-green-100 tw-text-green-700' 
                    : 'tw-bg-crimson-100 tw-text-crimson-700'">
                  {{ review.isVisible ? 'Hiển thị' : 'Đã ẩn' }}
                </span>
                <!-- <div v-if="!review.isVisible && review.hiddenReason" class="tw-text-xs tw-text-stone-500 tw-mt-1">
                  {{ review.hiddenReason }}
                </div> -->
              </td>
              <td class="tw-px-4 tw-py-3 tw-text-center tw-text-sm tw-text-stone-600">
                {{ formatDate(review.createdAt) }}
              </td>
              <td class="tw-px-4 tw-py-3 tw-text-center">
                <div class="tw-flex tw-justify-center tw-gap-2">
                  <button 
                    @click="viewReviewDetail(review)"
                    class="tw-p-1.5 tw-text-blue-600 hover:tw-bg-blue-50 tw-rounded tw-transition-colors"
                    title="Xem chi tiết">
                    <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button 
                    v-if="review.isVisible"
                    @click="hideReview(review)"
                    class="tw-p-1.5 tw-text-orange-600 hover:tw-bg-orange-50 tw-rounded tw-transition-colors"
                    title="Ẩn đánh giá">
                    <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  </button>
                  <button 
                    v-else
                    @click="showReview(review)"
                    class="tw-p-1.5 tw-text-green-600 hover:tw-bg-green-50 tw-rounded tw-transition-colors"
                    title="Hiện đánh giá">
                    <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button 
                    @click="deleteReviewConfirm(review)"
                    class="tw-p-1.5 tw-text-crimson-600 hover:tw-bg-crimson-50 tw-rounded tw-transition-colors"
                    title="Xóa đánh giá">
                    <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="tw-flex tw-justify-between tw-items-center tw-px-6 tw-py-4 tw-border-t tw-border-stone-200">
        <div class="tw-text-sm tw-text-stone-600">
          Hiển thị {{ ((pagination.page - 1) * pagination.limit) + 1 }} - {{ Math.min(pagination.page * pagination.limit, pagination.total) }} trong tổng số {{ pagination.total }} đánh giá
        </div>
        <div class="tw-flex tw-gap-2">
          <button 
            @click="changePage(pagination.page - 1)"
            :disabled="pagination.page === 1"
            :class="pagination.page === 1 ? 'tw-opacity-50 tw-cursor-not-allowed' : 'hover:tw-bg-stone-100'"
            class="tw-px-3 tw-py-1 tw-border tw-border-stone-300 tw-rounded tw-text-sm tw-transition-colors">
            Trước
          </button>
          <template v-for="(page, idx) in visiblePages" :key="idx">
            <button 
              v-if="typeof page === 'number'"
              @click="changePage(page)"
              :class="page === pagination.page 
                ? 'tw-bg-crimson-600 tw-text-white tw-border-crimson-600' 
                : 'tw-bg-white tw-text-stone-700 tw-border-stone-300 hover:tw-bg-stone-100'"
              class="tw-px-3 tw-py-1 tw-border tw-rounded tw-text-sm tw-transition-colors">
              {{ page }}
            </button>
            <span v-else class="tw-px-2 tw-py-1 tw-text-stone-500">{{ page }}</span>
          </template>
          <button 
            @click="changePage(pagination.page + 1)"
            :disabled="pagination.page === pagination.pages"
            :class="pagination.page === pagination.pages ? 'tw-opacity-50 tw-cursor-not-allowed' : 'hover:tw-bg-stone-100'"
            class="tw-px-3 tw-py-1 tw-border tw-border-stone-300 tw-rounded tw-text-sm tw-transition-colors">
            Sau
          </button>
        </div>
      </div>
    </div>

    <!-- Review Detail Modal -->
    <div v-if="showDetailModal" class="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-50" @click.self="showDetailModal = false">
      <div class="tw-bg-white tw-rounded-lg tw-shadow-xl tw-max-w-2xl tw-w-full tw-mx-4 tw-max-h-[90vh] tw-overflow-y-auto">
        <div class="tw-p-6">
          <div class="tw-flex tw-justify-between tw-items-start tw-mb-4">
            <h2 class="tw-text-xl tw-font-bold tw-text-stone-900">Chi tiết đánh giá</h2>
            <button @click="showDetailModal = false" class="tw-text-stone-500 hover:tw-text-stone-700">
              <svg class="tw-w-6 tw-h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div v-if="selectedReview" class="tw-space-y-4">
            <div class="tw-flex tw-items-start tw-gap-4">
              <div class="tw-flex-1">
                <div class="tw-flex tw-items-center tw-gap-2 tw-mb-2">
                  <span class="tw-font-semibold tw-text-lg">{{ selectedReview.userName }}</span>
                </div>
                <div class="tw-flex tw-items-center tw-gap-2 tw-mb-2">
                  <span v-for="i in 5" :key="i" class="tw-text-2xl">
                    {{ i <= selectedReview.rating ? '⭐' : '☆' }}
                  </span>
                  <span class="tw-text-stone-600">({{ selectedReview.rating }}/5)</span>
                </div>
                <p class="tw-text-sm tw-text-stone-500">{{ formatDate(selectedReview.createdAt) }}</p>
              </div>
              <div>
                <span 
                  class="tw-inline-flex tw-items-center tw-px-3 tw-py-1 tw-rounded-full tw-text-sm tw-font-medium"
                  :class="selectedReview.isVisible 
                    ? 'tw-bg-green-100 tw-text-green-700' 
                    : 'tw-bg-crimson-100 tw-text-crimson-700'">
                  {{ selectedReview.isVisible ? 'Đang hiển thị' : 'Đã ẩn' }}
                </span>
              </div>
            </div>

            <div class="tw-border-t tw-pt-4">
              <h3 class="tw-font-semibold tw-mb-2">Nội dung đánh giá:</h3>
              <p class="tw-text-stone-700 tw-whitespace-pre-wrap">{{ selectedReview.comment }}</p>
            </div>

            <div v-if="selectedReview.images && selectedReview.images.length > 0" class="tw-border-t tw-pt-4">
              <h3 class="tw-font-semibold tw-mb-2">Hình ảnh đính kèm:</h3>
              <div class="tw-grid tw-grid-cols-3 tw-gap-2">
                <img 
                  v-for="(img, idx) in selectedReview.images" 
                  :key="idx"
                  :src="img" 
                  class="tw-w-full tw-h-32 tw-object-cover tw-rounded-lg tw-border tw-border-stone-200"
                  alt="Review image" />
              </div>
            </div>

            <div class="tw-border-t tw-pt-4 tw-flex tw-items-center tw-gap-4">
              <div class="tw-flex tw-items-center tw-gap-2">
                <svg class="tw-w-5 tw-h-5 tw-text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                <span class="tw-text-stone-700"><strong>{{ selectedReview.helpfulCount }}</strong> người thấy hữu ích</span>
              </div>
            </div>

            <div v-if="!selectedReview.isVisible && selectedReview.hiddenReason" class="tw-border-t tw-pt-4 tw-bg-crimson-50 tw-p-3 tw-rounded-lg">
              <h3 class="tw-font-semibold tw-text-crimson-800 tw-mb-1">Lý do ẩn:</h3>
              <p class="tw-text-crimson-700">{{ selectedReview.hiddenReason }}</p>
              <p v-if="selectedReview.hiddenAt" class="tw-text-xs tw-text-crimson-600 tw-mt-1">
                Ẩn lúc: {{ formatDate(selectedReview.hiddenAt) }}
              </p>
            </div>

            <div class="tw-border-t tw-pt-4 tw-flex tw-gap-2 tw-justify-end">
              <button 
                v-if="selectedReview.isVisible"
                @click="hideReview(selectedReview); showDetailModal = false"
                class="tw-px-4 tw-py-2 tw-bg-orange-600 tw-text-white tw-rounded-lg hover:tw-bg-orange-700 tw-transition-colors">
                Ẩn đánh giá
              </button>
              <button 
                v-else
                @click="showReview(selectedReview); showDetailModal = false"
                class="tw-px-4 tw-py-2 tw-bg-green-600 tw-text-white tw-rounded-lg hover:tw-bg-green-700 tw-transition-colors">
                Hiện đánh giá
              </button>
              <button 
                @click="deleteReviewConfirm(selectedReview); showDetailModal = false"
                class="tw-px-4 tw-py-2 tw-bg-crimson-600 tw-text-white tw-rounded-lg hover:tw-bg-crimson-700 tw-transition-colors">
                Xóa đánh giá
              </button>
              <button 
                @click="showDetailModal = false"
                class="tw-px-4 tw-py-2 tw-bg-stone-200 tw-text-stone-700 tw-rounded-lg hover:tw-bg-stone-300 tw-transition-colors">
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Hide Review Modal -->
    <div v-if="showHideModal" class="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-50" @click.self="showHideModal = false">
      <div class="tw-bg-white tw-rounded-lg tw-shadow-xl tw-max-w-md tw-w-full tw-mx-4">
        <div class="tw-p-6">
          <h2 class="tw-text-xl tw-font-bold tw-text-stone-900 tw-mb-4">Ẩn đánh giá</h2>
          <p class="tw-text-stone-600 tw-mb-4">Vui lòng nhập lý do ẩn đánh giá này:</p>
          <textarea 
            v-model="hideReason"
            placeholder="Ví dụ: Nội dung không phù hợp, spam, vi phạm quy định..."
            class="tw-w-full tw-border tw-border-stone-300 tw-rounded-lg tw-p-3 tw-min-h-[100px] focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500"
          ></textarea>
          <div class="tw-flex tw-gap-2 tw-justify-end tw-mt-4">
            <button 
              @click="showHideModal = false"
              class="tw-px-4 tw-py-2 tw-bg-stone-200 tw-text-stone-700 tw-rounded-lg hover:tw-bg-stone-300 tw-transition-colors">
              Hủy
            </button>
            <button 
              @click="confirmHideReview"
              :disabled="!hideReason.trim()"
              :class="!hideReason.trim() ? 'tw-opacity-50 tw-cursor-not-allowed' : ''"
              class="tw-px-4 tw-py-2 tw-bg-orange-600 tw-text-white tw-rounded-lg hover:tw-bg-orange-700 tw-transition-colors">
              Xác nhận ẩn
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { 
  getAllReviews, 
  toggleReviewVisibility, 
  deleteReview, 
  getReviewsStats,
  type Review 
} from '@/api/review/review';

// State
const loading = ref(false);
const reviews = ref<Review[]>([]);
const search = ref('');
const selectedRating = ref<number | null>(null);
const selectedVisibility = ref<boolean | null>(null);
const openDropdown = ref<string | null>(null);

const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  pages: 0
});

const stats = ref({
  totalReviews: 0,
  averageRating: 0,
  totalHelpful: 0
});

const visibilityStats = ref<{ visible: number; hidden: number }>({ visible: 0, hidden: 0 });

// Modals
const showDetailModal = ref(false);
const showHideModal = ref(false);
const selectedReview = ref<Review | null>(null);
const reviewToHide = ref<Review | null>(null);
const hideReason = ref('');

// Computed
const visibleCount = computed(() => {
  return visibilityStats.value.visible || 0;
});

const hiddenCount = computed(() => {
  return visibilityStats.value.hidden || 0;
});

const visiblePages = computed(() => {
  const pages: (number | string)[] = [];
  const total = pagination.value.pages;
  const current = pagination.value.page;
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push('...');
      pages.push(total);
    } else if (current >= total - 3) {
      pages.push(1);
      pages.push('...');
      for (let i = total - 4; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = current - 1; i <= current + 1; i++) pages.push(i);
      pages.push('...');
      pages.push(total);
    }
  }
  
  return pages;
});

// Methods
const loadReviews = async () => {
  loading.value = true;
  try {
    const params: any = {
      page: pagination.value.page,
      limit: pagination.value.limit
    };
    
    if (selectedRating.value) params.rating = selectedRating.value;
    if (selectedVisibility.value !== null) params.isVisible = selectedVisibility.value;
    if (search.value.trim()) params.search = search.value.trim();
    
    console.log('Loading reviews with params:', params);
    const response = await getAllReviews(params);
    console.log('Reviews response:', response);
    reviews.value = response.data.reviews;
    pagination.value = {
      page: response.data.currentPage,
      limit: response.data.limit,
      total: response.data.total,
      pages: response.data.totalPages
    };
  } catch (error) {
    console.error('Error loading reviews:', error);
    alert('Có lỗi khi tải danh sách đánh giá');
  } finally {
    loading.value = false;
  }
};

const loadStats = async () => {
  try {
    const response = await getReviewsStats();
    stats.value = response.data.overall;
    visibilityStats.value = response.data.byVisibility;
  } catch (error) {
    console.error('Error loading stats:', error);
  }
};

const toggleDropdown = (dropdown: string) => {
  openDropdown.value = openDropdown.value === dropdown ? null : dropdown;
};

const selectRating = (rating: number) => {
  selectedRating.value = selectedRating.value === rating ? null : rating;
  openDropdown.value = null;
  pagination.value.page = 1;
  loadReviews();
};

const selectVisibility = (visible: boolean) => {
  selectedVisibility.value = selectedVisibility.value === visible ? null : visible;
  openDropdown.value = null;
  pagination.value.page = 1;
  loadReviews();
};

const resetFilters = () => {
  search.value = '';
  selectedRating.value = null;
  selectedVisibility.value = null;
  pagination.value.page = 1;
  loadReviews();
};

const changePage = (page: number) => {
  if (page >= 1 && page <= pagination.value.pages) {
    pagination.value.page = page;
    loadReviews();
  }
};

const refreshData = () => {
  loadReviews();
  loadStats();
};

let searchTimeout: ReturnType<typeof setTimeout>;
const debouncedSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    pagination.value.page = 1;
    loadReviews();
  }, 300);
};

const viewReviewDetail = (review: Review) => {
  selectedReview.value = review;
  showDetailModal.value = true;
};

const hideReview = (review: Review) => {
  reviewToHide.value = review;
  hideReason.value = '';
  showHideModal.value = true;
};

const confirmHideReview = async () => {
  if (!reviewToHide.value || !hideReason.value.trim()) return;
  
  try {
    await toggleReviewVisibility(reviewToHide.value._id, {
      isVisible: false,
      hiddenReason: hideReason.value.trim(),
      adminId: 'admin' // TODO: Lấy từ auth
    });
    
    showHideModal.value = false;
    alert('Đã ẩn đánh giá thành công');
    refreshData();
  } catch (error) {
    console.error('Error hiding review:', error);
    alert('Có lỗi khi ẩn đánh giá');
  }
};

const showReview = async (review: Review) => {
  if (!confirm('Bạn có chắc muốn hiện lại đánh giá này?')) return;
  
  try {
    await toggleReviewVisibility(review._id, {
      isVisible: true
    });
    
    alert('Đã hiện đánh giá thành công');
    refreshData();
  } catch (error) {
    console.error('Error showing review:', error);
    alert('Có lỗi khi hiện đánh giá');
  }
};

const deleteReviewConfirm = async (review: Review) => {
  if (!confirm(`Bạn có chắc muốn xóa đánh giá của ${review.userName}? Hành động này không thể hoàn tác!`)) return;
  
  try {
    await deleteReview(review._id);
    alert('Đã xóa đánh giá thành công');
    refreshData();
  } catch (error) {
    console.error('Error deleting review:', error);
    alert('Có lỗi khi xóa đánh giá');
  }
};

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Lifecycle
onMounted(() => {
  loadReviews();
  loadStats();
});
</script>

<route lang="yaml">
name: Admin Reviews
meta:
  layout: admin
  requiresAuth: true
  adminOnly: true
  path: /admin/reviews
</route>



