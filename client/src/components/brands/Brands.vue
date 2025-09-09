<template>
  <div class="app-brands tw-grid tw-grid-cols-6 lg:tw-grid-cols-7">
    <div
      class="brands-item tw-flex tw-items-center tw-justify-center tw-p-4 xl:tw-p-10 lg:tw-p-7 sm:tw-p-3 tw-aspect-square"
      v-for="brand in brands"
      :key="brand.name"
    >
      <img :src="brand.img" alt="" class="tw-w-full"/>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { brands } from "@utils/brands";
import { ILoginBody } from "@/types/auth.types";
</script>
<script lang="ts">
export default {
  name: "Brands"
}
</script>
<style scoped lang="scss">
</style>