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
  Checkbox,
  NavBar,
  Sticky,
  CountDown,
  Search,
  Tab,
  Tabs,
  Notify,
  Loading,
  PullRefresh,
  NumberKeyboard,
  Dialog,
  NoticeBar,
  Progress,
  Overlay,
  ActionSheet,
  PasswordInput,
  Stepper,
  Step,
  Steps,
  Popup,
  Tag,
  Badge,
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
      .use(Checkbox)
      .use(NavBar)
      .use(Sticky)
      .use(VanImage)
      .use(CountDown)
      .use(Search)
      .use(Tab)
      .use(Tabs)
      .use(Loading)
      .use(PullRefresh)
      .use(NumberKeyboard)
      .use(PasswordInput)
      .use(Dialog)
      .use(Notify)
      .use(NoticeBar)
      .use(Overlay)
      .use(ActionSheet)
      .use(Stepper)
      .use(Progress)
      .use(Step)
      .use(Steps)
      .use(Popup)
      .use(Tag)
    app.use(Badge)
    app.config.globalProperties.$back = history.back
  }
}
