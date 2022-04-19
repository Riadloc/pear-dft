<template>
  <div class="main-home">
    <router-view v-slot="{ Component }">
      <transition
        name="fade" mode="out-in"
      >
        <component :is="Component" />
      </transition>
    </router-view>
    <van-tabbar
      route
      active-color="#fff"
      :border="false"
      class="bg-gray-900"
      v-model="active"
      @change="onChange"
    >
      <van-tabbar-item to="/home" icon="wap-home">首页</van-tabbar-item>
      <van-tabbar-item to="/collect" icon="bag">藏品</van-tabbar-item>
      <van-tabbar-item to="/mine" icon="manager">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
export default defineComponent({
  setup() {
    const active = ref(0)

    const onChange = (index: number) => {
      console.log(index)
    }

    return {
      active,
      onChange
    }
  }
})
</script>
<style lang="less">
.van-tabbar-item {
  &--active {
    @apply bg-gray-900 !important;
  }
}
</style>
