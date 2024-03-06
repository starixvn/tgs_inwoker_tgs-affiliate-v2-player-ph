import { RouteRecordRaw } from 'vue-router';
export const routes: RouteRecordRaw[] = [
  {
    path: 'winloss',
    component: () => import('@/views/report/winloss.vue'),
    meta: { title: 'winlossReport' },
  },
];
