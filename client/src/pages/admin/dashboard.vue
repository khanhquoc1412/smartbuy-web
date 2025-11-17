<template>
  <div class="tw-p-6 tw-bg-gray-50 tw-min-h-screen">
    <!-- Header -->
    <div class="tw-mb-6 tw-flex tw-items-center tw-justify-between">
      <div>
        <h1 class="tw-text-3xl tw-font-bold tw-text-crimson-600">Dashboard</h1>
      </div>
      
      <!-- Date Range Filter -->
      <div class="tw-flex tw-gap-2">
        <button 
          v-for="range in dateRanges" 
          :key="range.value"
          @click="dateRange = range.value as '7days' | '30days' | '90days' | 'year'; fetchAllData()"
          :class="[
            'tw-px-4 tw-py-2 tw-rounded-lg tw-text-sm tw-font-medium tw-transition-all',
            dateRange === range.value 
              ? 'tw-bg-crimson-600 tw-text-white tw-shadow-md' 
              : 'tw-bg-white tw-text-gray-700 tw-border tw-border-gray-300 hover:tw-border-crimson-500'
          ]"
        >
          {{ range.label }}
        </button>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="tw-space-y-6 tw-mb-6">
      <!-- First Row: Total Revenue and Total Orders -->
      <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-6">
        <!-- Total Revenue -->
        <div class="tw-bg-gradient-to-br tw-from-green-500 tw-to-slate-600 tw-rounded-xl tw-shadow-lg tw-p-6 tw-border-0 hover:tw-shadow-xl tw-transition-shadow">
          <div class="tw-flex tw-items-center tw-justify-between">
            <div class="tw-flex-1 tw-mr-4">
              <p class="tw-text-sm tw-font-medium tw-text-white/90 tw-mb-1">Tổng Doanh Thu</p>
              <h3 class="tw-text-2xl tw-font-bold tw-text-white tw-break-words">{{ formatCurrency(overview.totalRevenue) }}</h3>
            </div>
            <div class="tw-w-14 tw-h-14 tw-bg-white/20 tw-rounded-xl tw-flex tw-items-center tw-justify-center tw-flex-shrink-0">
              <svg class="tw-w-7 tw-h-7 tw-text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Total Orders -->
        <div class="tw-bg-gradient-to-br tw-from-blue-500 tw-to-slate-600 tw-rounded-xl tw-shadow-lg tw-p-6 tw-border-0 hover:tw-shadow-xl tw-transition-shadow">
          <div class="tw-flex tw-items-center tw-justify-between">
            <div class="tw-flex-1 tw-mr-4">
              <p class="tw-text-sm tw-font-medium tw-text-white/90 tw-mb-1">Tổng Đơn Hàng</p>
              <h3 class="tw-text-3xl tw-font-bold tw-text-white">{{ overview.totalOrders?.toLocaleString() || 0 }}</h3>
            </div>
            <div class="tw-w-14 tw-h-14 tw-bg-white/20 tw-rounded-xl tw-flex tw-items-center tw-justify-center tw-flex-shrink-0">
              <svg class="tw-w-7 tw-h-7 tw-text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Second Row: Average Order Value and New Customers -->
      <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-6">
        <!-- Average Order Value -->
        <div class="tw-bg-gradient-to-br tw-from-orange-500 tw-to-slate-600 tw-rounded-xl tw-shadow-lg tw-p-6 tw-border-0 hover:tw-shadow-xl tw-transition-shadow">
          <div class="tw-flex tw-items-center tw-justify-between">
            <div class="tw-flex-1 tw-mr-4">
              <p class="tw-text-sm tw-font-medium tw-text-white/90 tw-mb-1">Giá Trị TB/Đơn</p>
              <h3 class="tw-text-2xl tw-font-bold tw-text-white tw-break-words">{{ formatCurrency(overview.avgOrderValue) }}</h3>
            </div>
            <div class="tw-w-14 tw-h-14 tw-bg-white/20 tw-rounded-xl tw-flex tw-items-center tw-justify-center tw-flex-shrink-0">
              <svg class="tw-w-7 tw-h-7 tw-text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- New Customers -->
        <div class="tw-bg-gradient-to-br tw-from-purple-500 tw-to-slate-600 tw-rounded-xl tw-shadow-lg tw-p-6 tw-border-0 hover:tw-shadow-xl tw-transition-shadow">
          <div class="tw-flex tw-items-center tw-justify-between">
            <div class="tw-flex-1 tw-mr-4">
              <p class="tw-text-sm tw-font-medium tw-text-white/90 tw-mb-1">Khách Hàng Mới</p>
              <h3 class="tw-text-3xl tw-font-bold tw-text-white">{{ overview.newCustomers?.toLocaleString() || 0 }}</h3>
            </div>
            <div class="tw-w-14 tw-h-14 tw-bg-white/20 tw-rounded-xl tw-flex tw-items-center tw-justify-center tw-flex-shrink-0">
              <svg class="tw-w-7 tw-h-7 tw-text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="tw-grid tw-grid-cols-1 lg:tw-grid-cols-3 tw-gap-6">
      
      <!-- Left Column - 2/3 width -->
      <div class="lg:tw-col-span-2 tw-space-y-6">
        
        <!-- Revenue Timeline Chart -->
        <div class="tw-bg-white tw-rounded-xl tw-shadow-sm tw-p-6 tw-border tw-border-gray-200">
          <h3 class="tw-text-lg tw-font-semibold tw-text-gray-800 tw-mb-4">📈 Doanh Thu Theo Thời Gian</h3>
          <div class="tw-h-[320px]">
            <canvas ref="revenueChartRef"></canvas>
          </div>
        </div>

        <!-- Order Status & Payment Methods -->
        <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-6">
          <!-- Order Status -->
          <div class="tw-bg-white tw-rounded-xl tw-shadow-sm tw-p-6 tw-border tw-border-gray-200">
            <h3 class="tw-text-lg tw-font-semibold tw-text-gray-800 tw-mb-4">📦 Trạng Thái Đơn Hàng</h3>
            <div class="tw-h-[250px] tw-flex tw-items-center tw-justify-center">
              <canvas ref="orderStatusChartRef"></canvas>
            </div>
          </div>

          <!-- Payment Methods -->
          <div class="tw-bg-white tw-rounded-xl tw-shadow-sm tw-p-6 tw-border tw-border-gray-200">
            <h3 class="tw-text-lg tw-font-semibold tw-text-gray-800 tw-mb-4">💳 Phương Thức Thanh Toán</h3>
            <div class="tw-h-[250px] tw-flex tw-items-center tw-justify-center">
              <canvas ref="paymentChartRef"></canvas>
            </div>
          </div>
        </div>

        <!-- Top Selling Products -->
        <div class="tw-bg-white tw-rounded-xl tw-shadow-sm tw-p-6 tw-border tw-border-gray-200">
          <h3 class="tw-text-lg tw-font-semibold tw-text-gray-800 tw-mb-4">🔥 Top Sản Phẩm Bán Chạy</h3>
          <div class="tw-overflow-x-auto">
            <table class="tw-w-full">
              <thead>
                <tr class="tw-border-b tw-border-gray-200">
                  <th class="tw-text-left tw-py-3 tw-px-2 tw-text-sm tw-font-semibold tw-text-gray-700">Sản phẩm</th>
                  <th class="tw-text-center tw-py-3 tw-px-2 tw-text-sm tw-font-semibold tw-text-gray-700">Đã bán</th>
                  <th class="tw-text-right tw-py-3 tw-px-2 tw-text-sm tw-font-semibold tw-text-gray-700">Doanh thu</th>
                  <th class="tw-text-center tw-py-3 tw-px-2 tw-text-sm tw-font-semibold tw-text-gray-700">Tồn kho</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(product, index) in topProducts" :key="product._id" class="tw-border-b tw-border-gray-100 hover:tw-bg-gray-50 tw-transition-colors">
                  <td class="tw-py-3 tw-px-2">
                    <div class="tw-flex tw-items-center tw-gap-3">
                      <div class="tw-flex-shrink-0 tw-w-8 tw-h-8 tw-bg-crimson-100 tw-rounded-lg tw-flex tw-items-center tw-justify-center tw-text-crimson-600 tw-font-bold tw-text-sm">
                        #{{ index + 1 }}
                      </div>
                      <img :src="getImageUrl(product.image)" :alt="product.name" class="tw-w-12 tw-h-12 tw-object-cover tw-rounded-lg" @error="handleImageError" />
                      <div>
                        <div class="tw-text-sm tw-font-medium tw-text-gray-900">{{ product.name }}</div>
                        <div class="tw-text-xs tw-text-gray-500">{{ product.category }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="tw-py-3 tw-px-2 tw-text-center tw-text-sm tw-font-semibold tw-text-gray-900">{{ product.sold?.toLocaleString() || 0 }}</td>
                  <td class="tw-py-3 tw-px-2 tw-text-right tw-text-sm tw-font-semibold tw-text-green-600">{{ formatCurrency(product.revenue) }}</td>
                  <td class="tw-py-3 tw-px-2 tw-text-center">
                    <span :class="[
                      'tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-font-medium',
                      product.stock > 10 ? 'tw-bg-green-100 tw-text-green-700' : 
                      product.stock > 0 ? 'tw-bg-amber-100 tw-text-amber-700' : 
                      'tw-bg-crimson-100 tw-text-crimson-700'
                    ]">
                      {{ product.stock || 0 }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <!-- Right Column - 1/3 width -->
      <div class="tw-space-y-6">
        
        <!-- Product Overview -->
        <div class="tw-bg-gradient-to-br tw-from-crimson-600 tw-to-purple-600 tw-rounded-xl tw-shadow-lg tw-p-6 tw-text-white">
          <div class="tw-flex tw-items-center tw-gap-3 tw-mb-4">
            <div class="tw-w-12 tw-h-12 tw-bg-white/20 tw-rounded-xl tw-flex tw-items-center tw-justify-center tw-flex-shrink-0">
              <svg class="tw-w-6 tw-h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
            </div>
            <h3 class="tw-text-lg tw-font-semibold">Sản Phẩm</h3>
          </div>
          <div class="tw-space-y-3">
            <div class="tw-flex tw-justify-between tw-items-center">
              <span class="tw-text-sm tw-opacity-90">Tổng sản phẩm</span>
              <span class="tw-text-2xl tw-font-bold">{{ productOverview.totalProducts }}</span>
            </div>
            <div class="tw-flex tw-justify-between tw-items-center">
              <span class="tw-text-sm tw-opacity-90">Danh mục</span>
              <span class="tw-text-2xl tw-font-bold">{{ productOverview.totalCategories }}</span>
            </div>
            <div class="tw-flex tw-justify-between tw-items-center">
              <span class="tw-text-sm tw-opacity-90">Biến thể</span>
              <span class="tw-text-2xl tw-font-bold">{{ productOverview.totalVariants }}</span>
            </div>
            <div class="tw-flex tw-justify-between tw-items-center tw-pt-3 tw-border-t tw-border-white/20">
              <span class="tw-text-sm tw-opacity-90">Giá trị tồn kho</span>
              <span class="tw-text-lg tw-font-bold tw-break-all">{{ formatCurrency(productOverview.totalInventoryValue) }}</span>
            </div>
          </div>
        </div>

        <!-- Customer Overview -->
        <div class="tw-bg-white tw-rounded-xl tw-shadow-sm tw-p-6 tw-border tw-border-gray-200">
          <div class="tw-flex tw-items-center tw-gap-3 tw-mb-4">
            <div class="tw-w-10 tw-h-10 tw-bg-purple-100 tw-rounded-lg tw-flex tw-items-center tw-justify-center tw-flex-shrink-0">
              <svg class="tw-w-6 tw-h-6 tw-text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="tw-text-lg tw-font-semibold tw-text-gray-800">Khách Hàng</h3>
          </div>
          <div class="tw-space-y-4">
            <div class="tw-flex tw-justify-between tw-items-center">
              <span class="tw-text-sm tw-text-gray-600">Tổng khách hàng</span>
              <span class="tw-text-xl tw-font-bold tw-text-gray-900">{{ customerOverview.totalUsers?.toLocaleString() }}</span>
            </div>
            <div class="tw-flex tw-justify-between tw-items-center">
              <span class="tw-text-sm tw-text-gray-600">Đã xác thực</span>
              <span class="tw-text-lg tw-font-semibold tw-text-green-600">{{ customerOverview.verifiedUsers?.toLocaleString() }}</span>
            </div>
            <div class="tw-flex tw-justify-between tw-items-center">
              <span class="tw-text-sm tw-text-gray-600">Mới trong kỳ</span>
              <span class="tw-text-lg tw-font-semibold tw-text-blue-600">{{ customerOverview.newUsers?.toLocaleString() }}</span>
            </div>
            <div class="tw-flex tw-justify-between tw-items-center tw-pt-3 tw-border-t tw-border-gray-200">
              <span class="tw-text-sm tw-text-gray-600">Admin</span>
              <span class="tw-text-lg tw-font-semibold tw-text-purple-600">{{ customerOverview.adminUsers?.toLocaleString() }}</span>
            </div>
          </div>
        </div>

        <!-- Inventory Status -->
        <div class="tw-bg-white tw-rounded-xl tw-shadow-sm tw-p-6 tw-border tw-border-gray-200">
          <div class="tw-flex tw-items-center tw-gap-3 tw-mb-4">
            <div class="tw-w-10 tw-h-10 tw-bg-blue-100 tw-rounded-lg tw-flex tw-items-center tw-justify-center tw-flex-shrink-0">
              <svg class="tw-w-6 tw-h-6 tw-text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 class="tw-text-lg tw-font-semibold tw-text-gray-800">Tình Trạng Kho</h3>
          </div>
          <div class="tw-space-y-3">
            <div class="tw-flex tw-items-center tw-justify-between">
              <div class="tw-flex tw-items-center tw-gap-2">
                <div class="tw-w-3 tw-h-3 tw-bg-crimson-500 tw-rounded-full"></div>
                <span class="tw-text-sm tw-text-gray-600">Sắp hết < 10 </span>
              </div>
              <span class="tw-text-lg tw-font-bold tw-text-crimson-600">{{ inventory.lowStock }}</span>
            </div>
            <div class="tw-flex tw-items-center tw-justify-between">
              <div class="tw-flex tw-items-center tw-gap-2">
                <div class="tw-w-3 tw-h-3 tw-bg-amber-500 tw-rounded-full"></div>
                <span class="tw-text-sm tw-text-gray-600">Trung bình >= 10 </span>
              </div>
              <span class="tw-text-lg tw-font-bold tw-text-amber-600">{{ inventory.normalStock }}</span>
            </div>
            <div class="tw-flex tw-items-center tw-justify-between">
              <div class="tw-flex tw-items-center tw-gap-2">
                <div class="tw-w-3 tw-h-3 tw-bg-green-500 tw-rounded-full"></div>
                <span class="tw-text-sm tw-text-gray-600">Nhiều > 40 </span>
              </div>
              <span class="tw-text-lg tw-font-bold tw-text-green-600">{{ inventory.highStock }}</span>
            </div>
          </div>
        </div>

        <!-- Peak Hours -->
        <div class="tw-bg-white tw-rounded-xl tw-shadow-sm tw-p-6 tw-border tw-border-gray-200">
          <div class="tw-flex tw-items-center tw-gap-3 tw-mb-4">
            <div class="tw-w-10 tw-h-10 tw-bg-amber-100 tw-rounded-lg tw-flex tw-items-center tw-justify-center tw-flex-shrink-0">
              <svg class="tw-w-6 tw-h-6 tw-text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="tw-text-lg tw-font-semibold tw-text-gray-800">Giờ Cao Điểm</h3>
          </div>
          <div class="tw-h-[200px]">
            <canvas ref="peakHoursChartRef"></canvas>
          </div>
        </div>

      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'
import { 
  getOrdersOverview, 
  getRevenueTimeline, 
  getOrdersByStatus,
  getPeakHours,
  getPaymentMethods 
} from '@/api/order/stats'
import {
  getTopSellingProducts,
  getInventoryStatus,
  getProductsOverview
} from '@/api/product/stats'
import {
  getUsersOverview
} from '@/api/user/stats'

// Date range options
const dateRanges = [
  { label: '7 ngày', value: '7days' },
  { label: '30 ngày', value: '30days' },
  { label: '90 ngày', value: '90days' },
  { label: '1 năm', value: 'year' }
]

const dateRange = ref<'7days' | '30days' | '90days' | 'year'>('30days')
const loading = ref(false)

// Chart refs
const revenueChartRef = ref<HTMLCanvasElement | null>(null)
const orderStatusChartRef = ref<HTMLCanvasElement | null>(null)
const paymentChartRef = ref<HTMLCanvasElement | null>(null)
const peakHoursChartRef = ref<HTMLCanvasElement | null>(null)

// Chart instances
let revenueChart: Chart | null = null
let orderStatusChart: Chart | null = null
let paymentChart: Chart | null = null
let peakHoursChart: Chart | null = null

// Data
const overview = ref({
  totalRevenue: 0,
  revenueChange: 0,
  totalOrders: 0,
  ordersChange: 0,
  newCustomers: 0,
  customersChange: 0,
  avgOrderValue: 0,
  aovChange: 0
})

const topProducts = ref<any[]>([])
const productOverview = ref({
  totalProducts: 0,
  totalCategories: 0,
  totalVariants: 0,
  totalInventoryValue: 0
})

const customerOverview = ref({
  totalUsers: 0,
  verifiedUsers: 0,
  newUsers: 0,
  adminUsers: 0
})

const inventory = ref({
  lowStock: 0,
  normalStock: 0,
  highStock: 0
})

// Utility functions
function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0)
}

