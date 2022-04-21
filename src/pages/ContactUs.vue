<template>
  <div class="contact-us h-screen flex flex-col justify-center items-center">
    <van-nav-bar :border="false" title="联系我们" fixed left-arrow @click-left="back" />
    <van-image
      width="80vw"
      src="/qq-group.jpeg"
    />
    <h3 class="mt-4 text-white font-medium text-lg">加入官方群了解更多资讯</h3>
    <a class="mt-2 text-green-500 text-sm underline" href="/qq-group.jpeg" download="梨数藏官方QQ群.jpeg">保存至手机</a>
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
