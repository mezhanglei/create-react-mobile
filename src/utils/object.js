
import { isObject, isArray } from "type.js";
/**
 * 完全深拷贝
 * @param {*} copyObj 目标对象或数组
 * JSON.parse(JSON.stringify(obj))的缺陷：
 * 1.如果obj里面有时间对象，转化后只能是字符串形式
 * 2.如果obj里有RegExp、Error对象，则序列化的结果将只得到空对象
 * 3.如果obj里有函数，undefined，则序列化的函数和undefined会丢失
 * 4.如果obj里有NaN、Infinity和-Infinity，则序列化的结果会变成nul
 * 5.JSON.stringify()只能序列化对象的可枚举的自有属性
 * 6.如果对象中存在循环引用的情况也无法正确实现深拷贝
 * 所以上述情况下是不适合使用JSON.parse(JSON.stringify())这种方式实现深拷贝的，但除了上述情况，建议使用JSON.parse(JSON.stringify())
 */
export function deepClone(copyObj) {
    let obj;
    if (isArray(copyObj)) {
        obj = [];
    } else if (isObject(copyObj)) {
        obj = {};
    } else {
        //不再具有下一层次
        return copyObj;
    }
    if (isArray(copyObj)) {
        for (let i = 0, len = copyObj.length; i < len; i++) {
            obj.push(deepClone(copyObj[i]));
        }
    } else if (isObject(copyObj)) {
        for (let key in copyObj) {
            obj[key] = deepClone(copyObj[key]);
        }
    }
    return obj;
}

// 判断两个对象(包括数组)是否相等
export function isObjectEqual(a, b) {
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
            if (!this.isObjectEqual(propA, propB)) {
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
 * @param {*} namespace 
 */
export function objectToFormData(obj, formData) {
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
