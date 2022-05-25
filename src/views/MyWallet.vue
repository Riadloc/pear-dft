<template>
  <div class="wallet pt-6">
    <pear-navbar title="我的钱包" fixed left-arrow />
    <div class="flex flex-col items-center justify-center h-40 text-white">
      <p class="text-3xl align-bottom"><span class="text-lg">￥</span>{{ walletData.balance }}</p>
      <p class="text-sm text-gray-300">当前余额</p>
    </div>
    <div class="flex px-4">
      <van-button block class="mr-6 rounded-lg pear-plain-button" @click="goTopUp">充值</van-button>
      <van-button block class="rounded-lg pear-plain-button" @click="goDrawCash">提现</van-button>
    </div>
    <div>
      <van-tabs v-model:active="activeTab" shrink class="mt-4" sticky>
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

    const activeTab = ref(WalletRecordType.TRADE)

    const goTopUp = () => {
      // Dialog.alert({
      //   message: '功能正在维护中，暂时关闭'
      // })

      router.push('/topUpStore')
    }
    const goDrawCash = () => {
      if (userData.value.isBindBank) {
        router.push('/drawCash')
      } else {
        Dialog.alert({
          message: '请先绑定银行卡'
        }).then(() => {
          router.push('/bankCardBind')
        })
      }
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
