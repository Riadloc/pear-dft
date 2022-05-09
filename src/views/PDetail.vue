<template>
  <div class="pdetail">
    <van-nav-bar :border="false" fixed>
      <template #left>
        <van-icon class="back-icon" name="arrow-left" color="#fff" size="1.5rem" @click="onBack" />
      </template>
    </van-nav-bar>
    <div class="p-4">
      <div class="header">
        <pear-card
          class="mb-4"
          key="1"
          :data="data"
          :cover="data.cover"
          cover-size-class="card-large"
          round
          limit
          :name="data.name"
          :price="data.price"
          :amount="data.copies"
          :owner="data.user?.nickname"
          :is-sold-out="data.isSoldOut"
        >
          <template #actions v-if="showPayButton">
            <div class="flex gap-4 px-4 mb-4">
              <van-button type="warning" block disabled v-if="data.isSoldOut === 1">已售罄</van-button>
              <van-button type="success" block disabled v-else-if="!data.onShelf">敬请期待</van-button>
              <van-button type="warning" block @click="onCertify" v-else-if="store.userData.certified == 0">需要实名认证</van-button>
              <van-button type="primary" block @click="onPay" v-else-if="data.onShelf && store.userData.certified == 1">购买</van-button>
            </div>
          </template>
        </pear-card>
      </div>
      <div class="main">
        <div class="section">
          <h4 class="section-title">认证信息</h4>
          <div class="text-gray-300 text-sm">
            <div class="flex justify-between mt-2">
              <span>合约地址</span>
              <span class="text-blue-500" @click="goContract">{{ formatHex(data.contract) }}</span>
            </div>
            <div class="flex justify-between mt-2">
              <span>认证标识</span>
              <span class="text-blue-500" @click="goTxHash" v-if="data.hash">{{ formatHex(data.hash) }}</span>
              <span class="text-gray-100" v-else>上链确认中</span>
            </div>
            <div class="flex justify-between mt-2">
              <span>认证标准</span>
              <span class="text-gray-100">ERC-721</span>
            </div>
            <div class="flex justify-between mt-2">
              <span>认证网络</span>
              <span class="text-gray-100">Polygon</span>
            </div>
          </div>
        </div>
        <div class="section">
          <h4 class="section-title">藏品详情</h4>
          <p class="section-content">{{ data.description || '无' }}</p>
          <div>
            <pear-image
              v-for="picture in data.pictures"
              :key="picture"
              :src="picture"
              width="100%"
              size="w-full"
              class="rounded overflow-hidden mt-3"
            />
          </div>
        </div>
        <div class="section">
          <h4 class="section-title">购买须知</h4>
          <p class="section-content">{{ WEB_NAME }}中的数字藏品是虚拟数字商品，而非实物商品。因数字藏品的特殊性，一经购买成功，将不支持退换。数字藏品的知识产权或其他权益属发行方或权利人所有，除另行取得发行方或权利人授权外，您不得将数字藏品用于任何商业用途。请勿对数字藏品进行炒作、场外交易或任何非法方式进行使用。</p>
        </div>
      </div>
      <div class="footer"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useRequest } from 'vue-request'
import { getGoodDetail } from '@/services/goods.service'
import { PearCard } from '@/components'
import { WEB_NAME } from '@/assets/config'
import { checkCanCreateOrder } from '@/services/payment.service'
import { Dialog } from 'vant'
import { useUserStore } from '@/stores/user.store'
import { throttle } from 'lodash-es'
import { HTTP_CODE } from '@/constants/enums'

export default defineComponent({
  components: { PearCard },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useUserStore()

    const onBack = () => router.back()

    const goodNo = route.params.id as string
    const { data } = useRequest(() => getGoodDetail({ goodNo }), {
      initialData: {
        name: '',
        price: '',
        copies: 1,
        onShelf: false,
        cover: '',
        isSoldOut: 1
      },
      formatResult(data) {
        return data.data
      }
    })

    const qrcode = ref('')
    const onPay = throttle(async () => {
      const { name, id: goodId, price } = data.value
      const res = await checkCanCreateOrder({ goodId }) as any
      if (res.code === HTTP_CODE.ERROR) {
        Dialog.alert({
          message: res.msg
        })
      } else {
        router.push({
          name: 'PayPage',
          params: {
            name,
            goodId,
            price
          }
        })
      }
    }, 1000, {
      leading: true,
      trailing: false
    })
    const onCertify = () => {
      router.push('/certify')
    }

    const formatHex = (value = '') => {
      return value.slice(0, 6) + '...' + value.slice(-6)
    }
    const goContract = () => {
      window.open(`https://polygonscan.com/address/${data.value.contract}`)
    }
    const goTxHash = () => {
      window.open(`https://polygonscan.com/tx/${data.value.hash}`)
    }

    const showPayButton = computed(() => !goodNo.startsWith('F'))
    return {
      qrcode,
      onBack,
      onPay,
      onCertify,
      WEB_NAME,
      data,
      showPayButton,
      store,
      goContract,
      goTxHash,
      formatHex
    }
  }
})
</script>

<style lang="less" scoped>
.pdetail {
  .back-icon {
    background-color: rgba(0, 0, 0, .3);
    padding: 4px;
    border-radius: 50%;
  }
}
.header {
  // height: 20rem;
}
.section {
  @apply bg-neutral-800 rounded-lg my-4 p-4;
  &-title {
    @apply text-white text-lg;
  }
  &-content {
    @apply text-gray-300;
  }
}
</style>
