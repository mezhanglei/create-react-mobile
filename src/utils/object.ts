import { isObject } from "./type";
import deepCopy from 'fast-copy';

// 判断两个值是否相等
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

// 过滤对象中的属性
export function filterObject(obj: object | undefined | null, callback: (value: any, key?: string) => boolean): any {
  if (obj === undefined || obj === null) return obj;
  const entries = Object.entries(obj)?.filter((item) => (callback(item[1], item[0])));
  return Object.fromEntries(entries);
}

// 根据路径获取目标对象中的值
export function deepGet(obj: object | undefined, keys: string | string[]): any {
  return (
    (!Array.isArray(keys)
      ? keys.replace(/\[/g, '.').replace(/\]/g, '').split('.')
      : keys
    ).reduce((o, k) => (o || {})[k], obj)
  );
}

// 给对象目标属性添加值
export function deepSet(obj: any, path: string | string[], value: any, arraySetPath?: Array<string>) {
  if (typeof obj !== 'object') return obj;
  let temp = deepCopy(obj);
  const root = temp;
  const parts = !Array.isArray(path) ? path.replace(/\[/g, '.').replace(/\]/g, '').split('.') : path;
  const length = parts.length

  for (let i = 0; i < length; i++) {
    const p = parts[i]
    // 该字段是否设置为数组
    const isSetArray = arraySetPath?.some((path) => {
      const end = path?.split('.')?.pop();
      return end === p;
    });
    if (i === length - 1) {
      if (value === undefined) {
        delete temp[p];
      } else {
        temp[p] = value;
      }
    } else if (typeof temp[p] !== 'object' && isSetArray) {
      temp[p] = [];
    } else if (typeof temp[p] !== 'object') {
      temp[p] = {};
    }
    temp = temp[p]
  }
  return root;
}

// 合并两个对象
export const mergeObject = function (obj1: any, obj2: any) {
  if (!isObject(obj1) || !isObject(obj2)) {
    return obj1;
  }
  const clone = deepCopy(obj1);
  for (let key in obj2) {
    if (obj2[key] !== undefined) {
      clone[key] = obj2[key];
      if (obj1[key] === undefined) {
        clone[key] = obj2[key];
      }
    }
  }
  return clone;
};
