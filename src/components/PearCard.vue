<template>
  <div :class="['card', 'overflow-hidden', 'bg-card', round && 'rounded-2xl']">
    <van-image
      width="100%"
      :src="cover"
      class="rounded-2  xl overflow-hidden"
    >
      <template v-slot:loading>
        <van-loading type="spinner" size="20" />
      </template>
    </van-image>
    <div class="py-1 pb-2 px-4 relative">
      <div>
        <span class="text-xl text-white font-semibold">{{ name }}</span>
      </div>
      <div class="tag rounded-sm inline-flex flex-row my-2 overflow-hidden" v-if="amount">
        <span v-if="limit" class="text-gray-800 text-sm bg-amber-200 text-center px-2">限量</span>
        <span class="text-sm text-center px-2 text-amber-200 bg-gray-600">{{ amount }}份</span>
      </div>
      <div class="flex flex-row justify-between">
        <div class="text-gray-300 text-sm">{{ owner }}</div>
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
    background-image: url(/escheresque-dark.png);
    .card-image {
      width: 100%;
    }
  }
</style>
