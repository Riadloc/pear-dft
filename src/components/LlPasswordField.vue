<template>
  <van-cell :label="label" class="mb-4 rounded" title-class="cell-title" :border="false">
    <template #title>
      <span class="text-white">{{ title }}</span>
    </template>
    <template #value>
      <input id="password-keyboard" class="default border-none bg-transparent w-full text-white" placeholder="请输入密码，6-12数字或字母组合" />
    </template>
  </van-cell>
</template>

<script lang="ts">
import { HTTP_CODE } from '@/constants/enums'
import { initLianlianKeyboard } from '@/constants/utils'
import { getLianlianRandomKey } from '@/services/wallet.service'
import { Dialog } from 'vant'
import { defineComponent, onMounted, ref } from 'vue'
import { useRequest } from 'vue-request'

export default defineComponent({
  props: {
    label: String,
    title: String
  },
  setup(props, context) {
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

    context.expose({
      getValue,
      getRandomKey
    })

    onMounted(() => {
      run()
    })
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
</style>
