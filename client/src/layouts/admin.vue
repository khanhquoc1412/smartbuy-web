<template>
  <div id="admin-app" class="tw-min-h-screen tw-bg-stone-50">
    <!-- Header -->
    <header class="tw-fixed tw-top-0 tw-left-0 tw-right-0 tw-h-16 tw-bg-gradient-to-r tw-from-crimson-600 tw-to-crimson-600 tw-shadow-lg tw-z-50">
      <div class="tw-flex tw-items-center tw-justify-between tw-h-full tw-px-4">
        <!-- Left Section -->
        <div class="tw-flex tw-items-center tw-gap-3">
          <button 
            @click="drawer = !drawer" 
            class="tw-p-2 tw-rounded-lg tw-text-white hover:tw-bg-white/10 tw-transition-colors"
          >
            <svg class="tw-w-6 tw-h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <router-link to="/" class="tw-flex tw-items-center tw-gap-3 tw-text-white tw-no-underline hover:tw-scale-105 tw-transition-transform">
            <span class="tw-text-lg tw-font-bold tw-tracking-wide">SmartBuy Admin</span>
          </router-link>
        </div>

        <!-- Right Section -->
        <div class="tw-flex tw-items-center tw-gap-2">
          <div class="tw-relative settings-dropdown-container">
            <button 
              @click="showSettingsMenu = !showSettingsMenu"
              class="tw-p-2 tw-rounded-lg tw-text-white hover:tw-bg-white/10 tw-transition-colors"
              title="Cài đặt"
            >
              <svg class="tw-w-6 tw-h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            <!-- Settings Dropdown -->
            <div 
              v-if="showSettingsMenu" 
              @click.stop
              class="tw-absolute tw-right-0 tw-top-full tw-mt-2 tw-w-80 tw-bg-white tw-rounded-xl tw-shadow-2xl tw-border tw-border-stone-200 tw-overflow-hidden tw-z-50"
            >
              <!-- Settings Header -->
              <div class="tw-px-5 tw-py-4 tw-bg-crimson-50 tw-border-b tw-border-stone-200">
                <div class="tw-flex tw-items-center tw-gap-2 tw-text-crimson-700">
                  <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  </svg>
                  <span class="tw-font-semibold tw-text-base">Cài đặt</span>
                </div>
              </div>

              <div class="tw-px-5 tw-py-4 tw-max-h-96 tw-overflow-y-auto">
                <!-- Theme Mode -->
                <div class="tw-mb-4">
                  <div class="tw-flex tw-items-center tw-gap-2 tw-text-sm tw-font-semibold tw-text-stone-700 tw-mb-3">
                    <svg class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                    <span>Chế độ giao diện</span>
                  </div>
                  <div class="tw-flex tw-gap-2">
                    <button 
                      @click="themeMode = 'light'" 
                      :class="[
                        'tw-flex-1 tw-px-3 tw-py-2 tw-rounded-lg tw-text-sm tw-font-medium tw-transition-all tw-flex tw-items-center tw-justify-center tw-gap-2',
                        themeMode === 'light' ? 'tw-bg-crimson-600 tw-text-white tw-shadow-md' : 'tw-bg-stone-100 tw-text-stone-700 hover:tw-bg-stone-200'
                      ]"
                    >
                      <svg class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      Sáng
                    </button>
                    <button 
                      @click="themeMode = 'dark'" 
                      :class="[
                        'tw-flex-1 tw-px-3 tw-py-2 tw-rounded-lg tw-text-sm tw-font-medium tw-transition-all tw-flex tw-items-center tw-justify-center tw-gap-2',
                        themeMode === 'dark' ? 'tw-bg-crimson-600 tw-text-white tw-shadow-md' : 'tw-bg-stone-100 tw-text-stone-700 hover:tw-bg-stone-200'
                      ]"
                    >
                      <svg class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                      Tối
                    </button>
                  </div>
                </div>

                <div class="tw-h-px tw-bg-stone-200 tw-my-4"></div>

                <!-- Color Palette -->
                <div class="tw-mb-4">
                  <div class="tw-flex tw-items-center tw-gap-2 tw-text-sm tw-font-semibold tw-text-stone-700 tw-mb-3">
                    <svg class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                    <span>Màu chủ đạo</span>
                  </div>
                  <div class="tw-grid tw-grid-cols-4 tw-gap-3">
                    <button 
                      v-for="color in themeColors" 
                      :key="color.value"
                      @click="selectedColor = color.value"
                      :style="{ backgroundColor: color.hex }"
                      :class="[
                        'tw-w-12 tw-h-12 tw-rounded-lg tw-transition-all tw-flex tw-items-center tw-justify-center',
                        selectedColor === color.value ? 'tw-ring-4 tw-ring-stone-900 tw-ring-offset-2 tw-scale-110' : 'hover:tw-scale-105'
                      ]"
                      :title="color.name"
                    >
                      <svg v-if="selectedColor === color.value" class="tw-w-5 tw-h-5 tw-text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="tw-h-px tw-bg-stone-200 tw-my-4"></div>

                <!-- Sidebar Toggle -->
                <div class="tw-mb-4">
                  <label class="tw-flex tw-items-center tw-justify-between tw-cursor-pointer">
                    <div class="tw-flex tw-items-center tw-gap-2 tw-text-sm tw-font-semibold tw-text-stone-700">
                      <svg class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                      <span>Thu gọn tự động</span>
                    </div>
                    <div class="tw-relative">
                      <input 
                        type="checkbox" 
                        v-model="sidebarCollapsed" 
                        class="tw-sr-only tw-peer"
                      >
                      <div class="tw-w-11 tw-h-6 tw-bg-stone-300 tw-rounded-full tw-peer peer-checked:tw-bg-crimson-600 tw-transition-colors"></div>
                      <div class="tw-absolute tw-left-1 tw-top-1 tw-w-4 tw-h-4 tw-bg-white tw-rounded-full tw-transition-transform peer-checked:tw-translate-x-5"></div>
                    </div>
                  </label>
                </div>

                <div class="tw-h-px tw-bg-stone-200 tw-my-4"></div>

                <!-- Notifications -->
                <div class="tw-mb-4">
                  <label class="tw-flex tw-items-center tw-justify-between tw-cursor-pointer">
                    <div class="tw-flex tw-items-center tw-gap-2 tw-text-sm tw-font-semibold tw-text-stone-700">
                      <svg class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      <span>Bật thông báo</span>
                    </div>
                    <div class="tw-relative">
                      <input 
                        type="checkbox" 
                        v-model="notificationsEnabled" 
                        class="tw-sr-only tw-peer"
                      >
                      <div class="tw-w-11 tw-h-6 tw-bg-stone-300 tw-rounded-full tw-peer peer-checked:tw-bg-crimson-600 tw-transition-colors"></div>
                      <div class="tw-absolute tw-left-1 tw-top-1 tw-w-4 tw-h-4 tw-bg-white tw-rounded-full tw-transition-transform peer-checked:tw-translate-x-5"></div>
                    </div>
                  </label>
                </div>

                <div class="tw-h-px tw-bg-stone-200 tw-my-4"></div>

                <!-- Font Size -->
                <div>
                  <div class="tw-flex tw-items-center tw-gap-2 tw-text-sm tw-font-semibold tw-text-stone-700 tw-mb-3">
                    <svg class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Kích thước chữ</span>
                  </div>
                  <input 
                    type="range" 
                    v-model="fontSize" 
                    min="12" 
                    max="18" 
                    step="1"
                    class="tw-w-full tw-h-2 tw-bg-stone-200 tw-rounded-lg tw-appearance-none tw-cursor-pointer slider-thumb"
                  >
                  <div class="tw-flex tw-justify-between tw-text-xs tw-text-stone-500 tw-mt-1">
                    <span>Nhỏ</span>
                    <span>Vừa</span>
                    <span>Lớn</span>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="tw-px-5 tw-py-3 tw-bg-stone-50 tw-border-t tw-border-stone-200 tw-flex tw-justify-between tw-gap-2">
                <button 
                  @click="resetSettings"
                  class="tw-px-4 tw-py-2 tw-text-sm tw-font-medium tw-text-stone-700 hover:tw-bg-stone-200 tw-rounded-lg tw-transition-colors tw-flex tw-items-center tw-gap-1"
                >
                  <svg class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Đặt lại
                </button>
                <button 
                  @click="saveSettings"
                  class="tw-px-4 tw-py-2 tw-text-sm tw-font-medium tw-bg-crimson-600 tw-text-white hover:tw-bg-crimson-700 tw-rounded-lg tw-transition-colors tw-flex tw-items-center tw-gap-1"
                >
                  <svg class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Áp dụng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Sidebar -->
    <aside 
      :class="[
        'tw-fixed tw-left-0 tw-top-16 tw-bottom-0 tw-w-64 tw-bg-white tw-shadow-xl tw-transition-transform tw-duration-300 tw-z-40 tw-overflow-y-auto',
        drawer ? 'tw-translate-x-0' : '-tw-translate-x-full'
      ]"
    >
      <!-- Management Section -->
      <div class="tw-px-4 tw-py-6">
        <div class="tw-text-xs tw-font-bold tw-text-stone-500 tw-uppercase tw-tracking-wider tw-mb-3 tw-px-3">
          Quản Lý
        </div>
        <nav class="tw-space-y-1">
          <router-link
            v-for="item in managementItems"
            :key="item.title"
            :to="item.to"
            @click="setActive(item.to)"
            :class="[
              'tw-flex tw-items-center tw-gap-3 tw-px-3 tw-py-2.5 tw-rounded-lg tw-transition-all tw-text-sm tw-font-medium',
              item.active 
                ? 'tw-bg-crimson-50 tw-text-crimson-700' 
                : 'tw-text-stone-700 hover:tw-bg-stone-100'
            ]"
          >
            <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="item.icon === 'mdi-view-dashboard'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
              <path v-else-if="item.icon === 'mdi-cellphone'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              <path v-else-if="item.icon === 'mdi-account-group'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              <path v-else-if="item.icon === 'mdi-cart'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              <path v-else-if="item.icon === 'mdi-chart-line'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              <path v-else-if="item.icon === 'mdi-star'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span>{{ item.title }}</span>
          </router-link>
        </nav>
      </div>

      <div class="tw-h-px tw-bg-stone-200 tw-mx-4"></div>

      <!-- Account Section -->
      <div class="tw-px-4 tw-py-6">
        <div class="tw-text-xs tw-font-bold tw-text-stone-500 tw-uppercase tw-tracking-wider tw-mb-3 tw-px-3">
          Tài khoản
        </div>
        
        <!-- User Info Card -->
        <div class="tw-bg-stone-50 tw-rounded-lg tw-p-3 tw-mb-3 tw-mx-1">
          <div class="tw-flex tw-items-center tw-gap-3">
            <div class="tw-w-10 tw-h-10 tw-bg-crimson-100 tw-rounded-full tw-flex tw-items-center tw-justify-center">
              <svg class="tw-w-6 tw-h-6 tw-text-crimson-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <div class="tw-font-semibold tw-text-sm tw-text-stone-800">{{ userName }}</div>
              <div class="tw-text-xs tw-text-stone-500">Quản trị viên</div>
            </div>
          </div>
        </div>

        <nav class="tw-space-y-1">
          <button
            @click="Account"
            class="tw-w-full tw-flex tw-items-center tw-gap-3 tw-px-3 tw-py-2.5 tw-rounded-lg tw-transition-all tw-text-sm tw-font-medium tw-text-stone-700 hover:tw-bg-stone-100"
          >
            <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Hồ sơ</span>
          </button>
          
          <button
            @click="activeModal"
            class="tw-w-full tw-flex tw-items-center tw-gap-3 tw-px-3 tw-py-2.5 tw-rounded-lg tw-transition-all tw-text-sm tw-font-medium tw-text-crimson-600 hover:tw-bg-crimson-50"
          >
            <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Đăng xuất</span>
          </button>
        </nav>
      </div>
    </aside>

    <!-- Overlay for mobile -->
    <div 
      v-if="drawer" 
      @click="drawer = false"
      class="tw-fixed tw-inset-0 tw-bg-black/50 tw-z-30 lg:tw-hidden"
    ></div>

    <!-- Main Content -->
    <main :class="['tw-pt-16 tw-min-h-screen', drawer ? 'lg:tw-pl-64' : '']">
      <div class="tw-p-6">
        <router-view />
      </div>
    </main>

    <!-- Logout Modal -->
    <div 
      v-if="activeModalSignOut" 
      class="tw-fixed tw-inset-0 tw-bg-black/50 tw-flex tw-items-center tw-justify-center tw-z-[9999] tw-p-4"
      @click.self="closeModal"
    >
      <div class="tw-bg-white tw-rounded-2xl tw-shadow-2xl tw-max-w-md tw-w-full tw-overflow-hidden">
        <div class="tw-px-6 tw-py-5 tw-border-b tw-border-stone-200">
          <h3 class="tw-text-xl tw-font-bold tw-text-stone-800 tw-text-center">Xác nhận đăng xuất</h3>
        </div>
        
        <div class="tw-px-6 tw-py-6">
          <p class="tw-text-center tw-text-stone-600">Bạn muốn thoát tài khoản?</p>
        </div>

        <div class="tw-px-6 tw-pb-6 tw-flex tw-gap-3">
          <button 
            @click="closeModal"
            class="tw-flex-1 tw-px-4 tw-py-3 tw-border-2 tw-border-stone-300 tw-rounded-lg tw-font-semibold tw-text-stone-700 hover:tw-bg-stone-50 tw-transition-colors"
          >
            KHÔNG
          </button>
          <button 
            @click="handleLogout"
            class="tw-flex-1 tw-px-4 tw-py-3 tw-bg-crimson-600 tw-rounded-lg tw-font-semibold tw-text-white hover:tw-bg-crimson-700 tw-transition-colors"
          >
            XÁC NHẬN
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const route = useRoute()
const { user } = useAuth()

