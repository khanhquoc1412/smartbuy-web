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
          <button 
            @click="showCustomizer = true"
            class="tw-p-2 tw-rounded-lg tw-text-white hover:tw-bg-white/10 tw-transition-colors"
            title="Customize Layout"
          >
            <svg class="tw-w-6 tw-h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
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
            <img 
              v-if="user?.avatarUrl" 
              :src="user.avatarUrl" 
              :alt="userName"
              class="tw-w-10 tw-h-10 tw-rounded-full tw-object-cover tw-border-2 tw-border-crimson-200"
            />
            <div 
              v-else
              class="tw-w-10 tw-h-10 tw-bg-crimson-100 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-font-bold tw-text-crimson-700"
            >
              {{ userName.charAt(0).toUpperCase() }}
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

    <!-- DashboardKit Customizer -->
    <DashboardCustomizer 
      :isOpen="showCustomizer" 
      @close="showCustomizer = false"
      @save="handleCustomizerSave"
    />

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
import DashboardCustomizer from '@/components/common/DashboardCustomizer.vue'

const router = useRouter()
const route = useRoute()
const { user } = useAuth()

const drawer = ref(true)
const showCustomizer = ref(false)
const managementItems = ref([
  { icon: 'mdi-view-dashboard', title: 'Dashboard', to: '/admin/dashboard', active: false },
  { icon: 'mdi-cellphone', title: 'Sản phẩm', to: '/admin/products', active: false },
  { icon: 'mdi-account-group', title: 'Người dùng', to: '/admin/users', active: false },
  { icon: 'mdi-cart', title: 'Đơn hàng', to: '/admin/orders', active: false },
  { icon: 'mdi-chart-line', title: 'Thống kê', to: '/admin/stats', active: false },
  { icon: 'mdi-star', title: 'Đánh giá', to: '/admin/reviews', active: false },
])

const userName = computed(() => user.value?.userName || localStorage.getItem('userName') || 'Admin')

// Customizer handler
function handleCustomizerSave(settings: any) {
  console.log('Settings saved:', settings)
}

// Settings State (legacy - keep for compatibility)
const themeMode = ref(localStorage.getItem('themeMode') || 'light')
const selectedColor = ref(localStorage.getItem('primaryColor') || 'red')
const sidebarTheme = ref(localStorage.getItem('sidebarTheme') || 'light')
const sidebarCaption = ref(localStorage.getItem('sidebarCaption') !== 'false')
const headerTheme = ref(localStorage.getItem('headerTheme') || 'dark')
const layoutDirection = ref(localStorage.getItem('layoutDirection') || 'ltr')
const layoutWidth = ref(localStorage.getItem('layoutWidth') || 'full')
const sidebarCollapsed = ref(localStorage.getItem('sidebarCollapsed') === 'true')
const notificationsEnabled = ref(localStorage.getItem('notificationsEnabled') !== 'false')
const fontSize = ref(parseInt(localStorage.getItem('fontSize') || '14'))

const themeColors = [
  { name: 'Đỏ', value: 'red', hex: '#dc143c' },
  { name: 'Xanh tím', value: 'indigo', hex: '#4F46E5' },
  { name: 'Tím', value: 'purple', hex: '#9333EA' },
  { name: 'Hồng', value: 'pink', hex: '#EC4899' },
  { name: 'Đỏ cam', value: 'rose', hex: '#F43F5E' },
  { name: 'Cam', value: 'orange', hex: '#F97316' },
  { name: 'Vàng', value: 'amber', hex: '#F59E0B' },
  { name: 'Xanh lá', value: 'green', hex: '#10B981' },
  { name: 'Xanh ngọc', value: 'teal', hex: '#14B8A6' },
  { name: 'Xanh dương', value: 'cyan', hex: '#06B6D4' },
]

