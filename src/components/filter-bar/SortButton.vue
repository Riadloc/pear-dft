<template>
  <div class="sort-button inline-flex text-white items-center" @click="onClick">
    <span class="text-sm">{{ name }}</span>
    <div class="flex flex-col ml-0.5">
      <pear-icon
        set="ph"
        name="caret-up-fill"
        size="0.5rem"
        :class="['-mb-0.5', { 'text-green-500': active && order === Ordernum.ASC }]"
      />
      <pear-icon
        set="ph"
        name="caret-down-fill"
        size="0.5rem"
        :class="{ 'text-green-500': active && order === Ordernum.DESC }"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { Ordernum } from './constants'

export default defineComponent({
  name: 'sort-button',
  emits: ['change'],
  props: {
    name: String,
    active: {
      type: Boolean,
      default: false
    },
    id: [String, Number]
  },
  setup(props, context) {
    const order = ref<Ordernum>(Ordernum.ASC)

    const onClick = () => {
      order.value = order.value === Ordernum.ASC ? Ordernum.DESC : Ordernum.ASC
      context.emit('change', props.id, order.value)
    }

    return {
      order,
      Ordernum,
      onClick
    }
  }
})
</script>

<style lang="less" scoped>
.sort-button {
  &:active {
    opacity: 0.7;
  }
}
</style>
