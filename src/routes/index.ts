import * as VueRouter from 'vue-router'
import * as Cookie from 'cookie'
import { useUserStore } from '@/stores/user.store'

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
const TopUp = () => import('@/views/TopUp.vue')
const DrawCash = () => import('@/views/DrawCash.vue')
const PutOnMarket = () => import('@/views/PutOnMarket.vue')
const SecondaryDetail = () => import('@/views/SecondaryDetail.vue')

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
    path: '/topUp',
    name: 'TopUp',
    component: TopUp
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
  }
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes
})

router.beforeEach(async (to) => {
  const store = useUserStore()
  const { meta } = to
  const cookies = Cookie.parse(document.cookie)
  const isCookieExpired = !(cookies && cookies['connect.sid'])
  const userId = localStorage.getItem('user.id')
  if (userId) {
    console.log(isCookieExpired, store.isLoggedIn)
    if (isCookieExpired && !store.isLoggedIn) {
      const res = await store.getUserInfo(userId)
      if (!res) {
        return '/login'
      }
      return true
    }
    if (!store.isWalletFetched) {
      store.getWalletInfo()
    }
    return true
  } else if (store.isLoggedIn && store.userData.id) {
    localStorage.setItem('user.id', `${store.userData.userId}`)
    return true
  }
  if (meta.requiresAuth !== false) {
    return '/login'
  }
  return true
})

export default router
