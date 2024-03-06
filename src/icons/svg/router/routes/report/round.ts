import { RouteRecordRaw } from 'vue-router';
export const routes: RouteRecordRaw[] = [
  {
    path: 'round',
    component: () => import('@/views/report/round.vue'),
    meta: { title: 'round' },
  },
];
