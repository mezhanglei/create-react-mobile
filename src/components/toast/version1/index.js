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
        renderNotice({ status: "success", message, timer, classNames })
    },
    info: (message, timer, classNames) => {
        renderNotice({ status: "info", message, timer, classNames })
    },
    warning: (message, timer, classNames) => {
        renderNotice({ status: "warning", message, timer, classNames })
    },
    error: (message, timer, classNames) => {
        renderNotice({ status: "error", message, timer, classNames })
    }
}

/**
 * Toast提示(版本1,推荐版本)
 * 1. 先引入 import Toast from "@/component/toast/version1/index"
 * 2. Toast.success("消息") 调用该方法就可以了
 */