import * as VueRouter from 'vue-router'
import { useUserStore } from '@/stores/user.store'
import { setInviteCode } from '@/constants/utils'

/** 首页带底部navbar的容器页面 */
const HomeWrapper = () => import('@/views/HomeWrapper.vue')
/** 首页-主页面 */
const MainHome = () => import('@/views/MainHome.vue')
/** 首页-个人中心 */
const MyZone = () => import('@/views/MainMyZone.vue')
/** 首页-我的藏品 */
const Collect = () => import('@/views/MainCollect.vue')
/** 首页-市场 */
const Market = () => import('@/views/MainMarket.vue')
/** 登录页面 */
const Login = () => import('@/views/PLogin.vue')
/** 注册页 */
const Signup = () => import('@/views/PSignup.vue')
/** 详情页 */
const Detail = () => import('@/views/MajorDetail.vue')
/** 我的订单 */
const OrderList = () => import('@/views/OrderList.vue')
/** 订单详情 */
const OrderDetail = () => import('@/views/OrderDetail.vue')
/** 联系我们 */
const ContactUs = () => import('@/views/ContactUs.vue')
/** 个人中心-设置页 */
const UserSetting = () => import('@/views/UserSetting.vue')
/** 邀请有礼 */
const InviteFriends = () => import('@/views/InviteFriends.vue')
/** 我的邀请 */
const MyInvitation = () => import('@/views/MyInvitation.vue')
/** 实名认证 */
const AuthorizedIdentity = () => import('@/views/AuthorizedIdentity.vue')
const AuthorizedIdentity2 = () => import('@/views/AuthorizedIdentity2.vue')
const MailBind = () => import('@/views/MailBind.vue')
/** 我的钱包 */
const MyWallet = () => import('@/views/MyWallet.vue')
/** 银行卡绑定 */
const BankCardBind = () => import('@/views/BankCardBind.vue')
/** 银行卡解绑 */
const BankCardUnbind = () => import('@/views/BankCardUnbind.vue')
/** 银行卡管理 */
const BankCardList = () => import('@/views/BankCardList.vue')
/** 支付密码 */
const PaySafety = () => import('@/views/PaySafety.vue')
const DrawCashSafety = () => import('@/views/DrawCashSafety.vue')
const TopUp = () => import('@/views/TopUp.vue')
/** 充值页（商城储蓄卡） */
const TopUpStore = () => import('@/views/TopUpStore.vue')
/** 提现 */
const DrawCash = () => import('@/views/DrawCash.vue')
const DrawCashContinue = () => import('@/views/DrawCashContinue.vue')
const PutOnMarket = () => import('@/views/PutOnMarket.vue')
/** 二级市场页面 */
const SecondaryDetail = () => import('@/views/SecondaryDetail.vue')
/** 关于我们 */
const InfoList = () => import('@/views/InfoList.vue')
/** 合成列表页（开发中） */
const ComposeList = () => import('@/views/ComposeList.vue')
/** 合成页（开发中） */
const ComposeLab = () => import('@/views/ComposeLab.vue')
/** 连连支付-开户  */
const ApplyLianlianUser = () => import('@/views/ApplyLianlianUser.vue')
const RankList = () => import('@/views/RankList.vue')

/** 商户协议（需替换） */
const BusinessAgreement = () => import('@/views/info-views/BusinessAgreement.vue')
/** 用户协议 */
const UserAgreement = () => import('@/views/info-views/UserAgreement.vue')
/** 隐私协议 */
const PrivacyAgreement = () => import('@/views/info-views/PrivacyAgreement.vue')
/** 连连支付-用户协议 */
const LianlianUserAgreement = () => import('@/views/info-views/LianlianUserAgreement.vue')

/** 简单的layout */
const NormalLayout = () => import('@/layouts/NormalLayout.vue')

