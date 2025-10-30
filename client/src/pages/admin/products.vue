<template>
  <div class="tw-p-6 tw-bg-white tw-min-h-screen">
    <h1 class="tw-text-2xl tw-font-bold tw-text-crimson-600 tw-mb-4">
      Quản lý danh mục sản phẩm
    </h1>

    <div class="tw-flex tw-gap-2 tw-mb-4">
      <button v-for="tab in tabs" :key="tab" class="tw-px-4 tw-py-2 tw-rounded-lg tw-font-semibold tw-transition-colors"
        :class="activeTab === tab ? 'tw-bg-crimson-600 tw-text-white' : 'tw-bg-stone-100 tw-text-stone-700 hover:tw-bg-stone-200'" @click="activeTab = tab">
        {{ tab }}
      </button>
    </div>

    <div v-if="activeTab === 'Sản phẩm'">
      <div class="tw-flex tw-flex-wrap tw-gap-6 tw-mb-4 tw-items-start">
        <input type="text" v-model="search" placeholder="Tìm kiếm sản phẩm..." class="tw-border tw-border-stone-300 tw-p-2 tw-rounded-lg tw-w-64 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500 focus:tw-border-transparent" />

        <div class="tw-relative">
          <button @click="toggleDropdown('category')"
            class="tw-flex tw-items-center tw-gap-2 tw-border tw-border-stone-300 tw-px-4 tw-py-2 tw-rounded-lg hover:tw-bg-stone-50 tw-transition-colors tw-bg-white">
            Danh mục
            <span :class="openDropdown === 'category' ? 'tw-rotate-180' : ''" class="tw-transition-transform">▼</span>
          </button>

          <div v-if="openDropdown === 'category'"
            class="tw-absolute tw-mt-2 tw-bg-white tw-shadow-lg tw-border tw-border-stone-200 tw-rounded-lg tw-p-4 tw-z-10 tw-w-64">
            <div class="tw-flex tw-flex-wrap tw-gap-2 tw-mb-4">
              <button v-for="c in categories" :key="c" @click="toggleCategory(c)"
                class="tw-px-4 tw-py-2 tw-rounded-full tw-border tw-transition-colors" :class="tempCategories.includes(c)
                  ? 'tw-bg-crimson-600 tw-text-white tw-border-crimson-600'
                  : 'tw-bg-white tw-text-stone-700 tw-border-stone-300 hover:tw-bg-stone-50'">
                {{ c }}
              </button>
            </div>
            <div class="tw-flex tw-justify-between">
              <button @click="closeDropdown" class="tw-px-4 tw-py-2 tw-bg-stone-200 tw-text-stone-700 tw-rounded-lg hover:tw-bg-stone-300 tw-transition-colors tw-border tw-border-stone-300">Đóng</button>
              <button @click="applyFilters" class="tw-px-4 tw-py-2 tw-bg-crimson-600 tw-text-white tw-rounded-lg hover:tw-bg-crimson-700 tw-transition-colors">Xem kết quả</button>
            </div>
          </div>
        </div>

        <div class="tw-relative">
          <button @click="toggleDropdown('status')"
            class="tw-flex tw-items-center tw-gap-2 tw-border tw-border-stone-300 tw-px-4 tw-py-2 tw-rounded-lg hover:tw-bg-stone-50 tw-transition-colors tw-bg-white">
            Trạng thái
            <span :class="openDropdown === 'status' ? 'tw-rotate-180' : ''" class="tw-transition-transform">▼</span>
          </button>

          <div v-if="openDropdown === 'status'" class="tw-absolute tw-mt-2 tw-bg-white tw-shadow-lg tw-border tw-border-stone-200 tw-rounded-lg tw-p-4 tw-z-10 tw-w-64">
            <div class="tw-flex tw-flex-wrap tw-gap-2 tw-mb-4">
              <button v-for="status in statuses" :key="status" @click="toggleStatus(status)"
                class="tw-px-4 tw-py-2 tw-rounded-full tw-border tw-transition-colors" :class="tempStatuses.includes(status)
                  ? 'tw-bg-crimson-600 tw-text-white tw-border-crimson-600'
                  : 'tw-bg-white tw-text-stone-700 tw-border-stone-300 hover:tw-bg-stone-50'">
                {{ status }}
              </button>
            </div>
            <div class="tw-flex tw-justify-between">
              <button @click="closeDropdown" class="tw-px-4 tw-py-2 tw-bg-stone-200 tw-text-stone-700 tw-rounded-lg hover:tw-bg-stone-300 tw-transition-colors tw-border tw-border-stone-300">Đóng</button>
              <button @click="applyFilters" class="tw-px-4 tw-py-2 tw-bg-crimson-600 tw-text-white tw-rounded-lg hover:tw-bg-crimson-700 tw-transition-colors">Xem kết quả</button>
            </div>
          </div>
        </div>

        <div class="tw-relative">
          <button @click="toggleDropdown('brand')"
            class="tw-flex tw-items-center tw-gap-2 tw-border tw-border-stone-300 tw-px-4 tw-py-2 tw-rounded-lg hover:tw-bg-stone-50 tw-transition-colors tw-bg-white">
            Thương hiệu
            <span :class="openDropdown === 'brand' ? 'tw-rotate-180' : ''" class="tw-transition-transform">▼</span>
          </button>

          <div v-if="openDropdown === 'brand'" class="tw-absolute tw-mt-2 tw-bg-white tw-shadow-lg tw-border tw-border-stone-200 tw-rounded-lg tw-p-4 tw-z-10 tw-w-64">
            <div class="tw-flex tw-flex-wrap tw-gap-2 tw-mb-4">
              <button v-for="b in brands" :key="b" @click="toggleBrand(b)"
                class="tw-px-4 tw-py-2 tw-rounded-full tw-border tw-transition-colors" :class="tempBrands.includes(b)
                  ? 'tw-bg-crimson-600 tw-text-white tw-border-crimson-600'
                  : 'tw-bg-white tw-text-stone-700 tw-border-stone-300 hover:tw-bg-stone-50'">
                {{ b }}
              </button>
            </div>
            <div class="tw-flex tw-justify-between">
              <button @click="closeDropdown" class="tw-px-4 tw-py-2 tw-bg-stone-200 tw-text-stone-700 tw-rounded-lg hover:tw-bg-stone-300 tw-transition-colors tw-border tw-border-stone-300">Đóng</button>
              <button @click="applyFilters" class="tw-px-4 tw-py-2 tw-bg-crimson-600 tw-text-white tw-rounded-lg hover:tw-bg-crimson-700 tw-transition-colors">Xem kết quả</button>
            </div>
          </div>
        </div>

        <div class="tw-relative">
          <button @click="toggleDropdown('sort')"
            class="tw-flex tw-items-center tw-gap-2 tw-border tw-border-stone-300 tw-px-4 tw-py-2 tw-rounded-lg hover:tw-bg-stone-50 tw-transition-colors tw-bg-white">
            <span v-if="!selectedSort">Giá</span>
            <span v-else class="tw-text-crimson-600 tw-font-medium">
              {{ sortOptions.find(opt => opt.value === selectedSort)?.label }}
            </span>
            <span :class="openDropdown === 'sort' ? 'tw-rotate-180' : ''" class="tw-transition-transform">▼</span>
          </button>

          <div v-if="openDropdown === 'sort'" class="tw-absolute tw-mt-2 tw-bg-white tw-shadow-lg tw-border tw-border-stone-200 tw-rounded-lg tw-p-4 tw-z-10 tw-w-64">
            <div class="tw-flex tw-flex-col tw-gap-2 tw-mb-4">
              <button 
                @click="selectedSort = ''; closeDropdown()"
                class="tw-px-4 tw-py-2 tw-rounded-lg tw-border tw-transition-colors tw-text-left"
                :class="!selectedSort
                  ? 'tw-bg-crimson-600 tw-text-white tw-border-crimson-600'
                  : 'tw-bg-white tw-text-stone-700 tw-border-stone-300 hover:tw-bg-stone-50'">
                Mặc định
              </button>
              <button 
                v-for="option in sortOptions" 
                :key="option.value" 
                @click="selectedSort = option.value; closeDropdown()"
                class="tw-px-4 tw-py-2 tw-rounded-lg tw-border tw-transition-colors tw-text-left"
                :class="selectedSort === option.value
                  ? 'tw-bg-crimson-600 tw-text-white tw-border-crimson-600'
                  : 'tw-bg-white tw-text-stone-700 tw-border-stone-300 hover:tw-bg-stone-50'">
                {{ option.label }}
              </button>
            </div>
          </div>
        </div>

        <div class="tw-flex tw-gap-2 tw-self-end">
          <button @click="showAddProductModal = true" class="tw-px-4 tw-py-2 tw-bg-crimson-600 tw-text-white tw-rounded-lg hover:tw-bg-crimson-700 tw-transition-colors tw-font-medium">
            + Thêm sản phẩm
          </button>
          <button @click="deleteSelected" class="tw-px-4 tw-py-2 tw-bg-crimson-600 tw-text-white tw-rounded-lg hover:tw-bg-crimson-700 tw-transition-colors tw-font-medium">
            - Xóa sản phẩm
          </button>
        </div>
      </div>

      <div class="tw-overflow-x-auto">
        <table class="tw-min-w-full tw-border">
          <thead class="tw-bg-crimson-600 tw-text-white">
            <tr>
              <th class="tw-p-2"><input type="checkbox" @change="toggleAll($event)" /></th>
              <th class="tw-p-2">Tên sản phẩm</th>
              <th class="tw-p-2">Thương hiệu</th>
              <th class="tw-p-2">Danh mục</th>
              <th class="tw-p-2">Giá bán</th>
              <th class="tw-p-2">Trạng thái</th>
              <th class="tw-p-2">Tồn kho</th>
              <th class="tw-p-2">Ngày tạo</th>
              <th class="tw-p-2">Cập nhật lần cuối</th>
              <th class="tw-p-2">Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in paginatedProducts" :key="product._id" class="tw-border-b hover:tw-bg-stone-50 tw-transition-colors">
              <td class="tw-p-2 tw-text-center">
                <input type="checkbox" v-model="selected" :value="product._id" />
              </td>
              <td class="tw-p-2">{{ product.name }}</td>
              <td class="tw-p-2">{{ product.brand }}</td>
              <td class="tw-p-2">{{ product.category }}</td>
              <td class="tw-p-2">{{ formatCurrency(product.price) }}</td>
              <td class="tw-p-2">
                <span :class="product.status === 'Còn hàng' ? 'tw-text-emerald-600' : 'tw-text-stone-500'">
                  {{ product.status }}
                </span>
              </td>
              <td class="tw-p-2">{{ product.stock }}</td>
              <td class="tw-p-2">{{ product.created_at }}</td>
              <td class="tw-p-2">{{ product.updated_at }}</td>
              <td class="tw-p-2">
                <button class="tw-text-crimson-600 tw-underline hover:tw-text-crimson-800 tw-transition-colors" @click="goToDetail(product._id)">
                  Chi tiết
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="tw-flex tw-justify-between tw-items-center tw-mt-4">
        <div>Hàng trên mỗi trang:
          <select v-model="perPage" class="tw-border tw-border-stone-300 tw-p-1 tw-rounded-lg tw-ml-2 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500 focus:tw-border-transparent">
            <option v-for="n in [5, 10, 20]" :key="n" :value="n">{{ n }}</option>
          </select>
        </div>
        <div class="tw-flex tw-gap-2">
          <button @click="prevPage" :disabled="page === 1"
            class="tw-px-2 tw-py-1 tw-border tw-border-stone-300 tw-rounded-md hover:tw-bg-stone-50 tw-transition-colors disabled:tw-opacity-50 disabled:tw-cursor-not-allowed">&lt;</button>
          <span>Trang {{ page }}</span>
          <button @click="nextPage" :disabled="page >= totalPages"
            class="tw-px-2 tw-py-1 tw-border tw-border-stone-300 tw-rounded-md hover:tw-bg-stone-50 tw-transition-colors disabled:tw-opacity-50 disabled:tw-cursor-not-allowed">&gt;</button>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'Danh mục'">
      <div class="tw-flex tw-flex-wrap tw-gap-6 tw-mb-4 tw-items-start">
        <input type="text" v-model="categorySearch" placeholder="Tìm kiếm danh mục..." class="tw-border tw-border-stone-300 tw-p-2 tw-rounded-lg tw-w-64 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500 focus:tw-border-transparent" />

        <div class="tw-flex tw-gap-2 tw-self-end">
          <button @click="showAddCategoryModal = true" class="tw-px-4 tw-py-2 tw-bg-crimson-600 tw-text-white tw-rounded-lg hover:tw-bg-crimson-700 tw-transition-colors tw-font-medium">
            + Thêm danh mục
          </button>
          <button @click="deleteSelectedCategories" class="tw-px-4 tw-py-2 tw-bg-crimson-600 tw-text-white tw-rounded-lg hover:tw-bg-crimson-700 tw-transition-colors tw-font-medium">
            - Xóa danh mục
          </button>
        </div>
      </div>

      <div class="tw-overflow-x-auto">
        <table class="tw-min-w-full tw-border">
          <thead class="tw-bg-crimson-600 tw-text-white">
            <tr>
              <th class="tw-p-2"><input type="checkbox" @change="toggleAllCategories($event)" /></th>
              <th class="tw-p-2">Tên danh mục</th>
              <th class="tw-p-2">Mã danh mục</th>
              <th class="tw-p-2">Ngày tạo</th>
              <th class="tw-p-2">Cập nhật lần cuối</th>
              <th class="tw-p-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="category in paginatedCategories" :key="category._id" class="tw-border-b hover:tw-bg-stone-50 tw-transition-colors">
              <td class="tw-p-2 tw-text-center">
                <input type="checkbox" v-model="selectedCategoryIds" :value="category._id" />
              </td>
              <td class="tw-p-2">{{ category.name }}</td>
              <td class="tw-p-2">{{ category.nameAscii }}</td>
              <td class="tw-p-2">{{ formatDate(category.createdAt) }}</td>
              <td class="tw-p-2">{{ formatDate(category.updatedAt) }}</td>
              <td class="tw-p-2">
                  <button @click="editCategory(category)" class=" tw-text-sky-600 hover:tw-text-sky-800 tw-transition-colors">Chỉnh sửa</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="tw-flex tw-justify-between tw-items-center tw-mt-4">
        <div>Hàng trên mỗi trang:
          <select v-model="perPage" class="tw-border tw-border-stone-300 tw-p-1 tw-rounded-lg tw-ml-2 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500 focus:tw-border-transparent">
            <option v-for="n in [5, 10, 20]" :key="n" :value="n">{{ n }}</option>
          </select>
        </div>
        <div class="tw-flex tw-gap-2">
          <button @click="prevPage" :disabled="page === 1"
            class="tw-px-2 tw-py-1 tw-border tw-border-stone-300 tw-rounded-md hover:tw-bg-stone-50 tw-transition-colors disabled:tw-opacity-50 disabled:tw-cursor-not-allowed">&lt;</button>
          <span>Trang {{ page }}</span>
          <button @click="nextPage" :disabled="page >= totalPages"
            class="tw-px-2 tw-py-1 tw-border tw-border-stone-300 tw-rounded-md hover:tw-bg-stone-50 tw-transition-colors disabled:tw-opacity-50 disabled:tw-cursor-not-allowed">&gt;</button>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'Thương hiệu'">
      <div class="tw-flex tw-flex-wrap tw-gap-6 tw-mb-4 tw-items-start">
        <input type="text" v-model="brandSearch" placeholder="Tìm kiếm thương hiệu..." class="tw-border tw-border-stone-300 tw-p-2 tw-rounded-lg tw-w-64 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500 focus:tw-border-transparent" />

        <div class="tw-flex tw-gap-2 tw-self-end">
          <button @click="showAddBrandModal = true" class="tw-px-4 tw-py-2 tw-bg-crimson-600 tw-text-white tw-rounded-lg hover:tw-bg-crimson-700 tw-transition-colors tw-font-medium">
            + Thêm thương hiệu
          </button>
          <button @click="deleteSelectedBrands" class="tw-px-4 tw-py-2 tw-bg-crimson-600 tw-text-white tw-rounded-lg hover:tw-bg-crimson-700 tw-transition-colors tw-font-medium">
            - Xóa thương hiệu
          </button>
        </div>
      </div>

      <div class="tw-overflow-x-auto">
        <table class="tw-min-w-full tw-border">
          <thead class="tw-bg-crimson-600 tw-text-white">
            <tr>
              <th class="tw-p-2"><input type="checkbox" @change="toggleAllBrands($event)" /></th>
              <th class="tw-p-2">Tên thương hiệu</th>
              <th class="tw-p-2">Ngày tạo</th>
              <th class="tw-p-2">Cập nhật lần cuối</th>
              <th class="tw-p-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="brand in paginatedBrands" :key="brand._id" class="tw-border-b hover:tw-bg-stone-50 tw-transition-colors">
              <td class="tw-p-2 tw-text-center">
                <input type="checkbox" v-model="selectedBrandIds" :value="brand._id" />
              </td>
              <td class="tw-p-2">{{ brand.name }}</td>
              <td class="tw-p-2">{{ formatDate(brand.createdAt) }}</td>
              <td class="tw-p-2">{{ formatDate(brand.updatedAt) }}</td>
              <td class="tw-p-2">
                <button @click="editBrand(brand)" class="tw-text-sky-600 hover:tw-text-sky-800 tw-transition-colors">Chỉnh sửa</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="tw-flex tw-justify-between tw-items-center tw-mt-4">
        <div>Hàng trên mỗi trang:
          <select v-model="perPage" class="tw-border tw-border-stone-300 tw-p-1 tw-rounded-lg tw-ml-2 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500 focus:tw-border-transparent">
            <option v-for="n in [5, 10, 20]" :key="n" :value="n">{{ n }}</option>
          </select>
        </div>
        <div class="tw-flex tw-gap-2">
          <button @click="prevPage" :disabled="page === 1"
            class="tw-px-2 tw-py-1 tw-border tw-border-stone-300 tw-rounded-md hover:tw-bg-stone-50 tw-transition-colors disabled:tw-opacity-50 disabled:tw-cursor-not-allowed">&lt;</button>
          <span>Trang {{ page }}</span>
          <button @click="nextPage" :disabled="page >= totalPages"
            class="tw-px-2 tw-py-1 tw-border tw-border-stone-300 tw-rounded-md hover:tw-bg-stone-50 tw-transition-colors disabled:tw-opacity-50 disabled:tw-cursor-not-allowed">&gt;</button>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'Màu sắc'">
      <div class="tw-flex tw-flex-wrap tw-gap-6 tw-mb-4 tw-items-start">
        <input type="text" v-model="colorSearch" placeholder="Tìm kiếm màu sắc..." class="tw-border tw-border-stone-300 tw-p-2 tw-rounded-lg tw-w-64 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500 focus:tw-border-transparent" />

        <div class="tw-flex tw-gap-2 tw-self-end">
          <button @click="showAddColorModal = true" class="tw-px-4 tw-py-2 tw-bg-crimson-600 tw-text-white tw-rounded-lg hover:tw-bg-crimson-700 tw-transition-colors tw-font-medium">
            + Thêm màu sắc
          </button>
          <button @click="deleteSelectedColors" class="tw-px-4 tw-py-2 tw-bg-crimson-600 tw-text-white tw-rounded-lg hover:tw-bg-crimson-700 tw-transition-colors tw-font-medium">
            - Xóa màu sắc
          </button>
        </div>
      </div>

      <div class="tw-overflow-x-auto">
        <table class="tw-min-w-full tw-border">
          <thead class="tw-bg-crimson-600 tw-text-white">
            <tr>
              <th class="tw-p-2"><input type="checkbox" @change="toggleAllColors($event)" /></th>
              <th class="tw-p-2">Tên màu</th>
              <th class="tw-p-2">Mã màu</th>
              <th class="tw-p-2">Ngày tạo</th>
              <th class="tw-p-2">Cập nhật lần cuối</th>
              <th class="tw-p-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="color in paginatedColors" :key="color._id" class="tw-border-b hover:tw-bg-stone-50 tw-transition-colors">
              <td class="tw-p-2 tw-text-center">
                <input type="checkbox" v-model="selectedColorIds" :value="color._id" />
              </td>
              <td class="tw-p-2">
                <div class="tw-flex tw-items-center tw-gap-2">
                  <div 
                    class="tw-w-6 tw-h-6 tw-rounded tw-border tw-border-stone-300"
                    :style="{ backgroundColor: color.code }"
                  ></div>
                  {{ color.name }}
                </div>
              </td>
              <td class="tw-p-2">
                <span class="tw-font-mono tw-text-sm">{{ color.code }}</span>
              </td>
              <td class="tw-p-2">{{ formatDate(color.createdAt) }}</td>
              <td class="tw-p-2">{{ formatDate(color.updatedAt) }}</td>
              <td class="tw-p-2">
                <button @click="editColor(color)" class="tw-text-sky-600 hover:tw-text-sky-800 tw-transition-colors">Chỉnh sửa</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      
      <div class="tw-flex tw-justify-between tw-items-center tw-mt-4">
        <div>Hàng trên mỗi trang:
          <select v-model="perPage" class="tw-border tw-border-stone-300 tw-p-1 tw-rounded-lg tw-ml-2 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500 focus:tw-border-transparent">
            <option v-for="n in [5, 10, 20]" :key="n" :value="n">{{ n }}</option>
          </select>
        </div>
        <div class="tw-flex tw-gap-2">
          <button @click="prevPage" :disabled="page === 1"
            class="tw-px-2 tw-py-1 tw-border tw-border-stone-300 tw-rounded-md hover:tw-bg-stone-50 tw-transition-colors disabled:tw-opacity-50 disabled:tw-cursor-not-allowed">&lt;</button>
          <span>Trang {{ page }}</span>
          <button @click="nextPage" :disabled="page >= totalPages"
            class="tw-px-2 tw-py-1 tw-border tw-border-stone-300 tw-rounded-md hover:tw-bg-stone-50 tw-transition-colors disabled:tw-opacity-50 disabled:tw-cursor-not-allowed">&gt;</button>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'Bộ nhớ'">
      <div class="tw-flex tw-flex-wrap tw-gap-6 tw-mb-4 tw-items-start">
        <input type="text" v-model="memorySearch" placeholder="Tìm kiếm bộ nhớ..." class="tw-border tw-border-stone-300 tw-p-2 tw-rounded-lg tw-w-64 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500 focus:tw-border-transparent" />

        <div class="tw-flex tw-gap-2 tw-self-end">
          <button @click="showAddMemoryModal = true" class="tw-px-4 tw-py-2 tw-bg-crimson-600 tw-text-white tw-rounded-lg hover:tw-bg-crimson-700 tw-transition-colors tw-font-medium">
            + Thêm bộ nhớ
          </button>
          <button @click="deleteSelectedMemories" class="tw-px-4 tw-py-2 tw-bg-crimson-600 tw-text-white tw-rounded-lg hover:tw-bg-crimson-700 tw-transition-colors tw-font-medium">
            - Xóa bộ nhớ
          </button>
        </div>
      </div>

      <div class="tw-overflow-x-auto">
        <table class="tw-min-w-full tw-border">
          <thead class="tw-bg-crimson-600 tw-text-white">
            <tr>
              <th class="tw-p-2"><input type="checkbox" @change="toggleAllMemories($event)" /></th>
              <th class="tw-p-2">RAM</th>
              <th class="tw-p-2">ROM</th>
              <th class="tw-p-2">Ngày tạo</th>
              <th class="tw-p-2">Cập nhật lần cuối</th>
              <th class="tw-p-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="memory in paginatedMemories" :key="memory._id" class="tw-border-b hover:tw-bg-stone-50 tw-transition-colors">
              <td class="tw-p-2 tw-text-center">
                <input type="checkbox" v-model="selectedMemoryIds" :value="memory._id" />
              </td>
              <td class="tw-p-2">{{ memory.ram || 'N/A' }}</td>
              <td class="tw-p-2">{{ memory.rom || 'N/A' }}</td>
              <td class="tw-p-2">{{ formatDate(memory.createdAt) }}</td>
              <td class="tw-p-2">{{ formatDate(memory.updatedAt) }}</td>
              <td class="tw-p-2">
                <button @click="editMemory(memory)" class="tw-text-sky-600 hover:tw-text-sky-800 tw-transition-colors">Chỉnh sửa</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      
      <div class="tw-flex tw-justify-between tw-items-center tw-mt-4">
        <div>Hàng trên mỗi trang:
          <select v-model="perPage" class="tw-border tw-border-stone-300 tw-p-1 tw-rounded-lg tw-ml-2 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500 focus:tw-border-transparent">
            <option v-for="n in [5, 10, 20]" :key="n" :value="n">{{ n }}</option>
          </select>
        </div>
        <div class="tw-flex tw-gap-2">
          <button @click="prevPage" :disabled="page === 1"
            class="tw-px-2 tw-py-1 tw-border tw-border-stone-300 tw-rounded-md hover:tw-bg-stone-50 tw-transition-colors disabled:tw-opacity-50 disabled:tw-cursor-not-allowed">&lt;</button>
          <span>Trang {{ page }}</span>
          <button @click="nextPage" :disabled="page >= totalPages"
            class="tw-px-2 tw-py-1 tw-border tw-border-stone-300 tw-rounded-md hover:tw-bg-stone-50 tw-transition-colors disabled:tw-opacity-50 disabled:tw-cursor-not-allowed">&gt;</button>
        </div>
      </div>
    </div>

    <!-- Tab Thuộc tính kỹ thuật -->
    <div v-if="activeTab === 'Thuộc tính kỹ thuật'">
      <div class="tw-flex tw-flex-wrap tw-gap-6 tw-mb-4 tw-items-start">
        <input type="text" v-model="specificationSearch" placeholder="Tìm kiếm thuộc tính..." class="tw-border tw-border-stone-300 tw-p-2 tw-rounded-lg tw-w-64 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500 focus:tw-border-transparent" />

        <div class="tw-flex tw-gap-2 tw-self-end">
          <button @click="showAddSpecificationModal = true" class="tw-px-4 tw-py-2 tw-bg-crimson-600 tw-text-white tw-rounded-lg hover:tw-bg-crimson-700 tw-transition-colors tw-font-medium">
            + Thêm thuộc tính
          </button>
          <button @click="deleteSelectedSpecifications" class="tw-px-4 tw-py-2 tw-bg-crimson-600 tw-text-white tw-rounded-lg hover:tw-bg-crimson-700 tw-transition-colors tw-font-medium">
            - Xóa thuộc tính
          </button>
        </div>
      </div>

      <div class="tw-overflow-x-auto">
        <table class="tw-min-w-full tw-border">
          <thead class="tw-bg-crimson-600 tw-text-white">
            <tr>
              <th class="tw-p-2"><input type="checkbox" @change="toggleAllSpecifications($event)" /></th>
              <th class="tw-p-2">Tên thuộc tính</th>
              <th class="tw-p-2">Ngày tạo</th>
              <th class="tw-p-2">Cập nhật lần cuối</th>
              <th class="tw-p-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="spec in paginatedSpecifications" :key="spec._id" class="tw-border-b hover:tw-bg-stone-50 tw-transition-colors">
              <td class="tw-p-2 tw-text-center">
                <input type="checkbox" v-model="selectedSpecificationIds" :value="spec._id" />
              </td>
              <td class="tw-p-2">{{ spec.specName || 'N/A' }}</td>
              <td class="tw-p-2">{{ formatDate(spec.createdAt) }}</td>
              <td class="tw-p-2">{{ formatDate(spec.updatedAt) }}</td>
              <td class="tw-p-2">
                <button @click="editSpecification(spec)" class="tw-text-sky-600 hover:tw-text-sky-800 tw-transition-colors">Chỉnh sửa</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      
      <div class="tw-flex tw-justify-between tw-items-center tw-mt-4">
        <div>Hàng trên mỗi trang:
          <select v-model="perPage" class="tw-border tw-border-stone-300 tw-p-1 tw-rounded-lg tw-ml-2 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500 focus:tw-border-transparent">
            <option v-for="n in [5, 10, 20]" :key="n" :value="n">{{ n }}</option>
          </select>
        </div>
        <div class="tw-flex tw-gap-2">
          <button @click="prevPage" :disabled="page === 1"
            class="tw-px-2 tw-py-1 tw-border tw-border-stone-300 tw-rounded-md hover:tw-bg-stone-50 tw-transition-colors disabled:tw-opacity-50 disabled:tw-cursor-not-allowed">&lt;</button>
          <span>Trang {{ page }}</span>
          <button @click="nextPage" :disabled="page >= totalPages"
            class="tw-px-2 tw-py-1 tw-border tw-border-stone-300 tw-rounded-md hover:tw-bg-stone-50 tw-transition-colors disabled:tw-opacity-50 disabled:tw-cursor-not-allowed">&gt;</button>
        </div>
      </div>
    </div>

    <div v-if="showAddCategoryModal" class="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-50">
      <div class="tw-bg-white tw-p-6 tw-rounded-lg tw-w-96">
        <h3 class="tw-text-lg tw-font-semibold tw-mb-4">Thêm danh mục mới</h3>
        <div class="tw-space-y-4">
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-mb-1">Tên danh mục</label>
            <input v-model="newCategory.name" class="tw-border tw-p-2 tw-rounded tw-w-full" />
          </div>
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-mb-1">Mã danh mục</label>
            <input v-model="newCategory.nameAscii" class="tw-border tw-p-2 tw-rounded tw-w-full" />
          </div>
        </div>
        <div class="tw-flex tw-gap-2 tw-mt-4">
          <button @click="addCategory" class="tw-px-4 tw-py-2 tw-bg-crimson-600 tw-text-white tw-rounded-lg hover:tw-bg-crimson-700">
            Thêm
          </button>
          <button @click="showAddCategoryModal = false" class="tw-px-4 tw-py-2 tw-bg-stone-300 tw-rounded-lg">
            Hủy
          </button>
        </div>
      </div>
    </div>

    <div v-if="showAddBrandModal" class="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-50">
      <div class="tw-bg-white tw-p-6 tw-rounded-lg tw-w-96">
        <h3 class="tw-text-lg tw-font-semibold tw-mb-4">Thêm thương hiệu mới</h3>
        <div class="tw-space-y-4">
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-mb-1">Tên thương hiệu</label>
            <input v-model="newBrand.name" class="tw-border tw-p-2 tw-rounded tw-w-full" />
          </div>
        </div>
        <div class="tw-flex tw-gap-2 tw-mt-4">
          <button @click="addBrand" class="tw-px-4 tw-py-2 tw-bg-crimson-600 tw-text-white tw-rounded-lg hover:tw-bg-crimson-700">
            Thêm
          </button>
          <button @click="showAddBrandModal = false" class="tw-px-4 tw-py-2 tw-bg-stone-300 tw-rounded-lg">
            Hủy
          </button>
        </div>
      </div>
    </div>

    <div v-if="showAddColorModal" class="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-50">
      <div class="tw-bg-white tw-p-6 tw-rounded-lg tw-w-96">
        <h3 class="tw-text-lg tw-font-semibold tw-mb-4">Thêm màu sắc mới</h3>
        <div class="tw-space-y-4">
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-mb-1">Tên màu</label>
            <input v-model="newColor.name" class="tw-border tw-p-2 tw-rounded tw-w-full" />
          </div>
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-mb-1">Chọn màu</label>
            <div class="tw-flex tw-gap-2 tw-items-center">
              <input 
                type="color" 
                v-model="newColor.code" 
                class="tw-w-16 tw-h-10 tw-border tw-rounded tw-cursor-pointer"
              />
              <input 
                v-model="newColor.code" 
                class="tw-border tw-p-2 tw-rounded tw-flex-1" 
                placeholder="#000000"
              />
            </div>
          </div>
        </div>
        <div class="tw-flex tw-gap-2 tw-mt-4">
          <button @click="addColor" class="tw-px-4 tw-py-2 tw-bg-crimson-600 tw-text-white tw-rounded-lg hover:tw-bg-crimson-700">
            Thêm
          </button>
          <button @click="showAddColorModal = false" class="tw-px-4 tw-py-2 tw-bg-stone-300 tw-rounded-lg">
            Hủy
          </button>
        </div>
      </div>
    </div>

    <div v-if="showEditCategoryModal" class="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-50">
      <div class="tw-bg-white tw-p-6 tw-rounded-lg tw-w-96">
        <h3 class="tw-text-lg tw-font-semibold tw-mb-4">Chỉnh sửa danh mục</h3>
        <div class="tw-space-y-4">
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-mb-1">Tên danh mục</label>
            <input v-model="editingCategoryData.name" class="tw-border tw-p-2 tw-rounded tw-w-full" />
          </div>
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-mb-1">Mã danh mục</label>
            <input v-model="editingCategoryData.nameAscii" class="tw-border tw-p-2 tw-rounded tw-w-full" />
          </div>
        </div>
        <div class="tw-flex tw-gap-2 tw-mt-4">
          <button @click="saveCategory(editingCategory)" class="tw-px-4 tw-py-2 tw-bg-crimson-600 tw-text-white tw-rounded-lg hover:tw-bg-crimson-700">
            Lưu
          </button>
          <button @click="showEditCategoryModal = false" class="tw-px-4 tw-py-2 tw-bg-stone-300 tw-rounded-lg">
            Hủy
          </button>
        </div>
      </div>
    </div>

    <div v-if="showEditBrandModal" class="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-50">
      <div class="tw-bg-white tw-p-6 tw-rounded-lg tw-w-96">
        <h3 class="tw-text-lg tw-font-semibold tw-mb-4">Chỉnh sửa thương hiệu</h3>
        <div class="tw-space-y-4">
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-mb-1">Tên thương hiệu</label>
            <input v-model="editingBrandData.name" class="tw-border tw-p-2 tw-rounded tw-w-full" />
          </div>
        </div>
        <div class="tw-flex tw-gap-2 tw-mt-4">
          <button @click="saveBrand(editingBrand)" class="tw-px-4 tw-py-2 tw-bg-crimson-600 tw-text-white tw-rounded-lg hover:tw-bg-crimson-700">
            Lưu
          </button>
          <button @click="showEditBrandModal = false" class="tw-px-4 tw-py-2 tw-bg-stone-300 tw-rounded-lg">
            Hủy
          </button>
        </div>
      </div>
    </div>

    <div v-if="showEditColorModal" class="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-50">
      <div class="tw-bg-white tw-p-6 tw-rounded-lg tw-w-96">
        <h3 class="tw-text-lg tw-font-semibold tw-mb-4">Chỉnh sửa màu sắc</h3>
        <div class="tw-space-y-4">
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-mb-1">Tên màu</label>
            <input v-model="editingColorData.name" class="tw-border tw-p-2 tw-rounded tw-w-full" />
          </div>
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-mb-1">Chọn màu</label>
            <div class="tw-flex tw-gap-2 tw-items-center">
              <input 
                type="color" 
                v-model="editingColorData.code" 
                class="tw-w-16 tw-h-10 tw-border tw-rounded tw-cursor-pointer"
              />
              <input 
                v-model="editingColorData.code" 
                class="tw-border tw-p-2 tw-rounded tw-flex-1" 
                placeholder="#000000"
              />
            </div>
          </div>
        </div>
        <div class="tw-flex tw-gap-2 tw-mt-4">
          <button @click="saveColor(editingColor)" class="tw-px-4 tw-py-2 tw-bg-crimson-600 tw-text-white tw-rounded-lg hover:tw-bg-crimson-700">
            Lưu
          </button>
          <button @click="showEditColorModal = false" class="tw-px-4 tw-py-2 tw-bg-stone-300 tw-rounded-lg">
            Hủy
          </button>
        </div>
      </div>
    </div>

    <div v-if="showAddMemoryModal" class="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-50">
      <div class="tw-bg-white tw-p-6 tw-rounded-lg tw-w-96">
        <h3 class="tw-text-lg tw-font-semibold tw-mb-4">Thêm bộ nhớ mới</h3>
        <div class="tw-space-y-4">
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-mb-1">RAM</label>
            <input v-model="newMemory.ram" class="tw-border tw-p-2 tw-rounded tw-w-full" placeholder="Ví dụ: 8GB" />
          </div>
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-mb-1">ROM</label>
            <input v-model="newMemory.rom" class="tw-border tw-p-2 tw-rounded tw-w-full" placeholder="Ví dụ: 256GB" />
          </div>
        </div>
        <div class="tw-flex tw-gap-2 tw-mt-4">
          <button @click="addMemory" class="tw-px-4 tw-py-2 tw-bg-crimson-600 tw-text-white tw-rounded-lg hover:tw-bg-crimson-700">
            Thêm
          </button>
          <button @click="showAddMemoryModal = false" class="tw-px-4 tw-py-2 tw-bg-stone-300 tw-rounded-lg">
            Hủy
          </button>
        </div>
      </div>
    </div>

    <div v-if="showEditMemoryModal" class="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-50">
      <div class="tw-bg-white tw-p-6 tw-rounded-lg tw-w-96">
        <h3 class="tw-text-lg tw-font-semibold tw-mb-4">Chỉnh sửa bộ nhớ</h3>
        <div class="tw-space-y-4">
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-mb-1">RAM</label>
            <input v-model="editingMemoryData.ram" class="tw-border tw-p-2 tw-rounded tw-w-full" placeholder="Ví dụ: 8GB" />
          </div>
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-mb-1">ROM</label>
            <input v-model="editingMemoryData.rom" class="tw-border tw-p-2 tw-rounded tw-w-full" placeholder="Ví dụ: 256GB" />
          </div>
        </div>
        <div class="tw-flex tw-gap-2 tw-mt-4">
          <button @click="saveMemory(editingMemory)" class="tw-px-4 tw-py-2 tw-bg-crimson-600 tw-text-white tw-rounded-lg hover:tw-bg-crimson-700">
            Lưu
          </button>
          <button @click="showEditMemoryModal = false" class="tw-px-4 tw-py-2 tw-bg-stone-300 tw-rounded-lg">
            Hủy
          </button>
        </div>
      </div>
    </div>

    <!-- Modal thêm Specification -->
    <div v-if="showAddSpecificationModal" class="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-50">
      <div class="tw-bg-white tw-p-6 tw-rounded-lg tw-w-96">
        <h3 class="tw-text-lg tw-font-semibold tw-mb-4">Thêm thuộc tính kỹ thuật mới</h3>
        <div class="tw-space-y-4">
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-mb-1">Tên thuộc tính</label>
            <input v-model="newSpecification.specName" class="tw-border tw-p-2 tw-rounded tw-w-full" placeholder="Ví dụ: Kích thước màn hình" />
          </div>
        </div>
        <div class="tw-flex tw-gap-2 tw-mt-4">
          <button @click="addSpecification" class="tw-px-4 tw-py-2 tw-bg-crimson-600 tw-text-white tw-rounded-lg hover:tw-bg-crimson-700">
            Thêm
          </button>
          <button @click="showAddSpecificationModal = false" class="tw-px-4 tw-py-2 tw-bg-stone-300 tw-rounded-lg">
            Hủy
          </button>
        </div>
      </div>
    </div>

    <!-- Modal edit Specification -->
    <div v-if="showEditSpecificationModal" class="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-50">
      <div class="tw-bg-white tw-p-6 tw-rounded-lg tw-w-96">
        <h3 class="tw-text-lg tw-font-semibold tw-mb-4">Chỉnh sửa thuộc tính kỹ thuật</h3>
        <div class="tw-space-y-4">
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-mb-1">Tên thuộc tính</label>
            <input v-model="editingSpecificationData.specName" class="tw-border tw-p-2 tw-rounded tw-w-full" placeholder="Ví dụ: Kích thước màn hình" />
          </div>
        </div>
        <div class="tw-flex tw-gap-2 tw-mt-4">
          <button @click="saveSpecification(editingSpecification)" class="tw-px-4 tw-py-2 tw-bg-crimson-600 tw-text-white tw-rounded-lg hover:tw-bg-crimson-700">
            Lưu
          </button>
          <button @click="showEditSpecificationModal = false" class="tw-px-4 tw-py-2 tw-bg-stone-300 tw-rounded-lg">
            Hủy
          </button>
        </div>
      </div>
    </div>

    <!-- Modal xác nhận xóa -->
    <div v-if="showDeleteConfirmModal" class="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-50">
      <div class="tw-bg-white tw-p-6 tw-rounded-lg tw-w-96">
        <h3 class="tw-text-lg tw-font-semibold tw-mb-4 tw-text-crimson-600">Xác nhận xóa</h3>
        <p class="tw-text-stone-700 tw-mb-6">{{ deleteConfirmMessage }}</p>
        <div class="tw-flex tw-gap-2 tw-justify-end">
          <button @click="showDeleteConfirmModal = false" class="tw-px-4 tw-py-2 tw-bg-stone-300 tw-text-stone-700 tw-rounded-lg hover:tw-bg-stone-400 tw-transition-colors">
            Hủy
          </button>
          <button @click="confirmDelete" class="tw-px-4 tw-py-2 tw-bg-crimson-600 tw-text-white tw-rounded-lg hover:tw-bg-crimson-700 tw-transition-colors">
            Xóa
          </button>
        </div>
      </div>
    </div>

    <!-- Modal thông báo -->
    <div v-if="showNotificationModal" class="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-[60]">
      <div class="tw-bg-white tw-p-6 tw-rounded-lg tw-w-96 tw-shadow-xl">
        <div class="tw-flex tw-items-start tw-gap-3">
          <!-- Message -->
          <div class="tw-flex-1">
            <h3 class="tw-text-lg tw-font-semibold tw-mb-2" 
                :class="{
                  'tw-text-success': notificationType === 'success',
                  'tw-text-error': notificationType === 'error',
                  'tw-text-warning': notificationType === 'warning',
                  'tw-text-info': notificationType === 'info'
                }">
              {{ notificationType === 'success' ? 'Thành công' : 
                 notificationType === 'error' ? 'Lỗi' : 
                 notificationType === 'warning' ? 'Cảnh báo' : 'Thông báo' }}
            </h3>
            <p class="tw-text-stone-700 tw-whitespace-pre-line">{{ notificationMessage }}</p>
          </div>
        </div>
        
        <div class="tw-flex tw-justify-end tw-mt-6">
          <button @click="showNotificationModal = false" 
                  class="tw-px-4 tw-py-2 tw-rounded-lg tw-font-medium tw-transition-colors"
                  :class="{
                    'tw-bg-red tw-text-white hover:tw-bg-emerald-700': notificationType === 'success',
                    'tw-bg-red tw-text-white hover:tw-bg-crimson-700': notificationType === 'error',
                    'tw-bg-red tw-text-white hover:tw-bg-amber-700': notificationType === 'warning',
                    'tw-bg-red tw-text-white hover:tw-bg-blue-700': notificationType === 'info'
                  }">
            Đóng
          </button>
        </div>
      </div>
    </div>

    <!-- Modal thêm sản phẩm mới -->
    <div v-if="showAddProductModal" class="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-50">
      <div class="tw-bg-white tw-rounded-lg tw-p-6 tw-w-[600px] tw-max-h-[80vh] tw-overflow-y-auto">
        <h3 class="tw-text-xl tw-font-bold tw-mb-4 tw-text-crimson-600">
          {{ addProductStep === 1 ? 'Bước 1: Thông tin sản phẩm' : 'Bước 2: Tạo phiên bản đầu tiên' }}
        </h3>

        <!-- Bước 1: Thông tin sản phẩm -->
        <div v-if="addProductStep === 1">
          <div class="tw-mb-4">
            <label class="tw-block tw-mb-2 tw-font-medium">Tên sản phẩm <span class="tw-text-red-500">*</span></label>
            <input v-model="newProduct.name" type="text" class="tw-w-full tw-border tw-rounded tw-px-3 tw-py-2" placeholder="VD: iPhone 15 Pro Max">
          </div>

          <div class="tw-mb-4">
            <label class="tw-block tw-mb-2 tw-font-medium">Danh mục <span class="tw-text-red-500">*</span></label>
            <select v-model="newProduct.category" class="tw-w-full tw-border tw-rounded tw-px-3 tw-py-2">
              <option value="">-- Chọn danh mục --</option>
              <option v-for="cat in categoryList" :key="cat._id" :value="cat._id">{{ cat.name }}</option>
            </select>
          </div>

          <div class="tw-mb-4">
            <label class="tw-block tw-mb-2 tw-font-medium">Thương hiệu <span class="tw-text-red-500">*</span></label>
            <select v-model="newProduct.brand" class="tw-w-full tw-border tw-rounded tw-px-3 tw-py-2">
              <option value="">-- Chọn thương hiệu --</option>
              <option v-for="brand in brandList" :key="brand._id" :value="brand._id">{{ brand.name }}</option>
            </select>
          </div>

          <div class="tw-mb-4">
            <label class="tw-block tw-mb-2 tw-font-medium">Giá gốc <span class="tw-text-red-500">*</span></label>
            <input v-model.number="newProduct.basePrice" type="number" class="tw-w-full tw-border tw-rounded tw-px-3 tw-py-2" placeholder="VD: 29990000">
          </div>

          <div class="tw-mb-4">
            <label class="tw-block tw-mb-2 tw-font-medium">Giảm giá (%)</label>
            <input v-model.number="newProduct.discountPercentage" type="number" min="0" max="100" class="tw-w-full tw-border tw-rounded tw-px-3 tw-py-2" placeholder="VD: 10">
          </div>

          <!-- Upload ảnh đại diện -->
          <div class="tw-mb-4">
            <label class="tw-block tw-mb-2 tw-font-medium">Ảnh đại diện (tùy chọn)</label>
            <div class="tw-flex tw-gap-2">
              <input 
                type="file" 
                ref="thumbFileInput"
                @change="handleThumbFileSelect"
                accept="image/*"
                class="tw-hidden"
              />  
              <button 
                @click="$refs.thumbFileInput.click()" 
                class="tw-px-4 tw-py-2 tw-bg-red tw-text-white tw-rounded hover:tw-bg-blue-600"
              >
                📁 Chọn ảnh
              </button>
              <span v-if="newProductThumbFileName" class="tw-flex tw-items-center tw-text-sm tw-text-gray-600">
                {{ newProductThumbFileName }}
              </span>
            </div>
            <!-- Preview ảnh -->
            <div v-if="newProductThumbPreview" class="tw-mt-2">
              <img :src="newProductThumbPreview" alt="Preview" class="tw-w-32 tw-h-32 tw-object-cover tw-rounded tw-border">
            </div>
          </div>

          <div class="tw-mb-4">
            <label class="tw-block tw-mb-2 tw-font-medium">Mô tả</label>
            <textarea v-model="newProduct.description" class="tw-w-full tw-border tw-rounded tw-px-3 tw-py-2" rows="3" placeholder="Nhập mô tả sản phẩm..."></textarea>
          </div>

          <div class="tw-flex tw-justify-end tw-gap-2">
            <button @click="cancelAddProduct" class="tw-px-4 tw-py-2 tw-bg-gray-300 tw-rounded hover:tw-bg-gray-400">Hủy</button>
            <button @click="goToStep2" class="tw-px-4 tw-py-2 tw-bg-crimson-600 tw-text-white tw-rounded hover:tw-bg-crimson-700">Tiếp theo →</button>
          </div>
        </div>

        <!-- Bước 2: Tạo phiên bản đầu tiên -->
        <div v-if="addProductStep === 2">
          <div class="tw-mb-4 tw-p-3 tw-bg-blue-50 tw-rounded tw-border tw-border-blue-200">
            <p class="tw-text-sm tw-text-blue-800">
              <strong>{{ newProduct.name }}</strong> - {{ formatCurrency(newProduct.basePrice) }}
            </p>
          </div>

          <div class="tw-mb-4">
            <label class="tw-block tw-mb-2 tw-font-medium">Bộ nhớ <span class="tw-text-red-500">*</span></label>
            <select v-model="newProductVariant.memoryId" class="tw-w-full tw-border tw-rounded tw-px-3 tw-py-2">
              <option value="">-- Chọn bộ nhớ --</option>
              <option v-for="mem in memoryList" :key="mem._id" :value="mem._id">
                {{ mem.ram }} / {{ mem.rom }}
              </option>
            </select>
          </div>

          <div class="tw-mb-4">
            <label class="tw-block tw-mb-2 tw-font-medium">Màu sắc <span class="tw-text-red-500">*</span></label>
            <select v-model="newProductVariant.colorId" class="tw-w-full tw-border tw-rounded tw-px-3 tw-py-2">
              <option value="">-- Chọn màu sắc --</option>
              <option v-for="color in colorList" :key="color._id" :value="color._id">
                {{ color.name }}
              </option>
            </select>
          </div>

          <div class="tw-mb-4">
            <label class="tw-block tw-mb-2 tw-font-medium">Giá bán <span class="tw-text-red-500">*</span></label>
            <input v-model.number="newProductVariant.price" type="number" class="tw-w-full tw-border tw-rounded tw-px-3 tw-py-2" placeholder="VD: 29990000">
          </div>

          <div class="tw-mb-4">
            <label class="tw-block tw-mb-2 tw-font-medium">Số lượng tồn kho <span class="tw-text-red-500">*</span></label>
            <input v-model.number="newProductVariant.stock" type="number" min="0" class="tw-w-full tw-border tw-rounded tw-px-3 tw-py-2" placeholder="VD: 100">
          </div>

          <div class="tw-flex tw-justify-end tw-gap-2">
            <button @click="addProductStep = 1" class="tw-px-4 tw-py-2 tw-bg-gray-300 tw-rounded hover:tw-bg-gray-400">← Quay lại</button>
            <button @click="cancelAddProduct" class="tw-px-4 tw-py-2 tw-bg-gray-300 tw-rounded hover:tw-bg-gray-400">Hủy</button>
            <button @click="createProductWithVariant" class="tw-px-4 tw-py-2 tw-bg-red tw-text-white tw-rounded">✓ Tạo sản phẩm</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

