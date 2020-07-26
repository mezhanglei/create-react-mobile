// 登录拦截高阶组件
import LoginComponent from "@/components/login";

const Category = React.lazy(() => import(/* webpackChunkName: "category" */ '@/pages/index/category/index.js'));

export const CategoryRoutes = [
    {
        path: "/category",
        component: Category,
        // 自定义字段，额外的组件信息
        meta: {
            title: "分类",
        }
    }
];
