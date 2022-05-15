<template>
  <div class="order-detail pt-14 px-4">
    <pear-navbar title="订单详情" fixed left-arrow />
    <div class="bg-card text-white flex p-4 rounded-lg items-center justify-between mb-4" v-if="detailData.status == OrderStatus.WAIT">
      <div class="flex items-center">
        <pear-icon set="ph" name="hourglass-medium-duotone" size="2.6rem" />
        <p class="ml-1">等待付款</p>
      </div>
      <van-count-down :time="countDownTime" format="mm分ss秒" class="count-down" @finish="onFinished" />
    </div>
    <div class="bg-card text-white flex p-4 rounded-lg items-center justify-between mb-4" v-else>
      <div class="flex items-center">
        <pear-icon set="ph" name="hourglass-medium-duotone" size="2.6rem" />
        <p class="ml-1">{{ detailData.status == OrderStatus.PURCHASED ? '已支付' : '已取消' }}</p>
      </div>
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
          <h4>{{ detailData.good?.name }}</h4>
          <span class="font-bold text-amber-200 text-lg">￥{{ detailData.price }}</span>
        </div>
        <span class="leading-7">卖家: {{ detailData.user?.nickname }}</span>
      </div>
    </div>
    <div class="text-white mb-4">
      <h4 class="text-base mb-2">订单详情</h4>
      <p class="pl-1 text-sm text-gray-300">创建时间<span class="ml-4 text-white">{{ formatDate(detailData.createdAt) }}</span></p>
    </div>
    <div class="text-white mb-4">
      <h4 class="text-base mb-2">说明</h4>
      <p class="pl-1 text-sm text-gray-300">一个用户同时允许存在一笔待支付订单</p>
    </div>
    <div class="text-white">
      <!-- <h4 class="text-base mb-2" v-if="!isFluxGoodOrder">购买数量<van-stepper class="ml-4" v-model="buyCount" :max="detailData.good?.limit || 5"  /></h4> -->
      <p class="pl-1 text-sm text-gray-300 align-bottom">
        <span class="text-red-400">{{ buyCount }}</span> 件商品，总商品金额：<span class="text-red-400"><span class="text-xs">￥</span>{{ (Number(detailData.price) * buyCount).toFixed(2) }}</span>
      </p>
    </div>
    <div class="flex mt-12" v-show="detailData?.price && detailData.status == OrderStatus.WAIT">
      <van-button block class="mr-6 rounded-lg pear-color-button" :loading="submitLoading" @click="onPurchase">立即支付</van-button>
      <van-button block class="rounded-lg pear-plain-button" @click="onCancel">取消订单</van-button>
    </div>
    <pear-spinner :show="loading" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import dayjs from 'dayjs'
import { Dialog, Toast } from 'vant'
import { useRoute, useRouter } from 'vue-router'
import { useRequest } from 'vue-request'
import { getOrderDetail } from '@/services/order.service'
import { cancelPaymentOrder } from '@/services/payment.service'
import { HTTP_CODE, OrderStatus } from '@/constants/enums'
import { onTrade } from '@/services/wallet.service'
import { ONE_MINUTE } from '@/constants/constants'

export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()

    const { id, isSecond } = route.query
    const isFluxGoodOrder = computed(() => isSecond === '1')
    const { data: detailData, loading } = useRequest(() => getOrderDetail({ orderId: id }), {
      initialData: {
        user: {},
        price: '0'
      },
      formatResult(res: any) {
        return res.data
      },
      onSuccess() {
        countDownTime.value = ONE_MINUTE * 3
      }
    })
    const { loading: submitLoading, run: _onPurchase } = useRequest(onTrade, {
      manual: true,
      throttleInterval: 2000,
      throttleOptions: { leading: true, trailing: false },
      onSuccess(res: any) {
        if (res.code === HTTP_CODE.ERROR) {
          Dialog.alert({
            message: res.msg
          }).then(() => {
            router.back()
          })
          return
        }
        Dialog.alert({
          message: '交易成功'
        }).then(() => {
          router.back()
        })
      }
    })

    const countDownTime = ref(0)
    const buyCount = ref(1)
    const onFinished = () => {
      countDownTime.value = 0
      Dialog.alert({
        message: '订单已关闭',
        confirmButtonText: '退出'
      }).then(() => {
        router.back()
      })
    }
    const onPurchase = () => {
      _onPurchase({
        orderId: id,
        isSecond
      })
    }
    const onCancel = () => {
      Dialog.confirm({
        title: '提示',
        message: '确认取消本次购买？',
        confirmButtonText: '继续购买',
        cancelButtonText: '去意已决'
      }).then(() => {
        //
      }).catch(async () => {
        const res = await cancelPaymentOrder({ tradeNo: detailData.value.orderNo }) as any
        if (res.code === HTTP_CODE.ERROR) {
          Dialog.alert({
            message: res.msg
          })
            .then(() => {
              router.back()
            })
          return
        }
        Toast('订单已取消')
        router.back()
      })
    }

    const formatDate = (date: Date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss')

    return {
      detailData,
      buyCount,
      countDownTime,
      onFinished,
      onPurchase,
      onCancel,
      formatDate,
      OrderStatus,
      loading,
      submitLoading,
      isFluxGoodOrder
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
