import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
export const routes: RouteRecordRaw[] = [
  {
    path: '/account',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/account/index.vue'),
        meta: { title: 'account', icon: 'me-icon-account' },
        props: (route) => ({ perform: route.query.perform }),
      },
    ],
  },
];
