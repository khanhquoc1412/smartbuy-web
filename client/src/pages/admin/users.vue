<template>
  <div class="tw-p-6 tw-bg-white tw-min-h-screen">
    <h1 class="tw-text-2xl tw-font-bold tw-text-crimson-600 tw-mb-4">
      Quản lý tài khoản người dùng
    </h1>

    <!-- Statistics Cards -->
    <div class="tw-grid tw-grid-cols-2 md:tw-grid-cols-4 lg:tw-grid-cols-6 tw-gap-4 tw-mb-6">
      <div class="tw-bg-blue-50 tw-p-4 tw-rounded-lg tw-border tw-border-blue-200">
        <div class="tw-text-sm tw-text-gray-600">Tổng số</div>
        <div class="tw-text-2xl tw-font-bold tw-text-blue-600">{{ stats.total || 0 }}</div>
      </div>
      <div class="tw-bg-green-50 tw-p-4 tw-rounded-lg tw-border tw-border-green-200">
        <div class="tw-text-sm tw-text-gray-600">Hoạt động</div>
        <div class="tw-text-2xl tw-font-bold tw-text-green-600">{{ stats.active || 0 }}</div>
      </div>
      <div class="tw-bg-red-50 tw-p-4 tw-rounded-lg tw-border tw-border-red-200">
        <div class="tw-text-sm tw-text-gray-600">Bị khóa</div>
        <div class="tw-text-2xl tw-font-bold tw-text-red-600">{{ stats.blocked || 0 }}</div>
      </div>
      <div class="tw-bg-purple-50 tw-p-4 tw-rounded-lg tw-border tw-border-purple-200">
        <div class="tw-text-sm tw-text-gray-600">Admin</div>
        <div class="tw-text-2xl tw-font-bold tw-text-purple-600">{{ stats.admin || 0 }}</div>
      </div>
      <div class="tw-bg-emerald-50 tw-p-4 tw-rounded-lg tw-border tw-border-emerald-200">
        <div class="tw-text-sm tw-text-gray-600">Đã xác thực</div>
        <div class="tw-text-2xl tw-font-bold tw-text-emerald-600">{{ stats.verified || 0 }}</div>
      </div>
      <div class="tw-bg-amber-50 tw-p-4 tw-rounded-lg tw-border tw-border-amber-200">
        <div class="tw-text-sm tw-text-gray-600">Chưa xác thực</div>
        <div class="tw-text-2xl tw-font-bold tw-text-amber-600">{{ stats.unverified || 0 }}</div>
      </div>
    </div>

    <!-- Filters -->
    <div class="tw-flex tw-flex-wrap tw-gap-6 tw-mb-4 tw-items-start">
      <input 
        type="text" 
        v-model="search" 
        @input="loadUsers"
        placeholder="Tìm kiếm theo tên hoặc email..." 
        class="tw-border tw-border-stone-300 tw-p-2 tw-rounded-lg tw-w-64 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500 focus:tw-border-transparent" 
      />

      <!-- Filter by status -->
      <div class="tw-relative">
        <button @click="toggleDropdown('status')"
          class="tw-flex tw-items-center tw-gap-2 tw-border tw-border-stone-300 tw-px-4 tw-py-2 tw-rounded-lg hover:tw-bg-stone-50 tw-transition-colors tw-bg-white">
          Trạng thái
          <span :class="openDropdown === 'status' ? 'tw-rotate-180' : ''" class="tw-transition-transform">▼</span>
        </button>

        <div v-if="openDropdown === 'status'" class="tw-absolute tw-mt-2 tw-bg-white tw-shadow-lg tw-border tw-border-stone-200 tw-rounded-lg tw-p-4 tw-z-10 tw-w-64">
          <div class="tw-flex tw-flex-wrap tw-gap-2 tw-mb-4">
            <button v-for="status in statuses" :key="status" @click="toggleStatus(status)"
              class="tw-px-4 tw-py-2 tw-rounded-full tw-border tw-transition-colors" 
              :class="tempStatuses.includes(status)
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

      <!-- Filter by role -->
      <div class="tw-relative">
        <button @click="toggleDropdown('role')"
          class="tw-flex tw-items-center tw-gap-2 tw-border tw-border-stone-300 tw-px-4 tw-py-2 tw-rounded-lg hover:tw-bg-stone-50 tw-transition-colors tw-bg-white">
          Vai trò
          <span :class="openDropdown === 'role' ? 'tw-rotate-180' : ''" class="tw-transition-transform">▼</span>
        </button>

        <div v-if="openDropdown === 'role'" class="tw-absolute tw-mt-2 tw-bg-white tw-shadow-lg tw-border tw-border-stone-200 tw-rounded-lg tw-p-4 tw-z-10 tw-w-64">
          <div class="tw-flex tw-flex-wrap tw-gap-2 tw-mb-4">
            <button v-for="r in roles" :key="r" @click="toggleRole(r)"
              class="tw-px-4 tw-py-2 tw-rounded-full tw-border tw-transition-colors" 
              :class="tempRoles.includes(r)
                ? 'tw-bg-crimson-600 tw-text-white tw-border-crimson-600'
                : 'tw-bg-white tw-text-stone-700 tw-border-stone-300 hover:tw-bg-stone-50'">
              {{ r }}
            </button>
          </div>
          <div class="tw-flex tw-justify-between">
            <button @click="closeDropdown" class="tw-px-4 tw-py-2 tw-bg-stone-200 tw-text-stone-700 tw-rounded-lg hover:tw-bg-stone-300 tw-transition-colors tw-border tw-border-stone-300">Đóng</button>
            <button @click="applyFilters" class="tw-px-4 tw-py-2 tw-bg-crimson-600 tw-text-white tw-rounded-lg hover:tw-bg-crimson-700 tw-transition-colors">Xem kết quả</button>
          </div>
        </div>
      </div>

      <div class="tw-flex tw-gap-2 tw-self-end">
        <button @click="deleteSelectedUsers" class="tw-px-4 tw-py-2 tw-bg-crimson-600 tw-text-white tw-rounded-lg hover:tw-bg-crimson-700 tw-transition-colors tw-font-medium">
          - Khóa tài khoản
        </button>
      </div>
    </div>

    <!-- Users Table -->
    <div class="tw-overflow-x-auto">
      <table class="tw-min-w-full tw-border">
        <thead class="tw-bg-crimson-600 tw-text-white">
          <tr>
            <th class="tw-p-2"><input type="checkbox" @change="toggleAll($event)" /></th>
            <th class="tw-p-2">Ảnh đại diện</th>
            <th class="tw-p-2">Tên người dùng</th>
            <th class="tw-p-2">Email</th>
            <th class="tw-p-2">Vai trò</th>
            <th class="tw-p-2">Trạng thái</th>
            <th class="tw-p-2">Xác thực</th>
            <th class="tw-p-2">Ngày tạo</th>
            <th class="tw-p-2">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user._id" class="tw-border-b hover:tw-bg-stone-50 tw-transition-colors">
            <td class="tw-p-2 tw-text-center">
              <input type="checkbox" v-model="selectedUserIds" :value="user._id" />
            </td>
            <td class="tw-p-2 tw-text-center">
              <img 
                :src="user.avatarUrl || 'https://via.placeholder.com/40'" 
                :alt="user.userName"
                class="tw-w-10 tw-h-10 tw-rounded-full tw-object-cover tw-mx-auto"
              />
            </td>
            <td class="tw-p-2">{{ user.userName }}</td>
            <td class="tw-p-2">{{ user.email }}</td>
            <td class="tw-p-2">
              <span 
                class="tw-px-2 tw-py-1 tw-rounded-full tw-text-xs tw-font-semibold"
                :class="user.isAdmin ? 'tw-bg-purple-100 tw-text-purple-700' : 'tw-bg-gray-100 tw-text-gray-700'"
              >
                {{ user.isAdmin ? 'Admin' : 'Khách hàng' }}
              </span>
            </td>
            <td class="tw-p-2">
              <span 
                class="tw-px-2 tw-py-1 tw-rounded-full tw-text-xs tw-font-semibold"
                :class="user.isBlocked ? 'tw-bg-red-100 tw-text-red-700' : 'tw-bg-green-100 tw-text-green-700'"
              >
                {{ user.isBlocked ? 'Bị khóa' : 'Hoạt động' }}
              </span>
            </td>
            <td class="tw-p-2 tw-text-center">
              <span v-if="user.isVerified" class="tw-text-green-600">✓</span>
              <span v-else class="tw-text-gray-400">✗</span>
            </td>
            <td class="tw-p-2">{{ formatDate(user.createdAt) }}</td>
            <td class="tw-p-2">
              <div class="tw-flex tw-gap-2">
                <button 
                  @click="toggleBlockUser(user)" 
                  :class="user.isBlocked ? 'tw-text-green-600 hover:tw-text-green-800' : 'tw-text-red-600 hover:tw-text-red-800'"
                  class="tw-transition-colors tw-font-medium"
                >
                  {{ user.isBlocked ? 'Mở khóa' : 'Khóa' }}
                </button>
                <button 
                  @click="toggleAdminRole(user)" 
                  class="tw-text-purple-600 hover:tw-text-purple-800 tw-transition-colors tw-font-medium"
                >
                  {{ user.isAdmin ? 'Gỡ Admin' : 'Set Admin' }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="tw-flex tw-justify-between tw-items-center tw-mt-4">
      <div>Hàng trên mỗi trang:
        <select v-model="perPage" @change="loadUsers" class="tw-border tw-border-stone-300 tw-p-1 tw-rounded-lg tw-ml-2 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500 focus:tw-border-transparent">
          <option v-for="n in [5, 10, 20, 50]" :key="n" :value="n">{{ n }}</option>
        </select>
      </div>
      <div class="tw-flex tw-gap-2 tw-items-center">
        <button @click="prevPage" :disabled="page === 1"
          class="tw-px-2 tw-py-1 tw-border tw-border-stone-300 tw-rounded-md hover:tw-bg-stone-50 tw-transition-colors disabled:tw-opacity-50 disabled:tw-cursor-not-allowed">&lt;</button>
        <span>Trang {{ page }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="page >= totalPages"
          class="tw-px-2 tw-py-1 tw-border tw-border-stone-300 tw-rounded-md hover:tw-bg-stone-50 tw-transition-colors disabled:tw-opacity-50 disabled:tw-cursor-not-allowed">&gt;</button>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirmModal" class="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-50">
      <div class="tw-bg-white tw-p-6 tw-rounded-lg tw-w-96">
        <h3 class="tw-text-lg tw-font-semibold tw-mb-4 tw-text-crimson-600">Xác nhận khóa tài khoản</h3>
        <p class="tw-text-stone-700 tw-mb-6">{{ deleteConfirmMessage }}</p>
        <div class="tw-flex tw-gap-2 tw-justify-end">
          <button @click="showDeleteConfirmModal = false" class="tw-px-4 tw-py-2 tw-bg-stone-300 tw-text-stone-700 tw-rounded-lg hover:tw-bg-stone-400 tw-transition-colors">
            Hủy
          </button>
          <button @click="confirmDelete" class="tw-px-4 tw-py-2 tw-bg-crimson-600 tw-text-white tw-rounded-lg hover:tw-bg-crimson-700 tw-transition-colors">
            Khóa
          </button>
        </div>
      </div>
    </div>

    <!-- Notification Modal -->
    <div v-if="showNotificationModal" class="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-[60]">
      <div class="tw-bg-white tw-p-6 tw-rounded-lg tw-w-96 tw-shadow-xl">
        <div class="tw-flex tw-items-start tw-gap-3">
          <div class="tw-flex-1">
            <h3 class="tw-text-lg tw-font-semibold tw-mb-2" 
                :class="{
                  'tw-text-emerald-600': notificationType === 'success',
                  'tw-text-crimson-600': notificationType === 'error',
                  'tw-text-amber-600': notificationType === 'warning',
                  'tw-text-blue-600': notificationType === 'info'
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
                  class="tw-px-4 tw-py-2 tw-bg-crimson-600 tw-text-white tw-rounded-lg hover:tw-bg-crimson-700 tw-transition-colors tw-font-medium">
            Đóng
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// API Base URL
const API_URL = 'http://localhost:3000/api/users' // Through API Gateway

// State
const users = ref([])
const stats = ref({})
const selectedUserIds = ref([])
const search = ref('')
const page = ref(1)
const perPage = ref(10)
const totalPages = ref(1)

// Filters
const statuses = ['Hoạt động', 'Bị khóa']
const roles = ['Admin', 'Khách hàng']
const selectedStatuses = ref([])
const selectedRoles = ref([])
const tempStatuses = ref([])
const tempRoles = ref([])
const openDropdown = ref(null)

// Modals
const showDeleteConfirmModal = ref(false)
const showNotificationModal = ref(false)
const notificationMessage = ref('')
const notificationType = ref('info')
const deleteConfirmMessage = ref('')
const deleteConfirmAction = ref(null)

// Load users from API
const loadUsers = async () => {
  try {
    const params = {
      page: page.value,
      limit: perPage.value,
      search: search.value,
      status: selectedStatuses.value,
      role: selectedRoles.value
    }

    const response = await axios.get(API_URL, { params })
    
    // ✅ interceptors đã return response.data, nên response chính là data
    if (response.success) {
      users.value = response.items
      totalPages.value = response.pagination.totalPages
    }
  } catch (error) {
    console.error('Error loading users:', error)
    showNotification(error.response?.data?.message || 'Lỗi tải danh sách người dùng', 'error')
  }
}

// Load stats
const loadStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/stats`)
    // ✅ interceptors đã return response.data
    if (response.success) {
      stats.value = response.data
    }
  } catch (error) {
    console.error('Error loading stats:', error)
  }
}

// Filter functions
function toggleDropdown(type) {
  openDropdown.value = openDropdown.value === type ? null : type
  if (type === 'status') tempStatuses.value = [...selectedStatuses.value]
  if (type === 'role') tempRoles.value = [...selectedRoles.value]
}

function closeDropdown() {
  openDropdown.value = null
}

function toggleStatus(status) {
  const idx = tempStatuses.value.indexOf(status)
  if (idx === -1) tempStatuses.value.push(status)
  else tempStatuses.value.splice(idx, 1)
}

function toggleRole(role) {
  const idx = tempRoles.value.indexOf(role)
  if (idx === -1) tempRoles.value.push(role)
  else tempRoles.value.splice(idx, 1)
}

function applyFilters() {
  selectedStatuses.value = [...tempStatuses.value]
  selectedRoles.value = [...tempRoles.value]
  page.value = 1
  openDropdown.value = null
  loadUsers()
}

// Toggle all checkbox
function toggleAll(event) {
  if (event.target.checked) {
    selectedUserIds.value = users.value.map(u => u._id)
  } else {
    selectedUserIds.value = []
  }
}

// Delete selected users
function deleteSelectedUsers() {
  if (selectedUserIds.value.length === 0) {
    showNotification('Vui lòng chọn ít nhất một tài khoản', 'warning')
    return
  }

  deleteConfirmMessage.value = `Bạn có chắc chắn muốn khóa ${selectedUserIds.value.length} tài khoản đã chọn?`
  deleteConfirmAction.value = async () => {
    try {
      const response = await axios.delete(API_URL, {
        data: { ids: selectedUserIds.value }
      })

      // ✅ interceptors đã return response.data
      if (response.success) {
        showNotification(response.message, 'success')
        selectedUserIds.value = []
        await Promise.all([loadUsers(), loadStats()])
      }
    } catch (error) {
      showNotification(error.response?.data?.message || 'Lỗi khóa tài khoản', 'error')
    }
    showDeleteConfirmModal.value = false
  }
  showDeleteConfirmModal.value = true
}

function confirmDelete() {
  if (deleteConfirmAction.value) {
    deleteConfirmAction.value()
  }
}

// Toggle block user
async function toggleBlockUser(user) {
  try {
    const response = await axios.patch(`${API_URL}/${user._id}/toggle-block`)
    
    // ✅ interceptors đã return response.data
    if (response.success) {
      showNotification(response.message, 'success')
      await Promise.all([loadUsers(), loadStats()])
    }
  } catch (error) {
    showNotification(error.response?.data?.message || 'Lỗi thay đổi trạng thái', 'error')
  }
}

// Toggle admin role
async function toggleAdminRole(user) {
  try {
    const response = await axios.patch(`${API_URL}/${user._id}/toggle-admin`)
    
    // ✅ interceptors đã return response.data
    if (response.success) {
      showNotification(response.message, 'success')
      await Promise.all([loadUsers(), loadStats()])
    }
  } catch (error) {
    showNotification(error.response?.data?.message || 'Lỗi thay đổi quyền', 'error')
  }
}

// Pagination
function prevPage() {
  if (page.value > 1) {
    page.value--
    loadUsers()
  }
}

function nextPage() {
  if (page.value < totalPages.value) {
    page.value++
    loadUsers()
  }
}

// Helper functions
function formatDate(date) {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('vi-VN')
}

function showNotification(message, type = 'info') {
  notificationMessage.value = message
  notificationType.value = type
  showNotificationModal.value = true
}

// Initialize
onMounted(async () => {
  await Promise.all([loadUsers(), loadStats()])
})
</script>

<route lang="yaml">
name: Admin Users
meta:
  layout: admin
  requiresAuth: true
  adminOnly: true
</route>

<style scoped>
table th,
table td {
  text-align: left;
}
</style>



