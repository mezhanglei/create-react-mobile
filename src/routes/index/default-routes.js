// tab栏高阶组件
import TabNav from "@/components/tabnav/index";

const NotWechat = React.lazy(() => import(/* webpackChunkName: "cart" */ '@/components/default/not-wechat'));
const NotFound = React.lazy(() => import(/* webpackChunkName: "cart" */ '@/components/default/not-found'));
const AuthWechat = React.lazy(() => import(/* webpackChunkName: "cart" */ '@/components/default/wechat-auth'));

// 默认的部分
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
