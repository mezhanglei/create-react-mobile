import loadable from "@/components/lazy";

const Demo1 = loadable({ loader: () => import(/* webpackChunkName: "default" */ '@/pages/index/demo1') });
const Demo2 = loadable({ loader: () => import(/* webpackChunkName: "default" */ '@/pages/index/demo2') });

// 默认的部分
export const DemoRoutes = [
    {
        path: "/",
        component: Demo1,
        // 路由为/时必须设置exact为true
        exact: true
    },
    {
        path: "/demo1",
        component: Demo1
    },
    {
        path: "/demo2",
        component: Demo2
    }
];
