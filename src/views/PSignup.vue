<template>
  <div class="psignup">
    <template v-if="isSignup">
      <h3 class="text-white text-lg my-10">{{ pageTexts.welcome }}</h3>
      <van-button
        size="small"
        round
        class="absolute right-4 top-4 pear-plain-button"
        to="/login"
      >登 录</van-button>
    </template>
    <div class="mb-6" v-else>
      <pear-navbar title="密码修改" fixed left-arrow />
    </div>
    <van-form @submit="onSubmit" validate-trigger="onSubmit">
      <van-cell-group :border="false" size="large">
        <template #title>
          <div class="text-white flex items-center">
            <span class="text-md">手机号</span>
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
      <van-cell-group :border="false" size="large" class="relative">
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
      >
        <template #title>
          <div class="text-white flex items-center mt-4">
            <span class="text-md">{{ pageTexts.psw1 }}</span>
          </div>
        </template>
        <van-field
          class="rounded"
          v-model="password"
          :type="showPlainPsw1 ? 'text' : 'password'"
          name="password1"
          :right-icon="showPlainPsw1 ? 'eye-o' : 'closed-eye'"
          @click-right-icon="showPlainPsw1 = !showPlainPsw1"
          placeholder="请填写密码"
          :rules="[{ required: true, message: '请填写密码' }, { validator: validatePassword }]"
        />
      </van-cell-group>
      <van-cell-group
        :border="false"
        size="large"
      >
        <template #title>
          <div class="text-white flex items-center mt-4">
            <span class="text-md">{{ pageTexts.psw2 }}</span>
          </div>
        </template>
        <van-field
          class="rounded"
          v-model="password2"
          :type="showPlainPsw2 ? 'text' : 'password'"
          name="password2"
          :right-icon="showPlainPsw2 ? 'eye-o' : 'closed-eye'"
          @click-right-icon="showPlainPsw2 = !showPlainPsw2"
          placeholder="请再次填写密码"
          :rules="[
            { required: true, message: '请再次填写密码' },
            { validator: validatePassword },
            { validator: validatePasswordIsMatch }
          ]"
        />
      </van-cell-group>
      <div class="mt-10">
        <div class="flex">
          <van-button round block class="pear-color-button" native-type="submit" :loading="btnLoading">
            {{ pageTexts.submit }}
          </van-button>
        </div>
        <!-- <van-radio name="agree" icon-size="1rem" class="mt-4 text-sm">我已同意用户协议</van-radio> -->
      </div>
    </van-form>
    <pear-spinner :show="smsLoading" />
    <van-dialog v-model:show="showCaptch" title="图形验证码" show-cancel-button :before-close="beforeClose">
      <div class="p-4 text-center flex flex-col justify-center items-center">
        <div @click="runCaptchaSvg" v-html="captchaSvg" class="bg-white w-36 h-12 mb-4"></div>
        <van-field
          class="rounded"
          v-model="captchaCode"
          name="captchaCode"
          placeholder="请填写验证码"
        />
      </div>
    </van-dialog>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRequest } from 'vue-request'
import { postSignup, postSendSms, updateUserInfo, getCaptchaSvg, validateCaptcha } from '@/services/user.service'
import { WEB_NAME } from '@/assets/config'
import { HTTP_CODE } from '@/constants/enums'
import { validatePassword } from '@/constants/utils'
import { Notify, Toast } from 'vant'
import { useUserStore } from '@/stores/user.store'
const ONE_MINUTE = 60 * 1000

enum PageTypes {
  SIGN_UP,
  CHANGE_PASSWORD,
}
const PageTypeTexts = {
  [PageTypes.SIGN_UP]: {
    welcome: `欢迎注册 ${WEB_NAME}`,
    submit: '确认注册',
    psw1: '密码',
    psw2: '重复密码'
  },
  [PageTypes.CHANGE_PASSWORD]: {
    welcome: '密码修改',
    submit: '提交',
    psw1: '新密码',
    psw2: '重复新密码'
  }
}

