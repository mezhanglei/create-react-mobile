import Loader from "./loader";

let container;
// 实例化容器
const getContainer = (props) => {
    // 保证只有一个容器
    if (!container) {
        container = Loader.showInstance(props);
    }
    return container;
};

export default {
    init: (props) => {
        // 异步延迟加载以遍页面实例化后再执行
        setTimeout(() => {
            const instance = getContainer(props);
            instance.init();
            return instance;
        }, 100);
    },
    start: (props) => {
        setTimeout(() => {
            const instance = getContainer(props);
            instance.start();
            return instance;
        }, 100);
    },
    end: (props) => {
        setTimeout(() => {
            const instance = getContainer(props);
            instance.end();
            return instance;
        }, 100);
    }
};
