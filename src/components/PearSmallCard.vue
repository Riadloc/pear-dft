<template>
  <div :class="['card', 'overflow-hidden', 'bg-card', round && 'rounded-2xl', 'relative']">
    <pear-image
      :thumbnail="50"
      :src="cover"
      :alt="`${name}`"
      :class="[round && 'rounded-2xl', 'overflow-hidden', 'w-full']"
    />
    <div class="p-2">
      <div class="flex flex-col">
        <span class="text-sm text-white leading-5">{{ name }}</span>
        <span class="text-gray-300 text-xs leading-5">{{ owner }}</span>
        <p class="text-yellow-200 text-md leading-5"><span class="text-xs">￥</span>{{ price }}</p>
      </div>
    </div>
    <p class="serial text-white text-xs bg-black bg-opacity-20 text-center px-2 rounded-full absolute right-2 top-2">{{ serial }}</p>
    <div class="absolute left-2 top-2 bg-black bg-opacity-80 px-2 rounded-full leading-4" v-if="isSelling || isPurchasing">
      <span class="text-green-500 text-xs" v-if="isSelling">转售中</span>
      <span class="text-green-500 text-xs" v-else-if="isPurchasing">支付中</span>
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
    serial: String,
    isSelling: Boolean,
    isPurchasing: Boolean
  }
})
</script>
<style lang="less" scoped>
  .card {
    .serial {
      border: 0.0625rem solid hsla(0,0%,100%,.6);
    }
  }
</style>
