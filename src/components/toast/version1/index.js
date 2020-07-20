import ToastsContainer from "./ToastsContainer";

let container;

// 实例化容器
const getContainer = (props) => {
    // 保证只有一个容器
    if (!container) {
        container = ToastsContainer.showInstance(props);
    }
    return container;
};

// 触发渲染toast的方法
const renderNotice = (props) => {
    let notificationInstance = getContainer(props);
    notificationInstance.show();
};

export default {
    success: (message, timer, classNames) => {
        // 异步延迟加载以遍页面实例化后再执行
        setTimeout(() => {
            renderNotice({ status: "success", message, timer, classNames });
        }, 100);
    },
    info: (message, timer, classNames) => {
        setTimeout(() => {
            renderNotice({ status: "info", message, timer, classNames });
        }, 100);
    },
    warning: (message, timer, classNames) => {
        setTimeout(() => {
            renderNotice({ status: "warning", message, timer, classNames });
        }, 100);
    },
    error: (message, timer, classNames) => {
        setTimeout(() => {
            renderNotice({ status: "error", message, timer, classNames });
        }, 100);
    }
};

/**
 * Toast提示(版本1,推荐版本)
 * 1. 先引入 import Toast from "@/component/toast/version1/index"
 * 2. Toast.success("消息") 调用该方法就可以了
 */
