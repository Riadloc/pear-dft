<template>
  <div class="relative">
    <van-cell :label="label" class="mb-4 rounded" title-class="cell-title" :border="false">
      <template #title>
        <span class="text-white">{{ title }}</span>
      </template>
      <template #value>
        <input id="password-keyboard" class="default border-none bg-transparent w-full text-white" placeholder="请输入密码，6-12数字或字母组合" />
      </template>
    </van-cell>
    <div v-if="showForgot" class="link absolute -bottom-6 right-0 text-xs text-white">
      <span @click="onForget">忘记提现密码？</span>
    </div>
  </div>
</template>

<script lang="ts">
import { HTTP_CODE } from '@/constants/enums'
import { initLianlianKeyboard } from '@/constants/utils'
import { getLianlianRandomKey } from '@/services/wallet.service'
import { Dialog } from 'vant'
import { defineComponent, onMounted, ref } from 'vue'
import { useRequest } from 'vue-request'
import { useRouter } from 'vue-router'

export default defineComponent({
  props: {
    label: String,
    title: String,
    showForgot: Boolean
  },
  setup(props, context) {
    const router = useRouter()
    const microDone = ref<any>(null)

    const { data: randomData, run } = useRequest<any>(getLianlianRandomKey, {
      manual: true,
      onSuccess(res: any) {
        if (res.code === HTTP_CODE.ERROR) {
          Dialog.alert({
            message: res.msg
          })
        }
        initKeyboard(res.data)
      }
    })

    const initKeyboard = async (data: any) => {
      const { random_value, license, map_arr, rsa_public_content } = data
      microDone.value = initLianlianKeyboard({
        inputId: 'password-keyboard',
        random: {
          license,
          random_value,
          map_arr,
          rsa_public_content
        }
      })
    }

    const getValue = async () => {
      return microDone.value.getValue()
    }

    const getRandomKey = () => {
      const { random_key } = randomData.value.data
      return random_key
    }

    const onForget = () => {
      router.push({ name: 'DrawCashSafety' })
    }

    context.expose({
      getValue,
      getRandomKey
    })

    onMounted(() => {
      run()
    })

    return {
      onForget
    }
  }
})
</script>

<style lang="less" scoped>
:deep(.cell-title) {
  width: var(--van-field-label-width);
  margin-right: var(--van-field-label-margin-right);
  flex-grow: 0;
  flex-basis: var(--van-field-label-width);
}
.text-button {
  @apply flex items-center text-white absolute -bottom-6 right-0 text-xs p-1;
}
.count-down {
  @apply text-sm;
  color: inherit!important;
}
</style>
