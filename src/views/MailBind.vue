
<template>
  <div class="mail-bind">
    <pear-navbar left-arrow />
    <div class="px-6 pt-10">
      <h2 class="text-3xl font-semibold text-white">邮箱绑定</h2>
      <p class="text-sm text-gray-400 my-4" v-if="store.userData.email ">已绑定邮箱：{{ store.userData.email }}</p>
      <van-form @submit="onSubmit">
        <van-cell-group
          :border="false"
          size="large"
        >
          <template #title>
            <div class="text-white flex items-center mt-4">
              <span class="text-lg">邮箱</span>
            </div>
          </template>
          <div class="relative">
            <van-field
              class="rounded"
              v-model="email"
              name="email"
              placeholder="请填写邮箱"
              :rules="[
                { required: true, message: '请填写邮箱' },
                { pattern: /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.([a-zA-Z0-9]+)$/, message: '邮箱格式不正确' }
              ]"
            />
            <div class="link absolute -bottom-6 right-0 text-sm">
              <van-count-down v-if="countDownTime" :time="countDownTime" format="ss秒后重发" class="count-down" @finish="onCountDownFinished" />
              <span v-else @click="sendCode" :class="[(!email || countDownTime > 0) && 'text-blue-900']">发送验证码</span>
            </div>
          </div>
        </van-cell-group>
        <van-cell-group
          :border="false"
          size="large"
        >
          <template #title>
            <div class="text-white flex items-center mt-4">
              <span class="text-lg">验证码</span>
            </div>
          </template>
          <van-field
            readonly
            @touchstart.stop="show = true"
            class="rounded"
            v-model="code"
            name="code"
            placeholder="请填写验证码"
            :rules="[{ required: true, message: '请填写验证码' }, { pattern: /^\d{4}$/, message: '验证码不正确' }]"
          />
        </van-cell-group>
        <div class="mt-10">
          <van-button block class="pear-green-button rounded" native-type="submit" :loading="loading">
            <span v-if="store.userData.email">重新绑定</span><span v-else>提交</span>
          </van-button>
        </div>
      </van-form>
      <van-number-keyboard
        v-model="code"
        :show="show"
        :maxlength="4"
        @blur="show = false"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useUserStore } from '@/stores/user.store'
import { useRequest } from 'vue-request'
import { sendEmailCode, verifyEmailCode } from '@/services/user.service'
import { Dialog, Notify, Toast } from 'vant'
import { useRouter } from 'vue-router'
import { HTTP_CODE } from '@/constants/enums'
import { ONE_MINUTE } from '@/constants/constants'
export default defineComponent({
  setup() {
    const show = ref(false)
    const code = ref('')
    const email = ref('')

    const router = useRouter()
    const store = useUserStore()

    const back = () => {
      router.back()
    }

    const countDownTime = ref(0)
    const onCountDownFinished = () => {
      countDownTime.value = 0
    }

    const sendCode = () => {
      if (!email.value || countDownTime.value > 0 || codeLoading.value) {
        return
      }
      if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.([a-zA-Z0-9]+)$/.test(email.value)) {
        Toast('邮箱格式不正确')
        return
      }
      countDownTime.value = ONE_MINUTE
      runSendEmailCode({
        email: email.value
      })
    }
    const { run: runSendEmailCode, loading: codeLoading } = useRequest<any>(sendEmailCode, {
      manual: true,
      throttleInterval: 1000,
      throttleOptions: { leading: true, trailing: false },
      onSuccess(data) {
        if (data.code === HTTP_CODE.ERROR) {
          Toast({ type: 'fail', message: data.msg })
        } else {
          if (data.data > 0) {
            Notify('获取时间没超过1分钟！')
            countDownTime.value = data.data * 1000
          } else {
            Toast('验证码已发至您的邮箱')
            countDownTime.value = ONE_MINUTE
          }
        }
      }
    })
    const { run: runVerify, loading } = useRequest<any>(verifyEmailCode, {
      manual: true,
      throttleInterval: 1000,
      throttleOptions: { leading: true, trailing: false },
      onSuccess(data) {
        if (data.code === HTTP_CODE.ERROR) {
          Toast({ type: 'fail', message: data.msg })
        } else {
          Dialog.alert({
            message: '邮箱绑定成功'
          }).then(() => {
            store.getUserInfo()
            router.back()
          })
        }
      }
    })
    const onSubmit = (values: any) => {
      if (values.email === store.userData.email) {
        Dialog.alert({
          message: '该邮箱已绑定！'
        })
        return
      }
      runVerify({
        email: values.email,
        code: values.code
      })
    }

    return {
      back,
      show,
      code,
      email,

      sendCode,
      countDownTime,
      onCountDownFinished,

      loading,
      onSubmit,

      store
    }
  }
})
</script>

<style lang="less" scoped>
.mail-bind {
  .van-cell:after {
    left: 0;
    right: 0;
  }
  .link {
    color: #31c17b;
    &:active {
      opacity: 0.6;
    }
  }
  .van-cell:after {
    border-bottom: none!important;
  }
  .count-down {
    color: var(--van-blue)!important;
    font-size: inherit!important;
  }
}
</style>
