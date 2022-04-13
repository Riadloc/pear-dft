import { createApp } from 'vue'
import App from './App.vue'
import VantPlugin from './plugins/vant.plugin';
import 'minireset.css'

const app = createApp(App);
app
  .use(VantPlugin)
  .mount('#app')
