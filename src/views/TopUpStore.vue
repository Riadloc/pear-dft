<template>
  <div class="top-up-store">
    <pear-navbar title="商城储值卡" left-arrow />
    <div class="px-4 pt-4">
      <div
        v-for="item in values"
        :key="item"
        class="flex overflow-hidden rounded-md text-white bg-card mb-4"
      >
        <div class="image-wrapper relative">
          <van-image width="10rem" src="/store_card.jpg"></van-image>
          <span class="absolute right-4 top-1/3 z-10 text-xl font-semibold">{{ item }}</span>
        </div>
        <div class="pl-4 pt-4 flex-1">
          <p>{{ item }} 额度</p>
        </div>
        <div class="p-3 flex flex-col justify-end ">
          <span class="bg-primary rounded-tl-md rounded-br-md text-sm px-2 pay-button" @click="() => onSelect(item)">￥{{ item }}</span>
        </div>
      </div>
    </div>
    <pear-spinner :show="loading" />
    <typing-password-dialog
      title="请输入验证码"
      :show="showCodeDialog"
      @cancel="showCodeDialog = false"
      @success="onValidOk"
      :validate="false"
    />
    <van-action-sheet v-model:show="showConfirmDialog" title="充值信息确认">
      <div class="p-4">
        <div class="mb-4">
          <h3 class="text-gray-300 text-sm mb-1">充值金额</h3>
          <p class="text">￥ {{ payInfo.price }}</p>
        </div>
        <div class="mb-4">
          <h3 class="text-gray-300 text-sm mb-1">支付方式</h3>
          <div class="flex">
            <div class="inline-flex">
              <div class="w-6 h-6 bg-primary rounded-md align-middle text-center">
                <pear-icon set="ph" name="credit-card-fill" size="1.3rem" class="text-white" />
              </div>
              <span class="ml-2">银行卡快捷支付</span>
            </div>
          </div>
        </div>
        <div class="mb-4">
          <h3 class="text-gray-300 text-sm mb-1">选择支付银行卡</h3>
          <van-radio-group v-model="bankId">
            <div
              class="flex justify-between"
              v-for="item in walletData.bankCards"
              :key="item.id"
            >
              <div class="inline-flex" @click="bankId = item.id">
                <div class="w-6 h-6 bg-primary rounded-md align-middle text-center">
                  <pear-icon set="ph" name="credit-card-fill" size="1.3rem" class="text-white" />
                </div>
                <span class="ml-2 text-white align-middle">{{ maskbank(item.bankNo) }}</span>
              </div>
              <van-radio :name="item.id"/>
            </div>
          </van-radio-group>
        </div>
        <div class="pt-2">
          <van-button block :class="[bankId ? 'pear-green-button' : 'pear-gray-button', 'rounded-lg']" @click="onTopup">立即充值</van-button>
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script lang="ts">
import { HTTP_CODE } from '@/constants/enums'
import router from '@/routes'
import { checkLianlianSms, topUpService } from '@/services/wallet.service'
import { useUserStore } from '@/stores/user.store'
import { storeToRefs } from 'pinia'
import { Dialog, Toast } from 'vant'
import { computed, defineComponent, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRequest } from 'vue-request'
import { maskbank } from '@/constants/utils'

export default defineComponent({
  setup() {
    const userStore = useUserStore()
    const { walletData } = storeToRefs(userStore)

    const showConfirmDialog = ref(false)
    const showCodeDialog = ref(false)

    const payInfo = reactive({
      orderNo: '',
      price: '',
      token: ''
    })

    const onSelect = (value: number) => {
      payInfo.price = `${value}`
      showConfirmDialog.value = true
    }

    const onTopup = () => {
      if (!bankId.value) {
        Toast.fail('请选择支付银行卡')
        return
      }
      runTopUp({
        bankId: bankId.value,
        price: payInfo.price
      })
    }

    const { loading: mainLoading, run: runTopUp } = useRequest(topUpService, {
      manual: true,
      throttleInterval: 1000,
      throttleOptions: { leading: true, trailing: false },
      onSuccess(res: any) {
        if (res.code === HTTP_CODE.ERROR) {
          Dialog.alert({
            message: res.msg
          })
          return
        }
        if (res.data.token) {
          Toast('已发送验证码至您的手机')
          const { txn_seqno: orderNo, total_amount: price, token } = res.data
          showCodeDialog.value = true
          payInfo.orderNo = orderNo
          payInfo.price = price
          payInfo.token = token
        } else {
          Dialog.alert({
            message: '支付成功'
          }).then(() => {
            router.back()
          })
        }
      }
    })

    const { loading: checkLoading, run: runCheckSms } = useRequest(checkLianlianSms, {
      manual: true,
      throttleInterval: 1000,
      throttleOptions: { leading: true, trailing: false },
      onSuccess(res: any) {
        if (res.code === HTTP_CODE.ERROR) {
          Dialog.alert({
            message: res.msg
          })
          return
        }
        showCodeDialog.value = false
        Dialog.alert({
          message: '支付成功'
        }).then(() => {
          router.back()
        })
      }
    })

    const onVisiblityChange = () => {
      if (document.visibilityState && payInfo.orderNo) {
        Dialog.confirm({
          message: '支付完成？'
        }).then(() => {
          router.back()
        })
      }
    }

    const onValidOk = (code: string) => {
      runCheckSms({
        ...payInfo,
        code
      })
    }

    const bankId = ref('')

    const loading = computed(() => mainLoading.value || checkLoading.value)

    onMounted(() => {
      document.addEventListener('visibilitychange', onVisiblityChange)
    })
    onUnmounted(() => {
      document.removeEventListener('visibilitychange', onVisiblityChange)
    })

    return {
      showConfirmDialog,
      showCodeDialog,
      onSelect,
      onValidOk,
      onTopup,
      maskbank,
      loading,
      payInfo,
      walletData,
      values: [
        100,
        300,
        500,
        1000,
        5000,
        10,
        0.1
      ],

      bankId
    }
  }
})
</script>

<style lang="less" scoped>
.image-wrapper {
  font-size: 0;
}
.pay-button {
  &:active {
    opacity: 0.6;
  }
}
</style>
