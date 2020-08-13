// tab栏高阶组件
import TabNav from "@/components/tabnav/index";
import loadable from "@/components/lazy";

const Cart = loadable({ loader: () => import(/* webpackChunkName: "cart" */ '@/pages/index/cart/index.js') });

export const CartRoutes = [
    {
        path: "/cart",
        component: TabNav(Cart)
    }
];
