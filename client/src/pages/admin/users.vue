<template>
  <div class="tw-p-6 tw-bg-white tw-min-h-screen">
    <h1 class="tw-text-2xl tw-font-bold tw-text-crimson-600 tw-mb-4">
      Quản lý tài khoản người dùng
    </h1>

    <!-- Statistics Cards -->
    <div class="tw-grid tw-grid-cols-1 lg:tw-grid-cols-3 tw-gap-6 tw-mb-6">
      <!-- Overview Chart -->
      <div class="tw-bg-white tw-p-6 tw-rounded-xl tw-shadow-lg tw-border tw-border-gray-200">
        <h3 class="tw-text-lg tw-font-semibold tw-text-gray-800 tw-mb-4">Tổng quan tài khoản</h3>
        <div class="tw-flex tw-items-center tw-justify-center" style="height: 200px;">
          <canvas ref="overviewChart"></canvas>
        </div>
        <div class="tw-mt-4 tw-text-center">
          <p class="tw-text-3xl tw-font-bold tw-text-blue-600">{{ stats.total || 0 }}</p>
          <p class="tw-text-sm tw-text-gray-600">Tổng số tài khoản</p>
        </div>
      </div>

      <!-- Status Chart -->
      <div class="tw-bg-white tw-p-6 tw-rounded-xl tw-shadow-lg tw-border tw-border-gray-200">
        <h3 class="tw-text-lg tw-font-semibold tw-text-gray-800 tw-mb-4">Trạng thái hoạt động</h3>
        <div class="tw-flex tw-items-center tw-justify-center" style="height: 200px;">
          <canvas ref="statusChart"></canvas>
        </div>
        <div class="tw-grid tw-grid-cols-2 tw-gap-4 tw-mt-4">
          <div class="tw-text-center tw-p-3 tw-bg-green-50 tw-rounded-lg">
            <p class="tw-text-2xl tw-font-bold tw-text-green-600">{{ stats.active || 0 }}</p>
            <p class="tw-text-xs tw-text-gray-600">Hoạt động</p>
          </div>
          <div class="tw-text-center tw-p-3 tw-bg-crimson-50 tw-rounded-lg">
            <p class="tw-text-2xl tw-font-bold tw-text-crimson-600">{{ stats.blocked || 0 }}</p>
            <p class="tw-text-xs tw-text-gray-600">Bị khóa</p>
          </div>
        </div>
      </div>

      <!-- Verification Chart -->
      <div class="tw-bg-white tw-p-6 tw-rounded-xl tw-shadow-lg tw-border tw-border-gray-200">
        <h3 class="tw-text-lg tw-font-semibold tw-text-gray-800 tw-mb-4">Xác thực & Vai trò</h3>
        <div class="tw-flex tw-items-center tw-justify-center" style="height: 200px;">
          <canvas ref="verificationChart"></canvas>
        </div>
        <div class="tw-grid tw-grid-cols-3 tw-gap-2 tw-mt-4">
          <div class="tw-text-center tw-p-2 tw-bg-purple-50 tw-rounded-lg">
            <p class="tw-text-xl tw-font-bold tw-text-purple-600">{{ stats.admin || 0 }}</p>
            <p class="tw-text-xs tw-text-gray-600">Admin</p>
          </div>
          <div class="tw-text-center tw-p-2 tw-bg-emerald-50 tw-rounded-lg">
            <p class="tw-text-xl tw-font-bold tw-text-emerald-600">{{ stats.verified || 0 }}</p>
            <p class="tw-text-xs tw-text-gray-600">Đã xác thực</p>
          </div>
          <div class="tw-text-center tw-p-2 tw-bg-amber-50 tw-rounded-lg">
            <p class="tw-text-xl tw-font-bold tw-text-amber-600">{{ stats.unverified || 0 }}</p>
            <p class="tw-text-xs tw-text-gray-600">Chưa xác thực</p>
          </div>
        </div>
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
          class="tw-flex tw-items-center tw-gap-2 tw-border tw-border-stone-300 tw-px-4 tw-py-2 tw-rounded-lg hover:tw-bg-stone-200 tw-transition-colors tw-bg-white focus:tw-ring-2 focus:tw-ring-crimson-500 focus:tw-border-transparent">
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
          class="tw-flex tw-items-center tw-gap-2 tw-border tw-border-stone-300 tw-px-4 tw-py-2 tw-rounded-lg hover:tw-bg-stone-200 tw-transition-colors tw-bg-white focus:tw-ring-2 focus:tw-ring-crimson-500 focus:tw-border-transparent">
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
        <button @click="openAddUserModal" class="tw-px-4 tw-py-2 tw-bg-green-600 tw-text-white tw-rounded-lg hover:tw-bg-green-700 tw-transition-colors tw-font-medium tw-flex tw-items-center tw-gap-2">
          <svg class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Thêm tài khoản
        </button>
        
        <button @click="bulkBlockUsers" :disabled="selectedUserIds.length === 0"
          class="tw-px-4 tw-py-2 tw-bg-amber-600 tw-text-white tw-rounded-lg hover:tw-bg-amber-700 tw-transition-colors tw-font-medium disabled:tw-opacity-50 disabled:tw-cursor-not-allowed tw-flex tw-items-center tw-gap-2">
          <svg class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Khóa
        </button>
        
        <button @click="bulkUnblockUsers" :disabled="selectedUserIds.length === 0"
          class="tw-px-4 tw-py-2 tw-bg-blue-600 tw-text-white tw-rounded-lg hover:tw-bg-blue-700 tw-transition-colors tw-font-medium disabled:tw-opacity-50 disabled:tw-cursor-not-allowed tw-flex tw-items-center tw-gap-2">
          <svg class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
          </svg>
          Mở khóa
        </button>
        
        <button @click="bulkSetAdmin" :disabled="selectedUserIds.length === 0"
          class="tw-px-4 tw-py-2 tw-bg-purple-600 tw-text-white tw-rounded-lg hover:tw-bg-purple-700 tw-transition-colors tw-font-medium disabled:tw-opacity-50 disabled:tw-cursor-not-allowed tw-flex tw-items-center tw-gap-2">
          <svg class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Cấp Admin
        </button>
        
        <button @click="deleteSelectedUsers" :disabled="selectedUserIds.length === 0"
          class="tw-px-4 tw-py-2 tw-bg-crimson-600 tw-text-white tw-rounded-lg hover:tw-bg-crimson-700 tw-transition-colors tw-font-medium disabled:tw-opacity-50 disabled:tw-cursor-not-allowed tw-flex tw-items-center tw-gap-2">
          <svg class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Xóa
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
            <th class="tw-p-2">Ngày cập nhật</th>
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
                :class="user.isAdmin ? 'tw-bg-green-100 tw-text-green-700' : 'tw-bg-sky-100 tw-text-sky-700'"
              >
                {{ user.isAdmin ? 'Admin' : 'Khách hàng' }}
              </span>
            </td>
            <td class="tw-p-2">
              <span 
                class="tw-px-2 tw-py-1 tw-rounded-full tw-text-xs tw-font-semibold"
                :class="user.isBlocked ? 'tw-bg-crimson-100 tw-text-crimson-700' : 'tw-bg-green-100 tw-text-green-700'"
              >
                {{ user.isBlocked ? 'Bị khóa' : 'Hoạt động' }}
              </span>
            </td>
            <td class="tw-p-2 tw-text-center">
              <span 
                v-if="user.isVerified" 
                class="tw-px-2 tw-py-1 tw-rounded-full tw-text-xs tw-font-semibold tw-bg-green-100 tw-text-green-700"
              >
                ✓ Đã xác thực
              </span>
              <span 
                v-else 
                class="tw-px-2 tw-py-1 tw-rounded-full tw-text-xs tw-font-semibold tw-bg-crimson-100 tw-text-crimson-700"
              >
                ✗ Chưa xác thực
              </span>
            </td>
            <td class="tw-p-2">{{ formatDate(user.createdAt) }}</td>
            <td class="tw-p-2">{{ formatDate(user.updatedAt) }}</td>
            <td class="tw-p-2 tw-text-center">
              <button 
                @click="openEditUserModal(user)" 
                class="tw-px-4 tw-py-2 tw-bg-blue-200 hover:tw-bg-blue-100 tw-text-blue-700 tw-transition-colors tw-rounded-full tw-text-xs tw-font-semibold"
              >
                Chỉnh sửa
              </button>
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
        <button @click="prevPage" :disabled="page === 1" class="tw-px-4 tw-py-2 tw-bg-crimson-600 tw-text-white tw-rounded-lg hover:tw-bg-crimson-700 disabled:tw-bg-gray-300 disabled:tw-cursor-not-allowed">
          Trước
        </button>
        <span class="tw-text-gray-600">Trang {{ page }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="page === totalPages" class="tw-px-4 tw-py-2 tw-bg-crimson-600 tw-text-white tw-rounded-lg hover:tw-bg-crimson-700 disabled:tw-bg-gray-300 disabled:tw-cursor-not-allowed">
          Sau
        </button>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirmModal" class="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-50">
      <div class="tw-bg-white tw-p-6 tw-rounded-lg tw-w-96">
        <h3 class="tw-text-lg tw-font-semibold tw-mb-4 tw-text-crimson-600">Xác nhận xóa tài khoản</h3>
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

    <!-- Edit User Modal -->
    <div v-if="showEditUserModal" class="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-50">
      <div class="tw-bg-white tw-p-6 tw-rounded-lg tw-w-[500px] tw-max-h-[90vh] tw-overflow-y-auto">
        <h3 class="tw-text-lg tw-font-semibold tw-mb-4 tw-text-crimson-600">Chỉnh sửa tài khoản</h3>
        
        <div class="tw-space-y-4">
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">Tên người dùng</label>
            <input 
              v-model="editingUser.userName" 
              type="text" 
              class="tw-w-full tw-border tw-border-stone-300 tw-p-2 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500"
              placeholder="Nhập tên người dùng"
            />
          </div>
          
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">Email</label>
            <input 
              v-model="editingUser.email" 
              type="email" 
              class="tw-w-full tw-border tw-border-stone-300 tw-p-2 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500"
              placeholder="Nhập email"
              disabled
            />
            <p class="tw-text-xs tw-text-gray-500 tw-mt-1">Email không thể thay đổi</p>
          </div>
          
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">Mật khẩu mới (để trống nếu không đổi)</label>
            <input 
              v-model="editingUser.password" 
              type="password" 
              class="tw-w-full tw-border tw-border-stone-300 tw-p-2 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500"
              placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
            />
          </div>
          
          <div class="tw-flex tw-items-center tw-justify-between">
            <label class="tw-text-sm tw-font-medium tw-text-gray-700">Vai trò Admin</label>
            <button 
              @click="editingUser.isAdmin = !editingUser.isAdmin"
              type="button"
              :class="editingUser.isAdmin ? 'tw-bg-green-600' : 'tw-bg-gray-300'"
              class="tw-relative tw-inline-flex tw-h-6 tw-w-11 tw-items-center tw-rounded-full tw-transition-colors focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-green-500 focus:tw-ring-offset-2"
            >
              <span 
                :class="editingUser.isAdmin ? 'tw-translate-x-6' : 'tw-translate-x-1'"
                class="tw-inline-block tw-h-4 tw-w-4 tw-transform tw-rounded-full tw-bg-white tw-transition-transform"
              />
            </button>
          </div>

          <div class="tw-flex tw-items-center tw-justify-between tw-p-3 tw-rounded-lg"
               :class="editingUser.isBlocked ? 'tw-bg-crimson-50' : 'tw-bg-green-50'">
            <div>
              <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700">Trạng thái hoạt động</label>
              <span class="tw-text-xs tw-font-semibold tw-px-2 tw-py-1 tw-rounded-full tw-inline-block tw-mt-1"
                    :class="editingUser.isBlocked ? 'tw-bg-crimson-100 tw-text-crimson-700' : 'tw-bg-green-100 tw-text-green-700'">
                {{ editingUser.isBlocked ? '🔒 Tài khoản đang bị khóa' : '✅ Tài khoản đang hoạt động' }}
              </span>
            </div>
            <button 
              @click="editingUser.isBlocked = !editingUser.isBlocked"
              type="button"
              :class="!editingUser.isBlocked ? 'tw-bg-green-600' : 'tw-bg-crimson-600'"
              class="tw-relative tw-inline-flex tw-h-6 tw-w-11 tw-items-center tw-rounded-full tw-transition-colors focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-green-500 focus:tw-ring-offset-2"
            >
              <span 
                :class="!editingUser.isBlocked ? 'tw-translate-x-6' : 'tw-translate-x-1'"
                class="tw-inline-block tw-h-4 tw-w-4 tw-transform tw-rounded-full tw-bg-white tw-transition-transform"
              />
            </button>
          </div>

          <div class="tw-flex tw-items-center tw-justify-between tw-p-3 tw-rounded-lg"
               :class="editingUser.isVerified ? 'tw-bg-green-50' : 'tw-bg-crimson -50'">
            <div>
              <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700">Trạng thái xác thực</label>
              <span class="tw-text-xs tw-font-semibold tw-px-2 tw-py-1 tw-rounded-full tw-inline-block tw-mt-1"
                    :class="editingUser.isVerified ? 'tw-bg-green-100 tw-text-green-700' : 'tw-bg-crimson-100 tw-text-crimson-700'">
                {{ editingUser.isVerified ? '✓ Email đã được xác thực' : '✗ Email chưa xác thực' }}
              </span>
            </div>
            <button 
              @click="editingUser.isVerified = !editingUser.isVerified"
              type="button"
              :class="editingUser.isVerified ? 'tw-bg-green-600' : 'tw-bg-crimson-600'"
              class="tw-relative tw-inline-flex tw-h-6 tw-w-11 tw-items-center tw-rounded-full tw-transition-colors focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-green-500 focus:tw-ring-offset-2"
            >
              <span 
                :class="editingUser.isVerified ? 'tw-translate-x-6' : 'tw-translate-x-1'"
                class="tw-inline-block tw-h-4 tw-w-4 tw-transform tw-rounded-full tw-bg-white tw-transition-transform"
              />
            </button>
          </div>
        </div>
        
        <div class="tw-flex tw-gap-2 tw-justify-end tw-mt-6">
          <button @click="closeEditUserModal" class="tw-px-4 tw-py-2 tw-bg-stone-300 tw-text-stone-700 tw-rounded-lg hover:tw-bg-stone-400 tw-transition-colors">
            Hủy
          </button>
          <button @click="updateUser" class="tw-px-4 tw-py-2 tw-bg-crimson-600 tw-text-white tw-rounded-lg hover:tw-bg-crimson-700 tw-transition-colors">
            Cập nhật
          </button>
        </div>
      </div>
    </div>

    <!-- Add User Modal -->
    <div v-if="showAddUserModal" class="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-50">
      <div class="tw-bg-white tw-p-6 tw-rounded-lg tw-w-[500px]">
        <h3 class="tw-text-lg tw-font-semibold tw-mb-4 tw-text-crimson-600">Thêm tài khoản mới</h3>
        
        <div class="tw-space-y-4">
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">Tên người dùng</label>
            <input 
              v-model="newUser.userName" 
              type="text" 
              class="tw-w-full tw-border tw-border-stone-300 tw-p-2 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500"
              placeholder="Nhập tên người dùng"
            />
          </div>
          
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">Email</label>
            <input 
              v-model="newUser.email" 
              type="email" 
              class="tw-w-full tw-border tw-border-stone-300 tw-p-2 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500"
              placeholder="Nhập email"
            />
          </div>
          
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">Mật khẩu</label>
            <input 
              v-model="newUser.password" 
              type="password" 
              class="tw-w-full tw-border tw-border-stone-300 tw-p-2 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500"
              placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
            />
          </div>
          
          <div class="tw-flex tw-items-center tw-justify-between">
            <label class="tw-text-sm tw-font-medium tw-text-gray-700">Vai trò Admin</label>
            <button 
              @click="newUser.isAdmin = !newUser.isAdmin"
              type="button"
              :class="newUser.isAdmin ? 'tw-bg-green-600' : 'tw-bg-gray-300'"
              class="tw-relative tw-inline-flex tw-h-6 tw-w-11 tw-items-center tw-rounded-full tw-transition-colors focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-green-500 focus:tw-ring-offset-2"
            >
              <span 
                :class="newUser.isAdmin ? 'tw-translate-x-6' : 'tw-translate-x-1'"
                class="tw-inline-block tw-h-4 tw-w-4 tw-transform tw-rounded-full tw-bg-white tw-transition-transform"
              />
            </button>
          </div>
        </div>
        
        <div class="tw-flex tw-gap-2 tw-justify-end tw-mt-6">
          <button @click="closeAddUserModal" class="tw-px-4 tw-py-2 tw-bg-stone-300 tw-text-stone-700 tw-rounded-lg hover:tw-bg-stone-400 tw-transition-colors">
            Hủy
          </button>
          <button @click="addUser" class="tw-px-4 tw-py-2 tw-bg-crimson-600 tw-text-white tw-rounded-lg hover:tw-bg-crimson-700 tw-transition-colors">
            Thêm
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
                  'tw-text-crimson-500': notificationType === 'success',
                  'tw-text-crimson-600': notificationType === 'error',
                  'tw-text-crimson-400': notificationType === 'warning',
                  'tw-text-crimson-700': notificationType === 'info'
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
import { ref, onMounted, watch, nextTick } from 'vue'
import axios from 'axios'
import { Chart, registerables } from 'chart.js'

// Register Chart.js components
Chart.register(...registerables)

// API Base URL
const API_URL = 'http://localhost:3000/api/users' // Through API Gateway

// Chart refs
const overviewChart = ref(null)
const statusChart = ref(null)
const verificationChart = ref(null)

let overviewChartInstance = null
let statusChartInstance = null
let verificationChartInstance = null

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
const showAddUserModal = ref(false)
const showEditUserModal = ref(false)
const notificationMessage = ref('')
const notificationType = ref('info')
const deleteConfirmMessage = ref('')
const deleteConfirmAction = ref(null)
const newUser = ref({
  userName: '',
  email: '',
  password: '',
  isAdmin: false
})
const editingUser = ref({
  _id: '',
  userName: '',
  email: '',
  password: '',
  isAdmin: false,
  isBlocked: false,
  isVerified: false
})

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
      // Update charts after stats loaded
      await nextTick()
      initCharts()
    }
  } catch (error) {
    console.error('Error loading stats:', error)
  }
}

