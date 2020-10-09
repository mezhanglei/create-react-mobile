import showInstance from "./loader";

let container;
// 单例
const getContainer = (props) => {
    if (!container) {
        container = showInstance(props);
    }
    return container;
};

// 调用的时候异步调用，因为页面可能没有加载完
export default {
    start: (props) => {
        const result = getContainer(props);
        result.start();
        return result;
    },
    end: (props) => {
        const result = getContainer(props);
        result.end();
        return result;
    },
    destroy: (props) => {
        const result = getContainer(props);
        result.destroy();
        return result;
    }
};
