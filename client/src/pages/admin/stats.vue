<template>
  <div class="tw-space-y-6">
    <!-- Header -->
    <div class="tw-flex tw-items-center tw-justify-between">
      <div>
        <h1 class="tw-text-3xl tw-font-bold tw-text-gray-900">📊 Thống kê tổng hợp</h1>
        <p class="tw-text-gray-600 tw-mt-1">Phân tích toàn diện dữ liệu kinh doanh</p>
      </div>
      
      <!-- Date Range Filter -->
      <div class="tw-flex tw-gap-3">
        <select v-model="dateRange" class="tw-px-4 tw-py-2 tw-border tw-rounded-lg tw-bg-white">
          <option value="7days">7 ngày qua</option>
          <option value="30days">30 ngày qua</option>
          <option value="90days">90 ngày qua</option>
          <option value="year">Năm nay</option>
          <option value="custom">Tùy chỉnh</option>
        </select>
        
        <button @click="exportReport" class="tw-px-4 tw-py-2 tw-bg-blue-600 tw-text-white tw-rounded-lg hover:tw-bg-blue-700">
          📥 Xuất báo cáo
        </button>
      </div>
    </div>

    <!-- ==================== PHẦN 1: THỐNG KÊ ĐỐN HÀNG ==================== -->
    <section class="tw-space-y-4">
      <div class="tw-flex tw-items-center tw-gap-3 tw-border-l-4 tw-border-blue-500 tw-pl-4">
        <h2 class="tw-text-2xl tw-font-bold tw-text-gray-900">Thống kê đơn hàng</h2>
      </div>

      <!-- Overview Cards -->
      <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-4">
        <StatCard 
          title="Tổng doanh thu"
          :value="formatCurrency(overview.totalRevenue)"
          :change="overview.revenueChange"
          icon="💰"
          color="blue"
        />
        <StatCard 
          title="Đơn hàng"
          :value="overview.totalOrders"
          :change="overview.ordersChange"
          icon="🛒"
          color="green"
        />
        <StatCard 
          title="Khách hàng mới"
          :value="overview.newCustomers"
          :change="overview.customersChange"
          icon="👥"
          color="purple"
        />
        <StatCard 
          title="Giá trị đơn TB"
          :value="formatCurrency(overview.avgOrderValue)"
          :change="overview.aovChange"
          icon="💳"
          color="orange"
        />
      </div>

      <!-- Charts Row -->
      <div class="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-6">
        <!-- Revenue Timeline -->
        <div class="tw-bg-white tw-rounded-xl tw-shadow-md tw-p-6">
          <h3 class="tw-text-lg tw-font-bold tw-mb-4">📈 Doanh thu theo thời gian</h3>
          <div class="tw-h-[300px]">
            <canvas ref="revenueChartRef"></canvas>
          </div>
        </div>

        <!-- Orders by Status -->
        <div class="tw-bg-white tw-rounded-xl tw-shadow-md tw-p-6">
          <h3 class="tw-text-lg tw-font-bold tw-mb-4">📦 Phân bố trạng thái</h3>
          <div class="tw-h-[300px] tw-flex tw-items-center tw-justify-center">
            <div class="tw-w-[280px] tw-h-[280px]">
              <canvas ref="orderStatusChartRef"></canvas>
            </div>
          </div>
        </div>

        <!-- Payment Methods -->
        <div class="tw-bg-white tw-rounded-xl tw-shadow-md tw-p-6">
          <h3 class="tw-text-lg tw-font-bold tw-mb-4">💳 Phương thức thanh toán</h3>
          <div class="tw-h-[300px] tw-flex tw-items-center tw-justify-center">
            <div class="tw-w-[280px] tw-h-[280px]">
              <canvas ref="paymentMethodChartRef"></canvas>
            </div>
          </div>
        </div>

        <!-- Peak Hours -->
        <div class="tw-bg-white tw-rounded-xl tw-shadow-md tw-p-6">
          <h3 class="tw-text-lg tw-font-bold tw-mb-4">⏰ Giờ cao điểm đặt hàng</h3>
          <div class="tw-h-[300px]">
            <canvas ref="peakHoursChartRef"></canvas>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== PHẦN 2: THỐNG KÊ SẢN PHẨM ==================== -->
    <section class="tw-space-y-4 tw-pt-8 tw-border-t-2 tw-border-gray-200">
      <div class="tw-flex tw-items-center tw-gap-3 tw-border-l-4 tw-border-green-500 tw-pl-4">
        <h2 class="tw-text-2xl tw-font-bold tw-text-gray-900">Thống kê sản phẩm</h2>
      </div>

      <!-- Inventory Status Cards -->
      <div class="tw-bg-white tw-rounded-xl tw-shadow-md tw-p-6">
        <div class="tw-flex tw-items-center tw-justify-between tw-mb-4">
          <h3 class="tw-text-lg tw-font-bold">⚠️ Sản phẩm sắp hết hàng</h3>
          <span class="tw-px-3 tw-py-1 tw-bg-red-100 tw-text-red-700 tw-rounded-full tw-text-sm tw-font-semibold">
            {{ inventory.lowStock }} sản phẩm
          </span>
        </div>
        <div class="tw-space-y-2 tw-max-h-[300px] tw-overflow-y-auto">
          <div v-for="(item, index) in lowStockProducts" :key="index"
               class="tw-flex tw-items-center tw-justify-between tw-p-3 tw-bg-red-50 tw-rounded-lg tw-border tw-border-red-200 hover:tw-border-red-400 tw-transition">
            <div class="tw-flex tw-items-center tw-gap-3 tw-flex-1">
              <img 
                :src="getImageUrl(item.image)" 
                :alt="item.name"
                class="tw-w-12 tw-h-12 tw-rounded tw-object-cover tw-flex-shrink-0 tw-border-2 tw-border-red-300"
                @error="handleImageError"
              />
              <div class="tw-flex-1">
                <p class="tw-font-semibold tw-text-gray-900">{{ item.name }}</p>
                <p class="tw-text-xs tw-text-gray-600">
                  <span v-if="item.color">{{ item.color }}</span>
                  <span v-if="item.color && item.memory"> • </span>
                  <span v-if="item.memory">{{ item.memory }}</span>
                </p>
              </div>
            </div>
            <div class="tw-flex tw-items-center tw-gap-3 tw-flex-shrink-0">
              <div class="tw-text-right">
                <p class="tw-text-xl tw-font-bold tw-text-red-600">{{ item.stock }}</p>
                <p class="tw-text-xs tw-text-gray-500">Còn lại</p>
              </div>
              <button 
                v-if="item.productId"
                @click="navigateToProduct(item.productId)"
                class="tw-px-3 tw-py-2 tw-bg-blue-600 tw-text-white tw-rounded-lg hover:tw-bg-blue-700 tw-transition tw-text-sm tw-font-medium"
                title="Xem chi tiết sản phẩm"
              >
                👁️
              </button>
            </div>
          </div>
          <div v-if="lowStockProducts.length === 0" class="tw-text-center tw-py-8 tw-text-gray-500">
            ✅ Tất cả sản phẩm đều có đủ tồn kho
          </div>
        </div>
      </div>

      <!-- Product Charts -->
      <div class="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-6">
        <!-- Top Selling Products -->
        <div class="tw-bg-white tw-rounded-xl tw-shadow-md tw-p-6">
          <h3 class="tw-text-lg tw-font-bold tw-mb-4">🏆 Top sản phẩm bán chạy</h3>
          <div class="tw-space-y-3 tw-max-h-[400px] tw-overflow-y-auto">
            <div v-for="(product, index) in topProducts" :key="index" 
                 class="tw-flex tw-items-center tw-justify-between tw-p-3 tw-bg-gray-50 tw-rounded-lg hover:tw-bg-gray-100 tw-transition">
              <div class="tw-flex tw-items-center tw-gap-3">
                <div class="tw-flex tw-items-center tw-justify-center tw-w-10 tw-h-10 tw-rounded-full tw-bg-gradient-to-br tw-from-amber-400 tw-to-orange-500 tw-text-white tw-font-bold">
                  #{{ index + 1 }}
                </div>
                <div>
                  <p class="tw-font-semibold tw-text-gray-900">{{ product.name }}</p>
                  <p class="tw-text-sm tw-text-gray-600">{{ product.sold }} đã bán</p>
                </div>
              </div>
              <p class="tw-font-bold tw-text-green-600">{{ formatCurrency(product.revenue) }}</p>
            </div>
          </div>
        </div>

        <!-- Category Revenue -->
        <div class="tw-bg-white tw-rounded-xl tw-shadow-md tw-p-6">
          <h3 class="tw-text-lg tw-font-bold tw-mb-4">📂 Doanh thu theo danh mục</h3>
          <div class="tw-h-[350px]">
            <canvas ref="categoryChartRef"></canvas>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== PHẦN 3: THỐNG KÊ KHÁCH HÀNG ==================== -->
    <section class="tw-space-y-4 tw-pt-8 tw-border-t-2 tw-border-gray-200">
      <div class="tw-flex tw-items-center tw-gap-3 tw-border-l-4 tw-border-purple-500 tw-pl-4">
        <h2 class="tw-text-2xl tw-font-bold tw-text-gray-900">Thống kê khách hàng</h2>
      </div>

      <!-- Customer Analytics -->
      <div class="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-6">
        <!-- Customer Segments -->
        <div class="tw-bg-white tw-rounded-xl tw-shadow-md tw-p-6">
          <h3 class="tw-text-lg tw-font-bold tw-mb-4">🎯 Phân khúc khách hàng</h3>
          <div class="tw-h-[320px] tw-flex tw-items-center tw-justify-center">
            <div class="tw-w-[280px] tw-h-[280px]">
              <canvas ref="customerSegmentChartRef"></canvas>
            </div>
          </div>
        </div>

        <!-- Top VIP Customers -->
        <div class="tw-bg-white tw-rounded-xl tw-shadow-md tw-p-6">
          <h3 class="tw-text-lg tw-font-bold tw-mb-4">💎 Top khách hàng VIP</h3>
          <div class="tw-space-y-3 tw-max-h-[320px] tw-overflow-y-auto">
            <div v-for="(customer, index) in topCustomers" :key="index"
                 class="tw-flex tw-items-center tw-justify-between tw-p-4 tw-bg-gradient-to-r tw-from-purple-50 tw-to-pink-50 tw-rounded-lg tw-border tw-border-purple-200 hover:tw-border-purple-400 tw-transition">
              <div class="tw-flex tw-items-center tw-gap-3">
                <div class="tw-relative">
                  <img :src="customer.avatar || '/default-avatar.png'" 
                       class="tw-w-12 tw-h-12 tw-rounded-full tw-object-cover tw-border-2 tw-border-purple-400" />
                  <div class="tw-absolute tw--top-1 tw--right-1 tw-w-6 tw-h-6 tw-bg-amber-400 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-text-xs tw-font-bold">
                    {{ index + 1 }}
                  </div>
                </div>
                <div>
                  <p class="tw-font-semibold tw-text-gray-900">{{ customer.name }}</p>
                  <p class="tw-text-xs tw-text-gray-600">🛍️ {{ customer.orders }} đơn hàng</p>
                </div>
              </div>
              <div class="tw-text-right">
                <p class="tw-font-bold tw-text-purple-600">{{ formatCurrency(customer.totalSpent) }}</p>
                <p class="tw-text-xs tw-text-gray-500">Tổng chi tiêu</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
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
  getRevenueByCategory,
  getInventoryStatus,
  getProductsOverview
} from '@/api/product/stats'
import {
  getCustomerSegments,
  getTopCustomers,
  getUsersOverview
} from '@/api/user/stats'

