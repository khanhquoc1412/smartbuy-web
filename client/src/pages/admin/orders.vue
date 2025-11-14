<template>
  <div class="tw-p-6 tw-bg-white tw-min-h-screen">
    <h1 class="tw-text-2xl tw-font-bold tw-text-crimson-600 tw-mb-4">
      Quản lý đơn hàng
    </h1>

    <!-- KPI Cards -->
    <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-5 tw-gap-4 tw-mb-6">
      <div class="tw-bg-white tw-p-4 tw-rounded-xl tw-shadow-md tw-border tw-border-gray-200">
        <div class="tw-flex tw-items-center tw-justify-between">
          <div>
            <p class="tw-text-sm tw-text-gray-600">Tổng đơn hôm nay</p>
            <p class="tw-text-2xl tw-font-bold tw-text-crimson-600">{{ stats.todayOrders || 0 }}</p>
          </div>
          <div class="tw-bg-crimson-100 tw-p-3 tw-rounded-full">
            <svg class="tw-w-6 tw-h-6 tw-text-crimson-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="tw-bg-white tw-p-4 tw-rounded-xl tw-shadow-md tw-border tw-border-gray-200">
        <div class="tw-flex tw-items-center tw-justify-between">
          <div>
            <p class="tw-text-sm tw-text-gray-600">Doanh thu hôm nay</p>
            <p class="tw-text-2xl tw-font-bold tw-text-green-600">{{ formatCurrency(stats.todayRevenue || 0) }}</p>
          </div>
          <div class="tw-bg-green-100 tw-p-3 tw-rounded-full">
            <svg class="tw-w-6 tw-h-6 tw-text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="tw-bg-white tw-p-4 tw-rounded-xl tw-shadow-md tw-border tw-border-gray-200">
        <div class="tw-flex tw-items-center tw-justify-between">
          <div>
            <p class="tw-text-sm tw-text-gray-600">Đang giao hàng</p>
            <p class="tw-text-2xl tw-font-bold tw-text-blue-600">{{ stats.shippingOrders || 0 }}</p>
          </div>
          <div class="tw-bg-blue-100 tw-p-3 tw-rounded-full">
            <svg class="tw-w-6 tw-h-6 tw-text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
          </div>
        </div>
      </div>

      <div class="tw-bg-white tw-p-4 tw-rounded-xl tw-shadow-md tw-border tw-border-gray-200">
        <div class="tw-flex tw-items-center tw-justify-between">
          <div>
            <p class="tw-text-sm tw-text-gray-600">Chờ xử lý</p>
            <p class="tw-text-2xl tw-font-bold tw-text-orange-600">{{ stats.pendingOrders || 0 }}</p>
          </div>
          <div class="tw-bg-orange-100 tw-p-3 tw-rounded-full">
            <svg class="tw-w-6 tw-h-6 tw-text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="tw-bg-white tw-p-4 tw-rounded-xl tw-shadow-md tw-border tw-border-gray-200">
        <div class="tw-flex tw-items-center tw-justify-between">
          <div>
            <p class="tw-text-sm tw-text-gray-600">Tỉ lệ hoàn thành</p>
            <p class="tw-text-2xl tw-font-bold tw-text-purple-600">{{ stats.completionRate || 0 }}%</p>
          </div>
          <div class="tw-bg-purple-100 tw-p-3 tw-rounded-full">
            <svg class="tw-w-6 tw-h-6 tw-text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts -->
    <div class="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-6 tw-mb-6">
      <!-- Revenue Chart -->
      <div class="tw-bg-white tw-p-6 tw-rounded-xl tw-shadow-lg tw-border tw-border-gray-200">
        <h3 class="tw-text-lg tw-font-semibold tw-text-gray-800 tw-mb-4">Doanh thu 7 ngày gần nhất</h3>
        <div class="tw-h-64">
          <canvas ref="revenueChart"></canvas>
        </div>
      </div>

      <!-- Status Chart -->
      <div class="tw-bg-white tw-p-6 tw-rounded-xl tw-shadow-lg tw-border tw-border-gray-200">
        <h3 class="tw-text-lg tw-font-semibold tw-text-gray-800 tw-mb-4">Đơn hàng theo trạng thái</h3>
        <div class="tw-h-64">
          <canvas ref="statusChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="tw-flex tw-justify-between tw-items-center tw-mb-4">
      <input 
        type="text" 
        v-model="search" 
        @keyup.enter="loadOrders"
        placeholder="Tìm kiếm theo mã đơn, tên khách hàng (Enter để tìm)..." 
        class="tw-border tw-border-stone-300 tw-p-2 tw-rounded-lg tw-w-80 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500 focus:tw-border-transparent" 
      />

      <div class="tw-flex tw-gap-2">
        <button @click="loadOrders" class="tw-px-4 tw-py-2 tw-bg-blue-600 tw-text-white tw-rounded-lg hover:tw-bg-blue-700 tw-transition-colors tw-font-medium">
          <svg class="tw-inline tw-w-5 tw-h-5 tw-mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <button @click="resetFilters" class="tw-px-3 tw-py-1 tw-text-sm tw-bg-white tw-border tw-border-stone-300 tw-rounded-lg hover:tw-bg-stone-100 tw-transition-colors tw-flex tw-items-center tw-gap-2">
          <svg class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Đặt lại bộ lọc
        </button>
      </div>

      <div class="tw-flex tw-flex-wrap tw-gap-3">
        <!-- Filter by Order Status -->
        <div class="tw-relative">
          <button @click="toggleDropdown('orderStatus')"
            class="tw-px-4 tw-py-2 tw-bg-white tw-border tw-border-stone-300 tw-rounded-lg hover:tw-bg-stone-50 tw-transition-colors tw-flex tw-items-center tw-gap-2 tw-min-w-[180px]">
            <span class="tw-font-medium">Trạng thái đơn</span>
            <span v-if="selectedOrderStatuses.length > 0" class="tw-bg-crimson-100 tw-text-crimson-600 tw-px-2 tw-py-0.5 tw-rounded-full tw-text-xs">{{ selectedOrderStatuses.length }}</span>
            <svg class="tw-w-4 tw-h-4 tw-ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div v-if="openDropdown === 'orderStatus'" class="tw-absolute tw-mt-2 tw-bg-white tw-shadow-lg tw-border tw-border-stone-200 tw-rounded-lg tw-p-4 tw-z-10 tw-w-64">
            <div class="tw-space-y-2 tw-mb-3">
              <label v-for="status in orderStatuses" :key="status.value" class="tw-flex tw-items-center tw-gap-2 tw-cursor-pointer hover:tw-bg-stone-50 tw-p-2 tw-rounded">
                <input type="checkbox" :checked="tempOrderStatuses.includes(status.value)" @change="toggleOrderStatus(status.value)" class="tw-w-4 tw-h-4 tw-text-crimson-600 focus:tw-ring-2 focus:tw-ring-crimson-500">
                <span :class="status.color">{{ status.label }}</span>
              </label>
            </div>
            <div class="tw-flex tw-gap-2 tw-pt-2 tw-border-t">
              <button @click="applyFilters" class="tw-flex-1 tw-px-3 tw-py-1.5 tw-bg-crimson-600 tw-text-white tw-rounded hover:tw-bg-crimson-700 tw-text-sm tw-font-medium">Áp dụng</button>
              <button @click="closeDropdown" class="tw-flex-1 tw-px-3 tw-py-1.5 tw-bg-stone-200 tw-rounded hover:tw-bg-stone-300 tw-text-sm tw-font-medium">Hủy</button>
            </div>
          </div>
        </div>

        <!-- Filter by Payment Status -->
        <div class="tw-relative">
          <button @click="toggleDropdown('paymentStatus')"
            class="tw-px-4 tw-py-2 tw-bg-white tw-border tw-border-stone-300 tw-rounded-lg hover:tw-bg-stone-50 tw-transition-colors tw-flex tw-items-center tw-gap-2 tw-min-w-[180px]">
            <span class="tw-font-medium">Thanh toán</span>
            <span v-if="selectedPaymentStatuses.length > 0" class="tw-bg-crimson-100 tw-text-crimson-600 tw-px-2 tw-py-0.5 tw-rounded-full tw-text-xs">{{ selectedPaymentStatuses.length }}</span>
            <svg class="tw-w-4 tw-h-4 tw-ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div v-if="openDropdown === 'paymentStatus'" class="tw-absolute tw-mt-2 tw-bg-white tw-shadow-lg tw-border tw-border-stone-200 tw-rounded-lg tw-p-4 tw-z-10 tw-w-64">
            <div class="tw-space-y-2 tw-mb-3">
              <label v-for="status in paymentStatuses" :key="status.value" class="tw-flex tw-items-center tw-gap-2 tw-cursor-pointer hover:tw-bg-stone-50 tw-p-2 tw-rounded">
                <input type="checkbox" :checked="tempPaymentStatuses.includes(status.value)" @change="togglePaymentStatus(status.value)" class="tw-w-4 tw-h-4 tw-text-crimson-600 focus:tw-ring-2 focus:tw-ring-crimson-500">
                <span :class="status.color">{{ status.label }}</span>
              </label>
            </div>
            <div class="tw-flex tw-gap-2 tw-pt-2 tw-border-t">
              <button @click="applyFilters" class="tw-flex-1 tw-px-3 tw-py-1.5 tw-bg-crimson-600 tw-text-white tw-rounded hover:tw-bg-crimson-700 tw-text-sm tw-font-medium">Áp dụng</button>
              <button @click="closeDropdown" class="tw-flex-1 tw-px-3 tw-py-1.5 tw-bg-stone-200 tw-rounded hover:tw-bg-stone-300 tw-text-sm tw-font-medium">Hủy</button>
            </div>
          </div>
        </div>

        <!-- Filter by Date Range -->
        <div class="tw-flex tw-gap-2 tw-items-center">
          <input type="date" v-model="dateFrom" @change="loadOrders" class="tw-border tw-border-stone-300 tw-p-2 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500">
          <span class="tw-text-stone-600">đến</span>
          <input type="date" v-model="dateTo" @change="loadOrders" class="tw-border tw-border-stone-300 tw-p-2 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500">
        </div>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="tw-overflow-x-auto">
      <table class="tw-min-w-full tw-border">
        <thead class="tw-bg-crimson-600 tw-text-white">
          <tr>
            <th class="tw-px-4 tw-py-3 tw-text-left">
              <input type="checkbox" @change="toggleAll" class="tw-w-4 tw-h-4 tw-text-crimson-600 focus:tw-ring-2 focus:tw-ring-crimson-500">
            </th>
            <th class="tw-px-4 tw-py-3 tw-text-left">Mã đơn hàng</th>
            <th class="tw-px-4 tw-py-3 tw-text-left">Khách hàng</th>
            <th class="tw-px-4 tw-py-3 tw-text-left">Tổng tiền</th>
            <th class="tw-px-4 tw-py-3 tw-text-left">Ngày đặt</th>
            <th class="tw-px-4 tw-py-3 tw-text-left">Trạng thái đơn</th>
            <th class="tw-px-4 tw-py-3 tw-text-left">Thanh toán</th>
            <th class="tw-px-4 tw-py-3 tw-text-left">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in paginatedOrders" :key="order._id" class="tw-border-b hover:tw-bg-stone-50 tw-transition-colors">
            <td class="tw-px-4 tw-py-3">
              <input type="checkbox" :value="order._id" v-model="selectedOrderIds" class="tw-w-4 tw-h-4 tw-text-crimson-600 focus:tw-ring-2 focus:tw-ring-crimson-500">
            </td>
            <td class="tw-px-4 tw-py-3 tw-font-mono tw-text-sm">{{ order.orderNumber }}</td>
            <td class="tw-px-4 tw-py-3">
              <div class="tw-font-medium">{{ order.shippingAddress?.fullName || 'N/A' }}</div>
              <div class="tw-text-sm tw-text-gray-600">{{ order.shippingAddress?.phone || '' }}</div>
            </td>
            <td class="tw-px-4 tw-py-3 tw-font-semibold tw-text-crimson-600">{{ formatCurrency(order.totalPrice) }}</td>
            <td class="tw-px-4 tw-py-3 tw-text-sm tw-text-gray-600">{{ formatDate(order.createdAt) }}</td>
            <td class="tw-px-4 tw-py-3">
              <span :class="getOrderStatusClass(order.status)" class="tw-px-2 tw-py-1 tw-rounded-full tw-text-xs tw-font-medium">
                {{ getOrderStatusLabel(order.status) }}
              </span>
            </td>
            <td class="tw-px-4 tw-py-3">
              <span :class="getPaymentStatusClass(order.paymentStatus)" class="tw-px-2 tw-py-1 tw-rounded-full tw-text-xs tw-font-medium">
                {{ getPaymentStatusLabel(order.paymentStatus) }}
              </span>
            </td>
            <td class="tw-px-4 tw-py-3">
              <div class="tw-flex tw-gap-2">
                <button @click="viewOrderDetail(order)" class="tw-px-3 tw-py-1 tw-bg-blue-600 tw-text-white tw-rounded hover:tw-bg-blue-700 tw-text-sm">
                  Chi tiết
                </button>
                <button @click="openChangeStatusModal(order)" class="tw-px-3 tw-py-1 tw-bg-orange-600 tw-text-white tw-rounded hover:tw-bg-orange-700 tw-text-sm">
                  Đổi trạng thái
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
        <select v-model="perPage" @change="loadOrders" class="tw-border tw-border-stone-300 tw-p-1 tw-rounded-lg tw-ml-2 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500 focus:tw-border-transparent">
          <option :value="10">10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
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

    <!-- Order Detail Modal -->
    <div v-if="showOrderDetailModal" class="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-50 tw-overflow-y-auto">
      <div class="tw-bg-white tw-rounded-lg tw-w-[900px] tw-max-h-[90vh] tw-overflow-y-auto tw-m-4">
        <div class="tw-sticky tw-top-0 tw-bg-white tw-border-b tw-p-6 tw-flex tw-justify-between tw-items-center">
          <h2 class="tw-text-xl tw-font-bold tw-text-crimson-600">Chi tiết đơn hàng: {{ selectedOrder?.orderNumber }}</h2>
          <button @click="closeOrderDetailModal" class="tw-text-gray-500 hover:tw-text-gray-700">
            <svg class="tw-w-6 tw-h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="tw-p-6">
          <!-- Customer Info -->
          <div class="tw-mb-6">
            <h3 class="tw-text-lg tw-font-semibold tw-mb-3 tw-text-gray-800">1️⃣ Thông tin khách hàng</h3>
            <div class="tw-bg-stone-50 tw-p-4 tw-rounded-lg tw-grid tw-grid-cols-2 tw-gap-4">
              <div>
                <p class="tw-text-sm tw-text-gray-600">Họ tên:</p>
                <p class="tw-font-medium">{{ selectedOrder?.shippingAddress?.fullName }}</p>
              </div>
              <div>
                <p class="tw-text-sm tw-text-gray-600">Số điện thoại:</p>
                <p class="tw-font-medium">{{ selectedOrder?.shippingAddress?.phone }}</p>
              </div>
              <div class="tw-col-span-2">
                <p class="tw-text-sm tw-text-gray-600">Địa chỉ giao hàng:</p>
                <p class="tw-font-medium">
                  {{ selectedOrder?.shippingAddress?.address }}, {{ selectedOrder?.shippingAddress?.ward }}, 
                  {{ selectedOrder?.shippingAddress?.district }}, {{ selectedOrder?.shippingAddress?.province }}
                </p>
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div class="tw-mb-6">
            <h3 class="tw-text-lg tw-font-semibold tw-mb-3 tw-text-gray-800">2️⃣ Danh sách sản phẩm</h3>
            <table class="tw-w-full tw-border">
              <thead class="tw-bg-gray-100">
                <tr>
                  <th class="tw-px-4 tw-py-2 tw-text-left">Ảnh</th>
                  <th class="tw-px-4 tw-py-2 tw-text-left">Tên sản phẩm</th>
                  <th class="tw-px-4 tw-py-2 tw-text-center">Số lượng</th>
                  <th class="tw-px-4 tw-py-2 tw-text-right">Đơn giá</th>
                  <th class="tw-px-4 tw-py-2 tw-text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in selectedOrder?.orderItems" :key="item._id" class="tw-border-b">
                  <td class="tw-px-4 tw-py-2">
                    <img :src="item.image || '/placeholder.png'" :alt="item.name" class="tw-w-16 tw-h-16 tw-object-cover tw-rounded">
                  </td>
                  <td class="tw-px-4 tw-py-2">
                    <p class="tw-font-medium">{{ item.name }}</p>
                    <p v-if="item.variant?.color || item.variant?.memory" class="tw-text-sm tw-text-gray-600">
                      {{ item.variant?.color }} - {{ item.variant?.memory }}
                    </p>
                  </td>
                  <td class="tw-px-4 tw-py-2 tw-text-center">{{ item.qty }}</td>
                  <td class="tw-px-4 tw-py-2 tw-text-right">{{ formatCurrency(item.price) }}</td>
                  <td class="tw-px-4 tw-py-2 tw-text-right tw-font-semibold">{{ formatCurrency(item.price * item.qty) }}</td>
                </tr>
              </tbody>
              <tfoot class="tw-bg-gray-50">
                <tr>
                  <td colspan="4" class="tw-px-4 tw-py-2 tw-text-right tw-font-medium">Tổng tiền hàng:</td>
                  <td class="tw-px-4 tw-py-2 tw-text-right tw-font-semibold">{{ formatCurrency(selectedOrder?.itemsPrice || 0) }}</td>
                </tr>
                <tr>
                  <td colspan="4" class="tw-px-4 tw-py-2 tw-text-right tw-font-medium">Phí vận chuyển:</td>
                  <td class="tw-px-4 tw-py-2 tw-text-right">{{ formatCurrency(selectedOrder?.shippingPrice || 0) }}</td>
                </tr>
                <tr v-if="selectedOrder?.discountAmount > 0">
                  <td colspan="4" class="tw-px-4 tw-py-2 tw-text-right tw-font-medium">Giảm giá ({{ selectedOrder?.couponCode }}):</td>
                  <td class="tw-px-4 tw-py-2 tw-text-right tw-text-crimson-600">-{{ formatCurrency(selectedOrder?.discountAmount || 0) }}</td>
                </tr>
                <tr class="tw-bg-crimson-50">
                  <td colspan="4" class="tw-px-4 tw-py-2 tw-text-right tw-font-bold tw-text-lg">Tổng cộng:</td>
                  <td class="tw-px-4 tw-py-2 tw-text-right tw-font-bold tw-text-lg tw-text-crimson-600">{{ formatCurrency(selectedOrder?.totalPrice || 0) }}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <!-- Payment Info -->
          <div class="tw-mb-6">
            <h3 class="tw-text-lg tw-font-semibold tw-mb-3 tw-text-gray-800">3️⃣ Thông tin thanh toán</h3>
            <div class="tw-bg-stone-50 tw-p-4 tw-rounded-lg tw-grid tw-grid-cols-2 tw-gap-4">
              <div>
                <p class="tw-text-sm tw-text-gray-600">Phương thức:</p>
                <p class="tw-font-medium">{{ selectedOrder?.paymentMethod }}</p>
              </div>
              <div>
                <p class="tw-text-sm tw-text-gray-600">Trạng thái:</p>
                <span :class="getPaymentStatusClass(selectedOrder?.paymentStatus)" class="tw-px-2 tw-py-1 tw-rounded-full tw-text-xs tw-font-medium">
                  {{ getPaymentStatusLabel(selectedOrder?.paymentStatus) }}
                </span>
              </div>
              <div v-if="selectedOrder?.paymentResult?.transactionId" class="tw-col-span-2">
                <p class="tw-text-sm tw-text-gray-600">Mã giao dịch:</p>
                <p class="tw-font-mono tw-text-sm">{{ selectedOrder?.paymentResult?.transactionId }}</p>
              </div>
            </div>
          </div>

          <!-- Status History -->
          <div class="tw-mb-6">
            <h3 class="tw-text-lg tw-font-semibold tw-mb-3 tw-text-gray-800">4️⃣ Nhật ký trạng thái</h3>
            <div class="tw-space-y-3">
              <div v-for="(history, index) in selectedOrder?.statusHistory" :key="index" class="tw-flex tw-gap-4 tw-items-start">
                <div class="tw-flex tw-flex-col tw-items-center">
                  <div :class="[
                    'tw-w-3 tw-h-3 tw-rounded-full',
                    index === 0 ? 'tw-bg-crimson-600' : 'tw-bg-gray-400'
                  ]"></div>
                  <div v-if="index < selectedOrder.statusHistory.length - 1" class="tw-w-0.5 tw-h-12 tw-bg-gray-300"></div>
                </div>
                <div class="tw-flex-1 tw-pb-4">
                  <div class="tw-flex tw-justify-between tw-items-start">
                    <div>
                      <span :class="getOrderStatusClass(history.status)" class="tw-px-2 tw-py-1 tw-rounded-full tw-text-xs tw-font-medium">
                        {{ getOrderStatusLabel(history.status) }}
                      </span>
                      <p v-if="history.note" class="tw-text-sm tw-text-gray-600 tw-mt-1">{{ translateStatusInNote(history.note) }}</p>
                    </div>
                    <span class="tw-text-sm tw-text-gray-600">{{ formatDateTime(history.timestamp) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div v-if="selectedOrder?.notes || selectedOrder?.cancelReason" class="tw-mb-4">
            <h3 class="tw-text-lg tw-font-semibold tw-mb-3 tw-text-gray-800">Ghi chú</h3>
            <div class="tw-bg-amber-50 tw-p-4 tw-rounded-lg">
              <p v-if="selectedOrder?.notes" class="tw-text-sm">{{ selectedOrder.notes }}</p>
              <p v-if="selectedOrder?.cancelReason" class="tw-text-sm tw-text-crimson-600 tw-font-medium">Lý do hủy: {{ selectedOrder.cancelReason }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Change Status Modal -->
    <div v-if="showChangeStatusModal" class="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-50">
      <div class="tw-bg-white tw-p-6 tw-rounded-lg tw-w-[500px]">
        <h2 class="tw-text-xl tw-font-bold tw-text-crimson-600 tw-mb-4">Thay đổi trạng thái đơn hàng</h2>
        
        <div class="tw-mb-4">
          <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">Mã đơn hàng</label>
          <p class="tw-font-mono tw-text-sm tw-bg-gray-100 tw-p-2 tw-rounded">{{ selectedOrder?.orderNumber }}</p>
        </div>

        <div class="tw-mb-4">
          <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">Trạng thái hiện tại</label>
          <span :class="getOrderStatusClass(selectedOrder?.status)" class="tw-px-3 tw-py-1 tw-rounded-full tw-text-sm tw-font-medium">
            {{ getOrderStatusLabel(selectedOrder?.status) }}
          </span>
        </div>

        <div class="tw-mb-4">
          <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">Trạng thái mới *</label>
          <select v-model="newOrderStatus" class="tw-w-full tw-border tw-border-gray-300 tw-rounded-lg tw-p-2 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500">
            <option value="">-- Chọn trạng thái --</option>
            <option v-for="status in orderStatuses" :key="status.value" :value="status.value">
              {{ status.label }}
            </option>
          </select>
        </div>

        <div class="tw-mb-4">
          <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">Ghi chú</label>
          <textarea v-model="statusChangeNote" rows="3" class="tw-w-full tw-border tw-border-gray-300 tw-rounded-lg tw-p-2 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500" placeholder="Nhập ghi chú (không bắt buộc)"></textarea>
        </div>

        <div class="tw-flex tw-gap-3">
          <button @click="confirmChangeStatus" class="tw-flex-1 tw-px-4 tw-py-2 tw-bg-crimson-600 tw-text-white tw-rounded-lg hover:tw-bg-crimson-700 tw-font-medium">
            Xác nhận
          </button>
          <button @click="closeChangeStatusModal" class="tw-flex-1 tw-px-4 tw-py-2 tw-bg-gray-300 tw-text-gray-700 tw-rounded-lg hover:tw-bg-gray-400 tw-font-medium">
            Hủy
          </button>
        </div>
      </div>
    </div>

    <!-- Notification Modal -->
    <div v-if="showNotificationModal" class="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-[60]">
      <div class="tw-bg-white tw-p-6 tw-rounded-lg tw-w-96 tw-shadow-xl">
        <div class="tw-flex tw-items-center tw-gap-3 tw-mb-4">
          <div :class="[
            'tw-w-12 tw-h-12 tw-rounded-full tw-flex tw-items-center tw-justify-center',
            notificationType === 'success' ? 'tw-bg-green-100' : '',
            notificationType === 'error' ? 'tw-bg-crimson-100' : '',
            notificationType === 'warning' ? 'tw-bg-amber-100' : '',
            notificationType === 'info' ? 'tw-bg-blue-100' : ''
          ]">
            <svg class="tw-w-6 tw-h-6" :class="[
              notificationType === 'success' ? 'tw-text-green-600' : '',
              notificationType === 'error' ? 'tw-text-crimson-600' : '',
              notificationType === 'warning' ? 'tw-text-amber-600' : '',
              notificationType === 'info' ? 'tw-text-blue-600' : ''
            ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="notificationType === 'success'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              <path v-else-if="notificationType === 'error'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              <path v-else-if="notificationType === 'warning'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="tw-text-lg tw-font-semibold tw-text-gray-800">
            {{ notificationType === 'success' ? 'Thành công' : notificationType === 'error' ? 'Lỗi' : notificationType === 'warning' ? 'Cảnh báo' : 'Thông báo' }}
          </h3>
        </div>
        <p class="tw-text-gray-700 tw-mb-6">{{ notificationMessage }}</p>
        <button @click="showNotificationModal = false" class="tw-w-full tw-px-4 tw-py-2 tw-bg-crimson-600 tw-text-white tw-rounded-lg hover:tw-bg-crimson-700 tw-font-medium">
          Đóng
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import axios from 'axios'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

// API Base URL
const API_URL = 'http://localhost:3000/api/orders'

// Chart refs
const revenueChart = ref(null)
const statusChart = ref(null)
let revenueChartInstance = null
let statusChartInstance = null

// State
const orders = ref([])
const stats = ref({})
const selectedOrderIds = ref([])
const search = ref('')
const page = ref(1)
const perPage = ref(10)
const totalPages = ref(1)

// Filters
const orderStatuses = [
  { value: 'pending_payment', label: 'Chờ thanh toán', color: 'tw-text-purple-600' },
  { value: 'payment_failed', label: 'Thanh toán thất bại', color: 'tw-text-crimson-600' },
  { value: 'pending', label: 'Chờ xác nhận', color: 'tw-text-amber-600' },
  { value: 'confirmed', label: 'Đã xác nhận', color: 'tw-text-blue-600' },
  { value: 'processing', label: 'Đang chuẩn bị', color: 'tw-text-indigo-600' },
  { value: 'ready_to_ship', label: 'Sẵn sàng giao', color: 'tw-text-cyan-600' },
  { value: 'shipping', label: 'Đang giao', color: 'tw-text-orange-600' },
  { value: 'delivered', label: 'Đã giao', color: 'tw-text-teal-600' },
  { value: 'completed', label: 'Hoàn thành', color: 'tw-text-green-600' },
  { value: 'cancelled', label: 'Đã hủy', color: 'tw-text-crimson-600' },
  { value: 'returned', label: 'Đã trả hàng', color: 'tw-text-gray-600' }
]

const paymentStatuses = [
  { value: 'unpaid', label: 'Chưa thanh toán', color: 'tw-text-gray-600' },
  { value: 'paid', label: 'Đã thanh toán', color: 'tw-text-green-600' },
  { value: 'refunded', label: 'Đã hoàn tiền', color: 'tw-text-blue-600' },
  { value: 'failed', label: 'Thất bại', color: 'tw-text-crimson-600' }
]

const selectedOrderStatuses = ref([])
const selectedPaymentStatuses = ref([])
const tempOrderStatuses = ref([])
const tempPaymentStatuses = ref([])
const openDropdown = ref(null)

// Date filters
const dateFrom = ref('')
const dateTo = ref('')

// Modals
const showOrderDetailModal = ref(false)
const showChangeStatusModal = ref(false)
const showNotificationModal = ref(false)
const notificationMessage = ref('')
const notificationType = ref('info')

// Selected order
const selectedOrder = ref(null)
const newOrderStatus = ref('')
const statusChangeNote = ref('')

// Load orders
const loadOrders = async () => {
  try {
    const params = {
      page: page.value,
      limit: perPage.value,
      search: search.value,
      orderStatus: selectedOrderStatuses.value,
      paymentStatus: selectedPaymentStatuses.value,
      dateFrom: dateFrom.value,
      dateTo: dateTo.value
    }

    const response = await axios.get(API_URL, { params })
    
    if (response.success) {
      orders.value = response.items || []
      totalPages.value = response.pagination?.totalPages || 1
    }
  } catch (error) {
    console.error('Error loading orders:', error)
    showNotification(error.response?.data?.message || 'Lỗi tải danh sách đơn hàng', 'error')
  }
}

// Load stats
const loadStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/stats`)
    
    if (response.success) {
      stats.value = response.data
      // Update chart data if charts already exist
      if (revenueChartInstance && statusChartInstance) {
        updateChartData()
      }
    }
  } catch (error) {
    console.error('Error loading stats:', error)
  }
}

// Initialize charts - CHỈ GỌI MỘT LẦN
const initCharts = () => {
  // Revenue Chart
  if (revenueChart.value && !revenueChartInstance) {
    const ctx = revenueChart.value.getContext('2d')
    revenueChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Doanh thu',
          data: [],
          borderColor: '#dc143c',
          backgroundColor: 'rgba(220, 20, 60, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) {
                return 'Doanh thu: ' + new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(context.parsed.y)
              }
            }
          }
        },
        scales: {
          y: { 
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return new Intl.NumberFormat('vi-VN', { notation: 'compact', compactDisplay: 'short' }).format(value) + 'đ'
              }
            }
          }
        }
      }
    })
  }

  // Status Chart
  if (statusChart.value && !statusChartInstance) {
    const ctx = statusChart.value.getContext('2d')
    statusChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [
            '#fbbf24', '#3b82f6', '#6366f1', '#06b6d4', 
            '#f97316', '#14b8a6', '#10b981', '#ef4444', '#6b7280',
            '#a855f7', '#ec4899'
          ],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { 
            position: 'bottom',
            labels: {
              padding: 12,
              font: { size: 11 }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.label + ': ' + context.parsed + ' đơn'
              }
            }
          }
        }
      }
    })
  }

  // Update chart data
  updateChartData()
}

// Update chart data without recreating
const updateChartData = () => {
  if (revenueChartInstance && stats.value.revenueChart) {
    revenueChartInstance.data.labels = stats.value.revenueChart.labels || []
    revenueChartInstance.data.datasets[0].data = stats.value.revenueChart.data || []
    revenueChartInstance.update('none') // 'none' mode = no animation
  }

  if (statusChartInstance && stats.value.statusChart) {
    statusChartInstance.data.labels = stats.value.statusChart.labels || []
    statusChartInstance.data.datasets[0].data = stats.value.statusChart.data || []
    statusChartInstance.update('none')
  }
}

// Filter functions
function toggleDropdown(type) {
  openDropdown.value = openDropdown.value === type ? null : type
  if (type === 'orderStatus') tempOrderStatuses.value = [...selectedOrderStatuses.value]
  if (type === 'paymentStatus') tempPaymentStatuses.value = [...selectedPaymentStatuses.value]
}

function closeDropdown() {
  openDropdown.value = null
}

function toggleOrderStatus(status) {
  const idx = tempOrderStatuses.value.indexOf(status)
  if (idx === -1) tempOrderStatuses.value.push(status)
  else tempOrderStatuses.value.splice(idx, 1)
}

function togglePaymentStatus(status) {
  const idx = tempPaymentStatuses.value.indexOf(status)
  if (idx === -1) tempPaymentStatuses.value.push(status)
  else tempPaymentStatuses.value.splice(idx, 1)
}

function applyFilters() {
  selectedOrderStatuses.value = [...tempOrderStatuses.value]
  selectedPaymentStatuses.value = [...tempPaymentStatuses.value]
  page.value = 1
  openDropdown.value = null
  loadOrders()
}

function resetFilters() {
  selectedOrderStatuses.value = []
  selectedPaymentStatuses.value = []
  tempOrderStatuses.value = []
  tempPaymentStatuses.value = []
  dateFrom.value = ''
  dateTo.value = ''
  search.value = ''
  openDropdown.value = null
  loadOrders()
}

// Pagination
function prevPage() {
  if (page.value > 1) {
    page.value--
    loadOrders()
  }
}

function nextPage() {
  if (page.value < totalPages.value) {
    page.value++
    loadOrders()
  }
}

// Toggle all checkbox
function toggleAll(event) {
  if (event.target.checked) {
    selectedOrderIds.value = paginatedOrders.value.map(o => o._id)
  } else {
    selectedOrderIds.value = []
  }
}

// Computed
const paginatedOrders = computed(() => orders.value)

// View order detail
function viewOrderDetail(order) {
  selectedOrder.value = order
  showOrderDetailModal.value = true
}

function closeOrderDetailModal() {
  showOrderDetailModal.value = false
  selectedOrder.value = null
}

// Change status
function openChangeStatusModal(order) {
  selectedOrder.value = order
  newOrderStatus.value = ''
  statusChangeNote.value = ''
  showChangeStatusModal.value = true
}

function closeChangeStatusModal() {
  showChangeStatusModal.value = false
  selectedOrder.value = null
  newOrderStatus.value = ''
  statusChangeNote.value = ''
}

async function confirmChangeStatus() {
  if (!newOrderStatus.value) {
    showNotification('Vui lòng chọn trạng thái mới', 'warning')
    return
  }

  try {
    const response = await axios.patch(`${API_URL}/${selectedOrder.value._id}/status`, {
      status: newOrderStatus.value,
      note: statusChangeNote.value
    })

    if (response.success) {
      showNotification('Cập nhật trạng thái thành công', 'success')
      closeChangeStatusModal()
      await Promise.all([loadOrders(), loadStats()])
    }
  } catch (error) {
    showNotification(error.response?.data?.message || 'Lỗi cập nhật trạng thái', 'error')
  }
}

// Helper functions
function getOrderStatusLabel(status) {
  return orderStatuses.find(s => s.value === status)?.label || status
}

function getOrderStatusClass(status) {
  const statusMap = {
    pending_payment: 'tw-bg-purple-100 tw-text-purple-600',
    payment_failed: 'tw-bg-crimson-100 tw-text-crimson-600',
    pending: 'tw-bg-amber-100 tw-text-amber-600',
    confirmed: 'tw-bg-blue-100 tw-text-blue-600',
    processing: 'tw-bg-indigo-100 tw-text-indigo-600',
    ready_to_ship: 'tw-bg-cyan-100 tw-text-cyan-600',
    shipping: 'tw-bg-orange-100 tw-text-orange-600',
    delivered: 'tw-bg-teal-100 tw-text-teal-600',
    completed: 'tw-bg-green-100 tw-text-green-600',
    cancelled: 'tw-bg-crimson-100 tw-text-crimson-600',
    returned: 'tw-bg-gray-100 tw-text-gray-600'
  }
  return statusMap[status] || 'tw-bg-gray-100 tw-text-gray-600'
}

function getPaymentStatusLabel(status) {
  return paymentStatuses.find(s => s.value === status)?.label || status
}

function getPaymentStatusClass(status) {
  const statusMap = {
    unpaid: 'tw-bg-gray-100 tw-text-gray-600',
    paid: 'tw-bg-green-100 tw-text-green-600',
    refunded: 'tw-bg-blue-100 tw-text-blue-600',
    failed: 'tw-bg-crimson-100 tw-text-crimson-600'
  }
  return statusMap[status] || 'tw-bg-gray-100 tw-text-gray-600'
}

function formatCurrency(val) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0)
}

function formatDate(date) {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('vi-VN')
}

function formatDateTime(date) {
  if (!date) return 'N/A'
  return new Date(date).toLocaleString('vi-VN')
}

function translateStatusInNote(note) {
  if (!note) return note
  
  const statusTranslations = {
    'pending': 'chờ xác nhận',
    'confirmed': 'đã xác nhận',
    'processing': 'đang chuẩn bị',
    'ready_to_ship': 'sẵn sàng giao',
    'shipping': 'đang giao',
    'delivered': 'đã giao',
    'completed': 'hoàn thành',
    'cancelled': 'đã hủy',
    'pending_payment': 'chờ thanh toán',
    'payment_failed': 'thanh toán thất bại',
    'returned': 'đã trả hàng'
  }
  
  let translatedNote = note
  Object.keys(statusTranslations).forEach(key => {
    const regex = new RegExp(key, 'gi')
    translatedNote = translatedNote.replace(regex, statusTranslations[key])
  })
  
  return translatedNote
}

function showNotification(message, type = 'info') {
  notificationMessage.value = message
  notificationType.value = type
  showNotificationModal.value = true
}

// Initialize
onMounted(async () => {
  await Promise.all([loadOrders(), loadStats()])
  // Chỉ init charts MỘT LẦN sau khi load xong data (giống dashboard.vue)
  await nextTick()
  initCharts()
})
</script>

<route lang="yaml">
name: Admin Orders
meta:
  layout: admin
  requiresAuth: true
  adminOnly: true
  path: /admin/orders
</route>

<style scoped>
table th,
table td {
  text-align: left;
}
</style>



