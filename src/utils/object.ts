
/**
 * 深度克隆拷贝
 * @param obj 
 */
export const deepClone = (obj: any) => {
    let clone = obj;
    if (obj && typeof obj === "object") {
        clone = new obj.constructor();
        Object.getOwnPropertyNames(obj).forEach(
            prop => (clone[prop] = deepClone(obj[prop]))
        );
    }
    return clone;
};

// 判断两个对象(包括数组)是否相等
export function isObjectEqual(a: any, b: any) {
    if (!(typeof a == 'object' && typeof b === 'object')) {
        return a === b;
    };
    let aProps = Object.getOwnPropertyNames(a);
    let bProps = Object.getOwnPropertyNames(b);
    if (aProps.length != bProps.length) {
        return false;
    }
    for (let i = 0; i < aProps.length; i++) {
        let propName = aProps[i];
        let propA = a[propName];
        let propB = b[propName];
        if ((typeof (propA) === 'object')) {
            if (!isObjectEqual(propA, propB)) {
                return false;
            }
        } else if (propA !== propB) {
            return false;
        }
    }
    return true;
}

/**
 * 递归将对象/嵌套对象的数据转化为formdata格式数据
 * @param {Object} obj 传入的对象数据
 * @param {FormData} formData 是否传入已有的formData数据
 */
export function objectToFormData(obj: any, formData: FormData) {
    const fd = (formData instanceof FormData) ? formData : new FormData();
    let formKey;
    for (let property in obj) {
        if (obj.hasOwnProperty(property)) {
            formKey = property;
            // 如果传入数据的值为对象且不是二进制文件
            if (typeof obj[property] === 'object' && !(obj[property] instanceof File)) {
                objectToFormData(obj[property], fd);
            } else {
                fd.append(formKey, obj[property]);
            }
        }
    }
    return fd;
}

// 过滤对象
export function filterObject(obj: object | undefined | null, callback: (value: any, key?: string) => boolean): any {
    if (obj === undefined || obj === null) return obj;
    const entries = Object.entries(obj)?.filter((item) => (callback(item[1], item[0])));
    return Object.fromEntries(entries);
}

// 根据路径获取目标对象中的值
export function deepGet(obj: object, keys: string | string[], defaultVal?: any): any {
    return (
        (!Array.isArray(keys)
            ? keys.replace(/\[/g, '.').replace(/\]/g, '').split('.')
            : keys
        ).reduce((o, k) => (o || {})[k], obj) || defaultVal
    );
}
