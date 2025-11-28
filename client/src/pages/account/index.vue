<template>
  <div class="account-profile">
    <div class="profile-info">
      <h1 class="profile-title">Thông tin cá nhân</h1>
      <div class="info-user">
        <div class="box-text">
          <span class="label"> Họ và tên: </span>
          <div class="user-name">{{ user.userName }}</div>
        </div>
        <div class="box-text">
          <span class="label"> Email </span>
          <div class="user-email">{{ user.email }}</div>
        </div>
      </div>
    </div>

    <!-- Địa chỉ giao hàng -->
    <div class="tw-mt-8">
      <div
        class="tw-flex tw-items-center tw-justify-between tw-pb-5 tw-border-b tw-border-gray-200"
      >
        <h2 class="tw-text-sm tw-font-semibold tw-uppercase tw-text-gray-900">
          Địa chỉ giao hàng
        </h2>
        <button
          @click="handleAddAddress"
          class="tw-flex tw-items-center tw-gap-2 tw-px-4 tw-py-2 tw-bg-red tw-text-white tw-rounded-lg hover:tw-bg-opacity-90 tw-transition-colors"
        >
          <svg
            class="tw-w-5 tw-h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>Thêm địa chỉ mới</span>
        </button>
      </div>

      <!-- Loading state -->
      <div v-if="isLoadingAddresses" class="tw-py-12 tw-text-center">
        <div
          class="tw-inline-block tw-animate-spin tw-rounded-full tw-h-8 tw-w-8 tw-border-4 tw-border-gray-200 tw-border-t-red"
        ></div>
        <p class="tw-mt-2 tw-text-gray-500">Đang tải địa chỉ...</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="addressCount === 0" class="tw-py-12 tw-text-center">
        <svg
          class="tw-mx-auto tw-h-12 tw-w-12 tw-text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <h3 class="tw-mt-2 tw-text-sm tw-font-medium tw-text-gray-900">
          Chưa có địa chỉ nào
        </h3>
        <p class="tw-mt-1 tw-text-sm tw-text-gray-500">
          Thêm địa chỉ giao hàng để đặt hàng nhanh hơn
        </p>
        <div class="tw-mt-6">
          <button
            @click="handleAddAddress"
            class="tw-px-6 tw-py-2 tw-bg-red tw-text-white tw-rounded-lg hover:tw-bg-opacity-90 tw-transition-colors"
          >
            Thêm địa chỉ đầu tiên
          </button>
        </div>
      </div>

      <!-- Address list -->
      <div
        v-else
        class="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-4 tw-mt-6"
      >
        <AddressCard
          v-for="address in addresses"
          :key="address._id"
          :address="address"
          @edit="handleEditAddress(address)"
          @delete="handleDeleteAddress(address._id)"
          @set-default="handleSetDefault(address._id)"
        />
      </div>
    </div>

    <!-- Address Form Dialog -->
   <AddressFormDialog
      v-model="showAddressDialog"
      :mode="selectedAddress ? 'edit' : 'add'"
      :address="selectedAddress"
      :loading="isAdding || isUpdating"
      @submit="handleSubmitAddress"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useAuth } from "@/composables/useAuth";
import { useAddress } from "@/composables/useAddress";
import AddressCard from "@/components/address/AddressCard.vue";
import AddressFormDialog from "@/components/address/AddressFormDialog.vue";
import type { IAddress, IAddressPayload } from "@/types/address.type";

// Auth
const { user } = useAuth();

// Addresses
const {
  addresses,
  addressCount,
  isLoadingAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  isAdding,
  isUpdating,
} = useAddress();

console.log("✅ useAddress() returned:");
console.log("  addresses:", addresses);
console.log("  addressCount:", addressCount);
console.log("  isLoadingAddresses:", isLoadingAddresses);

// Dialog state
const isDialogOpen = ref(false);
const dialogMode = ref<"add" | "edit">("add");

// Open add dialog
const openAddDialog = () => {
  console.log("➕ Opening add address dialog");
  dialogMode.value = "add";
  selectedAddress.value = null;
  isDialogOpen.value = true;
};
// Dialog state
const showAddressDialog = ref(false);
const selectedAddress = ref<IAddress | null>(null);

// Handlers
const handleAddAddress = () => {
  console.log("➕ Opening add address dialog");
  selectedAddress.value = null;
  showAddressDialog.value = true;
};

const handleEditAddress = (address: IAddress) => {
  console.log("✏️ Opening edit address dialog:", address);
  selectedAddress.value = address;
  showAddressDialog.value = true;
};

// ✅ FIX: Gọi wrapper functions trực tiếp
const handleSubmitAddress = async (payload: IAddressPayload) => {
  console.log("==========================================");
  console.log("📝 handleSubmitAddress CALLED");
  console.log("  Payload:", payload);
  console.log("  Payload type:", typeof payload);
  console.log("  Payload keys:", Object.keys(payload));
  console.log("==========================================");

  if (!payload) {
    showToast("Lỗi: Dữ liệu form không hợp lệ!", 'error');
    return;
  }

  try {
    if (selectedAddress.value) {
      console.log("🔄 UPDATE MODE");

      // ✅ Gọi wrapper function trực tiếp
      await updateAddress(selectedAddress.value._id, payload);

      console.log("✅ Update complete");
    } else {
      console.log("➕ ADD MODE");

      // ✅ Gọi wrapper function trực tiếp
      const result = await addAddress(payload);

      console.log("✅ Add complete, result:", result);
    }

    showAddressDialog.value = false;
    selectedAddress.value = null;
  } catch (error: any) {
    console.error("❌ Submit address error:", error);
    showToast("Có lỗi xảy ra. Vui lòng thử lại!", 'error');
  }
};

const handleDeleteAddress = async (id: string) => {
  if (!confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
    return;
  }

  try {
    await deleteAddress(id);
    showToast("Xóa địa chỉ thành công!", 'success');
  } catch (error: any) {
    showToast(error?.message || "Xóa địa chỉ thất bại!", 'error');
  }
};

const handleSetDefault = async (id: string) => {
  try {
    await setDefaultAddress(id);
    showToast("Đặt địa chỉ mặc định thành công!", 'success');
  } catch (error: any) {
    showToast("Đặt địa chỉ mặc định thất bại!", 'error');
  }
};
onMounted(() => {
  console.log("🎬 Component MOUNTED");
  console.log("  addresses.value:", addresses.value);
  console.log("  addressCount.value:", addressCount.value);
  console.log("  isLoadingAddresses.value:", isLoadingAddresses.value);
});
const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === 'success' ? '#4CAF50' : '#f44336'};
    color: white;
    padding: 16px 24px;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    font-size: 14px;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => document.body.removeChild(toast), 300);
  }, 3000);
};
</script>
<route lang="yaml">
name: Thông tin cá nhân
meta:
  requiresAuth: true
  layout: "accountLayout"
</route>
<style lang="scss" scoped>
.account-profile {
  display: flex;
  flex-direction: column;
  gap: 30px;

  .profile-title {
    font-size: 14px;
    font-weight: 600;
    line-height: 120%;
    text-transform: uppercase;
    padding-bottom: 20px;
    border-bottom: 1px solid $border-section;
  }

  .profile-info {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .info-user {
      display: flex;
      gap: 8px;
      font-weight: 400;

      .box-text {
        color: $gray;
        display: flex;
        flex-direction: column;
        gap: 8px;
        background-color: $bg-light-gray;
        padding: 10px;
        flex: 1;
        border-radius: 8px;

        .label {
          color: $black;
          font-weight: 500;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
