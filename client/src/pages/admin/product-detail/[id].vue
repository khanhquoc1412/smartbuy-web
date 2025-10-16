<template>
  <div class="tw-bg-stone-50 tw-min-h-screen tw--mx-4">
    <div class="tw-max-w-7xl tw-mx-auto tw-p-6">
      <!-- Header -->
      <div class="tw-flex tw-items-center tw-justify-between tw-mb-6 tw-bg-white tw-p-4 tw-rounded-lg tw-shadow-sm">
        <div class="tw-flex tw-items-center tw-gap-4">
          <button @click="goBack" class="tw-p-2 tw-rounded-lg hover:tw-bg-stone-100 tw-transition-colors">
            <svg class="tw-w-6 tw-h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 class="tw-text-2xl tw-font-bold tw-text-stone-800">Chỉnh sửa sản phẩm</h1>
        </div>
        <div class="tw-flex tw-gap-2">
          <button @click="saveProduct" class="tw-px-6 tw-py-2 tw-bg-crimson-600 tw-text-white tw-rounded-lg hover:tw-bg-crimson-700 tw-transition-colors tw-font-medium">
            💾 Lưu thay đổi
          </button>
          <button @click="showDeleteModal = true" class="tw-px-6 tw-py-2 tw-bg-stone-600 tw-text-white tw-rounded-lg hover:tw-bg-stone-700 tw-transition-colors tw-font-medium">
            🗑️ Xóa sản phẩm
          </button>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="tw-grid tw-grid-cols-1 lg:tw-grid-cols-3 tw-gap-6">
        
        <!-- Left Column - Images -->
        <div class="lg:tw-col-span-1">
          <div class="tw-bg-white tw-rounded-lg tw-shadow-sm tw-p-6">
            <h2 class="tw-text-lg tw-font-semibold tw-mb-4 tw-text-stone-800">🖼️ Hình ảnh sản phẩm</h2>
            
            <!-- Color Selector -->
            <div class="tw-mb-4">
              <label class="tw-block tw-text-sm tw-font-medium tw-text-stone-700 tw-mb-2">Chọn màu để xem/quản lý ảnh</label>
              <div class="tw-flex tw-flex-wrap tw-gap-2">
                <button
                  v-for="color in colors"
                  :key="color._id"
                  @click="selectedColorId = color._id; currentImageIndex = 0"
                  class="tw-px-3 tw-py-2 tw-rounded-lg tw-border-2 tw-transition-all tw-flex tw-items-center tw-gap-2"
                  :class="selectedColorId === color._id 
                    ? 'tw-border-crimson-600 tw-bg-crimson-50' 
                    : 'tw-border-stone-300 tw-bg-white hover:tw-border-stone-400'"
                >
                  <div 
                    class="tw-w-4 tw-h-4 tw-rounded-full tw-border tw-border-stone-300"
                    :style="{ backgroundColor: color.code }"
                  ></div>
                  <span class="tw-text-sm">{{ color.name }}</span>
                </button>
              </div>
            </div>

            <!-- Image Slider -->
            <div class="tw-border-2 tw-border-stone-300 tw-rounded-lg tw-mb-4 tw-bg-stone-50 tw-aspect-square tw-flex tw-items-center tw-justify-center tw-relative tw-overflow-hidden">
              <img v-if="currentImage" :src="currentImage" alt="Product image" class="tw-max-h-full tw-max-w-full tw-object-contain" />
              <div v-else class="tw-text-center tw-text-stone-400">
                <svg class="tw-w-16 tw-h-16 tw-mx-auto tw-mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <p>Chưa có ảnh cho màu này</p>
              </div>
              
              <!-- Navigation Arrows -->
              <button 
                v-if="imagesForSelectedColor.length > 1"
                @click="prevImage"
                class="tw-absolute tw-left-2 tw-top-1/2 tw--translate-y-1/2 tw-bg-black tw-bg-opacity-50 tw-text-white tw-p-2 tw-rounded-full hover:tw-bg-opacity-75 tw-transition-all"
              >
                ‹
              </button>
              <button 
                v-if="imagesForSelectedColor.length > 1"
                @click="nextImage"
                class="tw-absolute tw-right-2 tw-top-1/2 tw--translate-y-1/2 tw-bg-black tw-bg-opacity-50 tw-text-white tw-p-2 tw-rounded-full hover:tw-bg-opacity-75 tw-transition-all"
              >
                ›
              </button>
              
              <!-- Image Counter -->
              <div v-if="imagesForSelectedColor.length > 0" class="tw-absolute tw-bottom-2 tw-left-1/2 tw--translate-x-1/2 tw-bg-black tw-bg-opacity-50 tw-text-white tw-px-3 tw-py-1 tw-rounded-full tw-text-sm">
                {{ currentImageIndex + 1 }} / {{ imagesForSelectedColor.length }}
              </div>
            </div>

            <!-- Thumbnail Grid -->
            <div class="tw-grid tw-grid-cols-4 tw-gap-2 tw-mb-4">
              <div 
                v-for="(img, index) in imagesForSelectedColor" 
                :key="img._id" 
                class="tw-relative tw-aspect-square tw-border-2 tw-rounded-lg tw-cursor-pointer tw-overflow-hidden tw-bg-white hover:tw-border-crimson-500 tw-transition-colors"
                :class="currentImageIndex === index ? 'tw-border-crimson-600' : 'tw-border-stone-300'"
                @click="selectImage(index)"
              >
                <img :src="img.imageUrl" :alt="img.name" class="tw-w-full tw-h-full tw-object-cover" />
                <button 
                  @click.stop="removeImage(img._id)"
                  class="tw-absolute tw-top-1 tw-right-1 tw-bg-red-500 tw-text-white tw-rounded-full tw-w-5 tw-h-5 tw-flex tw-items-center tw-justify-center tw-text-xs hover:tw-bg-red-600"
                >
                  ×
                </button>
              </div>
            </div>

            <!-- Add Image -->
            <div class="tw-space-y-2">
              <input 
                v-model="newImageUrl" 
                type="text" 
                placeholder="Dán URL hình ảnh..." 
                class="tw-border tw-border-stone-300 tw-rounded-lg tw-p-2 tw-w-full focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500"
                :disabled="!selectedColorId"
              />
              <button 
                @click="addImage" 
                class="tw-w-full tw-px-4 tw-py-2 tw-bg-stone-600 tw-text-white tw-rounded-lg hover:tw-bg-stone-700 tw-transition-colors disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
                :disabled="!selectedColorId"
              >
                + Thêm ảnh cho màu {{ selectedColor?.name || '' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Right Column - Product Info -->
        <div class="lg:tw-col-span-2 tw-space-y-6">
          
          <!-- Thông tin cơ bản -->
          <div class="tw-bg-white tw-rounded-lg tw-shadow-sm tw-p-6">
            <h2 class="tw-text-lg tw-font-semibold tw-mb-4 tw-text-stone-800">
              📝 Thông tin cơ bản
            </h2>
            <div class="tw-space-y-4">
              <div>
                <label class="tw-block tw-text-sm tw-font-medium tw-text-stone-700 tw-mb-1">Tên sản phẩm *</label>
                <input 
                  v-model="product.name" 
                  type="text" 
                  class="tw-border tw-border-stone-300 tw-rounded-lg tw-p-2 tw-w-full focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500"
                  placeholder="VD: iPhone 15 Pro Max 256GB"
                />
              </div>
              
              <div class="tw-grid tw-grid-cols-2 tw-gap-4">
                <div>
                  <label class="tw-block tw-text-sm tw-font-medium tw-text-stone-700 tw-mb-1">Danh mục *</label>
                  <select 
                    v-model="product.categoryId" 
                    class="tw-border tw-border-stone-300 tw-rounded-lg tw-p-2 tw-w-full focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500"
                  >
                    <option value="">-- Chọn danh mục --</option>
                    <option v-for="cat in categories" :key="cat._id" :value="cat._id">{{ cat.name }}</option>
                  </select>
                </div>
                
                <div>
                  <label class="tw-block tw-text-sm tw-font-medium tw-text-stone-700 tw-mb-1">Thương hiệu *</label>
                  <select 
                    v-model="product.brandId" 
                    class="tw-border tw-border-stone-300 tw-rounded-lg tw-p-2 tw-w-full focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500"
                  >
                    <option value="">-- Chọn thương hiệu --</option>
                    <option v-for="brand in brands" :key="brand._id" :value="brand._id">{{ brand.name }}</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="tw-block tw-text-sm tw-font-medium tw-text-stone-700 tw-mb-1">Mô tả</label>
                <textarea 
                  v-model="product.description" 
                  rows="3" 
                  class="tw-border tw-border-stone-300 tw-rounded-lg tw-p-2 tw-w-full focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500 tw-resize-none"
                  placeholder="Mô tả chi tiết về sản phẩm..."
                ></textarea>
              </div>

              <div class="tw-grid tw-grid-cols-2 tw-gap-4">
                <div>
                  <label class="tw-block tw-text-sm tw-font-medium tw-text-stone-700 tw-mb-1">Giá cơ bản (VNĐ)</label>
                  <input 
                    v-model.number="product.basePrice" 
                    type="number" 
                    class="tw-border tw-border-stone-300 tw-rounded-lg tw-p-2 tw-w-full focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500"
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label class="tw-block tw-text-sm tw-font-medium tw-text-stone-700 tw-mb-1">Giảm giá (%)</label>
                  <input 
                    v-model.number="product.discountPercentage" 
                    type="number" 
                    class="tw-border tw-border-stone-300 tw-rounded-lg tw-p-2 tw-w-full focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Variants Card -->
          <div class="tw-bg-white tw-rounded-lg tw-shadow-sm tw-p-6">
            <div class="tw-flex tw-justify-between tw-items-center tw-mb-4">
              <h2 class="tw-text-lg tw-font-semibold tw-text-stone-800">🎨 Phiên bản sản phẩm</h2>
            </div>

            <!-- Variant Table -->
            <div class="tw-overflow-x-auto tw-mb-4">
              <table class="tw-min-w-full tw-divide-y tw-divide-stone-200">
                <thead class="tw-bg-stone-50">
                  <tr>
                    <th class="tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-stone-700 tw-uppercase">Màu sắc</th>
                    <th class="tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-stone-700 tw-uppercase">Bộ nhớ</th>
                    <th class="tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-stone-700 tw-uppercase">Giá (VNĐ)</th>
                    <th class="tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-stone-700 tw-uppercase">Tồn kho</th>
                    <th class="tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-stone-700 tw-uppercase">Hành động</th>
                  </tr>
                </thead>
                <tbody class="tw-bg-white tw-divide-y tw-divide-stone-200">
                  <tr v-for="(variant, index) in productVariants" :key="variant._id || index">
                    <td class="tw-px-4 tw-py-3 tw-whitespace-nowrap">
                      <div class="tw-flex tw-items-center tw-gap-2">
                        <div 
                          class="tw-w-5 tw-h-5 tw-rounded-full tw-border tw-border-stone-300"
                          :style="{ backgroundColor: colors.find(c => c._id === variant.colorId)?.code || '#ccc' }"
                        ></div>
                        <span class="tw-text-sm">{{ colors.find(c => c._id === variant.colorId)?.name || 'N/A' }}</span>
                      </div>
                    </td>
                    <td class="tw-px-4 tw-py-3 tw-whitespace-nowrap tw-text-sm">
                      {{ memories.find(m => m._id === variant.memoryId)?.name || 'N/A' }}
                    </td>
                    <td class="tw-px-4 tw-py-3 tw-whitespace-nowrap">
                      <input 
                        v-model.number="variant.price" 
                        type="number" 
                        class="tw-border tw-border-stone-300 tw-rounded tw-px-2 tw-py-1 tw-w-32 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500"
                      />
                    </td>
                    <td class="tw-px-4 tw-py-3 tw-whitespace-nowrap">
                      <input 
                        v-model.number="variant.stock" 
                        type="number" 
                        class="tw-border tw-border-stone-300 tw-rounded tw-px-2 tw-py-1 tw-w-24 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500"
                      />
                    </td>
                    <td class="tw-px-4 tw-py-3 tw-whitespace-nowrap">
                      <button 
                        @click="removeVariant(index)"
                        class="tw-text-red-600 hover:tw-text-red-800 tw-font-medium"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Add Variant Form -->
            <div class="tw-border-t tw-pt-4 tw-space-y-3">
              <h3 class="tw-text-sm tw-font-medium tw-text-stone-700">Thêm phiên bản mới</h3>
              <div class="tw-grid tw-grid-cols-2 tw-gap-3">
                <div>
                  <label class="tw-block tw-text-xs tw-font-medium tw-text-stone-600 tw-mb-1">Màu sắc</label>
                  <select 
                    v-model="newVariant.colorId" 
                    class="tw-border tw-border-stone-300 tw-rounded-lg tw-p-2 tw-w-full focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500"
                  >
                    <option value="">-- Chọn màu --</option>
                    <option v-for="color in colors" :key="color._id" :value="color._id">{{ color.name }}</option>
                  </select>
                </div>
                <div>
                  <label class="tw-block tw-text-xs tw-font-medium tw-text-stone-600 tw-mb-1">Bộ nhớ</label>
                  <select 
                    v-model="newVariant.memoryId" 
                    class="tw-border tw-border-stone-300 tw-rounded-lg tw-p-2 tw-w-full focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500"
                  >
                    <option value="">-- Chọn bộ nhớ --</option>
                    <option v-for="memory in memories" :key="memory._id" :value="memory._id">{{ memory.name }}</option>
                  </select>
                </div>
              </div>
              <div class="tw-grid tw-grid-cols-2 tw-gap-3">
                <div>
                  <label class="tw-block tw-text-xs tw-font-medium tw-text-stone-600 tw-mb-1">Giá (VNĐ)</label>
                  <input 
                    v-model.number="newVariant.price" 
                    type="number" 
                    placeholder="25000000" 
                    class="tw-border tw-border-stone-300 tw-rounded-lg tw-p-2 tw-w-full focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500"
                  />
                </div>
                <div>
                  <label class="tw-block tw-text-xs tw-font-medium tw-text-stone-600 tw-mb-1">Số lượng</label>
                  <input 
                    v-model.number="newVariant.stock" 
                    type="number" 
                    placeholder="100" 
                    class="tw-border tw-border-stone-300 tw-rounded-lg tw-p-2 tw-w-full focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500"
                  />
                </div>
              </div>
              <button 
                @click="addVariant" 
                class="tw-w-full tw-px-4 tw-py-2 tw-bg-green-600 tw-text-white tw-rounded-lg hover:tw-bg-green-700 tw-transition-colors"
              >
                + Thêm phiên bản
              </button>
            </div>
          </div>

          <!-- Specifications Card -->
          <div class="tw-bg-white tw-rounded-lg tw-shadow-sm tw-p-6">
            <h2 class="tw-text-lg tw-font-semibold tw-mb-4 tw-text-stone-800">⚙️ Thông số kỹ thuật</h2>
            
            <div class="tw-space-y-3 tw-mb-4">
              <div v-for="(spec, index) in productSpecs" :key="spec._id || index" class="tw-flex tw-gap-3 tw-items-start">
                <div class="tw-flex-1">
                  <select 
                    v-model="spec.specsId" 
                    class="tw-border tw-border-stone-300 tw-rounded-lg tw-p-2 tw-w-full tw-mb-2 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500"
                  >
                    <option value="">-- Chọn thông số --</option>
                    <option v-for="availableSpec in specifications" :key="availableSpec._id" :value="availableSpec._id">
                      {{ availableSpec.specName }}
                    </option>
                  </select>
                  <input 
                    v-model="spec.specValue" 
                    type="text" 
                    placeholder="Giá trị thông số..."
                    class="tw-border tw-border-stone-300 tw-rounded-lg tw-p-2 tw-w-full focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500"
                  />
                </div>
                <button 
                  @click="removeSpec(index)"
                  class="tw-px-3 tw-py-2 tw-bg-red-500 tw-text-white tw-rounded-lg hover:tw-bg-red-600 tw-transition-colors tw-mt-0"
                >
                  Xóa
                </button>
              </div>
            </div>

            <button 
              @click="addSpec" 
              class="tw-w-full tw-px-4 tw-py-2 tw-bg-blue-600 tw-text-white tw-rounded-lg hover:tw-bg-blue-700 tw-transition-colors"
            >
              + Thêm thông số
            </button>
          </div>

        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-50" @click="showDeleteModal = false">
      <div class="tw-bg-white tw-rounded-lg tw-p-6 tw-max-w-md tw-w-full tw-mx-4" @click.stop>
        <h3 class="tw-text-xl tw-font-bold tw-mb-4 tw-text-crimson-600">⚠️ Xác nhận xóa sản phẩm</h3>
        <p class="tw-text-stone-600 tw-mb-6">Bạn có chắc chắn muốn xóa sản phẩm "{{ product.name }}"? Hành động này không thể hoàn tác.</p>
        <div class="tw-flex tw-gap-2 tw-justify-end">
          <button 
            @click="showDeleteModal = false" 
            class="tw-px-4 tw-py-2 tw-bg-stone-200 tw-text-stone-800 tw-rounded-lg hover:tw-bg-stone-300 tw-transition-colors"
          >
            Hủy
          </button>
          <button 
            @click="deleteProduct" 
            class="tw-px-4 tw-py-2 tw-bg-crimson-600 tw-text-white tw-rounded-lg hover:tw-bg-crimson-700 tw-transition-colors"
          >
            Xóa sản phẩm
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

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
  brand: null,
  category: null,
})

