<template>
  <div>
    <div id="captcha"></div>
    <pear-spinner :show="loading" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
// @ts-ignore
import '@/assets/sdks/yidun-captcha.js'
import { validateCaptcha } from '@/services/user.service'
import { HTTP_CODE } from '@/constants/enums'
import { Toast } from 'vant'
import { useRequest } from 'vue-request'

export default defineComponent({
  props: {
    show: Boolean,
    beValidate: {
      type: Boolean,
      default: true
    }
  },
  setup(props, context) {
    const captchaIns = ref<any>();
    (window as any).initNECaptchaWithFallback({
      element: '#captcha',
      captchaId: import.meta.env.VITE_YIDUN_ID,
      mode: 'popup',
      onVerify: async (err: any, data: any) => {
        if (err) return
        if (props.beValidate) {
          runValidate(data.validate)
        } else {
          context.emit('success', data.validate)
        }
      },
      onClose: () => {
        context.emit('update:show', false)
      }
    }, function onload(instance: any) {
      captchaIns.value = instance
      if (props.show) {
        captchaIns.value?.popUp()
      }
    }, function onerror(err: any) {
      console.warn(err)
    })

    const { loading, run: runValidate } = useRequest(validateCaptcha, {
      manual: true,
      onSuccess(res: any) {
        if (res.code === HTTP_CODE.ERROR) {
          Toast.fail(res.msg)
        } else {
          context.emit('success')
        }
      }
    })

    watch(() => props.show, () => {
      if (props.show) {
        captchaIns.value?.refresh()
        captchaIns.value?.popUp()
      }
    })

    return {
      loading
    }
  }
})
</script>