export default defineComponent({
  data() {
    return {
      WEB_NAME
    }
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useUserStore()

    const type: PageTypes = Number(route.params.type) || PageTypes.SIGN_UP
    const isSignup = computed(() => type === PageTypes.SIGN_UP)

    const showPlainPsw1 = ref(false)
    const showPlainPsw2 = ref(false)

    const showCaptch = ref(false)
    const beforeClose = async (action: string) => {
      if (action === 'confirm') {
        const res: any = await validateCaptcha(captchaCode.value)
        if (res.code === HTTP_CODE.ERROR) {
          Toast.fail(res.msg)
        } else {
          sendCode()
          return true
        }
        return false
      }
      return true
    }

    const phone = ref('')
    const code = ref('')
    const captchaCode = ref('')
    const password = ref('')
    const password2 = ref('')
    const onSubmit = (values: any) => {
      console.log('submit', values)
      if (type === PageTypes.SIGN_UP) {
        const inviteCode = sessionStorage.getItem('inviteCode')
        runSignup({
          ...values,
          code: values.code,
          inviteCode
        })
      } else {
        if (values.phone !== store.userData.phone) {
          Toast('手机号与登录账号不一致！')
          return
        }
        runChangePsw(store.userData.userId, {
          ...values,
          code: values.code
        })
      }
    }
    const { loading: btnLoading1, run: runSignup } = useRequest<any>(postSignup, {
      manual: true,
      throttleInterval: 2000,
      throttleOptions: { leading: true, trailing: false },
      onSuccess(data) {
        console.log(data)
        if (data.code === HTTP_CODE.ERROR) {
          Toast({ type: 'fail', message: data.msg })
        } else {
          Toast({ type: 'success', message: '注册成功' })
          store.setUserInfo(data.data)
          localStorage.setItem('user.id', `${data.data.userId}`)
          router.replace('/')
        }
      }
    })
    const { loading: btnLoading2, run: runChangePsw } = useRequest<any>(updateUserInfo, {
      manual: true,
      onSuccess(data) {
        if (data.code === HTTP_CODE.ERROR) {
          Toast({ type: 'fail', message: data.msg })
        } else {
          Toast({
            type: 'success',
            message: '修改成功',
            onClose: () => {
              localStorage.removeItem('user.id')
              store.$reset()
              router.replace('/login')
            }
          })
        }
      }
    })
    const btnLoading = computed(() => btnLoading1.value && btnLoading2.value)
    const captchaSvg = ref(';')
    const { run: runCaptchaSvg } = useRequest<any>(getCaptchaSvg, {
      throttleInterval: 2000,
      throttleOptions: { leading: true, trailing: false },
      onSuccess(data) {
        if (data.code === HTTP_CODE.ERROR) {
          Toast({ type: 'success', message: data.msg })
        } else {
          captchaSvg.value = data.data
        }
      }
    })

    const sendSmsDisabled = computed(() => countDownTime.value > 0 || !phone.value)
    const countDownTime = ref(0)
    const onCountDownFinished = () => {
      countDownTime.value = 0
    }
    const changeCountDownTime = () => {
      //
    }
    const sendCode = () => {
      runSendSms({
        phone: phone.value
      })
    }
    const { loading: smsLoading, run: runSendSms } = useRequest<any>(postSendSms, {
      manual: true,
      throttleInterval: 1000,
      throttleOptions: { leading: true, trailing: false },
      onSuccess(data) {
        if (data.code === HTTP_CODE.ERROR) {
          Notify(data.msg)
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

    const validatePasswordIsMatch = (value: string) => {
      if (value) {
        if (value !== password.value) {
          return '两次密码输入不一致'
        }
        return true
      }
      return false
    }

    return {
      phone,
      code,
      captchaCode,
      password,
      password2,
      onSubmit,
      btnLoading,
      captchaSvg,

      showPlainPsw1,
      showPlainPsw2,

      showCaptch,
      beforeClose,

      smsLoading,
      sendSmsDisabled,
      countDownTime,
      onCountDownFinished,
      changeCountDownTime,
      sendCode,
      runCaptchaSvg,

      validatePassword,
      validatePasswordIsMatch,

      pageTexts: PageTypeTexts[type],
      isSignup
    }
  }
})
</script>

<style lang="less" scoped>
.psignup {
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