const drawer = ref(true)
const showSettingsMenu = ref(false)
const managementItems = ref([
  { icon: 'mdi-view-dashboard', title: 'Dashboard', to: '/admin/dashboard', active: true },
  { icon: 'mdi-cellphone', title: 'Sản phẩm', to: '/admin/products', active: false },
  { icon: 'mdi-account-group', title: 'Người dùng', to: '/admin/users', active: false },
  { icon: 'mdi-cart', title: 'Đơn hàng', to: '/admin/orders', active: false },
  { icon: 'mdi-chart-line', title: 'Thống kê', to: '/admin/stats', active: false },
  { icon: 'mdi-star', title: 'Đánh giá', to: '/admin/reviews', active: false },
])

const userName = computed(() => user.value?.userName || localStorage.getItem('userName') || 'Admin')

// Settings State
const themeMode = ref(localStorage.getItem('themeMode') || 'light')
const selectedColor = ref(localStorage.getItem('primaryColor') || 'red')
const sidebarCollapsed = ref(localStorage.getItem('sidebarCollapsed') === 'true')
const notificationsEnabled = ref(localStorage.getItem('notificationsEnabled') !== 'false')
const fontSize = ref(parseInt(localStorage.getItem('fontSize') || '14'))

const themeColors = [
  { name: 'Đỏ', value: 'red', hex: '#cc0000' },
  { name: 'Xanh dương', value: 'blue', hex: '#1976D2' },
  { name: 'Xanh lá', value: 'green', hex: '#4CAF50' },
  { name: 'Cam', value: 'orange', hex: '#FF9800' },
  { name: 'Tím', value: 'purple', hex: '#9C27B0' },
  { name: 'Hồng', value: 'pink', hex: '#E91E63' },
  { name: 'Xanh ngọc', value: 'teal', hex: '#009688' },
  { name: 'Nâu', value: 'brown', hex: '#795548' },
]

