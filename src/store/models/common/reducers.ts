import type { ReducerHandler, ActionPayload } from './interface';

// 设置用户信息
export const setUserInfo: ReducerHandler<ActionPayload['setUserInfo']> = (state, { payload }) => {
    return { ...state, userInfo: payload };
};