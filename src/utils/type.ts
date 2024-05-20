/**
 * 精确类型判断
 */
export function getType<T>(obj: T) {
  return Object.prototype.toString.call(obj);
}

export function isBoolean<T>(data: T) {
  return getType(data) == '[object Boolean]';
}

export function isNumber<T>(data: T) {
  return getType(data) == '[object Number]';
}

export function isString<T>(data: T) {
  return getType(data) == '[object String]';
}

export function isFunction<T>(data: T) {
  return getType(data) == '[object Function]';
}

export function isArray<T>(data: T) {
  return getType(data) == '[object Array]';
}

export function isDate<T>(data: T) {
  return data instanceof Date;
}

export function isRegExp<T>(data: T) {
  return getType(data) == '[object RegExp]';
}

export function isUndefined<T>(data: T) {
  return getType(data) == '[object Undefined]';
}

export function isNull<T>(data: T) {
  return getType(data) == '[object Null]';
}

export function isObject<T>(data: T) {
  return getType(data) == '[object Object]';
}

export function isElement<T>(data: T) {
  return data instanceof Element;
}

export function isDom<T>(data: T & { nodeType?: number; nodeName?: string }) {
  if (typeof HTMLElement === 'object') {
    return data instanceof HTMLElement;
  } else {
    return data && typeof data === 'object' && data?.nodeType === 1 && typeof data.nodeName === 'string';
  }
}

export function isNodeList<T>(data: T) {
  return getType(data) == '[object NodeList]';
}

// 判断值是否为空
export function isEmpty<T>(value: T) {
  if (value === undefined || value === null) return true;
  if (Array.isArray(value)
    || typeof value === 'string'
    || value instanceof String
  ) {
    return value.length === 0;
  }

  if (value instanceof Map || value instanceof Set) {
    return value.size === 0;
  }

  if (({}).toString.call(value) === '[object Object]') {
    return Object.keys(value).length === 0;
  }

  if (typeof value === 'number') {
    return isNaN(value);
  }
}

export function isArrayBuffer<T>(data: T) {
  return getType(data) === '[object ArrayBuffer]';
}

export function isFormData<T>(data: T) {
  return (typeof FormData !== 'undefined') && (data instanceof FormData);
}

export function isArrayBufferView<T>(data: T & { buffer?: ArrayBuffer }) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(data);
  } else {
    result = (data) && (data.buffer) && (data.buffer instanceof ArrayBuffer);
  }
  return result;
}

export function isFile<T>(data: T) {
  return getType(data) === '[object File]';
}

export function isBlob<T>(data: T) {
  return getType(data) === '[object Blob]';
}

export function isStream<T>(data: T & { pipe?: Function }) {
  return typeof data === 'object' && isFunction(data.pipe);
}

// 是否为简单类型
export function isBase<T>(data: T) {
  const type = typeof data;
  return ['string', 'number', 'symbol', 'boolean']?.includes(type);
}

// 是否为数字字符串或者数字
export const isNumberStr = <T>(str?: T) => {
  if (typeof str === 'number' && !isNaN(str)) return true;
  if (typeof str === 'string') {
    const target = Number(str);
    if (!isNaN(target) && str) return true;
  }
};

// 是否为带data:开头的base64的字符串
export const isBase64 = <T>(str?: T) => {
  if (typeof str !== 'string') return;
  if (str.trim() === '') return;
  const regx = /^(data:\S+\/\S+;base64,){1}/;
  return regx.test(str);
};