// Initialize charts
const initCharts = () => {
  // Destroy existing charts
  if (overviewChartInstance) overviewChartInstance.destroy()
  if (statusChartInstance) statusChartInstance.destroy()
  if (verificationChartInstance) verificationChartInstance.destroy()

  // Overview Doughnut Chart
  if (overviewChart.value) {
    const ctx = overviewChart.value.getContext('2d')
    overviewChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Hoạt động', 'Bị khóa'],
        datasets: [{
          data: [stats.value.active || 0, stats.value.blocked || 0],
          backgroundColor: ['#10b981', '#dc2626'],
          borderWidth: 0,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 15,
              font: { size: 12 }
            }
          }
        }
      }
    })
  }

  // Status Bar Chart
  if (statusChart.value) {
    const ctx = statusChart.value.getContext('2d')
    statusChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Hoạt động', 'Bị khóa'],
        datasets: [{
          label: 'Số lượng',
          data: [stats.value.active || 0, stats.value.blocked || 0],
          backgroundColor: ['#10b981', '#dc2626'],
          borderRadius: 8,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 }
          }
        }
      }
    })
  }

  // Verification Pie Chart
  if (verificationChart.value) {
    const ctx = verificationChart.value.getContext('2d')
    verificationChartInstance = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Admin', 'Đã xác thực', 'Chưa xác thực'],
        datasets: [{
          data: [
            stats.value.admin || 0,
            stats.value.verified || 0,
            stats.value.unverified || 0
          ],
          backgroundColor: ['#9333ea', '#10b981', '#f59e0b'],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 10,
              font: { size: 11 }
            }
          }
        }
      }
    })
  }
}

