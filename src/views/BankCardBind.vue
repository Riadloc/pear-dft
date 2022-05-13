<template>
  <div class="bank-card-bind pt-16">
    <pear-navbar title="绑定银行卡" fixed left-arrow />
    <van-form @submit="onSubmit" class="p-6">
      <van-field
        :border="false"
        readonly
        @touchstart.stop="showBankCardKeyboard = true"
        v-model="cardNo"
        name="cardNo"
        class="mb-4 rounded"
        placeholder="银行卡号"
      />
      <van-field
        :border="false"
        v-model="phone"
        name="phone"
        class="mb-4 rounded"
        placeholder="开户手机号"
      />
      <van-field
        readonly
        @touchstart.stop="showIdCardKeyboard = true"
        :border="false"
        v-model="idCard"
        name="idCard"
        class="mb-4 rounded"
        placeholder="请输入身份证号"
        :rules="[{ required: true, message: '请输入身份证号' }, { pattern: /^[\d]{17}[\dxX]{1}$/, message: '格式不正确' }]"
      />
      <div class="mt-10">
        <van-button round block class="pear-plain-button" native-type="submit">
          绑定
        </van-button>
      </div>
    </van-form>
    <van-number-keyboard
      v-model="idCard"
      :show="showIdCardKeyboard"
      extra-key="X"
      :maxlength="18"
      @blur="showIdCardKeyboard = false"
    />
    <van-number-keyboard
      v-model="cardNo"
      :show="showBankCardKeyboard"
      :maxlength="18"
      @blur="showBankCardKeyboard = false"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
export default defineComponent({
  setup() {
    const showIdCardKeyboard = ref(false)
    const showBankCardKeyboard = ref(false)
    const cardNo = ref('')
    const phone = ref('')
    const idCard = ref('')
    const onSubmit = () => {
      //
    }
    return {
      showIdCardKeyboard,
      showBankCardKeyboard,
      cardNo,
      phone,
      idCard,
      onSubmit
    }
  }
})
</script>

<style lang="less" scoped>

</style>