const routes = [
  {
    path: '/',
    component: HomeWrapper,
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: MainHome,
        meta: {
          requiresAuth: false
        }
      },
      {
        path: 'market',
        name: 'Market',
        component: Market
      },
      {
        path: 'collect',
        name: 'Collect',
        component: Collect
      },
      {
        path: 'mine',
        name: 'Mine',
        component: MyZone
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/detail',
    name: 'Detail',
    component: Detail
  },
  {
    path: '/orderList',
    component: OrderList
  },
  {
    path: '/orderDetail',
    name: 'OrderDetail',
    component: OrderDetail
  },
  {
    path: '/contact',
    component: ContactUs
  },
  {
    path: '/composeList',
    component: ComposeList
  },
  {
    path: '/certify',
    name: 'AuthorizedIdentity',
    component: AuthorizedIdentity
  },
  {
    path: '/authorized',
    name: 'AuthorizedIdentity2',
    component: AuthorizedIdentity2
  },
  {
    path: '/user',
    name: 'UserSetting',
    component: UserSetting
  },
  {
    path: '/invite',
    name: 'Invite',
    component: InviteFriends
  },
  {
    path: '/my-invitation',
    name: 'MyInvitation',
    component: MyInvitation
  },
  {
    path: '/email',
    name: 'MailBind',
    component: MailBind
  },
  {
    path: '/wallet',
    name: 'MyWallet',
    component: MyWallet
  },
  {
    path: '/bankCardBind',
    name: 'BankCardBind',
    component: BankCardBind
  },
  {
    path: '/bankCardUnbind',
    name: 'BankCardUnbind',
    component: BankCardUnbind
  },
  {
    path: '/bankCardList',
    name: 'BankCardList',
    component: BankCardList
  },
  {
    path: '/paySafety',
    name: 'PaySafety',
    component: PaySafety
  },
  {
    path: '/drawCashSafety',
    name: 'DrawCashSafety',
    component: DrawCashSafety
  },
  {
    path: '/topUp',
    name: 'TopUp',
    component: TopUp
  },
  {
    path: '/topUpStore',
    name: 'TopUpStore',
    component: TopUpStore
  },
  {
    path: '/drawCash',
    name: 'DrawCash',
    component: DrawCash
  },
  {
    path: '/drawCashContinue',
    name: 'DrawCashContinue',
    component: DrawCashContinue
  },
  {
    path: '/putOnMarket',
    name: 'PutOnMarket',
    component: PutOnMarket
  },
  {
    path: '/secondaryDetail',
    name: 'SecondaryDetail',
    component: SecondaryDetail
  },
  {
    path: '/infomation',
    name: 'Info',
    component: InfoList
  },
  {
    path: '/composeLab',
    name: 'ComposeLab',
    component: ComposeLab
  },
  {
    path: '/applyLianlianUser',
    name: 'ApplyLianlianUser',
    component: ApplyLianlianUser
  },
  {
    path: '/rankList',
    name: 'RankList',
    component: RankList
  },
  {
    path: '/agreement',
    name: 'Agreement',
    component: NormalLayout,
    meta: {
      requiresAuth: false
    },
    children: [
      {
        path: 'user',
        name: 'UserAgreement',
        component: UserAgreement,
        meta: {
          requiresAuth: false
        }
      },
      {
        path: 'privacy',
        name: 'PrivacyAgreement',
        component: PrivacyAgreement,
        meta: {
          requiresAuth: false
        }
      },
      {
        path: 'business',
        name: 'BusinessAgreement',
        component: BusinessAgreement,
        meta: {
          requiresAuth: false
        }
      },
      {
        path: 'lianlianUser',
        name: 'LianlianUserAgreement',
        component: LianlianUserAgreement,
        meta: {
          requiresAuth: false
        }
      }
    ]
  }
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes
})

router.beforeEach(async (to) => {
  const store = useUserStore()
  const { meta } = to
  setInviteCode()
  if (meta.requiresAuth !== false) {
    if (!store.isLoggedIn) {
      const res = await store.getUserInfo()
      if (!res) {
        return '/login'
      }
    }
    if (!store.isWalletFetched) {
      store.getWalletInfo()
    }
  }
  if (to.name === 'AuthorizedIdentity') {
    if (store.userData.userId === 1285306) {
      return '/authorized'
    }
  }
  return true
})

export default router
