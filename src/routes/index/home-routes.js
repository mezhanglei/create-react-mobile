// tab栏高阶组件
import TabNav from "@/components/tabnav/index";
// 登录拦截高阶组件
import LoginComponent from "@/components/login/index";

export const Home = React.lazy(() => import(/* webpackChunkName: "home" */ "@/pages/index/home/index.js"));
export const HomeInfo = React.lazy(() => import(/* webpackChunkName: "home" */ "@/pages/index/home/info.js"));

// 首页
export const HomeRoutes = [
    {
        path: "/home",
        component: TabNav(Home),
        // 自定义字段，额外的组件信息
        meta: {
            title: "首页",
        }
    }
];
