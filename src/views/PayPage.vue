<template>
  <div class="pay-page flex flex-col justify-center items-center">
    <pear-navbar title="购买" left-arrow />
    <h3 class="text-white text-lg mb-1">请使用支付宝扫码支付</h3>
    <h4 class="text-gray-400 text-sm mb-4">二维码有效期为5分钟，仅限本次使用</h4>
    <div
      class="qr-code overflow-hidden bg-gray-700 relative"
      ref="qrCodeRef"
      style="width: 90vw; height: 90vw;"
    >
      <div class="absolute inset-0 flex justify-center items-center z-10">
        <van-loading v-if="loading" type="spinner" color="#fff" vertical>二维码生成中...</van-loading>
      </div>
    </div>
    <div class="flex mt-4 pb-20 text-sm">
      <span class="text-gray-200">藏品名：<span class="text-white">{{ name }}</span></span>
      <span class="text-gray-200 ml-4">价格：<span class="text-white">￥{{ price }}</span></span>
    </div>
    <div class="flex justify-between absolute bottom-0 left-0 right-0 px-4 py-6 bg-gray-800 shadow-lg rounded-t-xl">
      <van-button type="warning" block @click="cancel" class="mr-4">取消</van-button>
      <van-button type="primary" block @click="download">下载</van-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import QRCodeStyling from 'qr-code-styling'
import { Dialog, Notify, Toast } from 'vant'
import { cancelPaymentOrder, checkPaymentOrder, createPaymentOrder } from '@/services/payment.service'
import { useRequest } from 'vue-request'
import { TradeStatus } from '@/constants/enums'
import AlipayPng from '../assets/alipay.png'

export default defineComponent({
  props: {
    goodId: {
      type: String,
      required: true
    },
    price: String,
    name: String,
    orderId: String
  },
  setup(props) {
    const router = useRouter()

    const qrCodeRef = ref()
    const qrCodeInstance = ref<QRCodeStyling>()
    const timer = ref<any>(undefined)
    const back = () => {
      router.back()
    }

    const { data: createdResp, loading, run } = useRequest<any>(createPaymentOrder, {
      manual: true,
      onSuccess(data) {
        const { qrCode } = data.data
        if (qrCode) {
          genQrcode(qrCode)
        } else {
          Dialog.alert({
            message: data.msg
          })
            .then(() => {
              router.go(-1)
            })
        }
      }
    })
    const pollingTime = ref(50)
    const { run: runCheck } = useRequest<any>(checkPaymentOrder, {
      manual: true,
      onSuccess(data) {
        pollingTime.value = pollingTime.value - 1
        if (pollingTime.value <= 0) {
          cancelRequst()
          return
        }
        const { tradeStatus: { subCode, tradeStatus } } = data.data
        if (tradeStatus) {
          switch (tradeStatus) {
            case TradeStatus.TRADE_FINISHED:
            case TradeStatus.TRADE_SUCCESS:
              Notify.clear()
              Dialog.alert({
                title: '支付成功',
                message: '已支付，交易成功'
              }).then(() => {
                router.back()
              })
              cancelRequst()
              break
            case TradeStatus.TRADE_CLOSED:
              Notify.clear()
              Dialog.alert({
                title: '交易关闭',
                message: '交易已关闭，不可继续支付'
              }).then(() => {
                router.back()
              })
              cancelRequst()
              break
            case TradeStatus.WAIT_BUYER_PAY:
              Notify({
                type: 'primary',
                message: '已扫码，等待支付中...',
                duration: 0
              })
              break
            default:
              Notify.clear()
              break
          }
        } else if (subCode) {
          if (['ACQ.SYSTEM_ERROR', 'ACQ.INVALID_PARAMETER'].includes(subCode)) {
            Dialog.alert({
              message: '交易遇到问题，订单已取消'
            }).then(() => {
              router.back()
            })
            cancelRequst()
          }
        } else {
          cancelRequst()
        }
      },
      onError() {
        cancelRequst()
      }
    })

    const download = () => {
      qrCodeInstance.value?.download(({ name: props.name || 'qr', extension: 'png' }))
    }
    const cancel = () => {
      Dialog.confirm({
        title: '提示',
        message: '取消会关闭这个支付订单，确认取消本次购买？',
        confirmButtonText: '继续购买',
        cancelButtonText: '去意已决'
      }).then(() => {
        cancelRequst()
      }).catch(() => {
        Toast('订单已取消')
        cancelRequst()
        cancelPaymentOrder({ tradeNo: createdResp.value?.data?.outTradeNo })
        back()
      })
    }
    const genQrcode = (content: string): void => {
      const width = Math.floor(window.screen.width * 0.9)
      qrCodeInstance.value = new QRCodeStyling({
        width,
        height: width,
        type: 'svg',
        data: content,
        image: AlipayPng,
        dotsOptions: {
          color: '#00A1E9',
          type: 'rounded'
        },
        backgroundOptions: {
          color: '#fff'
        },
        imageOptions: {
          crossOrigin: 'anonymous',
          margin: 20
        }
      })
      qrCodeInstance.value.append(qrCodeRef.value)
      setTimeout(() => {
        if (createdResp.value?.data?.outTradeNo) {
          timer.value = setInterval(() => {
            runCheck(createdResp.value?.data?.outTradeNo)
          }, 5000)
        }
      }, 0)
    }
    const cancelRequst = () => {
      clearInterval(timer.value)
      timer.value = undefined
    }

    const containerWidth = ref(0)
    onMounted(() => {
      containerWidth.value = Math.floor(window.screen.width * 0.9)
      run({
        goodId: props.goodId,
        orderId: props.orderId
      })
    })
    onBeforeUnmount(() => {
      // console.log
      cancelRequst()
    })

    return {
      qrCodeRef,
      containerWidth,
      loading,
      download,
      cancel,
      back
    }
  }
})
</script>

<style lang="less" scoped>
.pay-page {
  height: 100vh;
  .qr-code {
    text-align: center;
  }
}
</style>
