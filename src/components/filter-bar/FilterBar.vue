<template>
  <div class="sort-button flex items-center justify-between">
    <div>
      <template v-if="options?.length">
        <sort-button
          class="mr-8"
          v-for="item in options"
          :key="item.id"
          :name="item.name"
          :id="item.id"
          :active="activeId === item.id"
          @change="onChange" />
      </template>
    </div>
    <span class="text-sm text-white active:opacity-50" @click="show = true"
      >筛选</span
    >
    <van-popup v-model:show="show" position="right" class="h-full w-1/2">
      <div class="py-4 text-white flex flex-col h-full relative">
        <h3 class="text-md mb-3 px-4">主题</h3>
        <div class="flex-1 pb-12 overflow-hidden">
          <div class="h-full overflow-y-auto px-4">
            <van-tag
              type="primary"
              size="large"
              class="mr-2 mb-2 block"
              :plain="selectedGood !== item.name"
              v-for="item in goodsList"
              :key="item.id"
              @click="() => onClick(item)"
              >{{ item.name }}</van-tag
            >
          </div>
        </div>
        <div class="absolute bottom-0 left-0 right-0 p-4 shadow-lg">
          <van-button class="pear-green-button rounded" block size="small" @click="onConfirm">确定</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script lang="ts">
import { OrderEnum } from '@/constants/enums'
import { getFilterGoodsList } from '@/services/goods.service'
import { defineComponent, PropType, ref } from 'vue'
import { useRequest } from 'vue-request'
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
  emits: ['change'],
  setup(props, context) {
    const activeId = ref<State['activeId']>(undefined)
    const show = ref(false)
    const selectedGood = ref('')

    const onChange = (id: Option['id'], value: OrderEnum) => {
      activeId.value = id
      context.emit('change', {
        id,
        value
      })
    }
    const onClick = (data: any) => {
      if (selectedGood.value === data.name) {
        selectedGood.value = ''
      } else {
        selectedGood.value = data.name
      }
    }
    const onConfirm = () => {
      context.emit('change', {
        selected: selectedGood.value
      })
      show.value = false
    }
    const reset = () => {
      selectedGood.value = ''
    }
    const { data: goodsList } = useRequest(
      getFilterGoodsList,
      {
        cacheKey: 'filterGoodsList',
        staleTime: 300000, // 5 分钟
        formatResult(res: any) {
          return res.data
        }
      }
    )

    context.expose({
      reset
    })

    return {
      show,
      activeId,
      onClick,
      onChange,
      onConfirm,
      selectedGood,
      goodsList
    }
  }
})
</script>
<style lang="less" scoped>
:deep(.van-tag--primary.van-tag--plain) {
  color: #fff;
}
</style>
