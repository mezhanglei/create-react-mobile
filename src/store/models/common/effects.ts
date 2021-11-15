import { getUserInfo } from '@/services/account';
import type { EffectPayload, ActionPayload } from './interface';
import { setUserInfo } from './actions';
import type { EffectsCommandMap } from 'dva';

// 弹窗变量
let modal;

// 获取用户信息
function* fetchUserInfo(_: EffectPayload<ActionPayload['fetchUserInfo']>, effects: EffectsCommandMap): any {
    const res = yield effects.call(getUserInfo);
    return yield effects.put(setUserInfo(res?.data));
}

export default {
    fetchUserInfo
};