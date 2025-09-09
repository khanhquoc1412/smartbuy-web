<template>
  <div class="app-register">
    <Container class="tw-flex tw-flex-col tw-items-center">
      <div class="register-main tw-flex tw-flex-col tw-gap-6">
        <div class="register__image">
          <img :src="Logo" alt="">
          <h1>
            Đăng ký tài khoản
          </h1>
        </div>
        <p v-if="registerError" class="tw-text-red tw-text-sm tw-mt-0.5 tw-block tw-self-center">
          {{ (registerError as IError)?.message }}
        </p>
        <p v-if="registerData" class="tw-text-success tw-text-sm tw-mt-0.5 tw-block tw-self-center">
          {{ (registerData as any)?.message }}
        </p>
        <form @submit.prevent="handleRegister" class="register-form tw-flex tw-flex-col tw-gap-5">
          <div class="form__group tw-flex tw-flex-col tw-gap-4">
            <div>
              <MyInput placeholder="Họ tên" v-model="dataForm.userName" name="name" />
            </div>
            <div>
              <MyInput placeholder="example@gmail.com" v-model="dataForm.email" name="email" />
            </div>
            <div>
              <MyInput placeholder="Nhập mật khẩu" type="password" v-model="dataForm.password" name="password" />
            </div>
            <div>
              <MyInput placeholder="Nhập lại mật khẩu" type="password" v-model="dataForm.confirmPassword"
                name="password" />
            </div>
          </div>
          <button :disable="isRegisterLoading"
            class="btn-form__submit tw-text-center hover:tw-opacity-75 tw-transition-all tw-cursor-pointer">
            Đăng ký
          </button>
        </form>
        <div class="line-through tw-flex tw-gap-2 tw-items-center">
          <div class="tw-flex-1">
          </div>
          <p>Hoặc đăng ký bằng</p>
          <div class="tw-flex-1">
          </div>
        </div>
        <div class="register-option tw-flex tw-justify-center tw-gap-8">
          <div class="register-option__google tw-flex tw-gap-2 tw-items-center">
            <div class="icon">
              <svg viewBox="-3 0 262 262" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid"
                fill="#000000">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                    fill="#4285F4"></path>
                  <path
                    d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                    fill="#34A853"></path>
                  <path
                    d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                    fill="#FBBC05"></path>
                  <path
                    d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                    fill="#EB4335"></path>
                </g>
              </svg>
            </div>
            <span>
              Google
            </span>
          </div>
          <div class="register-option__facebook tw-flex tw-gap-2 tw-items-center">
            <div class="icon">
              <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <circle cx="16" cy="16" r="14" fill="url(#paint0_linear_87_7208)"></circle>
                  <path
                    d="M21.2137 20.2816L21.8356 16.3301H17.9452V13.767C17.9452 12.6857 18.4877 11.6311 20.2302 11.6311H22V8.26699C22 8.26699 20.3945 8 18.8603 8C15.6548 8 13.5617 9.89294 13.5617 13.3184V16.3301H10V20.2816H13.5617V29.8345C14.2767 29.944 15.0082 30 15.7534 30C16.4986 30 17.2302 29.944 17.9452 29.8345V20.2816H21.2137Z"
                    fill="white"></path>
                  <defs>
                    <linearGradient id="paint0_linear_87_7208" x1="16" y1="2" x2="16" y2="29.917"
                      gradientUnits="userSpaceOnUse">
                      <stop stop-color="#18ACFE"></stop>
                      <stop offset="1" stop-color="#0163E0"></stop>
                    </linearGradient>
                  </defs>
                </g>
              </svg>
            </div>
            <span>
              Facebook
            </span>
          </div>
        </div>
        <div class="register-question tw-flex tw-gap-2 tw-self-center tw-pt-3">
          <p class="register-question__text ">
            Bạn đã có tài khoản?
          </p>
          <router-link to="/login" class="register-question__go-register tw-transition-all">
            Đăng nhập ngay
          </router-link>
        </div>
      </div>
    </Container>
  </div>
</template>
  
<script lang="ts" setup>
import Container from "@components/base/Container.vue";
import Logo from "@assets/svg/dshop-favicon-red.svg"
import MyInput from "@components/common/MyInput/index.vue"
import { IRegisterBody } from "@/types/auth.types";
import { useAuth } from "@composables/useAuth"
import { IError } from "@/types/error.type";

const { registerData, registerError, isRegisterLoading, register } = useAuth()
const dataForm = ref<IRegisterBody>({
  userName: '',
  email: '',
  password: '',
  confirmPassword: ''
})
const handleRegister = async () => {
  await register({
    userName: dataForm.value.userName,
    email: dataForm.value.email,
    password: dataForm.value.password,
    confirmPassword: dataForm.value.confirmPassword
  })
  console.log(registerData.value)
}

</script>
<route lang="yaml">
  name: Đăng ký tài khoản
  meta:
    layout: "default"
</route>
<style lang="scss">
.app-register {
  .register-main {
    padding: 40px 0;
    max-width: 600px;
    width: 100%;

    .register__image {
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

    .register-form {
      .forget-pass {
        font-size: 13px;
      }

      .btn-form__submit {
        background-color: $red;
        padding: 12px;
        border-radius: 8px;
        font-weight: 500;
        color: $white;
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

    .register-option {

      &__google,
      &__facebook {
        cursor: pointer;

        &:hover {
          opacity: .75;
        }

        span {
          font-weight: 500;
        }

        .icon {
          height: 30px;
          width: 30px;
        }
      }

      &__facebook {
        .icon {
          height: 34px;
          width: 34px;
        }
      }
    }

    .register-question {
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