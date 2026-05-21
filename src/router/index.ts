import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/palpites',
      name: 'palpites',
      component: () => import('../views/PalpitesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/ranking',
      name: 'ranking',
      component: () => import('../views/RankingView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

// Guard de navegação para verificar autenticação
router.beforeEach((to, from, next) => {
  const participant = localStorage.getItem('participant')
  
  if (to.meta.requiresAuth && !participant) {
    next({ name: 'login' })
  } else if (to.name === 'login' && participant) {
    next({ name: 'palpites' })
  } else {
    next()
  }
})

export default router
