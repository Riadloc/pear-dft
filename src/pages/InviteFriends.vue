<template>
  <div class="invite-friends contact-us h-screen flex flex-col justify-center items-center px-[40px]">
    <pear-navbar title="邀请好友" fixed left-arrow />
    <div class="poster w-full overflow-hidden">
      <template v-if="!loaded">
        <img src="/caterina.jpg" alt="" class="w-full">
        <div class="flex justify-between items-center">
          <div class="p-4">
            <h3 class="text-sm text-bold text-black mb-2">梨数藏</h3>
            <p class="text-xs text-gray-700">精品数字藏品，等你来发现</p>
          </div>
          <img :src="qrcode" alt="" class="w-[96px] h-[96px]" v-if="qrcode">
        </div>
      </template>
    </div>
    <div class="flex justify-around w-full mt-4">
      <div class="flex flex-col items-center" ref="copyLink" :data-clipboard-text="inviteLink">
        <div class="rounded-full p-2 bg-orange-300 w-[2.8rem] h-[2.8rem]"><pear-icon set="ph" name="link-light" size="1.8rem" /></div>
        <h5 class="text-gray-300 mt-2 text-xs">复制链接</h5>
      </div>
      <div class="flex flex-col items-center" @click="() => onShare('poster')">
        <div class="rounded-full p-2 bg-green-300 w-[2.8rem] h-[2.8rem]"><pear-icon set="ph" name="image-light" size="1.8rem" /></div>
        <h5 class="text-gray-300 mt-2 text-xs">分享海报</h5>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import html2canvas from 'html2canvas'
import QRCodeStyling from 'qr-code-styling'
import ClipboardJs from 'clipboard'
import { mapState } from 'pinia'
import { useUserStore } from '@/stores/user.store'
import { Toast } from 'vant'
import { downloadFile } from '@/constants/utils'
export default defineComponent({
  data() {
    return {
      loaded: false,
      qrcode: ''
    }
  },
  setup() {
    const copyLink = ref<any>(null)

    return {
      copyLink
    }
  },
  computed: {
    ...mapState(useUserStore, ['userData']),
    inviteLink() {
      const { userId } = this.userData as any
      return location.origin + `/?code=${userId}`
    }
  },
  async mounted() {
    await this.genQrcode(this.inviteLink)
    const posterDom = document.querySelector('.poster') as HTMLElement
    html2canvas(posterDom).then((canvas) => {
      this.loaded = true
      posterDom.appendChild(canvas)
    })
    const clipboard = new ClipboardJs(this.copyLink)
    clipboard.on('success', (e: any) => {
      Toast('链接已复制到剪贴板')
      e.clearSelection()
    })
  },
  methods: {
    async genQrcode(content: string) {
      const width = 96
      const res = new QRCodeStyling({
        width,
        height: width,
        type: 'canvas',
        data: content,
        dotsOptions: {
          color: '#000',
          type: 'rounded'
        },
        backgroundOptions: {
          color: '#fff'
        },
        imageOptions: {
          crossOrigin: 'anonymous',
          margin: 20
        }
      })
      const blob = await res.getRawData() as Blob
      this.qrcode = window.URL.createObjectURL(blob)
    },
    onShare(type: string) {
      switch (type) {
        case 'link':
        case 'poster': {
          const canvas = document.querySelector('.poster canvas') as HTMLCanvasElement
          canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob as Blob)
            downloadFile(url, '梨数藏.png')
          })
          break
        }
      }
    }
  }
})
</script>

<style lang="less" scoped>
.poster {
  // margin-top: calc(var(--van-nav-bar-height) + 2rem);
}
</style>
