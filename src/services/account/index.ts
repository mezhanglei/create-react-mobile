import request from '@/http';
import { UserInfo } from './interface';

// 获取用户信息
export const getUserInfo = async (): Promise<UserInfo> => {
  const data = await request('user/info', { method: 'post' });
  return data.data;
};