function saveSettings() {
  localStorage.setItem('themeMode', themeMode.value)
  localStorage.setItem('primaryColor', selectedColor.value)
  localStorage.setItem('sidebarCollapsed', sidebarCollapsed.value.toString())
  localStorage.setItem('notificationsEnabled', notificationsEnabled.value.toString())
  localStorage.setItem('fontSize', fontSize.value.toString())
  
  // Apply settings
  applyThemeSettings()
  
  // Close menu and show notification
  showSettingsMenu.value = false
  alert('Đã lưu cài đặt thành công!')
}

function resetSettings() {
  themeMode.value = 'light'
  selectedColor.value = 'red'
  sidebarCollapsed.value = false
  notificationsEnabled.value = true
  fontSize.value = 14
  
  saveSettings()
}

function applyThemeSettings() {
  // Apply theme mode
  if (themeMode.value === 'dark') {
    document.body.classList.add('dark-theme')
    document.body.classList.remove('light-theme')
  } else {
    document.body.classList.add('light-theme')
    document.body.classList.remove('dark-theme')
  }
  
  // Apply primary color via CSS variable
  const colorHex = themeColors.find(c => c.value === selectedColor.value)?.hex || '#cc0000'
  document.documentElement.style.setProperty('--primary-color', colorHex)
  
  // Apply font size
  document.documentElement.style.setProperty('--base-font-size', `${fontSize.value}px`)
  
  // Apply sidebar state
  if (sidebarCollapsed.value) {
    drawer.value = false
  }
}

