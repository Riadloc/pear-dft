import * as VueRouter from 'vue-router'
import { useUserStore } from '@/stores/user.store'
import { setInviteCode } from '@/constants/utils'

const HomeWrapper = () => import('@/views/HomeWrapper.vue')
const MainHome = () => import('@/views/MainHome.vue')
const MyZone = () => import('@/views/MainMyZone.vue')
const Collect = () => import('@/views/MainCollect.vue')
const Market = () => import('@/views/MainMarket.vue')
const Login = () => import('@/views/PLogin.vue')
const Signup = () => import('@/views/PSignup.vue')
const Detail = () => import('@/views/MajorDetail.vue')
const OrderList = () => import('@/views/OrderList.vue')
const OrderDetail = () => import('@/views/OrderDetail.vue')
const ContactUs = () => import('@/views/ContactUs.vue')
const CustomSetting = () => import('@/views/CustomSetting.vue')
const PayPage = () => import('@/views/PayPage.vue')
const UserSetting = () => import('@/views/UserSetting.vue')
const InviteFriends = () => import('@/views/InviteFriends.vue')
const MyInvitation = () => import('@/views/MyInvitation.vue')
const AuthorizedIdentity = () => import('@/views/AuthorizedIdentity.vue')
const MailBind = () => import('@/views/MailBind.vue')
const MyWallet = () => import('@/views/MyWallet.vue')
const BankCardBind = () => import('@/views/BankCardBind.vue')
const PaySafety = () => import('@/views/PaySafety.vue')
const TopUp = () => import('@/views/TopUp.vue')
const TopUpStore = () => import('@/views/TopUpStore.vue')
const DrawCash = () => import('@/views/DrawCash.vue')
const PutOnMarket = () => import('@/views/PutOnMarket.vue')
const SecondaryDetail = () => import('@/views/SecondaryDetail.vue')
const InfoList = () => import('@/views/InfoList.vue')
const ComposeLab = () => import('@/views/ComposeLab.vue')

const BusinessAgreement = () => import('@/views/info-views/BusinessAgreement.vue')
const UserAgreement = () => import('@/views/info-views/UserAgreement.vue')
const PrivacyAgreement = () => import('@/views/info-views/PrivacyAgreement.vue')

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
    path: '/setting',
    component: CustomSetting
  },
  {
    path: '/pay',
    name: 'PayPage',
    component: PayPage,
    props: true
  },
  {
    path: '/certify',
    name: 'AuthorizedIdentity',
    component: AuthorizedIdentity
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
    path: '/paySafety',
    name: 'PaySafety',
    component: PaySafety
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
  return true
})

export default router
