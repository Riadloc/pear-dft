<template>
  <div class="registration text-center text-xs text-gray-500 py-4">
    <p class="leading-5">蜀ICP备2022012637号-1</p>
    <p class="leading-5">©2022 成都圣易陇科技有限公司</p>
    <van-button size="small" icon="phone" class="pear-green-plain-button mt-2 px-6" @click="show = true">联系我们</van-button>
    <van-action-sheet v-model:show="show">
      <div class="p-8">
        <van-button
          icon="phone"
          class="pear-green-button"
          block
          url="tel://19308181875"
          @click="show = false"
        >客服电话：193-0818-1875</van-button>
      </div>
    </van-action-sheet>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const show = ref(false)

    return {
      show
    }
  }
})
</script>
