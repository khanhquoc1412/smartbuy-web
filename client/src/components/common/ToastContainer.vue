<template>
  <div class="toast-container">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="['toast', `toast--${toast.color || 'blue'}`]"
      >
        <div class="toast__content">
          <div class="toast__title">{{ toast.title }}</div>
          <div v-if="toast.description" class="toast__description">
            {{ toast.description }}
          </div>
        </div>
        <button class="toast__close" @click="remove(toast.id)">
          ×
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script lang="ts" setup>
import { useToast } from '@/composables/useToast'

const { toasts, remove } = useToast()
</script>

<style lang="scss" scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.toast {
  min-width: 320px;
  max-width: 500px;
  padding: 16px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  background-color: white;
  border-left: 4px solid;

  &--green {
    border-left-color: #10b981;
    background-color: #f0fdf4;
  }

  &--blue {
    border-left-color: #3b82f6;
    background-color: #eff6ff;
  }

  &--red {
    border-left-color: #ef4444;
    background-color: #fef2f2;
  }

  &--yellow {
    border-left-color: #f59e0b;
    background-color: #fffbeb;
  }

  &__content {
    flex: 1;
  }

  &__title {
    font-weight: 600;
    font-size: 14px;
    margin-bottom: 4px;
    color: #1f2937;
  }

  &__description {
    font-size: 13px;
    color: #6b7280;
  }

  &__close {
    background: none;
    border: none;
    font-size: 24px;
    line-height: 1;
    cursor: pointer;
    color: #9ca3af;
    transition: color 0.2s;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      color: #4b5563;
    }
  }
}

// Transition animations
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
