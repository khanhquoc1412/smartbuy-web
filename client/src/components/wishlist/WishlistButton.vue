<template>
  <button
    class="wishlist-btn"
    @click="handleClick"
    :disabled="isLoading"
    :title="isInWishlist ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'"
  >
    <font-awesome-icon
      :icon="isInWishlist ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"
      :class="{ 'text-red': isInWishlist }"
    />
  </button>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { $axios } from "@/plugins/axios/axios";
import { useAuth } from "@/composables/useAuth";
import { useRouter } from "vue-router";

interface Props {
  productId: string;
  variantId?: string;
  colorId?: string | number;
  memoryId?: string | number;
  isInWishlist?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isInWishlist: false,
});

const emit = defineEmits<{
  (e: "update"): void;
}>();

const router = useRouter();
const { loggedIn } = useAuth();
const isLoading = ref(false);

const handleClick = async () => {
  if (!loggedIn.value) {
    router.push(`/login?redirect=${router.currentRoute.value.fullPath}`);
    return;
  }

  isLoading.value = true;
  try {
    if (props.isInWishlist) {
      let url = `/user/wishlist/${props.productId}`;
      if (props.variantId) {
        url += `?variantId=${props.variantId}`;
      }
      await $axios.delete(url);
      showToast('Đã xóa khỏi danh sách yêu thích', 'success');
    } else {
      const payload: any = {
        productId: props.productId,
      };
      
      // Thêm thông tin variant nếu có
      if (props.variantId) payload.variantId = props.variantId;
      if (props.colorId) payload.colorId = String(props.colorId);
      if (props.memoryId) payload.memoryId = String(props.memoryId);
      
      await $axios.post("/user/wishlist", payload);
      showToast('Đã thêm vào danh sách yêu thích', 'success');
    }
    emit("update");
  } catch (error: any) {
    console.error("Wishlist error:", error);
    showToast(error.response?.data?.message || "Có lỗi xảy ra", 'error');
  } finally {
    isLoading.value = false;
  }
};

// Simple toast notification function
const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
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

<style scoped lang="scss">
.wishlist-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  font-size: 20px;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    transform: scale(1.2);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .text-red {
    color: #e31837;
  }
}
</style>
