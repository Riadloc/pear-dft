<template>
  <div class="contact-us h-screen flex flex-col justify-center items-center">
    <van-nav-bar :border="false" title="联系我们" fixed left-arrow @click-left="back" />
    <van-image
      width="80vw"
      src="/mp.jpg"
    >
      <template v-slot:loading>
        <van-loading type="spinner" size="20" />
      </template>
    </van-image>
    <h3 class="mt-4 text-white font-medium text-lg">关注公众号了解更多咨询</h3>
    <a class="mt-2 text-green-500 text-sm underline" href="/mp.jpg" download="梨数藏公众号.jpg">保存至手机</a>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
export default defineComponent({
  setup() {
    const router = useRouter()

    const back = () => {
      router.back()
    }

    return {
      back
    }
  }
})
</script>

<style lang="less" scoped>

</style>
