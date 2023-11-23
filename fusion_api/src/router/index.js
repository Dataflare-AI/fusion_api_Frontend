import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ImportView from '../views/ImportView.vue'
import ExcelContentView from '../views/ExcelContentView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/import',
      name: 'import',
      component: ImportView
    },
    {
      path: '/excel-import',
      name: 'excel-import',
      component: ExcelContentView
    }
  ]
})

export default router
