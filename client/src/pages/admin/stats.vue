<template>
  <div class="tw-p-6 tw-bg-white tw-min-h-screen">
    <!-- Header -->
    <div class="tw-flex tw-items-center tw-justify-between tw-mb-6">
      <h1 class="tw-text-3xl tw-font-bold tw-text-crimson-600">
        Thống kê tổng hợp
      </h1>
      
      <!-- Date Range Filter -->
      <div class="tw-flex tw-items-center tw-gap-3">
        <div class="tw-relative">
          <select v-model="dateRange" 
                  class="tw-appearance-none tw-pl-10 tw-pr-10 tw-py-3 tw-border-2 tw-border-crimson-300 tw-rounded-xl tw-bg-white tw-text-gray-800 tw-font-semibold tw-shadow-sm hover:tw-border-crimson-500 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-crimson-500 focus:tw-border-crimson-500 tw-transition-all tw-cursor-pointer">
            <option value="7days">7 ngày qua</option>
            <option value="30days">30 ngày qua</option>
            <option value="90days">90 ngày qua</option>
            <option value="year">Năm nay</option>
            <option value="custom">Tùy chỉnh</option>
          </select>
          <div class="tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-pointer-events-none">
            <svg class="tw-w-5 tw-h-5 tw-text-crimson-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div class="tw-absolute tw-right-3 tw-top-1/2 -tw-translate-y-1/2 tw-pointer-events-none">
            <svg class="tw-w-4 tw-h-4 tw-text-crimson-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        <button @click="exportReport" 
                class="tw-px-5 tw-py-3 tw-bg-gradient-to-r tw-from-crimson-600 tw-to-crimson-700 tw-text-white tw-rounded-xl tw-font-semibold tw-shadow-md hover:tw-from-crimson-700 hover:tw-to-crimson-800 hover:tw-shadow-lg tw-transition-all tw-duration-200 tw-flex tw-items-center tw-gap-2">
          <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Xuất báo cáo</span>
        </button>
      </div>
    </div>

    <!-- ==================== PHẦN 1: THỐNG KÊ ĐỐN HÀNG ==================== -->
    <section class="tw-space-y-4">
      <div class="tw-flex tw-items-center tw-gap-3 tw-border-l-4 tw-border-blue-500 tw-pl-4">
        <h2 class="tw-text-2xl tw-font-bold tw-text-gray-900">Thống kê đơn hàng</h2>
      </div>

      <!-- Overview Cards -->
      <div class="tw-space-y-4">
        <!-- First Row -->
        <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
          <StatCard 
            title="Tổng doanh thu"
            :value="formatCurrency(overview.totalRevenue)"
            :previousValue="formatCurrency(overview.previousRevenue)"
            :change="overview.revenueChange"
            icon="💰"
            color="blue"
            :dateRangeText="formatDateRange(overview.dateRange)"
            :previousDateRangeText="formatDateRange(overview.previousDateRange)"
          />
          <StatCard 
            title="Đơn hàng"
            :value="overview.totalOrders"
            :previousValue="overview.previousOrders"
            :change="overview.ordersChange"
            icon="🛒"
            color="green"
            :dateRangeText="formatDateRange(overview.dateRange)"
            :previousDateRangeText="formatDateRange(overview.previousDateRange)"
          />
        </div>
        
        <!-- Second Row -->
        <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
          <StatCard 
            title="Khách hàng mới"
            :value="overview.newCustomers"
            :previousValue="overview.previousCustomers"
            :change="overview.customersChange"
            icon="👥"
            color="purple"
            :dateRangeText="formatDateRange(overview.dateRange)"
            :previousDateRangeText="formatDateRange(overview.previousDateRange)"
          />
          <StatCard 
            title="Giá trị đơn TB"
            :value="formatCurrency(overview.avgOrderValue)"
            :previousValue="formatCurrency(overview.previousAvgOrderValue)"
            :change="overview.aovChange"
            icon="💳"
            color="gray"
            :dateRangeText="formatDateRange(overview.dateRange)"
            :previousDateRangeText="formatDateRange(overview.previousDateRange)"
          />
        </div>
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
          <h3 class="tw-text-lg tw-font-bold tw-mb-4">📦 Trạng thái đơn hàng</h3>
          <div class="tw-flex tw-items-start tw-gap-6">
            <!-- Pie Chart -->
            <div class="tw-w-[180px] tw-h-[180px] tw-flex-shrink-0">
              <canvas ref="orderStatusChartRef"></canvas>
            </div>
            
            <!-- Ranked List -->
            <div class="tw-flex-1 tw-space-y-2 tw-overflow-y-auto tw-max-h-[400px]">
            <div v-for="(item, index) in orderStatusData" :key="index" 
                 class="tw-flex tw-items-center tw-gap-3 tw-p-3 tw-bg-gray-50 tw-rounded-lg hover:tw-bg-gray-100 tw-transition">
              
              <!-- Status Info with Rank Badge -->
              <div class="tw-flex tw-items-center tw-gap-2 tw-flex-1">
                <div class="tw-relative">
                  <div :style="{ backgroundColor: item.color }" class="tw-w-10 tw-h-10 tw-rounded-full tw-flex-shrink-0"></div>
                  <!-- Rank Badge -->
                  <div class="tw-absolute -tw-top-1 -tw-right-1 tw-bg-gradient-to-br tw-from-blue-400 tw-to-blue-600 tw-text-white tw-rounded-full tw-w-5 tw-h-5 tw-flex tw-items-center tw-justify-center tw-text-xs tw-font-bold tw-shadow-md">
                    {{ index + 1 }}
                  </div>
                </div>
                <div class="tw-flex-1">
                  <div class="tw-text-sm tw-font-semibold tw-text-gray-900">{{ item.label }}</div>
                </div>
              </div>
              
              <!-- Count and Percentage -->
              <div class="tw-text-right tw-flex-shrink-0">
                <div class="tw-text-lg tw-font-bold tw-text-blue-600">{{ item.count }} đơn</div>
                <div class="tw-text-xs tw-text-gray-500">{{ item.percentage }}%</div>
              </div>
            </div>
              <div v-if="orderStatusData.length === 0" class="tw-text-center tw-py-8 tw-text-gray-500">
                Chưa có dữ liệu trạng thái đơn hàng
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Methods -->
        <div class="tw-bg-white tw-rounded-xl tw-shadow-md tw-p-6">
          <h3 class="tw-text-lg tw-font-bold tw-mb-4">💳 Phương thức thanh toán</h3>
          <div class="tw-flex tw-items-start tw-gap-6">
            <!-- Pie Chart -->
            <div class="tw-w-[180px] tw-h-[180px] tw-flex-shrink-0">
              <canvas ref="paymentMethodChartRef"></canvas>
            </div>
            
            <!-- Ranked List -->
            <div class="tw-flex-1 tw-space-y-2 tw-overflow-y-auto tw-max-h-[400px]">
            <div v-for="(item, index) in paymentMethodData" :key="index" 
                 class="tw-flex tw-items-center tw-gap-3 tw-p-3 tw-bg-gray-50 tw-rounded-lg hover:tw-bg-gray-100 tw-transition">
              
              <!-- Payment Method Info with Rank Badge -->
              <div class="tw-flex tw-items-center tw-gap-2 tw-flex-1">
                <div class="tw-relative">
                  <div :style="{ backgroundColor: item.color }" class="tw-w-10 tw-h-10 tw-rounded-full tw-flex-shrink-0"></div>
                  <!-- Rank Badge -->
                  <div class="tw-absolute -tw-top-1 -tw-right-1 tw-bg-gradient-to-br tw-from-green-400 tw-to-green-600 tw-text-white tw-rounded-full tw-w-5 tw-h-5 tw-flex tw-items-center tw-justify-center tw-text-xs tw-font-bold tw-shadow-md">
                    {{ index + 1 }}
                  </div>
                </div>
                <div class="tw-flex-1">
                  <div class="tw-text-sm tw-font-semibold tw-text-gray-900">{{ item.label }}</div>
                </div>
              </div>
              
              <!-- Count and Percentage -->
              <div class="tw-text-right tw-flex-shrink-0">
                <div class="tw-text-lg tw-font-bold tw-text-green-600">{{ item.count }} đơn</div>
                <div class="tw-text-xs tw-text-gray-500">{{ item.percentage }}%</div>
              </div>
            </div>
              <div v-if="paymentMethodData.length === 0" class="tw-text-center tw-py-8 tw-text-gray-500">
                Chưa có dữ liệu phương thức thanh toán
              </div>
            </div>
          </div>
        </div>

        <!-- Peak Hours -->
        <div class="tw-bg-white tw-rounded-xl tw-shadow-md tw-p-6">
          <h3 class="tw-text-lg tw-font-bold tw-mb-4">⏰ Khung giờ đặt hàng</h3>
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
          <span class="tw-px-3 tw-py-1 tw-bg-crimson-100 tw-text-crimson-700 tw-rounded-full tw-text-sm tw-font-semibold">
            {{ inventory.lowStock }} sản phẩm
          </span>
        </div>
        <div class="tw-space-y-2 tw-max-h-[300px] tw-overflow-y-auto">
          <div v-for="(item, index) in lowStockProducts" :key="index"
               class="tw-flex tw-items-center tw-justify-between tw-p-3 tw-bg-crimson-50 tw-rounded-lg tw-border tw-border-crimson-200 hover:tw-border-crimson-400 tw-transition">
            <div class="tw-flex tw-items-center tw-gap-3 tw-flex-1">
              <img 
                :src="getImageUrl(item.image)" 
                :alt="item.name"
                class="tw-w-12 tw-h-12 tw-rounded tw-object-cover tw-flex-shrink-0 tw-border-2 tw-border-crimson-300"
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
                <p class="tw-text-xl tw-font-bold tw-text-crimson-600">{{ item.stock }}</p>
                <p class="tw-text-xs tw-text-gray-500">Còn lại</p>
              </div>
              <button 
                v-if="item.productId"
                @click="navigateToProduct(item.productId)"
                class="tw-px-3 tw-py-2 tw-bg-blue-600 tw-text-white tw-rounded-lg hover:tw-bg-blue-700 tw-transition tw-text-sm tw-font-medium"
                title="Xem chi tiết sản phẩm"
              >
                <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
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

      <!-- Customer Segments Tables -->
      <div class="tw-space-y-6">
        <!-- VIP Customers -->
        <div class="tw-bg-white tw-rounded-xl tw-shadow-md tw-p-6">
          <div class="tw-flex tw-items-center tw-justify-between tw-mb-4">
            <h3 class="tw-text-lg tw-font-bold tw-flex tw-items-center tw-gap-2">
              <span class="tw-text-2xl">💎</span>
              <span>Khách hàng VIP</span>
              <span class="tw-px-3 tw-py-1 tw-bg-purple-100 tw-text-purple-700 tw-rounded-full tw-text-sm tw-font-semibold">
                {{ vipCustomers.pagination.total }} khách hàng
              </span>
            </h3>
          </div>
          <div class="tw-overflow-x-auto">
            <table class="tw-w-full tw-text-sm">
              <thead class="tw-bg-gray-50">
                <tr>
                  <th class="tw-px-4 tw-py-3 tw-text-left">Khách hàng</th>
                  <th class="tw-px-4 tw-py-3 tw-text-center">Số đơn</th>
                  <th class="tw-px-4 tw-py-3 tw-text-right">Tổng chi tiêu</th>
                  <th class="tw-px-4 tw-py-3 tw-text-center">Đơn gần nhất</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="customer in vipCustomers.customers" :key="customer.userId" 
                    class="tw-border-b hover:tw-bg-purple-50 tw-transition">
                  <td class="tw-px-4 tw-py-3">
                    <div class="tw-flex tw-items-center tw-gap-3">
                      <div class="tw-relative">
                        <img :src="customer.avatar || '/default-avatar.png'" 
                             class="tw-w-10 tw-h-10 tw-rounded-full tw-object-cover tw-border-2 tw-border-purple-400" />
                        <!-- Badge số thứ hạng -->
                        <div class="tw-absolute -tw-top-1 -tw-right-1 tw-bg-gradient-to-br tw-from-amber-400 tw-to-orange-500 tw-text-white tw-rounded-full tw-w-3 tw-h-3 tw-flex tw-items-center tw-justify-center tw-text-xs tw-font-bold tw-shadow-md">
                          {{ customer.ranking }}
                        </div>
                      </div>
                      <div>
                        <p class="tw-font-semibold tw-text-gray-900">{{ customer.name }}</p>
                        <p class="tw-text-xs tw-text-gray-600">{{ customer.email }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="tw-px-4 tw-py-3 tw-text-center tw-font-semibold">{{ customer.totalOrders }}</td>
                  <td class="tw-px-4 tw-py-3 tw-text-right tw-font-bold tw-text-purple-600">
                    {{ formatCurrency(customer.totalSpent) }}
                  </td>
                  <td class="tw-px-4 tw-py-3 tw-text-center tw-text-sm tw-text-gray-600">
                    {{ formatDate(customer.lastOrderDate) }}
                  </td>
                </tr>
                <tr v-if="vipCustomers.customers.length === 0">
                  <td colspan="4" class="tw-px-4 tw-py-8 tw-text-center tw-text-gray-500">
                    Chưa có khách hàng VIP
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Pagination -->
          <div v-if="vipCustomers.pagination.totalPages > 1" class="tw-flex tw-justify-center tw-gap-2 tw-mt-4">
            <button @click="changeVipPage(vipCustomers.pagination.page - 1)" 
                    :disabled="vipCustomers.pagination.page === 1"
                    class="tw-px-3 tw-py-1 tw-border tw-rounded disabled:tw-opacity-50">
              ←
            </button>
            <span class="tw-px-3 tw-py-1">
              {{ vipCustomers.pagination.page }} / {{ vipCustomers.pagination.totalPages }}
            </span>
            <button @click="changeVipPage(vipCustomers.pagination.page + 1)" 
                    :disabled="vipCustomers.pagination.page === vipCustomers.pagination.totalPages"
                    class="tw-px-3 tw-py-1 tw-border tw-rounded disabled:tw-opacity-50">
              →
            </button>
          </div>
        </div>

        <!-- Frequent Customers -->
        <div class="tw-bg-white tw-rounded-xl tw-shadow-md tw-p-6">
          <div class="tw-flex tw-items-center tw-justify-between tw-mb-4">
            <h3 class="tw-text-lg tw-font-bold tw-flex tw-items-center tw-gap-2">
              <span class="tw-text-2xl">🎯</span>
              <span>Khách hàng thường xuyên</span>
              <span class="tw-px-3 tw-py-1 tw-bg-blue-100 tw-text-blue-700 tw-rounded-full tw-text-sm tw-font-semibold">
                {{ frequentCustomers.pagination.total }} khách hàng
              </span>
            </h3>
          </div>
          <div class="tw-overflow-x-auto">
            <table class="tw-w-full tw-text-sm">
              <thead class="tw-bg-gray-50">
                <tr>
                  <th class="tw-px-4 tw-py-3 tw-text-left">Khách hàng</th>
                  <th class="tw-px-4 tw-py-3 tw-text-center">Số đơn</th>
                  <th class="tw-px-4 tw-py-3 tw-text-right">Tổng chi tiêu</th>
                  <th class="tw-px-4 tw-py-3 tw-text-center">Đơn gần nhất</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="customer in frequentCustomers.customers" :key="customer.userId" 
                    class="tw-border-b hover:tw-bg-blue-50 tw-transition">
                  <td class="tw-px-4 tw-py-3">
                    <div class="tw-flex tw-items-center tw-gap-3">
                      <div class="tw-relative">
                        <img :src="customer.avatar || '/default-avatar.png'" 
                             class="tw-w-10 tw-h-10 tw-rounded-full tw-object-cover tw-border-2 tw-border-blue-400" />
                        <!-- Badge số thứ hạng cho khách thường xuyên -->
                        <div class="tw-absolute -tw-top-1 -tw-right-1 tw-bg-gradient-to-br tw-from-blue-400 tw-to-blue-600 tw-text-white tw-rounded-full tw-w-5 tw-h-5 tw-flex tw-items-center tw-justify-center tw-text-xs tw-font-bold tw-shadow-md">
                          {{ customer.ranking }}
                        </div>
                      </div>
                      <div>
                        <p class="tw-font-semibold tw-text-gray-900">{{ customer.name }}</p>
                        <p class="tw-text-xs tw-text-gray-600">{{ customer.email }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="tw-px-4 tw-py-3 tw-text-center tw-font-semibold">{{ customer.totalOrders }}</td>
                  <td class="tw-px-4 tw-py-3 tw-text-right tw-font-bold tw-text-blue-600">
                    {{ formatCurrency(customer.totalSpent) }}
                  </td>
                  <td class="tw-px-4 tw-py-3 tw-text-center tw-text-sm tw-text-gray-600">
                    {{ formatDate(customer.lastOrderDate) }}
                  </td>
                </tr>
                <tr v-if="frequentCustomers.customers.length === 0">
                  <td colspan="4" class="tw-px-4 tw-py-8 tw-text-center tw-text-gray-500">
                    Chưa có khách hàng thường xuyên
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Pagination -->
          <div v-if="frequentCustomers.pagination.totalPages > 1" class="tw-flex tw-justify-center tw-gap-2 tw-mt-4">
            <button @click="changeFrequentPage(frequentCustomers.pagination.page - 1)" 
                    :disabled="frequentCustomers.pagination.page === 1"
                    class="tw-px-3 tw-py-1 tw-border tw-rounded disabled:tw-opacity-50">
              ←
            </button>
            <span class="tw-px-3 tw-py-1">
              {{ frequentCustomers.pagination.page }} / {{ frequentCustomers.pagination.totalPages }}
            </span>
            <button @click="changeFrequentPage(frequentCustomers.pagination.page + 1)" 
                    :disabled="frequentCustomers.pagination.page === frequentCustomers.pagination.totalPages"
                    class="tw-px-3 tw-py-1 tw-border tw-rounded disabled:tw-opacity-50">
              →
            </button>
          </div>
        </div>

        <!-- New Customers -->
        <div class="tw-bg-white tw-rounded-xl tw-shadow-md tw-p-6">
          <div class="tw-flex tw-items-center tw-justify-between tw-mb-4">
            <h3 class="tw-text-lg tw-font-bold tw-flex tw-items-center tw-gap-2">
              <span class="tw-text-2xl">🌟</span>
              <span>Khách hàng mới</span>
              <span class="tw-px-3 tw-py-1 tw-bg-green-100 tw-text-green-700 tw-rounded-full tw-text-sm tw-font-semibold">
                {{ newCustomers.pagination.total }} khách hàng
              </span>
            </h3>
          </div>
          <div class="tw-overflow-x-auto">
            <table class="tw-w-full tw-text-sm">
              <thead class="tw-bg-gray-50">
                <tr>
                  <th class="tw-px-4 tw-py-3 tw-text-left">Khách hàng</th>
                  <th class="tw-px-4 tw-py-3 tw-text-center">Số đơn</th>
                  <th class="tw-px-4 tw-py-3 tw-text-right">Tổng chi tiêu</th>
                  <th class="tw-px-4 tw-py-3 tw-text-center">Đơn gần nhất</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="customer in newCustomers.customers" :key="customer.userId" 
                    class="tw-border-b hover:tw-bg-green-50 tw-transition">
                  <td class="tw-px-4 tw-py-3">
                    <div class="tw-flex tw-items-center tw-gap-3">
                      <img :src="customer.avatar || '/default-avatar.png'" 
                           class="tw-w-10 tw-h-10 tw-rounded-full tw-object-cover tw-border-2 tw-border-green-400" />
                      <div>
                        <p class="tw-font-semibold tw-text-gray-900">{{ customer.name }}</p>
                        <p class="tw-text-xs tw-text-gray-600">{{ customer.email }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="tw-px-4 tw-py-3 tw-text-center tw-font-semibold">{{ customer.totalOrders }}</td>
                  <td class="tw-px-4 tw-py-3 tw-text-right tw-font-bold tw-text-green-600">
                    {{ formatCurrency(customer.totalSpent) }}
                  </td>
                  <td class="tw-px-4 tw-py-3 tw-text-center tw-text-sm tw-text-gray-600">
                    {{ formatDate(customer.lastOrderDate) }}
                  </td>
                </tr>
                <tr v-if="newCustomers.customers.length === 0">
                  <td colspan="4" class="tw-px-4 tw-py-8 tw-text-center tw-text-gray-500">
                    Chưa có khách hàng mới
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Pagination -->
          <div v-if="newCustomers.pagination.totalPages > 1" class="tw-flex tw-justify-center tw-gap-2 tw-mt-4">
            <button @click="changeNewPage(newCustomers.pagination.page - 1)" 
                    :disabled="newCustomers.pagination.page === 1"
                    class="tw-px-3 tw-py-1 tw-border tw-rounded disabled:tw-opacity-50">
              ←
            </button>
            <span class="tw-px-3 tw-py-1">
              {{ newCustomers.pagination.page }} / {{ newCustomers.pagination.totalPages }}
            </span>
            <button @click="changeNewPage(newCustomers.pagination.page + 1)" 
                    :disabled="newCustomers.pagination.page === newCustomers.pagination.totalPages"
                    class="tw-px-3 tw-py-1 tw-border tw-rounded disabled:tw-opacity-50">
              →
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== PHẦN 4: THỐNG KÊ ĐÁNH GIÁ ==================== -->
    <section class="tw-space-y-4 tw-pt-8 tw-border-t-2 tw-border-gray-200">
      <div class="tw-flex tw-items-center tw-gap-3 tw-border-l-4 tw-border-amber-500 tw-pl-4">
        <h2 class="tw-text-2xl tw-font-bold tw-text-amber-900">Thống kê đánh giá sản phẩm</h2>
      </div>

      <!-- Review Overview Cards -->
      <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-4">
        <div class="tw-bg-white tw-rounded-xl tw-shadow-md tw-p-6 tw-border-t-4 tw-border-amber-500">
          <div class="tw-flex tw-items-center tw-justify-between tw-mb-4">
            <h3 class="tw-text-sm tw-font-semibold tw-text-gray-600 tw-uppercase">Tổng đánh giá</h3>
            <div class="tw-bg-amber-100 tw-p-2 tw-rounded-lg">
              <svg class="tw-w-6 tw-h-6 tw-text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
          <p class="tw-text-3xl tw-font-bold tw-text-gray-900">{{ reviewOverview.totalReviews }}</p>
          <div class="tw-mt-2 tw-text-sm tw-text-gray-500">
            <span class="tw-text-green-600 tw-font-medium">{{ reviewOverview.visibleReviews }}</span> hiển thị, 
            <span class="tw-text-crimson-600 tw-font-medium">{{ reviewOverview.hiddenReviews }}</span> đã ẩn
          </div>
        </div>

        <div class="tw-bg-white tw-rounded-xl tw-shadow-md tw-p-6 tw-border-t-4 tw-border-amber-500">
          <div class="tw-flex tw-items-center tw-justify-between tw-mb-4">
            <h3 class="tw-text-sm tw-font-semibold tw-text-gray-600 tw-uppercase">Đánh giá TB</h3>
            <div class="tw-bg-amber-100 tw-p-2 tw-rounded-lg">
              <svg class="tw-w-6 tw-h-6 tw-text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
          </div>
          <p class="tw-text-3xl tw-font-bold tw-text-gray-900">{{ reviewOverview.averageRating.toFixed(1) }}/5</p>
          <div class="tw-flex tw-items-center tw-gap-1 tw-mt-2">
            <svg v-for="i in 5" :key="i" class="tw-w-4 tw-h-4" :class="i <= Math.round(reviewOverview.averageRating) ? 'tw-text-amber-400' : 'tw-text-gray-300'" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
        </div>

        <div class="tw-bg-white tw-rounded-xl tw-shadow-md tw-p-6 tw-border-t-4 tw-border-green-500">
          <div class="tw-flex tw-items-center tw-justify-between tw-mb-4">
            <h3 class="tw-text-sm tw-font-semibold tw-text-gray-600 tw-uppercase">Lượt hữu ích</h3>
            <div class="tw-bg-green-100 tw-p-2 tw-rounded-lg">
              <svg class="tw-w-6 tw-h-6 tw-text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
            </div>
          </div>
          <p class="tw-text-3xl tw-font-bold tw-text-gray-900">{{ reviewOverview.totalHelpful }}</p>
          <div class="tw-mt-2 tw-text-sm tw-text-gray-500">Tổng số lượt đánh dấu hữu ích</div>
        </div>

        <div class="tw-bg-white tw-rounded-xl tw-shadow-md tw-p-6 tw-border-t-4 tw-border-blue-500">
          <div class="tw-flex tw-items-center tw-justify-between tw-mb-4">
            <h3 class="tw-text-sm tw-font-semibold tw-text-gray-600 tw-uppercase">Có hình ảnh</h3>
            <div class="tw-bg-blue-100 tw-p-2 tw-rounded-lg">
              <svg class="tw-w-6 tw-h-6 tw-text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p class="tw-text-3xl tw-font-bold tw-text-gray-900">{{ imageStats.percentage.withImages }}%</p>
          <div class="tw-mt-2 tw-text-sm tw-text-gray-500">
            {{ imageStats.withImages }} / {{ imageStats.total }} đánh giá
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-6">
        <!-- Rating Distribution Chart -->
        <div class="tw-bg-white tw-rounded-xl tw-shadow-md tw-p-6">
          <h3 class="tw-text-lg tw-font-bold tw-text-gray-900 tw-mb-4">Phân bố đánh giá</h3>
          <div class="tw-h-80">
            <canvas ref="ratingDistributionChartRef"></canvas>
          </div>
          <!-- Legend -->
          <div class="tw-mt-4 tw-space-y-2">
            <div v-for="item in ratingDistributionData" :key="item.rating" class="tw-flex tw-items-center tw-justify-between tw-text-sm">
              <div class="tw-flex tw-items-center tw-gap-2">
                <div class="tw-flex tw-items-center tw-gap-1">
                  <span class="tw-font-medium">{{ item.rating }}</span>
                  <svg class="tw-w-4 tw-h-4 tw-text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <div class="tw-flex-1 tw-bg-gray-200 tw-rounded-full tw-h-2 tw-w-32">
                  <div 
                    class="tw-h-2 tw-rounded-full"
                    :class="{
                      'tw-bg-green-500': item.rating === 5,
                      'tw-bg-lime-500': item.rating === 4,
                      'tw-bg-amber-500': item.rating === 3,
                      'tw-bg-orange-500': item.rating === 2,
                      'tw-bg-crimson-500': item.rating === 1
                    }"
                    :style="{ width: reviewOverview.totalReviews > 0 ? `${(item.count / reviewOverview.totalReviews * 100)}%` : '0%' }"
                  ></div>
                </div>
              </div>
              <span class="tw-font-medium tw-text-gray-700">{{ item.count }} ({{ reviewOverview.totalReviews > 0 ? ((item.count / reviewOverview.totalReviews) * 100).toFixed(1) : 0 }}%)</span>
            </div>
          </div>
        </div>

        <!-- Review Trends Chart -->
        <div class="tw-bg-white tw-rounded-xl tw-shadow-md tw-p-6">
          <div class="tw-mb-4">
            <h3 class="tw-text-lg tw-font-bold tw-text-gray-900 tw-mb-2">Xu hướng đánh giá (7 ngày)</h3>
            <p class="tw-text-sm tw-text-gray-500">Theo dõi số lượng đánh giá và điểm đánh giá trung bình theo ngày</p>
          </div>
          
          <!-- Custom Legend -->
          <div class="tw-flex tw-items-center tw-gap-6 tw-mb-4 tw-p-3 tw-bg-gray-50 tw-rounded-lg">
            <div class="tw-flex tw-items-center tw-gap-2">
              <div class="tw-w-4 tw-h-4 tw-rounded tw-bg-amber-500"></div>
              <span class="tw-text-sm tw-font-medium tw-text-gray-700">Số đánh giá</span>
              <span class="tw-text-xs tw-text-gray-500 tw-ml-1">(Trục trái)</span>
            </div>
            <div class="tw-flex tw-items-center tw-gap-2">
              <div class="tw-w-4 tw-h-4 tw-rounded tw-bg-green-500"></div>
              <span class="tw-text-sm tw-font-medium tw-text-gray-700">Đánh giá TB</span>
              <span class="tw-text-xs tw-text-gray-500 tw-ml-1">(Trục phải, thang 0-5⭐)</span>
            </div>
          </div>
          
          <div class="tw-h-80">
            <canvas ref="reviewTrendsChartRef"></canvas>
          </div>
        </div>
      </div>

      <!-- Top Reviewed Products Table -->
      <div class="tw-bg-white tw-rounded-xl tw-shadow-md tw-p-6">
        <h3 class="tw-text-lg tw-font-bold tw-text-gray-900 tw-mb-4">Top sản phẩm được đánh giá nhiều nhất</h3>
        <div class="tw-overflow-x-auto">
          <table class="tw-w-full">
            <thead class="tw-bg-amber-50 tw-border-b tw-border-amber-200">
              <tr>
                <th class="tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-font-semibold tw-text-amber-900 tw-uppercase">STT</th>
                <th class="tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-font-semibold tw-text-amber-900 tw-uppercase">Tên sản phẩm</th>
                <th class="tw-px-4 tw-py-3 tw-text-center tw-text-xs tw-font-semibold tw-text-amber-900 tw-uppercase">Số đánh giá</th>
                <th class="tw-px-4 tw-py-3 tw-text-center tw-text-xs tw-font-semibold tw-text-amber-900 tw-uppercase">Đánh giá TB</th>
              </tr>
            </thead>
            <tbody class="tw-divide-y tw-divide-gray-200">
              <tr v-for="(product, index) in topReviewedProducts" :key="product._id" class="hover:tw-bg-gray-50 tw-transition-colors">
                <td class="tw-px-4 tw-py-3 tw-text-sm tw-text-gray-900">{{ index + 1 }}</td>
                <td class="tw-px-4 tw-py-3">
                  <div class="tw-text-sm tw-font-medium tw-text-gray-900">{{ product.productName }}</div>
                </td>
                <td class="tw-px-4 tw-py-3 tw-text-center">
                  <span class="tw-inline-flex tw-items-center tw-px-3 tw-py-1 tw-rounded-full tw-text-sm tw-font-medium tw-bg-amber-100 tw-text-amber-800">
                    {{ product.totalReviews }}
                  </span>
                </td>
                <td class="tw-px-4 tw-py-3 tw-text-center">
                  <div class="tw-flex tw-items-center tw-justify-center tw-gap-1">
                    <span class="tw-text-sm tw-font-bold tw-text-gray-900">{{ product.averageRating.toFixed(1) }}</span>
                    <svg class="tw-w-4 tw-h-4 tw-text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                </td>
              </tr>
              <tr v-if="topReviewedProducts.length === 0">
                <td colspan="4" class="tw-px-4 tw-py-8 tw-text-center tw-text-gray-500">
                  Chưa có dữ liệu
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, defineComponent, h } from 'vue'
import Chart from 'chart.js/auto'
import * as XLSX from 'xlsx'
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
import {
  getReviewsStats,
  getRatingDistribution,
  getTopReviewedProducts,
  getReviewTrends,
  getImageStats
} from '@/api/review/review'

// StatCard Component
const StatCard = defineComponent({
  name: 'StatCard',
  props: {
    title: String,
    value: [String, Number],
    previousValue: [String, Number],
    change: Number,
    icon: String,
    color: String,
    dateRangeText: String,
    previousDateRangeText: String
  },
  setup(props) {
    return () => h('div', {
      class: `tw-bg-white tw-rounded-xl tw-shadow-md tw-p-6 tw-border-t-4 tw-border-${props.color}-500`
    }, [
      // Header với tiêu đề và badge
      h('div', { class: 'tw-flex tw-items-center tw-justify-between tw-mb-4' }, [
        h('h3', { class: `tw-text-lg tw-font-bold tw-text-${props.color}-600` }, props.title),
        h('span', {
          class: [
            'tw-px-3 tw-py-1.5 tw-rounded-full tw-text-sm tw-font-bold tw-shadow-sm',
            props.change! >= 0 ? 'tw-bg-green-100 tw-text-green-700' : 'tw-bg-crimson-100 tw-text-crimson-700'
          ]
        }, `${props.change! >= 0 ? '↑' : '↓'} ${Math.abs(props.change!)}%`)
      ]),
      
      // Kỳ hiện tại
      h('div', { class: 'tw-mb-3' }, [
        h('p', { class: 'tw-text-xs tw-text-gray-500 tw-mb-1' }, `Kỳ này${props.dateRangeText ? ' (' + props.dateRangeText + ')' : ''}`),
        h('p', { class: 'tw-text-3xl tw-font-bold tw-text-gray-900 tw-break-all' }, props.value)
      ]),
      
      // Đường phân cách
      h('div', { class: 'tw-border-t tw-border-dashed tw-border-gray-300 tw-my-3' }),
      
      // Kỳ trước
      h('div', { class: 'tw-flex tw-items-center tw-justify-between' }, [
        h('div', {}, [
          h('p', { class: 'tw-text-xs tw-text-gray-500 tw-mb-1 tw-whitespace-nowrap' }, [
            'Kỳ trước',
            props.previousDateRangeText ? ` (${props.previousDateRangeText})` : ''
          ]),
          h('p', { class: 'tw-text-xl tw-font-semibold tw-text-gray-700 tw-break-all' }, props.previousValue)
        ]),
        h('div', {
          class: [
            'tw-flex tw-items-center tw-gap-1 tw-px-2 tw-py-1 tw-rounded tw-text-xs tw-font-semibold',
            props.change! >= 0 ? 'tw-bg-green-50 tw-text-green-600' : 'tw-bg-crimson-50 tw-text-crimson-600'
          ]
        }, [
          h('svg', {
            class: 'tw-w-4 tw-h-4',
            fill: 'none',
            stroke: 'currentColor',
            viewBox: '0 0 24 24',
            innerHTML: props.change! >= 0 
              ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>'
              : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"/>'
          }),
          h('span', {}, `${props.change! >= 0 ? '+' : ''}${props.change}%`)
        ])
      ])
    ])
  }
})

// Types
interface Customer {
  userId: string
  name: string
  email: string
  avatar: string
  totalOrders: number
  totalSpent: number
  lastOrderDate: string
  memberSince?: string
  ranking?: number // Thêm trường ranking
}

interface CustomerSegment {
  customers: Customer[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Refs for charts
const revenueChartRef = ref<HTMLCanvasElement | null>(null)
const orderStatusChartRef = ref<HTMLCanvasElement | null>(null)
const categoryChartRef = ref<HTMLCanvasElement | null>(null)
const paymentMethodChartRef = ref<HTMLCanvasElement | null>(null)
const peakHoursChartRef = ref<HTMLCanvasElement | null>(null)
const ratingDistributionChartRef = ref<HTMLCanvasElement | null>(null)
const reviewTrendsChartRef = ref<HTMLCanvasElement | null>(null)

// Chart instances để có thể destroy khi update
let revenueChart: Chart | null = null
let orderStatusChart: Chart | null = null
let categoryChart: Chart | null = null
let paymentMethodChart: Chart | null = null
let peakHoursChart: Chart | null = null
let ratingDistributionChart: Chart | null = null
let reviewTrendsChart: Chart | null = null

const dateRange = ref<'7days' | '30days' | '90days' | 'year' | 'custom'>('30days')
const loading = ref(false)

// Data from API
const overview = ref({
  totalRevenue: 0,
  previousRevenue: 0,
  revenueChange: 0,
  totalOrders: 0,
  previousOrders: 0,
  ordersChange: 0,
  newCustomers: 0,
  previousCustomers: 0,
  customersChange: 0,
  avgOrderValue: 0,
  previousAvgOrderValue: 0,
  aovChange: 0,
  dateRange: null as { start: Date; end: Date } | null,
  previousDateRange: null as { start: Date; end: Date } | null
})

const topProducts = ref<any[]>([])
const lowStockProducts = ref<any[]>([])
const revenueTimeline = ref<any[]>([])

// Customer segments data with pagination
const vipCustomers = ref<CustomerSegment>({
  customers: [],
  pagination: { page: 1, limit: 5, total: 0, totalPages: 0 }
})
const frequentCustomers = ref<CustomerSegment>({
  customers: [],
  pagination: { page: 1, limit: 5, total: 0, totalPages: 0 }
})
const newCustomers = ref<CustomerSegment>({
  customers: [],
  pagination: { page: 1, limit: 5, total: 0, totalPages: 0 }
})

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

// Review stats data
const reviewOverview = ref({
  totalReviews: 0,
  averageRating: 0,
  totalHelpful: 0,
  visibleReviews: 0,
  hiddenReviews: 0
})

const topReviewedProducts = ref<any[]>([])
const ratingDistributionData = ref<any[]>([])
const reviewTrendsData = ref<any[]>([])
const imageStats = ref({
  withImages: 0,
  withoutImages: 0,
  total: 0,
  percentage: {
    withImages: 0,
    withoutImages: 0
  }
})

// Data for chart legends
const orderStatusData = ref<any[]>([])
const paymentMethodData = ref<any[]>([])
const peakHoursData = ref<any[]>([])

function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

function formatDateRange(dateRange: { start: Date; end: Date } | null) {
  if (!dateRange) return ''
  const start = new Date(dateRange.start)
  const end = new Date(dateRange.end)
  const formatDate = (date: Date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
  }
  return `${formatDate(start)} - ${formatDate(end)}`
}

function exportReport() {
  try {
    // Tạo workbook mới
    const wb = XLSX.utils.book_new()

    // ==================== SHEET 1: TỔNG QUAN ====================
    const overviewData = [
      ['BÁO CÁO THỐNG KÊ TỔNG HỢP'],
      ['Thời gian xuất:', new Date().toLocaleString('vi-VN')],
      ['Kỳ báo cáo:', formatDateRange(overview.value.dateRange)],
      [],
      ['PHẦN 1: THỐNG KÊ ĐƠN HÀNG'],
      [],
      ['Chỉ số', 'Giá trị hiện tại', 'Kỳ trước', 'Thay đổi (%)'],
      ['Tổng doanh thu', overview.value.totalRevenue, overview.value.previousRevenue, overview.value.revenueChange],
      ['Số đơn hàng', overview.value.totalOrders, overview.value.previousOrders, overview.value.ordersChange],
      ['Khách hàng mới', overview.value.newCustomers, overview.value.previousCustomers, overview.value.customersChange],
      ['Giá trị đơn TB', overview.value.avgOrderValue, overview.value.previousAvgOrderValue, overview.value.aovChange],
      [],
      ['TRẠNG THÁI ĐƠN HÀNG'],
      ['Trạng thái', 'Số lượng', 'Tỷ lệ (%)'],
      ...orderStatusData.value.map((item: any) => [
        item.label,
        item.count,
        item.percentage
      ]),
      [],
      ['PHƯƠNG THỨC THANH TOÁN'],
      ['Phương thức', 'Số đơn', 'Tỷ lệ (%)'],
      ...paymentMethodData.value.map((item: any) => [
        item.label,
        item.count,
        item.percentage
      ])
    ]
    const wsOverview = XLSX.utils.aoa_to_sheet(overviewData)
    XLSX.utils.book_append_sheet(wb, wsOverview, 'Tổng quan')

    // ==================== SHEET 2: SẢN PHẨM ====================
    const productData = [
      ['PHẦN 2: THỐNG KÊ SẢN PHẨM'],
      [],
      ['Tổng số sản phẩm:', productOverview.value.totalProducts],
      ['Số danh mục:', productOverview.value.totalCategories],
      ['Số biến thể:', productOverview.value.totalVariants],
      ['Giá trị kho:', productOverview.value.totalInventoryValue],
      [],
      ['TOP SẢN PHẨM BÁN CHẠY'],
      ['STT', 'Tên sản phẩm', 'Đã bán', 'Doanh thu', 'Tồn kho'],
      ...topProducts.value.map((p: any, idx: number) => [
        idx + 1,
        p.name || 'N/A',
        p.sold || p.soldQuantity || 0,
        p.revenue || 0,
        p.stock || 0,
      ]),
      [],
      ['SẢN PHẨM TỒN KHO THẤP'],
      ['STT', 'Tên sản phẩm', 'Tồn kho', 'Đã bán'],
      ...lowStockProducts.value.map((p: any, idx: number) => [
        idx + 1,
        p.name || 'N/A',
        p.stock || 0,
        p.sold || p.soldQuantity || 0,
      ]),
      [],
      ['TÌNH TRẠNG KHO'],
      ['Loại', 'Số lượng sản phẩm'],
      ['Sắp hết hàng (< 10)', inventory.value.lowStock, ''],
      ['Bình thường (10-50)', inventory.value.normalStock, ''],
      ['Dồi dào (> 50)', inventory.value.highStock, '']
    ]
    const wsProduct = XLSX.utils.aoa_to_sheet(productData)
    XLSX.utils.book_append_sheet(wb, wsProduct, 'Sản phẩm')

    // ==================== SHEET 3: KHÁCH HÀNG ====================
    const customerData = [
      ['PHẦN 3: THỐNG KÊ KHÁCH HÀNG'],
      [],
      ['Tổng người dùng:', customerOverview.value.totalUsers],
      ['Đã xác thực:', customerOverview.value.verifiedUsers],
      ['Người dùng mới:', customerOverview.value.newUsers],
      ['Quản trị viên:', customerOverview.value.adminUsers],
      ['Đã khóa:', customerOverview.value.blockedUsers],
      [],
      ['KHÁCH HÀNG VIP (Top chi tiêu)'],
      ['Hạng', 'Tên', 'Email', 'Tổng đơn', 'Tổng chi tiêu', 'Đơn gần nhất'],
      ...vipCustomers.value.customers.map((c: Customer) => [
        c.ranking,
        c.name,
        c.email,
        c.totalOrders,
        c.totalSpent,
        formatDate(c.lastOrderDate)
      ]),
      [],
      ['KHÁCH HÀNG THƯỜNG XUYÊN'],
      ['Hạng', 'Tên', 'Email', 'Tổng đơn', 'Tổng chi tiêu', 'Đơn gần nhất'],
      ...frequentCustomers.value.customers.map((c: Customer) => [
        c.ranking,
        c.name,
        c.email,
        c.totalOrders,
        c.totalSpent,
        formatDate(c.lastOrderDate)
      ]),
      [],
      ['KHÁCH HÀNG MỚI'],
      ['Hạng', 'Tên', 'Email', 'Tổng đơn', 'Tổng chi tiêu', 'Ngày đăng ký'],
      ...newCustomers.value.customers.map((c: Customer) => [
        c.ranking,
        c.name,
        c.email,
        c.totalOrders,
        c.totalSpent,
        formatDate(c.memberSince || '')
      ])
    ]
    const wsCustomer = XLSX.utils.aoa_to_sheet(customerData)
    XLSX.utils.book_append_sheet(wb, wsCustomer, 'Khách hàng')

    // ==================== SHEET 4: ĐÁNH GIÁ ====================
    const reviewData = [
      ['PHẦN 4: THỐNG KÊ ĐÁNH GIÁ SẢN PHẨM'],
      [],
      ['Tổng đánh giá:', reviewOverview.value.totalReviews],
      ['Đánh giá trung bình:', reviewOverview.value.averageRating + '/5'],
      ['Lượt hữu ích:', reviewOverview.value.totalHelpful],
      ['Có hình ảnh:', imageStats.value.percentage.withImages + '%'],
      [],
      ['PHÂN BỐ ĐÁNH GIÁ THEO SAO'],
      ['Số sao', 'Số lượng', 'Tỷ lệ (%)'],
      ...ratingDistributionData.value.map((item: any) => {
        const total = ratingDistributionData.value.reduce((sum, i) => sum + (i.count || 0), 0)
        const percentage = total > 0 ? ((item.count / total) * 100).toFixed(1) : '0.0'
        return [
          item.rating + ' sao',
          item.count || 0,
          percentage
        ]
      }),
      [],
      ['TOP SẢN PHẨM ĐƯỢC ĐÁNH GIÁ NHIỀU NHẤT'],
      ['STT', 'Tên sản phẩm', 'Số đánh giá', 'Đánh giá TB', 'Có hình ảnh'],
      ...topReviewedProducts.value.map((p: any, idx: number) => [
        idx + 1,
        p.productName || 'N/A',
        p.totalReviews || 0,
        p.averageRating ? p.averageRating.toFixed(1) : '0.0',
        p.reviewsWithImages || p.withImages || 0
      ])
    ]
    const wsReview = XLSX.utils.aoa_to_sheet(reviewData)
    XLSX.utils.book_append_sheet(wb, wsReview, 'Đánh giá')

    // ==================== SHEET 5: DOANH THU THEO THỜI GIAN ====================
    const revenueTimelineData = [
      ['DOANH THU THEO THỜI GIAN'],
      [],
      ['Ngày', 'Doanh thu', 'Số đơn'],
      ...revenueTimeline.value.map((item: any) => [
        item.label,
        item.revenue,
        item.orders
      ])
    ]
    const wsRevenue = XLSX.utils.aoa_to_sheet(revenueTimelineData)
    XLSX.utils.book_append_sheet(wb, wsRevenue, 'Doanh thu theo ngày')

    // ==================== SHEET 6: GIỜ CAO ĐIỂM ====================
    const peakHoursData_sheet = [
      ['GIỜ CAO ĐIỂM ĐẶT HÀNG'],
      [],
      ['Giờ', 'Số đơn hàng'],
      ...peakHoursData.value.map((item: any) => [
        item.label || 'N/A',
        item.orders || 0
      ])
    ]
    const wsPeakHours = XLSX.utils.aoa_to_sheet(peakHoursData_sheet)
    XLSX.utils.book_append_sheet(wb, wsPeakHours, 'Giờ cao điểm')

    // Xuất file
    const fileName = `Bao-cao-thong-ke-${new Date().toISOString().split('T')[0]}.xlsx`
    XLSX.writeFile(wb, fileName)

    alert('✅ Xuất báo cáo thành công!')
  } catch (error) {
    console.error('Lỗi xuất báo cáo:', error)
    alert('❌ Có lỗi xảy ra khi xuất báo cáo. Vui lòng thử lại!')
  }
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

function formatDate(date: string | Date | undefined) {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('vi-VN')
}

// Pagination handlers
async function changeVipPage(page: number) {
  vipCustomers.value.pagination.page = page
  await fetchCustomerSegment('vip', page, vipCustomers.value.pagination.limit)
}

async function changeFrequentPage(page: number) {
  frequentCustomers.value.pagination.page = page
  await fetchCustomerSegment('frequent', page, frequentCustomers.value.pagination.limit)
}

async function changeNewPage(page: number) {
  newCustomers.value.pagination.page = page
  await fetchCustomerSegment('new', page, newCustomers.value.pagination.limit)
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
      fetchAllCustomerSegments(),
      fetchCustomerOverview(),
      fetchReviewOverview(),
      fetchRatingDistribution(),
      fetchTopReviewedProducts(),
      fetchReviewTrends(),
      fetchImageStats()
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
      revenueTimeline.value = res.data // Lưu data để export Excel
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
async function fetchCustomerSegment(segment: 'vip' | 'frequent' | 'new', page: number, limit: number) {
  try {
    console.log(`Fetching ${segment} customers, page ${page}, limit ${limit}`)
    const res: any = await getCustomerSegments({ segment, page, limit })
    console.log(`${segment} response:`, res)
    if (res?.success && res.data) {
      if (segment === 'vip') {
        vipCustomers.value = {
          customers: res.data.customers,
          pagination: res.data.pagination
        }
        console.log('VIP customers updated:', vipCustomers.value)
      } else if (segment === 'frequent') {
        frequentCustomers.value = {
          customers: res.data.customers,
          pagination: res.data.pagination
        }
      } else if (segment === 'new') {
        newCustomers.value = {
          customers: res.data.customers,
          pagination: res.data.pagination
        }
      }
    }
  } catch (error) {
    console.error(`Error fetching ${segment} customers:`, error)
  }
}

async function fetchAllCustomerSegments() {
  // Fetch all 3 segments in parallel
  await Promise.all([
    fetchCustomerSegment('vip', 1, 5),
    fetchCustomerSegment('frequent', 1, 5),
    fetchCustomerSegment('new', 1, 5)
  ])
}

async function fetchTopCustomers() {
  // This function is no longer needed but kept for compatibility
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

// Review stats functions
async function fetchReviewOverview() {
  try {
    const res: any = await getReviewsStats()
    if (res?.success && res.data) {
      reviewOverview.value = {
        totalReviews: res.data.overall.totalReviews,
        averageRating: res.data.overall.averageRating,
        totalHelpful: res.data.overall.totalHelpful,
        visibleReviews: res.data.byVisibility.visible,
        hiddenReviews: res.data.byVisibility.hidden
      }
    }
  } catch (error) {
    console.error('Error fetching review overview:', error)
  }
}

async function fetchRatingDistribution() {
  try {
    const res: any = await getRatingDistribution()
    if (res?.success && res.data) {
      ratingDistributionData.value = res.data
      updateRatingDistributionChart(res.data)
    }
  } catch (error) {
    console.error('Error fetching rating distribution:', error)
  }
}

async function fetchTopReviewedProducts() {
  try {
    const res: any = await getTopReviewedProducts({ limit: 5 })
    if (res?.success && res.data) {
      topReviewedProducts.value = res.data
    }
  } catch (error) {
    console.error('Error fetching top reviewed products:', error)
  }
}

async function fetchReviewTrends() {
  try {
    const res: any = await getReviewTrends({ days: 7 })
    if (res?.success && res.data) {
      reviewTrendsData.value = res.data
      updateReviewTrendsChart(res.data)
    }
  } catch (error) {
    console.error('Error fetching review trends:', error)
  }
}

async function fetchImageStats() {
  try {
    const res: any = await getImageStats()
    if (res?.success && res.data) {
      imageStats.value = res.data
    }
  } catch (error) {
    console.error('Error fetching image stats:', error)
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
  const labels = data.map(item => item.label)
  const counts = data.map(item => item.count)
  const total = counts.reduce((sum, val) => sum + val, 0)
  
  const colors = {
    'Hoàn thành': '#10b981',
    'Đang giao': '#3b82f6',
    'Chờ xử lý': '#f59e0b',
    'Đã hủy': '#ef4444',
    'Đã xác nhận': '#8b5cf6',
    'Đang chuẩn bị': '#f97316',
    'Sẵn sàng giao': '#06b6d4',
    'Đã giao': '#14b8a6',
    'Chờ thanh toán': '#a855f7',
    'Thanh toán thất bại': '#dc2626',
    'Đã trả hàng': '#6b7280'
  }
  const backgroundColors = labels.map(label => colors[label as keyof typeof colors] || '#6b7280')
  
  // Save and sort data from highest to lowest
  orderStatusData.value = labels.map((label, index) => ({
    label,
    count: counts[index],
    percentage: ((counts[index] / total) * 100).toFixed(1),
    color: backgroundColors[index]
  })).sort((a, b) => b.count - a.count)
  
  // Render pie chart
  if (!orderStatusChartRef.value) return
  
  if (orderStatusChart) {
    orderStatusChart.destroy()
  }
  
  orderStatusChart = new Chart(orderStatusChartRef.value, {
    type: 'doughnut',
    data: {
      labels: orderStatusData.value.map(item => item.label),
      datasets: [{
        data: orderStatusData.value.map(item => item.count),
        backgroundColor: orderStatusData.value.map(item => item.color)
      }]
    },
    options: { 
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context: any) {
              const label = context.label || ''
              const value = context.parsed || 0
              const percentage = ((value / total) * 100).toFixed(1)
              return `${label}: ${value} đơn (${percentage}%)`
            }
          }
        }
      }
    }
  })
  
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
          display: false // Ẩn legend mặc định vì dùng custom legend
        },
        tooltip: {
          callbacks: {
            label: function(context: any) {
              const label = context.label || ''
              const value = context.parsed || 0
              const percentage = ((value / total) * 100).toFixed(1)
              return `${label}: ${value} đơn (${percentage}%)`
            }
          }
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

function initPaymentMethodChart() {
  // Sẽ được khởi tạo khi có data từ API
}

function updatePaymentMethodChart(data: any[]) {
  const labels = data.map(item => item.label)
  const percentages = data.map(item => item.percentage)
  const counts = data.map(item => item.count || 0)
  const revenues = data.map(item => item.revenue || 0)
  
  const colorMap = {
    'COD': '#f59e0b',
    'VNPAY': '#10b981',
    'MoMo': '#d946ef',
    'ZaloPay': '#3b82f6',
    'PayPal': '#0ea5e9',
    'Thẻ tín dụng': '#8b5cf6',
    'Thanh toán khi nhận hàng': '#f59e0b'
  }
  const backgroundColors = labels.map(label => colorMap[label as keyof typeof colorMap] || '#6b7280')
  
  // Save and sort data from highest to lowest by count
  paymentMethodData.value = labels.map((label, index) => ({
    label,
    count: counts[index],
    revenue: revenues[index],
    percentage: percentages[index].toFixed(1),
    color: backgroundColors[index]
  })).sort((a, b) => b.count - a.count)
  
  // Render pie chart
  if (!paymentMethodChartRef.value) return
  
  if (paymentMethodChart) {
    paymentMethodChart.destroy()
  }
  
  paymentMethodChart = new Chart(paymentMethodChartRef.value, {
    type: 'doughnut',
    data: {
      labels: paymentMethodData.value.map(item => item.label),
      datasets: [{
        data: paymentMethodData.value.map(item => item.count),
        backgroundColor: paymentMethodData.value.map(item => item.color)
      }]
    },
    options: { 
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context: any) {
              const label = context.label || ''
              const value = context.parsed || 0
              const item = paymentMethodData.value.find(i => i.label === label)
              return `${label}: ${value} đơn (${item?.percentage}%)`
            }
          }
        }
      }
    }
  })
  
  paymentMethodChart = new Chart(paymentMethodChartRef.value, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data: percentages,
        backgroundColor: backgroundColors
      }]
    },
    options: { 
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false // Ẩn legend mặc định
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || ''
              const value = context.parsed || 0
              const count = counts[context.dataIndex] || 0
              return `${label}: ${count} đơn (${value.toFixed(1)}%)`
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
  
  // Save for display
  peakHoursData.value = data
  
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
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 5
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `Số đơn: ${context.parsed.y}`
            }
          }
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

