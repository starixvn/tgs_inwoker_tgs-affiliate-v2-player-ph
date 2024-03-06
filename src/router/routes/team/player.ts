import { RouteRecordRaw } from 'vue-router';
export const routes: RouteRecordRaw[] = [
  {
    path: 'player',
    name: 'player',
    props: (route) => ({ perform: route.query.perform }),
    component: () => import('@/views/team/player.vue'),
    meta: { title: 'player', icon: 'me-icon-team' },
  },
];
