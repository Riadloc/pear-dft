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
              <van-button class="pear-gray-button" round block disabled v-if="data.isSoldOut === 1">已售罄</van-button>
              <van-button type="success" round block disabled v-else-if="!onShelf">敬请期待</van-button>
              <van-button type="warning" round block @click="onCertify" v-else-if="userStore.userData.certified == 0">需要实名认证</van-button>
              <van-button class="purchase-button pear-color-button overflow-hidden" round block @click="onBeforeBuy" v-else-if="onShelf && userStore.userData.certified == 1">
                <span>购买</span>
                <div v-if="userStore.userData.powers.includes(GoodPowerEnum.AHEAD_PURCHASE_ONE_HOUR)" class="badge absolute right-6 pt-3 -top-2 h-20 w-4 bg-black bg-opacity-20 text-white text-xs leading-3 rotate-45">优先购</div>
              </van-button>
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
          <p class="section-content text-sm">{{ WEB_NAME }}中的数字藏品是虚拟数字商品，而非实物商品。因数字藏品的特殊性，一经购买成功，将不支持退换。数字藏品的知识产权或其他权益属发行方或权利人所有，除另行取得发行方或权利人授权外，您不得将数字藏品用于任何商业用途。请勿对数字藏品进行炒作、场外交易或任何非法方式进行使用。</p>
        </div>
      </div>
      <div class="footer"></div>
    </div>
    <yidun-captcha v-model:show="showCaptch" @success="onValidOk"/>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useRequest } from 'vue-request'
import { getGoodDetail } from '@/services/goods.service'
import { PearCard } from '@/components'
import { WEB_NAME } from '@/assets/config'
import { createPaymentOrder } from '@/services/payment.service'
import { Dialog } from 'vant'
import { useUserStore } from '@/stores/user.store'
import { HTTP_CODE, GoodPowerEnum } from '@/constants/enums'
import { openLink } from '@/constants/utils'
import dayjs from 'dayjs'

export default defineComponent({
  components: { PearCard },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const userStore = useUserStore()
    const onBack = () => router.back()
    const goodNo = route.query.id as string

    const showCaptch = ref(false)

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

    const { run: createOrder } = useRequest(createPaymentOrder, {
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
    const onBeforeBuy = () => {
      if (!userStore.userData.isBindPayPassword) {
        Dialog.alert({
          message: '请先到个人中心设置支付密码'
        }).then(() => {
          router.push('/paySafety')
        })
        return
      }
      if (userStore.walletData.balance < data.value.price) {
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

    const onShelf = computed(() => {
      if (userStore.userData.powers.includes(GoodPowerEnum.AHEAD_PURCHASE_ONE_HOUR)) {
        console.log(data.value.shelfTime)
        console.log(dayjs(data.value.shelfTime).isBefore(dayjs().add(1, 'hour')))
        return data.value.shelfTime && dayjs(data.value.shelfTime).isBefore(dayjs().add(1, 'hour'))
      }
      return data.value.onShelf
    })

    const onCertify = () => {
      router.push('/certify')
    }

    const formatHex = (value = '') => {
      return value.slice(0, 6) + '...' + value.slice(-6)
    }
    const goContract = () => {
      openLink(`https://polygonscan.com/address/${data.value.contract}`)
    }
    const goTxHash = () => {
      openLink(`https://polygonscan.com/tx/${data.value.hash}`)
    }

    const showPayButton = computed(() => !goodNo.startsWith('F'))
    return {
      showCaptch,
      onBack,
      onCertify,
      WEB_NAME,
      onBeforeBuy,
      onValidOk,
      data,
      showPayButton,
      userStore,
      GoodPowerEnum,
      goContract,
      goTxHash,
      formatHex,

      onShelf
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
.badge {
  transform: rotate(30deg);
}
</style>
