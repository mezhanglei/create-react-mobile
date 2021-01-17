/**
 * 精确类型判断
 */
export function getType(obj: any) {
    return Object.prototype.toString.call(obj);
}

export function isBoolean(data: any) {
    return getType(data) == '[object Boolean]';
}

export function isNumber(data: any) {
    return getType(data) == '[object Number]';
}

export function isString(data: any) {
    return getType(data) == '[object String]';
}

export function isFunction(data: any) {
    return getType(data) == '[object Function]';
}

export function isArray(data: any) {
    return getType(data) == '[object Array]';
}

export function isDate(data: any) {
    return getType(data) == '[object Date]';
}

export function isRegExp(data: any) {
    return getType(data) == '[object RegExp]';
}

export function isUndefined(data: any) {
    return getType(data) == '[object Undefined]';
}

export function isNull(data: any) {
    return getType(data) == '[object Null]';
}

export function isObject(data: any) {
    return getType(data) == '[object Object]';
}

export function isElement(data: any) {
    return data instanceof Element;
}

export function isDom(ele: any) {
    if (typeof HTMLElement === 'object') {
        return ele instanceof HTMLElement;
    } else {
        return ele && typeof ele === 'object' && ele.nodeType === 1 && typeof ele.nodeName === 'string';
    }
}

export function isNodeList(data: any) {
    return getType(data) == '[object NodeList]';
}

// 判断值是否为空
export function isEmpty(value: any) {
    const type = ["", undefined, null];
    if (type.indexOf(value) > -1) {
        return true;
    } else {
        return false;
    }
}

export function isArrayBuffer(data: any) {
    return getType(data) === '[object ArrayBuffer]';
}

export function isFormData(data: any) {
    return (typeof FormData !== 'undefined') && (data instanceof FormData);
}

export function isArrayBufferView(val: any) {
    var result;
    if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
        result = ArrayBuffer.isView(val);
    } else {
        result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
    }
    return result;
}

export function isFile(data: any) {
    return getType(data) === '[object File]';
}

export function isBlob(data: any) {
    return getType(data) === '[object Blob]';
}

export function isStream(val: any) {
    return isObject(val) && isFunction(val.pipe);
}
