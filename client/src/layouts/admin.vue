<template>
  <v-app id="admin-app">
    <v-app-bar app elevation="2" class="admin-header">
      <div class="header-container">
        <div class="header-left">
          <v-btn icon variant="text" @click="drawer = !drawer" class="menu-toggle">
            <v-icon>mdi-menu</v-icon>
          </v-btn>
          <router-link to="/" class="header-logo">
            <span class="logo-text">SmartBuy Admin</span>
          </router-link>
        </div>


        <div class="header-right">
          <v-menu offset-y :close-on-content-click="false">
            <template v-slot:activator="{ props }">
              <v-btn icon variant="text" class="header-icon-btn" title="Cài đặt" v-bind="props">
                <v-icon>mdi-cog</v-icon>
              </v-btn>
            </template>
            <v-card min-width="320" class="settings-menu">
              <v-card-title class="settings-title">
                <v-icon class="mr-2">mdi-cog</v-icon>
                Cài đặt
              </v-card-title>
              <v-divider />
              
              <v-card-text class="settings-content">
                <!-- Theme Mode -->
                <div class="setting-section">
                  <div class="setting-label">
                    <v-icon size="small" class="mr-2">mdi-theme-light-dark</v-icon>
                    Chế độ giao diện
                  </div>
                  <v-btn-toggle v-model="themeMode" color="primary" mandatory class="theme-toggle">
                    <v-btn value="light" size="small">
                      <v-icon size="small">mdi-white-balance-sunny</v-icon>
                      <span class="ml-1">Sáng</span>
                    </v-btn>
                    <v-btn value="dark" size="small">
                      <v-icon size="small">mdi-moon-waning-crescent</v-icon>
                      <span class="ml-1">Tối</span>
                    </v-btn>
                  </v-btn-toggle>
                </div>

                <v-divider class="my-3" />

                <!-- Primary Color -->
                <div class="setting-section">
                  <div class="setting-label">
                    <v-icon size="small" class="mr-2">mdi-palette</v-icon>
                    Màu chủ đạo
                  </div>
                  <div class="color-picker-grid">
                    <div 
                      v-for="color in themeColors" 
                      :key="color.value"
                      class="color-option"
                      :class="{ active: selectedColor === color.value }"
                      :style="{ backgroundColor: color.hex }"
                      @click="selectedColor = color.value"
                      :title="color.name"
                    >
                      <v-icon v-if="selectedColor === color.value" color="white" size="small">
                        mdi-check
                      </v-icon>
                    </div>
                  </div>
                </div>

                <v-divider class="my-3" />

                <!-- Sidebar -->
                <div class="setting-section">
                  <div class="setting-label">
                    <v-icon size="small" class="mr-2">mdi-dock-left</v-icon>
                    Thanh điều hướng
                  </div>
                  <v-switch 
                    v-model="sidebarCollapsed" 
                    label="Thu gọn tự động"
                    color="primary"
                    hide-details
                    density="compact"
                  />
                </div>

                <v-divider class="my-3" />

                <!-- Notifications -->
                <div class="setting-section">
                  <div class="setting-label">
                    <v-icon size="small" class="mr-2">mdi-bell</v-icon>
                    Thông báo
                  </div>
                  <v-switch 
                    v-model="notificationsEnabled" 
                    label="Bật thông báo"
                    color="primary"
                    hide-details
                    density="compact"
                  />
                </div>

                <v-divider class="my-3" />

                <!-- Font Size -->
                <div class="setting-section">
                  <div class="setting-label">
                    <v-icon size="small" class="mr-2">mdi-format-size</v-icon>
                    Kích thước chữ
                  </div>
                  <v-slider
                    v-model="fontSize"
                    :min="12"
                    :max="18"
                    :step="1"
                    thumb-label
                    color="primary"
                    hide-details
                  />
                  <div class="font-size-labels">
                    <span>Nhỏ</span>
                    <span>Vừa</span>
                    <span>Lớn</span>
                  </div>
                </div>
              </v-card-text>

              <v-divider />
              <v-card-actions class="settings-actions">
                <v-btn variant="text" @click="resetSettings" size="small">
                  <v-icon size="small" class="mr-1">mdi-refresh</v-icon>
                  Đặt lại
                </v-btn>
                <v-spacer />
                <v-btn color="primary" variant="flat" @click="saveSettings" size="small">
                  <v-icon size="small" class="mr-1">mdi-check</v-icon>
                  Áp dụng
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </div>
      </div>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app color="#ffffff" width="250">
      <v-list nav dense>
        <v-list-item title="Quản Lý" class="title-item" disabled />
        <v-list-item
          v-for="item in managementItems"
          :key="item.title"
          :prepend-icon="item.icon"
          :title="item.title"
          :to="item.to"
          link
          class="menu-item"
          :style="{ color: item.active ? '#cc0000' : '#333' }"
          @click="setActive(item.to)"
        />
      </v-list>

      <v-divider />
      <v-list nav dense>
        <v-list-item title="Tài khoản" class="title-item" />
        
        <v-list-item
          prepend-icon="mdi-account"
          :title="userName"
          :subtitle="'Quản trị viên'"
          class="account-info-item"
        />
        
        <v-list-item prepend-icon="mdi-account-circle" title="Hồ sơ" @click="Account" link class="menu-item" />
        <v-list-item prepend-icon="mdi-logout" title="Đăng xuất" @click="activeModal" link class="menu-item logout-menu-item" />
      </v-list>
    </v-navigation-drawer>

    <v-main style="background-color: #ffffff;">
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>

    <!-- Modal xác nhận đăng xuất -->
    <v-dialog v-model="activeModalSignOut" max-width="600" persistent>
      <v-card class="logout-modal">
        <v-card-title class="modal-title text-center">Xác nhận đăng xuất</v-card-title>
        <v-card-text class="modal-content text-center">Bạn muốn thoát tài khoản?</v-card-text>
        <v-card-actions class="modal-actions">
          <v-btn 
            class="btn-cancel" 
            variant="outlined" 
            @click="closeModal"
            width="48%"
          >
            KHÔNG
          </v-btn>
          <v-btn 
            class="btn-confirm" 
            color="#cc0000" 
            variant="elevated" 
            @click="handleLogout"
            width="48%"
          >
            XÁC NHẬN
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
 
  
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const route = useRoute()
const logo = new URL('@/assets/svg/logo6.svg', import.meta.url).href
const { user } = useAuth()

