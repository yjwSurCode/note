import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
  },

  
  {
    path: '/fetch-demo',
    name: 'FetchDemo',



    component: () => import('../views/FetchDemo.vue'),
  },
  {
    path: '/figma',
    name: 'FigmaGenerated',
    component: () => import('../views/FigmaGenerated.vue'),
  },
  {
    path: '/figma-0-88',
    name: 'FigmaProfile0_88',
    component: () => import('../views/FigmaProfile_0_88.vue'),
  },
  {
    path: '/figma-research',
    name: 'FigmaResearch',
    component: () => import('../views/FigmaResearch.vue'),
  },
  {
    path: '/figma-ux',
    name: 'FigmaUX',
    component: () => import('../views/FigmaUX.vue'),
  },
  {
    path: '/figma-ui',
    name: 'FigmaUI',
    component: () => import('../views/FigmaUI.vue'),
  },
  {
    path: '/pixso-design',
    name: 'PixsoDesign',
    component: () => import('../views/PixsoDesign.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