// Refs for charts
const revenueChartRef = ref<HTMLCanvasElement | null>(null)
const orderStatusChartRef = ref<HTMLCanvasElement | null>(null)
const categoryChartRef = ref<HTMLCanvasElement | null>(null)
const customerSegmentChartRef = ref<HTMLCanvasElement | null>(null)
const paymentMethodChartRef = ref<HTMLCanvasElement | null>(null)
const peakHoursChartRef = ref<HTMLCanvasElement | null>(null)

// Chart instances để có thể destroy khi update
let revenueChart: Chart | null = null
let orderStatusChart: Chart | null = null
let categoryChart: Chart | null = null
let customerSegmentChart: Chart | null = null
let paymentMethodChart: Chart | null = null
let peakHoursChart: Chart | null = null

const dateRange = ref<'7days' | '30days' | '90days' | 'year' | 'custom'>('30days')
const loading = ref(false)

// Data from API
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
const topCustomers = ref<any[]>([])
const lowStockProducts = ref<any[]>([])
const inventory = ref({
  lowStock: 0,
  normalStock: 0,
  highStock: 0
})

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
  adminUsers: 0,
  blockedUsers: 0
})

function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

function exportReport() {
  alert('Chức năng xuất báo cáo đang phát triển!')
}

function navigateToProduct(productId: string) {
  window.open(`/admin/product-detail/${productId}`, '_blank')
}