const selectedColorId = ref('')
const currentImageIndex = ref(0)
const newImageUrl = ref('')
const showDeleteModal = ref(false)

// Options & Related Data
const categories = ref([])
const brands = ref([])
const colors = ref([])
const memories = ref([])
const specifications = ref([])

// Product Related Data
const productVariants = ref([]) // Các biến thể (color + memory + price + stock)
const productImages = ref([]) // Hình ảnh theo màu
const productSpecs = ref([]) // Thông số kỹ thuật

// Computed
const selectedColor = computed(() => {
  return colors.value.find(c => c._id === selectedColorId.value)
})

const imagesForSelectedColor = computed(() => {
  if (!selectedColorId.value) return []
  return productImages.value.filter(img => img.colorId === selectedColorId.value)
})

const currentImage = computed(() => {
  const images = imagesForSelectedColor.value
  if (!images || images.length === 0) return product.value.thumbUrl
  return images[currentImageIndex.value]?.imageUrl || product.value.thumbUrl
})

const variantsForSelectedColor = computed(() => {
  if (!selectedColorId.value) return []
  return productVariants.value.filter(v => v.colorId === selectedColorId.value)
})

// New variant form
const newVariant = ref({
  colorId: '',
  memoryId: '',
  price: 0,
  stock: 0
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
    const res = await axios.get('http://localhost:3000/api/categories')
    categories.value = res.data?.items || res.data || []
  } catch (error) {
    console.error('Error loading categories:', error)
    // Fallback: use mock data
    categories.value = [
      { _id: '1', name: 'Điện thoại' },
      { _id: '2', name: 'Laptop' },
      { _id: '3', name: 'Tablet' }
    ]
  }
}

