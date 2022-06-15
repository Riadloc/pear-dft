<template>
  <div class="my-zone">
    <div class="my-short-info px-4 py-5 rounded-bl-lg rounded-br-lg">
      <div class="flex items-center rounded-lg" @click="goUserPage">
        <van-image
          round
          fit="cover"
          width="4rem"
          height="4rem"
          src="/apple-touch-icon.png"
          class="bg-gradient-to-r from-sky-500 to-indigo-500"
        >
          <template v-slot:error>加载失败</template>
        </van-image>
        <div class="flex flex-col ml-4 flex-1">
          <span class="text-white">{{ userData.nickname }}</span>
          <span class="text-gray-400 text-sm">UID: {{ userData.userId }}</span>
        </div>
        <div>
          <van-icon name="arrow" size="1.2rem" class="text-gray-300" />
        </div>
      </div>
    </div>
    <div class="p-4">
      <div class="bg-card py-3 rounded flex justify-between flex-1">
        <div class="icon-button" @click="onClickOrder">
          <i class="iconfont icon-dingdan text-[2rem]"></i>
          <span class="text-xs">我的订单</span>
        </div>
        <div class="icon-button" @click="onClickRank">
          <i class="iconfont icon-quanyi text-[2rem]"></i>
          <span class="text-xs">排行榜</span>
        </div>
        <div class="icon-button" @click="onClickInvitation">
          <i class="iconfont icon-yaoqing text-[2rem]"></i>
          <span class="text-xs">我的邀请</span>
        </div>
        <div class="icon-button" @click="onClickWallet">
          <i class="iconfont icon-qianbao1 text-[2rem]"></i>
          <span class="text-xs">我的钱包</span>
        </div>
      </div>
    </div>
    <div class="my-menu p-4 pt-0">
      <van-cell
        is-link
        clickable
        round
        :border="false"
        title-class="text-gray-100"
        class="mb-3 rounded bg-card"
        @click="onMaintainClick"
      >
        <template #title>
          <div class="flex items-center">
            <pear-icon set="ph" name="codesandbox-logo-light" size="1.3rem" />
            <span class="ml-2">合成中心</span>
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
    <van-action-sheet v-model:show="show" :actions="actions" @select="onSelect" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user.store'
import { useRouter } from 'vue-router'
import { Toast } from 'vant'
import { RankType } from '@/constants/enums'

export default defineComponent({
  setup() {
    const router = useRouter()
    const store = useUserStore()
    const { userData, walletData } = storeToRefs(store)

    const show = ref(false)
    const actions = [
      { name: '消费日榜' },
      { name: '消费总榜' },
      { name: '邀新排行' }
    ]

    const goUserPage = () => {
      router.push('/user')
    }
    const onClickOrder = () => {
      router.push('/orderList')
    }
    const onClickRank = () => {
      show.value = true
    }
    const onClickInvitation = () => {
      router.push('/my-invitation')
    }
    const onClickWallet = () => {
      router.push('/wallet')
    }
    const onSelect = (item: any) => {
      switch (item.name) {
        case '消费日榜':
          router.push({ name: 'RankList', query: { type: RankType.CONSUME_DAY } })
          break
        case '消费总榜':
          router.push({ name: 'RankList', query: { type: RankType.CONSUME_ALL } })
          break
        case '邀新排行':
          router.push({ name: 'RankList', query: { type: RankType.INVITATION } })
          break
      }
    }
    const onMaintainClick = () => {
      Toast('功能正在开发中，敬请期待')
    }

    return {
      show,
      actions,
      userData,
      walletData,
      goUserPage,
      onMaintainClick,
      onClickOrder,
      onClickRank,
      onClickInvitation,
      onClickWallet,
      onSelect
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
.icon-button {
  @apply flex flex-col items-center text-white flex-1 active:opacity-60;
}
</style>
