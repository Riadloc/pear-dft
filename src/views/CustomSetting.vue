<template>
  <div class="custom-setting">
    <pear-navbar title="设置" left-arrow />
    <div class="flex justify-between gap-4 absolute bottom-0 left-0 right-0 px-4 py-6 bg-card shadow-lg rounded-t-xl">
      <van-button type="danger" block @click="logout" :loading="loading">退出登录</van-button>
    </div>
  </div>
</template>

<script lang="ts">
import { postLogout } from '@/services/user.service'
import { useUserStore } from '@/stores/user.store'
import { Dialog } from 'vant'
import { defineComponent } from 'vue'
import { useRequest } from 'vue-request'
import { useRouter } from 'vue-router'
export default defineComponent({
  setup() {
    const router = useRouter()
    const userStore = useUserStore()

    const logout = () => {
      Dialog.confirm({
        message: '确认退出登录？'
      }).then(() => {
        runLogout()
      }).catch(() => {
        //
      })
    }
    const { loading, run: runLogout } = useRequest(postLogout, {
      manual: true,
      onSuccess() {
        userStore.$reset()
        router.replace('/login')
      }
    })

    return {
      loading,
      logout
    }
  }
})
</script>
