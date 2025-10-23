<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <h1>Thống kê</h1>
        <p>Biểu đồ thống kê sẽ được thêm sau.</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
</script>

<route lang="yaml">
name: Admin Stats
meta:
  layout: admin
  requiresAuth: true
  adminOnly: true
  path: /admin/stats
</route>



