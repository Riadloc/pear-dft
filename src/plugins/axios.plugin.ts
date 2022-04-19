import type { App } from 'vue'
import request from '@/assets/request'

export default {
  install(app: App): void {
    app.config.globalProperties.$axios = request
  }
}