// Watch for immediate changes (preview)
watch([themeMode, selectedColor], () => {
  applyThemeSettings()
})

// Close settings menu when clicking outside
onMounted(() => {
  applyThemeSettings()
  
  document.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (target && !target.closest('.settings-dropdown-container')) {
      showSettingsMenu.value = false
    }
  })
})

const activeModalSignOut = ref(false)

function activeModal() {
  activeModalSignOut.value = true
}

function closeModal() {
  activeModalSignOut.value = false
}

function handleLogout() {
  localStorage.clear()
  activeModalSignOut.value = false
  router.push('/login')
}

function Account() {
  router.push('/account')
}

function setActive(to: string) {
  managementItems.value.forEach(item => (item.active = item.to === to))
}

watch(() => route.path, (newPath) => {
  setActive(newPath)
})
</script>

<style>
/* Global Dark Theme Support */
body.dark-theme {
  background-color: #1e1e1e !important;
  color: #e0e0e0 !important;
}

/* Main Content Area */
body.dark-theme main {
  background-color: #1e1e1e !important;
}

/* Cards and Containers */
body.dark-theme .tw-bg-white {
  background-color: #2d2d2d !important;
}

body.dark-theme .tw-bg-stone-50 {
  background-color: #353535 !important;
}

body.dark-theme .tw-bg-stone-100 {
  background-color: #404040 !important;
}

