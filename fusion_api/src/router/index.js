import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ExcelImportView from '../views/ExcelExportView.vue'
import ViewFilesView from "../views/ViewFilesView.vue"

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
      name: 'excel-import',
      component: ExcelImportView
    },
    {
      path: '/viewFiles',
      name: 'view-files',
      component: ViewFilesView
    },
  ]
})

export default router
