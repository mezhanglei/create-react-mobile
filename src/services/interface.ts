// 响应体类型
export interface ServiceRes<T> {
    data: T;
    srvTime: number;
    status: number;
    success: boolean;
}

// 请求函数的类型
export type RequestHanler<P, S> = (params?: P) => Promise<ServiceRes<S>>;