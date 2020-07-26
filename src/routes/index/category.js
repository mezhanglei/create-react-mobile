
// tab栏高阶组件
import TabNav from "@/components/tabnav/index";
// 登录拦截高阶组件
import LoginComponent from "@/components/login/index";

const Category = React.lazy(() => import(/* webpackChunkName: "category" */ '@/pages/index/category/index.js'));

export const CategoryRoutes = [
    {
        path: "/category",
        component: TabNav(Category)
    }
];
