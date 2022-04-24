<template>
  <div class="relative pear-image" :class="size">
    <picture>
      <source :srcset="`${src}?${imageMogr2}`" type="image/webp">
      <img :src="src" :alt="alt" :class="size" v-bind="$attrs" @load="onLoad" @error="onError">
    </picture>
    <div v-if="loading" class="absolute inset-0 flex justify-center items-center z-10 bg-gray-100">
      <van-icon name="photo-fail" v-if="error" />
      <van-loading type="spinner" v-else />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'

export default defineComponent({
  inheritAttrs: false,
  props: {
    alt: {
      type: String,
      defalut: 'photo'
    },
    src: {
      type: String
    },
    thumbnail: {
      type: Number,
      default: 0
    },
    width: {
      type: [Number, String],
      default: 'auto'
    },
    height: {
      type: [Number, String],
      default: 'auto'
    },
    size: {
      type: String
    }
  },
  setup(props) {
    const loading = ref(false)
    const error = ref(false)

    watch(
      () => props.src,
      () => {
        error.value = false
        loading.value = true
      }
    )

    const style = computed(() => ({
      width: props.width,
      height: props.height
    }))

    const imageMogr2 = computed(() => {
      const webp = '/format/webp'
      const thumbnail = `/thumbnail/!${props.thumbnail}p`
      return `imageMogr2${webp}${props.thumbnail ? thumbnail : ''}`
    })

    const onLoad = () => {
      loading.value = false
    }

    const onError = () => {
      error.value = true
      loading.value = true
    }

    return {
      onLoad,
      onError,
      error,
      loading,
      imageMogr2,
      style
    }
  }
})
</script>
