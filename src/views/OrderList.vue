<template>
  <div class="order-list">
    <pear-navbar title="已购作品" left-arrow />
    <van-tabs v-model:active="active" swipeable>
      <van-tab title="待支付" name="wait">
        <order-list-view
          class="tab-panel"
          :status="OrderStatus.WAIT"
          status-name="待支付"
          status-name-class="text-yellow-400"
        />
      </van-tab>
      <van-tab title="已购买" name="purchased">
        <order-list-view
          class="tab-panel"
          :status="OrderStatus.PURCHASED"
          status-name="已购买"
          status-name-class="text-green-400"
        />
      </van-tab>
      <van-tab title="已取消" name="cancelled">
        <order-list-view
          class="tab-panel"
          :status="[OrderStatus.TERMINATED, OrderStatus.CLOSED]"
          status-name="已取消"
          status-name-class="text-red-400"
        />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import OrderListView from '@/components/OrderListView.vue'
import { OrderStatus } from '@/constants/enums'

export default defineComponent({
  components: { OrderListView },
  setup() {
    const router = useRouter()
    const active = ref(0)

    const back = () => {
      router.back()
    }

    return {
      active,
      back,
      OrderStatus
    }
  }
})
</script>

<style lang="less" scoped>
.tab-panel {
  min-height: calc(100vh - var(--van-tabs-line-height) - var(--van-nav-bar-height));
}
</style>
