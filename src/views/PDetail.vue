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
              <van-button type="warning" block disabled v-if="data.isSoldOut">已售罄</van-button>
              <van-button type="primary" block @click="onPay" v-else-if="store.userData.certified">购买</van-button>
              <van-button type="warning" block @click="onCertify" v-else>需要实名认证</van-button>
            </div>
          </template>
        </pear-card>
      </div>
      <div class="main">
        <div class="section">
          <h4 class="section-title">藏品详情</h4>
          <p class="section-content">{{ data.description || '无' }}</p>
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
        cover: '',
        isSoldOut: false
      },
      formatResult(data) {
        return data.data
      }
    })

    const qrcode = ref('')
    const onPay = async () => {
      const { name, id: goodId, price } = data.value
      const res = await checkCanCreateOrder({ goodId }) as any
      if (res.code === -1) {
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
    }
    const onCertify = () => {
      router.push('/certify')
    }

    const showPayButton = computed(() => !data.value?.isSoldOut && !goodNo.startsWith('F'))
    return {
      qrcode,
      onBack,
      onPay,
      onCertify,
      WEB_NAME,
      data,
      showPayButton,
      store
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
