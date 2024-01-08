import { create } from 'zustand';
import createUser, { UserStore } from "./models/user";


export type Store = UserStore;

const useStore = create<Store>()((...a) => ({
  ...createUser(...a),
}));

export default useStore;
