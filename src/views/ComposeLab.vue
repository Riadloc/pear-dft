<template>
  <div class="compose-lab">
    <pear-navbar title="合成实验室" left-arrow />
    <div class="py-4 flex flex-col justify-center items-center">
      <pear-image class="w-28 h-28 border-2 border-light-300 rounded-lg" src="https://pearmeta-1253493520.file.myqcloud.com/yangyuhuan.jpeg_bo3z9etu47u" />
      <p class="text-white mt-2">创世之星</p>
    </div>
    <div class="mx-4 p-4 rounded-sm bg-card text-white">
      <p class="mb-4">合成升级：创世之星</p>
      <div class="bg-gray-100 bg-opacity-10 p-4 rounded-sm mt-2">
        <p class="text-sm text-gray-300 mb-3">原料：创世之星x1</p>
        <div class="flex">
          <van-button class="pear-gray-button p-5 mr-2 mb-2" icon="plus" />
          <van-button class="pear-gray-button p-5 mr-2 mb-2" icon="plus" />
          <van-button class="pear-gray-button p-5 mr-2 mb-2" icon="plus" />
        </div>
        <div class="text-center mt-2">
          <van-button class="pear-green-button px-4" size="small">自动选择</van-button>
        </div>
      </div>
      <p class="text-sm text-gray-200 mt-4">* 原料将在合成后自动销毁</p>
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
