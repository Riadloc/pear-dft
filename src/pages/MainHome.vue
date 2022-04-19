<template>
  <div>
    <!-- <van-pull-refresh v-model="refreshing" @refresh="onRefresh"> -->
      <van-swipe
        class="my-swipe"
        :autoplay="3000"
        indicator-color="white"
      >
        <van-swipe-item class="my-swipe p-4">
          <img class="rounded-lg" src="../assets/banner1.jpg" alt="banner">
        </van-swipe-item>
        <van-swipe-item class="my-swipe p-4">
          <img class="rounded-lg" src="../assets/banner1.jpg" alt="banner">
        </van-swipe-item>
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
          owner="梨数字官方"
        />
      </van-list>
    <!-- </van-pull-refresh> -->
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { PearCard } from '@/components'
import { getGoodsList } from '@/services/goods.service'
import { useLoadMore } from 'vue-request'
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
    console.log(goods)
    return {
      active,
      goToDetail,
      goods,
      refreshing,
      onRefresh,
      finished,
      onLoad,
      loading
    }
  }
})
</script>
<style>
/* .my-swipe .van-swipe-item {
  height: 150px;
} */
</style>
