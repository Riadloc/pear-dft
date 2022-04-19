import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import router from '@/routes'
import VantPlugin from '@/plugins/vant.plugin'
import AxiosPlugin from '@/plugins/axios.plugin'
import GlobalComponent from '@/components'
import '@purge-icons/generated'
import 'minireset.css'
import '@/assets/index.css'

const app = createApp(App)
app
  .use(createPinia())
  .use(router)
  .use(VantPlugin)
  .use(AxiosPlugin)
  .use(GlobalComponent)
  .mount('#app')
