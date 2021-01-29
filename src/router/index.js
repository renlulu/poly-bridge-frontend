import Vue from 'vue';
import VueRouter from 'vue-router';
import { IN_PRODUCTION, TARGET_MAINNET } from '@/utils/env';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/home'),
  },
  {
    path: '/transactions',
    name: 'transactions',
    component: () => import('@/views/transactions'),
  },
];

const router = new VueRouter({
  base: !IN_PRODUCTION || TARGET_MAINNET ? '/' : '/testnet/',
  mode: 'history',
  routes: routes.filter(route => route),
});

router.beforeEach((to, from, next) => {
  return next();
});

export default router;
