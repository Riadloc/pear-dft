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
        <span class="text-xs text-green-300 absolute -bottom-5 right-0 active:opacity-70" @click="onFull">全部提现</span>
      </div>
    </van-form>
    <div class="mt-6 mb-4">
      <h3 class="text-gray-300 text-sm mb-1">选择提现银行卡</h3>
      <van-radio-group v-model="checked">
        <div
          class="flex justify-between"
          v-for="item in walletData.bankCards"
          :key="item.id"
        >
          <div class="inline-flex" @click="checked = item.id">
            <div class="w-6 h-6 bg-primary rounded-md align-middle text-center">
              <pear-icon set="ph" name="credit-card-fill" size="1.3rem" class="text-white" />
            </div>
            <span class="ml-2 text-white align-middle">{{ maskbank(item.bankNo) }}</span>
          </div>
          <van-radio :name="item.id"/>
        </div>
      </van-radio-group>
    </div>
    <div class="mt-10">
      <van-button block :class="[checked ? 'pear-green-button' : 'pear-gray-button', 'rounded-lg']" native-type="submit" @click="onBeforeSubmit">
        立即提现
      </van-button>
    </div>
    <div class="text-white mt-2 text-xs">
      <p class="text-gray-300">提现手续费1%（最低￥1手续费）</p>
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
    <typing-password-dialog
      title="请输入验证码"
      :show="showCodeDialog"
      @cancel="showCodeDialog = false"
      @success="onValidOk"
      :validate="false"
    />
    <pear-spinner :show="loading" />
  </div>
</template>

<script lang="ts">
import { HTTP_CODE } from '@/constants/enums'
import { isPrice, maskbank } from '@/constants/utils'
import { checkLianlianSms, onDrawcash } from '@/services/wallet.service'
import { useUserStore } from '@/stores/user.store'
import { storeToRefs } from 'pinia'
import { Dialog, Toast } from 'vant'
import { defineComponent, ref, onMounted, onUnmounted, reactive, computed } from 'vue'
import { useRequest } from 'vue-request'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const router = useRouter()
    const store = useUserStore()
    const { walletData } = storeToRefs(store)

    const showCodeDialog = ref(false)

    const amount = ref('')
    const show = ref(false)
    const showCaptch = ref(false)
    const payInfo = reactive({
      orderNo: '',
      price: '',
      token: ''
    })
    const onFull = () => {
      amount.value = `${walletData.value.balance}`
    }
    const onValidOk = (code: string) => {
      showCodeDialog.value = false
      runCheckSms({
        ...payInfo,
        code
      })
    }
    const onBeforeSubmit = () => {
      const value = Number(amount.value)
      if (value <= 0) {
        Toast.fail('不能等于0')
        return
      }
      if (!isPrice(amount.value)) {
        Toast.fail('不正确价格格式')
        return
      }
      if (value > walletData.value.balance) {
        Toast.fail('取现金额不能超过余额')
        return
      }
      if (value < 10) {
        Toast.fail('取现金额不能小于10元')
        return
      }
      if (!checked.value) {
        Toast.fail('请选择提现银行卡')
        return
      }
      runSubmit({
        price: amount.value
      })
    }
    const onSuccess = () => {
      Dialog.alert({
        message: '申请提现成功，预计T+1日内到账'
      }).then(() => {
        router.back()
      })
    }
    const { loading: dcLoading, run: runSubmit } = useRequest(onDrawcash, {
      manual: true,
      throttleInterval: 1000,
      throttleOptions: { leading: true, trailing: false },
      onSuccess(res: any) {
        if (res.code === HTTP_CODE.ERROR) {
          Dialog.alert({
            message: res.msg
          })
          return
        }
        if (res.data.token) {
          Toast('已发送验证码至您的手机')
          const { txn_seqno: orderNo, total_amount: price, token } = res.data
          showCodeDialog.value = true
          payInfo.orderNo = orderNo
          payInfo.price = price
          payInfo.token = token
        } else {
          onSuccess()
        }
      }
    })
    const { loading: codeLoading, run: runCheckSms } = useRequest(checkLianlianSms, {
      manual: true,
      onSuccess(res: any) {
        if (res.code === HTTP_CODE.ERROR) {
          Dialog.alert({
            message: res.msg
          })
          return
        }
        onSuccess()
      }
    })

    const checked = ref('')

    const onVisiblityChange = () => {
      if (document.visibilityState && payInfo.orderNo) {
        Dialog.confirm({
          message: '提现完成？'
        }).then(() => {
          router.back()
        })
      }
    }

    const loading = computed(() => dcLoading.value || codeLoading.value)

    onMounted(() => {
      document.addEventListener('visibilitychange', onVisiblityChange)
    })
    onUnmounted(() => {
      document.removeEventListener('visibilitychange', onVisiblityChange)
    })

    return {
      showCodeDialog,
      show,
      amount,
      onFull,
      loading,
      walletData,

      showCaptch,
      onValidOk,
      onBeforeSubmit,

      maskbank,
      checked
    }
  }
})
</script>

<style lang="less" scoped>

</style>
