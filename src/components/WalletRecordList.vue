<template>
  <van-list
    v-model:loading="loading"
    :finished="finished"
    finished-text="暂无数据"
    @load="onLoad"
    class="px-4 pt-4 text-white"
  >
    <template v-if="dataList.length">
      <div class="cell flex text-sm">
        <span class="cell-td basis-1/4">交易金额</span>
        <span class="cell-td basis-1/4">状态</span>
        <span class="cell-td basis-1/4">时间</span>
        <span class="cell-td basis-1/4" v-if="type === 1">操作</span>
        <span class="cell-td basis-1/4" v-else>备注</span>
      </div>
      <div class="cell flex text-xs" v-for="item in dataList" :key="item.id">
        <span class="cell-td basis-1/4">{{ item.change }}</span>
        <span class="cell-td basis-1/4">{{ getStatusName(item.status) }}</span>
        <span class="cell-td basis-1/4">{{ dateformat(item.createdAt) }}</span>
        <span class="cell-td basis-1/4" v-if="type === 1">
          <span @click="() => onPay(item)" v-if="item.status === 0">继续支付</span>
        </span>
        <span class="cell-td basis-1/4" v-else>
          <span>{{ item.payInfo?.remark || '' }}</span>
        </span>
      </div>
    </template>
  </van-list>
</template>

<script lang="ts">
import { HTTP_CODE } from '@/constants/enums'
import { openLink } from '@/constants/utils'
import { getWalletRecords } from '@/services/wallet.service'
import dayjs from 'dayjs'
import { defineComponent, ref } from 'vue'
import { useLoadMore } from 'vue-request'

export default defineComponent({
  props: {
    type: Number
  },
  setup(props) {
    const finished = ref(false)
    const pageSize = ref(20)
    const pageNo = ref(0)
    const { loadingMore: loading, dataList, loadMore } = useLoadMore(() => getWalletRecords({
      pageSize: pageSize.value,
      pageNo: pageNo.value,
      type: props.type
    }), {
      manual: true,
      listKey: 'data',
      onSuccess(res: any) {
        if (res.code !== HTTP_CODE.ERROR) {
          finished.value = res.data.length < pageSize.value
        } else {
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
    const onPay = (item: any) => {
      openLink(item.payInfo.url)
    }

    const getStatusName = (status: number) => {
      switch (status) {
        case 0:
          return '进行中'
        case 1:
          return '完成'
        case 2:
          return '关闭'
      }
    }

    const dateformat = (date: Date) => {
      return dayjs(date).format('YYYY-MM-DD HH:mm')
    }

    return {
      loading,
      dataList,
      finished,
      onLoad,
      onPay,

      getStatusName,
      dateformat
    }
  }
})
</script>

<style lang="less" scoped>
.cell {
  @apply py-2;
  border-bottom: 0.06rem solid #666;
  &-td {
    text-align: center;
  }
}
.text-button {
  &:active {
    opacity: 6;
  }
}
</style>
