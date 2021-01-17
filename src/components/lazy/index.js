import Loadable from "react-loadable";

// 路由懒加载
export default function loadable(configs) {
    return Loadable({
        loading({ isLoading, error }) {
            // 加载过程中
            if (isLoading) {
                return <div>页面已更新，请刷新重试</div>;
                // 加载错误
            } else if (error) {
                console.log(error);
                return <div>Sorry, there was a problem loading the page.</div>;
            } else {
                return null;
            }
        },
        ...configs
    });
};
