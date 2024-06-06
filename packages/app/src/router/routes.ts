import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/schedule/editor',
    component: () => import('pages/home/schedule/editor.vue'),
    meta: {
      depth: 1,
    },
  },
  {
    path: '/geo',
    component: () => import('pages/geo/index.vue'),
    meta: {
      depth: 1,
    },
  },
  {
    path: '/',
    component: () => import('pages/home/index.vue'),
    children: [
      {
        path: 'schedule',
        component: () => import('pages/home/schedule/index.vue'),
        meta: {
          depth: 2,
        },
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/error-not-found.vue'),
  },
];

export default routes;
