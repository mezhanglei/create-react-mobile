import * as handlers from './reducers';
import effects from './effects';
import initState from './initState';
import type { CommonModel } from './interface';
import { namespace } from './interface';
import { fetchUserInfo } from './actions';

// 将module类转换成对象
const reducers = Object.fromEntries(
    Object.entries(handlers).map(
        ([fnName, fn]) => {
            return [fnName, fn];
        }
    )
);

export default {
    namespace: namespace,
    state: initState,
    reducers: reducers,
    effects: effects,
    subscriptions: {
        setup({ dispatch }) {
            dispatch(fetchUserInfo())
        }
    }
} as CommonModel;