function getImageUrl(imagePath: string | undefined) {
  if (!imagePath) return '/default-product.png'
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  return imagePath
}

function handleImageError(event: Event) {
  const target = event.target as HTMLImageElement
  if (target) {
    target.src = '/default-product.png'
  }
}

// Fetch all data
async function fetchAllData() {
  loading.value = true
  try {
    const params = { dateRange: dateRange.value }
    
    await Promise.all([
      fetchOverview(),
      fetchRevenueTimeline(),
      fetchOrderStatus(),
      fetchPaymentMethods(),
      fetchPeakHours(),
      fetchTopProducts(),
      fetchProductOverview(),
      fetchCustomerOverview(),
      fetchInventory()
    ])
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  } finally {
    loading.value = false
  }
}

async function fetchOverview() {
  try {
    const res: any = await getOrdersOverview({ dateRange: dateRange.value })
    if (res?.success && res.data) {
      overview.value = res.data
    }
  } catch (error) {
    console.error('Error fetching overview:', error)
  }
}

async function fetchRevenueTimeline() {
  try {
    const res: any = await getRevenueTimeline({ 
      dateRange: dateRange.value,
      groupBy: 'day'
    })
    if (res?.success && res.data) {
      updateRevenueChart(res.data)
    }
  } catch (error) {
    console.error('Error fetching revenue timeline:', error)
  }
}

