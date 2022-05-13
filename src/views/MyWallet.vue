<template>
  <div class="wallet pt-6">
    <pear-navbar title="我的钱包" fixed left-arrow />
    <div class="flex flex-col items-center justify-center h-40 text-white">
      <p class="text-3xl align-bottom"><span class="text-lg">￥</span>20</p>
      <p class="text-sm text-gray-300">当前余额</p>
    </div>
    <div class="flex px-4">
      <van-button block class="mr-6 rounded-lg pear-plain-button">充值</van-button>
      <van-button block class="rounded-lg pear-plain-button">提现</van-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({

})
</script>

<style lang="less" scoped>

</style>