import { useRouter } from 'vue-router'
const router = useRouter()

// Tabs
const tabs = ['Sản phẩm', 'Danh mục', 'Thương hiệu', 'Màu sắc', 'Bộ nhớ', 'Thuộc tính kỹ thuật']
const activeTab = ref('Sản phẩm')

// Bộ lọc
const search = ref('')
const statuses = ['Còn hàng', 'Hết hàng']
const sortOptions = [
  { value: 'price-asc', label: 'Tăng dần' },
  { value: 'price-desc', label: 'Giảm dần' }
]

// Dữ liệu thực sự dùng để lọc
const selectedStatuses = ref([])
const selectedBrands = ref([])
const selectedCategories = ref([])
const selectedColors = ref([])
const selectedSort = ref('')

// Dữ liệu tạm trong dropdown
const tempStatuses = ref([])
const tempBrands = ref([])
const tempCategories = ref([])

// Dropdown
const openDropdown = ref(null)
function toggleDropdown(type) {
  openDropdown.value = openDropdown.value === type ? null : type
  if (type === 'status') tempStatuses.value = [...selectedStatuses.value]
  if (type === 'brand') tempBrands.value = [...selectedBrands.value]
  if (type === 'category') tempCategories.value = [...selectedCategories.value]
}
function closeDropdown() {
  openDropdown.value = null
}
function applyFilters() {
  selectedStatuses.value = [...tempStatuses.value]
  selectedBrands.value = [...tempBrands.value]
  selectedCategories.value = [...tempCategories.value]
  openDropdown.value = null
}

