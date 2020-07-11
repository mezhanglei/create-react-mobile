export * from "./ToastsContainer";
export * from "./utils";

/**
 * Toast提示框(版本2,通过发布订阅监听实现的)
 * 1. 先引入 import { ToastsContainer, ToastsStore } from "@/components/toast/version2/index";
 * 2. 实例化容器组件 <ToastsContainer store={ToastsStore} />
 * 3. 触发方法 Toast.success("消息")
 */
