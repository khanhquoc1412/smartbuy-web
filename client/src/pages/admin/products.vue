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

        <div class="tw-flex tw-gap-2 tw-self-end">
          <button @click="showAddProductModal = true" class="tw-px-4 tw-py-2 tw-bg-crimson-600 tw-text-white tw-rounded-lg hover:tw-bg-crimson-700 tw-transition-colors tw-font-medium">
            + Thêm sản phẩm mới
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
            <tr v-for="product in paginatedProducts" :key="product.id" class="tw-border-b hover:tw-bg-stone-50 tw-transition-colors">
              <td class="tw-p-2 tw-text-center">
                <input type="checkbox" v-model="selected" :value="product.id" />
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
                <button class="tw-text-crimson-600 tw-underline hover:tw-text-crimson-800 tw-transition-colors" @click="goToDetail(product.id)">
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
            <tr v-for="category in filteredCategories" :key="category._id" class="tw-border-b hover:tw-bg-stone-50 tw-transition-colors">
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
            <tr v-for="brand in filteredBrands" :key="brand._id" class="tw-border-b hover:tw-bg-stone-50 tw-transition-colors">
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
            <tr v-for="color in filteredColors" :key="color._id" class="tw-border-b hover:tw-bg-stone-50 tw-transition-colors">
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

import { useRouter } from 'vue-router'
const router = useRouter()

// Tabs
const tabs = ['Sản phẩm', 'Danh mục', 'Thương hiệu', 'Màu sắc']
const activeTab = ref('Sản phẩm')
const categories = ['Điện thoại', 'Phụ kiện điện thoại']

// Bộ lọc
const search = ref('')
const statuses = ['Còn hàng', 'Hết hàng']
const brands = ['Apple', 'Samsung', 'Xiaomi', 'Oppo']

// Dữ liệu thực sự dùng để lọc
const selectedStatuses = ref([])
const selectedBrands = ref([])
const selectedCategories = ref([])
const selectedColors = ref([])

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

// Modal states
const showAddCategoryModal = ref(false)
const showAddBrandModal = ref(false)
const showAddColorModal = ref(false)
const showEditCategoryModal = ref(false)
const showEditBrandModal = ref(false)
const showEditColorModal = ref(false)
const showDeleteConfirmModal = ref(false)

// Delete confirmation
const deleteConfirmMessage = ref('')
const deleteConfirmAction = ref(null)

// Search states
const categorySearch = ref('')
const brandSearch = ref('')
const colorSearch = ref('')

// Editing states
const editingCategory = ref(null)
const editingBrand = ref(null)
const editingColor = ref(null)

// Form data
const newCategory = ref({ name: '', nameAscii: '' })
const newBrand = ref({ name: '', description: '' })
const newColor = ref({ name: '', code: '#000000', description: '' })

const editingCategoryData = ref({ name: '', nameAscii: '' })
const editingBrandData = ref({ name: ''})
const editingColorData = ref({ name: '', code: '#000000'})

