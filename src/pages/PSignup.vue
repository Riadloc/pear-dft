<template>
  <div class="psignup">
    <h3 class="text-white text-lg my-10">欢迎注册 {{ WEB_NAME }}</h3>
    <van-button size="small" type="primary" plain round class="absolute right-4 top-4" to="/login">登 录</van-button>
    <van-form @submit="onSubmit" validate-trigger="onSubmit">
      <van-cell-group :border="false" size="large">
        <template #title>
          <div class="text-white flex items-center">
            <pear-icon set="ion" name="happy-outline" size="1.5em" class="mr-1" />
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
            <pear-icon set="ion" name="shield-checkmark-outline" size="1.5em" class="mr-1" />
            <span class="text-lg">验证码</span>
          </div>
        </template>
        <van-field
          class="rounded"
          v-model="captchaCode"
          name="captchaCode"
          placeholder="请填写验证码"
          :rules="[{ required: true, message: '请填写验证码' }, { pattern: /^\d{4}$/, message: '验证码不正确' }]"
        >
          <template #button>
            <van-button size="mini" type="primary" :disabled="countDownTime > 0 || !phone" @click="sendCode">
              <div class="flex items-center">
                <template v-if="countDownTime">
                  <van-count-down :time="60 * 1000" format="ss秒" class="count-down" @finish="countDownTime = 0" />后重发
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
            <pear-icon set="ion" name="lock-closed-outline" size="1.5em" class="mr-1" />
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
      <van-cell-group
        :border="false"
        size="large"
      >
        <template #title>
          <div class="text-white flex items-center mt-4">
            <pear-icon set="ion" name="lock-closed-outline" size="1.5em" class="mr-1" />
            <span class="text-lg">重复密码</span>
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
      <div class="mt-10">
        <div class="flex">
          <van-button round block plain type="primary" native-type="submit">
            确认注册
          </van-button>
        </div>
        <!-- <van-radio name="agree" icon-size="1rem" class="mt-4 text-sm">我已同意用户协议</van-radio> -->
      </div>
    </van-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRequest } from 'vue-request'
import { postSignup, postSendSms } from '@/services/user.service'
import { WEB_NAME } from '@/assets/config'
import { HTTP_CODE } from '@/constants/enums'
import { validatePassword } from '@/constants/utils'
import { Notify } from 'vant'
import { useUserStore } from '@/stores/user.store'
const ONE_MINUTE = 60 * 1000

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
    const captchaCode = ref('')
    const password = ref('')
    const password2 = ref('')
    const onSubmit = (values: any) => {
      console.log('submit', values)
      run({
        ...values,
        code: values.captchaCode
      })
    }
    const { loading: btnLoading, run } = useRequest<any>(postSignup, {
      manual: true,
      onSuccess(data) {
        console.log(data)
        if (data.code === HTTP_CODE.ERROR) {
          Notify(data.msg)
        } else {
          Notify({ type: 'success', message: '注册成功' })
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
      onSuccess(data) {
        countDownTime.value = ONE_MINUTE
        if (data.code === HTTP_CODE.ERROR) {
          Notify(data.msg)
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
      captchaCode,
      password,
      password2,
      onSubmit,
      btnLoading,

      countDownTime,
      onCountDownFinished,
      sendCode,

      validatePassword,
      validatePasswordIsMatch
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
