<template>
  <div class="custom-setting justify-center">
    <pear-navbar title="合成中心" left-arrow />
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多"
      @load="onLoad"
      class="px-4 pt-4 text-white">
      <div
        v-for="item in goods"
        :key="item.id"
        class="card" @click="() => onClick(item)">
        <div class="card-bg absolute left-0 right-0 top-0 bottom-0 -z-1" :style="{ backgroundImage: `url(${item.good.cover})` }">
        </div>
        <pear-image class="w-36 h-36 border-2 border-light-900 rounded" :src="item.good.cover" />
        <div class="absolute top-0 left-0 p-4 text-white">
          <p class="text-lg"><span class="text-primary font-semibold">{{ item.good.name }}</span></p>
          <p class="text-sm text-gray-300">{{ item.good.name }} 合成通道</p>
        </div>
        <div class="text-sm absolute bottom-4 w-full text-center text-gray-300">
          <p>活动时间</p>
          <p>{{ getDateRange(item) }}</p>
        </div>
        <span :class="['status-badget', getConfig(item).color]">{{ getConfig(item).label }}</span>
      </div>
    </van-list>
  </div>
</template>

<script lang="ts">
import { getComposeList } from '@/services/goods.service'
import dayjs from 'dayjs'
import { computed, defineComponent, ref } from 'vue'
import { useLoadMore } from 'vue-request'
import { useRouter } from 'vue-router'
const STATUS_LIST = [
  {
    label: '敬请期待',
    color: 'bg-red-200'
  },
  {
    label: '进行中',
    color: 'bg-primary'
  },
  {
    label: '已结束',
    color: 'bg-gray-200'
  }
]

export default defineComponent({
  setup() {
    const router = useRouter()

    const finished = ref(false)
    const pageSize = ref(20)
    const pageNo = ref(0)
    const { loadingMore: loading, data, dataList, loadMore } = useLoadMore(() => getComposeList({
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
      pageNo.value += 1
      loadMore()
    }
    const goods = computed(() => dataList.value || [])
    const count = computed(() => data.value?.count || 0)

    const onClick = (item: any) => {
      if (dayjs().isBefore(item.start) || dayjs().isAfter(item.end)) {
        return
      }
      router.push({ name: 'ComposeLab', query: { id: item.id } })
    }
    const getDateRange = (item: any) => {
      const format = 'YYYY-MM-DD HH:mm:ss'
      return `${dayjs(item.start).format(format)} - ${dayjs(item.end).format(format)}`
    }
    const getConfig = (item: any) => {
      if (dayjs().isBefore(item.start)) {
        return STATUS_LIST[0]
      }
      if (dayjs().isAfter(item.end)) {
        return STATUS_LIST[2]
      }
      return STATUS_LIST[1]
    }

    return {
      onClick,
      getDateRange,
      getConfig,

      loading,
      finished,
      onLoad,
      goods,
      count
    }
  }
})
</script>
<style lang="less" scoped>
.card {
  @apply relative bg-card rounded overflow-hidden mt-4 flex justify-center items-center active:opacity-70 w-[90vw] h-[90vw];
  &-bg {
    background-repeat: no-repeat;
    background-size: cover;
    filter: opacity(0.4) blur(0.25rem);
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}
.status-badget {
  @apply absolute top-0 right-0 text-sm px-2 text-black rounded-bl;
}
</style>
