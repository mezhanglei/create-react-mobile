import loadable from "./loadable";

export const DemoRoutes = [
  {
    path: "/",
    component: loadable(() => import('@/pages/demo1/index'))
  },
  {
    path: "/demo1",
    component: loadable(() => import('@/pages/demo1/index'))
  },
  {
    path: "/demo2",
    component: loadable(() => import('@/pages/demo2/index'))
  },
];
