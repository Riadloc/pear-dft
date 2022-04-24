<template>
  <div :class="['card', 'overflow-hidden', 'bg-card', round && 'rounded-3xl']">
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
    <slot name="actions"></slot>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

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
    coverSizeClass: String
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
