import type { App } from '@vue/runtime-dom'
import { Tabbar, TabbarItem, List, Cell, Swipe, SwipeItem } from 'vant';

export default {
  install(app: App): void {
    app
      .use(Tabbar)
      .use(TabbarItem)
      .use(List)
      .use(Cell)
      .use(Swipe)
      .use(SwipeItem)
  }
}