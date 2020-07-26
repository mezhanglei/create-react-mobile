// 登录拦截高阶组件
import LoginComponent from "@/components/login";

const Cart = React.lazy(() => import(/* webpackChunkName: "cart" */ '@/pages/index/cart/index.js'));

export const CartRoutes = [
    {
        path: "/cart",
        component: Cart,
        // 自定义字段，额外的组件信息
        meta: {
            title: "购物车",
        }
    }
];
