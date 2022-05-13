import type { App } from 'vue'
import PearCard from './PearCard.vue'
import PearSmallCard from './PearSmallCard.vue'
import PearIcon from './PearIcon.vue'
import PearImage from './PearImage.vue'
import NavBar from './NavBar.vue'
import PearSpinner from './PearSpinner.vue'
import SearchScreen from './SearchScreen.vue'
import FilterBar from './filter-bar'

export {
  PearIcon,
  PearCard,
  PearSmallCard,
  NavBar,
  FilterBar,
  PearSpinner,
  SearchScreen
}

export default {
  install(app: App): void {
    app
      .component('pear-icon', PearIcon)
      .component('pear-navbar', NavBar)
      .component('pear-image', PearImage)
      .component('pear-spinner', PearSpinner)
  }
}
