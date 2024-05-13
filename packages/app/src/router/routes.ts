import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('pages/home/index.vue'),
    children: [
      {
        path: 'schedule',
        component: () => import('pages/home/schedule/index.vue'),
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/error-not-found.vue'),
  },
];

export default routes;
