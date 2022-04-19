import type { App } from 'vue'
import PearCard from './PearCard.vue'
import PearSmallCard from './PearSmallCard.vue'
import PearIcon from './PearIcon.vue'

export {
  PearIcon,
  PearCard,
  PearSmallCard
}

export default {
  install(app: App): void {
    app
      .component('pear-icon', PearIcon)
  }
}
