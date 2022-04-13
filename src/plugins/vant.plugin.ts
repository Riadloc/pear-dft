import type { App } from '@vue/runtime-dom'
import { Tabbar, TabbarItem } from 'vant';

export default {
  install(app: App): void {
    app.use(Tabbar);
    app.use(TabbarItem);
  }
}