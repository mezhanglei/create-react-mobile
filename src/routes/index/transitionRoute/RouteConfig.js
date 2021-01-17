import HomeInfo from "@/pages/index/home/info.js";
import Home from "@/pages/index/home";

export const RouterConfig = [
    {
        path: '/',
        component: Home,
    },
    {
        path: '/home/info/:id',
        component: HomeInfo,
        transitionConfig: {
            enter: 'from-right',
            exit: 'to-right'
        }
    }
];