onMounted(async () => {
  await loadProducts()
  await loadCategories()
  await loadBrands()
  await loadColors()
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


// Checkbox
const selected = ref([])

// Checkbox cho các tabs (RIÊNG BIỆT với filter)
const selectedCategoryIds = ref([])
const selectedBrandIds = ref([])
const selectedColorIds = ref([])

function toggleAll(event) {
  if (event.target.checked) {
    selected.value = paginatedProducts.value.map(p => p.id)
  } else {
    selected.value = []
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


// Lọc sản phẩm
const filteredProducts = computed(() => {
  return products.value.filter(p => {
    return (
      (!search.value || p.name.toLowerCase().includes(search.value.toLowerCase())) &&
      (selectedStatuses.value.length === 0 || selectedStatuses.value.includes(p.status)) &&
      (selectedBrands.value.length === 0 || selectedBrands.value.includes(p.brand)) &&
      (selectedCategories.value.length === 0 || selectedCategories.value.includes(p.category)
      ))
  })
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

// Phân trang
const page = ref(1)
const perPage = ref(10)
const totalPages = computed(() => Math.ceil(filteredProducts.value.length / perPage.value))

const paginatedProducts = computed(() => {
  const start = (page.value - 1) * perPage.value
  return filteredProducts.value.slice(start, start + perPage.value)
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
function deleteSelected() {
  if (selected.value.length === 0) {
    deleteConfirmMessage.value = 'Chưa chọn sản phẩm để xóa'
    deleteConfirmAction.value = null
    showDeleteConfirmModal.value = true
    return
  }
  deleteConfirmMessage.value = `Bạn có chắc chắn muốn xóa ${selected.value.length} sản phẩm đã chọn?`
  deleteConfirmAction.value = () => {
    products.value = products.value.filter(p => !selected.value.includes(p.id))
    selected.value = []
    showDeleteConfirmModal.value = false
  }
  showDeleteConfirmModal.value = true
}

// Xóa nhiều danh mục
async function deleteSelectedCategories() {
  if (selectedCategoryIds.value.length === 0) {
    deleteConfirmMessage.value = 'Chưa chọn danh mục để xóa'
    deleteConfirmAction.value = null
    showDeleteConfirmModal.value = true
    return
  }
  deleteConfirmMessage.value = `Bạn có chắc chắn muốn xóa ${selectedCategoryIds.value.length} danh mục đã chọn?`
  deleteConfirmAction.value = async () => {
    try {
      for (const id of selectedCategoryIds.value) {
        await axios.delete(`http://localhost:3000/api/categories/${id}`)
      }
      await loadCategories()
      selectedCategoryIds.value = []
      showDeleteConfirmModal.value = false
    } catch (error) {
      console.error('Error deleting categories:', error)
      deleteConfirmMessage.value = 'Lỗi khi xóa danh mục'
      deleteConfirmAction.value = null
    }
  }
  showDeleteConfirmModal.value = true
}

// Xóa nhiều thương hiệu
async function deleteSelectedBrands() {
  if (selectedBrandIds.value.length === 0) {
    deleteConfirmMessage.value = 'Chưa chọn thương hiệu để xóa'
    deleteConfirmAction.value = null
    showDeleteConfirmModal.value = true
    return
  }
  deleteConfirmMessage.value = `Bạn có chắc chắn muốn xóa ${selectedBrandIds.value.length} thương hiệu đã chọn?`
  deleteConfirmAction.value = async () => {
    try {
      for (const id of selectedBrandIds.value) {
        await axios.delete(`http://localhost:3000/api/brands/${id}`)
      }
      await loadBrands()
      selectedBrandIds.value = []
      showDeleteConfirmModal.value = false
    } catch (error) {
      console.error('Error deleting brands:', error)
      deleteConfirmMessage.value = 'Lỗi khi xóa thương hiệu'
      deleteConfirmAction.value = null
    }
  }
  showDeleteConfirmModal.value = true
}

// Xóa nhiều màu sắc
async function deleteSelectedColors() {
  if (selectedColorIds.value.length === 0) {
    deleteConfirmMessage.value = 'Chưa chọn màu sắc để xóa'
    deleteConfirmAction.value = null
    showDeleteConfirmModal.value = true
    return
  }
  deleteConfirmMessage.value = `Bạn có chắc chắn muốn xóa ${selectedColorIds.value.length} màu sắc đã chọn?`
  deleteConfirmAction.value = async () => {
    try {
      for (const id of selectedColorIds.value) {
        await axios.delete(`http://localhost:3000/api/colors/${id}`)
      }
      await loadColors()
      selectedColorIds.value = []
      showDeleteConfirmModal.value = false
    } catch (error) {
      console.error('Error deleting colors:', error)
      deleteConfirmMessage.value = 'Lỗi khi xóa màu sắc'
      deleteConfirmAction.value = null
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

// CRUD Categories
async function addCategory() {
  try {
    const res = await axios.post('http://localhost:3000/api/categories', newCategory.value)
    if (res?.success) {
      await loadCategories()
      showAddCategoryModal.value = false
      newCategory.value = { name: '', nameAscii: '' }
    }
  } catch (error) {
    console.error('Error adding category:', error)
    deleteConfirmMessage.value = 'Lỗi khi thêm danh mục'
    deleteConfirmAction.value = null
    showDeleteConfirmModal.value = true
  }
}

function editCategory(category) {
  editingCategory.value = category._id
  editingCategoryData.value = { name: category.name, nameAscii: category.nameAscii }
  showEditCategoryModal.value = true
}

async function saveCategory(id) {
  try {
    const res = await axios.put(`http://localhost:3000/api/categories/${id}`, editingCategoryData.value)
    if (res?.success) {
      await loadCategories()
      showEditCategoryModal.value = false
      editingCategory.value = null
    }
  } catch (error) {
    console.error('Error updating category:', error)
    deleteConfirmMessage.value = 'Lỗi khi cập nhật danh mục'
    deleteConfirmAction.value = null
    showDeleteConfirmModal.value = true
  }
}

// CRUD Brands
async function addBrand() {
  try {
    const res = await axios.post('http://localhost:3000/api/brands', newBrand.value)
    if (res?.success) {
      await loadBrands()
      showAddBrandModal.value = false
      newBrand.value = { name: ''}
    }
  } catch (error) {
    console.error('Error adding brand:', error)
    deleteConfirmMessage.value = 'Lỗi khi thêm thương hiệu'
    deleteConfirmAction.value = null
    showDeleteConfirmModal.value = true
  }
}

function editBrand(brand) {
  editingBrand.value = brand._id
  editingBrandData.value = { name: brand.name || '' }
  showEditBrandModal.value = true
}

async function saveBrand(id) {
  try {
    const res = await axios.put(`http://localhost:3000/api/brands/${id}`, editingBrandData.value)
    if (res?.success) {
      await loadBrands()
      showEditBrandModal.value = false
      editingBrand.value = null
    }
  } catch (error) {
    console.error('Error updating brand:', error)
    deleteConfirmMessage.value = 'Lỗi khi cập nhật thương hiệu'
    deleteConfirmAction.value = null
    showDeleteConfirmModal.value = true
  }
}

async function deleteBrand(id) {
  deleteConfirmMessage.value = 'Bạn có chắc chắn muốn xóa thương hiệu này?'
  deleteConfirmAction.value = async () => {
    try {
      const res = await axios.delete(`http://localhost:3000/api/brands/${id}`)
      if (res?.success) {
        await loadBrands()
        showDeleteConfirmModal.value = false
      }
    } catch (error) {
      console.error('Error deleting brand:', error)
      deleteConfirmMessage.value = 'Lỗi khi xóa thương hiệu'
      deleteConfirmAction.value = null
    }
  }
  showDeleteConfirmModal.value = true
}

// CRUD Colors
async function addColor() {
  try {
    const res = await axios.post('http://localhost:3000/api/colors', newColor.value)
    if (res?.success) {
      await loadColors()
      showAddColorModal.value = false
      newColor.value = { name: '', code: '#000000', hexCode: '#000000' }
    }
  } catch (error) {
    console.error('Error adding color:', error)
    deleteConfirmMessage.value = 'Lỗi khi thêm màu sắc'
    deleteConfirmAction.value = null
    showDeleteConfirmModal.value = true
  }
}

function editColor(color) {
  editingColor.value = color._id
  editingColorData.value = { name: color.name, code: color.code || '#000000' }
  showEditColorModal.value = true
}

async function saveColor(id) {
  try {
    const res = await axios.put(`http://localhost:3000/api/colors/${id}`, editingColorData.value)
    if (res?.success) {
      await loadColors()
      showEditColorModal.value = false
      editingColor.value = null
    }
  } catch (error) {
    console.error('Error updating color:', error)
    deleteConfirmMessage.value = 'Lỗi khi cập nhật màu sắc'
    deleteConfirmAction.value = null
    showDeleteConfirmModal.value = true
  }
}

async function deleteColor(id) {
  deleteConfirmMessage.value = 'Bạn có chắc chắn muốn xóa màu sắc này?'
  deleteConfirmAction.value = async () => {
    try {
      const res = await axios.delete(`http://localhost:3000/api/colors/${id}`)
      if (res?.success) {
        await loadColors()
        showDeleteConfirmModal.value = false
      }
    } catch (error) {
      console.error('Error deleting color:', error)
      deleteConfirmMessage.value = 'Lỗi khi xóa màu sắc'
      deleteConfirmAction.value = null
    }
  }
  showDeleteConfirmModal.value = true
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