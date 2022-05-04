import * as VueRouter from 'vue-router'
import * as Cookie from 'cookie'
import { useUserStore } from '@/stores/user.store'

const HomeWrapper = () => import('@/views/HomeWrapper.vue')
const MainHome = () => import('@/views/MainHome.vue')
const MyZone = () => import('@/views/MainMyZone.vue')
const Collect = () => import('@/views/MainCollect.vue')
const Login = () => import('@/views/PLogin.vue')
const Signup = () => import('@/views/PSignup.vue')
const Detail = () => import('@/views/PDetail.vue')
const OrderList = () => import('@/views/OrderList.vue')
const ContactUs = () => import('@/views/ContactUs.vue')
const CustomSetting = () => import('@/views/CustomSetting.vue')
const PayPage = () => import('@/views/PayPage.vue')
const UserSetting = () => import('@/views/UserSetting.vue')
const InviteFriends = () => import('@/views/InviteFriends.vue')
const MyInvitation = () => import('@/views/MyInvitation.vue')
const AuthorizedIdentity = () => import('@/views/AuthorizedIdentity.vue')
const MailBind = () => import('@/views/MailBind.vue')

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
    path: '/detail/:id',
    name: 'Detail',
    component: Detail
  },
  {
    path: '/orderList',
    component: OrderList
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
  }
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes
})

router.beforeEach(async (to) => {
  const store = useUserStore()
  const { meta } = to
  if (meta.requiresAuth !== false) {
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
      return true
    } else if (store.isLoggedIn && store.userData.id) {
      localStorage.setItem('user.id', `${store.userData.userId}`)
      return true
    }
    return '/login'
  }
  return true
})

export default router
