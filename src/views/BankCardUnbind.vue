<template>
  <div class="bank-card-bind">
    <pear-navbar title="解绑银行卡" left-arrow />
    <van-form @submit="onSubmit" class="p-4" validate-trigger="onSubmit">
      <van-field
        label="银行卡号"
        :border="false"
        readonly
        v-model="formData.bankNo"
        name="bankNo"
        class="mb-4 rounded"
        placeholder="储蓄银行卡卡号"
        :rules="[{ required: true, message: '请填写储蓄银行卡卡号' }]"
      />
      <van-field
        readonly
        label="预留手机号"
        :border="false"
        v-model="formData.phone"
        name="phone"
        class="mb-4 rounded"
        placeholder="银行卡开户手机号"
        :rules="[{ required: true, message: '请填写银行卡开户手机号' }]"
      />
      <van-field
        readonly
        label="姓名"
        :border="false"
        v-model="formData.realName"
        name="realName"
        class="mb-4 rounded"
        placeholder="开户人姓名（不是支行名称)"
        :rules="[{ required: true, message: '请填写开户人姓名' }]"
      />
      <van-field
        readonly
        label="身份证号"
        :border="false"
        v-model="formData.idNo"
        name="idNo"
        class="mb-4 rounded"
        placeholder="身份证号"
        :rules="[{ required: true, message: '请填写身份证号' }]"
      />
      <ll-password-field v-if="userStore.walletData.step === LianlianSteps.SUCCESSED" label="提现时专用" title="提现密码" ref="llPasswordField" />
      <div class="mt-10">
        <van-button block class="pear-green-button rounded" native-type="submit">解除绑定</van-button>
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
import { HTTP_CODE, LianlianSteps } from '@/constants/enums'
import { datamask } from '@/constants/utils'
import { onBankUnbind } from '@/services/wallet.service'
import { useUserStore } from '@/stores/user.store'
import { storeToRefs } from 'pinia'
import { Dialog, Toast } from 'vant'
import { computed, defineComponent, reactive, ref } from 'vue'
import { useRequest } from 'vue-request'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()
    const userStore = useUserStore()
    const { walletData } = storeToRefs(userStore)

    const data = walletData.value.bankCards.find(item => item.id === route.query.bankId)

    const llPasswordField = ref<any>(null)
    const showBankCardKeyboard = ref(false)
    const showCodeDialog = ref(false)
    const formData = reactive({
      phone: datamask(data?.phone || ''),
      bankNo: data?.bankNo,
      idNo: data?.idNo,
      realName: data?.realName
    })

    const onSubmit = () => {
      const { length: count } = walletData.value.bankCards
      const isApplyedUser = walletData.value.step === LianlianSteps.SUCCESSED
      Dialog.confirm({
        message: '确认解除绑定？'
      }).then(async () => {
        if (count === 1 && isApplyedUser) {
          Toast('不满足解绑条件！')
          return
        }
        const formData: any = {
          bankId: data?.id
        }
        if (userStore.walletData.step === LianlianSteps.SUCCESSED) {
          formData.password = await llPasswordField.value.getValue()
          formData.randomKey = llPasswordField.value.getRandomKey()
        }
        runBankUnbind(formData)
      })
    }
    const { loading: ubLoading, run: runBankUnbind } = useRequest(onBankUnbind, {
      manual: true,
      onSuccess(res: any) {
        if (res.code === HTTP_CODE.ERROR) {
          Dialog.alert({
            message: res.msg
          })
        }
        Dialog.alert({
          message: '解绑申请成功提交！'
        }).then(() => {
          router.back()
        })
      }
    })
    const loading = computed(() => ubLoading.value)

    return {
      showBankCardKeyboard,
      showCodeDialog,
      formData,
      llPasswordField,
      userStore,
      LianlianSteps,
      onSubmit,
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
