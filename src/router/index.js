import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../views/Login.vue'
import MultiChords from '../views/MultiChords.vue'
import SiginUp from '../views/SiginUp.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
      meta: {
        authUsuario: true,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/siginup',
      name: 'siginup',
      component: SiginUp,
    },
    {
      path: '/multichords',
      name: 'MultiChords',
      component: MultiChords,
      meta: {
        authUsuario: true,
      },
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (to.meta.authUsuario) {
    const auth = getAuth()

    onAuthStateChanged(auth, () => {
      if (auth.currentUser) {
        if (
          auth.currentUser.emailVerified ||
          auth.currentUser.providerData[0].providerId == 'facebook.com'
        ) {
          next()
        } else {
          next('/login')
        }
      } else {
        next('/login')
      }
    })
  } else {
    next()
  }
})

export default router
