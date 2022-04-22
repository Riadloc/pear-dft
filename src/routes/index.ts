import * as VueRouter from 'vue-router'
import * as Cookie from 'cookie'
import { useUserStore } from '@/stores/user.store'

const HomeWrapper = () => import('@/pages/HomeWrapper.vue')
const MainHome = () => import('@/pages/MainHome.vue')
const MyZone = () => import('@/pages/MainMyZone.vue')
const Collect = () => import('@/pages/MainCollect.vue')
const Login = () => import('@/pages/PLogin.vue')
const Signup = () => import('@/pages/PSignup.vue')
const Detail = () => import('@/pages/PDetail.vue')
const OrderList = () => import('@/pages/OrderList.vue')
const ContactUs = () => import('@/pages/ContactUs.vue')
const CustomSetting = () => import('@/pages/CustomSetting.vue')
const PayPage = () => import('@/pages/PayPage.vue')
const GoodCreateForm = () => import('@/pages/GoodCreateForm.vue')
const UserSetting = () => import('@/pages/UserSetting.vue')
const AuthorizedIdentity = () => import('@/pages/AuthorizedIdentity.vue')

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
    path: '/goods/create',
    name: 'GoodCreate',
    component: GoodCreateForm
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
