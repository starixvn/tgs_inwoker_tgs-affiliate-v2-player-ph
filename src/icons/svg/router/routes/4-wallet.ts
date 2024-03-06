import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { concatObjectValue } from '@/utils/helper';
export const routes: RouteRecordRaw[] = [
  {
    path: '/wallet',
    component: Layout,
    children: concatObjectValue<RouteRecordRaw>(import.meta.glob('./wallet/*.ts', { eager: true, import: 'routes' })),
    meta: { title: 'wallet', icon: 'mel-icon-WalletFilled' },
  },
];
