<template>
  <div class="order-list">
    <van-nav-bar :border="false" title="已购作品" left-arrow @click-left="back" />
    <van-tabs v-model:active="active">
      <van-tab title="待支付" name="wait">
        <order-list-view :status="OrderStatus.WAIT" />
      </van-tab>
      <van-tab title="已购买" name="purchased">
        <order-list-view :status="OrderStatus.PURCHASED" />
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

</style>
