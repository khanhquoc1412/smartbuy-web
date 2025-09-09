<template>
    <VPagination></VPagination>
</template>
  
<script lang="ts" setup>
import VPagination from "@hennge/vue3-pagination";
import "@hennge/vue3-pagination/dist/vue3-pagination.css";
</script>
<style lang="scss">
.Pagination {
    box-sizing: border-box;

    .PaginationControl {
        &:hover svg {
            fill: $red;
        }

        svg {
            width: 18px;
            height: 18px;
        }

    }

    .Page {
        padding: 6px 12px;
        height: auto !important;
        width: auto !important;
        font-size: 14px;

        &:hover,
        &.Page-active {
            color: $red;
        }



    }
}
</style>

  
