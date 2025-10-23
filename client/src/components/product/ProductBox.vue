<template>
  <div class="app-product-box tw-grid tw-grid-cols-5 tw-gap-5">
    <slot></slot>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.app-product-box {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: 1fr;

  @include min-sm {
    grid-template-columns: repeat(2, 1fr);
  }

  @include min-lg {
    grid-template-columns: repeat(3, 1fr);
  }

  @include min-xl {
    grid-template-columns: repeat(4, 1fr);
  }

  @include min-xxl {
    grid-template-columns: repeat(5, 1fr);
  }
}
</style>
