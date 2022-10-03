import { isObject } from "./type";
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
export function pathToArr(path: string) {
  return path?.replace(/\.\[/g, '.')?.replace?.(/\[/g, '.')?.replace(/\]\./g, '.')?.replace(/\]/g, '.')?.replace(/\.$/g, '')?.split('.');
}

// 处理将路径中的数组项转换成普通字符串
export function formatName(str: string) {
  return str?.replace(/\[/g, '')?.replace(/\]/g, '');
}

// 根据路径获取目标对象中的值
export function deepGet(obj: object | undefined, keys: string | string[]): any {
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
  // 过滤出其中的数组项
  const listItems = !Array.isArray(path) ? path.match(/\[(\d+)\]/gi) : path;

  for (let i = 0; i < length; i++) {
    const p = parts[i];
    const next = parts[i + 1];
    // 下个字段是否为数组项
    const nextIsListItem = listItems?.some((item) => {
      const listItem = formatName(item);
      return listItem === next;
    });
    // 当前字段是否为数组项
    const isListItem = listItems?.some((item) => {
      const listItem = formatName(item);
      return listItem === p;
    });

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
          const index = +p;
          temp?.splice(index, 1);
        } else {
          delete temp[p];
        }
      } else {
        temp[p] = value;
      }
    } else if (typeof temp[p] !== 'object' && nextIsListItem) {
      temp[p] = [];
    } else if (typeof temp[p] !== 'object') {
      temp[p] = {};
    }
    temp = temp[p];
  }
  return root;
}

// 合并两个对象
export const mergeObject = function (obj1: any, obj2: any) {
  if (!isObject(obj1) || !isObject(obj2)) {
    return obj1;
  }
  const clone = deepClone(obj1);
  for (let key in obj2) {
    if (obj2[key] !== undefined) {
      if (obj2[key].constructor == Object) {
        clone[key] = mergeObject(clone[key], obj2[key]);
      } else {
        clone[key] = obj2[key];
      }
    }
  }
  return clone;
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
