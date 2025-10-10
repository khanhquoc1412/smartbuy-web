<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
onMounted(() => router.replace('/admin/dashboard'))
</script>

<template></template>

<route lang="yaml">
name: Admin
meta:
  layout: admin
  requiresAuth: true
  adminOnly: true
  path: /admin
</route>



