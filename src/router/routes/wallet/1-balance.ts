import { RouteRecordRaw } from 'vue-router';
export const routes: RouteRecordRaw[] = [
  {
    path: 'balance',
    component: () => import('@/views/wallet/balance.vue'),
    meta: { title: 'balanceHistory' },
  },
];