function getImageUrl(imagePath: string | undefined) {
  if (!imagePath) return '/default-product.png'
  // Nếu đã là URL đầy đủ
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  // Nếu là đường dẫn tương đối (thumbUrl từ uploads), trả về trực tiếp
  // vì nó đã là đường dẫn đúng từ backend
  return imagePath
}

function handleImageError(event: Event) {
  const target = event.target as HTMLImageElement
  if (target) {
    target.src = '/default-product.png'
  }
}

// Fetch data từ API
async function fetchAllStats() {
  loading.value = true
  try {
    const params = { dateRange: dateRange.value }
    
    // Fetch overview
    const overviewRes: any = await getOrdersOverview(params)
    if (overviewRes?.success) {
      overview.value = overviewRes.data
    }

    // Fetch và update charts
    await Promise.all([
      fetchRevenueTimeline(),
      fetchOrdersByStatus(),
      fetchPeakHours(),
      fetchPaymentMethods(),
      fetchTopProducts(),
      fetchCategoryRevenue(),
      fetchInventory(),
      fetchProductOverview(),
      fetchCustomerSegments(),
      fetchTopCustomers(),
      fetchCustomerOverview()
    ])
    
  } catch (error) {
    console.error('Error fetching stats:', error)
  } finally {
    loading.value = false
  }
}

