<template>
  <div class="flex flex-col md:flex-row gap-6 p-6">
    <div class="w-full md:w-1/2">
      <div class="border rounded-lg p-2 flex justify-center items-center h-96 bg-gray-50">
        <img :src="selectedImage" alt="Main image" class="max-h-full max-w-full object-contain" />
      </div>
      <div class="flex mt-4 gap-2 overflow-x-auto">
        <div v-for="(img, index) in images" :key="index" class="w-20 h-20 border rounded-md cursor-pointer flex justify-center items-center" :class="selectedImage === img ? 'ring-2 ring-blue-500' : ''" @click="selectedImage = img">
          <img :src="img" alt="thumbnail" class="max-h-full max-w-full object-contain" />
        </div>
      </div>
      <div class="mt-4">
        <input type="text" v-model="newImageUrl" placeholder="Dán link ảnh mới..." class="border rounded p-2 w-full" />
        <button @click="addImage" class="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Thêm ảnh</button>
      </div>
    </div>

    <div class="w-full md:w-1/2 space-y-4">
      <h2 class="text-2xl font-bold">Thông tin sản phẩm</h2>
      <div>
        <label class="block text-sm font-medium">Tên sản phẩm</label>
        <input v-model="product.name" type="text" class="border rounded w-full p-2" />
      </div>
      <div>
        <label class="block text-sm font-medium">Mô tả ngắn</label>
        <textarea v-model="product.shortDescription" rows="3" class="border rounded w-full p-2"></textarea>
      </div>
      <div>
        <label class="block text-sm font-medium">Giá</label>
        <input v-model="product.price" type="number" class="border rounded w-full p-2" />
      </div>
      <button @click="saveProduct" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Lưu thay đổi</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const images = ref([
  'https://via.placeholder.com/400x400?text=Ảnh+1',
  'https://via.placeholder.com/400x400?text=Ảnh+2',
  'https://via.placeholder.com/400x400?text=Ảnh+3',
])

const selectedImage = ref(images.value[0])
const newImageUrl = ref('')

const product = ref({
  name: 'Xiaomi Redmi Note 13 Pro 5G',
  shortDescription: 'Màn hình AMOLED 6,67 inch, tần số quét 120Hz, pin 5100mAh...',
  price: 7990000,
})

function addImage() {
  if (newImageUrl.value.trim() !== '') {
    images.value.push(newImageUrl.value.trim())
    newImageUrl.value = ''
  }
}

function saveProduct() {
  console.log('Sản phẩm đã lưu:', product.value, images.value)
  alert('Đã lưu sản phẩm (console log)')
}
</script>

<route lang="yaml">
name: Admin Product Detail
meta:
  layout: admin
  requiresAuth: true
  adminOnly: true
  path: /admin/products/:id
</route>



