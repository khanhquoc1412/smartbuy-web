<template>
  <div class="tw-bg-stone-50 tw-min-h-screen tw--mx-4">
    <div class="tw-max-w-7xl tw-mx-auto tw-p-6">
      <!-- Header -->
      <div class="tw-flex tw-items-center tw-justify-between tw-mb-6 tw-bg-white tw-p-4 tw-rounded-lg tw-shadow-sm">
        <div class="tw-flex tw-items-center tw-gap-4">
          <button @click="goBack" class="tw-p-2 tw-rounded-lg hover:tw-bg-stone-100 tw-transition-colors">
            <svg class="tw-w-6 tw-h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 class="tw-text-2xl tw-font-bold tw-text-stone-800">Chỉnh sửa sản phẩm</h1>
            <p class="tw-text-sm tw-text-stone-500 tw-mt-1">ID: {{ productId }}</p>
          </div>
        </div>
        <div class="tw-flex tw-gap-2">
          <button @click="saveProduct"
            class="tw-px-6 tw-py-2 tw-bg-crimson-600 tw-text-white tw-rounded-lg hover:tw-bg-crimson-700 tw-transition-colors tw-font-medium tw-flex tw-items-center tw-gap-2">
            <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Lưu thay đổi
          </button>
          <button @click="showDeleteModal = true"
            class="tw-px-6 tw-py-2 tw-bg-stone-600 tw-text-white tw-rounded-lg hover:tw-bg-stone-700 tw-transition-colors tw-font-medium tw-flex tw-items-center tw-gap-2">
            <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Xóa sản phẩm
          </button>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="tw-grid tw-grid-cols-1 lg:tw-grid-cols-12 tw-gap-6">

        <!-- Left Column - Basic Info -->
        <div class="lg:tw-col-span-8 tw-space-y-6">

          <!-- Phiên bản sản phẩm - MOVED TO TOP -->
          <div class="tw-bg-white tw-rounded-lg tw-shadow-sm tw-p-6">
            <div class="tw-flex tw-items-center tw-gap-2 tw-mb-4 tw-pb-3 tw-border-b">
              <svg class="tw-w-5 tw-h-5 tw-text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              <h2 class="tw-text-lg tw-font-semibold tw-text-stone-800">Phiên bản sản phẩm</h2>
              <span
                class="tw-ml-auto tw-px-3 tw-py-1 tw-bg-blue-100 tw-text-blue-700 tw-text-sm tw-font-medium tw-rounded-full">
                {{ productVariants.length }} phiên bản
              </span>
            </div>

            <!-- Step 1: Chọn BỘ NHỚ -->
            <div class="tw-mb-4">
              <div class="tw-flex tw-items-center tw-justify-between tw-mb-2">
                <label class="tw-block tw-text-sm tw-font-medium tw-text-stone-700">
                  RAM & BỘ NHỚ
                </label>
                <button @click="showAddMemoryModal = true"
                  class="tw-px-3 tw-py-1 tw-text-xs tw-bg-stone-600 tw-text-white tw-rounded-lg hover:tw:bg-red-700 tw-transition-colors tw-flex tw-items-center tw-gap-1">
                  Thêm Memory
                </button>
              </div>
              <div class="tw-flex tw-flex-wrap tw-gap-2">
                <div v-for="memory in availableMemories" :key="memory._id" class="tw-relative tw-group">
                  <button @click="selectedMemoryId = memory._id"
                    :class="[
                      'tw-px-4 tw-py-2 tw-rounded-lg tw-border-2 tw-transition-all tw-font-medium focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500',
                      selectedMemoryId === memory._id
                        ? 'tw-border-blue-500 tw-bg-blue-50 tw-text-blue-700'
                        : 'tw-border-stone-300 tw-bg-white tw-text-stone-700 hover:tw-border-red'
                    ]">
                    {{ memory.ram }} / {{ memory.rom }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Step 2: Chọn MÀU SẮC -->
            <div class="tw-mb-4">
              <div class="tw-flex tw-items-center tw-justify-between tw-mb-2">
                <label class="tw-block tw-text-sm tw-font-medium tw-text-stone-700">
                  MÀU SẮC
                </label>
                <button @click="showAddColorModal = true"
                  class="tw-px-3 tw-py-1 tw-text-xs tw-bg-stone-600 tw-text-white tw-rounded-lg hover:tw-bg-purple-700 tw-transition-colors tw-flex tw-items-center tw-gap-1">
                  Thêm Màu
                </button>
              </div>
              <div class="tw-flex tw-flex-wrap tw-gap-2">
                <div v-for="color in availableColors" :key="color._id" class="tw-relative tw-group">
                  <button @click="selectedVariantColorId = color._id"
                    :class="[
                      'tw-px-4 tw-py-2 tw-rounded-lg tw-border-2 tw-transition-all tw-font-medium tw-flex tw-items-center tw-gap-2 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500 focus:tw-border-transparent',
                      selectedVariantColorId === color._id
                        ? 'tw-border-blue-500 tw-bg-blue-50 tw-text-blue-700'
                        : 'tw-border-stone-300 tw-bg-white tw-text-stone-700 hover:tw-border-red'
                    ]">
                    <span class="tw-w-4 tw-h-4 tw-rounded-full tw-border tw-border-stone-400"
                      :style="{ backgroundColor: color.code }"></span>
                    {{ color.name }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Hiển thị tất cả variants dạng compact -->
            <div v-if="productVariants.length > 0" class="tw-mb-4">
              <label class="tw-block tw-text-sm tw-font-medium tw-text-stone-700 tw-mb-2">
                DANH SÁCH PHIÊN BẢN HIỆN CÓ
              </label>
              <div class="tw-grid tw-grid-cols-2 tw-gap-2">
                <div v-for="variant in productVariants" :key="variant._id || `${variant.colorId}-${variant.memoryId}`"
                  @click="selectVariantForEdit(variant)"
                  class="tw-border tw-border-stone-300 tw-rounded-lg tw-p-3 hover:tw-border-red tw-cursor-pointer tw-transition-colors tw-bg-white">
                  <div class="tw-flex tw-items-center tw-gap-2 tw-mb-2">
                    <span class="tw-w-4 tw-h-4 tw-rounded-full tw-border tw-border-stone-400"
                      :style="{ backgroundColor: getColorCode(variant.colorId) }"></span>
                    <span class="tw-text-sm tw-font-semibold tw-text-stone-800">
                      {{ getColorName(variant.colorId) }} - {{ getMemoryDisplay(variant.memoryId) }}
                    </span>
                  </div>
                  <div class="tw-text-xs tw-text-stone-600 tw-space-y-1">
                    <div>💰 {{ formatPrice(variant.price) }}</div>
                    <div>📦 Kho: {{ variant.stock }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else
              class="tw-text-center tw-py-8 tw-text-stone-400 tw-bg-stone-50 tw-rounded-lg tw-border-2 tw-border-dashed tw-border-stone-300 tw-mb-4">
              <svg class="tw-w-12 tw-h-12 tw-mx-auto tw-mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p>Chưa có phiên bản nào</p>
            </div>

            <!-- Nút thêm phiên bản mới -->
            <div v-if="selectedMemoryId && selectedVariantColorId && !selectedVariant"
              class="tw-mb-4 tw-p-4 tw-bg-green-50 tw-border-2 tw-border-green-300 tw-rounded-lg">
              <div class="tw-flex tw-items-center tw-justify-between">
                <div class="tw-flex tw-items-center tw-gap-3">
                  <svg class="tw-w-6 tw-h-6 tw-text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <div>
                    <h3 class="tw-text-sm tw-font-semibold tw-text-green-800">
                      Phiên bản mới: {{ getColorName(selectedVariantColorId) }} - {{ getMemoryDisplay(selectedMemoryId) }}
                    </h3>
                    <p class="tw-text-xs tw-text-green-600">Nhấn "Thêm phiên bản" để tạo variant mới này</p>
                  </div>
                </div>
                <button @click="createNewVariant"
                  class="tw-px-4 tw-py-2 tw-bg-red tw-text-white tw-rounded-lg hover:tw-bg-green-700 tw-transition-colors tw-font-medium tw-flex tw-items-center tw-gap-2">
                  Thêm phiên bản
                </button>
              </div>
            </div>

            <!-- Layout 2 cột: Danh sách + Form chỉnh sửa -->
            <div v-if="selectedVariant" class="tw-grid tw-grid-cols-2 tw-gap-4 tw-mb-4">
              <!-- Cột trái: Hiển thị phiên bản đang chọn -->
              <div class="tw-border-2 tw-border-blue-300 tw-rounded-lg tw-p-4 tw-bg-blue-50 hover:tw-border-red">
                <div class="tw-flex tw-items-center tw-justify-between tw-mb-3">
                  <h3 class="tw-text-sm tw-font-semibold tw-text-blue-800">
                    📦 Phiên bản đang chọn
                  </h3>
                  <button @click="deleteSelectedVariant"
                    class="tw-px-5 tw-bg-stone-600 tw-text-white tw-rounded-lg hover:tw-bg-stone-700 tw-transition-colors tw-font-medium tw-flex tw-items-center tw-gap-2">
                    <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <div class="tw-space-y-2">
                  <div class="tw-flex tw-items-center tw-gap-2">
                    <div class="tw-w-6 tw-h-6 tw-rounded-full tw-border-2 tw-border-white tw-shadow-md"
                      :style="{ backgroundColor: getColorCode(selectedVariantColorId) }"></div>
                    <span class="tw-text-sm tw-font-medium">{{ getColorName(selectedVariantColorId) }}</span>
                  </div>
                  <div class="tw-text-sm">
                    <span class="tw-font-medium">Bộ nhớ:</span> {{ getMemoryDisplay(selectedMemoryId) }}
                  </div>
                  <div class="tw-text-sm">
                    <span class="tw-font-medium">Giá:</span> {{ formatPrice(selectedVariant.price) }}
                  </div>
                  <div class="tw-text-sm">
                    <span class="tw-font-medium">Tồn kho:</span> {{ selectedVariant.stock }} sản phẩm
                  </div>
                </div>
              </div>

              <!-- Cột phải: Form chỉnh sửa giá và tồn kho -->
              <div class="tw-border-2 tw-border-green-300 tw-rounded-lg tw-p-4 tw-bg-green-50 hover:tw-border-red">
                <h3 class="tw-text-sm tw-font-semibold tw-text-green-800 tw-mb-3">
                  ✏️ Chỉnh sửa giá và tồn kho
                </h3>
                <div class="tw-space-y-3">
                  <div>
                    <label class="tw-block tw-text-xs tw-font-medium tw-text-stone-700 tw-mb-1">Giá bán (VNĐ)</label>
                    <input v-model.number="selectedVariant.price" type="number"
                      class="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-stone-300 tw-rounded-lg focus:tw-border-green-500 focus:tw-outline-none tw-text-sm"
                      placeholder="VD: 25000000" />
                  </div>
                  <div>
                    <label class="tw-block tw-text-xs tw-font-medium tw-text-stone-700 tw-mb-1">Số lượng tồn kho</label>
                    <input v-model.number="selectedVariant.stock" type="number"
                      class="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-stone-300 tw-rounded-lg focus:tw-border-green-500 focus:tw-outline-none tw-text-sm"
                      placeholder="VD: 50" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Thông tin sản phẩm - MOVED DOWN -->
          <div class="tw-bg-white tw-rounded-lg tw-shadow-sm tw-p-6">
            <div class="tw-flex tw-items-center tw-gap-2 tw-mb-4 tw-pb-3 tw-border-b">
              <svg class="tw-w-5 tw-h-5 tw-text-crimson-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h2 class="tw-text-lg tw-font-semibold tw-text-stone-800">Thông tin sản phẩm</h2>
            </div>
            <div class="tw-space-y-4">
              <div>
                <label class="tw-block tw-text-sm tw-font-medium tw-text-stone-700 tw-mb-2">
                  Tên sản phẩm <span class="tw-text-red-500">*</span>
                </label>
                <input v-model="product.name" type="text"
                  class="tw-border tw-border-stone-300 tw-rounded-lg tw-p-3 tw-w-full focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500 focus:tw-border-transparent"
                  placeholder="VD: iPhone 15 Pro Max 256GB" />
              </div>

              <div class="tw-grid tw-grid-cols-2 tw-gap-4">
                <div>
                  <label class="tw-block tw-text-sm tw-font-medium tw-text-stone-700 tw-mb-2">
                    Danh mục <span class="tw-text-red-500">*</span>
                  </label>
                  <select v-model="product.categoryId"
                    class="tw-border tw-border-stone-300 tw-rounded-lg tw-p-3 tw-w-full focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500 focus:tw-border-transparent">
                    <option value="">-- Chọn danh mục --</option>
                    <option v-for="cat in categories" :key="cat._id" :value="cat._id">{{ cat.name }}</option>
                  </select>
                </div>

                <div>
                  <label class="tw-block tw-text-sm tw-font-medium tw-text-stone-700 tw-mb-2">
                    Thương hiệu <span class="tw-text-red-500">*</span>
                  </label>
                  <select v-model="product.brandId"
                    class="tw-border tw-border-stone-300 tw-rounded-lg tw-p-3 tw-w-full focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500 focus:tw-border-transparent">
                    <option value="">-- Chọn thương hiệu --</option>
                    <option v-for="brand in brands" :key="brand._id" :value="brand._id">{{ brand.name }}</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="tw-block tw-text-sm tw-font-medium tw-text-stone-700 tw-mb-2">Mô tả sản phẩm</label>
                <textarea v-model="product.description" rows="4"
                  class="tw-border tw-border-stone-300 tw-rounded-lg tw-p-3 tw-w-full focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500 focus:tw-border-transparent tw-resize-none"
                  placeholder="Mô tả chi tiết về sản phẩm, tính năng nổi bật..."></textarea>
              </div>

              <div class="tw-grid tw-grid-cols-3 tw-gap-4">
                <div>
                  <label class="tw-block tw-text-sm tw-font-medium tw-text-stone-700 tw-mb-2">Giá cơ bản (VNĐ)</label>
                  <input v-model.number="product.basePrice" type="number"
                    class="tw-border tw-border-stone-300 tw-rounded-lg tw-p-3 tw-w-full focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500 focus:tw-border-transparent"
                    placeholder="0" />
                </div>

                <div>
                  <label class="tw-block tw-text-sm tw-font-medium tw-text-stone-700 tw-mb-2">Giảm giá (%)</label>
                  <input v-model.number="product.discountPercentage" type="number"
                    class="tw-border tw-border-stone-300 tw-rounded-lg tw-p-3 tw-w-full focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500 focus:tw-border-transparent"
                    placeholder="0" min="0" max="100" />
                </div>

                <div>
                  <label class="tw-block tw-text-sm tw-font-medium tw-text-stone-700 tw-mb-2">Giá sau giảm</label>
                  <input :value="Math.round(product.basePrice * (1 - product.discountPercentage / 100))" disabled
                    class="tw-border tw-border-stone-300 tw-rounded-lg tw-p-3 tw-w-full tw-bg-stone-100 tw-text-stone-600" />
                </div>
              </div>

              <!-- Hiển thị giá của phiên bản đang chọn -->
              <div v-if="selectedVariant"
                class="tw-mt-4 tw-p-4 tw-bg-gradient-to-r tw-from-green-50 tw-to-emerald-50 tw-border-2 tw-border-green-300 tw-rounded-lg">
                <div class="tw-flex tw-items-center tw-justify-between">
                  <div>
                    <p class="tw-text-xs tw-text-stone-600 tw-mb-1">Phiên bản đang chọn:</p>
                    <p class="tw-text-sm tw-font-bold tw-text-green-800">
                      {{ getColorName(selectedVariantColorId) }} - {{ getMemoryDisplay(selectedMemoryId) }}
                    </p>
                  </div>
                  <div class="tw-text-right">
                    <p class="tw-text-xs tw-text-stone-600 tw-mb-1">Giá phiên bản:</p>
                    <p class="tw-text-lg tw-font-bold tw-text-green-700">{{ formatPrice(selectedVariant.price) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Thông số kỹ thuật -->
          <div class="tw-bg-white tw-rounded-lg tw-shadow-sm tw-p-6">
            <div class="tw-flex tw-items-center tw-gap-2 tw-mb-4 tw-pb-3 tw-border-b">
              <svg class="tw-w-5 tw-h-5 tw-text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <h2 class="tw-text-lg tw-font-semibold tw-text-stone-800">Thông số kỹ thuật</h2>
              <span
                class="tw-ml-auto tw-px-3 tw-py-1 tw-bg-purple-100 tw-text-purple-700 tw-text-sm tw-font-medium tw-rounded-full">
                {{ displayedSpecs.length }} thông số
              </span>
            </div>

            <!-- Hiển thị message nếu chưa chọn variant -->
            <div v-if="!selectedVariant"
              class="tw-text-center tw-py-8 tw-text-stone-400 tw-bg-purple-50 tw-rounded-lg tw-border-2 tw-border-purple-200 tw-mb-4">
              <svg class="tw-w-12 tw-h-12 tw-mx-auto tw-mb-2 tw-text-purple-300" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="tw-font-medium">Chọn phiên bản trước để nhập thông số kỹ thuật</p>
            </div>

            <!-- Thông số kỹ thuật của variant đã chọn -->
            <div v-else>
              <div class="tw-bg-purple-50 tw-border tw-border-purple-200 tw-rounded-lg tw-p-3 tw-mb-4">
                <p class="tw-text-sm tw-text-purple-800">
                  📝 Thông số cho: <span class="tw-font-bold">{{ getColorName(selectedVariantColorId) }} - {{
                    getMemoryDisplay(selectedMemoryId) }}</span>
                </p>
              </div>

              <div v-if="displayedSpecs.length > 0" class="tw-space-y-3 tw-mb-4">
                <div v-for="(spec, index) in displayedSpecs" :key="spec._id || index"
                  class="tw-border tw-border-stone-200 tw-rounded-lg tw-p-4 hover:tw-border-purple-400 tw-transition-colors"
                  :class="{ 'tw-bg-blue-50 tw-border-blue-300': spec.isMemorySpec }">
                  <div class="tw-flex tw-gap-3 tw-items-start">
                    <div class="tw-flex-1 tw-grid tw-grid-cols-2 tw-gap-3">
                      <div>
                        <label class="tw-text-xs tw-font-medium tw-text-stone-500 tw-mb-1 tw-block">
                          Tên thông số
                          <span v-if="spec.isMemorySpec" class="tw-text-blue-600 tw-ml-1"></span>
                        </label>
                        <!-- Memory specs - readonly -->
                        <input v-if="spec.isMemorySpec" v-model="spec.specName" type="text"
                          class="tw-border tw-border-blue-300 tw-rounded-lg tw-p-2 tw-w-full tw-text-sm tw-bg-blue-100 tw-text-blue-800 tw-font-medium"
                          title="Thông số từ Memory (tự động từ variant)" />

                        <!-- Nếu là spec mới, hiển thị dropdown để chọn -->
                        <select v-else-if="spec.isNew" v-model="spec.specsId" @change="onSpecSelected(spec)"
                          class="tw-border tw-border-stone-300 tw-rounded-lg tw-p-2 tw-w-full tw-text-sm focus:tw-ring-2 focus:tw-ring-purple-500">
                          <option value="">-- Chọn thông số --</option>
                          <option v-for="specMaster in specifications" :key="specMaster._id" :value="specMaster._id">
                            {{ specMaster.specName }}
                          </option>
                        </select>
                        <!-- Nếu đã có spec từ DB, cho phép edit -->
                        <input v-else v-model="spec.specName" type="text"
                          class="tw-border tw-border-blue-300 tw-rounded-lg tw-p-2 tw-w-full tw-text-sm tw-bg-blue-100 tw-text-blue-800 tw-font-medium"
                          placeholder="Nhập tên thông số..." title="Tên thông số (có thể chỉnh sửa)" />
                      </div>
                      <div>
                        <label class="tw-text-xs tw-font-medium tw-text-stone-500 tw-mb-1 tw-block">Giá trị</label>
                        <!-- Memory specs - editable with blue style -->
                        <input v-if="spec.isMemorySpec" v-model="spec.specValue" type="text"
                          class="tw-border tw-border-blue-300 tw-rounded-lg tw-p-2 tw-w-full tw-text-sm tw-bg-white tw-text-blue-800 tw-font-medium focus:tw-ring-2 focus:tw-ring-blue-500"
                          placeholder="Nhập giá trị..." title="Giá trị từ Memory (có thể chỉnh sửa)" />
                        <!-- Regular specs - editable -->
                        <input v-else v-model="spec.specValue" type="text" placeholder="VD: 6.1 inch, 48MP, 3349mAh..."
                          class="tw-border tw-border-blue-300 tw-rounded-lg tw-p-2 tw-w-full tw-text-sm tw-bg-white tw-text-blue-800 tw-font-medium focus:tw-ring-2 focus:tw-ring-blue-500" />
                      </div>
                    </div>
                    <!-- Không cho xóa memory specs -->
                    <button v-if="!spec.isMemorySpec" @click="removeSpec(index)"
                      class="tw-p-2 tw-bg-red-100 tw-text-red-600 tw-rounded-lg hover:tw-bg-red-200 tw-transition-colors tw-mt-6"
                      title="Xóa thông số">
                      <svg class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <!-- Placeholder for memory specs to keep alignment -->
                    <div v-else class="tw-w-10 tw-mt-6"></div>
                  </div>
                </div>
              </div>
              <div v-else
                class="tw-text-center tw-py-8 tw-text-stone-400 tw-bg-stone-50 tw-rounded-lg tw-border-2 tw-border-dashed tw-border-stone-300 tw-mb-4">
                <svg class="tw-w-12 tw-h-12 tw-mx-auto tw-mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p>Chưa có thông số nào</p>
              </div>

              <button @click="addSpec"
                class="tw-w-full tw-px-4 tw-py-2 tw-bg-stone-600 tw-text-white tw-rounded-lg hover:tw-bg-purple-700 tw-transition-colors tw-flex tw-items-center tw-justify-center tw-gap-2">
                <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Thêm thông số mới
              </button>
            </div>
          </div>

        </div>

        <!-- Right Column - Images -->
        <div class="lg:tw-col-span-4">
          <div class="tw-bg-white tw-rounded-lg tw-shadow-sm tw-p-6 tw-sticky tw-top-6 tw-max-h-[calc(100vh-3rem)] tw-overflow-y-auto tw-scrollbar-thin tw-scrollbar-thumb-stone-400 tw-scrollbar-track-stone-100 hover:tw-scrollbar-thumb-stone-500">
            <div class="tw-flex tw-items-center tw-gap-2 tw-mb-4 tw-pb-3 tw-border-b">
              <svg class="tw-w-5 tw-h-5 tw-text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h2 class="tw-text-lg tw-font-semibold tw-text-stone-800">Hình ảnh sản phẩm</h2>
            </div>

            <!-- Hiển thị ảnh mặc định khi chưa chọn variant -->
            <div v-if="!selectedVariantColorId">
              <div
                class="tw-border-2 tw-border-stone-300 tw-rounded-lg tw-mb-4 tw-bg-stone-50 tw-aspect-square tw-flex tw-items-center tw-justify-center tw-relative tw-overflow-hidden">
                <img v-if="product.thumbUrl" :src="product.thumbUrl" alt="Product"
                  class="tw-max-h-full tw-max-w-full tw-object-contain" />
                <div v-else class="tw-text-center tw-text-stone-400 tw-p-4">
                  <svg class="tw-w-16 tw-h-16 tw-mx-auto tw-mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p class="tw-text-sm">Chưa có ảnh</p>
                </div>
              </div>
              <div
                class="tw-text-center tw-py-4 tw-text-stone-500 tw-bg-orange-50 tw-rounded-lg tw-border tw-border-orange-200">
                <p class="tw-text-sm tw-font-medium">💡 Chọn phiên bản bên trái</p>
                <p class="tw-text-xs tw-mt-1">để quản lý hình ảnh cho từng màu sắc</p>
              </div>
            </div>

            <!-- Image management khi đã chọn variant -->
            <div v-else>
              <!-- Variant info badge -->
              <div
                class="tw-bg-gradient-to-r tw-from-orange-50 tw-to-yellow-50 tw-border-2 tw-border-orange-200 tw-rounded-lg tw-p-3 tw-mb-4">
                <div class="tw-flex tw-items-center tw-gap-2">
                  <div class="tw-w-5 tw-h-5 tw-rounded-full tw-border-2 tw-border-white tw-shadow-sm"
                    :style="{ backgroundColor: getColorCode(selectedVariantColorId) }"></div>
                  <span class="tw-font-semibold tw-text-orange-900">
                    {{ getColorName(selectedVariantColorId) }} - {{ getMemoryDisplay(selectedMemoryId) }}
                  </span>
                </div>
              </div>

              <!-- Image Preview -->
              <div
                class="tw-border-2 tw-border-stone-300 tw-rounded-lg tw-mb-4 tw-bg-stone-50 tw-aspect-square tw-flex tw-items-center tw-justify-center tw-relative tw-overflow-hidden">
                <img v-if="currentVariantImage" :src="currentVariantImage" alt="Product"
                  class="tw-max-h-full tw-max-w-full tw-object-contain" />
                <div v-else class="tw-text-center tw-text-stone-400 tw-p-4">
                  <svg class="tw-w-16 tw-h-16 tw-mx-auto tw-mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p class="tw-text-sm">Chưa có ảnh cho màu này</p>
                </div>

                <!-- Navigation -->
                <button v-if="imagesForSelectedVariantColor.length > 1" @click="prevVariantImage"
                  class="tw-absolute tw-left-2 tw-top-1/2 tw--translate-y-1/2 tw-bg-black tw-bg-opacity-50 tw-text-white tw-p-2 tw-rounded-full hover:tw-bg-opacity-75">
                  <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button v-if="imagesForSelectedVariantColor.length > 1" @click="nextVariantImage"
                  class="tw-absolute tw-right-2 tw-top-1/2 tw--translate-y-1/2 tw-bg-black tw-bg-opacity-50 tw-text-white tw-p-2 tw-rounded-full hover:tw-bg-opacity-75">
                  <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <!-- Counter -->
                <div v-if="imagesForSelectedVariantColor.length > 0"
                  class="tw-absolute tw-bottom-2 tw-left-1/2 tw--translate-x-1/2 tw-bg-black tw-bg-opacity-60 tw-text-white tw-px-3 tw-py-1 tw-rounded-full tw-text-sm">
                  {{ currentVariantImageIndex + 1 }} / {{ imagesForSelectedVariantColor.length }}
                </div>
              </div>

              <!-- Image count badge -->
              <div v-if="imagesForSelectedVariantColor.length > 0"
                class="tw-mb-3 tw-text-sm tw-text-stone-600 tw-flex tw-items-center tw-gap-2">
                <span class="tw-bg-orange-100 tw-text-orange-700 tw-px-3 tw-py-1 tw-rounded-full tw-font-medium">
                  📷 {{ imagesForSelectedVariantColor.length }} ảnh - Màu {{ getColorName(selectedVariantColorId) }}
                </span>
              </div>

              <!-- Thumbnails - Simple 3-column grid -->
              <div class="tw-grid tw-grid-cols-3 tw-gap-3 tw-mb-4">
                <div v-for="(img, index) in imagesForSelectedVariantColor" :key="img._id"
                  class="tw-border-2 tw-rounded-lg tw-overflow-hidden tw-bg-white tw-transition-all hover:tw-shadow-lg"
                  :class="currentVariantImageIndex === index ? 'tw-border-orange-600 tw-ring-2 tw-ring-orange-300' : 'tw-border-stone-300'">

                  <!-- Image -->
                  <div class="tw-relative tw-aspect-square tw-cursor-pointer tw-group"
                    @click="selectVariantImage(index)">
                    <img :src="getImageUrl(img.imageUrl)" :alt="img.name || 'Product image'"
                      class="tw-w-full tw-h-full tw-object-cover" />

                    <!-- Delete button -->
                    <button @click.stop="removeVariantImage(img._id)"
                      class="tw-absolute tw-top-2 tw-right-2 tw-bg-red-500 tw-text-black tw-rounded-full tw-w-7 tw-h-7 tw-flex tw-items-center tw-justify-center hover:tw-bg-red tw-shadow-lg tw-opacity-1 group-hover:tw-opacity-100 tw-transition-opacity">
                      <svg class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <!-- Image name input -->
                  <div class="tw-p-2">
                    <input v-model="img.name" @blur="updateImageName(img)" type="text" placeholder="Tên ảnh..."
                      class="tw-w-full tw-px-2 tw-py-1 tw-text-xs tw-border tw-border-stone-300 tw-rounded focus:tw-ring-1 focus:tw-ring-orange-500 focus:tw-border-orange-500" />
                  </div>
                </div>
              </div>

              <!-- Empty state when no images -->
              <div v-if="imagesForSelectedVariantColor.length === 0"
                class="tw-text-center tw-py-8 tw-text-stone-400 tw-bg-stone-50 tw-rounded-lg tw-border-2 tw-border-dashed tw-border-stone-300 tw-mb-4">
                <svg class="tw-w-12 tw-h-12 tw-mx-auto tw-mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p class="tw-text-sm tw-font-medium">Chưa có ảnh cho màu này</p>
                <p class="tw-text-xs tw-mt-1">Thêm ảnh bằng cách chọn file hoặc dán URL bên dưới</p>
              </div>

              <!-- Add Image -->
              <div class="tw-space-y-3">
                <div class="tw-text-sm tw-font-medium tw-text-stone-700 tw-mb-2">
                  Thêm ảnh cho sản phẩm màu <span class="tw-font-bold tw-text-orange-600">{{
                    getColorName(selectedVariantColorId)
                    }}</span>
                </div>

                <!-- File Upload Button -->
                <div class="tw-relative">
                  <input type="file" ref="fileInput" accept="image/*" @change="handleFileSelect" class="tw-hidden" />
                  <button @click="$refs.fileInput.click()"
                    class="tw-w-full tw-px-4 tw-py-3 tw-bg-gradient-to-r tw-from-orange-500 tw-to-orange-600 tw-text-black tw-rounded-lg hover:tw-from-orange-600 hover:tw-to-orange-700 tw-transition-all tw-flex tw-items-center tw-justify-center tw-gap-2 tw-font-medium tw-shadow-md hover:tw-shadow-lg">
                    <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    📁 Chọn ảnh từ máy tính
                  </button>
                </div>

                <!-- Divider -->
                <div class="tw-flex tw-items-center tw-gap-3">
                  <div class="tw-flex-1 tw-h-px tw-bg-stone-300"></div>
                  <span class="tw-text-xs tw-text-stone-500 tw-font-medium">HOẶC</span>
                  <div class="tw-flex-1 tw-h-px tw-bg-stone-300"></div>
                </div>

                <!-- URL Input -->
                <div class="tw-space-y-2">
                  <input v-model="newImageUrl" type="text" placeholder="🔗 Dán URL hình ảnh vào đây..."
                    class="tw-border tw-border-stone-300 tw-rounded-lg tw-p-3 tw-w-full focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-orange-500 tw-text-sm"
                    @keyup.enter="addVariantImage" />
                  <button @click="addVariantImage" :disabled="!newImageUrl.trim()"
                    class="tw-w-full tw-px-4 tw-py-2 tw-bg-stone-600 tw-text-white tw-rounded-lg hover:tw-bg-orange-700 tw-transition-colors tw-flex tw-items-center tw-justify-center tw-gap-2 tw-text-sm tw-font-medium disabled:tw-opacity-50 disabled:tw-cursor-not-allowed">
                    <svg class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Thêm từ URL
                  </button>
                </div>

                <!-- Preview selected file -->
                <div v-if="selectedFileName"
                  class="tw-mt-2 tw-p-3 tw-bg-green-50 tw-border tw-border-green-200 tw-rounded-lg">
                  <div class="tw-flex tw-items-center tw-gap-2 tw-text-sm">
                    <svg class="tw-w-5 tw-h-5 tw-text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="tw-text-green-800 tw-font-medium">Đã chọn:</span>
                    <span class="tw-text-green-700 tw-truncate tw-flex-1">{{ selectedFileName }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <div v-if="showDeleteModal"
      class="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-50"
      @click="showDeleteModal = false">
      <div class="tw-bg-white tw-rounded-lg tw-p-6 tw-max-w-md tw-w-full tw-mx-4" @click.stop>
        <h3 class="tw-text-xl tw-font-bold tw-mb-4 tw-text-crimson-600">Xác nhận xóa sản phẩm</h3>
        <p class="tw-text-stone-600 tw-mb-6">Bạn có chắc chắn muốn xóa sản phẩm "{{ product.name }}"? Hành động này
          không thể hoàn tác.</p>
        <div class="tw-flex tw-gap-2 tw-justify-end">
          <button @click="showDeleteModal = false"
            class="tw-px-4 tw-py-2 tw-bg-stone-200 tw-text-stone-800 tw-rounded-lg hover:tw-bg-stone-300 tw-transition-colors">
            Hủy
          </button>
          <button @click="deleteProduct"
            class="tw-px-4 tw-py-2 tw-bg-crimson-600 tw-text-white tw-rounded-lg hover:tw-bg-crimson-700 tw-transition-colors">
            Xóa sản phẩm
          </button>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal"
      class="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-50"
      @click="showSuccessModal = false">
      <div class="tw-bg-white tw-rounded-lg tw-p-6 tw-max-w-md tw-w-full tw-mx-4" @click.stop>
        <div class="tw-flex tw-items-center tw-gap-3 tw-mb-4">
          <h3 class="tw-text-xl tw-font-bold tw-text-red">Thành công</h3>
        </div>
        <p class="tw-text-stone-600 tw-mb-6">{{ modalMessage }}</p>
        <div class="tw-flex tw-justify-end">
          <button @click="showSuccessModal = false"
            class="tw-px-4 tw-py-2 tw-bg-red tw-text-white tw-rounded-lg hover:tw-bg-green-700 tw-transition-colors">
            Đóng
          </button>
        </div>
      </div>
    </div>

    <!-- Error Modal -->
    <div v-if="showErrorModal"
      class="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-50"
      @click="showErrorModal = false">
      <div class="tw-bg-white tw-rounded-lg tw-p-6 tw-max-w-md tw-w-full tw-mx-4" @click.stop>
        <div class="tw-flex tw-items-center tw-gap-3 tw-mb-4">
          <h3 class="tw-text-xl tw-font-bold tw-text-red">Lỗi</h3>
        </div>
        <p class="tw-text-stone-600 tw-mb-6">{{ modalMessage }}</p>
        <div class="tw-flex tw-justify-end">
          <button @click="showErrorModal = false"
            class="tw-px-4 tw-py-2 tw-bg-red tw-text-white tw-rounded-lg hover:tw-bg-red-700 tw-transition-colors">
            Đóng
          </button>
        </div>
      </div>
    </div>

    <!-- Confirm Modal -->
    <div v-if="showConfirmModal"
      class="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-50"
      @click="showConfirmModal = false">
      <div class="tw-bg-white tw-rounded-lg tw-p-6 tw-max-w-md tw-w-full tw-mx-4" @click.stop>
        <div class="tw-flex tw-items-center tw-gap-3 tw-mb-4">
          <h3 class="tw-text-xl tw-font-bold tw-text-red">Xác nhận</h3>
        </div>
        <p class="tw-text-stone-600 tw-mb-6">{{ modalMessage }}</p>
        <div class="tw-flex tw-gap-2 tw-justify-end">
          <button @click="showConfirmModal = false"
            class="tw-px-4 tw-py-2 tw-bg-stone-200 tw-text-stone-800 tw-rounded-lg hover:tw-bg-stone-300 tw-transition-colors">
            Hủy
          </button>
          <button @click="handleConfirm"
            class="tw-px-4 tw-py-2 tw-bg-red tw-text-white tw-rounded-lg hover:tw-bg-blue-700 tw-transition-colors">
            Xác nhận
          </button>
        </div>
      </div>
    </div>

    <!-- Add Memory Modal -->
    <div v-if="showAddMemoryModal"
      class="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-50"
      @click="showAddMemoryModal = false">
      <div class="tw-bg-white tw-rounded-lg tw-p-6 tw-max-w-md tw-w-full tw-mx-4" @click.stop>
        <div class="tw-flex tw-items-center tw-gap-3 tw-mb-4 tw-pb-3 tw-border-b">
          <svg class="tw-w-6 tw-h-6 tw-text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
          <h3 class="tw-text-xl tw-font-bold tw-text-stone-800">Thêm RAM & Bộ nhớ mới</h3>
        </div>
        
        <div class="tw-space-y-4">
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-text-stone-700 tw-mb-2">
              RAM <span class="tw-text-red-500">*</span>
            </label>
            <input v-model="newMemory.ram" type="text" placeholder="VD: 6GB, 8GB, 12GB..."
              class="tw-border tw-border-stone-300 tw-rounded-lg tw-p-3 tw-w-full focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-green-500" />
          </div>
          
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-text-stone-700 tw-mb-2">
              Bộ nhớ trong (ROM) <span class="tw-text-red-500">*</span>
            </label>
            <input v-model="newMemory.rom" type="text" placeholder="VD: 128GB, 256GB, 512GB..."
              class="tw-border tw-border-stone-300 tw-rounded-lg tw-p-3 tw-w-full focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-green-500" />
          </div>
        </div>

        <div class="tw-flex tw-gap-2 tw-justify-end tw-mt-6 tw-pt-4 tw-border-t">
          <button @click="showAddMemoryModal = false"
            class="tw-px-4 tw-py-2 tw-bg-stone-200 tw-text-stone-800 tw-rounded-lg hover:tw-bg-stone-300 tw-transition-colors">
            Hủy
          </button>
          <button @click="saveNewMemory"
            class="tw-px-4 tw-py-2 tw-bg-red tw-text-white tw-rounded-lg hover:tw-bg-green-700 tw-transition-colors tw-flex tw-items-center tw-gap-2">
            <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Lưu
          </button>
        </div>
      </div>
    </div>

    <!-- Add Color Modal -->
    <div v-if="showAddColorModal"
      class="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-50"
      @click="showAddColorModal = false">
      <div class="tw-bg-white tw-rounded-lg tw-p-6 tw-max-w-md tw-w-full tw-mx-4" @click.stop>
        <div class="tw-flex tw-items-center tw-gap-3 tw-mb-4 tw-pb-3 tw-border-b">
          <svg class="tw-w-6 tw-h-6 tw-text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          <h3 class="tw-text-xl tw-font-bold tw-text-stone-800">Thêm màu sắc mới</h3>
        </div>
        
        <div class="tw-space-y-4">
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-text-stone-700 tw-mb-2">
              Tên màu <span class="tw-text-red-500">*</span>
            </label>
            <input v-model="newColor.name" type="text" placeholder="VD: Đen, Trắng, Xanh dương..."
              class="tw-border tw-border-stone-300 tw-rounded-lg tw-p-3 tw-w-full focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-purple-500" />
          </div>
          
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-text-stone-700 tw-mb-2">
              Mã màu (HEX) <span class="tw-text-red-500">*</span>
            </label>
            <div class="tw-flex tw-gap-2">
              <input v-model="newColor.code" type="color"
                class="tw-h-12 tw-w-16 tw-border tw-border-stone-300 tw-rounded-lg tw-cursor-pointer" />
              <input v-model="newColor.code" type="text" placeholder="#000000"
                class="tw-flex-1 tw-border tw-border-stone-300 tw-rounded-lg tw-p-3 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-purple-500" />
            </div>
            <p class="tw-text-xs tw-text-stone-500 tw-mt-1">Preview: 
              <span class="tw-inline-block tw-w-6 tw-h-6 tw-rounded tw-border tw-border-stone-300 tw-ml-2 tw-align-middle"
                :style="{ backgroundColor: newColor.code }"></span>
            </p>
          </div>
        </div>

        <div class="tw-flex tw-gap-2 tw-justify-end tw-mt-6 tw-pt-4 tw-border-t">
          <button @click="showAddColorModal = false"
            class="tw-px-4 tw-py-2 tw-bg-stone-200 tw-text-stone-800 tw-rounded-lg hover:tw-bg-stone-300 tw-transition-colors">
            Hủy
          </button>
          <button @click="saveNewColor"
            class="tw-px-4 tw-py-2 tw-bg-red tw-text-white tw-rounded-lg hover:tw-bg-purple-700 tw-transition-colors tw-flex tw-items-center tw-gap-2">
            <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Lưu
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { $axios } from '@/plugins/axios/axios'
import { getImageUrl } from '@/utils/imageUrl'

const router = useRouter()
const route = useRoute()

const productId = route.params.id

// Data
const product = ref({
  name: '',
  description: '',
  basePrice: 0,
  discountPercentage: 0,
  thumbUrl: '',
  slug: '',
  brandId: '',
  categoryId: '',
})

const selectedColorId = ref('')
const selectedMemoryId = ref('') // For variant selector
const selectedVariantColorId = ref('') // For variant selector
const currentImageIndex = ref(0)
const currentVariantImageIndex = ref(0) // For variant images
const newImageUrl = ref('')
const showDeleteModal = ref(false)
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const showConfirmModal = ref(false)
const modalMessage = ref('')
const modalCallback = ref(null)
const fileInput = ref(null)
const selectedFileName = ref('')
const selectedFile = ref(null)

// Options & Related Data
const categories = ref([])
const brands = ref([])
const colors = ref([])
const memories = ref([])
const specifications = ref([])

// Modal states
const showAddMemoryModal = ref(false)
const showAddColorModal = ref(false)

// New data for modals
const newMemory = ref({
  ram: '',
  rom: ''
})

const newColor = ref({
  name: '',
  code: '#000000'
})

// Product Related Data
const productVariants = ref([]) // Các biến thể (color + memory + price + stock)
const productImages = ref([]) // Hình ảnh theo màu
const productSpecs = ref([]) // Thông số kỹ thuật

// Computed
const selectedColor = computed(() => {
  return colors.value.find(c => c._id === selectedColorId.value)
})

// NEW: Computed for variant selector
const availableMemories = computed(() => {
  return memories.value
})

const availableColors = computed(() => {
  return colors.value
})

// Thay đổi từ computed sang reactive để có thể edit
const selectedVariant = computed({
  get() {
    if (!selectedMemoryId.value || !selectedVariantColorId.value) return null

    // Tìm variant có sẵn trong database - TÌM TRỰC TIẾP trong array để có thể edit
    // So sánh cả trường hợp object và string
    const existingVariant = productVariants.value.find(v => {
      const vMemoryId = v.memoryId?._id || v.memoryId
      const vColorId = v.colorId?._id || v.colorId
      return vMemoryId === selectedMemoryId.value && vColorId === selectedVariantColorId.value
    })

    // Nếu tìm thấy, trả về reference thật (không phải copy)
    if (existingVariant) {
      console.log('✅ Found existing variant:', existingVariant)
      return existingVariant
    }

    // Nếu chưa có, tạo "virtual variant" để hiển thị form
    // console.log('🆕 Creating virtual variant')
    // return {
    //   memoryId: selectedMemoryId.value,
    //   colorId: selectedVariantColorId.value,
    //   price: product.value.basePrice || 0,
    //   stock: 0,
    //   isNew: true, // Đánh dấu là variant mới
    //   isVirtual: true // Đánh dấu là virtual (chưa lưu DB)
    // }
  },
  set(newValue) {
    // Khi set giá trị mới, update vào array
    if (!newValue) return

    // So sánh cả trường hợp object và string
    const index = productVariants.value.findIndex(v => {
      const vMemoryId = v.memoryId?._id || v.memoryId
      const vColorId = v.colorId?._id || v.colorId
      return vMemoryId === selectedMemoryId.value && vColorId === selectedVariantColorId.value
    })

    if (index !== -1) {
      // Update existing variant
      productVariants.value[index] = { ...productVariants.value[index], ...newValue }
    }
  }
})

const imagesForSelectedColor = computed(() => {
  if (!selectedColorId.value) return []
  return productImages.value.filter(img => img.colorId === selectedColorId.value)
})

// NEW: Images for selected variant color - filter by colorId only
const imagesForSelectedVariantColor = computed(() => {
  if (!selectedVariantColorId.value) {
    console.log('⚠️ No selectedVariantColorId')
    return []
  }

  // Filter by colorId (handle both populated object and ID string)
  const filtered = productImages.value.filter(img => {
    const imgColorId = img.colorId?._id || img.colorId
    const matches = imgColorId === selectedVariantColorId.value
    if (matches) {
      console.log('✅ Image matches:', img.name, imgColorId)
    }
    return matches
  })

  console.log(`📸 Found ${filtered.length} images for color:`, selectedVariantColorId.value)
  return filtered
})

const displayedSpecs = computed(() => {
  const specs = []

  // 1. Add product specifications (chung cho tất cả variants)
  // Return DIRECT REFERENCE để có thể edit
  productSpecs.value.forEach(spec => {
    specs.push(spec) // Không spread, return reference trực tiếp
  })

  // 2. Add memory specs from selected variant (RAM, ROM, Chipset)
  if (selectedVariant.value && selectedVariant.value.memoryId) {
    const memory = selectedVariant.value.memoryId

    if (memory.ram !== undefined && memory.ram !== null) {
      // Create reactive proxy object with getter/setter
      const ramSpec = {
        _id: `memory-ram-${memory._id}`,
        specName: 'RAM',
        get specValue() {
          return memory.ram
        },
        set specValue(value) {
          memory.ram = value
        },
        isMemorySpec: true,
        memoryField: 'ram',
        memoryId: memory._id,
      }
      specs.push(ramSpec)
    }

    if (memory.rom !== undefined && memory.rom !== null) {
      const romSpec = {
        _id: `memory-rom-${memory._id}`,
        specName: 'Bộ nhớ trong',
        get specValue() {
          return memory.rom
        },
        set specValue(value) {
          memory.rom = value
        },
        isMemorySpec: true,
        memoryField: 'rom',
        memoryId: memory._id,
      }
      specs.push(romSpec)
    }

    if (memory.chipset !== undefined && memory.chipset !== null) {
      const chipsetSpec = {
        _id: `memory-chipset-${memory._id}`,
        specName: 'Chipset',
        get specValue() {
          return memory.chipset
        },
        set specValue(value) {
          memory.chipset = value
        },
        isMemorySpec: true,
        memoryField: 'chipset',
        memoryId: memory._id,
      }
      specs.push(chipsetSpec)
    }
  }

  return specs
})

const currentImage = computed(() => {
  const images = imagesForSelectedColor.value
  if (!images || images.length === 0) return getImageUrl(product.value.thumbUrl)
  return getImageUrl(images[currentImageIndex.value]?.imageUrl) || getImageUrl(product.value.thumbUrl)
})

const currentVariantImage = computed(() => {
  const images = imagesForSelectedVariantColor.value
  if (!images || images.length === 0) return getImageUrl(product.value.thumbUrl)
  return getImageUrl(images[currentVariantImageIndex.value]?.imageUrl) || getImageUrl(product.value.thumbUrl)
})

// Load data
onMounted(async () => {
  try {
    // Load dropdown data first (with fallbacks)
    await Promise.all([
      loadCategories(),
      loadBrands(),
      loadColors(),
      loadMemories(),
      loadSpecifications()
    ])

    // Then load product data
    await loadProduct()
  } catch (error) {
    console.error('Error in onMounted:', error)
    alert('Có lỗi khi tải dữ liệu. Vui lòng kiểm tra console.')
  }
})

async function loadCategories() {
  try {
    const res = await $axios.get('/categories')
    categories.value = res.items || res || []
    console.log('✅ Loaded categories:', categories.value.length, 'items')
  } catch (error) {
    console.error('❌ Error loading categories:', error)
    categories.value = []
  }
}

async function loadBrands() {
  try {
    const res = await $axios.get('/brands')
    brands.value = res.items || res || []
    console.log('✅ Loaded brands:', brands.value.length, 'items')
  } catch (error) {
    console.error('❌ Error loading brands:', error)
    brands.value = []
  }
}

async function loadColors() {
  try {
    const res = await $axios.get('/colors')
    colors.value = res.items || res || []
    console.log('✅ Loaded colors:', colors.value.length, 'items')
  } catch (error) {
    console.error('❌ Error loading colors:', error)
    colors.value = []
  }
}

async function loadMemories() {
  try {
    const res = await $axios.get('/memories')
    memories.value = res.items || res || []
    console.log('✅ Loaded memories:', memories.value.length, 'items')
  } catch (error) {
    console.error('❌ Error loading memories:', error)
    memories.value = []
  }
}

async function loadSpecifications() {
  try {
    const res = await $axios.get('/specifications')
    specifications.value = res.items || res || []
    console.log('✅ Loaded specifications:', specifications.value.length, 'items')
  } catch (error) {
    console.error('❌ Error loading specifications:', error)
    specifications.value = []
  }
}

async function loadProduct() {
  try {
    // Load product basic info
    console.log('📦 Loading product:', productId)
    const productRes = await $axios.get(`/products/${productId}`)

    // API returns data directly after interceptor
    const productData = productRes.item || productRes
    console.log('✅ Product data received:', productData)

    // Ensure product has required fields
    product.value = {
      name: productData.name || '',
      description: productData.description || '',
      basePrice: productData.basePrice || productData.price || 0,
      discountPercentage: productData.discountPercentage || 0,
      thumbUrl: productData.thumbUrl || productData.image || '',
      slug: productData.slug || '',
      brandId: productData.brand || productData.brandId || '',
      categoryId: productData.category || productData.categoryId || '',
    }

    // Try to load product variants (may not exist yet)
    try {
      const variantsRes = await $axios.get(`/products/${productId}/variants`)
      productVariants.value = variantsRes.items || variantsRes || []
      console.log('✅ Loaded variants:', productVariants.value.length)
      console.log('📋 Variant data:', productVariants.value)
      console.log('🎨 Colors data:', colors.value)
      console.log('💾 Memories data:', memories.value)
    } catch (err) {
      console.log('⚠️ No variants found:', err.message)
      productVariants.value = []
    }

    // Try to load product images (may not exist yet)
    try {
      const imagesRes = await $axios.get(`/products/${productId}/images`)
      productImages.value = imagesRes.items || imagesRes || []
      console.log('✅ Loaded images:', productImages.value.length)
    } catch (err) {
      console.log('⚠️ No images found:', err.message)
      productImages.value = []
    }

    // Try to load product specifications (may not exist yet)
    try {
      const specsRes = await $axios.get(`/products/${productId}/specifications`)
      const rawSpecs = specsRes.items || specsRes || []

      console.log('🔍 Raw specs from API:', rawSpecs)

      // Populate specName - specsId is already populated by backend
      productSpecs.value = rawSpecs.map(spec => {
        return {
          ...spec,
          // specsId is an object with _id and specName
          specName: spec.specsId?.specName || '' // Lấy tên từ populated object
        }
      })

      console.log('✅ Loaded specs:', productSpecs.value.length)
      console.log('📋 Specs with names:', productSpecs.value)
    } catch (err) {
      console.log('⚠️ No specs found:', err.message)
      productSpecs.value = []
    }

    // Set default selected color (first available)
    if (productVariants.value.length > 0) {
      selectedColorId.value = productVariants.value[0].colorId
    } else if (colors.value.length > 0) {
      selectedColorId.value = colors.value[0]._id
    }

    console.log('✅ Product loaded successfully!')
  } catch (error) {
    console.error('❌ Error loading product:', error)
    showError('Không thể tải thông tin sản phẩm: ' + error.message)
  }
}

// Modal helpers
function showSuccess(message) {
  modalMessage.value = message
  showSuccessModal.value = true
}

function showError(message) {
  modalMessage.value = message
  showErrorModal.value = true
}

function showConfirm(message, callback) {
  modalMessage.value = message
  modalCallback.value = callback
  showConfirmModal.value = true
}

function handleConfirm() {
  if (modalCallback.value) {
    modalCallback.value()
  }
  showConfirmModal.value = false
  modalCallback.value = null
}

// File upload handler
async function handleFileSelect(event) {
  const file = event.target.files?.[0]
  if (!file) return

  if (!selectedVariantColorId.value) {
    showError('Vui lòng chọn màu trước khi thêm ảnh')
    return
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    showError('Vui lòng chọn file ảnh hợp lệ')
    return
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    showError('Kích thước file không được vượt quá 5MB')
    return
  }

  selectedFileName.value = file.name
  selectedFile.value = file

  // Read file and create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    const base64 = e.target.result

    // Add temporary preview to productImages
    const tempImage = {
      _id: `temp-${Date.now()}`,
      imageUrl: base64,
      name: file.name,
      originalName: file.name,
      colorId: selectedVariantColorId.value,
      fileSize: file.size,
      isTemp: true // Flag to identify temp images
    }

    productImages.value.push(tempImage)
    currentVariantImageIndex.value = productImages.value.filter(
      img => img.colorId === selectedVariantColorId.value
    ).length - 1

    console.log('✅ File preview added:', file.name)
  }

  reader.onerror = () => {
    showError('Lỗi khi đọc file')
  }

  reader.readAsDataURL(file)
}

// Upload temp file to server
async function uploadTempFile() {
  if (!selectedFile.value) return null

  try {
    const formData = new FormData()
    formData.append('image', selectedFile.value)
    formData.append('colorId', selectedVariantColorId.value)

    console.log('📤 Uploading file:', selectedFile.value.name)
    console.log('📦 FormData entries:')
    for (let pair of formData.entries()) {
      console.log('  -', pair[0], ':', pair[1])
    }

    // ⚠️ KHÔNG set Content-Type header - để browser tự động set với boundary
    const res = await $axios.post(`/products/${productId}/images/upload`, formData)

    console.log('✅ Upload response:', res)

    // Remove temp image and add real one
    productImages.value = productImages.value.filter(img => !img.isTemp)
    productImages.value.push(res.item || res.data || res)

    selectedFile.value = null
    selectedFileName.value = ''

    return res.item || res
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}

// Image management
function nextImage() {
  const images = imagesForSelectedColor.value
  if (images.length === 0) return
  currentImageIndex.value = (currentImageIndex.value + 1) % images.length
}

function prevImage() {
  const images = imagesForSelectedColor.value
  if (images.length === 0) return
  currentImageIndex.value = (currentImageIndex.value - 1 + images.length) % images.length
}

function selectImage(index) {
  currentImageIndex.value = index
}

// NEW: Variant image management
function nextVariantImage() {
  const images = imagesForSelectedVariantColor.value
  if (images.length === 0) return
  currentVariantImageIndex.value = (currentVariantImageIndex.value + 1) % images.length
}

function prevVariantImage() {
  const images = imagesForSelectedVariantColor.value
  if (images.length === 0) return
  currentVariantImageIndex.value = (currentVariantImageIndex.value - 1 + images.length) % images.length
}

function selectVariantImage(index) {
  currentVariantImageIndex.value = index
}

// Update image name only (no category, no isMain)
async function updateImageName(image) {
  if (!image._id) return

  // Skip temp images (not yet saved to database)
  if (image._id.toString().startsWith('temp-')) {
    console.log('⚠️ Skipping update for temp image:', image._id)
    return
  }

  try {
    await $axios.put(`/products/${productId}/images/${image._id}`, {
      name: image.name
    })
    console.log('✅ Updated image name:', image.name)
  } catch (error) {
    console.error('Error updating image name:', error)
    showError('Lỗi khi cập nhật tên ảnh')
  }
}

async function addVariantImage() {
  if (!newImageUrl.value.trim() || !selectedVariantColorId.value) {
    showError('Vui lòng nhập URL hình ảnh')
    return
  }

  try {
    const newImage = {
      productId: productId,
      colorId: selectedVariantColorId.value,
      name: `${product.value.name} - ${getColorName(selectedVariantColorId.value)}`,
      imageUrl: newImageUrl.value.trim(),
      originalName: newImageUrl.value.trim().split('/').pop(),
      fileSize: 1024
    }

    const res = await $axios.post(`/products/${productId}/images`, newImage)
    productImages.value.push(res.item || res)
    newImageUrl.value = ''
    showSuccess('Đã thêm ảnh!')
  } catch (error) {
    console.error('Error adding image:', error)
    showError('Lỗi khi thêm ảnh')
  }
}

async function removeVariantImage(imageId) {
  showConfirm('Bạn có chắc muốn xóa ảnh này?', async () => {
    try {
      // If temp image, just remove from array
      if (imageId.toString().startsWith('temp-')) {
        productImages.value = productImages.value.filter(img => img._id !== imageId)
        showSuccess('Đã xóa ảnh!')
        return
      }

      await $axios.delete(`/products/${productId}/images/${imageId}`)
      productImages.value = productImages.value.filter(img => img._id !== imageId)
      showSuccess('Đã xóa ảnh!')
    } catch (error) {
      console.error('Error removing image:', error)
      showError('Lỗi khi xóa ảnh')
    }
  })
}

async function addImage() {
  if (!newImageUrl.value.trim() || !selectedColorId.value) {
    showError('Vui lòng chọn màu và nhập URL hình ảnh')
    return
  }

  try {
    const newImage = {
      productId: productId,
      colorId: selectedColorId.value,
      name: `${product.value.name} - ${selectedColor.value?.name}`,
      imageUrl: newImageUrl.value.trim(),
      originalName: newImageUrl.value.trim().split('/').pop(),
      fileSize: 1024
    }

    const res = await $axios.post(`/products/${productId}/images`, newImage)
    productImages.value.push(res.item || res)
    newImageUrl.value = ''
    showSuccess('Đã thêm ảnh!')
  } catch (error) {
    console.error('Error adding image:', error)
    showError('Lỗi khi thêm ảnh')
  }
}

async function removeImage(imageId) {
  showConfirm('Bạn có chắc muốn xóa ảnh này?', async () => {
    try {
      await $axios.delete(`/products/${productId}/images/${imageId}`)
      productImages.value = productImages.value.filter(img => img._id !== imageId)
      showSuccess('Đã xóa ảnh!')
    } catch (error) {
      console.error('Error removing image:', error)
      showError('Lỗi khi xóa ảnh')
    }
  })
}

// Variants management - OLD functions removed, replaced with new selector UI

// Specifications
function addSpec() {
  if (!selectedVariant.value) {
    showError('Vui lòng chọn phiên bản trước khi thêm thông số')
    return
  }

  productSpecs.value.push({
    productId: productId,
    variantId: selectedVariant.value._id || null,
    specsId: '', // ID của spec từ master list
    specName: '', // Sẽ được populate khi chọn từ dropdown
    specValue: '',
    isNew: true
  })
}

function onSpecSelected(spec) {
  // Khi user chọn spec từ dropdown, populate specName
  const specMaster = specifications.value.find(s => s._id === spec.specsId)
  if (specMaster) {
    spec.specName = specMaster.specName
  }
}

async function removeSpec(index) {
  const spec = productSpecs.value[index]

  if (spec.isNew) {
    productSpecs.value.splice(index, 1)
    return
  }

  showConfirm('Bạn có chắc muốn xóa thông số này?', async () => {
    try {
      await $axios.delete(`/products/${productId}/specifications/${spec._id}`)
      productSpecs.value.splice(index, 1)
      showSuccess('Đã xóa thông số!')
    } catch (error) {
      console.error('Error removing spec:', error)
      showError('Lỗi khi xóa thông số')
    }
  })
}

// Actions
async function saveProduct() {
  try {
    console.log('💾 Saving product...')

    // Upload temp file first if exists
    if (selectedFile.value) {
      await uploadTempFile()
    }

    // Update basic product info
    console.log('📦 Updating product info...')
    await $axios.patch(`/products/${productId}`, product.value)

    // Update/Create variants
    console.log('🎨 Updating variants...', productVariants.value.length)
    for (const variant of productVariants.value) {
      // Clean variant data - extract IDs if they are objects
      const cleanVariant = {
        memoryId: variant.memoryId?._id || variant.memoryId,
        colorId: variant.colorId?._id || variant.colorId,
        price: variant.price,
        stock: variant.stock
      }

      // Check if _id is temp (starts with "temp-")
      const isTempId = variant._id && variant._id.toString().startsWith('temp-')

      if (variant.isNew || isTempId) {
        console.log('➕ Creating new variant:', cleanVariant)
        const created = await $axios.post(`/products/${productId}/variants`, cleanVariant)
        // Update the variant with real _id from server
        variant._id = created._id || created.item?._id
        delete variant.isNew
      } else if (!variant.isVirtual && variant._id) {
        console.log('✏️ Updating variant:', variant._id, cleanVariant)
        await $axios.put(`/products/${productId}/variants/${variant._id}`, cleanVariant)
      }
    }

    // Update/Create specifications
    console.log('📋 Updating specifications...', productSpecs.value.length)
    for (const spec of productSpecs.value) {
      // Skip memory specs (they will be saved separately)
      if (spec.isMemorySpec) continue

      // Validate spec data
      if (!spec.specsId || !spec.specValue) {
        console.warn('⚠️ Skipping invalid spec:', spec)
        continue
      }

      if (spec.isNew) {
        console.log('➕ Creating new spec:', spec.specName, spec.specValue)
        const newSpec = {
          productId: productId,
          specsId: spec.specsId,
          specValue: spec.specValue
        }
        delete spec.isNew
        const created = await $axios.post(`/products/${productId}/specifications`, newSpec)
        spec._id = created._id || created.item?._id // Save the new _id
      } else if (spec._id) {
        console.log('✏️ Updating spec:', spec._id, spec.specValue)
        await $axios.put(`/products/${productId}/specifications/${spec._id}`, {
          specValue: spec.specValue
        })
      }
    }

    // Update memory specs if variant is selected
    if (selectedVariant.value && selectedVariant.value.memoryId) {
      const memory = selectedVariant.value.memoryId
      const memoryId = memory._id || memory

      console.log('💾 Updating memory specs:', memoryId, {
        ram: memory.ram,
        rom: memory.rom,
        chipset: memory.chipset
      })

      await $axios.put(`/memories/${memoryId}`, {
        ram: memory.ram,
        rom: memory.rom,
        chipset: memory.chipset
      })
    }

    showSuccess('Cập nhật sản phẩm thành công!')
    console.log('✅ Save completed!')
    await loadProduct() // Reload to get updated data
  } catch (error) {
    console.error('❌ Error saving product:', error)
    showError('Lỗi khi cập nhật sản phẩm: ' + (error.response?.data?.message || error.message))
  }
}

async function deleteProduct() {
  try {
    await $axios.delete(`/products/${productId}`)
    showSuccess('Xóa sản phẩm thành công!')
    setTimeout(() => {
      router.push('/admin/products')
    }, 1500)
  } catch (error) {
    console.error('Error deleting product:', error)
    showError('Lỗi khi xóa sản phẩm')
  }
  showDeleteModal.value = false
}

function goBack() {
  router.push('/admin/products')
}

// Save new memory
async function saveNewMemory() {
  try {
    // Validate
    if (!newMemory.value.ram || !newMemory.value.rom) {
      showAddMemoryModal.value = false
      showError('Vui lòng nhập RAM và Bộ nhớ!')
      return
    }

    console.log('💾 Creating new memory:', newMemory.value)
    
    // Call API to create memory
    const response = await $axios.post('/memories', {
      ram: newMemory.value.ram,
      rom: newMemory.value.rom
    })

    console.log('✅ Memory created - Full response:', response)
    console.log('✅ Memory created - response.item:', response.item)
    console.log('✅ Memory created - response.data:', response.data)

    // Add to memories array - handle different response structures
    let newMemoryItem = response.item || response.data?.item || response.data || response
    
    // Ensure it has the required fields
    if (!newMemoryItem.ram || !newMemoryItem.rom) {
      console.error('❌ Invalid memory structure:', newMemoryItem)
      throw new Error('Response không có cấu trúc đúng')
    }

    console.log('✅ Adding memory to array:', newMemoryItem)
    memories.value.push(newMemoryItem)

    // Auto-select the new memory
    selectedMemoryId.value = newMemoryItem._id

    // Reset form and close modal
    newMemory.value = {
      ram: '',
      rom: ''
    }
    showAddMemoryModal.value = false

    showSuccess('Thêm RAM & Bộ nhớ thành công! Giờ hãy chọn màu sắc và nhấn "Thêm phiên bản".')
  } catch (error) {
    console.error('❌ Error creating memory:', error)
    showError('Có lỗi xảy ra khi thêm RAM & Bộ nhớ!')
  }
}

// Save new color
async function saveNewColor() {
  try {
    // Validate
    if (!newColor.value.name || !newColor.value.code) {
      showAddColorModal.value = false
      showError('Vui lòng nhập tên và mã màu!')
      return
    }

    console.log('💾 Creating new color:', newColor.value)
    
    // Call API to create color
    const response = await $axios.post('/colors', {
      name: newColor.value.name,
      code: newColor.value.code
    })

    console.log('✅ Color created:', response)

    // Add to colors array
    const newColorItem = response.item || response
    colors.value.push(newColorItem)

    // Auto-select the new color
    selectedVariantColorId.value = newColorItem._id

    // Reset form and close modal
    newColor.value = {
      name: '',
      code: '#000000'
    }
    showAddColorModal.value = false

    showSuccess('Thêm màu sắc thành công! Giờ hãy chọn bộ nhớ và nhấn "Thêm phiên bản".')
  } catch (error) {
    console.error('❌ Error creating color:', error)
    showError('Có lỗi xảy ra khi thêm màu sắc!')
  }
}

// // Delete memory
// async function deleteMemory(memoryId) {
//   // Check if memory is used in any variant
//   const isUsed = productVariants.value.some(v => {
//     const vMemoryId = v.memoryId?._id || v.memoryId
//     return vMemoryId === memoryId
//   })

//   if (isUsed) {
//     showError('Không thể xóa! Bộ nhớ này đang được sử dụng trong phiên bản sản phẩm.')
//     return
//   }

//   showConfirm('Bạn có chắc muốn xóa bộ nhớ này?', async () => {
//     try {
//       console.log('🗑️ Deleting memory:', memoryId)
//       await $axios.delete(`/memories/${memoryId}`)
      
//       // Remove from array
//       memories.value = memories.value.filter(m => m._id !== memoryId)
      
//       // Deselect if this was selected
//       if (selectedMemoryId.value === memoryId) {
//         selectedMemoryId.value = ''
//       }
      
//       showSuccess('Đã xóa bộ nhớ!')
//     } catch (error) {
//       console.error('❌ Error deleting memory:', error)
//       showError('Lỗi khi xóa bộ nhớ: ' + (error.response?.data?.message || error.message))
//     }
//   })
// }

// // Delete color
// async function deleteColor(colorId) {
//   // Check if color is used in any variant
//   const isUsed = productVariants.value.some(v => {
//     const vColorId = v.colorId?._id || v.colorId
//     return vColorId === colorId
//   })

//   if (isUsed) {
//     showError('Không thể xóa! Màu này đang được sử dụng trong phiên bản sản phẩm.')
//     return
//   }

//   // Check if color is used in any product images
//   const hasImages = productImages.value.some(img => {
//     const imgColorId = img.colorId?._id || img.colorId
//     return imgColorId === colorId
//   })

//   if (hasImages) {
//     showError('Không thể xóa! Màu này có hình ảnh liên quan. Vui lòng xóa hình ảnh trước.')
//     return
//   }

//   showConfirm('Bạn có chắc muốn xóa màu này?', async () => {
//     try {
//       console.log('🗑️ Deleting color:', colorId)
//       await $axios.delete(`/colors/${colorId}`)
      
//       // Remove from array
//       colors.value = colors.value.filter(c => c._id !== colorId)
      
//       // Deselect if this was selected
//       if (selectedVariantColorId.value === colorId) {
//         selectedVariantColorId.value = ''
//       }
//       if (selectedColorId.value === colorId) {
//         selectedColorId.value = ''
//       }
      
//       showSuccess('Đã xóa màu!')
//     } catch (error) {
//       console.error('❌ Error deleting color:', error)
//       showError('Lỗi khi xóa màu: ' + (error.response?.data?.message || error.message))
//     }
//   })
// }

function getColorName(colorId) {
  if (!colorId) return 'N/A'
  const color = colors.value.find(c => c._id === colorId || c._id === colorId?._id)
  console.log('🔍 Looking for color:', colorId, 'Found:', color)
  return color?.name || 'N/A'
}

function getColorCode(colorId) {
  if (!colorId) return '#cccccc'
  const color = colors.value.find(c => c._id === colorId || c._id === colorId?._id)
  return color?.code || '#cccccc'
}

function getMemoryName(memoryId) {
  if (!memoryId) return ''
  const memory = memories.value.find(m => m._id === memoryId || m._id === memoryId?._id)
  return memory ? `${memory.ram} / ${memory.rom}` : ''
}

function getMemoryDisplay(memoryId) {
  if (!memoryId) return 'N/A'
  const memory = memories.value.find(m => m._id === memoryId || m._id === memoryId?._id)
  console.log('🔍 Looking for memory:', memoryId, 'Found:', memory)
  if (!memory) return 'N/A'
  return `${memory.ram} / ${memory.rom}`
}

function getSpecName(specId) {
  const spec = specifications.value.find(s => s._id === specId)
  return spec?.specName || ''
}

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

// NEW: Variant selector functions
function selectVariantForEdit(variant) {
  console.log('🔄 Selecting variant for edit:', variant)

  const colorId = variant.colorId?._id || variant.colorId  // Lấy ._id nếu là object, giữ nguyên nếu là string
  const memoryId = variant.memoryId?._id || variant.memoryId

  selectedMemoryId.value = memoryId
  selectedVariantColorId.value = colorId  // ← Bây giờ luôn là STRING!

  // selectedMemoryId.value = variant.memoryId
  // selectedVariantColorId.value = variant.colorId

  // Reset image index khi chuyển variant
  currentVariantImageIndex.value = 0
  console.log('✅ Updated: Memory=', selectedMemoryId.value, 'Color=', selectedVariantColorId.value)
  console.log('📸 Images count:', imagesForSelectedVariantColor.value.length)
}

// Create new variant
function createNewVariant() {
  if (!selectedMemoryId.value || !selectedVariantColorId.value) {
    showError('Vui lòng chọn cả RAM & Bộ nhớ và Màu sắc!')
    return
  }

  // Check if variant already exists
  const exists = productVariants.value.find(v => {
    const vMemoryId = v.memoryId?._id || v.memoryId
    const vColorId = v.colorId?._id || v.colorId
    return vMemoryId === selectedMemoryId.value && vColorId === selectedVariantColorId.value
  })

  if (exists) {
    showError('Phiên bản này đã tồn tại!')
    return
  }

  console.log('🆕 Creating new variant:', selectedMemoryId.value, selectedVariantColorId.value)

  // Create new variant object
  const newVariant = {
    _id: `temp-${Date.now()}`, // Temporary ID
    memoryId: selectedMemoryId.value,
    colorId: selectedVariantColorId.value,
    price: product.value.basePrice || 0,
    stock: 0,
    isNew: true // Flag for saving
  }

  productVariants.value.push(newVariant)
  
  // Auto-select the new variant for editing
  selectVariantForEdit(newVariant)

  showSuccess('Đã tạo phiên bản mới! Hãy nhập giá và số lượng, sau đó nhấn "Lưu sản phẩm" ở cuối trang.')
}

async function deleteSelectedVariant() {
  if (!selectedVariant.value) return

  showConfirm(`Xóa variant ${getColorName(selectedVariant.value.colorId)} - ${getMemoryDisplay(selectedVariant.value.memoryId)}?`, async () => {
    const variant = selectedVariant.value

    if (variant.isNew) {
      productVariants.value = productVariants.value.filter(v =>
        !(v.memoryId === variant.memoryId && v.colorId === variant.colorId)
      )
      showSuccess('Đã xóa variant')
    } else {
      try {
        await $axios.delete(`/products/${productId}/variants/${variant._id}`)
        productVariants.value = productVariants.value.filter(v => v._id !== variant._id)
        showSuccess('Đã xóa variant')
      } catch (error) {
        console.error('Error deleting variant:', error)
        showError('Lỗi khi xóa variant')
      }
    }

    // Reset selection
    selectedMemoryId.value = ''
    selectedVariantColorId.value = ''
  })
}
</script>

<route lang="yaml">
meta:
  layout: admin
</route>
