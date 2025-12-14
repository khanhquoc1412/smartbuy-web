<template>
  <div class="account-changePassword">
    <div class="account-secure tw-flex tw-flex-col tw-gap-5">
      <h1 class="account-title">Đổi mật khẩu</h1>
      <form
        class="form tw-flex tw-flex-col tw-gap-3"
        @submit.prevent="handleChangePassword"
      >
        <!-- Hidden username field for password manager accessibility -->
        <input
          type="text"
          name="username"
          autocomplete="username"
          style="display: none"
          aria-hidden="true"
          tabindex="-1"
        />
        <MyInput
          type="password"
          placeholder="Nhập mật khẩu hiện tại"
          autocomplete="current-password"
          v-model="currentPassword"
        />
        <MyInput
          type="password"
          placeholder="Nhập mật khẩu mới"
          autocomplete="new-password"
          v-model="newPassword"
        />
        <MyInput
          type="password"
          placeholder="Xác nhận mật khẩu"
          autocomplete="new-password"
          v-model="confirmNewPassword"
        />
        <button
          type="submit"
          class="tw-self-start hover:tw-opacity-75 tw-transition-all disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
          :disabled="isLoading"
        >
          {{ isLoading ? "Đang xử lý..." : "Đổi mật khẩu" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import MyInput from "@components/common/MyInput/index.vue";
import { $axios } from "@/plugins/axios/axios";

const currentPassword = ref("");
const newPassword = ref("");
const confirmNewPassword = ref("");
const isLoading = ref(false);

const handleChangePassword = async () => {
  // Basic validation
  if (
    !currentPassword.value ||
    !newPassword.value ||
    !confirmNewPassword.value
  ) {
    showToast("Vui lòng điền đầy đủ thông tin", "error");
    return;
  }

  if (newPassword.value !== confirmNewPassword.value) {
    showToast("Mật khẩu mới không khớp", "error");
    return;
  }

  if (newPassword.value.length < 6) {
    showToast("Mật khẩu phải có ít nhất 6 ký tự", "error");
    return;
  }

  isLoading.value = true;
  try {
    await $axios.post("/auth/change-password", {
      currentPassword: currentPassword.value,
      newPassword: newPassword.value,
      confirmNewPassword: confirmNewPassword.value,
    });

    showToast("Đổi mật khẩu thành công!", "success");
    // Clear form
    currentPassword.value = "";
    newPassword.value = "";
    confirmNewPassword.value = "";
  } catch (error: any) {
    console.error("Change password error:", error);
    const message = error.response?.data?.message || "Đổi mật khẩu thất bại";
    showToast(message, "error");
  } finally {
    isLoading.value = false;
  }
};

const showToast = (message: string, type: "success" | "error" = "success") => {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === "success" ? "#4CAF50" : "#f44336"};
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
    toast.style.animation = "slideOut 0.3s ease";
    setTimeout(() => document.body.removeChild(toast), 300);
  }, 3000);
};
</script>

<route lang="yaml">
name: Thay đổi mật khẩu
meta:
  requiresAuth: true
  layout: "accountLayout"
</route>

<style lang="scss">
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

.account-changePassword {
  .account-secure {
    button {
      padding: 10px 12px;
      border-radius: 4px;
      background-color: $azure;
      color: $white;
    }
  }

  .account-title {
    font-size: 13px;
    font-weight: 500;
    line-height: 120%;
    text-transform: uppercase;
  }
}
</style>