// Review chart update functions
function updateRatingDistributionChart(data: any[]) {
  if (!ratingDistributionChartRef.value) return
  
  if (ratingDistributionChart) {
    ratingDistributionChart.destroy()
  }
  
  const labels = data.map(item => `${item.rating} sao`)
  const counts = data.map(item => item.count)
  
  const colors = ['#10b981', '#84cc16', '#eab308', '#f97316', '#ef4444']
  
  ratingDistributionChart = new Chart(ratingDistributionChartRef.value, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Số lượng đánh giá',
        data: counts,
        backgroundColor: colors,
        borderWidth: 0
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `Số đánh giá: ${context.parsed.x}`
            }
          }
        }
      }
    }
  })
}

function updateReviewTrendsChart(data: any[]) {
  if (!reviewTrendsChartRef.value) return
  
  if (reviewTrendsChart) {
    reviewTrendsChart.destroy()
  }
  
  const labels = data.map(item => {
    const date = new Date(item._id)
    return `${date.getDate()}/${date.getMonth() + 1}`
  })
  const counts = data.map(item => item.count)
  const avgRatings = data.map(item => item.averageRating)
  
  reviewTrendsChart = new Chart(reviewTrendsChartRef.value, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Số đánh giá',
          data: counts,
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          tension: 0.3,
          yAxisID: 'y'
        },
        {
          label: 'Đánh giá TB',
          data: avgRatings,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.3,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      scales: {
        y: {
          type: 'linear',
          position: 'left',
          beginAtZero: true,
          title: {
            display: true,
            text: 'Số đánh giá'
          }
        },
        y1: {
          type: 'linear',
          position: 'right',
          min: 0,
          max: 5,
          title: {
            display: true,
            text: 'Đánh giá TB'
          },
          grid: {
            drawOnChartArea: false
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top'
        }
      }
    }
  })
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



