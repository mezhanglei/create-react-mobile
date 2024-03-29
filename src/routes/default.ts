import loadable from "./loadable";

// 默认的部分
export const DefaultRoutes = [
  // 404页面路由
  {
    path: "/not-found",
    component: loadable(() => import('@/components/default/not-found'))
  },
  // 不是微信的页面
  {
    path: "/not-wechat",
    component: loadable(() => import('@/components/default/not-wechat'))
  },
  {
    path: "/auth-wechat",
    component: loadable(() => import('@/components/default/wechat-auth'))
  },
];
