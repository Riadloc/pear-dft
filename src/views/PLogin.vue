<template>
  <div class="plogin">
    <h3 class="text-white text-lg my-10">欢迎登录 {{ WEB_NAME }}</h3>
    <van-button size="small" plain type="primary" round class="absolute right-4 top-4" to="/signup">注 册</van-button>
    <van-form @submit="onSubmit" validate-trigger="onSubmit">
      <van-cell-group :border="false" size="large">
        <template #title>
          <div class="text-white flex items-center justify-between">
            <div class="flex items-center">
              <span class="text-lg">手机号</span>
            </div>
            <van-button type="success" size="mini" plain @click="toggleLoginType">{{ loginTypeName }}登录</van-button>
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
        v-if="loginType === LoginTypes.CODE"
      >
        <template #title>
          <div class="text-white flex items-center mt-4">
            <span class="text-lg">验证码</span>
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
                  <van-count-down :time="countDownTime" format="ss秒" class="count-down" @finish="onCountDownFinished" />后重发
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
        v-else
      >
        <template #title>
          <div class="text-white flex items-center mt-4">
            <span class="text-lg">密码</span>
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
        <van-button round block plain type="primary" native-type="submit" :loading="btnLoading">
          登录
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Notify, Toast } from 'vant'
import { useRequest } from 'vue-request'
import { useUserStore } from '@/stores/user.store'
import { getCaptchaSvg, postLogin, postSendSms } from '@/services/user.service'
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
        console.log(data)
        if (data.code === HTTP_CODE.ERROR) {
          Toast.fail(data.msg)
        } else {
          Notify({
            type: 'success',
            message: '登录成功'
          })
          store.setUserInfo(data.data)
          localStorage.setItem('user.id', `${data.data.userId}`)
          router.replace('/')
        }
      }
    })

    const countDownTime = ref(0)
    const onCountDownFinished = () => {
      countDownTime.value = 0
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
        countDownTime.value = ONE_MINUTE
        if (data.code === HTTP_CODE.ERROR) {
          Toast({ type: 'success', message: data.msg })
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

      countDownTime,
      onCountDownFinished,
      sendCode,
      runCaptchaSvg,
      captchaSvg,

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
  .count-down {
    color: inherit!important;
    font-size: inherit!important;
  }
}
</style>
