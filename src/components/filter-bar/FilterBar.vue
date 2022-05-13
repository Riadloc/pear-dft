<template>
  <div class="sort-button flex">
    <template v-if="options?.length">
      <sort-button
        class="mr-8"
        v-for="item in options"
        :key="item.id"
        :name="item.name"
        :id="item.id"
        :active="activeId === item.id"
        @change="onChange"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import { Ordernum } from './constants'
import SortButton from './SortButton.vue'

interface Option {
  id: string | number;
  name: string;
}

interface State {
  activeId: Option['id'] | undefined;
}

export default defineComponent({
  components: { SortButton },
  props: {
    options: Array as PropType<Option[]>
  },
  setup(props, context) {
    const activeId = ref<State['activeId']>(undefined)
    const onChange = (id: Option['id'], value: Ordernum) => {
      console.log(id)
      activeId.value = id
      context.emit('onChange', {
        id,
        value
      })
    }

    return {
      activeId,
      onChange
    }
  }
})
</script>

<style lang="less" scoped>

</style>
