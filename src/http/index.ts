import CreateRequest from './createRequest';
import { CustomConfig, HTTP_CODE, HTTP_CODE_MAP, HTTP_STATUS, HTTP_STATUS_MAP } from './config';
import { getToken, loginOut } from "@/utils/auth";
import { Toast } from 'antd-mobile';

// 响应体结构
export interface ServiceRes<T = any> {
  code?: HTTP_CODE;
  data: T;
  srvTime: number;
  status: number;
  success: boolean;
  message?: string;
}

// 初始化请求
const request = CreateRequest({
  headers: {
    Authorization: getToken(),
    baseURL: "",
  },
  startLoading: () => {
  },
  endLoading: () => {
  },
  // 处理响应码
  handleResult: (data: ServiceRes) => {
    const code = data?.code;
    const msg = data?.message;
    if (code != HTTP_CODE.SUCCESS && code) {
      const msgRes = msg || HTTP_CODE_MAP[code];
      msgRes && Toast.show(msgRes);
    }
  },
  // 处理状态码
  handleStatus: (status, msg) => {
    if (status == HTTP_STATUS.NOLOGIN) {
      loginOut();
    }
    if (status == HTTP_STATUS.AUTH) {
      // loginOut();
    }
    const msgRes = msg || HTTP_STATUS_MAP[status];
    msgRes && Toast.show(msgRes);
  }
});
export default request;

/**
 * 设置好配置值的request
 * @param extendConfig 
 * @returns 
 */
export const extend = (extendConfig: CustomConfig & { prefix?: string }) => {
  return (url: string, config: CustomConfig) => {
    const {
      prefix,
      ...rest
    } = extendConfig;
    const prefixValue = prefix || '';
    const newUrl = prefixValue ? prefixValue + url : url;
    return request(newUrl, { ...rest, ...config });
  };
};
