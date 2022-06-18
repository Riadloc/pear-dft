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
          :price="fromView === 'market' ? data.marketPrice : data.price"
          :amount="`# ${data.serial} / ${data.copies}`"
          :owner="data.user?.nickname"
          is-flux
        >
          <template #actions>
            <div class="flex px-4 mb-4">
              <template v-if="data.ownerUuid === userStore.userData.id">
                <template v-if="fromView === 'collect'">
                  <van-button v-if="data.status === 0" class="pear-color-button" block @click="onTransfer">转售</van-button>
                  <van-button v-else class="pear-danger-button" block @click="onTakeOff">下架</van-button>
                </template>
              </template>
              <template v-else-if="fromView === 'market'">
                <van-button class="pear-gray-button" block disabled v-if="data.status === 0">已售罄</van-button>
                <van-button type="warning" block @click="onCertify" v-else-if="userStore.userData.certified == 0">需要实名认证</van-button>
                <van-button class="pear-color-button" block @click="showCaptch = true" v-else>立即购买</van-button>
              </template>
              <!-- <van-button class="pear-color-button" round block @click="showCaptch = true">立即购买</van-button> -->
            </div>
          </template>
        </pear-card>
      </div>
      <div class="main">
        <div class="section">
          <h4 class="section-title">认证信息</h4>
          <div class="text-gray-300 text-sm">
            <div class="flex justify-between mt-2">
              <span>认证标识</span>
              <span class="text-blue-500" @click="goTxHash" v-if="data.hash">{{ formatHex(data.hash) }}</span>
              <span class="text-gray-100" v-else>上链确认中</span>
            </div>
          </div>
        </div>
        <div class="section">
          <h4 class="section-title mb-1">藏品详情</h4>
          <p class="section-content text-sm">{{ data.description || '无' }}</p>
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
          <h4 class="section-title mb-1">购买须知</h4>
          <p class="section-content text-sm">{{ title }}中的数字藏品是虚拟数字商品，而非实物商品。因数字藏品的特殊性，一经购买成功，将不支持退换。数字藏品的知识产权或其他权益属发行方或权利人所有，除另行取得发行方或权利人授权外，您不得将数字藏品用于任何商业用途。请勿对数字藏品进行炒作、场外交易或任何非法方式进行使用。</p>
        </div>
      </div>
      <div class="footer"></div>
    </div>
    <yidun-captcha v-model:show="showCaptch" @success="onValidOk"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useRequest } from 'vue-request'
import { getFluxGoodDetail, putItOffMarket } from '@/services/goods.service'
import { PearCard } from '@/components'
import { useUserStore } from '@/stores/user.store'
import { createSecondaryPaymentOrder } from '@/services/payment.service'
import { HTTP_CODE } from '@/constants/enums'
import { Dialog, Toast } from 'vant'
// import { openLink } from '@/constants/utils'

export default defineComponent({
  components: { PearCard },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const userStore = useUserStore()
    const onBack = () => router.back()

    const showCaptch = ref(false)
    const { id: goodNo, from: fromView } = route.query
    const { data, run: getDetail } = useRequest(() => getFluxGoodDetail({ goodNo }), {
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

    const { run: createOrder } = useRequest(createSecondaryPaymentOrder, {
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
        router.push({ name: 'OrderDetail', query: { id: res.data, isSecond: 1 } })
      }
    })

    const qrcode = ref('')
    const onTransfer = () => {
      router.push({ name: 'PutOnMarket', query: { no: goodNo } })
    }
    const onCertify = () => {
      router.push('/authorized')
    }
    const onTakeOff = () => {
      Dialog.confirm({
        message: '确认下架藏品？'
      })
        .then(async () => {
          const res: any = await putItOffMarket({ goodId: data.value.id })
          if (res.code === HTTP_CODE.ERROR) {
            Dialog.alert({
              message: res.msg
            })
            return
          }
          getDetail()
          Toast.success('下架成功！')
        })
    }
    const onBeforeBuy = () => {
      if (!userStore.userData.isBindPayPassword) {
        Dialog.alert({
          message: '请先到个人中心设置支付密码'
        }).then(() => {
          router.push('/paySafety')
        })
        return
      }
      if (fromView === 'market' && userStore.walletData.balance < data.value.marketPrice) {
        Dialog.alert({
          message: '余额不足，请先充值'
        })
        return
      }
      showCaptch.value = true
    }
    const onValidOk = () => {
      showCaptch.value = false
      createOrder({
        goodId: data.value.id
      })
    }

    const formatHex = (value = '') => {
      return value.slice(0, 6) + '...' + value.slice(-6)
    }
    const goContract = () => {
      // openLink(`https://polygonscan.com/address/${data.value.contract}`)
    }
    const goTxHash = () => {
      // openLink(`https://polygonscan.com/tx/${data.value.hash}`)
    }

    return {
      title: import.meta.env.VITE_DOMAIN_NAME,
      qrcode,
      onBack,
      onTransfer,
      onCertify,
      onTakeOff,
      data,
      userStore,
      goContract,
      goTxHash,
      formatHex,
      fromView,
      showCaptch,
      onBeforeBuy,
      onValidOk
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
  @apply bg-card rounded-lg my-4 p-4;
  &-title {
    @apply text-white;
    position: relative;
    padding-left: 0.8rem;
    line-height: 1;
    margin-bottom: 0.8rem;
    &::before {
      position: absolute;
      left: 0;
      content: '';
      width: 0.2rem;
      height: 100%;
      background: #fff;
      opacity: .9;
      border: 0.1rem solid #fff;
      box-sizing: border-box;
      box-shadow: -0.1rem 0 0 #ce5a6d, 0.1rem 0 0 #31C17B;
    }
  }
  &-content {
    @apply text-gray-300;
  }
}
</style>
