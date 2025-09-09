<template>
    <div class="account-changePassword">
        <div class="account-secure tw-flex tw-flex-col tw-gap-5">
            <h1 class="account-title">Đổi mật khẩu</h1>
            <form class="form tw-flex tw-flex-col tw-gap-3">
                <MyInput type="text" placeholder="Nhập mật khẩu hiện tại" />
                <MyInput type="text" placeholder="Nhập mật khẩu mới" />
                <MyInput type="text" placeholder="Xác nhận mật khẩu" />
                <button type="submit" class="tw-self-start hover:tw-opacity-75 tw-transition-all">
                    Đổi mật khẩu
                </button>
            </form>
        </div>
    </div>
</template>
  
<script lang="ts" setup>
import MyInput from "@components/common/MyInput/index.vue"
import { useAuth } from '@composables/useAuth'


</script>
<route lang="yaml">
    name: Thay đổi mật khẩu
    meta:
      requiresAuth: true
      layout: "accountLayout"
  </route>
<style lang="scss">
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