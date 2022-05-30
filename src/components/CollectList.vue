<template>
  <div class="collect-list">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text=""
      @load="onLoad"
      class="flex flex-wrap"
    >
      <div
        v-for="item in goods"
        :key="item.serial"
        class="relative flex flex-col pb-2 pt-5 px-4 bg-paper mr-4 mb-4 text-right rounded-md active:bg-opacity-70"
        @click="() => onClick(item)"
      >
        <span class="text-xs leading-5 text-gray-300">#{{ item.serial }}/{{ item.copies }}</span>
        <span class="font-semibold leading-5">￥{{ item.price }}</span>
        <span class="absolute top-0 right-0 text-xs px-2 bg-red-200 text-black rounded-bl-lg" v-if="item.status !== 0">转售中</span>
        <span class="absolute top-0 right-0 text-xs px-2 bg-green-200 text-black rounded-bl-lg" v-else>已拥有</span>
      </div>
    </van-list>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useLoadMore } from 'vue-request'
import { getMyGoodSnsList } from '@/services/goods.service'
import { useRouter } from 'vue-router'

export default defineComponent({
  props: {
    id: String
  },
  setup(props) {
    const router = useRouter()

    const finished = ref(false)
    const pageSize = ref(20)
    const pageNo = ref(0)
    const { loadingMore: loading, data, dataList, loadMore } = useLoadMore(() => getMyGoodSnsList({
      goodId: props.id,
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
      router.push({ name: 'SecondaryDetail', query: { id: item.goodNo, from: 'collect' } })
    }

    return {
      loading,
      goods,
      count,
      finished,
      onLoad,
      onClick
    }
  }
})
</script>

<style lang="less" scoped>
.collect-list {
  max-height: 10rem;
  min-height: 4rem;
  @apply p-4;
}
</style>
