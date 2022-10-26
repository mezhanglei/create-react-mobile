import { isEmpty, isNumberStr, isObject } from "./type";
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

// 路径根据规则分割成数组
export function pathToArr(path?: string) {
  return path ? path.replace(/\]$/, '').split(/\.\[|\[\]|\]\[|\[|\]\.|\]|\./g) : [];
}

// 处理将路径中的数组项转换成普通字符串
export function formatName(str: string) {
  return str?.replace(/\[/g, '')?.replace(/\]/g, '');
}

// 根据路径获取目标对象中的值
export function deepGet(obj: object | undefined, keys?: string | string[]): any {
  if (!keys?.length) return
  return (
    (!Array.isArray(keys)
      ? pathToArr(keys)
      : keys
    ).reduce((o, k) => (o)?.[formatName(k)], obj)
  );
}

// 给对象目标属性添加值
export function deepSet(obj: any, path: string | string[], value: any) {
  let temp = deepClone(obj);
  let root = temp;
  const parts = !Array.isArray(path) ? pathToArr(path) : path;
  const length = parts.length;

  for (let i = 0; i < length; i++) {
    const current = parts[i];
    const next = parts[i + 1];
    const currentWithBracket = isNumberStr(current) ? `[${current}]` : undefined
    const nextWithBracket = isNumberStr(next) ? `[${next}]` : undefined
    // 当前字符是否为数组项
    const isListItem = currentWithBracket ? path?.indexOf(currentWithBracket) > -1 : false
    // 下个字段是否为数组项
    const nextIsListItem = nextWithBracket ? path?.indexOf(nextWithBracket) > -1 : false

    // 当传入的值为空赋值初始值
    if (typeof obj !== 'object' && i === 0) {
      if (isListItem) {
        temp = [];
        root = temp;
      } else {
        temp = {};
        root = temp;
      }
    }

    if (i === length - 1) {
      if (value === undefined) {
        if (isListItem) {
          const index = +current;
          temp?.splice(index, 1);
        } else {
          delete temp[current];
        }
      } else {
        temp[current] = value;
      }
    } else if (typeof temp[current] !== 'object' && nextIsListItem) {
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
  for (let key in obj2) {
    if (isObject(obj1[key])) {
      obj1[key] = deepMergeObject(obj1[key], obj2[key])
    } else {
      obj1 = { ...obj1, ...obj2 }
    }
  }
  return obj1;
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
