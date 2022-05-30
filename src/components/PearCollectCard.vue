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
        <span class="text-gray-300 text-xs leading-5">共 {{ count }} 个</span>
      </div>
    </div>
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
    owner: String,
    count: Number
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
