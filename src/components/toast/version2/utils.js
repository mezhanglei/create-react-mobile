import { WatchableStore } from "@/utils/watchable";

/**
 * 实例化一个字类，监听添加Toast事件
 */
class Store extends WatchableStore {
    constructor() {
        // 初始化父类
        super({ status: "", message: "", timer: 0, classNames: "" });
    }

    success(message, timer, classNames) {
        this._toast("success", message, timer, classNames);
    }

    info(message, timer, classNames) {
        this._toast("info", message, timer, classNames);
    }

    warning(message, timer, classNames) {
        this._toast("warning", message, timer, classNames);
    }

    error(message, timer, classNames) {
        this._toast("error", message, timer, classNames);
    }

    // 将参数传给目标并触发监听的添加toast事件
    _toast(status, message, timer, classNames) {
        this.triggerAll({
            classNames: classNames || "",
            message,
            status,
            timer: timer || 3000
        });
    }
}

// 实例化一个类
export const ToastsStore = new Store();
