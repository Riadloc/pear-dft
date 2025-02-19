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
        :src="detailData.cover"
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
      <p class="text-sm text-gray-300 mb-1">
        <span class="inline-block w-16">订单号</span>
        <span class="ml-4 text-white">{{ detailData.orderNo }}</span>
      </p>
      <p class="text-sm text-gray-300">
        <span class="inline-block w-16">创建时间</span>
        <span class="ml-4 text-white">{{ formatTimezoneDate(detailData.createdAt) }}</span>
      </p>
    </div>
    <div class="text-white mb-4">
      <h4 class="text-base mb-2">说明</h4>
      <p class="text-sm text-gray-300">一个用户允许同时存在一笔待支付订单</p>
    </div>
    <div class="text-white mb-4">
      <!-- <h4 class="text-base mb-2">购买数量<van-stepper class="ml-4" v-model="buyCount" max="5"  /></h4> -->
      <p class="pl-1 text-sm text-gray-300 align-bottom">
        <span class="text-red-400">{{ buyCount }}</span> 件商品，总商品金额：<span class="text-red-400"><span class="text-xs">￥</span>{{ (Number(detailData.price) * buyCount).toFixed(2) }}</span>
      </p>
    </div>
    <div class="flex mt-12" v-show="detailData?.price && detailData.status == OrderStatus.WAIT">
      <van-button block class="mr-6 rounded-lg pear-color-button" :loading="submitLoading" @click="showPasswordDialog = true">立即支付</van-button>
      <van-button block class="rounded-lg pear-gray-button" @click="onCancel">取消订单</van-button>
    </div>
    <pear-spinner :show="loading" />
    <typing-password-dialog
      title="请输入支付密码"
      :show="showPasswordDialog"
      :validate="false"
      @cancel="showPasswordDialog = false"
      @success="onPurchase"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { Dialog, Toast } from 'vant'
import { useRoute, useRouter } from 'vue-router'
import { useRequest } from 'vue-request'
import { getOrderDetail } from '@/services/order.service'
import { cancelPaymentOrder } from '@/services/payment.service'
import { HTTP_CODE, OrderStatus } from '@/constants/enums'
import { onTrade } from '@/services/wallet.service'
import { ONE_MINUTE } from '@/constants/constants'
import { formatTimezoneDate } from '@/constants/utils'

export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()

    const showPasswordDialog = ref(false)

    const { id } = route.query
    const { data: detailData, loading } = useRequest(() => getOrderDetail({ orderId: id }), {
      initialData: {
        user: {},
        price: '0',
        cover: ''
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
          })
          return
        }
        const isMajor = detailData.value.source === 0
        Dialog.confirm({
          message: '交易成功！',
          confirmButtonText: '查看',
          cancelButtonText: '返回',
          showCancelButton: true
        }).then(() => {
          if (isMajor) {
            router.replace({ name: 'SecondaryDetail', query: { id: res.data.goodNo, from: 'collect' } })
          } else {
            router.back()
          }
        }).catch(() => {
          if (isMajor) {
            router.back()
          } else {
            router.go(-2)
          }
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
    const onPurchase = (payKey: string) => {
      _onPurchase({
        orderId: id,
        payKey
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

    return {
      showPasswordDialog,

      detailData,
      buyCount,
      countDownTime,
      onFinished,
      onPurchase,
      onCancel,
      formatTimezoneDate,
      OrderStatus,
      loading,
      submitLoading
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
