<template>
  <v-app>
    <v-app-bar app color="#cc0000" dark flat>
      <div class="header-left">
        <router-link to="/" class="header-logo">
          <img :src="logo" alt="logo" />
        </router-link>
      </div>
      <v-spacer />
      <v-text-field
        v-model="searchQuery"
        prepend-inner-icon="mdi-magnify"
        placeholder="Tìm kiếm sản phẩm, đơn hàng..."
        variant="outlined"
        density="comfortable"
        hide-details
        class="search-bar"
        @keyup.enter="performSearch"
      />
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
        <v-list-item title="Tài khoản" class="title-item" disabled />
        <v-list-item prepend-icon="mdi-account" :title="userName" subtitle="Nhân viên quản lý" disabled />
        <v-list-item prepend-icon="mdi-logout" title="Logout" @click="logout" />
        <v-list-item prepend-icon="mdi-login" title="Sign-in" @click="signIn" />
      </v-list>
    </v-navigation-drawer>

    <v-main style="background-color: #ffffff;">
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
  
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const logo = new URL('@/assets/svg/logo6.svg', import.meta.url).href

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

const userName = computed(() => localStorage.getItem('fullName') || localStorage.getItem('userName') || 'Admin.admin')

function logout() {
  localStorage.removeItem('userName')
  localStorage.removeItem('fullName')
  localStorage.removeItem('token')
  router.push('/login')
}
function signIn() {
  router.push('/register')
}
function performSearch() {
  console.log('Searching for:', searchQuery.value)
}
function setActive(to: string) {
  managementItems.value.forEach(item => (item.active = item.to === to))
}

watch(() => route.path, (newPath) => {
  setActive(newPath)
})
</script>

<style scoped>
.search-bar {
  max-width: 450px;
}
.header-left .header-logo img { height: 40px; width: auto; }
.menu-item {
  font-weight: 500;
  transition: all 0.3s;
}
.menu-item:hover {
  background-color: #f8f9fa;
  color: #cc0000 !important;
}
.title-item {
  font-weight: bold;
  color: #555;
  padding-left: 16px;
}
</style>

<route lang="yaml">
meta:
  layout: admin
</route>



