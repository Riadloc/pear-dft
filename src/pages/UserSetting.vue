<template>
  <div class="user-info">
    <van-nav-bar :border="false" title="个人信息" left-arrow @click-left="back" />
    <div class="py-12">
      <van-cell
        round
        :border="false"
        title-class="text-gray-100"
        class="mb-4 rounded bg-card"
        :is-link="!store.userData.certified"
      >
        <template #title>
          <div class="flex items-center">
            <pear-icon set="ph" name="shield-plus" size="1.3rem" />
            <span class="ml-2">实名认证</span>
          </div>
        </template>
        <template #value>
          <span v-if="store.userData.certified">已认证</span>
          <span v-else>去认证</span>
        </template>
      </van-cell>
    </div>
  </div>
</template>

<script lang="ts">
import { useUserStore } from '@/stores/user.store'
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
export default defineComponent({
  setup() {
    const router = useRouter()
    const store = useUserStore()

    const back = () => {
      router.back()
    }

    return {
      back,
      store
    }
  }
})
</script>

<style lang="less" scoped>

</style>
