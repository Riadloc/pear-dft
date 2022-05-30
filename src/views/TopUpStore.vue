<template>
  <div class="top-up-store">
    <pear-navbar title="商城储值卡" left-arrow />
    <div class="px-4 pt-4">
      <div
        v-for="item in values"
        :key="item"
        class="flex overflow-hidden rounded-md text-white bg-card mb-4"
      >
        <div class="image-wrapper relative">
          <van-image width="10rem" src="/store_card.jpg"></van-image>
          <span class="absolute right-4 top-1/3 z-10 text-xl font-semibold">{{ item }}</span>
        </div>
        <div class="pl-4 pt-4 flex-1">
          <p>{{ item }} 额度</p>
        </div>
        <div class="p-3 flex flex-col justify-end ">
          <span class="bg-primary rounded-tl-md rounded-br-md text-sm px-2 pay-button" @click="() => onSelect(item)">￥{{ item }}</span>
        </div>
      </div>
    </div>
    <pear-spinner :show="loading" />
  </div>
</template>

<script lang="ts">
import { HTTP_CODE } from '@/constants/enums'
import { openLink } from '@/constants/utils'
import router from '@/routes'
import { topUpService } from '@/services/wallet.service'
import { Dialog } from 'vant'
import { defineComponent, onMounted, onUnmounted, reactive } from 'vue'
import { useRequest } from 'vue-request'
export default defineComponent({
  setup() {
    const payInfo = reactive({
      url: '',
      orderId: ''
    })

    const onSelect = (value: number) => {
      Dialog.confirm({
        message: `选择的充值金额为${value}，确认充值？`
      }).then(() => {
        runTopUp({
          price: `${value}`
        })
      })
    }

    const { loading, run: runTopUp } = useRequest(topUpService, {
      manual: true,
      onSuccess(res: any) {
        if (res.code === HTTP_CODE.ERROR) {
          Dialog.alert({
            message: res.msg
          })
          return
        }
        const { url, orderId } = res.data
        payInfo.url = url
        payInfo.orderId = orderId
        openLink(url, '_self')
      }
    })

    const onVisiblityChange = () => {
      if (document.visibilityState && payInfo.orderId) {
        Dialog.confirm({
          message: '支付完成？'
        }).then(() => {
          router.back()
        })
      }
    }
    onMounted(() => {
      document.addEventListener('visibilitychange', onVisiblityChange)
    })
    onUnmounted(() => {
      document.removeEventListener('visibilitychange', onVisiblityChange)
    })

    return {
      onSelect,
      loading,
      values: [
        100,
        300,
        500,
        1000,
        5000,
        10
      ]
    }
  }
})
</script>

<style lang="less" scoped>
.image-wrapper {
  font-size: 0;
}
.pay-button {
  &:active {
    opacity: 0.6;
  }
}
</style>
