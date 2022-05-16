<template>
  <div class="plogin">
    <h3 class="text-white text-lg my-10">欢迎登录 {{ WEB_NAME }}</h3>
    <van-notice-bar wrapable :scrollable="false" class="mb-4">
      <p>由于系统问题，部分用户的密码会登录错误。如遇到这类问题，请点击忘记密码进行修改</p>
    </van-notice-bar>
    <van-button size="small" round class="absolute right-4 top-4 pear-plain-button" to="/signup">注 册</van-button>
    <van-form @submit="onSubmit" validate-trigger="onSubmit">
      <van-cell-group :border="false" size="large">
        <template #title>
          <div class="text-white flex items-center justify-between">
            <div class="flex items-center">
              <span class="text-md">手机号</span>
            </div>
            <van-button size="mini" class="pear-plain-button" @click="toggleLoginType">{{ loginTypeName }}登录</van-button>
          </div>
        </template>
        <van-field
          class="rounded"
          v-model="phone"
          name="phone"
          placeholder="请填写手机号"
          :rules="[{ required: true, message: '请填写手机号' }, { pattern: /^\d{11}$/, message: '手机号格式不正确' }]"
        />
      </van-cell-group>
      <van-cell-group
        :border="false"
        size="large"
        class="relative"
        v-if="loginType === LoginTypes.CODE"
      >
        <template #title>
          <div class="text-white flex items-center mt-4">
            <span class="text-md">验证码</span>
          </div>
        </template>
        <van-field
          class="rounded"
          v-model="code"
          name="code"
          placeholder="请填写验证码"
          :rules="[{ required: true, message: '请填写验证码' }, { pattern: /^\d{4}$/, message: '验证码不正确' }]"
        />
        <div
          :class="['text-button', { 'opacity-50': sendSmsDisabled }]"
        >
          <template v-if="countDownTime">
            <van-count-down :time="countDownTime" format="ss秒" class="count-down" @finish="onCountDownFinished" />后重发
          </template>
          <span v-else @click="() => { if (!sendSmsDisabled) { showCaptch = true } }">发送验证码</span>
        </div>
      </van-cell-group>
      <van-cell-group
        :border="false"
        size="large"
        class="relative"
        v-else
      >
        <template #title>
          <div class="text-white flex items-center mt-4">
            <span class="text-md">密码</span>
          </div>
        </template>
        <van-field
          class="rounded"
          v-model="password"
          :type="showPlainPsw ? 'text' : 'password'"
          name="password"
          :right-icon="showPlainPsw ? 'eye-o' : 'closed-eye'"
          @click-right-icon="showPlainPsw = !showPlainPsw"
          placeholder="请填写密码"
          :rules="[{ required: true, message: '请填写密码' }, { validator: validatePassword }]"
        />
        <div
          :class="['text-button', { 'opacity-50': sendSmsDisabled }]"
          >
            <span @click="onForget">忘记密码？</span>
        </div>
      </van-cell-group>
      <div class="mt-10">
        <van-button round block class="pear-color-button" native-type="submit" :loading="btnLoading">
          登录
        </van-button>
      </div>
    </van-form>
    <pear-spinner :show="smsLoading" />
    <yidun-captcha :be-validate="false" v-model:show="showCaptch" @success="onValidOk"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Notify, Toast } from 'vant'
import { useRequest } from 'vue-request'
import { useUserStore } from '@/stores/user.store'
import { postLogin, postSendSms } from '@/services/user.service'
import { validatePassword } from '@/constants/utils'
import { WEB_NAME } from '@/assets/config'
import { HTTP_CODE } from '@/constants/enums'
const ONE_MINUTE = 60 * 1000
enum LoginTypes {
  PASSWORD,
  CODE
}

export default defineComponent({
  data() {
    return {
      WEB_NAME
    }
  },
  setup() {
    const router = useRouter()
    const store = useUserStore()

    const showCaptch = ref(false)
    const onValidOk = async (code: string) => {
      showCaptch.value = false
      sendCode(code)
    }

    const showPlainPsw = ref(false)
    const phone = ref('')
    const password = ref('')
    const code = ref('')
    const captchaCode = ref('')
    const onSubmit = (values: any) => {
      console.log('submit', values)
      run({
        ...values
      })
    }
    const { loading: btnLoading, run } = useRequest<any>(postLogin, {
      manual: true,
      throttleInterval: 2000,
      throttleOptions: { leading: true, trailing: false },
      onSuccess(data) {
        if (data.code === HTTP_CODE.ERROR) {
          Toast.fail(data.msg)
        } else {
          Toast.success('登录成功')
          store.setUserInfo(data.data)
          localStorage.setItem('user.id', `${data.data.userId}`)
          router.replace('/')
        }
      }
    })

    const onForget = () => {
      router.push({ name: 'Signup', query: { type: 2 } })
    }

    const sendSmsDisabled = computed(() => countDownTime.value > 0 || !phone.value)
    const countDownTime = ref(0)
    const onCountDownFinished = () => {
      countDownTime.value = 0
    }
    const sendCode = (code: string) => {
      runSendSms({
        phone: phone.value,
        code
      })
    }
    const { loading: smsLoading, run: runSendSms } = useRequest<any>(postSendSms, {
      manual: true,
      throttleInterval: 1000,
      throttleOptions: { leading: true, trailing: false },
      onSuccess(data) {
        countDownTime.value = ONE_MINUTE
        if (data.code === HTTP_CODE.ERROR) {
          Toast({ type: 'fail', message: data.msg })
        } else {
          if (data.data > 0) {
            Notify('获取时间没超过1分钟！')
            countDownTime.value = data.data * 1000
          } else {
            countDownTime.value = ONE_MINUTE
          }
        }
      }
    })

    const loginType = ref(LoginTypes.PASSWORD)
    const loginTypeName = computed(() => {
      switch (loginType.value) {
        case LoginTypes.PASSWORD:
          return '验证码'
        case LoginTypes.CODE:
          return '密码'
        default:
          return ''
      }
    })
    const toggleLoginType = () => {
      if (loginType.value === LoginTypes.PASSWORD) {
        password.value = ''
      } else {
        code.value = ''
      }
      loginType.value = loginType.value === LoginTypes.PASSWORD ? LoginTypes.CODE : LoginTypes.PASSWORD
    }

    return {
      phone,
      password,
      code,
      captchaCode,
      btnLoading,
      onSubmit,
      onValidOk,

      showPlainPsw,
      onForget,

      showCaptch,
      smsLoading,
      sendSmsDisabled,
      countDownTime,
      onCountDownFinished,
      sendCode,

      loginType,
      loginTypeName,
      toggleLoginType,
      LoginTypes,

      validatePassword
    }
  }
})
</script>

<style lang="less" scoped>
.plogin {
  padding: 20px;
  background-image: url(/escheresque-dark.png);
  min-height: 100vh;
  .count-down {
    color: inherit!important;
    font-size: inherit!important;
  }
  .text-button {
    @apply flex items-center text-white absolute -bottom-6 right-0 text-xs p-1;
  }
  .van-cell:after {
    display: none;
  }
}
</style>
