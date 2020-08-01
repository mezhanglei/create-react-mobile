// ===AXIOS请求的配置信息=== //

export const MESSAGE = {
    SUCCESS: '更新成功',
    DELETE: '删除成功',
    ADD: '添加成功',
    CREATE: '创建成功',
    CLOSE: '关闭成功',
    SUBMIT: '提交成功',
    ERROR: '网络异常，请稍后重试',
    FAIL: '请求失败，请稍后重试'
};

// status状态码错误
export const STATUS_ERROR = {
    401: "身份验证失败",
    403: "无访问权限",
    404: "资源不存在",
    405: "请求方法错误",
    408: "请求超时",
    502: "网络连接错误，请稍后再试",
    503: "服务不可用",
    504: "网关超时",
    505: "http版本不支持"
};

// 返回code错误
export const CODE_ERROR = {
    401: "请先登录",
    403: "无访问权限"
};