// Chọn status/brand trong dropdown tạm
function toggleStatus(status) {
  const idx = tempStatuses.value.indexOf(status)
  if (idx === -1) tempStatuses.value.push(status)
  else tempStatuses.value.splice(idx, 1)
}
function toggleBrand(b) {
  const idx = tempBrands.value.indexOf(b)
  if (idx === -1) tempBrands.value.push(b)
  else tempBrands.value.splice(idx, 1)
}
function toggleCategory(b) {
  const idx = tempCategories.value.indexOf(b)
  if (idx === -1) tempCategories.value.push(b)
  else tempCategories.value.splice(idx, 1)
}

//Danh sách sản phẩm thực
const products = ref([])

// Dữ liệu cho các tab
const categoryList = ref([])
const brandList = ref([])
const colorList = ref([])
const memoryList = ref([])
const specificationList = ref([])

// Computed properties cho dropdown filter
const categories = computed(() => categoryList.value.map(c => c.name))
const brands = computed(() => brandList.value.map(b => b.name))

// Modal states
const showAddCategoryModal = ref(false)
const showAddBrandModal = ref(false)
const showAddColorModal = ref(false)
const showAddMemoryModal = ref(false)
const showAddSpecificationModal = ref(false)
const showEditCategoryModal = ref(false)
const showEditBrandModal = ref(false)
const showEditColorModal = ref(false)
const showEditMemoryModal = ref(false)
const showEditSpecificationModal = ref(false)
const showDeleteConfirmModal = ref(false)
const showAddProductModal = ref(false)
const showNotificationModal = ref(false)
const notificationMessage = ref('')
const notificationType = ref('info') // 'success', 'error', 'warning', 'info'

