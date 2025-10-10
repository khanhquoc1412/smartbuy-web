<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <h1>Quản lý đơn hàng</h1>
        <p>Danh sách đơn hàng sẽ được hiển thị tại đây.</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
</script>

<route lang="yaml">
name: Admin Orders
meta:
  layout: admin
  requiresAuth: true
  adminOnly: true
  path: /admin/orders
</route>



