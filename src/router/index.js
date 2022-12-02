import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../views/Login.vue'
import MultiChords from '../views/MultiChords.vue'
import SiginUp from '../views/SiginUp.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
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
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
