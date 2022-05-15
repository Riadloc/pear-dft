<template>
  <div class="draw-cash pt-16 p-6">
    <pear-navbar title="提现" fixed left-arrow />
    <p class="text-gray-400 mt-4 mb-4">当前余额：<span class="text-red-400"><span class="text-sm">￥</span>{{ walletData.balance }}</span></p>
    <van-form>
      <div class="relative">
        <van-field
          readonly
          @touchstart.stop="show = true"
          :border="false"
          v-model="amount"
          name="amount"
          right-icon="jpy-light"
          icon-prefix="ph:currency"
          class="mb-4 rounded"
          placeholder="请输入提现金额"
        />
        <span class="text-xs text-gray-300 absolute -bottom-5 right-0" @click="onFull">全部提现</span>
      </div>
    </van-form>
    <div class="mt-10">
      <van-button round block class="pear-plain-button" native-type="submit" @click="onBeforeSubmit">
        立即提现
      </van-button>
    </div>
    <div class="text-white mt-2 text-xs">
      <p class="text-gray-300">提现手续费预计1%（第三方支付渠道收取）</p>
    </div>
    <van-number-keyboard
      v-model="amount"
      :show="show"
      :maxlength="18"
      extra-key="."
      theme="custom"
      close-button-text="完成"
      @blur="show = false"
    />
    <pear-spinner :show="loading" />
    <pear-captcha :show="showCaptch" @cancel="showCaptch = false" @success="onValidOk" />
  </div>
</template>

<script lang="ts">
import { HTTP_CODE } from '@/constants/enums'
import { isPrice } from '@/constants/utils'
import { onDrawcash } from '@/services/wallet.service'
import { useUserStore } from '@/stores/user.store'
import { storeToRefs } from 'pinia'
import { Dialog, Toast } from 'vant'
import { defineComponent, ref, onMounted, onUnmounted, reactive } from 'vue'
import { useRequest } from 'vue-request'
import { useRouter } from 'vue-router'
export default defineComponent({
  setup() {
    const router = useRouter()
    const store = useUserStore()
    const { walletData } = storeToRefs(store)

    const amount = ref('')
    const show = ref(false)
    const showCaptch = ref(false)
    const payInfo = reactive({
      url: '',
      orderId: ''
    })
    const onFull = () => {
      amount.value = `${walletData.value.balance}`
    }
    const onValidOk = () => {
      showCaptch.value = false
      runSubmit({
        price: amount.value
      })
    }
    const onBeforeSubmit = () => {
      if (Number(amount.value) <= 0) {
        Toast.fail('不能等于0')
        return
      }
      if (!isPrice(amount.value)) {
        Toast.fail('不正确价格格式')
        return
      }
      if (Number(amount.value) > walletData.value.balance) {
        Toast.fail('取现金额不能超过余额')
        return
      }
      showCaptch.value = true
    }
    const { loading, run: runSubmit } = useRequest(onDrawcash, {
      manual: true,
      onSuccess(res: any) {
        if (res.code === HTTP_CODE.ERROR) {
          Dialog.alert({
            message: res.msg
          })
          return
        }
        Dialog.alert({
          message: '申请提现成功，预计T+1日内到账'
        }).then(() => {
          router.back()
        })
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
      show,
      amount,
      onFull,
      loading,
      walletData,

      showCaptch,
      onValidOk,
      onBeforeSubmit
    }
  }
})
</script>

<style lang="less" scoped>

</style>
