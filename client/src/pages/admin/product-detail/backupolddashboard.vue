<template>
  <div class="tw-p-6 tw-bg-white tw-min-h-screen">
    <!-- Header -->
    <div class="tw-mb-6">
      <h1 class="tw-text-3xl tw-font-bold tw-text-crimson-600">Dashboard</h1>
    </div>

      <!-- Top Statistics Cards - 6 cards -->
      <div class="tw-grid tw-grid-cols-2 md:tw-grid-cols-3 lg:tw-grid-cols-5 tw-gap-4 tw-mb-6">
        <!-- Customers -->
        <div class="tw-bg-white tw-rounded-xl tw-shadow-sm tw-p-4 tw-border tw-border-stone-200 hover:tw-shadow-md tw-transition-shadow">
          <div class="tw-flex tw-items-center tw-gap-3">
            <div class="tw-w-12 tw-h-12 tw-bg-crimson-100 tw-rounded-lg tw-flex tw-items-center tw-justify-center">
              <svg class="tw-w-6 tw-h-6 tw-text-crimson-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <div class="tw-text-2xl tw-font-bold tw-text-stone-800">{{ stats.customers || 1000 }}</div>
              <div class="tw-text-xs tw-text-stone-500 tw-uppercase">Khách hàng</div>
            </div>
          </div>
        </div>

        <!-- Revenue -->
        <div class="tw-bg-white tw-rounded-xl tw-shadow-sm tw-p-4 tw-border tw-border-stone-200 hover:tw-shadow-md tw-transition-shadow">
          <div class="tw-flex tw-items-center tw-gap-3">
            <div class="tw-w-12 tw-h-12 tw-bg-crimson-100 tw-rounded-lg tw-flex tw-items-center tw-justify-center">
              <svg class="tw-w-6 tw-h-6 tw-text-crimson-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div class="tw-text-2xl tw-font-bold tw-text-stone-800">${{ stats.revenue || 1252 }}</div>
              <div class="tw-text-xs tw-text-stone-500 tw-uppercase">Doanh thu</div>
            </div>
          </div>
        </div>

        <!-- Growth -->
        <div class="tw-bg-white tw-rounded-xl tw-shadow-sm tw-p-4 tw-border tw-border-stone-200 hover:tw-shadow-md tw-transition-shadow">
          <div class="tw-flex tw-items-center tw-gap-3">
            <div class="tw-w-12 tw-h-12 tw-bg-crimson-100 tw-rounded-lg tw-flex tw-items-center tw-justify-center">
              <svg class="tw-w-6 tw-h-6 tw-text-crimson-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <div class="tw-text-2xl tw-font-bold tw-text-stone-800">{{ stats.growth || 600 }}</div>
              <div class="tw-text-xs tw-text-stone-500 tw-uppercase">Tăng trưởng</div>
            </div>
          </div>
        </div>

        <!-- Returns -->
        <div class="tw-bg-white tw-rounded-xl tw-shadow-sm tw-p-4 tw-border tw-border-stone-200 hover:tw-shadow-md tw-transition-shadow">
          <div class="tw-flex tw-items-center tw-gap-3">
            <div class="tw-w-12 tw-h-12 tw-bg-crimson-100 tw-rounded-lg tw-flex tw-items-center tw-justify-center">
              <svg class="tw-w-6 tw-h-6 tw-text-crimson-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </div>
            <div>
              <div class="tw-text-2xl tw-font-bold tw-text-stone-800">{{ stats.returns || 3550 }}</div>
              <div class="tw-text-xs tw-text-stone-500 tw-uppercase">Hàng hoàn</div>
            </div>
          </div>
        </div>

        <!-- Orders -->
        <div class="tw-bg-white tw-rounded-xl tw-shadow-sm tw-p-4 tw-border tw-border-stone-200 hover:tw-shadow-md tw-transition-shadow">
          <div class="tw-flex tw-items-center tw-gap-3">
            <div class="tw-w-12 tw-h-12 tw-bg-crimson-100 tw-rounded-lg tw-flex tw-items-center tw-justify-center">
              <svg class="tw-w-6 tw-h-6 tw-text-crimson-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <div class="tw-text-2xl tw-font-bold tw-text-stone-800">{{ stats.orderPercent || 100 }}%</div>
              <div class="tw-text-xs tw-text-stone-500 tw-uppercase">Đơn hàng</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="tw-grid tw-grid-cols-1 lg:tw-grid-cols-3 tw-gap-6">
        
        <!-- Left Column - 2/3 width -->
        <div class="lg:tw-col-span-2 tw-space-y-6">
          
          <!-- Conversion Rate & Order Delivered -->
          <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-6">
            <!-- Conversion Rate -->
            <div class="tw-bg-white tw-rounded-xl tw-shadow-sm tw-p-6 tw-border tw-border-stone-200">
              <h3 class="tw-text-2xl tw-font-bold tw-text-stone-800 tw-mb-1">53.94%</h3>
              <p class="tw-text-sm tw-font-medium tw-text-stone-600 tw-mb-2">Tỷ lệ chuyển đổi</p>
              <p class="tw-text-xs tw-text-stone-500 tw-mb-4">Tỷ lệ khách truy cập website biến thành người mua</p>
              <div class="tw-h-32">
                <canvas ref="conversionChart"></canvas>
              </div>
              <div class="tw-flex tw-justify-around tw-mt-4 tw-pt-4 tw-border-t tw-border-stone-200">
                <div class="tw-text-center">
                  <div class="tw-text-xl tw-font-bold tw-text-white tw-bg-crimson-600 tw-rounded-lg tw-px-3 tw-py-1">10</div>
                  <div class="tw-text-xs tw-text-stone-500 tw-mt-1">2018</div>
                </div>
                <div class="tw-text-center">
                  <div class="tw-text-xl tw-font-bold tw-text-white tw-bg-crimson-600 tw-rounded-lg tw-px-3 tw-py-1">15</div>
                  <div class="tw-text-xs tw-text-stone-500 tw-mt-1">2017</div>
                </div>
                <div class="tw-text-center">
                  <div class="tw-text-xl tw-font-bold tw-text-white tw-bg-crimson-600 tw-rounded-lg tw-px-3 tw-py-1">13</div>
                  <div class="tw-text-xs tw-text-stone-500 tw-mt-1">2016</div>
                </div>
              </div>
            </div>

            <!-- Order Delivered -->
            <div class="tw-bg-white tw-rounded-xl tw-shadow-sm tw-p-6 tw-border tw-border-stone-200">
              <h3 class="tw-text-2xl tw-font-bold tw-text-stone-800 tw-mb-1">1432</h3>
              <p class="tw-text-sm tw-font-medium tw-text-stone-600 tw-mb-2">Đơn hàng đã giao</p>
              <p class="tw-text-xs tw-text-stone-500 tw-mb-4">Tổng số đơn hàng đã giao trong tháng</p>
              <div class="tw-flex tw-justify-around tw-mb-4">
                <div class="tw-text-center">
                  <div class="tw-text-2xl tw-font-bold tw-text-crimson-600">130</div>
                  <div class="tw-text-xs tw-text-stone-500">May</div>
                </div>
                <div class="tw-text-center">
                  <div class="tw-text-2xl tw-font-bold tw-text-crimson-600">251</div>
                  <div class="tw-text-xs tw-text-stone-500">June</div>
                </div>
                <div class="tw-text-center">
                  <div class="tw-text-2xl tw-font-bold tw-text-crimson-600">235</div>
                  <div class="tw-text-xs tw-text-stone-500">July</div>
                </div>
              </div>
              <div class="tw-h-32">
                <canvas ref="orderChart"></canvas>
              </div>
            </div>
          </div>

          <!-- Sales Report -->
          <div class="tw-bg-white tw-rounded-xl tw-shadow-sm tw-p-6 tw-border tw-border-stone-200">
            <div class="tw-flex tw-items-center tw-justify-between tw-mb-4">
              <h3 class="tw-text-lg tw-font-semibold tw-text-stone-800">Báo cáo doanh số</h3>
              <div class="tw-flex tw-gap-4">
                <div class="tw-flex tw-items-center tw-gap-2">
                  <div class="tw-w-3 tw-h-3 tw-bg-crimson-600 tw-rounded-full"></div>
                  <span class="tw-text-sm tw-text-stone-600">Tổng doanh thu</span>
                </div>
                <div class="tw-flex tw-items-center tw-gap-2">
                  <div class="tw-w-3 tw-h-3 tw-bg-crimson-300 tw-rounded-full"></div>
                  <span class="tw-text-sm tw-text-stone-600">Trung bình</span>
                </div>
              </div>
            </div>
            <div class="tw-grid tw-grid-cols-2 tw-gap-4 tw-mb-4">
              <div>
                <div class="tw-text-3xl tw-font-bold tw-text-stone-800">${{ salesData.total || '21,356.46' }}</div>
                <div class="tw-text-sm tw-text-stone-500">Tổng doanh thu</div>
              </div>
              <div>
                <div class="tw-text-3xl tw-font-bold tw-text-stone-800">${{ salesData.average || '1935.6' }}</div>
                <div class="tw-text-sm tw-text-stone-500">Trung bình</div>
              </div>
            </div>
            <div class="tw-h-64">
              <canvas ref="salesChart"></canvas>
            </div>
          </div>

          <!-- Customer Satisfaction -->
          <div class="tw-bg-white tw-rounded-xl tw-shadow-sm tw-p-6 tw-border tw-border-stone-200">
            <h3 class="tw-text-lg tw-font-semibold tw-text-stone-800 tw-mb-2">Mức độ hài lòng của khách hàng</h3>
            <p class="tw-text-sm tw-text-stone-500 tw-mb-6">Cần nỗ lực liên tục để duy trì mức độ hài lòng cao của khách hàng, cả bên trong và bên ngoài</p>
            <div class="tw-flex tw-items-center tw-justify-center">
              <div class="tw-w-64 tw-h-64">
                <canvas ref="satisfactionChart"></canvas>
              </div>
              <div class="tw-ml-8 tw-space-y-3">
                <div class="tw-flex tw-items-center tw-gap-2">
                  <div class="tw-w-4 tw-h-4 tw-bg-crimson-700 tw-rounded-sm"></div>
                  <span class="tw-text-sm tw-text-stone-600">Rất không hài lòng</span>
                </div>
                <div class="tw-flex tw-items-center tw-gap-2">
                  <div class="tw-w-4 tw-h-4 tw-bg-crimson-500 tw-rounded-sm"></div>
                  <span class="tw-text-sm tw-text-stone-600">Hài lòng</span>
                </div>
                <div class="tw-flex tw-items-center tw-gap-2">
                  <div class="tw-w-4 tw-h-4 tw-bg-crimson-400 tw-rounded-sm"></div>
                  <span class="tw-text-sm tw-text-stone-600">Rất hài lòng</span>
                </div>
                <div class="tw-flex tw-items-center tw-gap-2">
                  <div class="tw-w-4 tw-h-4 tw-bg-crimson-200 tw-rounded-sm"></div>
                  <span class="tw-text-sm tw-text-stone-600">Không hài lòng</span>
                </div>
              </div>
            </div>
          </div>

          <!-- New Products Table -->
          <div class="tw-bg-white tw-rounded-xl tw-shadow-sm tw-p-6 tw-border tw-border-stone-200">
            <h3 class="tw-text-lg tw-font-semibold tw-text-stone-800 tw-mb-4">Sản phẩm mới</h3>
            <div class="tw-overflow-x-auto">
              <table class="tw-w-full">
                <thead>
                  <tr class="tw-border-b tw-border-stone-200">
                    <th class="tw-text-left tw-py-3 tw-text-sm tw-font-medium tw-text-stone-600">Product</th>
                    <th class="tw-text-left tw-py-3 tw-text-sm tw-font-medium tw-text-stone-600">Status</th>
                    <th class="tw-text-left tw-py-3 tw-text-sm tw-font-medium tw-text-stone-600">Price</th>
                    <th class="tw-text-center tw-py-3 tw-text-sm tw-font-medium tw-text-stone-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="product in recentProducts" :key="product.id" class="tw-border-b tw-border-stone-100 hover:tw-bg-stone-50">
                    <td class="tw-py-3 tw-text-sm tw-text-stone-700">{{ product.name }}</td>
                    <td class="tw-py-3">
                      <span class="tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-font-medium" 
                            :class="{
                              'tw-bg-green-100 tw-text-green-700': product.status === 'Success',
                              'tw-bg-crimson-100 tw-text-crimson-700': product.status === 'Cancel',
                              'tw-bg-amber-100 tw-text-amber-700': product.status === 'Pending'
                            }">
                        {{ product.status }}
                      </span>
                    </td>
                    <td class="tw-py-3 tw-text-sm tw-text-stone-700">${{ product.price }}</td>
                    <td class="tw-py-3 tw-text-center">
                      <button class="tw-text-blue-600 hover:tw-text-blue-700 tw-mr-3">
                        <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button class="tw-text-crimson-600 hover:tw-text-crimson-700">
                        <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <!-- Right Column - 1/3 width -->
        <div class="tw-space-y-6">
          
          <!-- Total Profit -->
          <div class="tw-bg-white tw-rounded-xl tw-shadow-sm tw-p-6 tw-border tw-border-stone-200">
            <div class="tw-flex tw-items-start tw-justify-between">
              <div>
                <p class="tw-text-sm tw-font-medium tw-text-stone-600 tw-mb-1">Lợi nhuận</p>
                <p class="tw-text-3xl tw-font-bold tw-text-stone-800">${{ profit.total || '1,783' }}</p>
              </div>
              <div class="tw-w-12 tw-h-12 tw-bg-purple-100 tw-rounded-lg tw-flex tw-items-center tw-justify-center">
                <svg class="tw-w-6 tw-h-6 tw-text-crimson-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Total Orders -->
          <div class="tw-bg-gradient-to-br tw-from-crimson-600 tw-to-purple-700 tw-rounded-xl tw-shadow-lg tw-p-6 tw-text-white">
            <div class="tw-flex tw-items-start tw-justify-between">
              <div>
                <p class="tw-text-sm tw-font-medium tw-text-purple-100 tw-mb-1">Tổng số đơn hàng</p>
                <p class="tw-text-3xl tw-font-bold">{{ orders.total || '15,830' }}</p>
              </div>
              <div class="tw-w-12 tw-h-12 tw-bg-white/20 tw-rounded-lg tw-flex tw-items-center tw-justify-center">
                <svg class="tw-w-6 tw-h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Average Price & Product Sold -->
          <div class="tw-grid tw-grid-cols-1 tw-gap-4">
            <div class="tw-bg-gradient-to-br tw-from-crimson-500 tw-to-purple-600 tw-rounded-xl tw-shadow-md tw-p-5 tw-text-white">
              <div class="tw-flex tw-items-start tw-justify-between">
                <div>
                  <p class="tw-text-xs tw-font-medium tw-text-purple-100 tw-mb-1">Giá bán trung bình</p>
                  <p class="tw-text-2xl tw-font-bold">${{ avgPrice || '6,780' }}</p>
                </div>
                <div class="tw-w-10 tw-h-10 tw-bg-white/20 tw-rounded-lg tw-flex tw-items-center tw-justify-center">
                  <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div class="tw-bg-white tw-rounded-xl tw-shadow-sm tw-p-5 tw-border tw-border-stone-200">
              <div class="tw-flex tw-items-start tw-justify-between">
                <div>
                  <p class="tw-text-xs tw-font-medium tw-text-stone-600 tw-mb-1">Sản phẩm đã bán</p>
                  <p class="tw-text-2xl tw-font-bold tw-text-stone-800">{{ productSold || '6,784' }}</p>
                </div>
                <div class="tw-w-10 tw-h-10 tw-bg-purple-100 tw-rounded-lg tw-flex tw-items-center tw-justify-center">
                  <svg class="tw-w-5 tw-h-5 tw-text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Feeds / Activity -->
          <div class="tw-bg-white tw-rounded-xl tw-shadow-sm tw-p-6 tw-border tw-border-stone-200">
            <h3 class="tw-text-lg tw-font-semibold tw-text-stone-800 tw-mb-4">Bảng tin</h3>
            <div class="tw-space-y-4">
              <div v-for="feed in feeds" :key="feed.id" class="tw-flex tw-items-start tw-gap-3 tw-pb-4 tw-border-b tw-border-stone-100 last:tw-border-0 last:tw-pb-0">
                <div class="tw-w-10 tw-h-10 tw-rounded-lg tw-flex tw-items-center tw-justify-center tw-flex-shrink-0"
                     :class="{
                       'tw-bg-blue-100': feed.type === 'bell',
                       'tw-bg-green-100': feed.type === 'file',
                       'tw-bg-crimson-100': feed.type === 'cart'
                     }">
                  <svg v-if="feed.type === 'bell'" class="tw-w-5 tw-h-5 tw-text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <svg v-if="feed.type === 'file'" class="tw-w-5 tw-h-5 tw-text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <svg v-if="feed.type === 'cart'" class="tw-w-5 tw-h-5 tw-text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div class="tw-flex-1">
                  <p class="tw-text-sm tw-text-stone-700 tw-font-medium">{{ feed.message }}</p>
                  <p class="tw-text-xs tw-text-stone-500 tw-mt-1">{{ feed.time }}</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

