
// tab栏高阶组件
import TabNav from "@/components/tabnav/index";
// 登录拦截高阶组件
import LoginComponent from "@/components/login/index";

const Personal = React.lazy(() => import(/* webpackChunkName: "personal" */ '@/pages/index/personal/index.js'));


// 个人中心模块
export const PersonalRoutes = [
    {
        path: "/personal",
        component: TabNav(Personal)
    }
];
