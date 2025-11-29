<template>
  <div class="otp-container">
    <div class="otp-header">
      <h3>Nhập mã OTP</h3>
      <p class="otp-description">
        Mã xác thực đã được gửi đến email <strong>{{ maskedEmail }}</strong>
      </p>
    </div>

    <div class="otp-inputs">
      <input
        v-for="(digit, index) in otpDigits"
        :key="index"
        :ref="(el) => (inputRefs[index] = el as HTMLInputElement)"
        v-model="otpDigits[index]"
        type="text"
        inputmode="numeric"
        maxlength="1"
        class="otp-input"
        :class="{ error: hasError }"
        @input="handleInput(index, $event)"
        @keydown="handleKeydown(index, $event)"
        @paste="handlePaste"
      />
    </div>

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

    <div class="otp-timer">
      <p v-if="timer > 0">
        Mã có hiệu lực trong: <strong>{{ formattedTime }}</strong>
      </p>
      <button
        v-else
        @click="handleResend"
        :disabled="isResending"
        class="resend-button"
      >
        {{ isResending ? "Đang gửi..." : "Gửi lại mã OTP" }}
      </button>
    </div>

    <button
      @click="handleVerify"
      :disabled="!isOTPComplete || isVerifying"
      class="verify-button"
    >
      {{ isVerifying ? "Đang xác thực..." : "Xác thực" }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

interface Props {
  email: string;
  type: "registration" | "login";
}

const props = defineProps<Props>();
const emit = defineEmits<{
  verified: [tokens: { accessToken: string; refreshToken: string; user: any }];
  resend: [];
}>();

const otpDigits = ref<string[]>(["", "", "", "", "", ""]);
const inputRefs = ref<(HTMLInputElement | null)[]>([]);
const hasError = ref(false);
const errorMessage = ref("");
const timer = ref(300); // 5 minutes in seconds
const isVerifying = ref(false);
const isResending = ref(false);
let timerInterval: number | null = null;

const isOTPComplete = computed(() =>
  otpDigits.value.every((digit) => digit !== "")
);

const formattedTime = computed(() => {
  const minutes = Math.floor(timer.value / 60);
  const seconds = timer.value % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
});

const maskedEmail = computed(() => {
  const [username, domain] = props.email.split("@");
  const masked = username.slice(0, 3) + "***";
  return `${masked}@${domain}`;
});

const handleInput = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = target.value;

  // Only allow digits
  if (!/^\d*$/.test(value)) {
    otpDigits.value[index] = "";
    return;
  }

  hasError.value = false;
  errorMessage.value = "";

  // Move to next input
  if (value && index < 5) {
    inputRefs.value[index + 1]?.focus();
  }
};

const handleKeydown = (index: number, event: KeyboardEvent) => {
  // Handle backspace
  if (event.key === "Backspace" && !otpDigits.value[index] && index > 0) {
    inputRefs.value[index - 1]?.focus();
  }
};

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault();
  const pastedData = event.clipboardData?.getData("text");

  if (pastedData && /^\d{6}$/.test(pastedData)) {
    const digits = pastedData.split("");
    otpDigits.value = digits;
    inputRefs.value[5]?.focus();
  }
};

const handleVerify = async () => {
  if (!isOTPComplete.value) return;

  isVerifying.value = true;
  hasError.value = false;
  errorMessage.value = "";

  try {
    const otp = otpDigits.value.join("");
    const endpoint =
      props.type === "registration"
        ? "/api/auth/verify-email"
        : "/api/auth/verify-login-otp";

    const response = await fetch(`http://localhost:3000${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: props.email, otp }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Xác thực thất bại");
    }

    // Success
    emit("verified", {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      user: data.user,
    });
  } catch (error: any) {
    hasError.value = true;
    errorMessage.value = error.message || "Có lỗi xảy ra, vui lòng thử lại";
    // Clear OTP inputs
    otpDigits.value = ["", "", "", "", "", ""];
    inputRefs.value[0]?.focus();
  } finally {
    isVerifying.value = false;
  }
};

const handleResend = async () => {
  isResending.value = true;
  errorMessage.value = "";

  try {
    const response = await fetch("http://localhost:3000/api/auth/resend-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: props.email, type: props.type }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Không thể gửi lại mã OTP");
    }

    // Reset timer
    timer.value = 300;
    startTimer();

    // Clear OTP inputs
    otpDigits.value = ["", "", "", "", "", ""];
    inputRefs.value[0]?.focus();

    emit("resend");
  } catch (error: any) {
    errorMessage.value = error.message || "Có lỗi xảy ra";
  } finally {
    isResending.value = false;
  }
};

const startTimer = () => {
  if (timerInterval) clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    if (timer.value > 0) {
      timer.value--;
    } else {
      if (timerInterval) clearInterval(timerInterval);
    }
  }, 1000);
};

onMounted(() => {
  inputRefs.value[0]?.focus();
  startTimer();
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});
</script>

<style lang="scss" scoped>
.otp-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 32px 24px;
  max-width: 500px;
  margin: 0 auto;
}

.otp-header {
  text-align: center;

  h3 {
    font-size: 24px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 8px;
  }

  .otp-description {
    font-size: 14px;
    color: #6b7280;

    strong {
      color: #e11d48;
    }
  }
}

.otp-inputs {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.otp-input {
  width: 48px;
  height: 56px;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: #e11d48;
    box-shadow: 0 0 0 3px rgba(225, 29, 72, 0.1);
  }

  &.error {
    border-color: #dc2626;
    animation: shake 0.3s;
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-8px);
  }
  75% {
    transform: translateX(8px);
  }
}

.error-message {
  color: #dc2626;
  font-size: 14px;
  text-align: center;
  margin: 0;
}

.otp-timer {
  text-align: center;
  font-size: 14px;
  color: #6b7280;

  strong {
    color: #e11d48;
    font-weight: 600;
  }
}

.resend-button {
  background: none;
  border: none;
  color: #e11d48;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #fee2e2;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.verify-button {
  width: 100%;
  padding: 14px;
  background-color: #e11d48;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: #be123c;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
