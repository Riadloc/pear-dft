<template>
  <div class="bank-card-bind pt-16">
    <pear-navbar title="绑定银行卡" fixed left-arrow />
    <van-form @submit="onSubmit" class="p-6" validate-trigger="onSubmit">
      <van-field
        label="卡号"
        :border="false"
        readonly
        @touchstart.stop="showBankCardKeyboard = true"
        v-model="formData.bankNo"
        name="bankNo"
        class="mb-4 rounded"
        placeholder="储蓄银行卡卡号"
        :rules="[{ required: true, message: '请填写储蓄银行卡卡号' }]"
      />
      <van-field
        label="姓名"
        :border="false"
        v-model="formData.realName"
        name="realName"
        class="mb-4 rounded"
        placeholder="开户人姓名（不是支行名称)"
        :rules="[{ required: true, message: '请填写开户人姓名' }]"
      />
      <van-field
        label="支付宝账号"
        :border="false"
        v-model="formData.alipayAccount"
        name="alipayAccount"
        class="mb-4 rounded"
        placeholder="支付宝账号"
        :rules="[{ required: true, message: '请填写支付宝账号' }]"
      />
      <div class="mt-10">
        <van-button block class="pear-green-button rounded" native-type="submit">
          {{ userStore.userData.isBindBank ? '重新绑定' : '绑定' }}
        </van-button>
      </div>
    </van-form>
    <van-number-keyboard
      v-model="formData.bankNo"
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
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { useRequest } from 'vue-request'
import { useRouter } from 'vue-router'
export default defineComponent({
  setup() {
    const router = useRouter()
    const userStore = useUserStore()

    const showBankCardKeyboard = ref(false)
    const formData = reactive({
      bankNo: '',
      realName: '',
      alipayAccount: ''
    })

    const onSubmit = (values: any) => {
      Dialog.confirm({
        message: '确认信息无误？',
        confirmButtonText: '确认无误',
        cancelButtonText: '再检查一下'
      }).then(() => {
        checkBankCardStat(values.bankNo)
          .then((res: any) => {
            if (!res.validated) {
              Toast('错误或不支持的卡号')
              return
            }
            if (res.cardType !== 'DC') {
              Toast('支持储蓄银行卡')
              return
            }
            if (!(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.([a-zA-Z0-9]+)$/.test(values.alipayAccount) || /^\d{11}$/.test(values.alipayAccount))) {
              Toast('支付宝账号格式不正确，支持手机号或电子邮箱账号格式')
              return
            }
            runBankBind({
              bankNo: values.bankNo,
              realName: values.realName,
              alipayAccount: values.alipayAccount
            })
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
        userStore.userData.isBindBank = true
        userStore.getWalletInfo()
        Toast.success({
          message: '绑定成功',
          onClose: () => {
            router.back()
          }
        })
      }
    })

    onMounted(() => {
      if (userStore.isWalletFetched && userStore.walletData.bankNo) {
        const { bankNo, realName, alipayAccount } = userStore.walletData
        formData.realName = realName
        formData.bankNo = bankNo
        formData.alipayAccount = alipayAccount
      }
    })

    return {
      showBankCardKeyboard,
      formData,
      userStore,
      onSubmit,
      loading
    }
  }
})
</script>

<style lang="less" scoped>

</style>
