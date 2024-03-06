import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
export const routes: RouteRecordRaw[] = [
  {
    path: '/landing',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/landing/index.vue'),
        meta: { hideMenu: true, title: 'Agent Admin 2.0', affix: true, icon: 'mel-icon-Avatar' },
      },
    ],
  },
];
