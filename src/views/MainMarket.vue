<template>
  <div class="market">
    <div class="shadow-lg pb-2 mb-4">
      <van-search
        readonly
        @touchstart.stop="showSearchScreen = true"
        shape="round"
         v-model="query"
        placeholder="请输入搜索关键词"
        background="transparent"
      />
      <filter-bar
        class="px-4"
        :options="options"
      />
    </div>
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
          :key="item.name"
          class="market-card mb-4 mx-2 flex-grow-0 flex-shrink-0"
          :cover="item.cover"
          round
          limit
          :name="item.parentGood.name"
          :price="item.price"
          :owner="item.user.nickname"
          :serial="`${item.serial}/${item.parentGood.copies}`"
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
import { computed, defineComponent, ref } from 'vue'
import { FilterBar, PearSmallCard, SearchScreen } from '@/components'
import { useLoadMore } from 'vue-request'
import { getMyGoodList } from '@/services/goods.service'

export default defineComponent({
  components: { FilterBar, PearSmallCard, SearchScreen },
  setup() {
    const showSearchScreen = ref(false)

    const query = ref('')
    const onKeyworkSelected = (value: string) => {
      console.log(value)
      query.value = value
    }
    const options = ref([
      {
        id: 'date',
        name: '时间'
      },
      {
        id: 'price',
        name: '价格'
      }
    ])

    const finished = ref(false)
    const pageSize = ref(10)
    const pageNo = ref(0)
    const { loadingMore: loading, data, dataList, loadMore } = useLoadMore(() => getMyGoodList({
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
    const onLoad = () => {
      pageNo.value = pageNo.value + 1
      loadMore()
    }
    const goods = computed(() => dataList.value || [])
    const count = computed(() => data.value?.count || 0)

    return {
      options,
      query,
      onKeyworkSelected,
      goods,
      count,
      finished,
      loading,
      onLoad,
      showSearchScreen
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
