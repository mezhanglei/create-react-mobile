// tab栏高阶组件
import TabNav from "@/components/tabnav/index";

const NotWechat = React.lazy(() => import(/* webpackChunkName: "cart" */ '@/pages/index/default/not-wechat'));
const NotFound = React.lazy(() => import(/* webpackChunkName: "cart" */ '@/pages/index/default/not-found'));
const AuthWechat = React.lazy(() => import(/* webpackChunkName: "cart" */ '@/pages/index/default/wechat-auth'));

// 一些路由页面
export const DefaultRoutes = [
    // 404页面路由
    {
        path: "/not-found",
        component: TabNav(NotFound)
    },
    // 不是微信的页面
    {
        path: "/not-wechat",
        component: TabNav(NotWechat)
    },
    {
        path: "/auth-wechat",
        component: TabNav(AuthWechat)
    },
];
