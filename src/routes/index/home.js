// 登录拦截高阶组件
import LoginComponent from "@/components/login";

export const Home = React.lazy(() => import(/* webpackChunkName: "home" */ "@/pages/index/home/index.js"));

// 首页
export const HomeRoutes = [
    {
        path: "/home",
        component: Home,
        // 自定义字段，额外的组件信息
        meta: {
            title: "首页",
        }
    }
];
