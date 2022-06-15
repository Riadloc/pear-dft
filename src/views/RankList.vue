<template>
  <div class="rank-list">
    <pear-navbar fixed left-arrow />
    <div>
      <pear-image
        :src="cover"
        :alt="cover"
        width="100%"
      />
      <div class="cell flex">
        <span class="cell-td basis-1/3">排行</span>
        <span class="cell-td basis-1/3">昵称</span>
        <span class="cell-td basis-1/3" v-if="type === RankType.INVITATION">人数</span>
        <span class="cell-td basis-1/3" v-else>积分</span>
      </div>
      <template v-if="dataList.length">
        <div class="cell flex text-xs" v-for="(item, index) in dataList" :key="item.id">
          <span class="cell-td basis-1/3">{{ index + 1 }}</span>
          <span class="cell-td basis-1/3">{{ item.user_nickname }}</span>
          <span class="cell-td basis-1/3">{{ item.points }}</span>
        </div>
      </template>
      <div v-else class="text-center text-gray-400 mt-2">
        <span class="text-sm">暂时无人上榜</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { bucket } from '@/constants/constants'
import { HTTP_CODE, RankType } from '@/constants/enums'
import { getRankList } from '@/services/common.service'
import { Dialog } from 'vant'
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useRequest } from 'vue-request'
import { useRoute, useRouter } from 'vue-router'
export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()

    const cover = ref('')

    const { type } = route.query
    onMounted(() => {
      setCover(type as string)
      run({
        type
      })
    })
    const finished = ref(false)
    const { loading, data, run } = useRequest(getRankList, {
      manual: true,
      onSuccess(res: any) {
        if (res.code === HTTP_CODE.ERROR) {
          Dialog.alert({
            message: res.msg
          }).then(() => {
            router.back()
          })
        }
      },
      onError() {
        finished.value = true
      }
    })
    const setCover = (type: string) => {
      switch (Number(type)) {
        case RankType.CONSUME_DAY:
          cover.value = `${bucket}/consume_rank.jpg`
          break
        case RankType.CONSUME_ALL:
          cover.value = `${bucket}/consume_rank.jpg`
          break
        case RankType.INVITATION:
          cover.value = `${bucket}/invite_rank.jpg`
          break
      }
    }
    const dataList = computed(() => data.value?.data || [])

    return {
      cover,
      finished,
      loading,
      dataList,

      type: Number(type),
      RankType
    }
  }
})
</script>

<style lang="less" scoped>
.cell {
  @apply py-2 text-white text-sm;
  border-bottom: 0.06rem solid #666;
  &-td {
    text-align: center;
    @apply text-center text-white text-sm;
  }
}
</style>
