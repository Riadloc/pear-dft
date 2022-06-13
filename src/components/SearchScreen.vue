<template>
  <div class="search-screen bg-paper fixed top-0 left-0 w-full h-full" v-if="show">
    <div class="pt-1 pb-2">
      <van-search
        shape="round" v-model="query"
        placeholder="请输入搜索关键词"
        background="transparent"
        show-action
        @update:model-value="onTyping"
        @cancel="onCancel"
      />
    </div>
    <div class="shadow-lg max-h-50 search-result px-4 overflow-y-auto" v-if="query">
      <van-list v-if="searchList.length" :loading="typeLoading" loading-text="搜索中...">
        <div v-for="item in searchList" :key="item.id" class="cell-item" @click="() => onSelect(item)">{{ item.name }}</div>
      </van-list>
      <div class="p-4" v-else>
        <span class="text-gray-300 text-sm" v-if="typeLoading">搜索中...</span>
        <span class="text-gray-300 text-sm" v-else>未搜索到相关信息</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { HTTP_CODE } from '@/constants/enums'
import { getMarketGoodList } from '@/services/goods.service'
import { throttle } from 'lodash-es'
import { Toast } from 'vant'
import { defineComponent, ref, watch } from 'vue'

interface ListItem {
  name: string;
  id: string;
}

export default defineComponent({
  emits: ['select', 'update:show'],
  props: {
    show: Boolean,
    defaultQuery: String
  },
  setup(props, context) {
    const query = ref('')

    const onSelect = (item: ListItem) => {
      context.emit('select', item.name)
      context.emit('update:show', false)
    }
    const onCancel = () => {
      context.emit('select', '')
      context.emit('update:show', false)
    }

    const typeLoading = ref(false)
    const searchList = ref<ListItem[]>([])
    const onTyping = () => {
      typeLoading.value = true
      _onTyping()
    }
    const _onTyping = throttle(async () => {
      if (query.value) {
        const res: any = await getMarketGoodList({
          pageNo: 1,
          pageSize: 50,
          keyword: query.value,
          short: 1
        })
        if (res.code === HTTP_CODE.ERROR) {
          Toast.fail(res.msg)
          searchList.value = []
        } else {
          searchList.value = res.data
        }
      } else {
        searchList.value = []
      }
      typeLoading.value = false
    }, 800, { leading: false, trailing: true })

    watch(() => props.show, (value) => {
      console.log(props.defaultQuery)
      if (value && props.defaultQuery) {
        query.value = props.defaultQuery
        _onTyping()
      }
    })

    return {
      query,
      onSelect,
      onCancel,

      typeLoading,
      searchList,
      onTyping
    }
  }
})
</script>

<style lang="less" scoped>
.cell-item {
  @apply h-10 leading-10 text-white text-sm;
  &:active {
    opacity: 0.7;
  }
}
.search-result {
  background-color: #373b3e;
}
</style>
