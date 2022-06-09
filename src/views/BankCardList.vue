<template>
  <div class="bankcard-list">
    <pear-navbar title="银行卡管理" left-arrow />
    <div class="p-4">
      <template v-if="walletData.bankCards.length">
        <div
          class="bankcard-card relative flex p-4 rounded-lg mb-4 bg-card text-white shadow-lg"
          v-for="item in walletData.bankCards"
          :key="item.bankNo">
          <div class="inline-flex">
            <div class="w-6 h-6 bg-primary rounded-md align-middle text-center">
              <pear-icon
                set="ph"
                name="credit-card-fill"
                size="1.3rem"
                class="text-white" />
            </div>
            <span class="ml-3">{{ maskbank(item.bankNo) }}</span>
          </div>
          <span
            class="absolute top-0 right-0 text-xs px-2 bg-red-200 text-black rounded-bl-sm"
            v-if="item.status === 0"
            >审核中</span
          >
        </div>
      </template>
      <div v-else>
        <span class="text-gray-300 text-sm">还未绑定银行卡，请先绑定</span>
      </div>
      <div class="mt-6" v-if="showButton">
        <van-button
          icon="plus"
          class="pear-green-button rounded-lg"
          block
          @click="onAdd"
          >新增绑定</van-button
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue'
import { useUserStore } from '@/stores/user.store'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { maskbank } from '@/constants/utils'
import { Toast } from 'vant'
import { LianlianSteps } from '@/constants/enums'

export default defineComponent({
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const { walletData } = storeToRefs(userStore)

    const onAdd = () => {
      // if (walletData.value.bankCards === 1 && walletData.value.step !== LianlianSteps.SUCCESSED) {
      //   Toast('最多绑定3张银行卡！')
      // }
      if (walletData.value.bankCards.length >= 3) {
        Toast('最多绑定3张银行卡！')
        return
      }
      router.push({ name: 'BankCardBind' })
    }

    const showButton = computed(() => walletData.value.step === LianlianSteps.SUCCESSED || walletData.value.bankCards.length === 0)

    onMounted(() => {
      userStore.getWalletInfo()
    })

    return {
      walletData,
      LianlianSteps,
      showButton,
      onAdd,
      maskbank
    }
  }
})
</script>