function saveSettings() {
  localStorage.setItem('themeMode', themeMode.value)
  localStorage.setItem('primaryColor', selectedColor.value)
  localStorage.setItem('sidebarTheme', sidebarTheme.value)
  localStorage.setItem('sidebarCaption', sidebarCaption.value.toString())
  localStorage.setItem('headerTheme', headerTheme.value)
  localStorage.setItem('layoutDirection', layoutDirection.value)
  localStorage.setItem('layoutWidth', layoutWidth.value)
  localStorage.setItem('sidebarCollapsed', sidebarCollapsed.value.toString())
  localStorage.setItem('notificationsEnabled', notificationsEnabled.value.toString())
  localStorage.setItem('fontSize', fontSize.value.toString())
  
  // Apply settings
  applyThemeSettings()
  
  alert('✅ Đã lưu cài đặt thành công!')
}

function resetSettings() {
  themeMode.value = 'light'
  selectedColor.value = 'red'
  sidebarTheme.value = 'light'
  sidebarCaption.value = true
  headerTheme.value = 'dark'
  layoutDirection.value = 'ltr'
  layoutWidth.value = 'full'
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
  const colorHex = themeColors.find(c => c.value === selectedColor.value)?.hex || '#dc143c'
  document.documentElement.style.setProperty('--primary-color', colorHex)
  
  // Apply sidebar theme
  document.documentElement.setAttribute('data-sidebar-theme', sidebarTheme.value)
  
  // Apply header theme
  document.documentElement.setAttribute('data-header-theme', headerTheme.value)
  
  // Apply layout direction
  document.documentElement.setAttribute('dir', layoutDirection.value)
  
  // Apply layout width
  document.documentElement.setAttribute('data-layout-width', layoutWidth.value)
  
  // Apply font size
  document.documentElement.style.setProperty('--base-font-size', `${fontSize.value}px`)
  
  // Apply sidebar state
  if (sidebarCollapsed.value) {
    drawer.value = false
  }
}

// Watch for immediate changes (preview)
watch([themeMode, selectedColor, sidebarTheme, headerTheme, layoutDirection, layoutWidth], () => {
  applyThemeSettings()
})

// Close settings menu when clicking outside
onMounted(() => {
  applyThemeSettings()
  
  // Sync menu active state with current route on mount
  setActive(route.path)
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

/* DashboardKit Customizer Styles */
/* Sidebar Theme */
[data-sidebar-theme="dark"] aside {
  background-color: #1a202c !important;
  color: #fff !important;
}

[data-sidebar-theme="dark"] aside .tw-text-stone-700,
[data-sidebar-theme="dark"] aside .tw-text-stone-800 {
  color: #e2e8f0 !important;
}

[data-sidebar-theme="dark"] aside .tw-text-stone-500 {
  color: #94a3b8 !important;
}

[data-sidebar-theme="dark"] aside .tw-bg-stone-50 {
  background-color: #2d3748 !important;
}

[data-sidebar-theme="dark"] aside .tw-bg-stone-100 {
  background-color: #374151 !important;
}

[data-sidebar-theme="dark"] aside .tw-border-stone-200 {
  border-color: #4b5563 !important;
}

/* Header Theme */
[data-header-theme="light"] header {
  background: linear-gradient(to right, #f8fafc, #f1f5f9) !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
}

[data-header-theme="light"] header .tw-text-white {
  color: #1e293b !important;
}

[data-header-theme="light"] header button {
  color: #475569 !important;
}

[data-header-theme="light"] header button:hover {
  background-color: rgba(0, 0, 0, 0.05) !important;
}

/* Layout Width */
[data-layout-width="boxed"] main {
  max-width: 1400px !important;
  margin-left: auto !important;
  margin-right: auto !important;
}

/* RTL Support */
[dir="rtl"] {
  direction: rtl !important;
}

[dir="rtl"] aside {
  left: auto !important;
  right: 0 !important;
}

[dir="rtl"] main {
  padding-left: 0 !important;
  padding-right: 16rem !important;
}

[dir="rtl"] .tw-text-left {
  text-align: right !important;
}

[dir="rtl"] .tw-text-right {
  text-align: left !important;
}
</style>

<route lang="yaml">
meta:
  layout: admin
</route>