async function loadBrands() {
  try {
    const res = await axios.get('http://localhost:3000/api/brands')
    brands.value = res.data?.items || res.data || []
  } catch (error) {
    console.error('Error loading brands:', error)
    // Fallback: use mock data
    brands.value = [
      { _id: '1', name: 'Apple' },
      { _id: '2', name: 'Samsung' },
      { _id: '3', name: 'Xiaomi' }
    ]
  }
}

async function loadColors() {
  try {
    const res = await axios.get('http://localhost:3000/api/colors')
    colors.value = res.data?.items || res.data || []
  } catch (error) {
    console.error('Error loading colors:', error)
    // Fallback: use mock data
    colors.value = [
      { _id: '1', name: 'Đen', code: '#000000' },
      { _id: '2', name: 'Trắng', code: '#FFFFFF' },
      { _id: '3', name: 'Xanh Dương', code: '#0000FF' },
      { _id: '4', name: 'Đỏ', code: '#FF0000' }
    ]
  }
}

async function loadMemories() {
  try {
    const res = await axios.get('http://localhost:3000/api/memories')
    memories.value = res.data?.items || res.data || []
  } catch (error) {
    console.error('Error loading memories:', error)
    // Fallback: use mock data
    memories.value = [
      { _id: '1', name: '128GB' },
      { _id: '2', name: '256GB' },
      { _id: '3', name: '512GB' },
      { _id: '4', name: '1TB' }
    ]
  }
}

