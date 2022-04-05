import loadable from "@/components/lazy";

// 首页
export const DemoRoute = [
  {
    path: "/",
    component: loadable({ loader: () => import('@/pages/demo1/index') }),
    exact: true
  },
  {
    path: "/demo1",
    component: loadable({ loader: () => import('@/pages/demo1/index') }),
    // 自定义字段，额外的组件信息
    meta: {
      title: "demo1",
    }
  },
  {
    path: "/demo2",
    component: loadable({ loader: () => import('@/pages/demo2/index') }),
  }
];
