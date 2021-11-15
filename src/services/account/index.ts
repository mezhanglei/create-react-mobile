import request from '@/http/request';
import { RequestHanler } from '../interface';
import { UserInfo } from './interface';

// 获取用户信息
export const getUserInfo: RequestHanler<undefined, UserInfo> = () => {
    return request.post({
        url: 'user/info',
        method: 'GET'
    });
}