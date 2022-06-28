<template>
  <div class="collect">
    <van-sticky>
      <div class="px-4 py-2 bg-paper">
        <h3 class="text-white text-lg">我的藏品</h3>
      </div>
    </van-sticky>
    <div class="pb-4 px-2">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text=""
        @load="onLoad"
        class="collect-list flex flex-wrap"
      >
        <pear-collect-card
          v-for="item in goods"
          @click="() => onClick(item)"
          :key="item.name"
          class="mb-4 mx-2 collect-card"
          :cover="item.cover"
          round
          limit
          :name="item.name"
          :count="item.count"
        />
      </van-list>
    </div>
    <van-action-sheet v-model:show="sheet.show" :title="`${sheet.title} / 共${sheet.count}个`" @close="onClose">
      <collect-list v-if="sheet.goodId" :id="sheet.goodId" />
    </van-action-sheet>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue'
import { PearCollectCard, CollectList } from '@/components'
import { useLoadMore } from 'vue-request'
import { getMyGoodList } from '@/services/goods.service'

export default defineComponent({
  components: { PearCollectCard, CollectList },
  setup() {
    const sheet = reactive({
      show: false,
      title: '',
      count: 0,
      goodId: ''
    })

    const finished = ref(false)
    const pageSize = ref(20)
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

    const onClick = (item: any) => {
      sheet.show = true
      sheet.title = item.name
      sheet.goodId = item.id
      sheet.count = item.count
    }
    const onClose = () => {
      sheet.title = ''
      sheet.goodId = ''
      sheet.count = 0
    }

    return {
      sheet,

      goods,
      count,
      finished,
      loading,
      onLoad,
      onClick,
      onClose
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
