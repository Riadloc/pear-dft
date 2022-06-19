<template>
  <div class="put-on-market pt-14 px-4">
    <pear-navbar title="转售" fixed left-arrow />
    <div class="bg-card flex rounded-lg overflow-hidden p-3 mb-6">
      <pear-image
        :src="detailData.cover"
        width="100%"
        size="h-20 w-20"
        class="overflow-hidden rounded-lg"
      />
      <div class="flex flex-col pl-4 justify-center flex-1 text-sm text-white">
        <div class="flex justify-between items-center leading-7 mb-1">
          <h4 class="text-base">{{ detailData.name }}</h4>
          <span class="font-bold text-amber-200 text-lg">￥{{ detailData.price }}</span>
        </div>
        <span class="leading-7">拥有者: {{ detailData.user?.nickname }}</span>
      </div>
    </div>
    <div class="text-white mb-4">
      <h4 class="text-base mb-2">说明</h4>
      <p class="pl-1 text-sm text-gray-300 mb-2" v-if="tax === NORMAL_TAX">服务费：手续费{{ formatTax(tax) }}，版税{{ formatTax(tax) }}</p>
      <p class="pl-1 text-sm text-gray-300 mb-2" v-else>服务费：手续费<del>{{ formatTax(NORMAL_TAX) }}</del>{{ formatTax(tax) }}，版税{{ formatTax(NORMAL_TAX) }}<pear-tips class="ml-1" tip="拥有创世之星的用户享受20%的服务费减免特权" /></p>
    </div>
    <div class="text-white">
      <h4 class="text-base mb-2">价格设置</h4>
      <p class="pl-1 text-sm text-gray-300 mb-2">购买价格<span class="text-red-400 ml-4 align-bottom"><span class="text-xs">￥</span>{{ detailData.price }}</span></p>
      <div class="pl-1 text-sm text-gray-300 align-bottom flex items-center">
        <span>转售价格</span>
        <div class="flex flex-col ml-4 relative">
          <van-field
            :border="false"
            v-model="price"
            name="price"
            type="number"
            right-icon="jpy-light"
            icon-prefix="ph:currency"
            class="rounded flex-1"
            placeholder="请输入金额"
          />
          <span v-if="realCash" class="text-gray-300 text-xs absolute -bottom-5">预计实际可获得￥{{ realCash }}</span>
        </div>
      </div>
    </div>
    <div class="flex mt-10">
      <van-button block class="rounded-lg pear-color-button" :loading="loading" @click="onBeforeSubmit">立即转售</van-button>
    </div>
    <div class="text-white text-sm mt-3 flex">
      <van-checkbox v-model="checked" icon-size="1rem"></van-checkbox><span class="text-white ml-2">我知晓并同意<span class="text-blue-500" @click="goAgreement">《商家入驻协议》</span></span>
    </div>
    <typing-password-dialog
      title="请输入支付密码"
      :show="showPasswordDialog"
      @cancel="showPasswordDialog = false"
      @success="onValidOk"
      :validate="false"
    />
  </div>
</template>

<script lang="ts">
import { EIGHTY_DISCOUNT_TAX, NORMAL_TAX } from '@/constants/constants'
import { GoodPowerEnum, HTTP_CODE } from '@/constants/enums'
import { getFluxGoodDetail, putItOnMarket } from '@/services/goods.service'
import { useUserStore } from '@/stores/user.store'
import dayjs from 'dayjs'
import { Dialog, Toast } from 'vant'
import { computed, defineComponent, ref } from 'vue'
import { useRequest } from 'vue-request'
import { useRoute, useRouter } from 'vue-router'
const isPrice = (val: string) => /^\d+(\.\d{1,2})?$/.test(val)

export default defineComponent({
  name: 'PutOnMarket',
  setup() {
    const userStore = useUserStore()

    const route = useRoute()
    const router = useRouter()
    const { no } = route.query
    const { data: detailData } = useRequest(() => getFluxGoodDetail({ goodNo: no }), {
      initialData: {
        id: '',
        name: '',
        price: '',
        copies: 1,
        onShelf: true,
        cover: '',
        isSoldOut: 1
      },
      formatResult(data) {
        return data.data
      },
      onSuccess(data) {
        if (data.ownerUuid !== userStore.userData.id) {
          Toast('被禁止的访问')
          router.back()
        }
      }
    })

    const showPasswordDialog = ref(false)
    const checked = ref(false)
    const price = ref('')
    const createdAt = dayjs().format('YYYY-MM-DD HH:mm:ss')

    const tax = computed(() => {
      if (userStore.userData.powers.includes(GoodPowerEnum.DISCOUNT_BY_EIGHTY)) {
        return EIGHTY_DISCOUNT_TAX
      }
      return NORMAL_TAX
    })

    const realCash = computed(() => {
      if (isPrice(price.value)) {
        return (Number(price.value) * (1 - tax.value - NORMAL_TAX)).toFixed(2)
      }
      return ''
    })
    const onValidOk = (payKey: string) => {
      showPasswordDialog.value = false
      runSubmit({
        goodId: detailData.value.id,
        price: `${Number(price.value)}`,
        payKey
      })
    }
    const onBeforeSubmit = () => {
      if (Number(price.value) <= 0) {
        Toast('不能等于0')
        return
      }
      if (!isPrice(price.value)) {
        Toast('不正确价格格式')
        return
      }
      if (Number(price.value) >= 100000) {
        Toast('金额不能大于10万')
        return
      }
      if (!checked.value) {
        Toast('请勾选同意《商家入驻协议》')
        return
      }
      showPasswordDialog.value = true
    }
    const { loading, run: runSubmit } = useRequest(putItOnMarket, {
      manual: true,
      throttleInterval: 2000,
      throttleOptions: { leading: true, trailing: false },
      onSuccess(res: any) {
        if (res.code === HTTP_CODE.ERROR) {
          Dialog.alert({
            message: res.msg
          })
          return
        }
        Toast.success('转售成功！')
        router.back()
      }
    })

    const goAgreement = () => {
      router.push('/agreement/business')
    }

    const formatTax = (tax: number) => {
      return `${Number((tax * 100).toFixed(2))}%`
    }

    return {
      loading,
      showPasswordDialog,
      checked,
      detailData,
      price,
      tax,
      realCash,
      createdAt,
      formatTax,
      onBeforeSubmit,
      onValidOk,
      goAgreement,

      NORMAL_TAX
    }
  }
})
</script>

<style lang="less" scoped>
.count-down {
  @apply text-sm;
  color: inherit!important;
}
</style>
