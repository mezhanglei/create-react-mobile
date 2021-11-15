
import type { Reducer } from 'redux';
import type { Effect, EffectType, Model as DvaModel, EffectsCommandMap } from 'dva';

interface Action {
    type: string;
    payload: unknown;
}
interface ReducersMapObject<S> {
    [key: string]: Reducer<S, Action>;
}

export interface ReducerEnhancer<S> {
    (reducer: Reducer<S, Action>): Reducer<S, Action>;
}

export interface Model<ModelNameSpace, S> {
    namespace: ModelNameSpace;
    state?: S;
    reducers?: ReducersMapObject<S> | [ReducersMapObject<S>, ReducerEnhancer<S>];
    effects?: Record<string, Effect | [(emp: EffectsCommandMap) => void, { type: EffectType }]>;
    subscriptions?: DvaModel['subscriptions'];
}

/** 规定 reducer中的处理函数 接收state 和 payload 返回计算处理过后的state */
export type ReducerStateHandler<State, Payload> = (state: State, payload: { type: string; payload: Payload }) => State;

/** 用来从 actionCreator 中推断出 payload 的类型 */
export type ActionPayload<T extends (...args: any) => { payload: unknown }> = ReturnType<T>['payload'];

/** 如果你的 action creator 全部放在一个 record 中的话 你可以使用该类型推断生成 Payload record */
export type ActionPayloadRecord<T extends { [key: string]: (...args: any) => { payload: unknown } }> = {
    [K in keyof T]: ActionPayload<T[K]>;
};