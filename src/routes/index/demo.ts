import loadable from "@/components/lazy";

export const Demo1 = loadable({ loader: () => import(/* webpackChunkName: "default" */ '@/pages/index/demo1') });

// 默认的部分
export const DemoRoutes = [
    // 404页面路由
    {
        path: "/demo1",
        component: Demo1
    }
];
