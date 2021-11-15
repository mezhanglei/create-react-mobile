import { UserInfo } from "@/services/account/interface";
import { ActionKeys, namespace } from "./interface";

/**
 * 由于 dva 的体系需要 action type 前面包含命名空间
 * 在此对所有 action creator 包装 namespace
 * 类似 注解 或者 装饰器 (Decorator) 的作用
 */
const wrapDvaActionNamespace = <T extends (...args: any[]) => any>(fn: T): T => {
  const wrapper: any = (...args) => {
    const action = fn(...args);
    return {
      ...action,
      type: `${namespace}/${action.type}`
    };
  };
  return wrapper as T;
};

const withDva = wrapDvaActionNamespace;

// action进行柯里化
const actionCreator = (type: ActionKeys) => <T extends (...arg: any) => any>(payloadCreator: T) =>
  (...arg: Parameters<T>) => ({ type, payload: payloadCreator(...arg) as ReturnType<T> });


// 包含命名空间且完成柯里化的action
const actionCreatorWithDva = <T extends (...arg: any) => any>(type: ActionKeys, payloadCreator: T) =>
  withDva(actionCreator(type)(payloadCreator));

// 用户信息
export const setUserInfo = actionCreatorWithDva(
  ActionKeys.SetUserInfo,
  (val?: UserInfo) => val
);

// 用户信息
export const fetchUserInfo = actionCreatorWithDva(
  ActionKeys.FetchUserInfo,
  () => ({})
);