<template>
  <div>
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item>
        <img src="../assets/banner1.jpg" alt="">
      </van-swipe-item>
    </van-swipe>
    <van-list
      class="p-4 pb-14"
      finished-text="没有更多了"
    >
      <Card class="mb-4" key="1" />
      <Card class="mb-4" key="2" />
    </van-list>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Card } from '@/components'
export default defineComponent({
  components: { Card },
  setup() {
    const active = ref(0)

    return {
      active,
    };
  }
});
</script>
<style>
.my-swipe .van-swipe-item {
  height: 150px;
}
</style>