// Add product states
const addProductStep = ref(1) // 1 = thông tin sản phẩm, 2 = tạo phiên bản
const newProduct = ref({
  name: '',
  category: '',
  brand: '',
  basePrice: 0,
  discountPercentage: 0,
  description: '',
  thumbUrl: ''
})
const newProductVariant = ref({
  memoryId: '',
  colorId: '',
  price: 0,
  stock: 0
})
const thumbFileInput = ref(null)
const newProductThumbFile = ref(null)
const newProductThumbFileName = ref('')
const newProductThumbPreview = ref('')

// Delete confirmation
const deleteConfirmMessage = ref('')
const deleteConfirmAction = ref(null)

// Search states
const categorySearch = ref('')
const brandSearch = ref('')
const colorSearch = ref('')
const memorySearch = ref('')
const specificationSearch = ref('')

// Editing states
const editingCategory = ref(null)
const editingBrand = ref(null)
const editingColor = ref(null)
const editingMemory = ref(null)
const editingSpecification = ref(null)

// Form data
const newCategory = ref({ name: '', nameAscii: '' })
const newBrand = ref({ name: '', description: '' })
const newColor = ref({ name: '', code: '#000000', description: '' })
const newMemory = ref({ ram: '', rom: '' })
const newSpecification = ref({ specName: '' })

