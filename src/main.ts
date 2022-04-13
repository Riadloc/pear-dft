import { createApp } from 'vue'
import router from '@/routes'
import App from './App.vue'
import VantPlugin from './plugins/vant.plugin';
import 'minireset.css'
import '@/assets/index.css'

const app = createApp(App);
app
  .use(VantPlugin)
  .use(router)
  .mount('#app')
