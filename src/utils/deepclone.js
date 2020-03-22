/**
 * 完全深拷贝
 * @param {*} obj 目标对象或数组
 * JSON.parse(JSON.stringify(obj))的缺陷：
 * 1.如果obj里面有时间对象，转化后只能是字符串形式
 * 2.如果obj里有RegExp、Error对象，则序列化的结果将只得到空对象
 * 3.如果obj里有函数，undefined，则序列化的函数和undefined会丢失
 * 4.如果obj里有NaN、Infinity和-Infinity，则序列化的结果会变成nul
 * 5.JSON.stringify()只能序列化对象的可枚举的自有属性
 * 6.如果对象中存在循环引用的情况也无法正确实现深拷贝
 * 所以上述情况下是不适合使用JSON.parse(JSON.stringify())这种方式实现深拷贝的，但除了上述情况，建议使用JSON.parse(JSON.stringify())
 */

// 获取类型
function getType(obj) {
  //tostring会返回对应不同的标签的构造函数
  const toString = Object.prototype.toString;
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  };
  if (obj instanceof Element) {
    return 'element';
  }
  return map[toString.call(obj)];
}

// 深拷贝
function deepClone(copyObj) {
  let type = getType(copyObj);
  let obj;
  if (type === 'array') {
    obj = [];
  } else if (type === 'object') {
    obj = {};
  } else {
    //不再具有下一层次
    return copyObj;
  }
  if (type === 'array') {
    for (let i = 0, len = copyObj.length; i < len; i++) {
      obj.push(deepClone(copyObj[i]));
    }
  } else if (type === 'object') {
    for (let key in copyObj) {
      obj[key] = deepClone(copyObj[key]);
    }
  }
  return obj;
}

export { getType, deepClone };