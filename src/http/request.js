import axios from "axios";
import configs from "./config";
import { message } from "antd";
import { myStorage } from "@/utils/cache.js";
import { clearLoginInfo } from "@/common/common.js";
import { TOKEN } from "@/constants/account/index";
import { trimParams } from "@/utils/base";
import Loader from "@/components/loader/index";

// 开始loading
export function startLoading() {
    Loader.start();
}

// 结束loading
export function endLoading() {
    Loader.end();
}

// 实例化一个axios实例(axios根据请求体自动设置请求头)
// 1.默认application/x-www-form-urlencoded, 提交的数据按照key1=val1&key2=val2的方式进行编码，key和val都进行了URL转码(只支持表单键值对,不支持二进制文件)
// 2.application/json,表示请求体中消息类型为序列化的json字符串
// 3.multipart/form-data; boundary=${分隔符,尽量定义复杂点, 将请求体中的文本信息和传输文件分割开来}, 专门用于有效的传输文件, 既可以上传二进制数据，也可以上传表单键值对
const http = axios.create({
    timeout: 1000 * 10,
    withCredentials: true,
    baseURL: process.env.MOCK ? '/mock' : ""
});

/**
 * 响应状态异常的处理
 * @param {Number} status 表示响应状态码
 * @param {String} msg 表示响应的信息
 */
function errorHandle(status, msg) {
    switch (status) {
        case 401:
            msg = "请先登录";
            clearLoginInfo();
            break;
        case 403:
            msg = '无访问权限';
            break;
        case 404:
            msg = "资源不存在";
            break;
        case 405:
            msg = "请求方法未允许";
            break;
        case 408:
            msg = "请求超时";
            break;
        case 502:
            msg = '网络连接错误，请稍后再试';
            break;
        case 503:
            msg = "服务不可用";
            break;
        case 504:
            msg = "网络超时";
            break;
        case 505:
            msg = "http版本不支持该请求";
            break;
        default:
            msg = msg;
    }
    if (status && msg) {
        Toast.info(msg);
    }
}

/**
 * 响应成功后返回的数据的code处理
 * @param {Number} code 表示后台返回的code
 * @param {String} msg 表示后台返回的信息
 */
function responseHandle(code, msg) {
    switch (code) {
        case 401:
            msg = "请先登录";
            clearLoginInfo();
            break;
        case 403:
            msg = "拒绝访问";
            break;
        default:
            msg = msg;
    }
    if (code) {
        Toast.info(msg);
    }
}

// 公共的请求参数
const defaults = {
    // t: new Date().getTime()
};

/**
 * @param {Object} config axios的config
 * 处理请求,最终返回一个新的config配置
 */
function handleConfig(config) {
    let data = Object.assign(defaults, config.params || config.data);
    // 是否去掉前后空格,默认去掉
    if (!config.noTrim) {
        data = trimParams(data);
    } else {
        data = data;
    }
    if (config.params) {
        config.params = Object.assign(defaults, data);
    }
    if (config.data) {
        config.data = Object.assign(defaults, data);
    }
    return config;
}

// 请求拦截(axios自动对请求类型进行类型转换)
http.interceptors.request.use(
    (config) => {
        config.headers["Authorization"] = myStorage.get(TOKEN);
        startLoading();
        config = handleConfig(config);
        return config;
    },
    (error) => {
        endLoading();
        return Promise.reject(error);
    }
);

// 响应拦截(axios默认自动对响应请求进行类型转换)
http.interceptors.response.use(
    (response) => {
        if (response == null || response === undefined) {
            return null;
        }
        endLoading();
        // 响应
        const code = response.data && response.data.code;
        const msg = response.data && response.data.message;
        responseHandle(code, msg);
        return response.data;
    },
    (error) => {
        endLoading();
        let msg =
            error.response && error.response.data && error.response.data.message;
        const status = error.response && error.response.status;
        // 错误响应
        errorHandle(status, msg);
        return Promise.reject(error);
    }
);

export default http;
