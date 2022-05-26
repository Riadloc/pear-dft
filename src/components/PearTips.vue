<template>
  <pear-icon set="ph" name="question-light" :size="size"  @click="onClick" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Dialog } from 'vant'

export default defineComponent({
  props: {
    tip: String,
    size: {
      type: String,
      default: '1rem'
    }
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
