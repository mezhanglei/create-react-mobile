/**
 * 精确类型判断
 */
export function getType(obj) {
    return Object.prototype.toString.call(obj);
}

export function isBoolean(data) {
    return getType(data) == '[object Boolean]';
}

export function isNumber(data) {
    return getType(data) == '[object Number]';
}

export function isString(data) {
    return getType(data) == '[object String]';
}

export function isFunction(data) {
    return getType(data) == '[object Function]';
}

export function isArray(data) {
    return getType(data) == '[object Array]';
}

export function isDate(data) {
    return getType(data) == '[object Date]';
}

export function isRegExp(data) {
    return getType(data) == '[object RegExp]';
}

export function isUndefined(data) {
    return getType(data) == '[object Undefined]';
}

export function isNull(data) {
    return getType(data) == '[object Null]';
}

export function isObject(data) {
    return getType(data) == '[object Object]';
}

export function isElement(data) {
    return data instanceof Element;
}

export function isDom(ele) {
    if (typeof HTMLElement === 'object') {
        return ele instanceof HTMLElement;
    } else {
        return ele && typeof ele === 'object' && ele.nodeType === 1 && typeof ele.nodeName === 'string';
    }
}

export function isNodeList(data) {
    return getType(data) == '[object NodeList]';
}

// 判断值是否为空
export function isEmpty(value) {
    const type = ["", undefined, null];
    if (type.indexOf(value) > -1) {
        return true;
    } else {
        return false;
    }
}

export function isArrayBuffer(data) {
    return getType(data) === '[object ArrayBuffer]';
}

export function isFormData(data) {
    return (typeof FormData !== 'undefined') && (data instanceof FormData);
}

export function isArrayBufferView(val) {
    var result;
    if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
        result = ArrayBuffer.isView(val);
    } else {
        result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
    }
    return result;
}

export function isFile(data) {
    return getType(data) === '[object File]';
}

export function isBlob(data) {
    return getType(data) === '[object Blob]';
}

export function isStream(val) {
    return isObject(val) && isFunction(val.pipe);
}
