<template>
  <div class="draw-cash p-4">
    <pear-navbar title="提现" left-arrow />
    <div class="p-4">
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
      <div class="text-white mt-2 text-xs">
        <p class="text-gray-300">提现手续费1%（最低￥1手续费）</p>
      </div>
    </div>
    <pear-spinner :show="loading" />
  </div>
</template>

<script lang="ts">
import { ONE_MINUTE } from '@/constants/constants'
import { HTTP_CODE } from '@/constants/enums'
import { maskbank } from '@/constants/utils'
import { checkLianlianSms, getWalletRecordInfo, onDrawcash } from '@/services/wallet.service'
import { useUserStore } from '@/stores/user.store'
import { storeToRefs } from 'pinia'
import { Dialog, Toast } from 'vant'
import { defineComponent, ref, reactive, computed, onMounted } from 'vue'
import { useRequest } from 'vue-request'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useUserStore()
    const { walletData } = storeToRefs(store)

    const formData = reactive({
      code: '',
      countDownTime: 0
    })

    const llPasswordField = ref<any>(null)
    const amount = ref('')
    const show = ref(false)
    const showCaptch = ref(false)
    const onSuccess = () => {
      Dialog.alert({
        message: '申请提现成功，预计T+1日内到账'
      }).then(() => {
        router.back()
      })
    }

    onMounted(() => {
      const { recordId } = route.query
      if (!recordId) {
        Dialog.alert({
          message: '未找到单据信息'
        }).then(() => {
          router.back()
        })
        return
      }
      getRecordInfo({ recordId })
    })
    const { data: recordDetail, run: getRecordInfo } = useRequest(getWalletRecordInfo, {
      manual: true,
      throttleInterval: 1000,
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
        const { change } = res.data
        amount.value = change.toFixed(2)
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
        onSuccess()
      }
    })

    const sendCode = async () => {
      if (!bankId.value) {
        Toast.fail('请选择提现银行卡')
        return
      }
      const password = await llPasswordField.value.getValue()
      const randomKey = llPasswordField.value.getRandomKey()
      if (!password) {
        Toast('需要重新输入提现密码')
        return
      }
      const { recordNo } = recordDetail.value.data
      runSubmit({
        price: amount.value,
        password,
        randomKey,
        bankId: bankId.value,
        orderNo: recordNo
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
      const { txn_seqno: orderNo, total_amount: price, token } = dcData.value.data
      runCheckSms({
        orderNo,
        price,
        token,
        code: formData.code
      })
    }

    const bankId = ref('')

    const loading = computed(() => dcLoading.value || codeLoading.value)

    return {
      formData,
      show,
      amount,
      loading,
      walletData,
      llPasswordField,

      showCaptch,
      sendCode,
      onSubmit,

      maskbank,
      bankId
    }
  }
})
</script>
