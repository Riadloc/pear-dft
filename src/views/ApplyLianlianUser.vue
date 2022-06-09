<template>
  <div class="apply-lianlian-user">
    <van-steps :active="active" class="p-4">
      <van-step>开户流程</van-step>
      <van-step>绑卡流程</van-step>
    </van-steps>
    <div v-if="active === 0">
      <van-form class="p-4" ref="form1">
        <van-field
          readonly
          label="姓名"
          :border="false"
          v-model="formData1.realName"
          name="realName"
          class="mb-4 rounded"
          placeholder="姓名"
          :rules="[{ required: true, message: '请填写姓名' }]" />
        <van-field
          readonly
          label="注册手机号"
          :border="false"
          v-model="formData1.phone"
          name="phone"
          class="mb-4 rounded"
          placeholder="接受验证码手机号"
          :rules="[{ required: true, message: '请填写注册手机号' }]" />
        <van-field
          readonly
          label="身份证号"
          :border="false"
          v-model="formData1.idNo"
          name="idNo"
          class="mb-4 rounded"
          placeholder="身份证号"
          :rules="[{ required: true, message: '请填写身份证号' }]" />
        <div class="relative">
          <van-field
            label="短信验证码"
            :border="false"
            v-model="formData1.code"
            name="code"
            class="mb-4 rounded"
            placeholder="短信验证码"
            :rules="[{ required: true, message: '请填写短信验证码' }, { pattern: /^\d{6}$/, message: '验证码格式错误' }]" />
          <div class="link absolute -bottom-6 right-0 text-sm">
            <van-count-down v-if="formData1.countDownTime" :time="formData1.countDownTime" format="ss秒后重发" class="count-down" @finish="formData1.countDownTime = 0" />
            <span v-else @click="() => sendCode(formData1)" :class="[formData1.countDownTime > 0 && 'text-blue-900']">发送验证码</span>
          </div>
        </div>
      </van-form>
    </div>
    <div v-else-if="active === 1">
      <van-form class="p-6" ref="form2">
        <van-field
          :border="false"
          name="switch"
          label="身份证是否长期有效"
          class="mb-4 rounded"
        >
          <template #input>
            <van-switch v-model="formData2.checked" size="20" />
          </template>
        </van-field>
        <van-field
          v-if="!formData2.checked"
          label="身份证有效期"
          :border="false"
          readonly
          @touchstart.stop="showDatePicker = true"
          :model-value="formData2.idExp"
          name="idExp"
          class="mb-4 rounded"
          placeholder="身份证有效期"
          :rules="[{ required: true, message: '请选择身份证有效期' }]"
        />
        <van-field
          label="银行卡号"
          :border="false"
          v-model="formData2.bankNo"
          name="bankNo"
          class="mb-4 rounded"
          placeholder="储蓄银行卡卡号"
          :rules="[{ required: true, message: '请填写储蓄银行卡卡号' }]" />
        <van-field
          readonly
          label="银行预留手机号"
          :border="false"
          v-model="formData2.phone"
          name="phone"
          class="mb-4 rounded"
          placeholder="银行预留手机号"
          :rules="[{ required: true, message: '请填写银行预留手机号' }]" />
        <ll-password-field label="提现时专用" title="设置提现密码" ref="llPasswordField" />
        <div class="relative">
          <van-field
            label="短信验证码"
            :border="false"
            v-model="formData2.code"
            name="code"
            class="mb-4 rounded"
            placeholder="短信验证码"
            :rules="[{ required: true, message: '请填写短信验证码' }, { pattern: /^\d{6}$/, message: '验证码格式错误' }]" />
          <div class="link absolute -bottom-6 right-0 text-sm">
            <van-count-down v-if="formData2.countDownTime" :time="formData2.countDownTime" format="ss秒后重发" class="count-down" @finish="formData2.countDownTime = 0" />
            <span v-else @click="() => sendCode(formData2)" :class="[formData2.countDownTime > 0 && 'text-blue-900']">发送验证码</span>
          </div>
        </div>
      </van-form>
    </div>
    <div class="fixed bg-card bottom-0 left-0 right-0 shadow-md p-4">
      <div class="flex">
        <van-button
          block
          class="pear-gray-button rounded mr-4"
          @click="onCancel"
          >取消</van-button
        >
        <van-button block class="pear-green-button rounded" @click="onNext" v-if="active === 0"
          >下一步</van-button
        >
        <template v-else>
          <van-button block class="pear-green-button rounded mr-4" @click="onPrev"
            >上一步</van-button
          >
          <van-button block class="pear-green-button rounded" @click="onSubmit"
            >提交</van-button
          >
        </template>
      </div>
    </div>
    <van-dialog
      v-model:show="showDatePicker"
      round
      :show-confirm-button="false"
    >
      <van-datetime-picker
        v-model="expireDate"
        type="date"
        title="选择有效期"
        :minDate="minDate"
        @confirm="onPickerConfirm"
        @cancel="onPickerCancel"
      />
    </van-dialog>
    <pear-spinner :show="loading" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed } from 'vue'
import { datamask } from '@/constants/utils'
import { useUserStore } from '@/stores/user.store'
import { useRouter } from 'vue-router'
import { useRequest } from 'vue-request'
import { ONE_MINUTE } from '@/constants/constants'
import { HTTP_CODE } from '@/constants/enums'
import { Toast, Switch, DatetimePicker, Dialog } from 'vant'
import { applyBindCodeWithPhone, checkBindCodeWithPhone, applyLianlianUser } from '@/services/wallet.service'
import dayjs from 'dayjs'
const requestConfig = {
  manual: true,
  throttleInterval: 1000,
  throttleOptions: { leading: true, trailing: false }
}

