// tab栏高阶组件
import TabNav from "@/components/tabnav/index";
import loadable from "@/components/lazy";

export const Home = loadable({ loader: () => import(/* webpackChunkName: "home" */ '@/pages/index/home/index') });
export const HomeInfo = loadable({ loader: () => import(/* webpackChunkName: "home" */ '@/pages/index/home/info') });

// 首页
export const HomeRoutes = [
    {
        path: "/home",
        component: TabNav(Home),
        exact: true
    }
];
