import * as VueRouter from 'vue-router';

const Home = () => import('@/pages/home.vue')

const routes = [
  {
    path: '/',
    component: Home
  }
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes
})

export default router;