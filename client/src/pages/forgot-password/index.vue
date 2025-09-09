<template>
  <div class="app-forgot-password">
    <Container>
      <form class="form-input" @submit.prevent="handleResetPassword">
        <h1 class="form__title">
          Đặt lại mật khẩu
        </h1>
        <p v-if="forgotPasswordError" class="form__noti form__noti--error tw-text-red tw-text-sm tw-mt-0.5 tw-block">
          {{ (forgotPasswordError as IError)?.message }}
        </p>
        <p v-if="forgotPasswordData" class="form__noti form__noti--success tw-text-success tw-text-sm tw-mt-0.5 tw-block">
          {{ (forgotPasswordData as any)?.message }}
        </p>
        <h class="form__text">
          Vui lòng nhập địa chỉ email của bạn
        </h>
        <MyInput v-model="email" placeholder="Nhập email của bạn" />
        <button type="submit" class="form__btn--submit">
          Đặt lại mật khẩu
        </button>
      </form>
    </Container>

  </div>
</template>
  
<script lang="ts" setup>
import { IError } from "@/types/error.type";
import Container from "@components/base/Container.vue";
import MyInput from "@components/common/MyInput/index.vue"

const email = ref<string>('')
const { forgotPassword,
  forgotPasswordData,
  forgotPasswordError } = useAuth()
const handleResetPassword = async () => {
  await forgotPassword(email.value)
}
</script>
<route lang="yaml">
  name: Quên mật khẩu
  meta:
    layout: "default"
</route>
<style lang="scss">
.app-forgot-password {
  padding: 80px 0;

  .form-input {
    width: 600px;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin: auto;
    background-color: $light-primary;
    padding: 20px;
    border-radius: 4px;

    .form__text {
      font-size: 13px;
      color: $gray;
    }

    .form__noti {
      padding: 8px 12px;
      border-radius: 4px;

      &--success {
        background-color: rgba(0, 199, 0, 0.1);
      }

      &--error {
        background-color: rgba(255, 2, 2, 0.1);
      }
    }

    .form__title {
      font-size: 18px;
      font-weight: 600;

    }

    .form__btn--submit {
      background-color: $azure;
      color: $white;
      align-self: flex-start;
      padding: 8px 12px;
      border-radius: 4px;
      width: auto;
      transition: all .2s cubic-bezier(0.075, 0.82, 0.165, 1);

      &:hover {
        opacity: 0.75;
      }
    }

  }
}
</style>