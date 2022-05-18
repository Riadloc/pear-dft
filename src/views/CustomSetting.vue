<template>
  <div class="custom-setting">
    <van-nav-bar :border="false" title="设置" fixed left-arrow @click-left="back" />
    <div class="flex justify-between gap-4 absolute bottom-0 left-0 right-0 px-4 py-6 bg-card shadow-lg rounded-t-xl">
      <van-button type="danger" block @click="logout">退出登录</van-button>
    </div>
  </div>
</template>

<script lang="ts">
import { useUserStore } from '@/stores/user.store'
import { Dialog } from 'vant'
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
export default defineComponent({
  setup() {
    const router = useRouter()
    const store = useUserStore()

    const logout = () => {
      Dialog.confirm({
        message: '确认退出登录？'
      }).then(() => {
        store.$reset()
        router.replace('/login')
      }).catch(() => {
        //
      })
    }

    const back = () => {
      router.back()
    }

    return {
      logout,
      back
    }
  }
})
</script>

<style lang="less" scoped>

</style>
