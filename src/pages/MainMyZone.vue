<template>
  <div class="my-zone p-4">
    <div class="my-short-info">
      <div class="flex items-center p-4 rounded-lg" @click="goUserPage">
        <van-image
          round
          fit="cover"
          width="4rem"
          height="4rem"
          src="/android-chrome-512x512.png"
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
    <div class="my-menu mt-10">
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
      <!-- <van-cell
        is-link
        clickable
        round
        :border="false"
        title-class="text-gray-100"
        class="mb-3 rounded bg-gray-800"
      >
        <template #title>
          <van-icon name="lock" size="1.3rem" />
          <span class="ml-2">隐私协议</span>
        </template>
      </van-cell>  -->
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
    const { userData } = storeToRefs(store)
    const goUserPage = () => {
      router.push('/user')
    }

    return {
      userData,
      goUserPage
    }
  }
})
</script>

<style lang="less" scoped>

</style>