async function fetchRevenueTimeline() {
  try {
    const res: any = await getRevenueTimeline({ 
      dateRange: dateRange.value,
      groupBy: dateRange.value === '7days' ? 'day' : 'day'
    })
    if (res?.success && res.data) {
      updateRevenueChart(res.data)
    }
  } catch (error) {
    console.error('Error fetching revenue timeline:', error)
  }
}

async function fetchOrdersByStatus() {
  try {
    const res: any = await getOrdersByStatus({ dateRange: dateRange.value })
    if (res?.success && res.data) {
      updateOrderStatusChart(res.data)
    }
  } catch (error) {
    console.error('Error fetching orders by status:', error)
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

async function fetchPaymentMethods() {
  try {
    const res: any = await getPaymentMethods({ dateRange: dateRange.value })
    if (res?.success && res.data) {
      updatePaymentMethodChart(res.data)
    }
  } catch (error) {
    console.error('Error fetching payment methods:', error)
  }
}

// Product stats
async function fetchTopProducts() {
  try {
    const res: any = await getTopSellingProducts({ limit: 5 })
    if (res?.success && res.data) {
      topProducts.value = res.data
    }
  } catch (error) {
    console.error('Error fetching top products:', error)
  }
}

async function fetchCategoryRevenue() {
  try {
    const res: any = await getRevenueByCategory()
    if (res?.success && res.data) {
      updateCategoryChart(res.data)
    }
  } catch (error) {
    console.error('Error fetching category revenue:', error)
  }
}

async function fetchInventory() {
  try {
    const res: any = await getInventoryStatus()
    if (res?.success && res.data) {
      inventory.value = {
        lowStock: res.data.lowStock,
        normalStock: res.data.normalStock,
        highStock: res.data.highStock
      }
      
      // Lấy danh sách sản phẩm sắp hết hàng
      if (res.data.lowStockProducts) {
        lowStockProducts.value = res.data.lowStockProducts
      }
    }
  } catch (error) {
    console.error('Error fetching inventory:', error)
  }
}

async function fetchProductOverview() {
  try {
    const res: any = await getProductsOverview()
    if (res?.success && res.data) {
      productOverview.value = {
        totalProducts: res.data.totalProducts,
        totalCategories: res.data.totalCategories,
        totalVariants: res.data.totalVariants,
        totalInventoryValue: res.data.totalInventoryValue
      }
    }
  } catch (error) {
    console.error('Error fetching product overview:', error)
  }
}

// Customer stats
async function fetchCustomerSegments() {
  try {
    const res: any = await getCustomerSegments()
    if (res?.success && res.data) {
      updateCustomerSegmentChart(res.data)
    }
  } catch (error) {
    console.error('Error fetching customer segments:', error)
  }
}

async function fetchTopCustomers() {
  try {
    const res: any = await getTopCustomers({ limit: 3 })
    if (res?.success && res.data) {
      topCustomers.value = res.data
    }
  } catch (error) {
    console.error('Error fetching top customers:', error)
  }
}

async function fetchCustomerOverview() {
  try {
    const res: any = await getUsersOverview({ dateRange: dateRange.value })
    if (res?.success && res.data) {
      customerOverview.value = {
        totalUsers: res.data.totalUsers,
        verifiedUsers: res.data.verifiedUsers,
        newUsers: res.data.newUsers,
        adminUsers: res.data.adminUsers,
        blockedUsers: res.data.blockedUsers
      }
    }
  } catch (error) {
    console.error('Error fetching customer overview:', error)
  }
}

// Watch dateRange để reload data
watch(dateRange, () => {
  fetchAllStats()
})

// Initialize charts
onMounted(() => {
  fetchAllStats()
})

function initRevenueChart() {
  // Sẽ được khởi tạo khi có data từ API
}

function updateRevenueChart(data: any[]) {
  if (!revenueChartRef.value) return
  
  // Destroy chart cũ nếu có
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
        label: 'Doanh thu (VNĐ)',
        data: revenues,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: { 
      responsive: true, 
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return new Intl.NumberFormat('vi-VN').format(value as number)
            }
          }
        }
      }
    }
  })
}

