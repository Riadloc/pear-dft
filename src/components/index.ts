import type { App } from 'vue'
import PearCard from './PearCard.vue'
import PearSmallCard from './PearSmallCard.vue'
import PearIcon from './PearIcon.vue'
import PearImage from './PearImage.vue'
import PearTips from './PearTips.vue'
import NavBar from './NavBar.vue'
import PearSpinner from './PearSpinner.vue'
import PearCaptcha from './PearCaptcha.vue'
import PearRegistration from './PearRegistration.vue'
import SearchScreen from './SearchScreen.vue'
import FilterBar from './filter-bar'
import WalletRecordList from './WalletRecordList.vue'
import YidunCaptcha from './YidunCaptcha.vue'
import TypingPasswordDialog from './TypingPasswordDialog.vue'

export {
  PearIcon,
  PearCard,
  PearSmallCard,
  NavBar,
  FilterBar,
  PearSpinner,
  SearchScreen,
  WalletRecordList,
  TypingPasswordDialog
}

export default {
  install(app: App): void {
    app
      .component('pear-icon', PearIcon)
      .component('pear-navbar', NavBar)
      .component('pear-image', PearImage)
      .component('pear-tips', PearTips)
      .component('pear-spinner', PearSpinner)
      .component('pear-captcha', PearCaptcha)
      .component('yidun-captcha', YidunCaptcha)
      .component('pear-registration', PearRegistration)
      .component('typing-password-dialog', TypingPasswordDialog)
  }
}
