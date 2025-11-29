<template>
  <div class="app-login">
    <Container class="tw-flex tw-flex-col tw-items-center">
      <div class="login-main tw-flex tw-flex-col tw-gap-6">
        <!-- Logo & Title -->
        <div class="login__image">
          <img :src="Logo" alt="" />
          <h1>Đăng nhập tài khoản</h1>
        </div>

        <!-- OTP Input (shown after login) -->
        <OTPInput
          v-if="showOTPInput"
          :email="tempEmail"
          type="login"
          @verified="handleOTPVerified"
          @resend="handleOTPResend"
        />

        <!-- Login Form (default view) -->
        <template v-else>
          <p class="tw-text-red tw-text-sm tw-mt-0.5 tw-block tw-self-center">
            {{ errorMessage }}
          </p>
          <form
            @submit.prevent="handleLogin"
            class="login-form tw-flex tw-flex-col tw-gap-5"
          >
            <div class="form__group tw-flex tw-flex-col tw-gap-4">
              <div>
                <MyInput
                  placeholder="example@gmail.com"
                  v-model="loginData.email"
                  name="email"
                  type="email"
                  required
                />
              </div>
              <div>
                <MyInput
                  placeholder="Nhập mật khẩu"
                  type="password"
                  v-model="loginData.password"
                  name="password"
                  required
                />
              </div>
              <router-link
                to="/forgot-password"
                class="forget-pass tw-self-end hover:tw-text-red tw-italic tw-text-gray-500 tw-cursor-pointer"
              >
                Quên mật khẩu
              </router-link>
            </div>
            <button
              type="submit"
              :disabled="isLoading"
              class="btn-form__submit tw-text-center hover:tw-opacity-75 tw-transition-all tw-cursor-pointer"
            >
              {{ isLoading ? "Đang xử lý..." : "Đăng nhập" }}
            </button>
          </form>
          <div class="line-through tw-flex tw-gap-2 tw-items-center">
            <div class="tw-flex-1"></div>
            <p>Hoặc đăng nhập bằng</p>
            <div class="tw-flex-1"></div>
          </div>
          <div class="login-option tw-flex tw-justify-center tw-gap-8">
            <div
              class="login-option__google tw-flex tw-gap-2 tw-items-center"
              @click="handleSocialLogin('google')"
            >
              <div class="icon">
                <svg
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      d="M30.0014 16.3109C30.0014 15.1598 29.9061 14.3198 29.6998 13.4487H16.2871V18.6442H24.1601C24.0014 19.9354 23.1442 21.8798 21.2394 23.1864L21.2127 23.3604L25.4536 26.58L25.7474 26.6087C28.4458 24.1665 30.0014 20.5731 30.0014 16.3109Z"
                      fill="#4285F4"
                    ></path>
                    <path
                      d="M16.2863 29.9998C20.1434 29.9998 23.3814 28.7553 25.7466 26.6086L21.2386 23.1863C20.0323 24.0108 18.4132 24.5863 16.2863 24.5863C12.5086 24.5863 9.30225 22.1441 8.15929 18.7686L7.99176 18.7825L3.58208 22.127L3.52441 22.2841C5.87359 26.8574 10.699 29.9998 16.2863 29.9998Z"
                      fill="#34A853"
                    ></path>
                    <path
                      d="M8.15964 18.769C7.85806 17.8979 7.68352 16.9645 7.68352 16.0001C7.68352 15.0356 7.85806 14.1023 8.14377 13.2312L8.13578 13.0456L3.67083 9.64746L3.52475 9.71556C2.55654 11.6134 2.00098 13.7445 2.00098 16.0001C2.00098 18.2556 2.55654 20.3867 3.52475 22.2845L8.15964 18.769Z"
                      fill="#FBBC05"
                    ></path>
                    <path
                      d="M16.2864 7.4133C18.9689 7.4133 20.7784 8.54885 21.8102 9.4978L25.8419 5.64C23.3658 3.38445 20.1435 2 16.2864 2C10.699 2 5.8736 5.1422 3.52441 9.71549L8.14345 13.2311C9.30229 9.85555 12.5086 7.4133 16.2864 7.4133Z"
                      fill="#EB4335"
                    ></path>
                  </g>
                </svg>
              </div>
              <span> Google </span>
            </div>
            <div
              class="login-option__facebook tw-flex tw-gap-2 tw-items-center"
              @click="handleSocialLogin('facebook')"
            >
              <div class="icon">
                <svg
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      fill="url(#paint0_linear_87_7208)"
                    ></circle>
                    <path
                      d="M21.2137 20.2816L21.8356 16.3301H17.9452V13.767C17.9452 12.6857 18.4877 11.6311 20.2302 11.6311H22V8.26699C22 8.26699 20.3945 8 18.8603 8C15.6548 8 13.5617 9.89294 13.5617 13.3184V16.3301H10V20.2816H13.5617V29.8345C14.2767 29.944 15.0082 30 15.7534 30C16.4986 30 17.2302 29.944 17.9452 29.8345V20.2816H21.2137Z"
                      fill="white"
                    ></path>
                    <defs>
                      <linearGradient
                        id="paint0_linear_87_7208"
                        x1="16"
                        y1="2"
                        x2="16"
                        y2="29.917"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#18ACFE"></stop>
                        <stop offset="1" stop-color="#0163E0"></stop>
                      </linearGradient>
                    </defs>
                  </g>
                </svg>
              </div>
              <span> Facebook </span>
            </div>
          </div>
          <div class="login-question tw-flex tw-gap-2 tw-self-center tw-pt-3">
            <p class="login-question__text">Bạn chưa có tài khoản?</p>
            <router-link
              to="/register"
              class="login-question__go-register tw-transition-all"
            >
              Đăng ký ngay
            </router-link>
          </div>
        </template>
      </div>
    </Container>
  </div>
