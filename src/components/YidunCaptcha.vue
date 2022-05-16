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
    show: Boolean
  },
  setup(props, context) {
    const captchaIns = ref<any>();
    (window as any).initNECaptchaWithFallback({
      element: '#captcha',
      captchaId: '7fbc4af8104c4da5b1881913248af751',
      // width: '320px',
      mode: 'popup',
      onVerify: async (err: any, data: any) => {
        if (err) return
        runValidate(data.validate)
      },
      onClose: () => {
        // captchaIns.value?.close()
        context.emit('update:show', false)
      }
    }, function onload(instance: any) {
      captchaIns.value = instance
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
