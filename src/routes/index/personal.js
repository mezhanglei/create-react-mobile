// 登录拦截高阶组件
import LoginComponent from "@/components/login";

const Personal = React.lazy(() => import(/* webpackChunkName: "personal" */ '@/pages/index/personal/index.js'));


// 个人中心模块
export const PersonalRoutes = [
    {
        path: "/personal",
        component: Personal,
        // 自定义字段，额外的组件信息
        meta: {
            title: "个人中心",
        }
    }
];
