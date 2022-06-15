<template>
  <div class="bank-card-bind">
    <pear-navbar title="绑定银行卡" left-arrow />
    <van-form @submit="onSubmit" class="p-4" validate-trigger="onSubmit">
      <van-field
        label="银行卡号"
        :border="false"
        v-model="formData.bankNo"
        name="bankNo"
        class="mb-4 rounded"
        placeholder="储蓄银行卡卡号"
        :rules="[{ required: true, message: '请填写储蓄银行卡卡号' }]"
      />
      <van-field
        label="预留手机号"
        :border="false"
        v-model="formData.phone"
        name="phone"
        class="mb-4 rounded"
        placeholder="银行卡开户手机号"
        :rules="[{ required: true, message: '请填写银行卡开户手机号' }]"
      />
      <van-field
        :readonly="!!userStore.walletData.realName"
        label="姓名"
        :border="false"
        v-model="formData.realName"
        name="realName"
        class="mb-4 rounded"
        placeholder="开户人姓名（不是支行名称)"
        :rules="[{ required: true, message: '请填写开户人姓名' }]"
      />
      <van-field
        :readonly="!!userStore.walletData.idNo"
        label="身份证号"
        :border="false"
        v-model="formData.idNo"
        name="idNo"
        class="mb-4 rounded"
        placeholder="身份证号"
        :rules="[{ required: true, message: '请填写身份证号' }]"
      />
      <ll-password-field show-forgot v-if="userStore.walletData.step === LianlianSteps.SUCCESSED" label="提现时专用" title="提现密码" ref="llPasswordField" />
      <div class="mt-10">
        <van-button block class="pear-green-button rounded" native-type="submit">立即绑定</van-button>
      </div>
    </van-form>
    <typing-password-dialog
      title="请输入验证码"
      :show="showCodeDialog"
      @cancel="showCodeDialog = false"
      @success="onValidOk"
      :validate="false"
    />
    <pear-spinner :show="loading" />
  </div>
</template>

<script lang="ts">
import { HTTP_CODE, LianlianSteps } from '@/constants/enums'
import { checkBankCardStat, checkBindCodeWithBank, onBankBind } from '@/services/wallet.service'
import { useUserStore } from '@/stores/user.store'
import { Dialog, Toast } from 'vant'
import { computed, defineComponent, reactive, ref } from 'vue'
import { useRequest } from 'vue-request'
import { useRouter } from 'vue-router'
export default defineComponent({
  setup() {
    const router = useRouter()
    const userStore = useUserStore()

    const llPasswordField = ref<any>(null)
    const showCodeDialog = ref(false)
    const formData = reactive({
      phone: userStore.userData.phone,
      bankNo: '',
      idNo: userStore.walletData.idNo,
      realName: userStore.walletData.realName
    })

    const onSubmit = (values: any) => {
      Dialog.confirm({
        message: '确认信息无误？',
        confirmButtonText: '确认无误',
        cancelButtonText: '再检查一下'
      }).then(() => {
        checkBankCardStat(values.bankNo)
          .then(async (res: any) => {
            if (!res.validated) {
              Toast('错误或不支持的卡号')
              return
            }
            if (res.cardType !== 'DC') {
              Toast('支持储蓄银行卡')
              return
            }
            const formData: any = {
              bankNo: values.bankNo,
              realName: values.realName,
              phone: values.phone,
              idNo: values.idNo
            }
            if (userStore.walletData.step === LianlianSteps.SUCCESSED) {
              formData.password = await llPasswordField.value.getValue()
              formData.randomKey = llPasswordField.value.getRandomKey()
            }
            runBankBind(formData)
          })
      })
    }
    const { data: bankBindData, loading: loading1, run: runBankBind } = useRequest(onBankBind, {
      manual: true,
      onSuccess(res: any) {
        if (res.code === HTTP_CODE.ERROR) {
          Dialog.alert({
            message: res.msg
          })
          return
        }
        if (!res.data.token) {
          userStore.getWalletInfo()
          Dialog.alert({
            message: '绑定成功'
          }).then(() => {
            router.back()
          })
        } else {
          Toast('已发送验证码至您的手机')
          showCodeDialog.value = true
        }
      }
    })
    const { loading: loading2, run: runBankBindCheck } = useRequest(checkBindCodeWithBank, {
      manual: true,
      onSuccess(res: any) {
        if (res.code === HTTP_CODE.ERROR) {
          Dialog.alert({
            message: res.msg
          })
          return
        }
        showCodeDialog.value = false
        Dialog.alert({
          message: '绑定成功'
        }).then(() => {
          router.back()
        })
      }
    })
    const onValidOk = (code: string) => {
      const { txn_seqno, token } = bankBindData.value.data
      runBankBindCheck({
        code,
        orderNo: txn_seqno,
        token
      })
    }
    const loading = computed(() => loading1.value || loading2.value)

    return {
      showCodeDialog,
      formData,
      llPasswordField,
      userStore,
      LianlianSteps,
      onSubmit,
      onValidOk,
      loading
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
</style>
