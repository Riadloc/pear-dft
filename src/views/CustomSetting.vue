<template>
  <div class="custom-setting flex felx-col justify-center pt-10">
    <pear-navbar title="合成中心" left-arrow fixed />
    <div
      class="card" @click="onClick">
      <pear-image class="w-28 h-28 border-4 border-light-900 rounded-xl" src="https://pearmeta-1253493520.file.myqcloud.com/yangyuhuan.jpeg_bo3z9etu47u" />
      <div class="absolute top-0 left-0 p-4 text-white">
        <p class="text-xl">⌈ 创世之星 ⌋ 合成</p>
        <p class="text-sm text-gray-300">⌈ 创世之星 ⌋ 合成通道</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
export default defineComponent({
  setup() {
    const router = useRouter()

    const onClick = () => {
      router.push({ name: 'ComposeLab' })
    }

    return {
      onClick
    }
  }
})
</script>
<style lang="less" scoped>
.card {
  @apply relative bg-card rounded-2xl overflow-hidden mt-4 flex justify-center items-center active:opacity-70 w-[90vw] h-[90vw];
  &::before {
    background: url(https://pearmeta-1253493520.file.myqcloud.com/yangyuhuan.jpeg_bo3z9etu47u);
    background-repeat: no-repeat;
    background-size: cover;
    filter: opacity(0.4) blur(0.25rem);
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}
</style>
