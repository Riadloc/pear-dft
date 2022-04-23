<template>
  <van-nav-bar :border="false" :title="title" :fixed="fixed" :left-arrow="leftArrow" @click-left="back" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
export default defineComponent({
  props: {
    title: String,
    leftArrow: Boolean,
    fixed: Boolean
  },
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
