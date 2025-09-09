<template>
    <span class="loader"></span>
</template>

<script lang="ts" setup>

</script>

<style lang="scss" scoped>
.loader {
    width: 30px;
    height: 30px;
    border: 4px solid;
    border-color: $red transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
}

@keyframes rotation {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>