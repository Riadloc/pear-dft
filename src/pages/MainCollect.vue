<template>
  <div class="collect p-4">
    <div class="collect-header">
      <h3 class="text-white text-xl">我的藏品</h3>
    </div>
    <div class="collect-list flex flex-wrap justify-between mt-8">
      <pear-small-card
        v-for="item in goods"
        :key="item.name"
        class="mb-4"
        style="flex: 0 0 45%"
        :cover="item.cover"
        round
        limit
        :name="item.name"
        :price="item.price"
        :amount="item.amount"
        :owner="item.owner"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { PearSmallCard } from '@/components'
interface GoodItem {
  name: string;
  price: string;
  amount: number;
  owner: string;
  cover: string;
}

export default defineComponent({
  components: { PearSmallCard },
  setup() {
    const goods = ref<GoodItem[]>([])
    goods.value = []

    return {
      goods
    }
  }
})
</script>

<style lang="less" scoped>

</style>
