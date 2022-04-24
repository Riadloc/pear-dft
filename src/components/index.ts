import type { App } from 'vue'
import PearCard from './PearCard.vue'
import PearSmallCard from './PearSmallCard.vue'
import PearIcon from './PearIcon.vue'
import PearImage from './PearImage.vue'
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
      .component('pear-image', PearImage)
  }
}
