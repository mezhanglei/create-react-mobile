import showInstance from "./ToastsContainer";

let container;

// 实例化容器
const getContainer = (props) => {
    // 保证只有一个容器
    if (!container) {
        container = showInstance(props);
    }
    return container;
};

// 触发渲染toast的方法
const render = (props) => {
    let result = getContainer(props);
    result && result.show();
};

// 调用的时候异步调用，因为页面可能没有加载完
export default {
    success: (message, timer, classNames) => {
        setTimeout(() => {
            render({ status: "success", message, timer, classNames });
        });
    },
    info: (message, timer, classNames) => {
        setTimeout(() => {
            render({ status: "info", message, timer, classNames });
        });
    },
    warning: (message, timer, classNames) => {
        setTimeout(() => {
            render({ status: "warning", message, timer, classNames });
        });
    },
    error: (message, timer, classNames) => {
        setTimeout(() => {
            render({ status: "error", message, timer, classNames });
        });
    }
};

/**
 * Toast提示
 * 1. 先引入 import Toast from "@/components/toast/index"
 * 2. Toast.success("消息") 调用该方法就可以了
 */
