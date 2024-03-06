import { RouteRecordRaw } from 'vue-router';
export const routes: RouteRecordRaw[] = [
  {
    path: 'dividend',
    component: () => import('@/views/report/dividend.vue'),
    meta: { title: 'dividend' },
  },
];
