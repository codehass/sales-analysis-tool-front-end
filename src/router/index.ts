import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '@/views/DashboardView.vue';
import ProductsView from '@/views/ProductsView.vue';
import '@/assets/tailwind.css';

const routes = [
  { path: '/',
    name: 'DashboardView',
    component: DashboardView
  },
  { path: '/products',
    name: 'ProductsView',
    component: ProductsView 
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
