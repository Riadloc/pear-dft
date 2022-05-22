<template>
  <van-config-provider id="provider" :theme-vars="theme">
    <router-view v-slot="{ Component }">
      <transition
        name="fade" mode="out-in"
      >
        <keep-alive :include="keepAliveInclude">
          <component :is="Component" />
        </keep-alive>
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
      theme,
      keepAliveInclude: ['UserLogin', 'UserSingup', 'PutOnMarket']
    }
  },
  mounted() {
    const query = location.href.split('?')[1]
    if (query) {
      const searchParams = new URLSearchParams(query)
      if (searchParams.get('code')) {
        sessionStorage.setItem('inviteCode', searchParams.get('code') as string)
      }
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
