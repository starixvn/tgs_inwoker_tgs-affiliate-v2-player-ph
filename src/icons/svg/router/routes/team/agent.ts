import { RouteRecordRaw } from 'vue-router';
export const routes: RouteRecordRaw[] = [
  {
    path: 'agent',
    name: 'agent',
    props: (route) => ({ perform: route.query.perform }),
    component: () => import('@/views/team/agent.vue'),
    meta: { title: 'agent' },
  },
];
