import { HomePage, AboutPage, ListPage, DetailPage } from '@/pages/index/example/index';

export const RouterConfig = [
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
