<template>
  <div>
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
          <span class="cell-td basis-1/4" v-if="type === WalletRecordType.ALL">类型</span>
          <span class="cell-td basis-1/4" v-else-if="[WalletRecordType.TOP_UP, WalletRecordType.DRAW_CASH].includes(type as number)">操作</span>
          <span class="cell-td basis-1/4" v-else>备注</span>
        </div>
        <div class="cell flex text-xs" v-for="item in dataList" :key="item.id">
          <span class="cell-td basis-1/4">{{ item.change }}</span>
          <span class="cell-td basis-1/4">{{ getStatusName(item.status) }}</span>
          <span class="cell-td basis-1/4">{{ dateformat(item.createdAt) }}</span>
          <span class="cell-td basis-1/4" v-if="type === WalletRecordType.ALL">{{ getTypeName(item.type) }}</span>
          <span class="cell-td basis-1/4" v-else-if="type === WalletRecordType.TOP_UP">
            <span @click="() => onPay(item)" v-if="item.status === 0">继续支付</span>
          </span>
          <span class="cell-td basis-1/4" v-else-if="type === WalletRecordType.DRAW_CASH">
            <span @click="() => onDrawcash(item)" v-if="[3,5].includes(item.status)">重试</span>
          </span>
          <span class="cell-td basis-1/4" v-else>
            <span>{{ item.payInfo?.remark || '' }}</span>
          </span>
        </div>
        <!-- <div v-for="item in dataList" :key="item.id" class="flex relative">
          <p>￥{{ item.change }}</p>
          <p>{{ getTypeName(item.type) }}</p>
          <p>{{ getStatusName(item.status) }}</p>
          <p>{{ dateformat(item.createdAt) }}</p>
          <div>
            <div class="leading-4">
              <van-button round plain size="mini" class="!text-gray-300">取消订单</van-button>
            </div>
          </div>
        </div> -->
      </template>
    </van-list>
    <typing-password-dialog
      title="请输入验证码"
      :show="showCodeDialog"
      @cancel="showCodeDialog = false"
      @success="onValidOk"
      :validate="false"
    />
    <pear-spinner :show="submitLoading" />
  </div>
</template>

<script lang="ts">
import { HTTP_CODE, WalletRecordType } from '@/constants/enums'
import { formatTimezoneDate } from '@/constants/utils'
import router from '@/routes'
import { checkLianlianSms, continueTopup, getWalletRecords } from '@/services/wallet.service'
import { Dialog } from 'vant'
import { computed, defineComponent, ref } from 'vue'
import { useLoadMore, useRequest } from 'vue-request'

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

    const showCodeDialog = ref(false)
    const onPay = (item: any) => {
      runContinueTopup({
        orderId: item.id
      })
    }
    const onValidOk = (code: string) => {
      const { txn_seqno: orderNo, total_amount: price, token } = payInfo.value.data
      runCheckSms({
        orderNo,
        price,
        token,
        code
      })
    }
    const { data: payInfo, loading: continueLoading, run: runContinueTopup } = useRequest(continueTopup, {
      manual: true,
      throttleInterval: 2000,
      throttleOptions: { leading: true, trailing: false },
      onSuccess(res: any) {
        if (res.code === HTTP_CODE.ERROR) {
          Dialog.alert({
            message: res.msg
          })
          return
        }
        showCodeDialog.value = true
      }
    })
    const { loading: checkLoading, run: runCheckSms } = useRequest(checkLianlianSms, {
      manual: true,
      throttleInterval: 2000,
      throttleOptions: { leading: true, trailing: false },
      onSuccess(res: any) {
        if (res.code === HTTP_CODE.ERROR) {
          Dialog.alert({
            message: res.msg
          })
          return
        }
        showCodeDialog.value = false
        Dialog.alert({
          message: '支付成功'
        }).then(() => {
          router.back()
        })
      }
    })

    const onDrawcash = (item: any) => {
      router.push({ name: 'DrawCashContinue', query: { recordId: item.id } })
    }

    const getStatusName = (status: number) => {
      switch (status) {
        case 0:
        case 3:
        case 4:
          return '进行中'
        case 1:
          return '完成'
        case 2:
          return '关闭'
        case 5:
          return '失败'
      }
    }
    const getTypeName = (type: WalletRecordType) => {
      switch (type) {
        case WalletRecordType.TRADE:
          return '交易'
        case WalletRecordType.TOP_UP:
          return '充值'
        case WalletRecordType.DRAW_CASH:
          return '提现'
        case WalletRecordType.APPLY_USER:
          return '开户'
        default:
          return ''
      }
    }

    const dateformat = (date: Date) => {
      return formatTimezoneDate(date, 'YYYY-MM-DD HH:mm')
    }

    const submitLoading = computed(() => continueLoading.value || checkLoading.value)

    return {
      loading,
      submitLoading,
      dataList,
      finished,
      onLoad,
      onPay,
      onDrawcash,
      showCodeDialog,
      onValidOk,

      getStatusName,
      getTypeName,
      dateformat,

      WalletRecordType
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
