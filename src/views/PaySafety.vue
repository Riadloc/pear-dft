<template>
  <div class="bank-card-bind pt-16">
    <pear-navbar title="支付密码" fixed left-arrow />
    <van-form @submit="onSubmit" class="p-6" validate-trigger="onSubmit">
      <van-field
        :border="false"
        readonly
        @touchstart.stop="showBankCardKeyboard = true"
        v-model="payKey"
        name="payKey"
        class="mb-4 rounded"
        placeholder="支付密码"
        :rules="[{ required: true, message: '请填写支付密码' }, { pattern: /^\d{6}$/, message: '请输入6位的数字密码' }]"
      />
      <van-field
        :border="false"
        v-model="password"
        name="password"
        :type="showPlainPsw ? 'text' : 'password'"
        :right-icon="showPlainPsw ? 'eye-o' : 'closed-eye'"
        @click-right-icon="showPlainPsw = !showPlainPsw"
        class="mb-4 rounded"
        placeholder="登录密码"
        :rules="[{ required: true, message: '请填写登录密码' }]"
      />
      <div class="mt-10">
        <van-button round block class="pear-plain-button" native-type="submit">
          绑定
        </van-button>
      </div>
    </van-form>
    <van-number-keyboard
      v-model="payKey"
      :show="showBankCardKeyboard"
      :maxlength="20"
      @blur="showBankCardKeyboard = false"
    />
    <pear-spinner :show="loading" />
    <yidun-captcha :be-validate="false" v-model:show="showCaptch" @success="onValidOk"/>
  </div>
</template>

<script lang="ts">
import { SIMPLE_PASSWORD } from '@/constants/constants'
import { HTTP_CODE } from '@/constants/enums'
import { setPayPassword } from '@/services/user.service'
import { useUserStore } from '@/stores/user.store'
import { Dialog, Toast } from 'vant'
import { defineComponent, ref } from 'vue'
import { useRequest } from 'vue-request'
import { useRouter } from 'vue-router'
export default defineComponent({
  setup() {
    const router = useRouter()
    const userStore = useUserStore()

    const showCaptch = ref(false)
    const showBankCardKeyboard = ref(false)
    const showPlainPsw = ref(false)
    const payKey = ref('')
    const password = ref('')
    const onSubmit = (values: any) => {
      if (!/^\d{6}$/.test(values.payKey)) {
        Toast.fail('请输入6位数字密码')
        return
      }
      if (SIMPLE_PASSWORD.includes(values.payKey)) {
        Toast.fail('密码太过简单')
        return
      }
      showCaptch.value = true
    }
    const onValidOk = () => {
      showCaptch.value = false
      run({
        payKey: payKey.value,
        password: password.value
      })
    }
    const { loading, run } = useRequest(setPayPassword, {
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
        userStore.getUserInfo()
        Toast.success('绑定成功')
        router.back()
      }
    })

    return {
      showBankCardKeyboard,
      showPlainPsw,
      showCaptch,
      payKey,
      password,
      onSubmit,
      onValidOk,
      loading
    }
  }
})
</script>

<style lang="less" scoped>

</style>
