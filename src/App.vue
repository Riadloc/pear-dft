<template>
  <div>
    <router-view></router-view>
    <van-tabbar active-color="#fff" :border="false" class="bg-gray-900" v-model="active">
      <van-tabbar-item icon="wap-home">首页</van-tabbar-item>
      <van-tabbar-item icon="bag">藏品</van-tabbar-item>
      <van-tabbar-item icon="manager">我的</van-tabbar-item>
    </van-tabbar>
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
<style lang="less">
.van-tabbar-item {
  &--active {
    @apply bg-gray-900 !important;
  }
}
</style>
