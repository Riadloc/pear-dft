<template>
  <div :class="['card', 'overflow-hidden', 'bg-card', round && 'rounded-2xl']">
    <pear-image
      :thumbnail="50"
      :src="cover"
      :alt="`${name}`"
      :class="[round && 'rounded-2xl', 'overflow-hidden']"
      size="card-small"
    />
    <div class="p-2 relative">
      <div class="flex flex-col">
        <!-- <span class="text-gray-800 text-sm bg-amber-200 rounded">dwheuiwhi</span> -->
        <span class="text-md text-white">{{ name }}</span>
        <div class="tag inline-flex flex-row my-1 overflow-hidden">
          <p class="text-gray-800 text-xs bg-amber-200 text-center px-2 rounded-l">编号</p>
          <p class="text-amber-200 text-xs bg-gray-600 text-center px-2 rounded-r">{{ serial }}</p>
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
    background-image: url(/escheresque-dark.png);
    //
  }
</style>