const editingCategoryData = ref({ name: '', nameAscii: '' })
const editingBrandData = ref({ name: ''})
const editingColorData = ref({ name: '', code: '#000000'})
const editingMemoryData = ref({ ram: '', rom: '' })
const editingSpecificationData = ref({ specName: '' })

onMounted(async () => {
  await loadProducts()
  await loadCategories()
  await loadBrands()
  await loadColors()
  await loadMemories()
  await loadSpecifications()
})

async function loadProducts() {
  try {
    const res = await axios.get('http://localhost:3000/api/products')
    console.log('📦 API Response:', res)
    if (res?.success) {
      products.value = res.items
      console.log('✅ Loaded', products.value.length, 'products')
      console.log('🔍 First product:', products.value[0])
      console.log('📊 filteredProducts:', filteredProducts.value.length)
      console.log('📄 paginatedProducts:', paginatedProducts.value.length)
    }
  } catch (error) {
    console.error('❌ Error loading products:', error)
  }
}

async function loadCategories() {
  try {
    const res = await axios.get('http://localhost:3000/api/categories')
    if (res?.success) {
      categoryList.value = res.items
      console.log('📂 Categories loaded:', res.items)
      console.log('🔑 First category keys:', res.items[0] ? Object.keys(res.items[0]) : 'No categories')
    }
  } catch (error) {
    console.error('Error loading categories:', error)
  }
}

