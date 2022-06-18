<template>
  <div class="compose-lab">
    <pear-navbar title="合成实验室" left-arrow />
    <div class="py-4 flex flex-col justify-center items-center">
      <pear-image
        class="w-28 h-28 border-2 border-light-300 rounded-lg"
        :src="data.good.cover" />
      <p class="text-white mt-2">{{ data.good.name }}</p>
    </div>
    <div class="mx-4 mb-4 p-4 rounded-sm bg-card text-white">
      <p class="mb-4">合成升级：{{ data.good.name }}</p>
      <div class="bg-gray-100 bg-opacity-10 p-4 rounded-sm mt-2">
        <div class="text-sm text-gray-300 mb-3 flex">
          <span>原料：</span>
          <div class="flex-1">
            <p v-for="item in data.materials" :key="item.objectId">
              {{ item.objectName }} x {{ item.count }}
            </p>
          </div>
        </div>
        <div class="flex flex-wrap">
          <template v-for="item in data.materials">
            <van-badge
              v-if="finalSelectList[item.objectId]?.length"
              :key="item.objectId + '1'"
              class="mb-2 mr-[3%] basis-[30%]"
              :color="finalSelectList[item.objectId]?.length !== item.count ? '#ee0a24' : '#31c17b'"
              :content="finalSelectList[item.objectId]?.length">
              <van-button
                class="p-5 w-full bg-cover bg-center"
                :style="{
                  backgroundImage: `url('${getCover(item.objectId)}')`,
                }"
                @click="() => onClick(item)" />
            </van-badge>
            <van-button
              v-else
              :key="item.objectId + '2'"
              class="pear-gray-button p-5 mb-2 mr-[3%] basis-[30%]"
              icon="plus"
              @click="() => onClick(item)" />
          </template>
        </div>
      </div>
      <p class="text-sm text-gray-200 mt-4">* 原料将在合成后自动销毁</p>
    </div>
    <div class="mx-4 p-4 rounded-sm bg-card text-white">
      <van-button
        block
        class="pear-color-button px-4 rounded-lg"
        @click="onSubmit"
        >立即合成</van-button
      >
    </div>
    <van-dialog
      v-model:show="dialogRef.show"
      :title="dialogRef.title"
      show-cancel-button
      :show-confirm-button="!!myMaterials[dialogRef.key]?.length"
      :confirm-button-text="`选择 ${selectList[dialogRef.key]?.length || 0} 个`"
      :before-close="beforeClose">
      <div class="max-h-[20vh] overflow-y-auto">
        <div
          class="flex p-4 flex-wrap"
          v-if="!!myMaterials[dialogRef.key]?.length">
          <div
            v-for="item in myMaterials[dialogRef.key] || []"
            :key="item.serial"
            :class="[
              'material-item',
              { '!bg-primary': !!selectList[dialogRef.key]?.includes(item.id) },
            ]"
            @click="() => onSelect(item)">
            <span class="text-xs leading-5 text-gray-300"
              >#{{ item.serial }}</span
            >
          </div>
        </div>
        <p v-else class="my-2 text-sm text-center text-gray-300">
          您缺少该材料
        </p>
      </div>
    </van-dialog>
    <pear-spinner :show="loading" />
  </div>
</template>

<script lang="ts">
import { HTTP_CODE } from '@/constants/enums'
import router from '@/routes'
import { composeMaterials, getComposeDetail, getMyMaterials } from '@/services/goods.service'
import { flatten } from 'lodash-es'
import { Dialog, Toast } from 'vant'
import { computed, defineComponent, onMounted, reactive, ref } from 'vue'
import { useRequest } from 'vue-request'
import { useRoute } from 'vue-router'
export default defineComponent({
  setup() {
    const route = useRoute()
    const myMaterials = ref<any>({})
    const selectList = ref<any>({})
    const finalSelectList = ref<any>({})
    const dialogRef = reactive({
      show: false,
      title: '',
      key: ''
    })

    onMounted(() => {
      const { id } = route.query
      runGetDetail({
        id
      })
    })
    const {
      data,
      loading: detailLoading,
      run: runGetDetail
    } = useRequest(getComposeDetail, {
      manual: true,
      initialData: {
        good: {
          name: '',
          cover: ''
        },
        materials: []
      },
      formatResult(data) {
        return data.data
      }
    })
    const { loading: mrLoading, run: runGetMaterials } = useRequest(
      getMyMaterials,
      {
        manual: true,
        cacheKey: 'materials',
        staleTime: 300000, // 5 分钟
        onSuccess(res: any) {
          if (res.code === HTTP_CODE.ERROR) {
            Dialog.alert({
              message: res.msg
            })
            return
          }
          myMaterials.value[dialogRef.key] = res.data
        }
      }
    )
    const { loading: cmLoading, run: runCompose } = useRequest(composeMaterials, {
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
          message: '合成成功！'
        }).then(() => {
          router.back()
        })
      }
    })
    const beforeClose = async (action: string) => {
      if (action === 'confirm') {
        finalSelectList.value[dialogRef.key] = (
          selectList.value[dialogRef.key] || []
        ).concat()
        return true
      }
      selectList.value[dialogRef.key] = []
      return true
    }
    const onClick = (item: any) => {
      if (!myMaterials.value[item.objectId]) {
        runGetMaterials({
          goodId: item.objectId
        })
      }
      dialogRef.show = true
      dialogRef.title = `${item.objectName} / 需要${item.count}个`
      dialogRef.key = item.objectId
      selectList.value[item.objectId] = (
        finalSelectList.value[item.objectId] || []
      ).concat()
    }
    const onSelect = (item: any) => {
      if (!selectList.value[dialogRef.key]) { selectList.value[dialogRef.key] = [] }
      const index = selectList.value[dialogRef.key].indexOf(item.id)
      if (index > -1) {
        selectList.value[dialogRef.key].splice(index, 1)
      } else {
        console.log(item.id)
        selectList.value[dialogRef.key].push(item.id)
      }
    }
    const onSubmit = () => {
      const unValid = data.value.materials.some(
        (item: any) => finalSelectList.value[item.objectId]?.length !== item.count
      )
      if (unValid) {
        Toast('原料未选择充足')
        return
      }
      Dialog.confirm({
        message: '合成后原料将会销毁，确认合成？'
      }).then(() => {
        runCompose({
          materials: flatten(Object.values(finalSelectList.value)),
          id: data.value.id
        })
      })
    }
    const getCover = (key: string) => {
      console.log(myMaterials.value[key]?.[0])
      return myMaterials.value[key]?.[0]?.cover || ''
    }

    const loading = computed(() => mrLoading.value || detailLoading.value || cmLoading.value)

    return {
      data,
      loading,
      onClick,
      onSelect,
      onSubmit,
      getCover,

      dialogRef,
      selectList,
      finalSelectList,
      myMaterials,
      beforeClose
    }
  }
})
</script>

<style lang="less" scoped>
.material-item {
  @apply inline-flex flex-col px-3 py-2 bg-[#555] mr-3 mb-2 text-right rounded active:bg-opacity-70;
}
</style>
