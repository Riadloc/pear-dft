<template>
  <div class="my-invitation">
    <pear-navbar title="我的邀请" left-arrow />
    <div class="bg-card p-4">
      <p class="text-white flex items-center">我的邀请人数 <pear-tips class="ml-1" tip="仅记录已实名且绑定了银行卡的注册用户" size="1.3rem" /></p>
      <p class="text-white text-3xl mt-2">{{ list?.length || 0 }}</p>
    </div>
    <div class="bg-card mt-2" v-if="list.length">
      <van-cell title="邀请明细" class="bg-card" title-class="text-white"/>
      <van-cell title="账号" class="bg-card text-sm" value="注册时间" title-class="text-white" value-class="text-white"/>
      <van-cell
        v-for="(item) in list"
        :key="item.id"
        class="bg-card text-sm"
        title-class="text-gray-100"
        value-class="text-gray-100"
      >
        <template #title>{{ item.phone }}</template>
        <template #value>{{ formatTimezoneDate(item.createdAt, 'YYYY/MM/DD') }}</template>
      </van-cell>
    </div>
  </div>
</template>

<script lang="ts">
import { HTTP_CODE } from '@/constants/enums'
import { getMyInvitaions } from '@/services/user.service'
import { Toast } from 'vant'
import { computed, defineComponent } from 'vue'
import { useRequest } from 'vue-request'
import { formatTimezoneDate } from '@/constants/utils'

export default defineComponent({
  setup() {
    const { data, loading } = useRequest<any>(getMyInvitaions, {
      onSuccess(data: any) {
        if (data.code === HTTP_CODE.ERROR) {
          Toast.fail(data.msg)
        }
      }
    })

    const list = computed(() => data.value?.data || [])

    return {
      list,
      loading,

      formatTimezoneDate
    }
  }
})
</script>

<style lang="less" scoped>

</style>
