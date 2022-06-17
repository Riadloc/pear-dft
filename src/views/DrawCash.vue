<template>
  <div class="draw-cash">
    <pear-navbar title="提现" left-arrow />
    <div class="p-4">
      <div v-show="active === 0">
        <p class="text-gray-400 mt-4 mb-4">当前余额：<span class="text-red-400"><span class="text-sm">￥</span>{{ walletData.balance }}</span></p>
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
        <div class="mt-8">
          <van-button block class="pear-green-button rounded-lg" @click="onNext">
            下一步
          </van-button>
        </div>
      </div>
      <div v-show="active === 1">
        <p class="text-gray-400 mt-4 mb-4">提现金额：<span class="text-red-400"><span class="text-sm">￥</span>{{ amount }}</span></p>
        <ll-password-field show-forgot label="开户时设置" title="提现密码" ref="llPasswordField" class="mt-8 mb-4"  />
        <div class="mb-4">
          <h3 class="text-gray-300 text-sm mb-1">选择提现银行卡</h3>
          <van-radio-group v-model="bankId">
            <div
              class="flex justify-between"
              v-for="item in walletData.bankCards"
              :key="item.id"
            >
              <div class="inline-flex" @click="bankId = item.id">
                <div class="w-6 h-6 bg-primary rounded-md align-middle text-center">
                  <pear-icon set="ph" name="credit-card-fill" size="1.3rem" class="text-white" />
                </div>
                <span class="ml-2 text-white align-middle">{{ maskbank(item.bankNo) }}</span>
              </div>
              <van-radio :name="item.id"/>
            </div>
          </van-radio-group>
        </div>
        <div class="relative mb-4">
          <van-field
            label="短信验证码"
            :border="false"
            v-model="formData.code"
            name="code"
            class="mb-4 rounded"
            placeholder="短信验证码"
            :rules="[{ required: true, message: '请填写短信验证码' }, { pattern: /^\d{6}$/, message: '验证码格式错误' }]" />
          <div class="link absolute -bottom-6 right-0 text-xs text-white">
            <van-count-down v-if="formData.countDownTime" :time="formData.countDownTime" format="ss秒后重发" class="count-down" @finish="formData.countDownTime = 0" />
            <span v-else @click="sendCode" :class="[formData.countDownTime > 0 && 'text-blue-900']">发送验证码</span>
          </div>
        </div>
        <div class="mt-10">
          <van-button block :disabled="!bankId" :class="[bankId ? 'pear-green-button' : 'pear-gray-button', 'rounded-lg']" @click="onSubmit">
            立即提现
          </van-button>
        </div>
      </div>
      <div class="text-white mt-2 text-xs">
        <p class="text-gray-300">提现手续费1%（最低￥1手续费）</p>
      </div>
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
import { ONE_MINUTE } from '@/constants/constants'
import { HTTP_CODE } from '@/constants/enums'
import { isPrice, maskbank } from '@/constants/utils'
import { checkLianlianSms, onDrawcash, onTransfer } from '@/services/wallet.service'
import { useUserStore } from '@/stores/user.store'
import { storeToRefs } from 'pinia'
import { Dialog, Toast } from 'vant'
import { defineComponent, ref, reactive, computed } from 'vue'
import { useRequest } from 'vue-request'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const router = useRouter()
    const store = useUserStore()
    const { walletData } = storeToRefs(store)

    const showCodeDialog = ref(false)
    const active = ref(0)
    const formData = reactive({
      code: '',
      countDownTime: 0
    })

    const llPasswordField = ref<any>(null)
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
    const onSuccess = () => {
      Dialog.alert({
        message: '申请提现成功，预计5分钟内到账'
      }).then(() => {
        router.back()
      })
    }
    const { loading: transLoading, run: runTransfer } = useRequest(onTransfer, {
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
        const { txn_seqno: orderNo, total_amount: price, token } = res.data
        payInfo.orderNo = orderNo
        payInfo.price = price
        payInfo.token = token
        if (token) {
          Toast('已发送验证码至您的手机')
          showCodeDialog.value = true
        } else {
          active.value += 1
        }
      }
    })
    const { data: dcData, loading: dcLoading, run: runSubmit } = useRequest(onDrawcash, {
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
          formData.countDownTime = ONE_MINUTE
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
        if (active.value === 0) {
          active.value += 1
        } else if (active.value === 1) {
          onSuccess()
        }
      }
    })

    const sendCode = async () => {
      if (!bankId.value) {
        Toast.fail('请选择提现银行卡')
        return
      }
      const password = await llPasswordField.value.getValue()
      const randomKey = llPasswordField.value.getRandomKey()
      runSubmit({
        price: payInfo.price,
        password,
        randomKey,
        bankId: bankId.value,
        orderNo: payInfo.orderNo
      })
    }

    const onNext = () => {
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
      runTransfer({
        price: amount.value
      })
    }
    const onSubmit = () => {
      if (!formData.code) {
        Toast('请输入验证码')
        return
      }
      if (!dcData.value.data) {
        Toast('请获取验证码')
        return
      }
      const { txn_seqno: seqNo, orderNo, total_amount: price, token } = dcData.value.data
      runCheckSms({
        orderNo,
        txnOrderNo: seqNo,
        price,
        token,
        code: formData.code
      })
    }

    const bankId = ref('')

    const loading = computed(() => transLoading.value || dcLoading.value || codeLoading.value)

    return {
      active,
      formData,
      showCodeDialog,
      show,
      amount,
      onFull,
      loading,
      walletData,
      llPasswordField,

      showCaptch,
      onValidOk,
      sendCode,
      onNext,
      onSubmit,

      maskbank,
      bankId
    }
  }
})
</script>

<style lang="less" scoped>

</style>
