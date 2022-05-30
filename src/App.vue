<template>
  <van-config-provider id="provider" :theme-vars="theme">
    <router-view v-slot="{ Component }">
      <transition
        name="fade" mode="out-in"
      >
        <!-- <keep-alive :include="keepAliveInclude" :max="1"> -->
          <component :is="Component" />
        <!-- </keep-alive> -->
      </transition>
    </router-view>
  </van-config-provider>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { theme } from '@/assets/config'
import { setInviteCode } from '@/constants/utils'
export default defineComponent({
  setup() {
    return {
      theme,
      keepAliveInclude: ['UserLogin', 'UserSingup', 'PutOnMarket']
    }
  },
  mounted() {
    setInviteCode()
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
