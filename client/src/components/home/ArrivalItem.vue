<template>
  <div
    class="arrival-item tw-flex tw-h-full tw-rounded-lg tw-w-full tw-justify-end tw-items-end tw-relative"
  >
    <div class="img tw-w-full tw-overflow-hidden tw-p-4">
      <img :src="img" alt="" class="tw-w-full tw-object-cover" />
    </div>
    <div
      class="box-text tw-flex tw-flex-col tw-gap-2 tw-text-white tw-absolute tw-bottom-4 tw-left-4"
    >
      <div class="title tw-cursor-pointer hover:tw-opacity-70 tw-transition-all">{{ title }}</div>
      <div class="sub-title">
        {{ subTitle }}
      </div>
      <button class="tw-items-start hover:tw-opacity-70 tw-transition-all">
        Shop Now
      </button>
    </div>
  </div>
</template>


<script lang="ts" setup >
import ps5Slim from "@assets/images/arrival/ps5-slim.png";
interface IArrivalItem {
  title?: string;
  subTitle?: string;
  position?: string;
  img?: string;
}

const { title, subTitle, position, img } = withDefaults(
  defineProps<IArrivalItem>(),
  {
    title: "",
    subTitle: "",
    position: "tw-items-center",
    img: "",
  }
);
</script>
<script lang="ts">
export default {
  name: "ArrialItem",
};
</script>

<style scoped lang="scss">
.arrival-item {
  background-color: #0D0D0D;
  .box-text {
    .title {
      font-size: 20px;
      font-weight: 500;
    }
    .sub-title {
      font-size: 14px;
      font-weight: 300;
    }
    button{
      padding: 0 10px;
      border-bottom: 1px solid $gray;
      align-self: flex-start;
    }
  }
}
</style>