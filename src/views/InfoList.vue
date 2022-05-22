<template>
  <div class="info-list">
    <pear-navbar title="关于" left-arrow />
    <div class="pb-6">
      <van-cell
        round
        :border="false"
        title-class="text-gray-100"
        class="mb-3 rounded bg-card"
        title="用户协议"
        is-link
        to="/agreement/user"
      />
      <van-cell
        round
        :border="false"
        title-class="text-gray-100"
        class="mb-3 rounded bg-card"
        title="隐私政策"
        is-link
        to="/agreement/privacy"
      />
      <van-cell
        round
        :border="false"
        title-class="text-gray-100"
        class="rounded bg-card"
        title="商家入驻协议"
        is-link
        to="/agreement/business"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({

})
</script>

<style lang="less" scoped>

</style>
