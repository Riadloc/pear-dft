<template>
  <span class="iconify inline-block" :data-icon="iconName" :style="style"></span>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
  props: {
    name: {
      type: String,
      required: true
    },
    set: {
      type: String,
      required: true
    },
    size: {
      type: [Number, String],
      default: '1rem'
    }
  },
  setup(props) {
    const iconName = computed(() => `${props.set}:${props.name}`)
    const style = {
      fontSize: props.size
    }

    return {
      iconName,
      style
    }
  }
})
</script>

<style lang="less" scoped>

</style>
