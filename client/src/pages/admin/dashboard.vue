<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Dashboard</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="4">
        <v-card class="pa-4 elevation-3">
          <v-card-title>Doanh thu hôm nay</v-card-title>
          <v-card-text class="text-h5">50,000,000 VNĐ</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card class="pa-4 elevation-3">
          <v-card-title>Tổng đơn hàng</v-card-title>
          <v-card-text class="text-h5">120</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card class="pa-4 elevation-3">
          <v-card-title>Khách mới</v-card-title>
          <v-card-text class="text-h5">15</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
</script>

<style scoped>
.text-h5 { font-weight: bold; color: #cc0000; }
</style>

<route lang="yaml">
name: Admin Dashboard
meta:
  layout: admin
  requiresAuth: true
  adminOnly: true
  navTitle: Dashboard
  path: /admin/dashboard
</route>



