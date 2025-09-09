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

  </div>
</template>

<script lang="ts" setup>
import { useAuth } from '@composables/useAuth'

const { user } = useAuth()
console.log(user)
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