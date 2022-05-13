<template>
  <div class="top-up pt-16 p-6">
    <pear-navbar title="充值" fixed left-arrow />
    <van-form @submit="onSubmit">
      <van-field
        readonly
        @touchstart.stop="show = true"
        :border="false"
        v-model="amount"
        name="amount"
        right-icon="jpy-light"
        icon-prefix="ph:currency"
        class="mb-4 rounded"
        placeholder="请输入金额"
      />
    </van-form>
    <!-- <div>
      <p>选择支付方式</p>
    </div> -->
    <div class="mt-10">
      <van-button round block class="pear-plain-button" native-type="submit">
        立即充值
      </van-button>
    </div>
    <van-number-keyboard
      v-model="amount"
      :show="show"
      :maxlength="18"
      extra-key="."
      theme="custom"
      close-button-text="完成"
      @blur="show = false"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
export default defineComponent({
  setup() {
    const amount = ref('')
    const show = ref(false)

    const onSubmit = () => {
      //
    }
    return {
      show,
      amount,
      onSubmit
    }
  }
})
</script>

<style lang="less" scoped>

</style>
