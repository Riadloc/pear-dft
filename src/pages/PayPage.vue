<template>
  <div class="pay-page flex flex-col justify-center items-center">
    <van-nav-bar :border="false" title="购买" left-arrow left-text="返回" fixed @click-left="back" />
    <h3 class="text-white text-lg mb-1">请使用支付宝扫码支付</h3>
    <h4 class="text-gray-400 text-sm mb-4">该码仅限本次使用</h4>
    <div
      class="qr-code rounded-lg overflow-hidden bg-gray-700 relative"
      ref="qrCodeRef"
      style="width: 90vw; height: 90vw;"
    >
      <div class="absolute inset-0 flex justify-center items-center z-10">
        <van-loading v-if="loading" type="spinner" color="#fff" vertical>二维码生成中...</van-loading>
      </div>
    </div>
    <div class="flex mt-4 pb-20">
      <span class="text-gray-200">藏品名：{{ name }}</span>
      <span class="text-gray-200 ml-4">价格：￥</span>
    </div>
    <div class="flex justify-between gap-4 absolute bottom-0 left-0 right-0 px-4 py-4 bg-gray-800 shadow-lg rounded-t-xl">
      <van-button type="warning" block @click="cancel">取消</van-button>
      <van-button type="primary" block @click="download">下载</van-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import QRCodeStyling from 'qr-code-styling'
import { Dialog, Notify } from 'vant'
import { checkPaymentOrder, createPaymentOrder } from '@/services/payment.service'
import { useRequest } from 'vue-request'
import { TradeStatus } from '@/constants/enums'
import AlipayPng from '../assets/alipay.png'

export default defineComponent({
  props: {
    goodId: {
      type: String,
      required: true
    },
    content: String,
    name: String
  },
  setup(props) {
    const router = useRouter()

    const qrCodeRef = ref()
    const qrCodeInstance = ref<QRCodeStyling>()
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
    const { run: runCheck, cancel: cancelRequst } = useRequest<any>(checkPaymentOrder, {
      manual: true,
      pollingInterval: 5000,
      onSuccess(data) {
        pollingTime.value = pollingTime.value - 1
        if (pollingTime.value <= 0) {
          cancelRequst()
          return
        }
        const { subCode, tradeStatus } = data.data
        if (tradeStatus) {
          switch (tradeStatus) {
            case TradeStatus.TRADE_FINISHED:
            case TradeStatus.TRADE_SUCCESS:
              Dialog.alert({
                title: '支付成功',
                message: '已支付，交易成功'
              }).then(() => {
                router.back()
              })
              cancelRequst()
              break
            case TradeStatus.TRADE_CLOSED:
              Dialog.alert({
                title: '交易关闭',
                message: '交易已关闭，不可继续支付'
              }).then(() => {
                router.back()
              })
              cancelRequst()
              break
            case TradeStatus.WAIT_BUYER_PAY:
              Notify('已扫码，等待支付中')
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
        message: '确认取消本次购买？',
        confirmButtonText: '继续购买',
        cancelButtonText: '去意已决'
      }).then(() => {
        //
      }).catch(() => {
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
          runCheck(createdResp.value?.data?.outTradeNo)
        }
      }, 5000)
    }

    const containerWidth = ref(0)
    onMounted(() => {
      containerWidth.value = Math.floor(window.screen.width * 0.9)
      run(props.goodId)
    })
    onUnmounted(() => {
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
