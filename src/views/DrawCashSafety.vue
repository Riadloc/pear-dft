<template>
  <div class="drawcash-safety">
    <pear-navbar title="修改提现密码" left-arrow />
    <van-form @submit="onSubmit" class="p-4">
      <div class="relative mb-8">
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
      <ll-password-field label="提现时专用" title="设置提现密码" ref="llPasswordField" />
      <div class="mt-12">
        <van-button block class="pear-green-button rounded" native-type="submit">
          确定
        </van-button>
      </div>
    </van-form>
    <pear-spinner :show="loading" />
  </div>
</template>

<script lang="ts">
import { ONE_MINUTE } from '@/constants/constants'
import { HTTP_CODE } from '@/constants/enums'
import { applyLianLianGetPassword, checkLianLianGetPassword } from '@/services/wallet.service'
import { Dialog, Toast } from 'vant'
import { computed, defineComponent, reactive, ref } from 'vue'
import { useRequest } from 'vue-request'
const requestConfig = {
  manual: true,
  throttleInterval: 1000,
  throttleOptions: { leading: true, trailing: false }
}

export default defineComponent({
  setup() {
    const llPasswordField = ref()
    const onSubmit = async () => {
      if (!formData.code) {
        Toast('请填写验证码')
        return
      }
      if (!applyData.value.data) {
        Toast('请先获取验证码')
      }
      const password = await llPasswordField.value.getValue()
      const randomKey = llPasswordField.value.getRandomKey()
      const { token } = applyData.value.data
      runCheckCode({
        token,
        password,
        randomKey,
        code: formData.code
      })
    }
    const sendCode = () => {
      runSendCode()
    }

    const formData = reactive({
      code: '',
      countDownTime: 0
    })
    const { data: applyData, run: runSendCode, loading: codeLoading } = useRequest<any>(applyLianLianGetPassword, {
      ...requestConfig,
      onSuccess(data) {
        if (data.code === HTTP_CODE.ERROR) {
          Dialog.alert({
            message: data.msg
          })
        } else {
          Toast('已发送验证码至您的手机')
          formData.countDownTime = ONE_MINUTE
        }
      }
    })
    const { run: runCheckCode, loading: checkLoading } = useRequest<any>(checkLianLianGetPassword, {
      ...requestConfig,
      onSuccess(data) {
        if (data.code === HTTP_CODE.ERROR) {
          Dialog.alert({
            message: data.msg
          })
        }
      }
    })

    const loading = computed(() => codeLoading.value || checkLoading.value)

    return {
      llPasswordField,
      onSubmit,
      sendCode,

      formData,
      loading
    }
  }
})
</script>

<style lang="less" scoped>

</style>
