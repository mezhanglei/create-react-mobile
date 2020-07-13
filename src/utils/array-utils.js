
// 数组的一些方法

/**
 * 根据数组中的对象选项的某个属性值进行排序, 返回新的数组
 * @param {Array} data 数组
 * @param {String} attr 属性名
 * @param {bool} asc // 表示升序或降序，默认true升序
 */
export function sortByAttr(data, attr, asc = true) {
    let arr = data;
    arr.sort(function (a, b) {
        a = a[attr];
        b = b[attr];
        return (a - b) * (asc ? 1 : -1);
    });
    return arr;
}

/**
 * 冒泡排序(从小到大)
 * @param {Array} arr
 */
export function popSort(arr) {
    if (arr == null) return arr;
    for (var i = 0; i < arr.length - 1; i++) {
        for (var j = 0; j < arr.length - 1 - i; j++) {
            // 相邻元素两两对比，元素交换，大的元素交换到后面
            if (arr[j] > arr[j + 1]) {
                var temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    return arr;
}

/**
 * 快速排序(从小到大)
 * @param {Array} arr 
 */
export const quickSort = function (arr) {
    if (arr.length <= 1) {//如果数组长度小于等于1无需判断直接返回即可 
        return arr;
    }
    let pivotIndex = Math.floor(arr.length / 2);//取基准点 
    let pivot = arr.splice(pivotIndex, 1)[0];//取基准点的值,splice(index,1)函数可以返回数组中被删除的那个数
    let left = [];//存放比基准点小的数组
    let right = [];//存放比基准点大的数组 
    for (let i = 0; i < arr.length; i++) { //遍历数组，进行判断分配
        if (arr[i] < pivot) {
            left.push(arr[i]);//比基准点小的放在左边数组
        } else {
            right.push(arr[i]);//比基准点大的放在右边数组
        }
    }
    //递归执行以上操作,对左右两个数组进行操作，直到数组长度为<=1； 
    return quickSort(left).concat([pivot], quickSort(right));
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
            if (!newObj[item[dependName]]) {
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
 * 数组去重(支持数组元素为对象的情况)
 * @param {Array} arr 数组
 * @param {String} attr 当数组元素为对象时需要指定attr
 */
export function unique(arr, attr) {
    const result = [];
    const tagobj = {};
    for (let item of arr) {
        if (typeof item === 'object') {
            if (!tagobj[item[attr]]) {
                result.push(item);
                tagobj[item[attr]] = 1;
            }
        } else {
            if (!tagobj[item]) {
                result.push(item);
                tagobj[item] = 1;
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
    if (Object.prototype.toString.call(attrObj) !== '[object Object]') {
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
        if (Object.prototype.toString.call(item[children]) === '[object Array]' && item[children].length > 0) {
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
 * 使用indexof方法实现模糊查询
 * @param  {Array}  list     进行查询的数组
 * @param  {String} keyWord  查询的关键词
 * @return {Array}           查询的结果
 */
export function indexOfQuery(list, keyWord) {
    var arr = [];
    for (var i = 0; i < list.length; i++) {
        if (list[i].indexOf(keyWord) >= 0) {
            arr.push(list[i]);
        }
    }
    return arr;
}

/**
 * 使用spilt方法实现模糊查询
 * @param  {Array}  list     进行查询的数组
 * @param  {String} keyWord  查询的关键词
 * @return {Array}           查询的结果
 */
export function splitQuery(list, keyWord) {
    var arr = [];
    for (var i = 0; i < list.length; i++) {
        if (list[i].split(keyWord).length > 1) {
            arr.push(list[i]);
        }
    }
    return arr;
}
