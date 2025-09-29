<template>
  <div class="menu-tree tw-flex tw-flex-col tw-w-full tw-overflow-hidden">
    <router-link
      :to="(item.pathName as string)"
      class="menu-item tw-overflow-hidden tw-transition-all tw-flex tw-px-3 tw-py-3 tw-cursor-pointer tw-justify-between"
      v-for="item in menuItems"
      :key="item.id"
    >
      <div class="item-left tw-flex tw-gap-3 tw-flex-1" v-if="item.icon">
        <div class="icon tw-w-5 tw-h-5">
          <img :src="item.icon" alt="" class="tw-w-full" />
        </div>
        <span class="label tw-flex-1">{{ item.label }}</span>
      </div>
      <div v-else class="item-left tw-flex tw-gap-3 tw-flex-1">
        <span class="label tw-flex-1">{{ item.label }}</span>
      </div>
      <div class="item-right tw-w-4 tw-h-4" v-if="item.navIcon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <path
              d="M9.71069 18.2929C10.1012 18.6834 10.7344 18.6834 11.1249 18.2929L16.0123 13.4006C16.7927 12.6195 16.7924 11.3537 16.0117 10.5729L11.1213 5.68254C10.7308 5.29202 10.0976 5.29202 9.70708 5.68254C9.31655 6.07307 9.31655 6.70623 9.70708 7.09676L13.8927 11.2824C14.2833 11.6729 14.2833 12.3061 13.8927 12.6966L9.71069 16.8787C9.32016 17.2692 9.32016 17.9023 9.71069 18.2929Z"
              fill="#0F0F0F"
            ></path>
          </g>
        </svg>
      </div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import cellPhoneSvg from "@/assets/svg/categories/mobile.svg";
import watchSvg from "@/assets/svg/categories/watch.svg";
import cameraSvg from "@/assets/svg/categories/camera.svg";
import gamePadSvg from "@/assets/svg/categories/game-pad.svg";
import headPhoneSvg from "@/assets/svg/categories/serial-port.svg";
import computerSvg from "@/assets/svg/categories/computer.svg";
import iconDelivery from "@assets/svg/icon-delivery.svg";
import iconSecure from "@assets/svg/categories/secure.svg";
import iconStore from "@/assets/svg/categories/map.svg";
interface IMenuItem {
  id: number;
  icon?: string;
  label?: string;
  navIcon?: boolean;
  pathName?: string;
}

const menuItems = ref<IMenuItem[]>([
  {
    id: 0,
    // icon: cellPhoneSvg,
    label: "Tất cả sản phẩm",
    navIcon: true,
    pathName: "/product",
  },
  {
    id: 1,
    icon: cellPhoneSvg,
    label: "Điện thoại",
    navIcon: true,
    pathName: "/category/mobile",
  },
  // {
  //   id: 2,
  //   icon: computerSvg,
  //   label: "Laptop",
  //   navIcon: true,
  //   pathName: '/category/laptop'

  // },
  // {
  //   id: 3,
  //   icon: watchSvg,
  //   label: "Đồng hồ thông minh",
  //   navIcon: true,
  //   pathName: '/product'

  // },
  // {
  //   id: 4,
  //   icon: cameraSvg,
  //   label: "Máy ảnh",
  //   navIcon: true,
  //   pathName: '/product'
  // },
  // {
  //   id: 5,
  //   icon: gamePadSvg,
  //   label: "Pc-Computer",
  //   navIcon: true,
  //   pathName: '/product'
  // },
  {
    id: 6,
    icon: headPhoneSvg,
    label: "Phụ kiện",
    navIcon: true,
    pathName: "/category/headphone",
  },
  {
    id: 7,
    icon: iconStore,
    label: "Hệ thống cửa hàng",
    navIcon: false,
    pathName: "/product",
  },
  {
    id: 9,
    icon: iconSecure,
    label: "Chính sách",
    navIcon: false,
    pathName: "/product",
  },
]);
</script>

<script lang="ts">
export default {
  name: "Menu",
};
</script>

<style lang="scss" scoped>
.menu-tree {
  .menu-item {
    font-size: 13px;
    font-weight: 600;

    &:hover {
      color: $red;
      background-color: $bg-light-gray;

      img {
        filter: invert(37%) sepia(93%) saturate(7471%) hue-rotate(355deg)
          brightness(76%) contrast(135%);
      }

      svg {
        fill: $red !important;
      }
    }
  }
}
</style>
