<template>
  <div class="collect p-4 px-2">
    <div class="collect-header">
      <h3 class="text-white text-xl">我的藏品</h3>
    </div>
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text=""
      @load="onLoad"
      class="collect-list flex flex-wrap mt-8"
    >
      <pear-small-card
        v-for="item in goods"
        @click="() => goDetail(item)"
        :key="item.name"
        class="mb-4 mx-2 collect-card"
        :cover="item.cover"
        round
        limit
        :name="item.parentGood.name"
        :price="item.price"
        :serial="`${item.serial}/${item.parentGood.copies}`"
      />
    </van-list>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { PearSmallCard } from '@/components'
import { useLoadMore } from 'vue-request'
import { useRouter } from 'vue-router'
import { getMyGoodList } from '@/services/goods.service'

export default defineComponent({
  components: { PearSmallCard },
  setup() {
    const router = useRouter()

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

    const goDetail = (item: any) => {
      router.push({ name: 'Detail', params: { id: item.goodNo } })
    }

    return {
      goods,
      count,
      finished,
      loading,
      onLoad,
      goDetail
    }
  }
})
</script>

<style lang="less" scoped>
.collect-card {
  flex-basis: 46%;
  margin-left: 2%;
  margin-right: 2%;
}
</style>