async function fetchOrderStatus() {
  try {
    const res: any = await getOrdersByStatus({ dateRange: dateRange.value })
    if (res?.success && res.data) {
      updateOrderStatusChart(res.data)
    }
  } catch (error) {
    console.error('Error fetching order status:', error)
  }
}

async function fetchPaymentMethods() {
  try {
    const res: any = await getPaymentMethods({ dateRange: dateRange.value })
    if (res?.success && res.data) {
      updatePaymentChart(res.data)
    }
  } catch (error) {
    console.error('Error fetching payment methods:', error)
  }
}

async function fetchPeakHours() {
  try {
    const res: any = await getPeakHours({ dateRange: dateRange.value })
    if (res?.success && res.data) {
      updatePeakHoursChart(res.data)
    }
  } catch (error) {
    console.error('Error fetching peak hours:', error)
  }
}

async function fetchTopProducts() {
  try {
    const res: any = await getTopSellingProducts({ limit: 10 })
    if (res?.success && res.data) {
      topProducts.value = res.data
    }
  } catch (error) {
    console.error('Error fetching top products:', error)
  }
}

async function fetchProductOverview() {
  try {
    const res: any = await getProductsOverview()
    if (res?.success && res.data) {
      productOverview.value = res.data
    }
  } catch (error) {
    console.error('Error fetching product overview:', error)
  }
}

