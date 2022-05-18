<template>
  <div class="my-zone p-4">
    <div class="my-short-info">
      <div class="flex items-center p-4 rounded-lg" @click="goUserPage">
        <van-image
          round
          fit="cover"
          width="4rem"
          height="4rem"
          src="/apple-touch-icon.png"
          class="bg-white"
        >
          <template v-slot:error>加载失败</template>
        </van-image>
        <div class="flex flex-col ml-4 flex-1">
          <span class="text-white">{{ userData.nickname }}</span>
          <span class="text-gray-400 text-sm">ID: {{ userData.userId }}</span>
        </div>
        <div>
          <van-icon name="arrow" size="1.2rem" class="text-white" />
        </div>
      </div>
    </div>
    <div class="my-menu mt-2">
      <div class="wallet flex flex-row justify-between items-center bg-card mb-3 p-3 rounded-md" @click="goWallet">
        <div class="flex items-center">
          <!-- <div>
            <i class="iconfont icon-qianbao text-4xl"></i>
          </div> -->
          <div class="text-white ml-3">
            <p class="text-gray-300 text-xs">账户余额</p>
            <p class="text-lg align-bottom"><span class="text-sm">￥</span>{{ walletData.balance }}</p>
          </div>
        </div>
        <div>
          <van-button round class="pear-plain-button px-2" size="mini">进入钱包</van-button>
        </div>
      </div>
      <van-cell
        is-link
        round
        :border="false"
        to="/orderList"
        title-class="text-gray-100"
        class="mb-3 rounded bg-card"
      >
        <template #title>
          <pear-icon set="ph" name="package-light" size="1.3rem" />
          <span class="ml-2">订单</span>
        </template>
      </van-cell>
      <van-cell
        is-link
        clickable
        round
        :border="false"
        to="/setting"
        title-class="text-gray-100"
        class="mb-3 rounded bg-card"
      >
        <template #title>
          <div class="flex items-center">
            <pear-icon set="ph" name="gear-light" size="1.3rem" />
            <span class="ml-2">设置</span>
          </div>
        </template>
      </van-cell>
      <van-cell
        is-link
        clickable
        round
        :border="false"
        to="/infomation"
        title-class="text-gray-100"
        class="mb-3 rounded bg-card"
      >
        <template #title>
          <pear-icon set="ph" name="books-light" size="1.3rem" />
          <span class="ml-2">关于我们</span>
        </template>
      </van-cell>
      <van-cell
        is-link
        clickable
        round
        :border="false"
        to="/contact"
        title-class="text-gray-100"
        class="mb-3 rounded bg-card"
      >
        <template #title>
          <pear-icon set="ph" name="chats-light" size="1.3rem" />
          <span class="ml-2">联系我们</span>
        </template>
      </van-cell>
      <van-cell
        is-link
        clickable
        round
        :border="false"
        to="/invite"
        title-class="text-gray-100"
        class="mb-3 rounded bg-card"
      >
        <template #title>
          <pear-icon set="ph" name="share-light" size="1.3rem" />
          <span class="ml-2">邀请好友</span>
        </template>
      </van-cell>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user.store'
import { useRouter } from 'vue-router'
export default defineComponent({
  setup() {
    const router = useRouter()
    const store = useUserStore()
    const { userData, walletData } = storeToRefs(store)
    const goUserPage = () => {
      router.push('/user')
    }
    const goWallet = () => {
      router.push('/wallet')
    }

    return {
      userData,
      walletData,
      goUserPage,
      goWallet
    }
  }
})
</script>

<style lang="less" scoped>
.wallet {
  &:active {
    opacity: 0.6;
  }
}
</style>