const drawer = ref(true)
const searchQuery = ref('')
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
  
  // Show notification
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
  // Apply theme mode - simple class toggle
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

// Apply settings on mount
onMounted(() => {
  applyThemeSettings()
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
body.dark-theme .v-main {
  background-color: #1e1e1e !important;
}

body.dark-theme .v-main > * {
  background-color: #1e1e1e !important;
}

/* Navigation Drawer */
body.dark-theme .v-navigation-drawer {
  background-color: #2d2d2d !important;
  color: #ffffff !important;
  border-right: 1px solid #404040 !important;
}

body.dark-theme .v-list-item {
  color: #e0e0e0 !important;
}

body.dark-theme .v-list-item:hover {
  background-color: rgba(255, 255, 255, 0.05) !important;
}

body.dark-theme .v-list-item-title,
body.dark-theme .v-list-item-subtitle {
  color: #e0e0e0 !important;
}

/* Cards and Modals */
body.dark-theme .v-card {
  background-color: #2d2d2d !important;
  color: #e0e0e0 !important;
  border: 1px solid #404040 !important;
}

body.dark-theme .v-card-title,
body.dark-theme .v-card-text {
  color: #e0e0e0 !important;
}

body.dark-theme .settings-title,
body.dark-theme .setting-label {
  color: #e0e0e0 !important;
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

/* Inputs and Form Elements */
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

body.dark-theme .v-field {
  background-color: #353535 !important;
  color: #e0e0e0 !important;
}

body.dark-theme .v-field__input {
  color: #e0e0e0 !important;
}

/* Buttons */
body.dark-theme button:not(.tw-bg-crimson-600):not([class*="bg-crimson"]) {
  background-color: #353535 !important;
  color: #e0e0e0 !important;
  border-color: #505050 !important;
}

body.dark-theme button:not(.tw-bg-crimson-600):hover {
  background-color: #404040 !important;
}

/* Dividers */
body.dark-theme .v-divider {
  border-color: #404040 !important;
}

body.dark-theme hr {
  border-color: #404040 !important;
}

/* Tailwind Overrides */
body.dark-theme .tw-bg-white {
  background-color: #2d2d2d !important;
}

body.dark-theme .tw-bg-stone-50 {
  background-color: #353535 !important;
}

body.dark-theme .tw-bg-stone-100 {
  background-color: #404040 !important;
}

body.dark-theme .tw-text-stone-700 {
  color: #e0e0e0 !important;
}

body.dark-theme .tw-text-stone-500 {
  color: #999 !important;
}

body.dark-theme .tw-border-stone-300,
body.dark-theme .tw-border-stone-200 {
  border-color: #505050 !important;
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
/* Header Styles */
.admin-header {
  background: linear-gradient(135deg, var(--primary-color, #cc0000) 0%, #ff1744 100%) !important;
  box-shadow: 0 2px 8px rgba(204, 0, 0, 0.15) !important;
  z-index: 100 !important;
}

.header-container {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 24px;
  padding: 0 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 250px;
}

.menu-toggle {
  color: white !important;
}

.header-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.header-logo:hover {
  transform: scale(1.05);
}

.header-logo img {
  height: 36px;
  width: auto;
  filter: brightness(0) invert(1);
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  color: white;
  letter-spacing: 0.5px;
}

.header-center {
  flex: 1;
  max-width: 600px;
}

.search-bar {
  border-radius: 24px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.search-bar :deep(.v-field) {
  border-radius: 24px !important;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-icon-btn {
  color: white !important;
}

.header-icon-btn:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

/* Settings Menu Styles */
.settings-menu {
  max-height: 600px;
  overflow-y: auto;
}

.settings-title {
  font-size: 18px;
  font-weight: 600;
  padding: 16px 20px;
  color: #333;
  display: flex;
  align-items: center;
}

.settings-content {
  padding: 16px 20px;
}

.setting-section {
  margin-bottom: 4px;
}

.setting-label {
  font-size: 14px;
  font-weight: 600;
  color: #555;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

.theme-toggle {
  width: 100%;
  display: flex;
}

.theme-toggle .v-btn {
  flex: 1;
}

.color-picker-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-top: 8px;
}

.color-option {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border: 3px solid transparent;
}

.color-option:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.color-option.active {
  border-color: #333;
  box-shadow: 0 0 0 2px white, 0 0 0 4px #333;
}

.font-size-labels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #777;
  margin-top: 4px;
}

.settings-actions {
  padding: 12px 20px;
}

.user-menu-btn {
  color: white !important;
  text-transform: none !important;
  padding: 4px 12px !important;
  border-radius: 20px !important;
}

.user-menu-btn:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

.user-name {
  margin: 0 8px;
  font-weight: 500;
  font-size: 14px;
}

.user-info-title {
  font-weight: 600;
  color: #333;
}

.logout-item {
  color: #cc0000;
}

.logout-item:hover {
  background-color: #fff5f5;
}

/* Navigation Drawer Styles */
.menu-item {
  font-weight: 500;
  transition: all 0.3s;
  margin: 4px 8px;
  border-radius: 8px;
}

.menu-item:hover {
  background-color: #fff5f5 !important;
  color: #cc0000 !important;
}

.account-info-item {
  margin: 4px 8px;
  pointer-events: none;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.logout-menu-item {
  color: #cc0000;
}

.logout-menu-item:hover {
  background-color: #fff5f5 !important;
}

.title-item {
  font-weight: bold;
  color: #555;
  padding-left: 16px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Modal styles */
.logout-modal {
  border-radius: 12px;
  padding: 20px;
  z-index: 9999 !important; /* Đảm bảo modal luôn ở trên cùng */
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  padding: 16px 24px;
  color: #333;
}

.modal-content {
  font-size: 16px;
  padding: 20px 24px;
  color: #666;
}

.modal-actions {
  padding: 16px 24px 24px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.btn-cancel {
  text-transform: uppercase;
  font-weight: 600;
  border-color: #ddd;
  color: #666;
  height: 44px;
  border-radius: 8px;
}

.btn-cancel:hover {
  background-color: #f5f5f5;
  border-color: #999;
}

.btn-confirm {
  text-transform: uppercase;
  font-weight: 600;
  color: white;
  height: 44px;
  border-radius: 8px;
}

.btn-confirm:hover {
  background-color: #b30000;
}

/* Responsive */
@media (max-width: 960px) {
  .header-container {
    gap: 12px;
  }
  
  .logo-text {
    display: none;
  }
  
  .user-name {
    display: none;
  }
  
  .header-center {
    max-width: 400px;
  }
}

@media (max-width: 600px) {
  .header-center {
    max-width: 200px;
  }
  
  .search-bar :deep(.v-field__input) {
    font-size: 14px;
  }
}
</style>

<route lang="yaml">
meta:
  layout: admin
</route>



