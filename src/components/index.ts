import type { App } from 'vue'
import PearCard from './PearCard.vue'
import PearSmallCard from './PearSmallCard.vue'
import PearIcon from './PearIcon.vue'
import NavBar from './NavBar.vue'

export {
  PearIcon,
  PearCard,
  PearSmallCard,
  NavBar
}

export default {
  install(app: App): void {
    app
      .component('pear-icon', PearIcon)
      .component('pear-navbar', NavBar)
  }
}
