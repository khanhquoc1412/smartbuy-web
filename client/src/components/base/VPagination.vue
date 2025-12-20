<template>
    <VPagination></VPagination>
</template>
  
<script lang="ts" setup>
import VPagination from "@hennge/vue3-pagination";
import "@hennge/vue3-pagination/dist/vue3-pagination.css";
</script>
<style lang="scss">
.Pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin: 2rem 0;
    font-family: inherit;

    .PaginationControl {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 8px;
        background: #fff;
        border: 1px solid #e5e7eb;
        transition: all 0.2s ease;
        cursor: pointer;

        &:hover:not(.Disabled) {
            border-color: $red;
            background-color: rgba($red, 0.05);
            
            svg {
                fill: $red;
            }
        }

        &.Disabled {
            opacity: 0.4;
            cursor: not-allowed;
            background: #f9fafb;
        }

        svg {
            width: 14px;
            height: 14px;
            fill: #6b7280;
            transition: fill 0.2s ease;
        }
    }

    .Page {
        display: flex !important;
        align-items: center;
        justify-content: center;
        min-width: 36px;
        height: 36px !important;
        padding: 0 8px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        color: #4b5563;
        background: #fff;
        border: 1px solid #e5e7eb;
        transition: all 0.2s ease;
        cursor: pointer;

        &:hover:not(.Page-active) {
            border-color: $red;
            color: $red;
            background-color: rgba($red, 0.05);
        }

        &.Page-active {
            background-color: $red !important;
            border-color: $red !important;
            color: #ffffff !important;
            font-weight: 600;
            box-shadow: 0 4px 10px rgba($red, 0.15);
        }
    }

    // Support for list-based pagination rendering
    ul {
        display: flex;
        gap: 8px;
        padding: 0;
        margin: 0;
        list-style: none;
    }
}
</style>

  
