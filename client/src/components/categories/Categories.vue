<template>
  <div class="app-category">
    <swiper
      :slides-per-view="6"
      :space-between="24"
      :pagination="{ clickable: true }"
      :navigation="false"
      id="swiper-slider"
      :breakpoints="breakpoints"
    >
      <swiper-slide
        class="categories-item tw-border tw-flex tw-cursor-pointer hover:tw-bg-gray-200 tw-transition-all tw-flex-col tw-items-center tw-justify-center tw-aspect-square tw-gap-3 tw-rounded-sm"
        v-for="category in categories"
        :key="category.name"
      >
        <div class="img-item sm:tw-h-9 sm:tw-w-9 tw-h-5 tw-text-white">
          <img :src="category.image" :alt="category.name" class="tw-h-full tw-w-full" />
        </div>
        <div class="name-item">
          {{ category.name }}
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";

import cellPhoneSvg from "@/assets/svg/categories/Category-CellPhone.svg";
import watchSvg from "@/assets/svg/categories/Category-SmartWatch.svg";
import cameraSvg from "@/assets/svg/categories/Category-Camera.svg";
import gamePadSvg from "@/assets/svg/categories/Category-Gamepad.svg";
import headPhoneSvg from "@/assets/svg/categories/Category-Headphone.svg";
import computerSvg from "@/assets/svg/categories/Category-Computer.svg";

const breakpoints = {
  375: { slidesPerView: 3.5, spaceBetween: 10 },
  768: { slidesPerView: 4.5, spaceBetween: 16 },
  1024: { slidesPerView: 5.5, spaceBetween: 24 },
  1224: { slidesPerView: 6, spaceBetween: 24 },
};

interface ICategories {
  name: string;
  image: string;
}
const categories: ICategories[] = [
  {
    name: "Điện thoại",
    image: cellPhoneSvg,
  },{
    name: "HeadPhones",
    image: headPhoneSvg,
  },
];
// const categories: ICategories[] = [
//   {
//     name: "Phones",
//     image: cellPhoneSvg,
//   },
//   {
//     name: "Computer",
//     image: computerSvg,
//   },
//   {
//     name: "SmartWatch",
//     image: watchSvg,
//   },
//   {
//     name: "Camera",
//     image: cameraSvg,
//   },
//   {
//     name: "HeadPhones",
//     image: headPhoneSvg,
//   },
//   {
//     name: "Gaming",
//     image: gamePadSvg,
//   },
//   {
//     name: "Phones",
//     image: cellPhoneSvg,
//   },
//   {
//     name: "Computer",
//     image: computerSvg,
//   },
//   {
//     name: "SmartWatch",
//     image: watchSvg,
//   },
//   {
//     name: "Camera",
//     image: cameraSvg,
//   },
//   {
//     name: "HeadPhones",
//     image: headPhoneSvg,
//   },
//   {
//     name: "Gaming",
//     image: gamePadSvg,
//   },
// ];
// </script>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Categories",
});
</script>

<style>
</style>