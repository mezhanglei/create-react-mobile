import CreateRequest from './createRequest';
import { CustomConfig, HTTP_CODE, HTTP_CODE_MAP, HTTP_STATUS, HTTP_STATUS_MAP } from './config';
import { Toast } from 'antd-mobile';
import { getToken, loginOut } from '@/utils/auth';

export interface ResponseData {
  code?: HTTP_CODE;
  message?: string;
}

// 配置请求
const request = CreateRequest({
  headers: {
    Authorization: getToken()
  },
  // 开始请求
  startLoading: () => {
  },
  // 结束/完成请求
  endLoading: () => {
  },
  // 处理响应码
  handleResult: (data: ResponseData) => {
    const code = data?.code;
    const msg = data?.message;
    if (code != HTTP_CODE.SUCCESS && code) {
      const msgRes = msg || HTTP_CODE_MAP[code]
      msgRes && Toast.show(msgRes);
    }
  },
  handleStatus: (status, msg) => {
    if (status == HTTP_STATUS.NOLOGIN) {
      loginOut();
    }
    if (status == HTTP_STATUS.AUTH) {
      loginOut();
    }
    const msgRes = msg || HTTP_STATUS_MAP[status]
    msgRes && Toast.show(msgRes);
  }
});

export default request;

/**
 * 提前设置配置值的request
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
