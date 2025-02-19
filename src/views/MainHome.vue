<template>
  <div class="main-home">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <div class="logo w-full">
        <span class="title">{{ title }}</span>
      </div>
      <van-swipe
        class="my-swipe rounded-2xl"
        :autoplay="5000"
        indicator-color="white"
      >
        <van-swipe-item v-for="item in banners" :key="item.id" @click="onClick(item.id)">
          <pear-image
            :src="item.uri"
            width="100%"
          />
        </van-swipe-item>
      </van-swipe>
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text=""
        @load="onLoad"
        class="px-4"
      >
        <pear-card
          v-for="item in goods"
          :key="item.name"
          :data="item"
          class="mt-4"
          @click="() => goToDetail(item)"
          :cover="item.cover"
          cover-size-class="card-large"
          round
          limit
          :name="item.name"
          :price="item.price"
          :amount="item.copies"
          :owner="item.user?.nickname"
          :is-sold-out="item.isSoldOut"
        />
      </van-list>
      <pear-registration />
      <div class="fixed rounded-lg bg-black bg-opacity-80 bottom-chip" v-if="store.isLoggedIn && !store.userData.certified">
        <div class="text-white py-3 px-4 text-sm flex items-center justify-between">
          <span>请先完成实名认证再购买藏品</span>
          <van-button size="mini" class="pear-green-button rounded-full px-2" @click="certify">实名认证</van-button>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { PearCard } from '@/components'
import { getGoodsList } from '@/services/goods.service'
import { useLoadMore } from 'vue-request'
import { useUserStore } from '@/stores/user.store'
import { bucket } from '@/constants/constants'
import { RankType } from '@/constants/enums'
// import { Toast } from 'vant'
// interface GoodItem {
//   name: string;
//   price: string;
//   amount: number;
//   owner: string;
//   cover: string;
// }

export default defineComponent({
  components: { PearCard },
  setup() {
    const active = ref(0)

    const router = useRouter()
    const store = useUserStore()
    const goToDetail = (good: any) => {
      router.push({ name: 'Detail', query: { id: good.goodNo } })
    }

    const finished = ref(false)
    const pageSize = ref(20)
    const pageNo = ref(0)
    const { loadingMore: loading, dataList, refreshing, loadMore, refresh } = useLoadMore(() => getGoodsList({
      pageSize: pageSize.value,
      pageNo: pageNo.value
    }), {
      manual: true,
      listKey: 'list',
      formatResult(data: any) {
        return data.data
      },
      onSuccess(data) {
        if (data.list.length < pageSize.value) {
          finished.value = true
        }
      },
      onError() {
        finished.value = true
      }
    })
    const onRefresh = () => {
      pageNo.value = 1
      refresh()
      setTimeout(() => {
        finished.value = false
      }, 500)
    }
    const onLoad = () => {
      pageNo.value = pageNo.value + 1
      loadMore()
    }
    const goods = computed(() => dataList.value || [])

    const certify = () => {
      router.push('/authorized')
    }

    const banners = [
      {
        uri: `${bucket}/consume_rank_banner.jpg`,
        id: 'consume'
      },
      {
        uri: `${bucket}/invite_rank_banner.jpg`,
        id: 'invite'
      }
    ]
    const onClick = (id: string) => {
      if (id === 'consume') {
        router.push({ name: 'RankList', query: { type: RankType.CONSUME_DAY } })
      } else if (id === 'invite') {
        router.push({ name: 'RankList', query: { type: RankType.INVITATION } })
      }
    }

    return {
      banners,
      onClick,

      title: import.meta.env.VITE_DOMAIN_NAME,
      active,
      goToDetail,
      goods,
      refreshing,
      onRefresh,
      finished,
      onLoad,
      certify,
      loading,
      store
    }
  }
})
</script>
<style lang="less" scoped>
  .bottom-chip {
    width: 90%;
    bottom: 4rem;
    left: 5%;
  }
  .my-swipe {
    width: calc(100vw - 2rem);
    margin: 0 auto;
  }
  .logo {
    @apply px-4 py-3 top-0 w-full mb-4 relative;
    // background-image: url(/az-subtle.png);
    &::before {
      content: "";
      position: absolute;
      height: 0.12rem;
      bottom: 0;
      width: 100%;
      left: 0;
      right: 0;
      background-image: linear-gradient(to right, white, #d977a7, #8272e1, white);
    }
  }
  .title {
    @apply text-white text-lg;
    font-family: BaiWuChangBold;
    letter-spacing: 0.2rem;
    font-weight: bold;
  }
  .logo_img {
    background-image: url(/logo.png);
    background-size: 4rem 2rem;
    background-repeat: no-repeat;
    background-position: 5% center;
  }
</style>