export default defineComponent({
  components: { 'van-switch': Switch, 'van-datetime-picker': DatetimePicker },
  setup() {
    const router = useRouter()
    const userStore = useUserStore()

    const active = ref(0)
    const showDatePicker = ref(false)
    const expireDate = ref<any>(null)
    const form1 = ref<any>(null)
    const form2 = ref<any>(null)
    const llPasswordField = ref<any>(null)
    const bankCard = userStore.walletData.bankCards[0]
    const formData1 = reactive({
      phone: datamask(userStore.userData.phone),
      idNo: bankCard.idNo,
      code: '',
      realName: bankCard.realName,
      countDownTime: 0
    })
    const formData2 = reactive({
      checked: false,
      phone: datamask(bankCard.phone),
      bankNo: bankCard.bankNo,
      idNo: bankCard.idNo,
      idExp: '',
      password: '',
      code: '',
      countDownTime: 0
    })

    const sendCode = (formRef: any) => {
      if (formRef.countDownTime > 0) {
        return
      }
      formRef.countDownTime = ONE_MINUTE
      if (active.value === 0) {
        if (codeLoading.value) {
          return
        }
        runSendCode()
      } else if (active.value === 1) {
        if (applyUserLoading.value) {
          return
        }
        if (!formData2.checked && !formData2.idExp) {
          Toast('请设置身份证有效期')
          return
        }
        const idExp = !formData2.checked ? formData2.idExp.replace(/-/g, '') : '99991231'
        runApplyUser({
          idExp
        })
      }
    }
    const { run: runSendCode, loading: codeLoading } = useRequest<any>(applyBindCodeWithPhone, {
      ...requestConfig,
      onSuccess(data) {
        if (data.code === HTTP_CODE.ERROR) {
          Dialog.alert({
            message: data.msg
          })
        } else {
          Toast('已发送')
          formData1.countDownTime = ONE_MINUTE
        }
      }
    })
    const { run: runCheckCode, loading: checkLoading } = useRequest<any>(checkBindCodeWithPhone, {
      ...requestConfig,
      onSuccess(data) {
        if (data.code === HTTP_CODE.ERROR) {
          Dialog.alert({
            message: data.msg
          })
        } else {
          active.value += 1
        }
      }
    })
    const { data: applyResult, run: runApplyUser, loading: applyUserLoading } = useRequest<any>(applyLianlianUser, {
      ...requestConfig,
      onSuccess(data) {
        if (data.code === HTTP_CODE.ERROR) {
          Dialog.alert({
            message: data.msg
          })
        }
      }
    })
    const { run: runCheckUser, loading: checkUserLoading } = useRequest<any>(applyLianlianUser, {
      ...requestConfig,
      onSuccess(data) {
        if (data.code === HTTP_CODE.ERROR) {
          Dialog.alert({
            message: data.msg
          })
        } else {
          //
        }
      }
    })

    const loading = computed(() => codeLoading.value || checkLoading.value || applyUserLoading.value || checkUserLoading.value)

    const onCancel = () => {
      router.back()
    }

    const onPrev = () => {
      active.value -= 1
    }

    const onNext = () => {
      form1.value.validate()
        .then(() => {
          runCheckCode({
            code: formData1.code
          })
        })
    }

    const onSubmit = async () => {
      form2.value.validate()
        .then(async () => {
          try {
            if (!applyResult.value) {
              Toast('验证码不正确，请重新获取')
              return
            }
            const { txn_seqno, token } = applyResult.value.data
            const password = await llPasswordField.value.getValue()
            const randomKey = await llPasswordField.value.getRandomKey()
            console.log('password', password)
            if (!password) {
              Toast('请输入提现密码')
              return
            }
            if (!formData2.code) {
              Toast('请输入验证码')
              return
            }
            const res = await runCheckUser({
              orderNo: txn_seqno,
              token,
              randomKey,
              code: formData2.code,
              password
            })
            if (res.code === HTTP_CODE.ERROR) {
              Dialog.alert({
                message: res.msg
              })
            } else {
              Dialog.alert({
                message: '开户绑卡已提交申请！'
              }).then(() => {
                router.back()
              })
            }
          } catch (error) {
            console.log(error)
            Dialog.alert({
              message: (error as any).msg || (error as any).message
            })
          }
        })
    }

    const onPickerConfirm = () => {
      formData2.idExp = dayjs(expireDate.value).format('YYYY-MM-DD')
      showDatePicker.value = false
    }

    const onPickerCancel = () => {
      showDatePicker.value = false
    }

    return {
      form1,
      form2,
      llPasswordField,

      active,
      expireDate,
      formData1,
      formData2,
      onSubmit,
      onCancel,
      onPrev,
      onNext,

      showDatePicker,
      onPickerConfirm,
      onPickerCancel,

      loading,
      sendCode,

      minDate: new Date()
    }
  }
})
</script>

<style lang="less" scoped>
.link {
  color: #31c17b;
  &:active {
    opacity: 0.6;
  }
}
:deep {
  .van-step__circle-container {
    @apply bg-paper;
  }
  .van-step--finish {
    @apply text-gray-600;
  }
  .cell-title {
    width: var(--van-field-label-width);
    margin-right: var(--van-field-label-margin-right);
    flex-grow: 0;
    flex-basis: var(--van-field-label-width);
  }
}
</style>
