<template>
  <div class="bank-card-bind pt-16">
    <pear-navbar title="绑定银行卡" fixed left-arrow />
    <van-form @submit="onSubmit" class="p-6" validate-trigger="onSubmit">
      <van-field
        :border="false"
        readonly
        @touchstart.stop="showBankCardKeyboard = true"
        v-model="cardNo"
        name="cardNo"
        class="mb-4 rounded"
        placeholder="储蓄银行卡卡号"
        :rules="[{ required: true, message: '请填写储蓄银行卡卡号' }]"
      />
      <van-field
        :border="false"
        v-model="realName"
        name="realName"
        class="mb-4 rounded"
        placeholder="开户人姓名（不是支行名称)"
        :rules="[{ required: true, message: '请填写开户人' }]"
      />
      <div class="mt-10">
        <van-button round block class="pear-plain-button" native-type="submit">
          绑定
        </van-button>
      </div>
    </van-form>
    <van-number-keyboard
      v-model="cardNo"
      :show="showBankCardKeyboard"
      :maxlength="20"
      @blur="showBankCardKeyboard = false"
    />
    <pear-spinner :show="loading" />
  </div>
</template>

<script lang="ts">
import { HTTP_CODE } from '@/constants/enums'
import { checkBankCardStat, onBankBind } from '@/services/wallet.service'
import { useUserStore } from '@/stores/user.store'
import { Dialog, Toast } from 'vant'
import { defineComponent, ref } from 'vue'
import { useRequest } from 'vue-request'
import { useRouter } from 'vue-router'
export default defineComponent({
  setup() {
    const router = useRouter()
    const userStore = useUserStore()

    const showBankCardKeyboard = ref(false)
    const cardNo = ref('')
    const realName = ref('')
    const onSubmit = (values: any) => {
      checkBankCardStat(values.cardNo)
        .then((res: any) => {
          if (!res.validated) {
            Toast.fail('错误或不支持的卡号')
            return
          }
          if (res.cardType !== 'DC') {
            Toast.fail('支持储蓄银行卡')
            return
          }
          runBankBind({
            bankNo: cardNo.value,
            realName: realName.value
          })
        })
    }
    const { loading, run: runBankBind } = useRequest(onBankBind, {
      manual: true,
      onSuccess(res: any) {
        if (res.code === HTTP_CODE.ERROR) {
          Dialog.alert({
            message: res.msg
          })
          return
        }
        userStore.getUserInfo()
        Toast.success({
          message: '绑定成功',
          onClose: () => {
            router.back()
          }
        })
      }
    })

    return {
      showBankCardKeyboard,
      cardNo,
      realName,
      onSubmit,
      loading
    }
  }
})
</script>

<style lang="less" scoped>

</style>
