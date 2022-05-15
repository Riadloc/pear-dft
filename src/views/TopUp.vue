<template>
  <div class="top-up pt-16 p-6">
    <pear-navbar title="充值" fixed left-arrow />
    <van-form>
      <van-field
        readonly
        @touchstart.stop="show = true"
        :border="false"
        v-model="amount"
        name="amount"
        right-icon="jpy-light"
        icon-prefix="ph:currency"
        class="mb-4 rounded"
        placeholder="请输入金额"
      />
    </van-form>
    <!-- <div>
      <p>选择支付方式</p>
    </div> -->
    <div class="mt-10">
      <van-button round block class="pear-plain-button" native-type="submit" @click="onBeforeSubmit">
        立即充值
      </van-button>
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
import { isPrice, openLink } from '@/constants/utils'
import { topUpService } from '@/services/wallet.service'
import { Dialog, Toast } from 'vant'
import { defineComponent, ref, onMounted, onUnmounted, reactive } from 'vue'
import { useRequest } from 'vue-request'
import { useRouter } from 'vue-router'
export default defineComponent({
  setup() {
    const router = useRouter()

    const amount = ref('')
    const show = ref(false)
    const showCaptch = ref(false)
    const payInfo = reactive({
      url: '',
      orderId: ''
    })

    const onValidOk = () => {
      showCaptch.value = false
      runTopUp({
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
      showCaptch.value = true
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
        openLink(url)
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
      onBeforeSubmit,
      showCaptch,
      onValidOk,

      loading
    }
  }
})
</script>

<style lang="less" scoped>

</style>
