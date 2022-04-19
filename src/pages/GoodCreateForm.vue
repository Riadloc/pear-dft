<template>
  <div class="good-create-form">
    <van-nav-bar :border="false" title="购买" left-arrow left-text="返回" fixed @click-left="back" />
    <van-form class="mt-10 p-4" @submit="onSubmit" validate-trigger="onSubmit">
      <van-field
        class="mb-4"
        :border="false"
        name="coverFiles"
        label="藏品图"
      >
        <template #input>
          <van-uploader
            :max-size="maxSize"
            :max-count="1"
            @oversize="onOversize"
            v-model="coverFiles"
            preview-size="8rem"
          />
        </template>
      </van-field>
      <van-field
        class="mb-4"
        :border="false"
        v-model="name"
        name="name"
        label="藏品名称"
        placeholder="请填写藏品名称"
        :rules="[{ required: true, message: '请填写藏品名称' }]"
      />
      <van-field
        class="mb-4"
        :border="false"
        v-model="price"
        type="number"
        name="price"
        label="价格"
        placeholder="请填写价格"
        :rules="[{ required: true, message: '请填写价格' }]"
      />
      <van-field
        class="mb-4"
        :border="false"
        v-model="copies"
        type="number"
        name="copies"
        label="份数"
        placeholder="请填写份数"
        :rules="[{ required: true, message: '请填写份数' }]"
      />
      <van-field
        class="mb-4"
        :border="false"
        name="otherFiles"
        label="描述图"
      >
        <template #input>
          <van-uploader
            multiple
            :max-size="maxSize"
            @oversize="onOversize"
            :max-count="3"
            v-model="otherFiles"
            preview-size="8rem"
          />
        </template>
      </van-field>
      <van-field
        class="mb-4"
        :border="false"
        v-model="description"
        name="description"
        label="描述文案"
        placeholder="请填写描述"
      />
      <div class="mt-6">
        <van-button round block type="primary" native-type="submit" :loading="loading">
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import { Toast } from 'vant'
import { useRouter } from 'vue-router'
import { useRequest } from 'vue-request'
import { createGood } from '@/services/goods.service'

export default defineComponent({
  setup() {
    const router = useRouter()

    const form = reactive({
      name: '',
      price: '',
      copies: 1,
      description: '',
      coverFiles: [],
      otherFiles: []
    })
    const onSubmit = (values: any) => {
      console.log(values)
      const formdata = new FormData()
      formdata.append('name', form.name)
      formdata.append('price', form.price)
      formdata.append('copies', `${form.copies}`)
      formdata.append('description', form.description)
      formdata.append('cover', values.coverFiles[0].file)
      values.otherFiles.forEach(({ file }: any) => {
        formdata.append('pictures', file)
      })
      run(formdata)
    }
    const { run, loading } = useRequest<any>(createGood, {
      manual: true,
      onSuccess(data) {
        if (data.code !== -1) {
          Toast({
            message: '创建成功',
            onClose() {
              router.replace({
                name: 'Detail',
                params: {
                  goodNo: data.data.goodNo
                }
              })
            }
          })
        }
      }
    })
    const onOversize = () => {
      Toast('文件大小不能超过 10MB')
    }

    const back = () => {
      router.back()
    }

    return {
      ...toRefs(form),
      maxSize: 10 * 1024 * 1024,
      onOversize,
      onSubmit,
      loading,

      back
    }
  }
})
</script>

<style lang="less" scoped>

</style>
