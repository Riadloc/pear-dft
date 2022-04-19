<template>
  <div :class="['card', 'overflow-hidden', 'bg-neutral-800', round && 'rounded-lg']">
    <van-image
      width="100%"
      :src="cover"
      class="rounded overflow-hidden"
    >
      <template v-slot:loading>
        <van-loading type="spinner" size="20" />
      </template>
    </van-image>
    <div class="pt-2 px-4 pb-2 relative">
      <div>
        <span class="text-2xl text-white">{{ name }}</span>
      </div>
      <div class="tag rounded w-28 flex flex-row my-2 overflow-hidden" v-if="amount">
        <span v-if="limit" class="text-gray-800 text-sm flex-1 bg-amber-200 text-center">限量</span>
        <span class="text-amber-200 text-sm flex-1 bg-gray-600 text-center">{{ amount }}份</span>
      </div>
      <div class="flex flex-row justify-between">
        <div class="text-gray-300">{{ owner }}</div>
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
    price: String
  }
})
</script>
<style lang="ts">
  //
</style>
<style lang="less" scoped>
  .card {
    .card-image {
      width: 100%;
    }
  }
</style>
