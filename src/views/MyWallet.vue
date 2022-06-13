<template>
  <div class="wallet pt-6">
    <pear-navbar title="我的余额" class="bg-paper" fixed left-arrow />
    <div class="flex flex-col items-center justify-center h-40 text-white">
      <p class="text-3xl align-bottom"><span class="text-lg">￥</span>{{ walletData.balance }}</p>
      <p class="text-sm text-gray-300">当前余额</p>
    </div>
    <div class="flex px-4">
      <van-button block class="rounded-lg pear-green-button mr-4" @click="goTopUp">充值</van-button>
      <van-button block class="rounded-lg pear-gray-button" @click="goDrawCash">提现</van-button>
    </div>
    <div>
      <van-tabs v-model:active="activeTab" shrink class="mt-4" sticky>
      <van-tab title="全部记录" :name="WalletRecordType.ALL">
           <wallet-record-list :type="WalletRecordType.ALL" />
        </van-tab>
        <van-tab title="交易记录" :name="WalletRecordType.TRADE">
           <wallet-record-list :type="WalletRecordType.TRADE" />
        </van-tab>
        <van-tab title="充值记录" :name="WalletRecordType.TOP_UP">
           <wallet-record-list :type="WalletRecordType.TOP_UP" />
        </van-tab>
        <van-tab title="提现记录" :name="WalletRecordType.DRAW_CASH">
           <wallet-record-list :type="WalletRecordType.DRAW_CASH" />
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { WalletRecordList } from '@/components'
// import { LianlianSteps, WalletRecordType, UserRoles } from '@/constants/enums'
import { WalletRecordType } from '@/constants/enums'
import { useUserStore } from '@/stores/user.store'
import { storeToRefs } from 'pinia'
import { Dialog } from 'vant'

const tabs = [
  {
    id: 0,
    title: '交易记录'
  },
  {
    id: 1,
    title: '充值记录'
  },
  {
    id: 2,
    title: '提现记录'
  }
]
export default defineComponent({
  components: { WalletRecordList },
  setup() {
    const router = useRouter()
    const store = useUserStore()
    const { walletData, userData } = storeToRefs(store)

    const activeTab = ref(WalletRecordType.ALL)

    const checkBankInfo = () => {
      if (!userData.value.certified) {
        Dialog.confirm({
          message: '需要实名认证',
          confirmButtonText: '前去实名'
        }).then(() => {
          router.push('/certify')
        })
        return false
      }
      if (!walletData.value.bankCards?.length || !walletData.value.bankCards[0]?.idNo) {
        Dialog.confirm({
          message: '请先补齐银行卡信息',
          confirmButtonText: '前去绑定'
        }).then(() => {
          router.push({ name: 'BankCardList' })
        })
        return false
      }
      return true
    }

    const goTopUp = () => {
      const valid = checkBankInfo()
      if (valid) {
        router.push('/topUpStore')
      }
    }

    const goDrawCash = () => {
      const valid = checkBankInfo()
      if (!valid) return
      router.push('/drawCash')
      // if (walletData.value.step !== LianlianSteps.SUCCESSED) {
      //   Dialog.confirm({
      //     message: '请先开通连连支付账号',
      //     confirmButtonText: '前去开通'
      //   }).then(() => {
      //     router.push({ name: 'LianlianUserAgreement' })
      //   })
      // } else {
      //   router.push('/drawCash')
      // }
    }

    const onVisiblityChange = () => {
      if (document.visibilityState) {
        store.getWalletInfo()
      }
    }
    onMounted(() => {
      store.getWalletInfo()
      document.addEventListener('visibilitychange', onVisiblityChange)
    })
    onUnmounted(() => {
      document.removeEventListener('visibilitychange', onVisiblityChange)
    })

    return {
      walletData,
      goTopUp,
      goDrawCash,
      activeTab,
      tabs,

      WalletRecordType
    }
  }
})
</script>

<style lang="less" scoped>

</style>