async function loadBrands() {
  try {
    const res = await axios.get('http://localhost:3000/api/brands')
    if (res?.success) brandList.value = res.items
  } catch (error) {
    console.error('Error loading brands:', error)
  }
}

async function loadColors() {
  try {
    const res = await axios.get('http://localhost:3000/api/colors')
    if (res?.success) colorList.value = res.items
  } catch (error) {
    console.error('Error loading colors:', error)
  }
}

async function loadMemories() {
  try {
    const res = await axios.get('http://localhost:3000/api/memories')
    if (res?.success) memoryList.value = res.items
  } catch (error) {
    console.error('Error loading memories:', error)
  }
}

async function loadSpecifications() {
  try {
    const res = await axios.get('http://localhost:3000/api/specifications')
    if (res?.success) specificationList.value = res.items
  } catch (error) {
    console.error('Error loading specifications:', error)
  }
}


// Checkbox
const selected = ref([])

// Checkbox cho các tabs (RIÊNG BIỆT với filter)
const selectedCategoryIds = ref([])
const selectedBrandIds = ref([])
const selectedColorIds = ref([])
const selectedMemoryIds = ref([])
const selectedSpecificationIds = ref([])

function toggleAll(event) {
  console.log('🔘 toggleAll called, checked:', event.target.checked)
  console.log('📦 paginatedProducts:', paginatedProducts.value.map(p => ({ _id: p._id, id: p.id, name: p.name })))
  
  if (event.target.checked) {
    selected.value = paginatedProducts.value.map(p => p._id)
    console.log('✅ Selected IDs:', selected.value)
  } else {
    selected.value = []
    console.log('❌ Cleared selection')
  }
}

// Checkbox cho danh mục
function toggleAllCategories(event) {
  if (event.target.checked) {
    selectedCategoryIds.value = filteredCategories.value.map(c => c._id)
  } else {
    selectedCategoryIds.value = []
  }
}

// Checkbox cho thương hiệu
function toggleAllBrands(event) {
  if (event.target.checked) {
    selectedBrandIds.value = filteredBrands.value.map(b => b._id)
  } else {
    selectedBrandIds.value = []
  }
}

// Checkbox cho màu sắc
function toggleAllColors(event) {
  if (event.target.checked) {
    selectedColorIds.value = filteredColors.value.map(c => c._id)
  } else {
    selectedColorIds.value = []
  }
}

// Checkbox cho bộ nhớ
function toggleAllMemories(event) {
  if (event.target.checked) {
    selectedMemoryIds.value = filteredMemories.value.map(m => m._id)
  } else {
    selectedMemoryIds.value = []
  }
}

function toggleAllSpecifications(event) {
  if (event.target.checked) {
    selectedSpecificationIds.value = filteredSpecifications.value.map(s => s._id)
  } else {
    selectedSpecificationIds.value = []
  }
}

// ============= GENERIC HELPER FUNCTIONS =============
// Cấu hình cho từng resource type
const resourceConfig = {
  products: {
    endpoint: 'products',
    label: 'sản phẩm',
    selectedIds: selected,
    loadFunction: loadProducts,
    // Products không dùng generic add/edit vì có logic riêng (modal 2 bước)
    cascadeDelete: true // Đánh dấu có cascade delete
  },
  categories: {
    endpoint: 'categories',
    label: 'danh mục',
    selectedIds: selectedCategoryIds,
    loadFunction: loadCategories,
    newData: newCategory,
    defaultData: { name: '', nameAscii: '' },
    editingData: editingCategoryData,
    editing: editingCategory,
    showAddModal: showAddCategoryModal,
    showEditModal: showEditCategoryModal
  },
  brands: {
    endpoint: 'brands',
    label: 'thương hiệu',
    selectedIds: selectedBrandIds,
    loadFunction: loadBrands,
    newData: newBrand,
    defaultData: { name: '' },
    editingData: editingBrandData,
    editing: editingBrand,
    showAddModal: showAddBrandModal,
    showEditModal: showEditBrandModal
  },
  colors: {
    endpoint: 'colors',
    label: 'màu sắc',
    selectedIds: selectedColorIds,
    loadFunction: loadColors,
    newData: newColor,
    defaultData: { name: '', code: '#000000' },
    editingData: editingColorData,
    editing: editingColor,
    showAddModal: showAddColorModal,
    showEditModal: showEditColorModal
  },
  memories: {
    endpoint: 'memories',
    label: 'bộ nhớ',
    selectedIds: selectedMemoryIds,
    loadFunction: loadMemories,
    newData: newMemory,
    defaultData: { ram: '', rom: '' },
    editingData: editingMemoryData,
    editing: editingMemory,
    showAddModal: showAddMemoryModal,
    showEditModal: showEditMemoryModal
  },
  specifications: {
    endpoint: 'specifications',
    label: 'thuộc tính kỹ thuật',
    selectedIds: selectedSpecificationIds,
    loadFunction: loadSpecifications,
    newData: newSpecification,
    defaultData: { specName: '' },
    editingData: editingSpecificationData,
    editing: editingSpecification,
    showAddModal: showAddSpecificationModal,
    showEditModal: showEditSpecificationModal
  }
}

