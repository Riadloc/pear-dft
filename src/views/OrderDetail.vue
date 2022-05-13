<template>
  <div class="order-detail pt-14 px-4">
    <pear-navbar title="订单详情" fixed left-arrow />
    <div class="bg-card text-white flex p-4 rounded-lg items-center justify-between mb-4">
      <div class="flex items-center">
        <pear-icon set="ph" name="hourglass-medium-duotone" size="3rem" />
        <p class="ml-1">等待付款</p>
      </div>
      <van-count-down :time="countDownTime" format="mm分ss秒" class="count-down" @finish="countDownTime = 0" />
    </div>
    <div class="bg-card flex rounded-lg overflow-hidden p-3 mb-6">
      <pear-image
        :src="'https://pearmeta-1253493520.file.myqcloud.com/sidameinvwangzhaojun.jpeg_1izb675yjpoi'"
        width="100%"
        size="h-20 w-20"
        class="overflow-hidden rounded-lg"
      />
      <div class="flex flex-col pl-4 justify-center flex-1 text-sm text-white">
        <div class="flex justify-between items-center leading-7">
          <h4>王昭君</h4>
          <span class="font-bold text-amber-200 text-lg">￥20</span>
        </div>
        <span class="leading-7">卖家: 梨数字官方</span>
      </div>
    </div>
    <div class="text-white mb-4">
      <h4 class="text-base mb-2">订单详情</h4>
      <p class="pl-1 text-sm text-gray-300">创建时间<span class="ml-4 text-white">{{ createdAt }}</span></p>
    </div>
    <div class="text-white mb-4">
      <h4 class="text-base mb-2">说明</h4>
      <p class="pl-1 text-sm text-gray-300">一个用户同时允许存在一笔待支付订单</p>
    </div>
    <div class="text-white">
      <h4 class="text-base mb-2">购买数量<van-stepper class="ml-4" v-model="buyCount" max="5"  /></h4>
      <p class="pl-1 text-sm text-gray-300 align-bottom">
        <span class="text-red-400">{{ buyCount }}</span> 件商品，总商品金额：<span class="text-red-400"><span class="text-xs">￥</span>{{ (20 * buyCount).toFixed(2) }}</span>
      </p>
    </div>
    <div class="flex mt-12">
      <van-button block class="mr-6 rounded-lg pear-color-button">立即支付</van-button>
      <van-button block class="rounded-lg pear-plain-button">取消订单</van-button>
    </div>
  </div>
</template>

<script lang="ts">
import dayjs from 'dayjs'
import { defineComponent, ref } from 'vue'
export default defineComponent({
  setup() {
    const countDownTime = ref(0)
    const buyCount = ref(0)
    const createdAt = dayjs().format('YYYY-MM-DD HH:mm:ss')

    return {
      buyCount,
      countDownTime,
      createdAt
    }
  }
})
</script>

<style lang="less" scoped>
.count-down {
  @apply text-sm;
  color: inherit!important;
}
</style>
