<template>
  <div class="sort-button inline-flex text-white items-center" @click="onClick">
    <span class="text-sm">{{ name }}</span>
    <div class="flex flex-col ml-0.5">
      <pear-icon
        set="ph"
        name="caret-up-fill"
        size="0.5rem"
        :class="['-mb-0.5', { 'text-green-500': active && order === OrderEnum.ASC }]"
      />
      <pear-icon
        set="ph"
        name="caret-down-fill"
        size="0.5rem"
        :class="{ 'text-green-500': active && order === OrderEnum.DESC }"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { OrderEnum } from '@/constants/enums'

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
    const order = ref<OrderEnum>(OrderEnum.DESC)

    const onClick = () => {
      order.value = order.value === OrderEnum.ASC ? OrderEnum.DESC : OrderEnum.ASC
      context.emit('change', props.id, order.value)
    }

    return {
      order,
      OrderEnum,
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
