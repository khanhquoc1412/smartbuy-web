<template>
    <div class="app-login-success">
        <Container class="tw-flex tw-flex-col tw-items-center">
            Redirect to Home
        </Container>
    </div>
</template>
    
<script lang="ts" setup>
import Container from '@/components/base/Container.vue';
import { useAuth } from "@composables/useAuth"

const { loginUserSucessData,
    isSignInUserSucessLoading,
    signInUserSucessError,
    signInUserSuccess } = useAuth()
const {
    params: { id },
} = useRoute();
onMounted(async () => {
    await signInUserSuccess(id as string)
})

</script>
<route lang="yaml">
    name: Login Success
    meta:
      layout: "default"
  </route>
<style lang="scss" scoped>
.app-login-success {}
</style>