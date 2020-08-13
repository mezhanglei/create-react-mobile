
// tab栏高阶组件
import TabNav from "@/components/tabnav/index";
import loadable from "@/components/lazy";

const Category = loadable({ loader: () => import(/* webpackChunkName: "category" */ '@/pages/index/category/index.js') });

export const CategoryRoutes = [
    {
        path: "/category",
        component: TabNav(Category)
    }
];
