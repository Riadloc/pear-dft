<template>
<van-pull-refresh v-model="refreshing" @refresh="onRefresh">
  <van-list
    v-model:loading="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
    class="px-4"
  >
    <div
      v-for="item in goods"
      :key="item.id"
      class="flex flex-col mt-4 bg-card rounded text-gray-300 p-3">
      <div class="flex justify-between text-sm mb-2">
        <span>{{ formatDate(item.createdAt) }}</span>
        <span :class="statusNameClass">{{ statusName }}</span>
      </div>
      <div class="flex">
        <pear-image
          :thumbnail="50"
          :src="item.cover"
          :alt="item.name"
          size="card-base"
          class="rounded overflow-hidden"
        />
        <div class="flex flex-col pl-4 justify-center flex-1 text-sm">
          <div class="flex justify-between items-center leading-7">
            <h4>{{ item.name }}</h4>
            <span class="font-bold text-amber-200 text-lg">￥{{ item.good.price }}</span>
          </div>
          <!-- <span class="leading-7">卖家: 梨数字官方</span> -->
          <span class="leading-7 whitespace-nowrap">单据: {{ item.orderNo }}</span>
        </div>
      </div>
      <div class="flex justify-between items-end" v-if="status === OrderStatus.WAIT">
        <span class="text-xs">
          <template v-if="item.countDownTime > 0">
            支付倒计时：<van-count-down :time="item.countDownTime" format="mm分ss秒" class="count-down" @finish="item.countDownTime = 0" />
          </template>
        </span>
        <div class="leading-4">
          <van-button v-if="item.countDownTime > 0" round plain size="mini" class="!text-gray-300" @click="onSelect(item, 0)">继续支付</van-button>
          <van-button round plain size="mini" class="!text-gray-300" @click="onSelect(item, 1)">取消订单</van-button>
        </div>
      </div>
    </div>
  </van-list>
</van-pull-refresh>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue'
import { useLoadMore } from 'vue-request'
import { HTTP_CODE, OrderStatus } from '@/constants/enums'
import { getOrderList } from '@/services/order.service'
import { useRouter } from 'vue-router'
import { Dialog, Toast } from 'vant'
import { cancelPaymentOrder } from '@/services/payment.service'
import dayjs from 'dayjs'

export default defineComponent({
  props: {
    status: {
      type: [Number, Array] as PropType<OrderStatus | OrderStatus[]>,
      required: true
    },
    statusName: {
      type: String
    },
    statusNameClass: {
      type: String
    }
  },
  setup(props) {
    const router = useRouter()
    const finished = ref(false)
    const pageSize = ref(20)
    const pageNo = ref(0)
    const { loadingMore: loading, data, dataList, refreshing, loadMore, refresh } = useLoadMore(() => getOrderList({
      pageSize: pageSize.value,
      pageNo: pageNo.value,
      status: props.status
    }), {
      manual: true,
      listKey: 'list',
      formatResult(data: any) {
        const res = data.data
        if (props.status === OrderStatus.WAIT) {
          return {
            ...res,
            list: res.list?.map((item: any) => ({
              ...item,
              countDownTime: (dayjs(item.createdAt).add(5, 'minute').unix() - dayjs().unix()) * 1000
            }))
          }
        }
        return res
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
      router.push({ name: 'OrderDetail', query: { id: data.id, isSecond: data.soure } })
    }
    const cancel = (data: any) => {
      Dialog.confirm({
        title: '提示',
        message: '取消会关闭这个支付订单，确认取消？',
        confirmButtonText: '确定取消',
        cancelButtonText: '再考虑下'
      }).then(() => {
        cancelPaymentOrder({ tradeNo: data.orderNo })
          .then((res: any) => {
            if (res.code === HTTP_CODE.ERROR) {
              Toast(res.msg)
            } else {
              onRefresh()
            }
          })
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
      }
    }

    return {
      goods,
      count,
      finished,
      loading,
      refreshing,
      onLoad,
      onRefresh,
      purchase,
      OrderStatus,

      showPopover,
      actions,
      onSelect
    }
  },
  methods: {
    formatDate(date: Date) {
      return dayjs(date).format('YY-MM-DD HH:mm:ss')
    }
  }
})
</script>

<style lang="less" scoped>
.count-down {
  color: var(--van-orange)!important;
  font-size: inherit!important;
  display: inline-block;
}
</style>
