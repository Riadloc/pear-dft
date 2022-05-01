<template>
  <div :class="['card', 'overflow-hidden', 'bg-card', round && 'rounded-3xl', 'relative']">
    <pear-image
      :src="cover"
      :alt="`${name}`"
      width="100%"
      :size="coverSizeClass"
      class="rounded-3xl overflow-hidden"
    />
    <div class="py-1 pb-3 px-4 relative">
      <div>
        <span class="text-lg text-white font-semibold">{{ name }}</span>
      </div>
      <div class="tag rounded-sm inline-flex flex-row my-1.5 overflow-hidden" v-if="amount">
        <span v-if="limit" class="text-gray-800 text-xs bg-amber-200 text-center px-2">限量</span>
        <span class="text-xs text-center px-2 text-amber-200 bg-gray-600">{{ amount }}份</span>
      </div>
      <div class="flex flex-row justify-between">
        <div class="text-gray-300 text-xs">{{ owner }}</div>
      </div>
      <div class="text-white text-2xl absolute bottom-6 right-4">￥{{ price }}</div>
    </div>
    <div class="absolute left-4 top-4 bg-black bg-opacity-80 px-2 py-1 rounded-full leading-4" v-if="isSoldOut === 1">
      <span class="text-gray-400 text-xs">已售罄</span>
    </div>
    <div class="absolute left-4 top-4 bg-black bg-opacity-80 px-2 py-1 rounded-full leading-4" v-else-if="!data?.onShelf">
      <span class="text-green-500 text-xs">{{ formatDate(data?.shelfTime) }} 开售</span>
    </div>
    <slot name="actions"></slot>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import dayjs from 'dayjs'
interface Data {
  onShelf: boolean;
  shelfTime: Date;
}

export default defineComponent({
  props: {
    round: {
      type: Boolean,
      default: false
    },
    name: String,
    cover: String,
    limit: {
      type: Boolean,
      default: false
    },
    amount: Number,
    owner: String,
    price: String,
    coverSizeClass: String,
    isSoldOut: Number,
    data: {
      type: Object as PropType<Data>
    }
  },
  methods: {
    formatDate(date: Date) {
      return dayjs(date).format('MM-DD HH:mm')
    }
  }
})
</script>
<style lang="ts">
  //
</style>
<style lang="less" scoped>
  .card {
    background-image: url(/escheresque-dark.png);
    .card-image {
      width: 100%;
    }
  }
</style>