// Chart refs
const conversionChart = ref(null)
const orderChart = ref(null)
const salesChart = ref(null)
const satisfactionChart = ref(null)

// Data
const stats = ref({
  customers: 1000,
  revenue: 1252,
  growth: 600,
  returns: 3550,
  downloads: 3550,
  orderPercent: 100
})

const salesData = ref({
  total: '21,356.46',
  average: '1935.6'
})

const profit = ref({ total: '1,783' })
const orders = ref({ total: '15,830' })
const avgPrice = ref('6,780')
const productSold = ref('6,784')

const recentProducts = ref([
  { id: 1, name: 'iPhone 6', status: 'Cancel', price: 20 },
  { id: 2, name: 'Jacket', status: 'Success', price: 35 },
  { id: 3, name: 'Sofa', status: 'Cancel', price: 85 },
  { id: 4, name: 'iPhone 6', status: 'Success', price: 20 },
  { id: 5, name: 'HeadPhone', status: 'Pending', price: 50 },
  { id: 6, name: 'iPhone 6', status: 'Cancel', price: 30 }
])

const feeds = ref([
  { id: 1, type: 'bell', message: 'You have 4 tasks Done.', time: '1 hours ago' },
  { id: 2, type: 'file', message: 'You have 2 pending tasks.', time: 'Just Now' },
  { id: 3, type: 'cart', message: 'New order received', time: '4 hours ago' },
  { id: 4, type: 'cart', message: 'New order Done', time: 'Just Now' },
  { id: 5, type: 'file', message: 'You have 5 pending tasks.', time: '5 hours ago' },
  { id: 6, type: 'bell', message: 'You have 4 tasks Done.', time: '2 hours ago' }
])