body.dark-theme .tw-text-stone-700,
body.dark-theme .tw-text-stone-800 {
  color: #e0e0e0 !important;
}

body.dark-theme .tw-text-stone-500,
body.dark-theme .tw-text-stone-600 {
  color: #999 !important;
}

body.dark-theme .tw-border-stone-200,
body.dark-theme .tw-border-stone-300 {
  border-color: #505050 !important;
}

/* Tables */
body.dark-theme table {
  background-color: #2d2d2d !important;
  border-color: #404040 !important;
}

body.dark-theme thead {
  background-color: var(--primary-color, #cc0000) !important;
}

body.dark-theme tbody tr {
  background-color: #2d2d2d !important;
  border-color: #404040 !important;
}

body.dark-theme tbody tr:hover {
  background-color: #353535 !important;
}

body.dark-theme td,
body.dark-theme th {
  color: #e0e0e0 !important;
  border-color: #404040 !important;
}

/* Inputs */
body.dark-theme input,
body.dark-theme select,
body.dark-theme textarea {
  background-color: #353535 !important;
  color: #e0e0e0 !important;
  border-color: #505050 !important;
}

body.dark-theme input::placeholder {
  color: #888 !important;
}

/* Scrollbar */
body.dark-theme ::-webkit-scrollbar {
  background-color: #2d2d2d;
}

body.dark-theme ::-webkit-scrollbar-thumb {
  background-color: #505050;
  border-radius: 4px;
}

body.dark-theme ::-webkit-scrollbar-thumb:hover {
  background-color: #606060;
}
</style>

<style scoped>
/* Custom Range Slider Styles */
.slider-thumb::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #cc0000;
  cursor: pointer;
}

.slider-thumb::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #cc0000;
  cursor: pointer;
  border: none;
}

.slider-thumb::-webkit-slider-thumb:hover {
  background: #b30000;
}

/* Responsive Styles */
@media (max-width: 1024px) {
  aside {
    position: fixed !important;
  }
}
</style>

<route lang="yaml">
meta:
  layout: admin
</route>



