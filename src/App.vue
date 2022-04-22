<template>
  <van-config-provider id="provider" :theme-vars="theme">
    <router-view v-slot="{ Component }">
      <transition
        name="fade" mode="out-in"
      >
        <component :is="Component" />
      </transition>
    </router-view>
  </van-config-provider>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { theme } from '@/assets/config'
export default defineComponent({
  setup() {
    return {
      theme
    }
  }
})
</script>
<style lang="less">
#provider {
  width: 100%;
  min-height: 100vh;
}
.van-tabbar-item {
  &--active {
    @apply bg-gray-900 !important;
  }
}
</style>
