<template>
  <van-overlay :show="show" @click="onClick" z-index="10000">
    <div class="flex h-full justify-center items-center">
      <van-loading type="spinner" size="3rem" @click.stop/>
    </div>
  </van-overlay>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    show: Boolean
  },
  setup(props, context) {
    const onClick = () => {
      context.emit('close')
    }

    return {
      onClick
    }
  }
})
</script>

<style lang="less" scoped>

</style>
