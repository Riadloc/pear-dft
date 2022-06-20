
<template>
  <div class="bank-card-bind">
    <pear-navbar title="实名认证" left-arrow />
    <van-form @submit="onSubmit" class="p-4" validate-trigger="onSubmit">
      <van-field
        label="银行卡号"
        :border="false"
        v-model="formData.bankNo"
        name="bankNo"
        class="mb-4 rounded"
        placeholder="储蓄银行卡卡号"
        :rules="[{ required: true, message: '请填写储蓄银行卡卡号' }, { pattern: /^[1-9]\d{8,30}$/, message: '格式不正确' }]"
      />
      <van-field
        label="开户手机号"
        :border="false"
        v-model="formData.phone"
        name="phone"
        class="mb-4 rounded"
        placeholder="银行卡开户手机号"
        :rules="[{ required: true, message: '请填写银行卡开户手机号' }, { pattern: /^\d{11}$/, message: '手机号格式不正确' }]"
      />
      <van-field
        label="姓名"
        :border="false"
        v-model="formData.realName"
        name="realName"
        class="mb-4 rounded"
        placeholder="开户人姓名（不是支行名称)"
        :rules="[{ required: true, message: '请填写开户人姓名' }, { pattern: /^[\u4e00-\u9fa5]{2,6}$/, message: '格式不正确' }]"
      />
      <van-field
        label="身份证号"
        :border="false"
        v-model="formData.idNo"
        name="idNo"
        class="mb-4 rounded"
        placeholder="身份证号"
        :rules="[{ required: true, message: '请填写身份证号' }, { pattern: /^[\d]{17}[\dxX]{1}$/, message: '格式不正确' }]"
      />
      <div class="mt-10">
        <van-button block class="pear-green-button rounded" native-type="submit">提交认证</van-button>
      </div>
    </van-form>
    <pear-spinner :show="loading" />
    <yidun-captcha :be-validate="false" v-model:show="showCaptch" @success="onValidOk"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/stores/user.store'
import { useRequest } from 'vue-request'
import { certifyUser } from '@/services/user.service'
import { Dialog } from 'vant'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { HTTP_CODE } from '@/constants/enums'
export default defineComponent({
  setup() {
    const show = ref(false)
    const showCaptch = ref(false)

    const router = useRouter()
    const userStore = useUserStore()
    const formData = reactive({
      phone: userStore.userData.phone,
      bankNo: '',
      idNo: '',
      realName: ''
    })

    const back = () => {
      router.back()
    }
    const onValidOk = async (code: string) => {
      showCaptch.value = false
      run({
        realName: formData.realName,
        idNo: formData.idNo,
        bankNo: formData.bankNo,
        phone: formData.phone,
        code
      })
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
        Dialog.alert({
          message: '实名认证成功'
        }).then(() => {
          userStore.getUserInfo()
          router.back()
        })
      }
    })
    const onSubmit = (values: any) => {
      let birth: string = values.idNo.slice(6, 14)
      birth = birth.slice(0, 4) + '-' + birth.slice(4, 6) + birth.slice(6, 8)
      const isMoreThanEighteen = dayjs(birth).add(18, 'year').isBefore(new Date())
      if (!isMoreThanEighteen) {
        Dialog.alert({
          message: '不满18岁，不能完成认证',
          confirmButtonText: '确认'
        })
        return
      }
      showCaptch.value = true
    }
    onMounted(() => {
      Dialog.alert({
        message: '暂时暂停新用户实名认证',
        confirmButtonText: '返回上一页'
      }).then(() => {
        router.back()
      })

      // if (userStore.userData.certified) {
      //   Dialog.alert({
      //     message: '用户已实名认证',
      //     confirmButtonText: '返回上一页'
      //   }).then(() => {
      //     router.back()
      //   })
      // }
    })

    return {
      showCaptch,
      onValidOk,

      formData,
      loading,
      back,
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
