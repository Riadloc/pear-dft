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
      <p class="pl-1 text-sm text-gray-300 mb-2">服务费：手续费3.5%，版税3.5%</p>
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
    <yidun-captcha v-model:show="showCaptch" @success="onValidOk"/>
  </div>
</template>

<script lang="ts">
import { HTTP_CODE } from '@/constants/enums'
import { getFluxGoodDetail, putItOnMarket } from '@/services/goods.service'
import dayjs from 'dayjs'
import { Dialog, Toast } from 'vant'
import { computed, defineComponent, ref } from 'vue'
import { useRequest } from 'vue-request'
import { useRoute, useRouter } from 'vue-router'
const isPrice = (val: string) => /^\d+(\.\d{1,2})?$/.test(val)

export default defineComponent({
  setup() {
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
      }
    })

    const showCaptch = ref(false)
    const price = ref('')
    const createdAt = dayjs().format('YYYY-MM-DD HH:mm:ss')

    const realCash = computed(() => {
      if (isPrice(price.value)) {
        return (Number(price.value) * 0.93).toFixed(2)
      }
      return ''
    })
    const onValidOk = () => {
      showCaptch.value = false
      runSubmit({
        goodId: detailData.value.id,
        price: price.value
      })
    }
    const onBeforeSubmit = () => {
      Dialog.alert({
        message: '功能正在维护中，暂时关闭'
      })

      // if (Number(price.value) <= 0) {
      //   Toast.fail('不能等于0')
      //   return
      // }
      // if (!isPrice(price.value)) {
      //   Toast.fail('不正确价格格式')
      //   return
      // }
      // if (Number(price.value) >= 100000) {
      //   Toast.fail('金额不能大于10万')
      //   return
      // }
      // showCaptch.value = true
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

    return {
      loading,
      showCaptch,
      detailData,
      price,
      realCash,
      createdAt,
      onBeforeSubmit,
      onValidOk
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