</template>

<script lang="ts" setup>
import Container from "@components/base/Container.vue";
import Logo from "@assets/svg/dshop-favicon-red.svg";
import MyInput from "@components/common/MyInput/index.vue";
import OTPInput from "@components/auth/OTPInput.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStorage } from "@vueuse/core";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_ID } from "@/utils/constants";
import useAuthStore from "@/store/auth";
import { storeToRefs } from "pinia";


const router = useRouter();
const { loggedIn, userInfo } = storeToRefs(useAuthStore());
const accessToken = useStorage(ACCESS_TOKEN_KEY, "");
const refreshToken = useStorage(REFRESH_TOKEN_KEY, "");
const userId = useStorage(USER_ID, "");

const loginData = ref({
  email: "",
  password: "",
});

const showOTPInput = ref(false);
const tempEmail = ref("");
const isLoading = ref(false);
const errorMessage = ref("");

const handleLogin = async () => {
  if (!loginData.value.email || !loginData.value.password) {
    errorMessage.value = "Vui lòng nhập đầy đủ thông tin";
    return;
  }

  isLoading.value = true;
  errorMessage.value = "";

  try {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData.value),
   });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Đăng nhập thất bại");
    }

    // Login success - requires OTP
    if (data.requireOTP) {
      tempEmail.value = loginData.value.email;
      showOTPInput.value = true;
    }
  } catch (error: any) {
    errorMessage.value = error.message || "Có lỗi xảy ra, vui lòng thử lại";
  } finally {
    isLoading.value = false;
  }
};

const handleOTPVerified = (tokens: any) => {
  // Save tokens
  accessToken.value = tokens.accessToken;
  refreshToken.value = tokens.refreshToken;
  userId.value = String(tokens.user.id);
  loggedIn.value = true;
  userInfo.value = tokens.user;

  // Show success toast
  const toast = useToast();
  toast.add({
    title: "Đăng nhập thành công",
    description: `Chào mừng trở lại, ${tokens.user.userName}!`,
    color: "green",
  });

  // Redirect to home
  router.push("/");
};

const handleOTPResend = () => {
  const toast = useToast();
  toast.add({
    title: "Đã gửi lại mã OTP",
    description: "Vui lòng kiểm tra email của bạn",
    color: "blue",
  });
};

const handleSocialLogin = (provider: "google" | "facebook") => {
  const url =
    provider === "google"
      ? "http://localhost:3005/api/auth/google"
      : "http://localhost:3005/api/auth/facebook";
  window.open(url, "_self");
};
</script>

<route lang="yaml">
name: Đăng nhập
meta:
  layout: "default"
</route>

<style lang="scss">
.app-login {
  .login-main {
    padding: 40px 0;
    max-width: 600px;
    width: 100%;

    .login__image {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;

      h1 {
        font-size: 18px;
        font-weight: 600;
      }

      img {
        height: 80px;
        width: auto;
      }
    }

    .login-form {
      .forget-pass {
        font-size: 13px;
      }

      .btn-form__submit {
        background-color: $red;
        padding: 12px;
        border-radius: 8px;
        font-weight: 500;
        color: $white;

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      }
    }

    .line-through {
      div {
        height: 1px;
        background-color: $gray;
      }

      p {
        font-weight: 500;
      }
    }

    .login-option {
      &__google,
      &__facebook {
        cursor: pointer;

        &:hover {
          opacity: 0.75;
        }

        span {
          font-weight: 500;
        }

        .icon {
          height: 30px;
          width: 30px;

          svg {
            width: 100%;
            height: 100%;
          }
        }
      }

      &__facebook {
        .icon {
          height: 34px;
          width: 34px;
        }
      }
    }

    .login-question {
      font-size: 14px;

      &__text {
        color: $gray;
      }

      &__go-register {
        color: $red;
        font-weight: 500;

        &:hover {
          border-bottom: 1.5px solid $red;
        }
      }
    }
  }
}
</style>
