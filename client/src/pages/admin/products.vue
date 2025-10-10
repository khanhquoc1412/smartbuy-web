<template>
  <v-container fluid>
    <v-row class="mb-4" align="center" justify="space-between">
      <v-col cols="12" sm="6">
        <h2 class="text-h5">Quản lý sản phẩm</h2>
      </v-col>
      <v-col cols="12" sm="6" class="text-right">
        <v-btn color="primary" @click="openCreate">+ Thêm sản phẩm</v-btn>
      </v-col>
    </v-row>

    <v-row class="mb-4" align="center" justify="start">
      <v-col cols="12" sm="4">
        <v-text-field v-model="search" label="Tìm kiếm" prepend-inner-icon="mdi-magnify" hide-details />
      </v-col>
    </v-row>

    <v-table density="comfortable">
      <thead>
        <tr>
          <th>Tên</th>
          <th>Danh mục</th>
          <th>Thương hiệu</th>
          <th>Giá</th>
          <th>Khuyến mãi</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in filtered" :key="p.id">
          <td class="tw-flex tw-items-center tw-gap-2">
            <img :src="p.thumbUrl" alt="thumb" style="width:40px;height:40px;object-fit:cover;border-radius:6px" />
            <span class="tw-font-medium">{{ p.name }}</span>
          </td>
          <td>{{ p.categoryName }}</td>
          <td>{{ p.brandName }}</td>
          <td>{{ formatVnd(p.basePrice) }}</td>
          <td>{{ p.discountPercentage || 0 }}%</td>
          <td>
            <v-btn size="small" variant="text" color="primary" @click="openEdit(p)">Sửa</v-btn>
            <v-btn size="small" variant="text" color="error" @click="confirmDelete(p)">Xóa</v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <div class="tw-flex tw-justify-end tw-mt-3">
      <v-pagination v-model="page" :length="total" color="primary" />
    </div>

    <v-dialog v-model="dialog" max-width="640">
      <v-card>
        <v-card-title>{{ editing ? 'Sửa sản phẩm' : 'Thêm sản phẩm' }}</v-card-title>
        <v-card-text>
          <v-form ref="formRef" v-model="formValid">
            <v-text-field v-model="form.name" label="Tên sản phẩm" :rules="[v=>!!v||'Bắt buộc']"/>
            <v-textarea v-model="form.description" label="Mô tả" rows="3"/>
            <v-text-field v-model.number="form.basePrice" type="number" label="Giá" :rules="[v=>v>0||'>0']"/>
            <v-text-field v-model.number="form.discountPercentage" type="number" label="Khuyến mãi %"/>
            <v-text-field v-model="form.thumbUrl" label="Ảnh đại diện URL"/>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialog=false">Hủy</v-btn>
          <v-btn color="primary" :disabled="!formValid" @click="save">Lưu</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import { ref, computed, onMounted } from 'vue'

// Base URL for product service
const api = axios.create({ baseURL: 'http://localhost:3001/api/product' })

const products = ref<any[]>([])
const total = ref(1)
const page = ref(1)
const limit = 10
const search = ref('')

async function load() {
  const { data } = await api.get('/get-all', { params: { page: page.value, limit } })
  products.value = data.products
  total.value = data.total
}

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return products.value
  return products.value.filter(p => p.name?.toLowerCase().includes(q))
})

onMounted(load)

watch(page, load)

function formatVnd(val: number) { return val?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) }

const dialog = ref(false)
const editing = ref(false)
const formValid = ref(true)
const formRef = ref()
const form = ref<any>({ id: '', name: '', description: '', basePrice: 0, discountPercentage: 0, thumbUrl: '' })

function openCreate() { editing.value = false; form.value = { name: '', description: '', basePrice: 0, discountPercentage: 0, thumbUrl: '' }; dialog.value = true }
function openEdit(p: any) { editing.value = true; form.value = { id: p.id, name: p.name, description: p.description, basePrice: p.basePrice, discountPercentage: p.discountPercentage, thumbUrl: p.thumbUrl }; dialog.value = true }
async function save() {
  if (!(await formRef.value?.validate())) return
  if (editing.value) {
    await api.put(`/update/${form.value.id}`, form.value)
  } else {
    await api.post('/create', form.value)
  }
  dialog.value = false
  await load()
}
async function confirmDelete(p: any) {
  if (!confirm('Xóa sản phẩm này?')) return
  await api.delete(`/delete/${p.id}`)
  await load()
}
</script>

<route lang="yaml">
name: Admin Products
meta:
  layout: admin
  requiresAuth: true
  adminOnly: true
  path: /admin/products
</route>



