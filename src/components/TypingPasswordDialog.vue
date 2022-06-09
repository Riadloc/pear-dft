<template>
  <div class="typing-password-dialog">
    <van-dialog
      :show="show"
      :title="title"
      :show-confirm-button="false"
      show-cancel-button
      class="!top-1/3"
      :before-close="beforeClose"
    >
      <div class="pt-4 pb-8">
        <van-password-input
          :value="value"
          :focused="showKeyboard"
          @focus="showKeyboard = true"
        />
      </div>
    </van-dialog>
    <van-number-keyboard
      class="keyboard"
      v-model="value"
      @update:model-value="onTyping"
      :show="showKeyboard"
      @blur="showKeyboard = false"
    />
    <pear-spinner :show="loading" />
  </div>
</template>

<script lang="ts">
import { HTTP_CODE } from '@/constants/enums'
import { checkPayPassword } from '@/services/user.service'
import { Dialog } from 'vant'
import { defineComponent, ref, watch } from 'vue'
import { useRequest } from 'vue-request'
export default defineComponent({
  props: {
    show: Boolean,
    title: String,
    validate: {
      type: Boolean,
      default: true
    }
  },
  setup(props, context) {
    const value = ref('')
    const showKeyboard = ref(false)

    const onTyping = (val: string) => {
      if (val.length === 6) {
        showKeyboard.value = false
        if (props.validate) {
          run({
            payKey: value.value
          })
        } else {
          context.emit('success', value.value)
        }
      }
    }

    const beforeClose = (action: string) => {
      if (action === 'cancel') {
        context.emit('cancel')
      }
    }

    const { run, loading } = useRequest(checkPayPassword, {
      manual: true,
      throttleInterval: 2000,
      throttleOptions: { leading: true, trailing: false },
      onSuccess(res: any) {
        if (res.code === HTTP_CODE.ERROR) {
          Dialog.alert({
            message: res.msg
          }).then(() => {
            value.value = ''
          })
          return
        }
        context.emit('success')
      }
    })

    watch(() => props.show, (val) => {
      if (!val) {
        value.value = ''
      }
    })

    return {
      value,
      showKeyboard,
      loading,
      onTyping,
      beforeClose
    }
  }
})
</script>

<style lang="less" scoped>
.keyboard {
  z-index: 10000;
}
</style>
