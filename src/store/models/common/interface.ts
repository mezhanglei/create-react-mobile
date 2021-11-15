import { UserInfo } from '@/services/account/interface';
import { ActionPayloadRecord, Model, ReducerStateHandler } from '../interface';
import * as Actions from './actions';
import type { Action } from 'redux';

export type CommonNamespace = 'common';
export const namespace: CommonNamespace = 'common';
export type CommonModel = Model<CommonNamespace, CommonState>;

export interface CommonState {
    userInfo?: UserInfo
}

export enum ActionKeys {
    FetchUserInfo = 'fetchUserInfo',
    SetUserInfo = 'setUserInfo',
}

// action的payload类型
export type ActionPayload = ActionPayloadRecord<typeof Actions>;
// reducer函数类型
export type ReducerHandler<P> = ReducerStateHandler<CommonState, P>;
// effect函数第一个参数类型
export interface EffectPayload<P> extends Action<string> {
    payload: P;
}
