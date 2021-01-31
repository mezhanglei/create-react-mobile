import { HomePage, AboutPage, ListPage, DetailPage } from '@/pages/index/example/index';
import HomeInfo from '@/pages/index/home/info';
import TabNav from "@/components/tabnav/index";

export const RouterConfig = [
    {
        path: '/home/info/:id',
        component: TabNav(HomeInfo),
        animationConfig: {
            enter: 'from-bottom',
            exit: 'to-bottom'
        }
    },
    {
        path: '/example',
        component: HomePage
    },
    {
        path: '/about',
        component: AboutPage,
        animationConfig: {
            enter: 'from-bottom',
            exit: 'to-bottom'
        }
    },
    {
        path: '/list',
        component: ListPage,
        animationConfig: {
            enter: 'from-right',
            exit: 'to-right'
        }
    },
    {
        path: '/detail',
        component: DetailPage,
        animationConfig: {
            enter: 'from-right',
            exit: 'to-right'
        }
    }
];
