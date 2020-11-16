
// 数组的一些方法
import { isObject, isArray, isEmpty } from "./type";

// 简单深拷贝
const simpleClone = function (val) { return JSON.parse(JSON.stringify(val)); };

/**
 * 数组排序(数据量在万以内采取这种) 数组元素支持Object和简单类型
 * @param {Array} data 数组
 * @param {String} attr 属性名，可选 数组元素为Object时设置
 * @param {bool} asc // 表示升序或降序，默认true升序
 */
export function sortByAttr(data, attr, asc = true) {
    let arr = data;
    arr.sort(function (a, b) {
        if (!isObject(a) && !isObject(b)) {
            a = a;
            b = b;
        } else {
            a = a[attr];
            b = b[attr];
        }
        return (a - b) * (asc ? 1 : -1);
    });
    return arr;
}

/**
 * 冒泡排序(从小到大), 数组元素支持Object和简单数据类型
 * @param {Array} arr
 * @param {String} attr 属性名，可选, 数组元素为Object时设置
 */
export function popSort(arr, attr) {
    if (arr == null) return arr;
    for (var i = 0; i < arr.length - 1; i++) {
        for (var j = 0; j < arr.length - 1 - i; j++) {
            // 相邻元素两两对比，元素交换，大的元素交换到后面
            if (!isObject(arr[j])) {
                if (arr[j] > arr[j + 1]) {
                    var temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            } else {
                if (arr[j][attr] > arr[j + 1][attr]) {
                    var temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }
    return arr;
}

/**
 * 快速排序(从小到大) (数据量大采取这种) 数组元素支持Object和简单数据类型
 * @param {Array} arr
 * @param {String} attr 属性名，可选，数组元素为Object时设置
 */
export const quickSort = function (arr, attr) {
    if (arr.length <= 1) {//如果数组长度小于等于1无需判断直接返回即可 
        return arr;
    }
    let pivotIndex = Math.floor(arr.length / 2);//取基准点
    let pivot = arr.splice(pivotIndex, 1)[0];

    let left = [];//存放比基准点小的数组
    let right = [];//存放比基准点大的数组 
    for (let i = 0; i < arr.length; i++) { //遍历数组，进行判断分配
        if (!isObject(arr[i])) {
            if (arr[i] < pivot && !isEmpty(arr[i])) {
                left.push(arr[i]);//比基准点小的放在左边数组
            } else {
                right.push(arr[i]);//比基准点大的放在右边数组
            }
        } else {
            if (arr[i][attr] < pivot[attr] && !isEmpty(arr[i][attr])) {
                left.push(arr[i]);//比基准点小的放在左边数组
            } else {
                right.push(arr[i]);//比基准点大的放在右边数组
            }
        }
    }
    //递归执行以上操作,对左右两个数组进行操作，直到数组长度为<=1
    if (isEmpty(pivot)) {
        return quickSort(left, attr).concat([], quickSort(right, attr));
    } else {
        return quickSort(left, attr).concat([pivot], quickSort(right, attr));
    }
};

/**
 * 一维数组转化为二维数组
 * @param {Array} array 一维数组
 * @param {Number} num 组成二维数组的元素包括几个一维数组
 */
export function singleToMultiple(array, num) {
    // 一维数组的个数
    const len = array && array.length;
    // 分成几份
    const totalNum = len % num == 0 ? len / num : Math.floor(len / num + 1);
    let res = [];
    for (let i = 0; i < totalNum; i++) {
        let temp = array.slice(i * num, i * num + num);
        res.push(JSON.parse(JSON.stringify(temp)));
    }
    return res;
}

/**
 * 嵌套数组展开(嵌套字段为children)
 * @param {*} list 多维数组
 * @param {*} res 返回的一维数组
 */
export function flatten(list = [], res = []) {

    list.forEach((item) => {
        res.push(item);
        if (item.children instanceof Array && item.children?.length) {
            flatten(item.children, res);
            delete item.children;
        }
    });
    return res;
}

/**
 * 根据数组中的某个字段值，相同的嵌套在一起，不同的分开
 * @param {Array} array
 * @param {String} dependName 用来区分的字段名
 * @param {String} childName 嵌套的子元素字段名
 * @param {Array} otherName 数组一维需要添加的字段
 */
export function arrGroupByAtrr(array, { dependName = 'id', childName = 'children', otherName = [] } = {}) {
    // 缓存内容，用来判断是否存在这个相同的类型
    let newObj = {};
    // 最终需要的数组格式
    let newArr = [];
    array &&
        array.map((item) => {
            // 如果是一条新数据则创建一条
            if (isEmpty(newObj[item[dependName]])) {
                // 组合嵌套完成的对象
                let getObj = {};
                // 添加区分字段
                getObj[dependName] = item[dependName];
                // 添加嵌套的子数组字段
                getObj[childName] = [item];
                // 添加需要的其他字段
                otherName.map((str) => {
                    getObj[str] = item[str];
                });
                // 将嵌套好的对象添加进新数组
                newArr.push(getObj);
                newObj[item[dependName]] = item;
                // 如果已经存在同类型的则添加到同类型的对象下
            } else {
                newArr &&
                    newArr.map((sub) => {
                        if (sub[dependName] === item[dependName]) {
                            sub[childName].push(item);
                        }
                    });
            }
        });
    return newArr;
}

/**
 * 数组去重 数组元素支持Object和简单数据类型
 * @param {Array} arr 数组
 * @param {String} attr 属性名 可选，数组元素为Object时设置
 */
export function unique(arr, attr) {
    const result = [];
    const tagobj = {};
    for (let item of arr) {
        if (!isObject(item)) {
            if (isEmpty(tagobj[item]) && !isEmpty(item)) {
                result.push(item);
                tagobj[item] = 1;
            }
        } else {
            if (isEmpty(tagobj[item[attr]]) && !isEmpty(item)) {
                result.push(item);
                tagobj[item[attr]] = 1;
            }
        }
    }
    return result;
}

/**
 * 将数组中的对象的属性名替换掉指定的新属性名(支持递归嵌套)
 * @param {Array} data 数组
 * @param {Object} attrObj 需要替换的属性名和新属性名,格式: {旧字段: 新字段, 旧字段: 新字段}
 * @param {Object} children 如果有嵌套数组则指明嵌套的属性名字符串, 默认为children字符串
 */
export function formaterData(data, attrObj = { label: 'key' }, children = 'children') {
    if (!isObject(attrObj)) {
        return data;
    }
    let newArr = [];
    data.map((item) => {
        let newObj = {};
        // 遍历旧属性数组更改属性名
        const keys = Object.keys(attrObj);
        keys.map((key) => {
            newObj[attrObj[key]] = item[key];
        });
        // 判断是否有嵌套数组, 有的话也同样执行
        if (isArray(item[children]) && item[children].length > 0) {
            newObj[children] = formaterData(item[children], attrObj, children);
        }
        newArr.push({ ...item, ...newObj });
    });
    return newArr;
}

/**
 * 根据数字生成指定自然数数组
 * @param {*} len 数组长度
 */
export function createArrayByLen(len) {
    return [...new Array(len).keys()];
}

// 获取js数组中字符串的最长公共前缀
export function longCommonPrefix(strs) {
    if (strs.length == 0) {
        return "";
    }
    if (strs.length == 1) {
        return strs[0];
    }

    // 获取最短长度
    let minLen = -1, prefix = '', char = '';
    strs.forEach(ele => {
        if (minLen == -1) {
            minLen = ele.length;
        } else {
            minLen = ele.length < minLen ? ele.length : minLen;
        }
    });
    if (minLen == 0) {
        return "";
    }
    // 判断是否为前缀
    for (let i = 0; i < minLen; i++) {
        char = strs[0][i];
        // 用于标记该字符是否为前缀
        let flag = true;
        for (let j = 1; j < strs.length; j++) {
            if (strs[j][i] != char) {
                flag = false;
            }
        }
        if (flag) {
            prefix += char;
        } else {
            return prefix;
        }
    }
    return prefix;
};

/**
 * 使用indexof方法实现模糊查询  数组元素支持Object和简单数据类型
 * @param  {Array}  list     数组
 * @param  {String} keyWord  查询的关键词
 * @param {String} attr 可选，当数组元素为Object时需要指定attr属性名
 * @return {Array}           查询的结果
 */
export function indexOfQuery(list, keyWord, attr) {
    let newList = list;
    let arr = [];
    for (let i = 0; i < newList.length; i++) {
        if (!isObject(newList[i])) {
            if (newList[i]?.toString().indexOf(keyWord) > -1) {
                arr.push(newList[i]);
            }
        } else {
            if (newList[i][attr]?.toString().indexOf(keyWord) > -1) {
                arr.push(newList[i]);
            }
        }
    }
    return arr;
}

/**
 * 使用spilt方法实现模糊查询 数组元素支持Object和简单数据类型
 * @param  {Array}  list     进行查询的数组
 * @param  {String} keyWord  查询的关键词
 * @param {String} attr 可选，当数组元素为Object时需要指定attr属性名
 * @return {Array}           查询的结果
 */
export function splitQuery(list, keyWord = "", attr) {
    let newList = list;
    let arr = [];
    for (let i = 0; i < newList.length; i++) {
        if (!isObject(newList[i])) {
            if (newList[i]?.toString().split(keyWord).length > 1) {
                arr.push(newList[i]);
            }
        } else {
            if (newList[i][attr]?.toString().split(keyWord).length > 1) {
                arr.push(newList[i]);
            }
        }
    }
    return arr;
}

/**
 * 使用test方法实现模糊查询(推荐，可以给正则添加i规则来决定是否区分大小写) 数组元素支持Object和简单数据类型
 * @param  {Array}  list     原数组
 * @param  {String} keyWord  查询的关键词
 * @param {String} attr 可选，当数组元素为Object时需要指定attr属性名
 * @return {Array}           查询的结果
 */
export function regQuery(list, keyWord = "", attr) {
    let newList = list;
    const reg = new RegExp(keyWord);
    let arr = [];
    for (let i = 0; i < newList.length; i++) {
        if (!isObject(newList[i])) {
            if (reg.test(newList[i])) {
                arr.push(newList[i]);
            }
        } else {
            if (reg.test(newList[i][attr])) {
                arr.push(newList[i]);
            }

        }
    }
    return arr;
}

/**
 * 嵌套数组中根据key值查询父元素并返回(嵌套字段为children)
 * @param {*} key 查询的字段名key
 * @param {*} value 查询的字段值value
 * @param {*} tree 嵌套数组
 */
export function getParent(key, value, tree) {
    let parent;
    for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children) {
            if (node.children.some((item) => item[key] === value)) {
                parent = node[key];
            } else if (getParent(key, value, node.children)) {
                parent = getParent(key, value, node.children);
            }
        }
    }
    return parent;
};

/**
 * 判断两个数组是否具有数量和内容相同的元素
 * @param {*} arr1 
 * @param {*} arr2 
 */
export function isAllMatch(arr1 = [], arr2 = []) {
    let noMatched = arr1.some(item => (arr2.indexOf(item) < 0));
    return !noMatched;
}
