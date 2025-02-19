<template>
  <div class="bankcard-list">
    <pear-navbar title="银行卡管理" left-arrow />
    <div class="p-4">
      <template v-if="walletData.bankCards.length">
        <div
          class="relative mb-3"
          v-for="item in walletData.bankCards"
          :key="item.bankNo"
          @click="() => onClick(item)"
        >
          <van-cell
            round
            :border="false"
            title-class="text-gray-100"
            class="mb-3 rounded-lg py-4 items-center"
            is-link
            @click="() => onClick(item)"
          >
            <template #title>
              <div class="flex items-center">
                <div class="p-1 rounded-md align-middle text-center leading-none">
                  <i class="iconfont icon-kabao text-[2rem]"></i>
                </div>
                <span class="ml-3">{{ maskbank(item.bankNo) }}</span>
              </div>
            </template>
          </van-cell>
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
    <van-action-sheet v-model:show="showInfoDialog" title="银行卡信息">
      <div class="p-4">
        <van-cell-group class="bank-card-list" :border="false">
          <van-cell title="卡号" :value="formData.bankNo" />
          <van-cell title="预留手机号" :value="formData.phone" />
          <van-cell title="绑定时间" :value="formData.createdAt" />
        </van-cell-group>
        <div class="mt-4">
          <van-button icon="link-o" block class="pear-plain-button rounded-lg" @click="onUnbind">解除绑定</van-button>
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from 'vue'
import { useUserStore } from '@/stores/user.store'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { datamask, formatTimezoneDate, maskbank } from '@/constants/utils'
import { Dialog, Toast } from 'vant'
import { LianlianSteps } from '@/constants/enums'

export default defineComponent({
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const { walletData } = storeToRefs(userStore)

    const showInfoDialog = ref(false)
    const formData = reactive({
      id: '',
      bankNo: '',
      phone: '',
      createdAt: ''
    })

    const onAdd = () => {
      if (walletData.value.bankCards.length >= 3) {
        Toast('最多绑定3张银行卡！')
        return
      }
      router.push({ name: 'BankCardBind' })
    }
    const onClick = (item: (typeof walletData)['value']['bankCards'][number]) => {
      formData.id = item.id
      formData.bankNo = maskbank(item.bankNo)
      formData.phone = datamask(item.phone)
      formData.createdAt = formatTimezoneDate(item.createdAt)
      showInfoDialog.value = true
    }
    const onUnbind = () => {
      const { length: count } = walletData.value.bankCards
      const isApplyedUser = walletData.value.step === LianlianSteps.SUCCESSED
      if (count === 1 && isApplyedUser) {
        Dialog.alert({
          message: '已开户用户至少保留绑定一张银行卡！如需解绑，请先绑定新的银行卡再进行解绑'
        })
        return
      }
      router.push({ name: 'BankCardUnbind', query: { bankId: formData.id } })
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
      onClick,
      onUnbind,
      maskbank,

      formData,
      showInfoDialog
    }
  }
})
</script>
<style lang="less" scoped>
:deep(.bank-card-list.van-cell-group) {
  background: transparent;
}
:deep(.bank-card-list .van-cell) {
  background: transparent;
  color: #fff;
}
</style>
