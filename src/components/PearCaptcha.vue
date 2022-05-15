<template>
  <div class="pear-captcha">
    <van-dialog :show="show" title="图形验证码" show-cancel-button :before-close="beforeClose">
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
import { defineComponent, ref, watch } from 'vue'
import { HTTP_CODE } from '@/constants/enums'
import { getCaptchaSvg, validateCaptcha } from '@/services/user.service'
import { Toast } from 'vant'
import { useRequest } from 'vue-request'

export default defineComponent({
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {
    const captchaCode = ref('')
    const beforeClose = async (action: string) => {
      if (action === 'confirm') {
        const res: any = await validateCaptcha(captchaCode.value)
        if (res.code === HTTP_CODE.ERROR) {
          Toast.fail(res.msg)
        } else {
          context.emit('success')
        }
        return false
      }
      context.emit('cancel')
      return false
    }
    const captchaSvg = ref('')
    const { run: runCaptchaSvg } = useRequest<any>(getCaptchaSvg, {
      manual: true,
      throttleInterval: 2000,
      throttleOptions: { leading: true, trailing: false },
      onSuccess(data) {
        if (data.code === HTTP_CODE.ERROR) {
          Toast({ type: 'fail', message: data.msg })
        } else {
          captchaSvg.value = data.data
        }
      }
    })
    watch(() => props.show, (val) => {
      if (val) {
        runCaptchaSvg()
      } else {
        captchaCode.value = ''
      }
    })
    return {
      captchaSvg,
      captchaCode,
      beforeClose,
      runCaptchaSvg
    }
  }
})
</script>

<style lang="less" scoped>

</style>
