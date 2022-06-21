<template>
  <div class="main-home">
    <router-view tag="div" class="main-home__content" v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <van-tabbar
      route
      active-color="#fff"
      :border="false"
      class="tabbar bg-card py-1"
      v-model="active"
      @change="onChange">
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
    <van-dialog
      class="notify-dialog"
      title="洛神正式合成"
      v-model:show="show"
      :before-close="beforeClose"
      confirm-button-text="我知道了">
      <div class="p-4 text-sm">
        <p>合成时间：6月22日22.00:00-23.59:59</p>
        <p>共合成588份 合成材料如下：</p>
        <div class="indent-8">
          <p>四大美女·貂蝉*1</p>
          <p>四大美女·王昭君*1</p>
          <p>四大美女·西施*1</p>
          <p>四大美女·杨玉环*1</p>
          <p>起源·守护者的荣光*2</p>
          <p>起源·探索者的远见*10</p>
        </div>
        <p>赋能:</p>
        <div class="indent-8">
          <p>1.七夕礼包一份</p>
          <p>2.平台首发盲盒优先购2个</p>
          <p>3.节假日不定时空投 （一年不低于五次）</p>
          <p>4.平台指定藏品优先抢权益</p>
          <p>5.洛神后续系列分红（详情后续公布）</p>
        </div>
        <p>注：起源系列将在后续持续消耗，详情后续公布</p>
      </div>
    </van-dialog>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
export default defineComponent({
  setup() {
    const active = ref(0)
    const show = ref(false)

    const onChange = (index: number) => {
      console.log(index)
    }

    const beforeClose = (action: string) => {
      if (action === 'confirm') {
        localStorage.setItem('pear:notify', '1')
      }
      return true
    }

    onMounted(() => {
      const msgId = localStorage.getItem('pear:notify')
      if (msgId !== '1') {
        show.value = true
      }
    })

    return {
      active,
      show,
      beforeClose,
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
    background: linear-gradient(
      180deg,
      hsla(0, 0%, 0%, 0.7),
      hsla(0, 0%, 0%, 0.8) 24%,
      hsla(0, 0%, 0%, 0.9) 44%,
      #000
    );
    backdrop-filter: blur(0.25rem);
  }
}
.van-tabbar-item {
  &--active {
    @apply bg-transparent !important;
    .iconfont {
      filter: none !important;
    }
  }
  .iconfont {
    filter: contrast(0.1);
    font-size: 1.5rem;
  }
}

:deep(.notify-dialog) {
  @apply bg-gradient-to-r from-sky-500 to-indigo-500;
  .van-button {
    @apply !bg-transparent;
  }
}
</style>
