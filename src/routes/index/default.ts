import loadable from "@/components/lazy";

const NotWechat = loadable({ loader: () => import(/* webpackChunkName: "default" */ '@/components/default/not-wechat') });
const NotFound = loadable({ loader: () => import(/* webpackChunkName: "default" */ '@/components/default/not-found') });
const AuthWechat = loadable({ loader: () => import(/* webpackChunkName: "default" */ '@/components/default/wechat-auth') });

// 默认的部分
export const DefaultRoutes = [
    // 404页面路由
    {
        path: "/not-found",
        component: NotFound
    },
    // 不是微信的页面
    {
        path: "/not-wechat",
        component: NotWechat
    },
    {
        path: "/auth-wechat",
        component: AuthWechat
    },
];