async function fetchCustomerOverview() {
  try {
    const res: any = await getUsersOverview({ dateRange: dateRange.value })
    if (res?.success && res.data) {
      customerOverview.value = res.data
    }
  } catch (error) {
    console.error('Error fetching customer overview:', error)
  }
}

async function fetchInventory() {
  try {
    const res: any = await getInventoryStatus()
    if (res?.success && res.data) {
      inventory.value = {
        lowStock: res.data.lowStock || 0,
        normalStock: res.data.normalStock || 0,
        highStock: res.data.highStock || 0
      }
    }
  } catch (error) {
    console.error('Error fetching inventory:', error)
  }
}

// Update charts
function updateRevenueChart(data: any[]) {
  if (!revenueChartRef.value) return
  
  if (revenueChart) {
    revenueChart.destroy()
  }
  
  const labels = data.map(item => item.label)
  const revenues = data.map(item => item.revenue)
  
  revenueChart = new Chart(revenueChartRef.value, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Doanh thu',
        data: revenues,
        borderColor: '#dc2626',
        backgroundColor: 'rgba(220, 38, 38, 0.1)',
        tension: 0.4,
        borderWidth: 3,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#dc2626'
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
              return 'Doanh thu: ' + formatCurrency(context.parsed.y || 0)
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return formatCurrency(value as number)
            }
          }
        }
      }
    }
  })
}

