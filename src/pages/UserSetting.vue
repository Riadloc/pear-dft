<template>
  <div class="user-info">
    <van-nav-bar :border="false" title="个人信息" left-arrow @click-left="back" />
    <div class="py-6">
      <van-cell
        round
        :border="false"
        title-class="text-gray-100"
        class="mb-3 rounded bg-card"
      >
        <template #title>
          <div class="flex items-center">
            <pear-icon set="ph" name="identification-card-light" size="1.3rem" />
            <span class="ml-2">UID</span>
          </div>
        </template>
        <template #value>
          {{ userData.userId }}
        </template>
      </van-cell>
      <van-cell
        round
        :border="false"
        title-class="text-gray-100"
        class="mb-3 rounded bg-card"
      >
        <template #title>
          <div class="flex items-center">
            <pear-icon set="ph" name="phone-light" size="1.3rem" />
            <span class="ml-2">手机号</span>
          </div>
        </template>
        <template #value>
          {{ phone }}
        </template>
      </van-cell>
      <van-cell
        round
        :border="false"
        title-class="text-gray-100"
        class="mb-3 rounded bg-card"
        is-link
        @click="onChangeName"
      >
        <template #title>
          <div class="flex items-center">
            <pear-icon set="ph" name="sword-light" size="1.3rem" />
            <span class="ml-2">昵称</span>
          </div>
        </template>
        <template #value>
          {{ userData.nickname }}
        </template>
      </van-cell>
      <van-cell
        round
        :border="false"
        title-class="text-gray-100"
        class="mb-3 rounded bg-card"
        is-link
        :to="{ name: 'Signup', params: { type: 1 } }"
      >
        <template #title>
          <div class="flex items-center">
            <pear-icon set="fluent" name="shield-lock-20-regular" size="1.3rem" />
            <span class="ml-2">修改密码</span>
          </div>
        </template>
      </van-cell>
      <van-cell
        round
        :border="false"
        title-class="text-gray-100"
        class="mb-3 rounded bg-card"
        :is-link="!userData.certified"
        :to="userData.certified ? '' : '/certify'"
      >
        <template #title>
          <div class="flex items-center">
            <pear-icon set="ph" name="shield-plus" size="1.3rem" />
            <span class="ml-2">实名认证</span>
          </div>
        </template>
        <template #value>
          <span v-if="userData.certified">已认证</span>
          <span v-else>去认证</span>
        </template>
      </van-cell>
    </div>
    <van-dialog v-model:show="show" title="输入新昵称" show-cancel-button :beforeClose="beforeClose">
      <div class="p-4">
        <van-form @submit="submitChangeName" validate-trigger="onSubmit" ref="renameForm">
          <van-field
            class="rounded"
            v-model="name"
            name="name"
            placeholder="支持2-14位中英文、数字"
            :rules="[{ required: true, message: '请填写昵称' }, { pattern: /^[\w\u4e00-\u9fa5]{2,14}$/, message: '昵称不符合规范，仅支持2-14位中英文、数字' }]"
          />
        </van-form>
      </div>
    </van-dialog>
  </div>
</template>

<script lang="ts">
import { datamask } from '@/constants/utils'
import { updateUserInfo } from '@/services/user.service'
import { useUserStore } from '@/stores/user.store'
import { mapActions, mapState } from 'pinia'
import { Toast } from 'vant'
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
export default defineComponent({
  setup() {
    const router = useRouter()

    const show = ref(false)
    const name = ref('')
    const renameForm = ref<any>(null)
    const beforeClose = (action: string) => {
      if (action === 'confirm') {
        renameForm.value?.submit()
        return false
      }
      return true
    }

    const back = () => {
      router.back()
    }

    return {
      back,
      name,
      show,
      renameForm,
      beforeClose
    }
  },
  computed: {
    ...mapState(useUserStore, {
      userData: 'userData',
      phone: store => datamask(store.userData.phone)
    })
  },
  methods: {
    ...mapActions(useUserStore, ['getUserInfo']),
    onChangeName() {
      this.name = this.userData.nickname
      this.show = true
    },
    async submitChangeName(values: any) {
      const res = await updateUserInfo(this.userData.userId, values) as any
      if (res.code !== 0) {
        Toast(res.msg)
        return
      }
      Toast('昵称修改成功')
      this.getUserInfo(`${this.userData.userId}`)
      this.show = false
    }
  }
})
</script>

<style lang="less" scoped>

</style>