// Generic function để xóa nhiều items
async function deleteSelectedItems(resourceType) {
  const config = resourceConfig[resourceType]
  if (config.selectedIds.value.length === 0) {
    deleteConfirmMessage.value = `Chưa chọn ${config.label} để xóa`
    deleteConfirmAction.value = null
    showDeleteConfirmModal.value = true
    return
  }
  deleteConfirmMessage.value = `Bạn có chắc chắn muốn xóa ${config.selectedIds.value.length} ${config.label} đã chọn?`
  deleteConfirmAction.value = async () => {
    try {
      for (const id of config.selectedIds.value) {
        await axios.delete(`http://localhost:3000/api/${config.endpoint}/${id}`)
      }
      await config.loadFunction()
      config.selectedIds.value = []
      showDeleteConfirmModal.value = false
    } catch (error) {
      console.error(`Error deleting ${resourceType}:`, error)
      deleteConfirmMessage.value = `Lỗi khi xóa ${config.label}`
      deleteConfirmAction.value = null
    }
  }
  showDeleteConfirmModal.value = true
}

// Wrapper functions
const deleteSelectedCategories = () => deleteSelectedItems('categories')
const deleteSelectedBrands = () => deleteSelectedItems('brands')
const deleteSelectedColors = () => deleteSelectedItems('colors')
const deleteSelectedMemories = () => deleteSelectedItems('memories')
const deleteSelectedSpecifications = () => deleteSelectedItems('specifications')

// Generic function để thêm item
async function addItem(resourceType) {
  const config = resourceConfig[resourceType]
  try {
    const res = await axios.post(`http://localhost:3000/api/${config.endpoint}`, config.newData.value)
    if (res?.success) {
      await config.loadFunction()
      config.showAddModal.value = false
      config.newData.value = { ...config.defaultData }
    }
  } catch (error) {
    console.error(`Error adding ${resourceType}:`, error)
    deleteConfirmMessage.value = `Lỗi khi thêm ${config.label}`
    deleteConfirmAction.value = null
    showDeleteConfirmModal.value = true
  }
}

// Generic function để mở modal edit
function editItem(resourceType, item) {
  const config = resourceConfig[resourceType]
  config.editing.value = item._id
  config.editingData.value = { ...config.defaultData }
  // Copy data từ item vào editingData
  Object.keys(config.defaultData).forEach(key => {
    if (item[key] !== undefined) {
      config.editingData.value[key] = item[key]
    }
  })
  config.showEditModal.value = true
}

// Generic function để lưu item
async function saveItem(resourceType, id) {
  const config = resourceConfig[resourceType]
  try {
    const res = await axios.put(`http://localhost:3000/api/${config.endpoint}/${id}`, config.editingData.value)
    if (res?.success) {
      await config.loadFunction()
      config.showEditModal.value = false
      config.editing.value = null
    }
  } catch (error) {
    console.error(`Error updating ${resourceType}:`, error)
    deleteConfirmMessage.value = `Lỗi khi cập nhật ${config.label}`
    deleteConfirmAction.value = null
    showDeleteConfirmModal.value = true
  }
}

// Wrapper functions cho add
const addCategory = () => addItem('categories')
const addBrand = () => addItem('brands')
const addColor = () => addItem('colors')
const addMemory = () => addItem('memories')
const addSpecification = () => addItem('specifications')

// Wrapper functions cho edit
const editCategory = (item) => editItem('categories', item)
const editBrand = (item) => editItem('brands', item)
const editColor = (item) => editItem('colors', item)
const editMemory = (item) => editItem('memories', item)
const editSpecification = (item) => editItem('specifications', item)

// Wrapper functions cho save
const saveCategory = (id) => saveItem('categories', id)
const saveBrand = (id) => saveItem('brands', id)
const saveColor = (id) => saveItem('colors', id)
const saveMemory = (id) => saveItem('memories', id)
const saveSpecification = (id) => saveItem('specifications', id)

// Lọc sản phẩm
const filteredProducts = computed(() => {
  let filtered = products.value.filter(p => {
    return (
      (!search.value || p.name.toLowerCase().includes(search.value.toLowerCase())) &&
      (selectedStatuses.value.length === 0 || selectedStatuses.value.includes(p.status)) &&
      (selectedBrands.value.length === 0 || selectedBrands.value.includes(p.brand)) &&
      (selectedCategories.value.length === 0 || selectedCategories.value.includes(p.category)
      ))
  })

  // Áp dụng sắp xếp theo giá
  if (selectedSort.value === 'price-asc') {
    filtered = filtered.sort((a, b) => (a.price || 0) - (b.price || 0))
  } else if (selectedSort.value === 'price-desc') {
    filtered = filtered.sort((a, b) => (b.price || 0) - (a.price || 0))
  }

  return filtered
})

// Lọc danh mục
const filteredCategories = computed(() => {
  return categoryList.value.filter(c => {
    return !categorySearch.value || 
           c.name.toLowerCase().includes(categorySearch.value.toLowerCase()) ||
           c.nameAscii.toLowerCase().includes(categorySearch.value.toLowerCase())
  })
})

// Lọc thương hiệu
const filteredBrands = computed(() => {
  return brandList.value.filter(b => {
    return !brandSearch.value || 
           b.name.toLowerCase().includes(brandSearch.value.toLowerCase()) ||
           b.nameAscii.toLowerCase().includes(brandSearch.value.toLowerCase())
  })
})

// Lọc màu sắc
const filteredColors = computed(() => {
  return colorList.value.filter(c => {
    return !colorSearch.value || 
           c.name.toLowerCase().includes(colorSearch.value.toLowerCase()) ||
           c.code.toLowerCase().includes(colorSearch.value.toLowerCase())
  })
})

// Lọc bộ nhớ
const filteredMemories = computed(() => {
  return memoryList.value.filter(m => {
    return !memorySearch.value || 
           (m.ram && m.ram.toLowerCase().includes(memorySearch.value.toLowerCase())) ||
           (m.rom && m.rom.toLowerCase().includes(memorySearch.value.toLowerCase()))
  })
})

const filteredSpecifications = computed(() => {
  return specificationList.value.filter(s => {
    return !specificationSearch.value || 
           (s.specName && s.specName.toLowerCase().includes(specificationSearch.value.toLowerCase()))
  })
})

// Phân trang - Riêng biệt cho từng tab
const productPage = ref(1)
const productPerPage = ref(10)

const categoryPage = ref(1)
const categoryPerPage = ref(10)

const brandPage = ref(1)
const brandPerPage = ref(10)

const colorPage = ref(1)
const colorPerPage = ref(10)

const memoryPage = ref(1)
const memoryPerPage = ref(10)

const specificationPage = ref(1)
const specificationPerPage = ref(10)

// Computed properties để lấy page và perPage hiện tại theo tab
const page = computed({
  get() {
    if (activeTab.value === 'Sản phẩm') return productPage.value
    if (activeTab.value === 'Danh mục') return categoryPage.value
    if (activeTab.value === 'Thương hiệu') return brandPage.value
    if (activeTab.value === 'Màu sắc') return colorPage.value
    if (activeTab.value === 'Bộ nhớ') return memoryPage.value
    if (activeTab.value === 'Thuộc tính kỹ thuật') return specificationPage.value
    return 1
  },
  set(val) {
    if (activeTab.value === 'Sản phẩm') productPage.value = val
    else if (activeTab.value === 'Danh mục') categoryPage.value = val
    else if (activeTab.value === 'Thương hiệu') brandPage.value = val
    else if (activeTab.value === 'Màu sắc') colorPage.value = val
    else if (activeTab.value === 'Bộ nhớ') memoryPage.value = val
    else if (activeTab.value === 'Thuộc tính kỹ thuật') specificationPage.value = val
  }
})

const perPage = computed({
  get() {
    if (activeTab.value === 'Sản phẩm') return productPerPage.value
    if (activeTab.value === 'Danh mục') return categoryPerPage.value
    if (activeTab.value === 'Thương hiệu') return brandPerPage.value
    if (activeTab.value === 'Màu sắc') return colorPerPage.value
    if (activeTab.value === 'Bộ nhớ') return memoryPerPage.value
    if (activeTab.value === 'Thuộc tính kỹ thuật') return specificationPerPage.value
    return 10
  },
  set(val) {
    if (activeTab.value === 'Sản phẩm') productPerPage.value = val
    else if (activeTab.value === 'Danh mục') categoryPerPage.value = val
    else if (activeTab.value === 'Thương hiệu') brandPerPage.value = val
    else if (activeTab.value === 'Màu sắc') colorPerPage.value = val
    else if (activeTab.value === 'Bộ nhớ') memoryPerPage.value = val
    else if (activeTab.value === 'Thuộc tính kỹ thuật') specificationPerPage.value = val
  }
})

// Tính tổng số trang cho từng tab
const totalPages = computed(() => {
  if (activeTab.value === 'Sản phẩm') {
    return Math.ceil(filteredProducts.value.length / productPerPage.value)
  } else if (activeTab.value === 'Danh mục') {
    return Math.ceil(filteredCategories.value.length / categoryPerPage.value)
  } else if (activeTab.value === 'Thương hiệu') {
    return Math.ceil(filteredBrands.value.length / brandPerPage.value)
  } else if (activeTab.value === 'Màu sắc') {
    return Math.ceil(filteredColors.value.length / colorPerPage.value)
  } else if (activeTab.value === 'Bộ nhớ') {
    return Math.ceil(filteredMemories.value.length / memoryPerPage.value)
  } else if (activeTab.value === 'Thuộc tính kỹ thuật') {
    return Math.ceil(filteredSpecifications.value.length / specificationPerPage.value)
  }
  return 1
})