async function loadSpecifications() {
  try {
    const res = await axios.get('http://localhost:3000/api/specifications')
    specifications.value = res.data?.items || res.data || []
  } catch (error) {
    console.error('Error loading specifications:', error)
    // Fallback: use mock data
    specifications.value = [
      { _id: '1', name: 'Màn hình' },
      { _id: '2', name: 'CPU' },
      { _id: '3', name: 'RAM' },
      { _id: '4', name: 'Pin' },
      { _id: '5', name: 'Camera' }
    ]
  }
}

async function loadProduct() {
  try {
    // Load product basic info
    const productRes = await axios.get(`http://localhost:3000/api/products/${productId}`)
    const productData = productRes.data?.data || productRes.data
    
    // Ensure product has required fields
    product.value = {
      name: productData.name || '',
      description: productData.description || '',
      basePrice: productData.basePrice || productData.price || 0,
      discountPercentage: productData.discountPercentage || 0,
      thumbUrl: productData.thumbUrl || productData.image || '',
      slug: productData.slug || '',
      brandId: productData.brandId || productData.brand?._id || null,
      categoryId: productData.categoryId || productData.category?._id || null,
    }

    // Try to load product variants (may not exist yet)
    try {
      const variantsRes = await axios.get(`http://localhost:3000/api/products/${productId}/variants`)
      productVariants.value = variantsRes.data?.items || variantsRes.data || []
    } catch (err) {
      console.log('No variants endpoint, using empty array')
      productVariants.value = []
    }

    // Try to load product images (may not exist yet)
    try {
      const imagesRes = await axios.get(`http://localhost:3000/api/products/${productId}/images`)
      productImages.value = imagesRes.data?.items || imagesRes.data || []
    } catch (err) {
      console.log('No images endpoint, using empty array')
      productImages.value = []
    }

    // Try to load product specifications (may not exist yet)
    try {
      const specsRes = await axios.get(`http://localhost:3000/api/products/${productId}/specifications`)
      productSpecs.value = specsRes.data?.items || specsRes.data || []
    } catch (err) {
      console.log('No specs endpoint, using empty array')
      productSpecs.value = []
    }

    // Set default selected color (first available)
    if (productVariants.value.length > 0) {
      selectedColorId.value = productVariants.value[0].colorId
    } else if (colors.value.length > 0) {
      selectedColorId.value = colors.value[0]._id
    }
  } catch (error) {
    console.error('Error loading product:', error)
    alert('Không thể tải thông tin sản phẩm. Vui lòng kiểm tra ID sản phẩm.')
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

async function addImage() {
  if (!newImageUrl.value.trim() || !selectedColorId.value) {
    alert('Vui lòng chọn màu và nhập URL hình ảnh')
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
    
    const res = await axios.post(`http://localhost:3000/api/products/${productId}/images`, newImage)
    productImages.value.push(res.data?.data || res.data)
    newImageUrl.value = ''
  } catch (error) {
    console.error('Error adding image:', error)
    alert('Lỗi khi thêm ảnh')
  }
}

async function removeImage(imageId) {
  if (!confirm('Bạn có chắc muốn xóa ảnh này?')) return
  
  try {
    await axios.delete(`http://localhost:3000/api/products/${productId}/images/${imageId}`)
    productImages.value = productImages.value.filter(img => img._id !== imageId)
  } catch (error) {
    console.error('Error removing image:', error)
    alert('Lỗi khi xóa ảnh')
  }
}

// Variants management
function addVariant() {
  if (!newVariant.value.colorId || !newVariant.value.memoryId) {
    alert('Vui lòng chọn đầy đủ màu sắc và bộ nhớ')
    return
  }
  
  if (!newVariant.value.price || newVariant.value.price <= 0) {
    alert('Vui lòng nhập giá hợp lệ')
    return
  }
  
  productVariants.value.push({
    productId: productId,
    colorId: newVariant.value.colorId,
    memoryId: newVariant.value.memoryId,
    price: newVariant.value.price,
    stock: newVariant.value.stock || 0,
    isNew: true
  })
  
  // Reset form
  newVariant.value = {
    colorId: '',
    memoryId: '',
    price: 0,
    stock: 0
  }
}

async function removeVariant(index) {
  const variant = productVariants.value[index]
  
  if (variant.isNew) {
    productVariants.value.splice(index, 1)
    return
  }
  
  if (!confirm('Bạn có chắc muốn xóa biến thể này?')) return
  
  try {
    await axios.delete(`http://localhost:3000/api/products/${productId}/variants/${variant._id}`)
    productVariants.value.splice(index, 1)
  } catch (error) {
    console.error('Error removing variant:', error)
    alert('Lỗi khi xóa biến thể')
  }
}

// Specifications
function addSpec() {
  productSpecs.value.push({
    productId: productId,
    specsId: '',
    specValue: '',
    isNew: true
  })
}

async function removeSpec(index) {
  const spec = productSpecs.value[index]
  
  if (spec.isNew) {
    productSpecs.value.splice(index, 1)
    return
  }
  
  if (!confirm('Bạn có chắc muốn xóa thông số này?')) return
  
  try {
    await axios.delete(`http://localhost:3000/api/products/${productId}/specifications/${spec._id}`)
    productSpecs.value.splice(index, 1)
  } catch (error) {
    console.error('Error removing spec:', error)
    alert('Lỗi khi xóa thông số')
  }
}

// Actions
async function saveProduct() {
  try {
    // Update basic product info
    await axios.put(`http://localhost:3000/api/products/${productId}`, product.value)
    
    // Update/Create variants
    for (const variant of productVariants.value) {
      if (variant.isNew) {
        delete variant.isNew
        await axios.post(`http://localhost:3000/api/products/${productId}/variants`, variant)
      } else {
        await axios.put(`http://localhost:3000/api/products/${productId}/variants/${variant._id}`, variant)
      }
    }
    
    // Update/Create specifications
    for (const spec of productSpecs.value) {
      if (spec.isNew) {
        delete spec.isNew
        await axios.post(`http://localhost:3000/api/products/${productId}/specifications`, spec)
      } else {
        await axios.put(`http://localhost:3000/api/products/${productId}/specifications/${spec._id}`, spec)
      }
    }
    
    alert('✅ Cập nhật sản phẩm thành công!')
    await loadProduct() // Reload to get updated data
  } catch (error) {
    console.error('Error saving product:', error)
    alert('❌ Lỗi khi cập nhật sản phẩm')
  }
}

async function deleteProduct() {
  try {
    await axios.delete(`http://localhost:3000/api/products/${productId}`)
    alert('✅ Xóa sản phẩm thành công!')
    router.push('/admin/products')
  } catch (error) {
    console.error('Error deleting product:', error)
    alert('❌ Lỗi khi xóa sản phẩm')
  }
  showDeleteModal.value = false
}

function goBack() {
  router.push('/admin/products')
}

function getMemoryName(memoryId) {
  const memory = memories.value.find(m => m._id === memoryId)
  return memory ? `${memory.ram} / ${memory.rom}` : ''
}

function getSpecName(specId) {
  const spec = specifications.value.find(s => s._id === specId)
  return spec?.specName || ''
}
</script>

<route lang="yaml">
meta:
  layout: admin
</route>
