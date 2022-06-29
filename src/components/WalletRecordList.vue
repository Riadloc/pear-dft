<template>
  <div>
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多"
      @load="onLoad"
      class="px-4 text-white">
      <template v-if="dataList.length">
        <div
          v-for="item in dataList"
          :key="item.id"
          class="mt-3 bg-card text-gray-300 rounded-tl-full rounded-bl-full">
          <div class="flex h-16">
            <div
              class="w-16 h-full rounded-full text-center align-middle shadow-2xl border-[0.12rem] border-[#333]">
              <i
                :class="[
                  'iconfont',
                  'text-[2.5rem]',
                  getIcon(item.type, item.change),
                ]"></i>
            </div>
            <div class="flex flex-col p-2 pr-4 flex-1">
              <div class="flex justify-between text-sm">
                <span>{{ dateformat(item.createdAt) }} | {{ getTypeName(item.type) }}</span>
                <span :class="getStatusClassName(item.status)">{{ getStatusName(item.status) }}</span>
              </div>
              <div class="flex">
                <div class="flex flex-col justify-center flex-1 text-sm">
                  <div class="flex justify-between items-center">
                    <span class="font-bold text-amber-200 text-lg">{{
                      item.change
                    }}</span>
                    <div>
                      <van-button
                        plain
                        size="mini"
                        class="!text-gray-300"
                        v-if="
                          item.payInfo?.remark &&
                          [
                            PayOrderStatus.FAILED,
                            PayOrderStatus.DC_APPLYED_WAIT,
                            PayOrderStatus.DC_TRANSFERED,
                            PayOrderStatus.DC_APPLY_FAILED,
                          ].includes(item.status)
                        "
                        @click="() => onViewRemark(item)"
                        >查看备注</van-button
                      >
                      <van-button
                        plain
                        size="mini"
                        class="!text-gray-300"
                        v-if="
                          item.type === WalletRecordType.TOP_UP &&
                          item.status === PayOrderStatus.PENDING
                        "
                        @click="() => onPay(item)"
                        >继续支付</van-button
                      >
                      <van-button
                        plain
                        size="mini"
                        class="!text-gray-300"
                        v-else-if="
                          item.type === WalletRecordType.DRAW_CASH &&
                          [
                            PayOrderStatus.DC_APPLYED_WAIT,
                            PayOrderStatus.DC_TRANSFERED,
                            PayOrderStatus.DC_APPLY_FAILED,
                          ].includes(item.status)
                        "
                        @click="() => onDrawcash(item)"
                        >重试</van-button
                      >
                    </div>
                  </div>
                </div>
              </div>
              <!-- <div class="flex text-sm">
                <span>其他信息：{{ item.payInfo?.remark }}</span>
              </div> -->
            </div>
          </div>
          <!-- <div class="flex justify-between items-end"></div> -->
        </div>
      </template>
    </van-list>
    <typing-password-dialog
      title="请输入验证码"
      :show="showCodeDialog"
      @cancel="showCodeDialog = false"
      @success="onValidOk"
      :validate="false" />
    <pear-spinner :show="submitLoading" />
  </div>
</template>

<script lang="ts">
import { HTTP_CODE, WalletRecordType, PayOrderStatus } from '@/constants/enums'
import { formatTimezoneDate } from '@/constants/utils'
import router from '@/routes'
import {
  checkLianlianSms,
  continueTopup,
  getWalletRecords
} from '@/services/wallet.service'
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
    const {
      loadingMore: loading,
      dataList,
      loadMore
    } = useLoadMore(
      () =>
        getWalletRecords({
          pageSize: pageSize.value,
          pageNo: pageNo.value,
          type: props.type
        }),
      {
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
      }
    )
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
      const {
        txn_seqno: orderNo,
        total_amount: price,
        token
      } = payInfo.value.data
      runCheckSms({
        orderNo,
        price,
        token,
        code
      })
    }
    const {
      data: payInfo,
      loading: continueLoading,
      run: runContinueTopup
    } = useRequest(continueTopup, {
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
    const { loading: checkLoading, run: runCheckSms } = useRequest(
      checkLianlianSms,
      {
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
      }
    )

    const onDrawcash = (item: any) => {
      router.push({ name: 'DrawCashContinue', query: { recordId: item.id } })
    }
    const onViewRemark = (item: any) => {
      Dialog.alert({
        message: item.payInfo.remark
      })
    }

    const getStatusName = (status: number) => {
      switch (status) {
        case PayOrderStatus.PENDING:
          return '进行中'
        case PayOrderStatus.DC_TRANSFERED:
        case PayOrderStatus.DC_APPLY_FAILED:
        case PayOrderStatus.DC_APPLYED_WAIT:
          return '信息缺失'
        case PayOrderStatus.DC_APPLYED:
        case PayOrderStatus.DC_APPLYED_CHECKED:
          return '预付成功'
        case PayOrderStatus.SUCCESSED:
          return '完成'
        case PayOrderStatus.FAILED:
          return '关闭'
      }
    }
    const getStatusClassName = (status: number) => {
      switch (status) {
        case PayOrderStatus.PENDING:
          return 'text-yellow-400'
        case PayOrderStatus.DC_TRANSFERED:
        case PayOrderStatus.DC_APPLY_FAILED:
        case PayOrderStatus.DC_APPLYED_WAIT:
          return 'text-red-400'
        case PayOrderStatus.DC_APPLYED:
        case PayOrderStatus.DC_APPLYED_CHECKED:
          return 'text-green-400'
        case PayOrderStatus.SUCCESSED:
          return 'text-green-400'
        case PayOrderStatus.FAILED:
          return 'text-red-400'
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
    const getIcon = (type: WalletRecordType, change: number) => {
      switch (type) {
        case WalletRecordType.TRADE:
          return change > 0 ? 'icon-cunkuan' : 'icon-touzi-03'
        case WalletRecordType.TOP_UP:
          return 'icon-chongzhi'
        case WalletRecordType.DRAW_CASH:
          return 'icon-tixian'
        case WalletRecordType.APPLY_USER:
          return 'icon-zhuce'
        default:
          return ''
      }
    }

    const dateformat = (date: Date) => {
      return formatTimezoneDate(date, 'YYYY-MM-DD HH:mm')
    }

    const submitLoading = computed(
      () => continueLoading.value || checkLoading.value
    )

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
      onViewRemark,

      getStatusName,
      getTypeName,
      getStatusClassName,
      getIcon,
      dateformat,

      WalletRecordType,
      PayOrderStatus
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
