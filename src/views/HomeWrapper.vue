<template>
  <div class="main-home">
    <router-view tag="div" class="main-home__content" v-slot="{ Component }">
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
      class="tabbar bg-card py-1"
      v-model="active"
      @change="onChange"
    >
      <van-tabbar-item to="/home">
        <template #icon>
          <i class="iconfont icon-huaban"></i>
        </template>
        首页
      </van-tabbar-item>
      <van-tabbar-item to="/market">
        <template #icon>
          <i class="iconfont icon-huabanfuben4"></i>
        </template>
        市场
      </van-tabbar-item>
      <van-tabbar-item to="/collect" icon="bag">
        <template #icon>
          <i class="iconfont icon-huabanfuben5"></i>
        </template>
        藏品
      </van-tabbar-item>
      <van-tabbar-item to="/mine" icon="manager">
        <template #icon>
          <i class="iconfont icon-huabanfuben text-xl"></i>
        </template>
        我的
      </van-tabbar-item>
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
<style lang="less" scoped>
.main-home {
  height: 100vh;
  overflow: hidden;
  &__content {
    height: calc(100vh - 0.5rem);
    padding-bottom: var(--van-tabbar-height);
    overflow-y: auto;
  }
  .tabbar {
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
    background: linear-gradient(180deg,hsla(0,0%,0%,.70),hsla(0,0%,0%,.80) 24%,hsla(0,0%,0%,.90) 44%,#000);
    backdrop-filter: blur(0.25rem);
  }
}
.van-tabbar-item {
  &--active {
    @apply bg-transparent !important;
    .iconfont {
      filter: none!important;
    }
  }
  .iconfont {
    filter: contrast(0.1);
    font-size: 1.5rem;
  }
}
</style>
