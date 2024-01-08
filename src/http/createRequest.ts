import axios, { AxiosResponse, CreateAxiosDefaults } from "axios";
import { trimParams } from "@/utils/object";
import { IE11OrLess } from "@/utils/brower";
import { HTTP_STATUS, CancelPending, CustomConfig } from "./config";

export interface CreateRequestParams extends CreateAxiosDefaults {
  startLoading?: () => void;
  endLoading?: () => void;
  handleResult?: (data: any) => void;
  handleStatus?: (status: HTTP_STATUS, msg?: string) => void;
  headers?: any;
}
// 基础axios
export default function CreateRequest(params: CreateRequestParams) {

  const {
    startLoading,
    endLoading,
    handleResult,
    handleStatus,
    headers: headersConfig,
    ...optherConfigs
  } = params;

  // axios取消重复请求（具有副作用）
  function AxiosCancel() {
    // 声明一个数组用于存储每个ajax请求的取消函数和ajax标识
    let pending: CancelPending[] = [];
    let cancelToken = axios.CancelToken;
    return {
      add: (config: CustomConfig) => {
        config.cancelToken = new cancelToken((cancel) => {
          // 添加进已执行数组
          pending.push({ key: config.url + '&' + config.method, cancel: cancel });
        });
      },
      cancel: (config: CustomConfig) => {
        const index = pending?.findIndex((item) => item.key === config.url + '&' + config.method);
        const pend = pending[index];
        if (pend) {
          pend.cancel(); // 执行取消操作
          pending.splice(index, 1); //把这条记录从数组中移除
        }
      },
      remove: (config: CustomConfig) => {
        const index = pending?.findIndex((item) => item.key === config.url + '&' + config.method);
        const pend = pending[index];
        if (pend) {
          pending.splice(index, 1);
        }
      }
    };
  }

  // 实例化取消axois的方法
  const axiosCancel = AxiosCancel();

  // 实例化一个axios实例(浏览器自动设置content-type或者自己手动设置)
  // 1.默认application/x-www-form-urlencoded, form表单默认的方式,提交的数据按照key1=val1&key2=val2的方式进行编码，key和val都进行了URL转码(只支持表单键值对,不支持二进制文件)
  // 2.application/json,表示请求体中消息类型为序列化的json字符串
  // 3.multipart/form-data; boundary=${分隔符}, 请求时浏览器自动添加,不能人工设置,专门用于有效的传输文件, 既可以上传二进制数据，也可以上传表单键值对
  const axiosInstance = axios.create({
    timeout: 1000 * 10,
    withCredentials: true,
    ...optherConfigs
  });

  // 请求拦截(axios自动对请求类型进行类型转换)
  axiosInstance.interceptors.request.use(
    (config: CustomConfig) => {
      const {
        headers,
        params,
        data,
        trim,
        unique,
      } = config || {};

      const newParams = trim ? trimParams(params) : params;
      const newData = trim ? trimParams(data) : data;
      const newHeaders = Object.assign(headers, headersConfig || {});

      startLoading?.();
      if (unique) {
        axiosCancel.cancel(config); // 重复的请求取消掉
        axiosCancel.add(config); // 添加请求
      }
      return {
        ...config,
        headers: newHeaders,
        data: newData,
        params: IE11OrLess ? { ...newParams, rand: Math.random() } : newParams
      };
    },
    (error) => {
      endLoading?.();
      return Promise.reject(error);
    }
  );

  // 响应拦截(axios默认自动对响应请求进行类型转换)
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse & { config: CustomConfig }) => {
      endLoading?.();
      const {
        config,
        headers,
        data
      } = response || {};
      const result = config && headers ? data : response;
      // 完成的请求移除pending
      axiosCancel.remove(config);
      // 请求响应处理
      handleResult?.(data);
      // 是否返回响应体
      if (config?.withResponse) {
        return response;
      }
      return result;
    },
    (error) => {
      endLoading?.();
      let msg =
        error.response && error.response.data && error.response.data.message;
      const status = error.response && error.response.status;
      // 错误响应
      handleStatus?.(status, msg);
      return Promise.reject(error);
    }
  );

  return axiosInstance;
}
