import { useUserStore } from '@/stores/user'
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      meta: {
        requiresAuth: false,
      },
      component: () => import('@/views/auth/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      meta: {
        requiresAuth: false,
      },
      component: () => import('@/views/auth/RegisterView.vue'),
    },
    {
      name: 'verify',
      path: '/verify',
      component: () => import('@/views/auth/VerifyView.vue'),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/',
      name: 'home',
      meta: {
        requiresAuth: false,
      },
      component: () => import('@/views/public/HomeView.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      meta: {
        requiresAuth: true,
      },
      component: () => import('@/views/dashboard/DashboardView.vue'),
    },
    {
      path: '/qr/:qrId?',
      name: 'qr-scanned',
      meta: {
        requiresAuth: false,
      },
      component: () => import('@/views/public/QRScannedView.vue'),
    },
    {
      path: '/checkout/:planId?',
      name: 'checkout',
      meta: {
        requiresAuth: false,
      },
      component: () => import('@/views/public/OrderPlanView.vue'),
    },
    {
      path: '/pricing',
      name: 'pricing',
      meta: {
        requiresAuth: false,
      },
      component: () => import('@/views/public/PricingView.vue'),
    },
    {
      path: '/help',
      name: 'help',
      meta: {
        requiresAuth: false,
      },
      component: () => import('@/views/public/HelpView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      meta: {
        requiresAuth: false,
      },
      component: () => import('@/views/NotFound.vue'),
    },
  ],

  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  const userAuth = useUserStore().getUserId
  const toRouteRequiresAuth = to.meta.requiresAuth

  if (toRouteRequiresAuth && !userAuth) {
    next({ name: 'home' })
    return
  }

  next()
})

export default router
