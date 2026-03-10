import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import QuizPage from '../views/QuizPage.vue'
import AdminView from '../views/AdminView.vue'
import HighscoreView from '../views/HighscoreView.vue'

const routes = [
  {
    path: '/',
    redirect: '/quiz'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { guest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    meta: { guest: true }
  },
  {
    path: '/quiz',
    name: 'Quiz',
    component: QuizPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/highscore',
    name: 'Highscore',
    component: HighscoreView
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/quiz'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  // Redirect logged-in users away from guest-only pages
  if (to.meta.guest && token) {
    return next('/quiz')
  }

  // Redirect unauthenticated users to login
  if (to.meta.requiresAuth && !token) {
    return next('/login')
  }

  // Redirect non-admin users away from admin page
  if (to.meta.requiresAdmin && user?.role !== 'admin') {
    return next('/quiz')
  }

  next()
})

export default router