const paginatedProducts = computed(() => {
  const start = (productPage.value - 1) * productPerPage.value
  return filteredProducts.value.slice(start, start + productPerPage.value)
})

const paginatedCategories = computed(() => {
  const start = (categoryPage.value - 1) * categoryPerPage.value
  return filteredCategories.value.slice(start, start + categoryPerPage.value)
})

const paginatedBrands = computed(() => {
  const start = (brandPage.value - 1) * brandPerPage.value
  return filteredBrands.value.slice(start, start + brandPerPage.value)
})

const paginatedColors = computed(() => {
  const start = (colorPage.value - 1) * colorPerPage.value
  return filteredColors.value.slice(start, start + colorPerPage.value)
})

const paginatedMemories = computed(() => {
  const start = (memoryPage.value - 1) * memoryPerPage.value
  return filteredMemories.value.slice(start, start + memoryPerPage.value)
})

const paginatedSpecifications = computed(() => {
  const start = (specificationPage.value - 1) * specificationPerPage.value
  return filteredSpecifications.value.slice(start, start + specificationPerPage.value)
})

function prevPage() {
  if (page.value > 1) page.value--
}

function nextPage() {
  if (page.value < totalPages.value) page.value++
}

// Hàm format tiền
function formatCurrency(val) {
  return val.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
}

// Điều hướng chi tiết
function goToDetail(id) {
  router.push(`/admin/product-detail/${id}`)
}

// Xóa nhiều sản phẩm
async function deleteSelected() {
  if (selected.value.length === 0) {
    deleteConfirmMessage.value = 'Chưa chọn sản phẩm để xóa'
    deleteConfirmAction.value = null
    showDeleteConfirmModal.value = true
    return
  }
  
  deleteConfirmMessage.value = `Bạn có chắc chắn muốn xóa ${selected.value.length} sản phẩm đã chọn? Tất cả phiên bản, hình ảnh và thông số kỹ thuật cũng sẽ bị xóa!`
  deleteConfirmAction.value = async () => {
    try {
      console.log('🗑️ Deleting products:', selected.value)
      
      let totalDeleted = {
        products: 0,
        variants: 0,
        images: 0,
        specifications: 0
      }
      
      // Xóa từng sản phẩm (backend sẽ cascade delete)
      for (const productId of selected.value) {
        try {
          const res = await axios.delete(`http://localhost:3000/api/products/${productId}`)
          
          if (res?.success) {
            totalDeleted.products++
            if (res.deletedCount) {
              totalDeleted.variants += res.deletedCount.variants || 0
              totalDeleted.images += res.deletedCount.images || 0
              totalDeleted.specifications += res.deletedCount.specifications || 0
            }
          }
        } catch (error) {
          console.error(`❌ Error deleting product ${productId}:`, error)
        }
      }
      
      // Reload danh sách
      await loadProducts()
      
      // Clear selection
      selected.value = []
      
      // Đóng modal xác nhận
      showDeleteConfirmModal.value = false
      
      // Hiển thị thông báo thành công
      const message = `Đã xóa:\n• ${totalDeleted.products} sản phẩm\n• ${totalDeleted.variants} phiên bản\n• ${totalDeleted.images} hình ảnh\n• ${totalDeleted.specifications} thông số kỹ thuật`
      showNotification(message, 'success')
      
      console.log('✅ Delete completed:', totalDeleted)
    } catch (error) {
      console.error('❌ Error in deleteSelected:', error)
      showDeleteConfirmModal.value = false
      showNotification('Lỗi khi xóa sản phẩm!', 'error')
    }
  }
  showDeleteConfirmModal.value = true
}

// Xác nhận xóa
function confirmDelete() {
  if (deleteConfirmAction.value) {
    deleteConfirmAction.value()
  } else {
    showDeleteConfirmModal.value = false
  }
}

// Hàm format ngày
function formatDate(date) {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('vi-VN')
}

// Helper function: Show notification modal
function showNotification(message, type = 'info') {
  notificationMessage.value = message
  notificationType.value = type
  showNotificationModal.value = true
}

// ============= THÊM SẢN PHẨM MỚI =============
// Handle thumb file selection
function handleThumbFileSelect(event) {
  const file = event.target.files?.[0]
  if (!file) return

  // Validate file type
  if (!file.type.startsWith('image/')) {
    showNotification('Vui lòng chọn file ảnh hợp lệ', 'error')
    return
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    showNotification('Kích thước file không được vượt quá 5MB', 'error')
    return
  }

  newProductThumbFile.value = file
  newProductThumbFileName.value = file.name

  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    newProductThumbPreview.value = e.target.result
  }
  reader.onerror = () => {
    showNotification('Lỗi khi đọc file', 'error')
  }
  reader.readAsDataURL(file)
}

function cancelAddProduct() {
  showAddProductModal.value = false
  addProductStep.value = 1
  newProduct.value = {
    name: '',
    category: '',
    brand: '',
    basePrice: 0,
    discountPercentage: 0,
    description: '',
    thumbUrl: ''
  }
  newProductVariant.value = {
    memoryId: '',
    colorId: '',
    price: 0,
    stock: 0
  }
  newProductThumbFile.value = null
  newProductThumbFileName.value = ''
  newProductThumbPreview.value = ''
}

// Bước 1 -> Bước 2: Validate thông tin sản phẩm cơ bản
function goToStep2() {
  // Validate thông tin sản phẩm
  if (!newProduct.value.name || !newProduct.value.name.trim()) {
    showNotification('Vui lòng nhập tên sản phẩm', 'warning')
    return
  }
  
  if (!newProduct.value.category) {
    showNotification('Vui lòng chọn danh mục', 'warning')
    return
  }
  
  if (!newProduct.value.brand) {
    showNotification('Vui lòng chọn thương hiệu', 'warning')
    return
  }
  
  if (!newProduct.value.basePrice || newProduct.value.basePrice <= 0) {
    showNotification('Vui lòng nhập giá cơ bản hợp lệ', 'warning')
    return
  }
  
  // Chuyển sang bước 2
  addProductStep.value = 2
}

// Helper function: Tạo slug từ string (giống slugify)
function createSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Thay space bằng -
    .replace(/[^\w\-]+/g, '')    // Xóa ký tự đặc biệt
    .replace(/\-\-+/g, '-')      // Thay -- bằng -
    .replace(/^-+/, '')          // Xóa - ở đầu
    .replace(/-+$/, '')          // Xóa - ở cuối
}

// Tạo sản phẩm mới với ít nhất 1 phiên bản
async function createProductWithVariant() {
  try {
    // Validate variant
    if (!newProductVariant.value.memoryId) {
      showNotification('Vui lòng chọn bộ nhớ cho phiên bản', 'warning')
      return
    }
    
    if (!newProductVariant.value.colorId) {
      showNotification('Vui lòng chọn màu sắc cho phiên bản', 'warning')
      return
    }
    
    if (!newProductVariant.value.price || newProductVariant.value.price <= 0) {
      showNotification('Vui lòng nhập giá phiên bản hợp lệ', 'warning')
      return
    }

    // Bước 1: Tạo sản phẩm (không upload ảnh trước, sẽ upload sau trong trang chi tiết)
    const productName = newProduct.value.name.trim()
    const productData = {
      name: productName,
      slug: createSlug(productName), // ✅ Tạo slug ở frontend
      basePrice: Number(newProduct.value.basePrice),
      discountPercentage: Number(newProduct.value.discountPercentage) || 0,
      brand: newProduct.value.brand,
      category: newProduct.value.category
    }
    
    // Chỉ thêm description nếu có
    if (newProduct.value.description?.trim()) {
      productData.description = newProduct.value.description.trim()
    }

    console.log('📦 Creating product:', productData)
    
    const productRes = await axios.post('http://localhost:3000/api/products', productData)
    
    if (!productRes?.success || !productRes.item?._id) {
      throw new Error('Không thể tạo sản phẩm')
    }

    const newProductId = productRes.item._id
    console.log('✅ Product created:', newProductId)

    // Bước 2: Upload thumb nếu có (sau khi đã có productId)
    if (newProductThumbFile.value) {
      try {
        const formData = new FormData()
        formData.append('image', newProductThumbFile.value)
        
        // ✅ Dùng endpoint riêng để upload thumb cho Product
        const uploadRes = await axios.post(
          `http://localhost:3000/api/products/${newProductId}/upload-thumb`, 
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        )
        
        if (uploadRes?.success) {
          console.log('✅ Thumb uploaded:', uploadRes.thumbUrl)
        }
      } catch (uploadError) {
        console.error('❌ Error uploading thumb:', uploadError)
        console.warn('⚠️ Sản phẩm đã tạo nhưng không upload được ảnh đại diện')
      }
    }

    // Bước 3: Tạo phiên bản đầu tiên
    const variantData = {
      productId: newProductId,
      memoryId: newProductVariant.value.memoryId,
      colorId: newProductVariant.value.colorId,
      price: Number(newProductVariant.value.price),
      stock: Number(newProductVariant.value.stock) || 0
    }

    console.log('📦 Creating variant:', variantData)
    
    // ✅ Sửa endpoint: /api/products/:productId/variants
    const variantRes = await axios.post(`http://localhost:3000/api/products/${newProductId}/variants`, variantData)
    
    if (!variantRes?.success) {
      console.warn('⚠️ Variant creation failed, but product was created')
    } else {
      console.log('✅ Variant created:', variantRes.item)
    }

    // Bước 4: Reload danh sách và chuyển sang trang chi tiết
    await loadProducts()
    
    // Đóng modal và reset form
    cancelAddProduct()
    
    // Hiển thị thông báo thành công
    showNotification('Tạo sản phẩm thành công! Đang chuyển đến trang chi tiết...', 'success')
    
    // Chuyển sang trang chi tiết sản phẩm sau 1 giây
    setTimeout(() => {
      router.push(`/admin/product-detail/${newProductId}`)
    }, 1000)
    
  } catch (error) {
    console.error('❌ Error creating product:', error)
    showNotification('Lỗi khi tạo sản phẩm: ' + (error.response?.data?.message || error.message), 'error')
  }
}



</script>

<style scoped>
table th,
table td {
  text-align: left;
}
</style>

<route lang="yaml">
meta:
  layout: admin
</route>