function initOrderStatusChart() {
  // Sẽ được khởi tạo khi có data từ API
}

function updateOrderStatusChart(data: any[]) {
  if (!orderStatusChartRef.value) return
  
  if (orderStatusChart) {
    orderStatusChart.destroy()
  }
  
  const labels = data.map(item => item.label)
  const counts = data.map(item => item.count)
  const colors = {
    'Hoàn thành': '#10b981',
    'Đang giao': '#3b82f6',
    'Chờ xử lý': '#f59e0b',
    'Đã hủy': '#ef4444'
  }
  const backgroundColors = labels.map(label => colors[label as keyof typeof colors] || '#6b7280')
  
  orderStatusChart = new Chart(orderStatusChartRef.value, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data: counts,
        backgroundColor: backgroundColors
      }]
    },
    options: { 
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  })
}

function initCategoryChart() {
  // Sẽ được khởi tạo khi có data từ API
}

function updateCategoryChart(data: any[]) {
  if (!categoryChartRef.value) return
  
  if (categoryChart) {
    categoryChart.destroy()
  }
  
  const labels = data.map(item => item.category)
  const revenues = data.map(item => item.revenue)
  
  categoryChart = new Chart(categoryChartRef.value, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Doanh thu (VNĐ)',
        data: revenues,
        backgroundColor: 'rgba(59, 130, 246, 0.8)'
      }]
    },
    options: { 
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return new Intl.NumberFormat('vi-VN').format(value as number)
            }
          }
        }
      }
    }
  })
}

function initCustomerSegmentChart() {
  // Sẽ được khởi tạo khi có data từ API
}

function updateCustomerSegmentChart(data: any[]) {
  if (!customerSegmentChartRef.value) return
  
  if (customerSegmentChart) {
    customerSegmentChart.destroy()
  }
  
  const labels = data.map(item => item.segment)
  const counts = data.map(item => item.count)
  
  customerSegmentChart = new Chart(customerSegmentChartRef.value, {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        data: counts,
        backgroundColor: ['#8b5cf6', '#ec4899', '#06b6d4']
      }]
    },
    options: { 
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  })
}

function initPaymentMethodChart() {
  // Sẽ được khởi tạo khi có data từ API
}

function updatePaymentMethodChart(data: any[]) {
  if (!paymentMethodChartRef.value) return
  
  if (paymentMethodChart) {
    paymentMethodChart.destroy()
  }
  
  const labels = data.map(item => item.label)
  const percentages = data.map(item => item.percentage)
  
  paymentMethodChart = new Chart(paymentMethodChartRef.value, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data: percentages,
        backgroundColor: ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6']
      }]
    },
    options: { 
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.label + ': ' + context.parsed + '%'
            }
          }
        }
      }
    }
  })
}

function initPeakHoursChart() {
  // Sẽ được khởi tạo khi có data từ API
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
        backgroundColor: 'rgba(168, 85, 247, 0.8)'
      }]
    },
    options: { 
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 20
          }
        }
      }
    }
  })
}
</script>

<script lang="ts">
// StatCard Component
const StatCard = {
  props: ['title', 'value', 'change', 'icon', 'color'],
  template: `
    <div class="tw-bg-white tw-rounded-xl tw-shadow-md tw-p-6">
      <div class="tw-flex tw-items-center tw-justify-between tw-mb-3">
        <span class="tw-text-3xl">{{ icon }}</span>
        <span :class="[
          'tw-px-2 tw-py-1 tw-rounded-full tw-text-xs tw-font-semibold',
          change >= 0 ? 'tw-bg-green-100 tw-text-green-700' : 'tw-bg-red-100 tw-text-red-700'
        ]">
          {{ change >= 0 ? '↑' : '↓' }} {{ Math.abs(change) }}%
        </span>
      </div>
      <p class="tw-text-gray-600 tw-text-sm tw-mb-1">{{ title }}</p>
      <p class="tw-text-2xl tw-font-bold">{{ value }}</p>
    </div>
  `
}

export default {
  components: { StatCard }
}
</script>

<route lang="yaml">
name: Admin Stats
meta:
  layout: admin
  requiresAuth: true
  adminOnly: true
  path: /admin/stats
</route>



