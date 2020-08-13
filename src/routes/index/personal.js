
// tab栏高阶组件
import TabNav from "@/components/tabnav/index";
import loadable from "@/components/lazy";

const Personal = loadable({ loader: () => import(/* webpackChunkName: "personal" */ '@/pages/index/personal/index.js') });

// 个人中心模块
export const PersonalRoutes = [
    {
        path: "/personal",
        component: TabNav(Personal)
    }
];
