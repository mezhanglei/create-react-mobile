import { StateCreator } from 'zustand';
import { Store } from "../createStore";
import { UserInfo } from '@/services/account/interface';
import { getUserInfo } from '@/services/account';
// import withNameSpace from '../withNamespace';

export interface UserStore {
  userInfo: UserInfo | null;
  resetUser: () => void;
  fetchUserInfo: () => Promise<UserInfo>
}


// 初始值
const initialState = {
  userInfo: null
};

// 用户相关内容
const createUser: StateCreator<
  Store,
  [],
  [
    // ["zustand/persist", UserStore]
  ],
  UserStore
> = (set, get) => ({
  ...initialState,
  // 重置
  resetUser: () => {
    set({ ...initialState });
  },
  // 请求用户信息
  fetchUserInfo: async () => {
    const res = await getUserInfo();
    set({ userInfo: res });
    return res;
  },
});

export default createUser;
