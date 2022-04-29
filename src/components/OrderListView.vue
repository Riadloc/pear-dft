<template>
  <van-list
    v-model:loading="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
    class="px-4"
  >
    <div v-for="item in goods" :key="item.id" class="flex mt-4 bg-card rounded overflow-hidden">
      <pear-image
        :thumbnail="50"
        :src="item.cover"
        :alt="item.name"
        size="card-base"
        class="rounded overflow-hidden"
      />
      <div class="flex flex-col px-4 justify-center relative flex-1">
        <h4 class="text-white text-base">{{ item.name }}</h4>
        <div class="tag inline-flex flex-row my-1 overflow-hidden">
          <span class="text-gray-800 text-xs bg-amber-200 text-center px-2 rounded-l">编号</span>
          <span class="text-amber-200 text-xs bg-gray-600 text-center px-2 rounded-r">{{ item.fluxGoods.serial }}</span>
        </div>
        <span class="text-gray-300">￥{{ item.fluxGoods.price }}</span>
        <van-popover
          v-if="item.status === OrderStatus.WAIT"
          v-model:show="item.show"
          :actions="actions"
          @select="(_action, index) => onSelect(item, index)"
          placement="bottom-end"
        >
          <template #reference>
            <van-button type="warning" plain class="absolute bottom-4 right-4" size="mini">更多</van-button>
          </template>
        </van-popover>
      </div>
    </div>
  </van-list>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue'
import { useLoadMore } from 'vue-request'
import { HTTP_CODE, OrderStatus } from '@/constants/enums'
import { getOrderList } from '@/services/order.service'
import { useRouter } from 'vue-router'
import { Dialog, Toast } from 'vant'
import { cancelPaymentOrder, checkPaymentOrder } from '@/services/payment.service'

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
    const { loadingMore: loading, data, dataList, loadMore, refresh } = useLoadMore(() => getOrderList({
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
      pageNo.value += 1
      loadMore()
    }
    const onRefresh = () => {
      pageNo.value = 1
      refresh()
      setTimeout(() => {
        finished.value = false
      }, 500)
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
    const cancel = (data: any) => {
      Dialog.confirm({
        title: '提示',
        message: '取消会关闭这个支付订单，确认取消本次购买？',
        confirmButtonText: '确定取消',
        cancelButtonText: '再考虑下'
      }).then(() => {
        cancelPaymentOrder({ tradeNo: data.orderNo })
        onRefresh()
      }).catch(() => {
        //
      })
    }

    const showPopover = ref(false)
    const actions = [
      { text: '继续支付' },
      { text: '取消订单' },
      { text: '检查状态' }
    ]
    const onSelect = async (item: any, index: number) => {
      if (index === 0) {
        purchase(item)
      } else if (index === 1) {
        cancel(item)
      } else if (index === 2) {
        const res: any = await checkPaymentOrder(item.orderNo)
        if (res.code !== HTTP_CODE.ERROR) {
          const { status } = res.data
          console.log(status)
          if (status === OrderStatus.WAIT) {
            Toast('订单当前状态：待支付')
          } else if (status === OrderStatus.TERMINATED || status === OrderStatus.CLOSED) {
            Toast({
              message: '订单当前状态：已关闭',
              onClose: () => {
                onRefresh()
              }
            })
          } else if (status === OrderStatus.PURCHASED) {
            Toast({
              message: '订单当前状态：已支付',
              onClose: () => {
                onRefresh()
              }
            })
          }
        }
      }
    }

    return {
      goods,
      count,
      finished,
      loading,
      onLoad,
      purchase,
      OrderStatus,

      showPopover,
      actions,
      onSelect
    }
  }
})
</script>

<style lang="less" scoped>

</style>
