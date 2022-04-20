<template>
  <div class="custom-setting">
    <van-nav-bar :border="false" title="设置" fixed left-arrow @click-left="back" />
    <div class="py-12">
      <van-cell
        round
        :border="false"
        title-class="text-gray-100"
        class="mb-4 rounded bg-slate-800"
      >
        <template #title>
          <div class="flex items-center">
            <pear-icon set="fluent" name="shield-lock-20-regular" size="1.3rem" />
            <span class="ml-2">修改密码</span>
          </div>
        </template>
      </van-cell>
    </div>
    <div class="flex justify-between gap-4 absolute bottom-0 left-0 right-0 px-4 py-6 bg-gray-800 shadow-lg rounded-t-xl">
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
        localStorage.removeItem('user.id')
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
