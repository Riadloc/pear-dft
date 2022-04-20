<template>
  <div :class="['card', 'overflow-hidden', 'bg-neutral-800', round && 'rounded-lg']">
    <van-image
      :class="[round && 'rounded-lg']"
      :src="cover"
    >
      <template v-slot:loading>
        <van-loading type="spinner" size="20" />
      </template>
    </van-image>
    <div class="p-2 pt-1 relative">
      <div class="flex flex-col">
        <!-- <span class="text-gray-800 text-sm bg-amber-200 rounded">dwheuiwhi</span> -->
        <span class="text-md text-white">{{ name }}</span>
        <div class="tag rounded w-20 flex flex-row my-1 overflow-hidden">
          <span class="text-gray-800 text-xs flex-1 bg-amber-200 text-center">编号</span>
          <span class="text-amber-200 text-xs flex-1 bg-gray-600 text-center">{{ serial }}</span>
        </div>
        <span class="text-gray-300">￥{{ price }}</span>
      </div>
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
    owner: String,
    price: String,
    serial: String
  }
})
</script>
<style lang="ts">
  //
</style>
<style lang="less" scoped>
  .card {
    //
  }
</style>
