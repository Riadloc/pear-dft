
<template>
  <div class="authorized-identity pt-20">
    <van-nav-bar :border="false" left-arrow @click-left="back" fixed />
    <van-notice-bar wrapable :scrollable="false">一分钟内只能请求认证一次，一天内最多请求三次</van-notice-bar>
    <div class="px-10 mt-6">
      <h2 class="text-3xl font-semibold text-white">填写实名认证信息</h2>
      <p class="text-sm text-gray-400 mt-4 mb-10">当前登录手机号：{{ phone }}</p>
      <van-form @submit="onSubmit">
        <van-field
          v-model="realName"
          name="realName"
          class="px-0 bg-paper"
          placeholder="请输入姓名"
          :rules="[{ required: true, message: '请输入姓名' }]"
        />
        <van-field
          readonly
          @touchstart.stop="show = true"
          v-model="idCard"
          name="idCard"
          class="px-0 bg-paper"
          placeholder="请输入身份证号"
          :rules="[{ required: true, message: '请输入身份证号' }, { pattern: /^[\d]{17}[\dxX]{1}$/, message: '格式不正确' }]"
        />
        <div class="mt-10">
          <van-button round block type="primary" plain native-type="submit" :loading="loading">
            提交认证
          </van-button>
        </div>
      </van-form>
      <van-number-keyboard
        v-model="idCard"
        :show="show"
        extra-key="X"
        :maxlength="18"
        @blur="show = false"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user.store'
import { datamask } from '@/constants/utils'
import { useRequest } from 'vue-request'
import { certifyUser } from '@/services/user.service'
import { Dialog, Toast } from 'vant'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { HTTP_CODE } from '@/constants/enums'
export default defineComponent({
  setup() {
    const show = ref(false)
    const realName = ref('')
    const idCard = ref('')

    const router = useRouter()
    const store = useUserStore()
    const phone = computed(() => datamask(store.userData.phone))

    const back = () => {
      router.back()
    }

    const { loading, run } = useRequest(certifyUser, {
      manual: true,
      throttleInterval: 2000,
      throttleOptions: { leading: true, trailing: false },
      onSuccess(res: any) {
        if (res.code === HTTP_CODE.ERROR) {
          Dialog.alert({
            message: res.msg
          })
          return
        }
        Toast({
          message: '信息认证成功',
          onClose: () => {
            store.getUserInfo(`${store.userData.userId}`)
            router.back()
          }
        })
      }
    })
    const onSubmit = (values: any) => {
      let birth: string = values.idCard.slice(6, 14)
      birth = birth.slice(0, 4) + '-' + birth.slice(4, 6) + birth.slice(6, 8)
      const isMoreThanEighteen = dayjs(birth).add(18, 'year').isBefore(new Date())
      if (!isMoreThanEighteen) {
        Dialog.alert({
          message: '不满18岁，不能完成认证',
          confirmButtonText: '确认'
        })
        return
      }
      run(values)
    }
    onMounted(() => {
      if (store.userData.certified) {
        Dialog.alert({
          message: '用户已实名认证',
          confirmButtonText: '返回上一页'
        }).then(() => {
          router.back()
        })
      }
    })

    return {
      realName,
      idCard,
      loading,
      back,
      phone,
      show,
      onSubmit
    }
  }
})
</script>

<style lang="less" scoped>
.authorized-identity {
  .van-cell {
    line-height: 1.8rem;
  }
  .van-cell:after {
    left: 0;
    right: 0;
  }
}
</style>
