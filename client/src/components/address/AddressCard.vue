<template>
  <div
    class="tw-bg-white tw-border tw-rounded-lg tw-p-4 tw-transition-all hover:tw-shadow-lg"
    :class="
      address.isDefault ? 'tw-border-red tw-shadow-md' : 'tw-border-gray-200'
    "
  >
    <!-- Header -->
    <div
      class="tw-flex tw-items-center tw-justify-between tw-pb-3 tw-border-b tw-border-gray-200"
    >
      <div class="tw-flex tw-items-center tw-gap-2">
        <span
          v-if="address.isDefault"
          class="tw-px-3 tw-py-1 tw-bg-red tw-text-white tw-text-xs tw-font-medium tw-rounded"
        >
          Mặc định
        </span>
        <span class="tw-font-semibold tw-text-gray-900">{{
          address.label
        }}</span>
      </div>

      <!-- ✅ Nút có width cố định -->
      <div class="tw-flex tw-gap-2">
        <!-- Đặt làm mặc định - Width: 160px -->
        <button
          v-if="!address.isDefault"
          @click="$emit('set-default')"
          class="
            tw-flex tw-items-center tw-justify-center tw-gap-1.5
            tw-w-40
            tw-px-3 tw-py-1.5
            tw-border tw-border-gray-300
            tw-text-xs tw-font-medium tw-text-gray-700
            tw-bg-white
            tw-rounded-lg 
            tw-transition-all tw-duration-200
            hover:tw-bg-red hover:tw-text-white hover:tw-border-red
            focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-red focus:tw-ring-offset-1
            active:tw-scale-95
          "
          title="Đặt làm địa chỉ mặc định"
        >
          <font-awesome-icon :icon="['fas', 'circle-check']" class="tw-text-xs" />
          <span>Đặt làm mặc định</span>
        </button>

        <!-- Sửa - Width: 80px -->
        <button
          @click="$emit('edit')"
          class="
            tw-flex tw-items-center tw-justify-center tw-gap-1.5
            tw-w-20
            tw-px-3 tw-py-1.5
            tw-border tw-border-gray-300
            tw-text-xs tw-font-medium tw-text-gray-700
            tw-bg-white
            tw-rounded-lg 
            tw-transition-all tw-duration-200
            hover:tw-bg-red hover:tw-text-white hover:tw-border-red
            focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-red focus:tw-ring-offset-1
            active:tw-scale-95
          "
          title="Chỉnh sửa địa chỉ"
        >
          <font-awesome-icon :icon="['fas', 'pen-to-square']" class="tw-text-xs" />
          <span>Sửa</span>
        </button>

        <!-- Xóa - Width: 80px -->
        <button
          @click="$emit('delete')"
          class="
            tw-flex tw-items-center tw-justify-center tw-gap-1.5
            tw-w-20
            tw-px-3 tw-py-1.5
            tw-border tw-border-gray-300
            tw-text-xs tw-font-medium tw-text-gray-700
            tw-bg-white
            tw-rounded-lg 
            tw-transition-all tw-duration-200
            hover:tw-bg-red hover:tw-text-white hover:tw-border-red
            focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-red focus:tw-ring-offset-1
            active:tw-scale-95
          "
          title="Xóa địa chỉ"
        >
          <font-awesome-icon :icon="['fas', 'trash-can']" class="tw-text-xs" />
          <span>Xóa</span>
        </button>
      </div>
    </div>

    <!-- Body -->
    <div class="tw-mt-3 tw-space-y-2 tw-text-sm">
      <div class="tw-flex">
        <span class="tw-text-gray-500 tw-w-28">Người nhận:</span>
        <span class="tw-text-gray-900 tw-font-medium">{{
          address.fullName
        }}</span>
      </div>
      <div class="tw-flex">
        <span class="tw-text-gray-500 tw-w-28">Số điện thoại:</span>
        <span class="tw-text-gray-900">{{ address.phone }}</span>
      </div>
      <div class="tw-flex">
        <span class="tw-text-gray-500 tw-w-28">Địa chỉ:</span>
        <span class="tw-text-gray-900">{{ fullAddress }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { IAddress } from "@/types/address.type";

interface Props {
  address: IAddress;
}

interface Emits {
  (e: "edit"): void;
  (e: "delete"): void;
  (e: "set-default"): void;
}

const props = defineProps<Props>();
defineEmits<Emits>();

const fullAddress = computed(() => {
  const { address, ward, district, province } = props.address;
  return `${address}, ${ward}, ${district}, ${province}`;
});
</script>

<style scoped>
/* Smooth transitions cho buttons */
button {
  transform: translateZ(0);
  backface-visibility: hidden;
}

/* Shadow đỏ khi hover */
button:hover {
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.25);
}
</style>