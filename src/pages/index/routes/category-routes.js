
// tab栏高阶组件
import TabNav from "@/components/tabnav/index";
// 登录拦截高阶组件
import LoginComponent from "@/components/loginWrap/index";

const Category = React.lazy(() => import(/* webpackChunkName: "category" */ '@/pages/index/category/index.js'));

export const CategoryRoutes = [
    {
        path: "/category",
        component: TabNav(Category),
        // 自定义字段，额外的组件信息
        meta: {
            title: "分类",
        }
    }
];
