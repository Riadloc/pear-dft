<template>
  <div>
    <!-- <van-pull-refresh v-model="refreshing" @refresh="onRefresh"> -->
      <van-swipe
        class="my-swipe mb-4"
        :autoplay="5000"
        indicator-color="white"
      >
        <van-swipe-item class="my-swipe">
          <img src="../assets/banner1.jpg" alt="banner">
        </van-swipe-item>
        <!-- <van-swipe-item class="my-swipe">
          <img class="rounded-lg" src="../assets/banner1.jpg" alt="banner">
        </van-swipe-item> -->
      </van-swipe>
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        class="px-4"
      >
        <pear-card
          v-for="item in goods"
          :key="item.name"
          class="mb-4"
          @click="() => goToDetail(item)"
          :cover="item.cover"
          round
          limit
          :name="item.name"
          :price="item.price"
          :amount="item.copies"
          :owner="item.user?.nickname"
        />
      </van-list>
      <div class="fixed rounded-lg bg-black bg-opacity-80 bottom-chip" v-if="store.isLoggedIn && !store.userData.certified">
        <div class="text-white py-3 px-4 text-sm flex items-center justify-between">
          <span>请先完成实名认证再购买藏品</span>
          <van-button type="primary" size="mini" round class="px-2" @click="certify">实名认证</van-button>
        </div>
      </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { PearCard } from '@/components'
import { getGoodsList } from '@/services/goods.service'
import { useLoadMore } from 'vue-request'
import { useUserStore } from '@/stores/user.store'
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
      router.push({ name: 'Detail', params: { id: good.goodNo } })
    }

    const finished = ref(false)
    const pageSize = ref(10)
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
      finished.value = false
      refresh()
    }
    const onLoad = () => {
      pageNo.value = pageNo.value + 1
      loadMore()
    }
    const goods = computed(() => dataList.value || [])

    const certify = () => {
      router.push('/certify')
    }

    return {
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
</style>