// Initialize charts
onMounted(async () => {
  await nextTick()
  initConversionChart()
  initOrderChart()
  initSalesChart()
  initSatisfactionChart()
})

function initConversionChart() {
  if (!conversionChart.value) return
  
  const ctx = conversionChart.value.getContext('2d')
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        data: [30, 45, 38, 50, 42, 55, 48, 52, 45, 50, 42, 48],
        borderColor: '#dc143c',
        backgroundColor: 'rgba(220, 20, 60, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { display: false },
        y: { display: false }
      }
    }
  })
}

function initOrderChart() {
  if (!orderChart.value) return
  
  const ctx = orderChart.value.getContext('2d')
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'],
      datasets: [{
        data: [40, 55, 48, 60, 45, 70, 55, 50, 65, 45, 60, 55, 70, 50, 65],
        backgroundColor: '#dc143c',
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { display: false },
        y: { display: false }
      }
    }
  })
}

function initSalesChart() {
  if (!salesChart.value) return
  
  const ctx = salesChart.value.getContext('2d')
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['2003', 'Feb 03', 'Mar 03', 'Apr 03', 'May 03', 'Jun 03', 'Jul 03', 'Aug 03', 'Sep 03', 'Oct 03', 'Nov 03'],
      datasets: [
        {
          type: 'line',
          label: 'Average',
          data: [25, 20, 30, 22, 28, 35, 60, 48, 55, 38, 35],
          borderColor: '#fca5a5',
          backgroundColor: 'transparent',
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 0
        },
        {
          label: 'Total Sales',
          data: [22, 8, 20, 25, 10, 20, 38, 20, 45, 22, 28],
          backgroundColor: '#dc143c',
          borderRadius: 6,
          barThickness: 20
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: '#f3f4f6' },
          ticks: { stepSize: 20 }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  })
}

function initSatisfactionChart() {
  if (!satisfactionChart.value) return
  
  const ctx = satisfactionChart.value.getContext('2d')
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Very Poor', 'Satisfied', 'Very Satisfied', 'Poor'],
      datasets: [{
        data: [35.5, 26.9, 21.5, 16.1],
        backgroundColor: ['#dc143c', '#ef4444', '#fca5a5', '#fee2e2'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
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
</script>

<route lang="yaml">
name: Admin Dashboard Old
meta:
  layout: admin
  requiresAuth: true
  adminOnly: true
  path: /admin/dashboard-old
</route>

