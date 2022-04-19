<template>
  <div :class="['card', 'overflow-hidden', 'bg-neutral-800', round && 'rounded-lg']">
    <img :class="[round && 'rounded-lg']" :src="cover" alt="">
    <div class="p-2 relative">
      <div class="flex flex-col">
        <!-- <span class="text-gray-800 text-sm bg-amber-200 rounded">dwheuiwhi</span> -->
        <span class="text-md text-white">{{ name }}</span>
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
    //
  }
</style>
