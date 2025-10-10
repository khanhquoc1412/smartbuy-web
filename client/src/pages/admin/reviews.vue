<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <h1>Đánh giá</h1>
        <p>Danh sách đánh giá sẽ được hiển thị tại đây.</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
</script>

<route lang="yaml">
name: Admin Reviews
meta:
  layout: admin
  requiresAuth: true
  adminOnly: true
  path: /admin/reviews
</route>