// Watch stats changes
watch(() => stats.value, () => {
  initCharts()
}, { deep: true })

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

  deleteConfirmMessage.value = `Bạn có chắc chắn muốn xóa ${selectedUserIds.value.length} tài khoản đã chọn?`
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
      showNotification(error.response?.data?.message || 'Lỗi xóa tài khoản', 'error')
    }
    showDeleteConfirmModal.value = false
  }
  showDeleteConfirmModal.value = true
}

// Bulk block users
async function bulkBlockUsers() {
  if (selectedUserIds.value.length === 0) {
    showNotification('Vui lòng chọn ít nhất một tài khoản', 'warning')
    return
  }

  deleteConfirmMessage.value = `Bạn có chắc chắn muốn KHÓA ${selectedUserIds.value.length} tài khoản đã chọn?`
  deleteConfirmAction.value = async () => {
    try {
      const response = await axios.patch(`${API_URL}/bulk-block`, {
        ids: selectedUserIds.value,
        isBlocked: true
      })

      if (response.success) {
        showNotification(`Đã khóa ${selectedUserIds.value.length} tài khoản`, 'success')
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

// Bulk unblock users
async function bulkUnblockUsers() {
  if (selectedUserIds.value.length === 0) {
    showNotification('Vui lòng chọn ít nhất một tài khoản', 'warning')
    return
  }

  deleteConfirmMessage.value = `Bạn có chắc chắn muốn MỞ KHÓA ${selectedUserIds.value.length} tài khoản đã chọn?`
  deleteConfirmAction.value = async () => {
    try {
      const response = await axios.patch(`${API_URL}/bulk-block`, {
        ids: selectedUserIds.value,
        isBlocked: false
      })

      if (response.success) {
        showNotification(`Đã mở khóa ${selectedUserIds.value.length} tài khoản`, 'success')
        selectedUserIds.value = []
        await Promise.all([loadUsers(), loadStats()])
      }
    } catch (error) {
      showNotification(error.response?.data?.message || 'Lỗi mở khóa tài khoản', 'error')
    }
    showDeleteConfirmModal.value = false
  }
  showDeleteConfirmModal.value = true
}

// Bulk set admin role
async function bulkSetAdmin() {
  if (selectedUserIds.value.length === 0) {
    showNotification('Vui lòng chọn ít nhất một tài khoản', 'warning')
    return
  }

  deleteConfirmMessage.value = `Bạn có chắc chắn muốn CẤP QUYỀN ADMIN cho ${selectedUserIds.value.length} tài khoản đã chọn?`
  deleteConfirmAction.value = async () => {
    try {
      const response = await axios.patch(`${API_URL}/bulk-admin`, {
        ids: selectedUserIds.value,
        isAdmin: true
      })

      if (response.success) {
        showNotification(`Đã cấp quyền Admin cho ${selectedUserIds.value.length} tài khoản`, 'success')
        selectedUserIds.value = []
        await Promise.all([loadUsers(), loadStats()])
      }
    } catch (error) {
      showNotification(error.response?.data?.message || 'Lỗi cấp quyền Admin', 'error')
    }
    showDeleteConfirmModal.value = false
  }
  showDeleteConfirmModal.value = true
}

// Add user modal
function openAddUserModal() {
  newUser.value = {
    userName: '',
    email: '',
    password: '',
    isAdmin: false
  }
  showAddUserModal.value = true
}

function closeAddUserModal() {
  showAddUserModal.value = false
}

async function addUser() {
  // Validate
  if (!newUser.value.userName || !newUser.value.email || !newUser.value.password) {
    showNotification('Vui lòng điền đầy đủ thông tin', 'warning')
    return
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(newUser.value.email)) {
    showNotification('Email không đúng định dạng', 'warning')
    return
  }

  if (newUser.value.password.length < 6) {
    showNotification('Mật khẩu phải có ít nhất 6 ký tự', 'warning')
    return
  }

  try {
    const response = await axios.post(API_URL, newUser.value)
    
    if (response.success) {
      showNotification(response.message || 'Thêm tài khoản thành công', 'success')
      closeAddUserModal()
      await Promise.all([loadUsers(), loadStats()])
    }
  } catch (error) {
    showNotification(error.response?.data?.message || 'Lỗi thêm tài khoản', 'error')
  }
}

// Edit user modal
function openEditUserModal(user) {
  editingUser.value = {
    _id: user._id,
    userName: user.userName,
    email: user.email,
    password: '',
    isAdmin: user.isAdmin,
    isBlocked: user.isBlocked,
    isVerified: user.isVerified
  }
  showEditUserModal.value = true
}

function closeEditUserModal() {
  showEditUserModal.value = false
}

async function updateUser() {
  // Validate
  if (!editingUser.value.userName) {
    showNotification('Tên người dùng không được để trống', 'warning')
    return
  }

  if (editingUser.value.password && editingUser.value.password.length < 6) {
    showNotification('Mật khẩu phải có ít nhất 6 ký tự', 'warning')
    return
  }

  try {
    const updateData = {
      userName: editingUser.value.userName,
      isAdmin: editingUser.value.isAdmin,
      isBlocked: editingUser.value.isBlocked,
      isVerified: editingUser.value.isVerified
    }

    // Chỉ gửi password nếu có thay đổi
    if (editingUser.value.password) {
      updateData.password = editingUser.value.password
    }

    const response = await axios.put(`${API_URL}/${editingUser.value._id}`, updateData)
    
    if (response.success) {
      showNotification(response.message || 'Cập nhật tài khoản thành công', 'success')
      closeEditUserModal()
      await Promise.all([loadUsers(), loadStats()])
    }
  } catch (error) {
    showNotification(error.response?.data?.message || 'Lỗi cập nhật tài khoản', 'error')
  }
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



