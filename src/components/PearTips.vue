<template>
  <div class="pear-tips inline" @click="onClick">
    <pear-icon set="ph" name="question-light" size="1rem" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Dialog } from 'vant'

export default defineComponent({
  props: {
    tip: String
  },
  setup(props) {
    const onClick = () => {
      Dialog.alert({
        message: props.tip
      })
    }

    return {
      onClick
    }
  }
})
</script>

<style lang="less" scoped>

</style>
