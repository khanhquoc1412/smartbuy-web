<template>
  <div class="app-forgot-password">
    <Container>
      <div class="form-input">
        <h1 class="form__title">
          {{ stepTitle }}
        </h1>

        <!-- Step 1: Email Input -->
        <form v-if="step === 1" @submit.prevent="handleSendOTP" class="tw-flex tw-flex-col tw-gap-4">
          <p class="form__text">
            Vui lòng nhập địa chỉ email của bạn để nhận mã xác thực.
          </p>
          <MyInput v-model="email" placeholder="Nhập email của bạn" />
          
          <p v-if="forgotPasswordError" class="form__noti form__noti--error tw-text-red tw-text-sm tw-mt-0.5 tw-block">
            {{ (forgotPasswordError as IError)?.message }}
          </p>

          <button type="submit" class="form__btn--submit" :disabled="isForgotPasswordLoading">
            {{ isForgotPasswordLoading ? 'Đang gửi...' : 'Gửi mã xác thực' }}
          </button>
        </form>

        <!-- Step 2: OTP Input -->
        <div v-else-if="step === 2" class="tw-flex tw-flex-col tw-gap-4 tw-items-center">
             <OTPInput 
                :email="email" 
                type="forgot-password" 
                @verified="handleOTPVerified"
                @resend="handleResendOTP"
            />
            <button @click="step = 1" class="tw-text-sm tw-text-gray-500 hover:tw-text-red-500 tw-transition-colors">
                Quay lại
            </button>
        </div>

        <!-- Step 3: New Password -->
        <form v-else-if="step === 3" @submit.prevent="handleResetPassword" class="tw-flex tw-flex-col tw-gap-4">
           <p class="form__text">
            Nhập mật khẩu mới của bạn.
          </p>
          <MyInput v-model="password" type="password" placeholder="Mật khẩu mới" />
          <MyInput v-model="confirmPassword" type="password" placeholder="Xác nhận mật khẩu mới" />

          <p v-if="resetPasswordError" class="form__noti form__noti--error tw-text-red tw-text-sm tw-mt-0.5 tw-block">
            {{ (resetPasswordError as IError)?.message }}
          </p>

           <button type="submit" class="form__btn--submit" :disabled="isResetPasswordLoading">
            {{ isResetPasswordLoading ? 'Đang xử lý...' : 'Đổi mật khẩu' }}
          </button>
        </form>

      </div>
    </Container>
  </div>
</template>
  
<script lang="ts" setup>
import { IError } from "@/types/error.type";
import Container from "@components/base/Container.vue";
import MyInput from "@components/common/MyInput/index.vue"
import OTPInput from "@components/auth/OTPInput.vue"
import { useAuth } from "@composables/useAuth"
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "@composables/useToast";

const router = useRouter();
const { add } = useToast();
const { 
  forgotPassword, 
  forgotPasswordData, 
  forgotPasswordError, 
  isForgotPasswordLoading,
  resetPassword,
  resetPasswordError,
  isResetPasswordLoading
} = useAuth()

const step = ref(1);
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const resetToken = ref("");
const userId = ref("");

const stepTitle = computed(() => {
  if (step.value === 1) return "Quên mật khẩu";
  if (step.value === 2) return "Xác thực OTP";
  return "Đặt lại mật khẩu";
});

const handleSendOTP = async () => {
  await forgotPassword(email.value);
  if (forgotPasswordData.value) {
    step.value = 2;
  }
}

const handleOTPVerified = (data: any) => {
  console.log("OTP Verified:", data);
  resetToken.value = data.token;
  userId.value = data.userId;
  step.value = 3;
}

const handleResendOTP = async () => {
   await forgotPassword(email.value);
}

const handleResetPassword = async () => {
  if (password.value !== confirmPassword.value) {
     add({
        title: 'Lỗi',
        description: 'Mật khẩu xác nhận không khớp',
        color: 'red'
    });
    return;
  }

  await resetPassword(userId.value, resetToken.value, {
    password: password.value,
    confirmPassword: confirmPassword.value
  });

  if (!resetPasswordError.value) {
     add({
        title: 'Thành công',
        description: 'Đổi mật khẩu thành công! Vui lòng đăng nhập.',
        color: 'green'
    });
    router.push('/login');
  }
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
      
      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }

  }
}
</style>