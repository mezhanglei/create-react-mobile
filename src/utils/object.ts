import { isNumberStr, isObject } from "./type";
import { copy } from 'copy-anything';
import compare from 'react-fast-compare';

export function deepClone<T = any>(value: T) {
  return copy(value);
}

// 判断两个值是否相等
export function isEqual(a: any, b: any) {
  return compare(a, b);
}

/**
 * 递归去除参数的前后空格
 * @param {*} data 参数
 */
export const trimParams = (data: any) => {
  if (typeof data === 'string') return data.trim();
  if (isObject(data)) {
    for (let key in data) {
      data[key] = trimParams(data[key]);
    }
  }
  return data;
};

/**
 * 递归将对象/嵌套对象的数据转化为formdata格式数据
 * @param {Object} obj 传入的对象数据
 * @param {FormData} formData 是否传入已有的formData数据
 */
export function objectToFormData(obj: any, formData?: FormData) {
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

// 过滤对象中的属性
export function filterObject(obj: object | undefined | null, callback: (value: any, key?: string) => boolean): any {
  if (obj === undefined || obj === null) return obj;
  const entries = Object.entries(obj)?.filter((item) => (callback(item[1], item[0])));
  return Object.fromEntries(entries);
}

// 接收路径字符串或数组字符串，返回数组字符串表示路径
export function pathToArr(path?: string | string[]) {
  if (path instanceof Array) return path;
  const parts = typeof path === 'string' && path ? path.replace(/\]$/, '').replace(/^\[/, '').split(/\.\[|\]\[|\[|\]\.|\]|\./g) : []
  return parts;
}

// 根据路径获取目标对象中的单个值或多个值
export function deepGet(obj: object | undefined, keys?: string | string[]): any {
  if (!keys?.length) return
  if (keys instanceof Array) {
    const result = obj instanceof Array ? [] : {}
    for (let key in keys) {
      const item = keys[key]
      result[item] = pathToArr(item)?.reduce?.((o, k) => (o)?.[k], obj)
    }
    return result;
  } else {
    return pathToArr(keys)?.reduce?.((o, k) => (o)?.[k], obj)
  }
}

// 给对象目标属性添加值, path：['a', 0] 等同于 'a[0]'
export function deepSet(obj: any, path: string | string[], value: any) {
  let temp = deepClone(obj);
  let root = temp;
  const pathIsArr = Array.isArray(path);
  const parts = pathToArr(path);
  const length = parts.length;

  for (let i = 0; i < length; i++) {
    const current = parts[i];
    const next = parts[i + 1];
    // 当前字符是否为数组索引
    const isIndex = pathIsArr ? isNumberStr(current) : path?.indexOf(`[${current}]`) > -1
    // 下个字符是否为数组索引
    const nextIsIndex = pathIsArr ? isNumberStr(next) : path?.indexOf(`[${next}]`) > -1

    // 当传入的值为空赋值初始值
    if (typeof obj !== 'object' && i === 0) {
      if (isIndex) {
        temp = [];
        root = temp;
      } else {
        temp = {};
        root = temp;
      }
    }

    if (i === length - 1) {
      if (value === undefined) {
        if (isIndex) {
          const index = +current;
          temp?.splice(index, 1);
        } else {
          delete temp[current];
        }
      } else {
        temp[current] = value;
      }
    } else if (typeof temp[current] !== 'object' && nextIsIndex) {
      temp[current] = [];
    } else if (typeof temp[current] !== 'object') {
      temp[current] = {};
    }
    temp = temp[current];
  }
  return root;
}

// 深度合并两个对象
export const deepMergeObject = function (obj1: any, obj2: any) {
  if (typeof obj1 === 'object') {
    for (let key in obj2) {
      if (isObject(obj1[key])) {
        obj1[key] = deepMergeObject(obj1[key], obj2[key])
      } else if (obj2[key] !== undefined) {
        obj1[key] = obj2[key]
      }
    }
    return obj1;
  }
};

// 合并新对象，新对象浅合并, 新的覆盖旧的
export const shallowMerge = function (oldValue: any, newValue: any) {
  if (!isObject(oldValue) || !isObject(oldValue)) {
    return oldValue;
  }
  const result = { ...oldValue };
  for (let key in newValue) {
    result[key] = newValue[key];
  }
  return result;
};
