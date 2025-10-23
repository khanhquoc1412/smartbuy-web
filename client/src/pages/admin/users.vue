<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <h1>Quản lý Tài Khoản</h1>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
</script>

<route lang="yaml">
name: Admin Users
meta:
  layout: admin
  requiresAuth: true
  adminOnly: true
  path: /admin/users
</route>



