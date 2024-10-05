import { createWebHistory, createRouter } from 'vue-router'

import HomeView from './HomeView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/about', component: HomeView },
  { path: '/services', component: HomeView },
  { path: '/contact', component: HomeView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
 export default router;