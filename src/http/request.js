import axios from "axios";
import { STATUS_ERROR, CODE_ERROR } from "./config";
import { Toast } from "antd-mobile";
import { myStorage } from "@/utils/cache.js";
import { loginOut, getToken } from "@/common/common.js";
import { trimParams } from "@/utils/character.js";
import Loader from "@/components/loader/index";

// 开始loading
export function startLoading() {
    Loader.start();
}

// 结束loading
export function endLoading() {
    Loader.end();
}

// 实例化一个axios实例(浏览器自动设置content-type或者自己手动设置)
// 1.默认application/x-www-form-urlencoded, form表单默认的方式,提交的数据按照key1=val1&key2=val2的方式进行编码，key和val都进行了URL转码(只支持表单键值对,不支持二进制文件)
// 2.application/json,表示请求体中消息类型为序列化的json字符串
// 3.multipart/form-data; boundary=${分隔符},利用form表单设置mutiple时浏览器自动添加,专门用于有效的传输文件, 既可以上传二进制数据，也可以上传表单键值对
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
function statusError(status, msg) {
    if (status === 401) {
        loginOut();
    }
    status && Toast.info(STATUS_ERROR[status] || msg);
}

/**
 * 返回code异常处理
 * @param {Number} code 表示后台返回的code
 * @param {String} msg 表示后台返回的信息
 */
function resultError(code, msg) {
    if (code == 401) {
        loginOut();
    }
    code && Toast.info(CODE_ERROR[code] || msg);
}

// 公共的请求参数
const defaults = {
    // t: new Date().getTime()
};

// 公共的headers
const headers = {
    Authorization: getToken()
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
        // 公共headers
        Object.keys(headers).map(item => {
            config.headers[item] = headers[item];
        });
        // 公共请求处理
        config = handleConfig(config);
        startLoading();
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
        const result = response.data;
        // 响应异常提示
        if (result.code != 200) {
            resultError(code, msg);
        }
        return result;
    },
    (error) => {
        endLoading();
        let msg =
            error.response && error.response.data && error.response.data.message;
        const status = error.response && error.response.status;
        // 错误响应
        statusError(status, msg);
        return Promise.reject(error);
    }
);

// 转换调用http请求的方式：例如http.post({}).then(res={})
const request = {};
['get', 'post', 'delete', 'put'].map(item => {
    request[item] = function (configs) {
        return http({
            ...configs,
            method: item
        });
    };
});

export default request;