function updateOrderStatusChart(data: any[]) {
  if (!orderStatusChartRef.value) return
  
  if (orderStatusChart) {
    orderStatusChart.destroy()
  }
  
  const labels = data.map(item => item.label)
  const counts = data.map(item => item.count)
  
  const colors = [
    '#10b981', '#3b82f6', '#f59e0b', '#ef4444', 
    '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'
  ]
  
  orderStatusChart = new Chart(orderStatusChartRef.value, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data: counts,
        backgroundColor: colors,
        borderWidth: 0
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
            font: { size: 11 },
            generateLabels: function(chart) {
              const data = chart.data
              if (data.labels && data.labels.length && data.datasets && data.datasets.length) {
                return data.labels.map((label, i) => {
                  const value = data.datasets[0].data[i] as number
                  const bgColors = data.datasets[0].backgroundColor as string[]
                  return {
                    text: `${label}: ${value}`,
                    fillStyle: bgColors[i],
                    hidden: false,
                    index: i
                  }
                })
              }
              return []
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const total = counts.reduce((a, b) => a + b, 0)
              const percentage = ((context.parsed / total) * 100).toFixed(1)
              return `${context.label}: ${context.parsed} (${percentage}%)`
            }
          }
        }
      }
    }
  })
}

function updatePaymentChart(data: any[]) {
  if (!paymentChartRef.value) return
  
  if (paymentChart) {
    paymentChart.destroy()
  }
  
  const labels = data.map(item => item.label)
  const percentages = data.map(item => item.percentage)
  
  paymentChart = new Chart(paymentChartRef.value, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data: percentages,
        backgroundColor: ['#f59e0b', '#10b981', '#d946ef', '#3b82f6', '#8b5cf6'],
        borderWidth: 0
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
            font: { size: 11 },
            generateLabels: function(chart) {
              const data = chart.data
              if (data.labels && data.labels.length && data.datasets && data.datasets.length) {
                return data.labels.map((label, i) => {
                  const value = data.datasets[0].data[i] as number
                  const bgColors = data.datasets[0].backgroundColor as string[]
                  return {
                    text: `${label}: ${value ? value.toFixed(1) : '0.0'}%`,
                    fillStyle: bgColors[i],
                    hidden: false,
                    index: i
                  }
                })
              }
              return []
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.label}: ${context.parsed.toFixed(1)}%`
            }
          }
        }
      }
    }
  })
}

function updatePeakHoursChart(data: any[]) {
  if (!peakHoursChartRef.value) return
  
  if (peakHoursChart) {
    peakHoursChart.destroy()
  }
  
  const labels = data.map(item => item.label)
  const orders = data.map(item => item.orders)
  
  peakHoursChart = new Chart(peakHoursChartRef.value, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Số đơn hàng',
        data: orders,
        backgroundColor: 'rgba(168, 85, 247, 0.8)',
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { 
          display: true,
          position: 'top',
          labels: {
            padding: 10,
            font: { size: 11 }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 5 }
        }
      }
    },
    plugins: [{
      id: 'customDataLabels',
      afterDatasetsDraw(chart: any) {
        const ctx = chart.ctx
        chart.data.datasets.forEach((dataset: any, i: number) => {
          const meta = chart.getDatasetMeta(i)
          meta.data.forEach((bar: any, index: number) => {
            const data = dataset.data[index] as number
            if (data != null) {
              ctx.fillStyle = '#666'
              ctx.font = 'bold 11px sans-serif'
              ctx.textAlign = 'center'
              ctx.textBaseline = 'bottom'
              ctx.fillText(String(data), bar.x, bar.y - 5)
            }
          })
        })
      }
    }]
  })
}

// Initialize
onMounted(() => {
  fetchAllData()
})
</script>

<route lang="yaml">
name: Admin Dashboard
meta:
  layout: admin
  requiresAuth: true
  adminOnly: true
  navTitle: Dashboard
  path: /admin/dashboard
</route>


