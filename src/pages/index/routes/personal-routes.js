
// tab栏高阶组件
import TabNav from "@/components/tabnav/index";
// 登录拦截高阶组件
import LoginComponent from "@/components/loginWrap/index";

const Personal = React.lazy(() => import(/* webpackChunkName: "personal" */ '@/pages/index/personal/index.js'));

export const PersonalRoutes = [
    {
        path: "/personal",
        component: TabNav(Personal),
        // 自定义字段，额外的组件信息
        meta: {
            title: "个人中心",
        }
    }
];
