<template>
  <div class="search-screen bg-paper fixed top-0 left-0 w-full h-full" v-if="show">
    <van-search
      shape="round" v-model="query"
      placeholder="请输入搜索关键词"
      background="transparent"
      show-action
      @cancel="onCancel"
    />
    <div class="shadow-lg max-h-40 search-result px-4 overflow-y-auto">
      <van-list finished-text="">
        <div class="cell-item" @click="onSelect">王昭君</div>
        <div class="cell-item">王昭君</div>
        <div class="cell-item">王昭君</div>
        <div class="cell-item">王昭君</div>
        <div class="cell-item">王昭君</div>
        <div class="cell-item">王昭君</div>
        <div class="cell-item">王昭君</div>
      </van-list>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
export default defineComponent({
  emits: ['select', 'update:show'],
  props: {
    show: Boolean,
    defaultQuery: String
  },
  setup(props, context) {
    const query = ref('')

    const onSelect = () => {
      context.emit('select', '王昭君')
      context.emit('update:show', false)
    }
    const onCancel = () => {
      context.emit('select', '')
      context.emit('update:show', false)
    }

    watch(() => props.show, (value) => {
      console.log(props.defaultQuery)
      if (value && props.defaultQuery) {
        query.value = props.defaultQuery
      }
    })

    return {
      query,
      onSelect,
      onCancel
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
