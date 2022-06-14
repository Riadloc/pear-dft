<template>
  <div class="market">
    <van-sticky>
      <div class="shadow-lg bg-paper pt-1 pb-2 mb-4">
        <van-search
          readonly
          @touchstart.stop="showSearchScreen = true"
          shape="round"
          v-model="query"
          placeholder="请输入搜索关键词"
          background="transparent"
        />
        <filter-bar
          ref="filterBar"
          class="px-4"
          :options="options"
          @change="onFilterChange"
        />
      </div>
    </van-sticky>
    <div class="px-2">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text=""
        @load="onLoad"
        class="collect-list flex flex-wrap"
      >
        <pear-small-card
          v-for="item in goods"
          :key="item.id"
          @click="() => goDetail(item)"
          class="market-card mb-4 mx-2 flex-grow-0 flex-shrink-0"
          :cover="item.cover"
          round
          limit
          :name="item.parentGood?.name"
          :price="item.marketPrice"
          :owner="item.user?.nickname"
          :serial="`${item.serial}/${item.parentGood?.copies}`"
          :is-purchasing="item.status === 2"
        />
      </van-list>
    </div>
    <search-screen
      v-model:show="showSearchScreen"
      @select="onKeyworkSelected"
      :default-query="query"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue'
import { FilterBar, PearSmallCard, SearchScreen } from '@/components'
import { useLoadMore } from 'vue-request'
import { getMarketGoodList } from '@/services/goods.service'
import { HTTP_CODE, OrderEnum } from '@/constants/enums'
import { useRouter } from 'vue-router'
import { Dialog } from 'vant'
const options = [
  {
    id: 'date',
    name: '时间'
  },
  {
    id: 'price',
    name: '价格'
  }
]

export default defineComponent({
  components: { FilterBar, PearSmallCard, SearchScreen },
  setup() {
    const router = useRouter()

    const showSearchScreen = ref(false)
    const query = ref('')
    const filterBar = ref()
    const sortObj = reactive({
      id: '',
      value: OrderEnum.DESC
    })
    const onKeyworkSelected = (value: string) => {
      query.value = value
      if (!value) {
        filterBar.value?.reset()
      }
      onRefresh()
    }
    const onFilterChange = (data: { id: string, value: OrderEnum, selected: string }) => {
      if (data.id) {
        sortObj.id = `${data.id}Sort`
        sortObj.value = data.value
      }
      if (data.selected !== undefined) {
        query.value = data.selected
      }
      onRefresh()
    }

    const finished = ref(false)
    const pageSize = ref(20)
    const pageNo = ref(0)
    const { loadingMore, data, dataList, loadMore, refresh, refreshing } = useLoadMore(() => getMarketGoodList({
      pageSize: pageSize.value,
      pageNo: pageNo.value,
      keyword: query.value,
      ...(sortObj.id
        ? {
            [sortObj.id]: sortObj.value
          }
        : {})
    }), {
      manual: true,
      listKey: 'data',
      onSuccess(res: any) {
        if (res.code === HTTP_CODE.ERROR) {
          Dialog.alert({
            message: res.msg
          })
          finished.value = true
          return
        }
        if (res.data.length < pageSize.value) {
          finished.value = true
        }
      },
      onError() {
        finished.value = true
      }
    })
    const onLoad = () => {
      pageNo.value = pageNo.value + 1
      loadMore()
    }
    const onRefresh = () => {
      pageNo.value = 1
      refresh()
      // setTimeout(() => {
      //   finished.value = false
      // }, 500)
    }
    const goods = computed(() => dataList.value || [])
    const count = computed(() => data.value?.count || 0)
    const loading = computed(() => refreshing.value || loadingMore.value)

    const goDetail = (item: any) => {
      router.push({ name: 'SecondaryDetail', query: { id: item.goodNo, from: 'market' } })
    }

    return {
      options,
      query,
      filterBar,
      onKeyworkSelected,
      onFilterChange,
      goods,
      count,
      finished,
      loading,
      onLoad,
      onRefresh,
      showSearchScreen,

      goDetail
    }
  }
})
</script>

<style lang="less" scoped>
.market-card {
  flex-basis: 46%;
  margin-left: 2%;
  margin-right: 2%;
}
</style>
