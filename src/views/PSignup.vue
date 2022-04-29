<template>
  <div class="psignup">
    <h3 class="text-white text-lg my-10">{{ pageTexts.welcome }}</h3>
    <van-button
      size="small"
      type="primary"
      plain
      round
      class="absolute right-4 top-4"
      to="/login"
      v-if="isSignup"
    >登 录</van-button>
    <van-form @submit="onSubmit" validate-trigger="onSubmit">
      <van-cell-group :border="false" size="large">
        <template #title>
          <div class="text-white flex items-center">
            <span class="text-lg">手机号</span>
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
      <van-cell-group :border="false" size="large">
        <template #title>
          <div class="text-white flex items-center mt-4">
            <span class="text-lg">手机验证码</span>
          </div>
        </template>
        <van-field
          class="rounded"
          v-model="code"
          name="code"
          placeholder="请填写验证码"
          :rules="[{ required: true, message: '请填写验证码' }, { pattern: /^\d{4}$/, message: '验证码不正确' }]"
        >
          <template #button>
            <van-button size="mini" type="primary" :disabled="countDownTime > 0 || !phone" @click="sendCode">
              <div class="flex items-center">
                <template v-if="countDownTime">
                  <van-count-down :time="countDownTime" format="ss秒" class="count-down" @change="changeCountDownTime" @finish="onCountDownFinished" />后重发
                </template>
                <span v-else>发送验证码</span>
              </div>
            </van-button>
          </template>
        </van-field>
      </van-cell-group>
      <van-cell-group
        :border="false"
        size="large"
      >
        <template #title>
          <div class="text-white flex items-center mt-4">
            <span class="text-lg">{{ pageTexts.psw1 }}</span>
          </div>
        </template>
        <van-field
          class="rounded"
          v-model="password"
          type="password"
          name="password"
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
            <span class="text-lg">{{ pageTexts.psw2 }}</span>
          </div>
        </template>
        <van-field
          class="rounded"
          v-model="password2"
          type="password"
          name="password-2"
          placeholder="请再次填写密码"
          :rules="[
            { required: true, message: '请再次填写密码' },
            { validator: validatePassword },
            { validator: validatePasswordIsMatch }
          ]"
        />
      </van-cell-group>
      <van-cell-group :border="false" size="large">
        <template #title>
          <div class="text-white flex items-center mt-4">
            <span class="text-lg">图形验证码</span>
          </div>
        </template>
        <van-field
          class="rounded"
          v-model="captchaCode"
          name="captchaCode"
          placeholder="请填写验证码"
          :rules="[{ required: true, message: '请填写验证码' }, { pattern: /^\w{4}$/, message: '验证码不正确' }]"
        >
          <template #button>
            <div @click="runCaptchaSvg" v-html="captchaSvg" class="bg-white w-36 h-12"></div>
          </template>
        </van-field>
      </van-cell-group>
      <div class="mt-10">
        <div class="flex">
          <van-button round block plain type="primary" native-type="submit" :loading="btnLoading">
            {{ pageTexts.submit }}
          </van-button>
        </div>
        <!-- <van-radio name="agree" icon-size="1rem" class="mt-4 text-sm">我已同意用户协议</van-radio> -->
      </div>
    </van-form>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRequest } from 'vue-request'
import { postSignup, postSendSms, updateUserInfo, getCaptchaSvg } from '@/services/user.service'
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
    const { run: runSendSms } = useRequest<any>(postSendSms, {
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
  .count-down {
    color: inherit!important;
    font-size: inherit!important;
  }
}
</style>
