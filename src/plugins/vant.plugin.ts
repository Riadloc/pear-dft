import type { App } from 'vue'
import {
  Button,
  Tabbar,
  TabbarItem,
  List,
  Cell,
  Swipe,
  SwipeItem,
  Form,
  Field,
  CellGroup,
  ConfigProvider,
  Icon,
  RadioGroup,
  Radio,
  NavBar,
  Sticky,
  CountDown,
  Search,
  Tab,
  Tabs,
  Notify,
  Loading,
  Uploader,
  PullRefresh,
  NumberKeyboard,
  Dialog,
  NoticeBar,
  Popover,
  Progress,
  Overlay,
  ShareSheet,
  PasswordInput,
  Stepper,
  Image as VanImage
} from 'vant'

export default {
  install(app: App): void {
    app
      .use(Button)
      .use(Tabbar)
      .use(TabbarItem)
      .use(List)
      .use(Cell)
      .use(Swipe)
      .use(SwipeItem)
      .use(Form)
      .use(Field)
      .use(CellGroup)
      .use(ConfigProvider)
      .use(Icon)
      .use(RadioGroup)
      .use(Radio)
      .use(NavBar)
      .use(Sticky)
      .use(VanImage)
      .use(CountDown)
      .use(Search)
      .use(Tab)
      .use(Tabs)
      .use(Loading)
      .use(Uploader)
      .use(PullRefresh)
      .use(NumberKeyboard)
      .use(PasswordInput)
      .use(Dialog)
      .use(Notify)
      .use(NoticeBar)
      .use(Overlay)
      .use(Popover)
      .use(Stepper)
      .use(Progress)
      .use(ShareSheet)
    app.config.globalProperties.$back = history.back
  }
}
