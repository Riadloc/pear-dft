<template>
  <van-list
    v-model:loading="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
    class="px-4"
  >
    <div v-for="item in goods" :key="item.id" class="flex my-4 bg-card rounded overflow-hidden">
      <van-image
        width="90"
        height="90"
        :src="item.cover"
        class="rounded overflow-hidden"
      >
        <template v-slot:loading>
          <van-loading type="spinner" size="20" />
        </template>
      </van-image>
      <div class="flex flex-col px-4 justify-center relative flex-1">
        <h4 class="text-white text-base">{{ item.name }}</h4>
        <div class="tag inline-flex flex-row my-1 overflow-hidden">
          <span class="text-gray-800 text-xs bg-amber-200 text-center px-2">编号</span>
          <span class="text-amber-200 text-xs bg-gray-600 text-center px-2">{{ item.fluxGoods.serial }}</span>
        </div>
        <span class="text-gray-300">￥{{ item.fluxGoods.price }}</span>
        <van-button
          v-if="item.status === OrderStatus.WAIT"
          type="warning"
          size="mini"
          plain
          class="absolute bottom-4 right-4"
          @click="() => purchase(item)"
        >
          继续支付
        </van-button>
      </div>
    </div>
  </van-list>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue'
import { useLoadMore } from 'vue-request'
import { OrderStatus } from '@/constants/enums'
import { getOrderList } from '@/services/order.service'
import { useRouter } from 'vue-router'

export default defineComponent({
  props: {
    status: {
      type: Number as PropType<OrderStatus>,
      required: true
    }
  },
  setup(props) {
    const router = useRouter()
    const finished = ref(false)
    const pageSize = ref(10)
    const pageNo = ref(0)
    const { loadingMore: loading, data, dataList, loadMore } = useLoadMore(() => getOrderList({
      pageSize: pageSize.value,
      pageNo: pageNo.value,
      status: props.status
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

    const purchase = (data: any) => {
      router.push({
        name: 'PayPage',
        params: {
          name: data.name,
          goodId: data.fluxGoods.goodId,
          price: data.fluxGoods.price,
          orderId: data.id
        }
      })
    }

    return {
      goods,
      count,
      finished,
      loading,
      onLoad,
      purchase,
      OrderStatus
    }
  }
})
</script>

<style lang="less" scoped>

</style>
