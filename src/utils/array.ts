
// 数组的一些方法
import { isObject, isArray, isEmpty } from "./type";
import produce from "immer";
import { isObjectEqual } from "./object";

/**
 * 数组排序(数据量在万以内采取这种) 数组元素支持Object和简单类型
 * @param {Array} data 数组
 * @param {String} attr 属性名，可选 数组元素为Object时设置
 * @param {bool} asc // 表示升序或降序，默认true升序
 */
export function sortByAttr(data: any[], attr: string, asc: boolean = true): any[] {
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
export function popSort(arr: any[], attr: string): any[] {
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
export const quickSort = (arr: any[], attr: string): any[] => {
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
 * @param {Number} unit 分割单位个数
 */
export function singleToMultiple(array: any[], unit: number): any[] {
    // 一维数组的个数
    const len = array && array.length;
    // 分成几份
    const totalNum = len % unit == 0 ? len / unit : Math.floor(len / unit + 1);
    let res = [];
    for (let i = 0; i < totalNum; i++) {
        let temp = array.slice(i * unit, i * unit + unit);
        res.push(JSON.parse(JSON.stringify(temp)));
    }
    return res;
}

/**
 * 嵌套数组展开(嵌套字段为children)
 * @param {*} list 多维数组
 * @param {*} res 返回的一维数组
 */
export function flatten(list: any[] = [], res: any[] = []): any[] {

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
 * @param {Array} object {key: 依赖字段， extra: 额外的字段，childrenName：子元素的children名}
 */
export function arrGroupByAtrr(array: any[], { key, extra = [], childrenName = 'children' }: any = {}) {
    // 缓存内容，用来判断是否存在这个相同的类型
    const cache: any = {};
    // 最终需要的数组格式
    const newArr: any[] = [];
    array?.map((item) => {
        // 如果是一条新数据则创建一条
        if (isEmpty(cache[item[key]])) {
            // 组合嵌套完成的对象
            let newObject: any = {};
            // 添加区分字段
            newObject[key] = item[key];
            // 添加嵌套的子数组字段
            newObject[childrenName] = [item];
            // 添加需要的其他字段
            extra.map((str: string) => {
                newObject[str] = item[str];
            });
            // 将嵌套好的对象添加进新数组
            newArr.push(newObject);
            cache[item[key]] = item;
            // 如果已经存在同类型的则添加到同类型的对象下
        } else {
            newArr?.map((sub) => {
                if (sub[key] === item[key]) {
                    sub[childrenName].push(item);
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
export function unique(arr: any[], attr: string): any[] {
    const result = [];
    const tagobj: any = {};
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
export function formaterData(data: any[], attrObj: any = { label: 'key' }, children = 'children'): any[] {
    if (!isObject(attrObj)) {
        return data;
    }
    let newArr: any[] = [];
    data.map((item) => {
        let newObj: any = {};
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
export function createArrayByLen(len: number): number[] {
    return [...new Array(len).keys()];
}

// 获取js数组中字符串的最长公共前缀
export function longCommonPrefix(strs: any[]): string {
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
 * 判断两个数组是否具有数量和内容相同的元素(忽略顺序)
 * @param {*} arr1 
 * @param {*} arr2 
 * @param {*} condition 判断相等的条件
 */
export function isArrSame(arr1: any, arr2: any, condition: (item1: any, item2: any) => boolean): boolean {
    if (!(arr1 instanceof Array) || !(arr2 instanceof Array)) {
        return false;
    }
    if (arr1?.length !== arr2?.length) return false;
    let noMatched = arr1?.some(item1 => !arr2?.some(item2 => condition(item2, item1)));
    return !noMatched;
}

/**
 * 深度优先遍历非递归(先进后出的栈结构，有回溯行为，速度慢些)
 * @param {*} node 结点
 */
export function deepTraversal(node: any): any[] {
    // 存储节点
    let cache = [];
    if (node != null) {
        // 记录栈
        let stack = [];
        stack.push(node);
        while (stack.length !== 0) {
            // 删除栈
            let item: any = stack.pop();
            cache.push(item);
            // 添加栈
            if (item.children) {
                let child = item.children;
                for (let i = child.length - 1; i >= 0; i--)
                    stack.push(child[i]);
            }
        }
    }
    return cache;
}

/**
 * 广度优先遍历树非递归（先进先出的队列结构，无回溯行为，但是需要内存空间，速度相对快）
 * @param {*} node 根节点
 */
export function breadthFirstSearch(node: any): any[] {
    // 存储节点
    let cache = [];
    if (node != null) {
        let queue = [];
        queue.unshift(node);
        while (queue.length != 0) {
            let item: any = queue.shift();
            cache.push(item);
            const children = item.children;
            for (var i = 0; i < children.length; i++)
                queue.push(children[i]);
        }
    }
    return cache;
}

/**
 * 返回目标节点的叶子节点(广度优先)
 * @param {*} node 根节点
 * @param {*} key 返回的节点字段属性
 * @param {*} childrenName 标识孩子的字段名
 */
export function findLeaves(node: any, key = 'id', childrenName = 'children'): any[] {
    // 存储节点
    let cache: any[] = [];
    if (node != null) {
        let queue = [];
        queue.unshift(node);
        while (queue.length != 0) {
            let item = queue.shift();
            if (item && !(item[childrenName]?.length > 0)) {
                if (item[key]) {
                    cache = cache.concat([item[key]]);
                }
            }
            for (var i = 0; i < item[childrenName]?.length; i++)
                queue.push(item[childrenName][i]);
        }
    }
    return cache;
}

/**
 * 返回根节点中的目标节点的路径
 * @param key 搜索的目标字段key
 * @param value 搜索的目标字段值
 * @param rootNode 搜索节点树的根节点
 */
export const findPath = (key: string, value: any, rootNode: any): any[] | undefined => {

    //定义变量保存当前结果路径
    const path: any[] = [];

    try {
        const getNodePath = (node: any) => {
            path.push(node[key]);
            //找到符合条件的节点，通过throw终止掉递归
            if (node[key] == value) {
                throw ("ok");
            }
            if (node?.children && node?.children?.length > 0) {
                for (var i = 0; i < node.children.length; i++) {
                    getNodePath(node.children[i]);
                }
                //当前节点的子节点遍历完依旧没找到，则删除路径中的该节点
                path.pop();
            } else {
                //找到叶子节点时，删除路径当中的该叶子节点
                path.pop();
            }
        };

        getNodePath(rootNode);
    } catch (res) {
        if (res === "ok") {
            return path;
        } else {
            return [];
        }
    }
};

/**
 * 树列表中根据key值返回对应的节点(嵌套字段为children)
 * @param {*} key 查询的字段名
 * @param {*} value 查询的字段值
 * @param {*} tree 树列表
 */
export function getNode(key: string, value: any, tree = []): any {
    let ele;
    for (let i = 0; i < tree.length; i++) {
        const node: any = tree[i];
        if (node[key] === value) {
            ele = node;
        } else if (node?.children?.length) {
            ele = getNode(key, value, node?.children);
        }
    }
    return ele;
};

// 根据某个过滤函数，从遍历器中寻找到复合条件的值
export function findInArray(array: any, callback: (value: any, i?: number, array?: any) => boolean | undefined): any {
    for (let i = 0, length = array?.length; i < length; i++) {
        if (callback.apply(callback, [array[i], i, array])) return array[i];
    }
}

// 转化对象数组为map数据
export const getArrMap = (arr: any[] = [], valueKey?: string, labelKey?: string) => {
    const data = {};
    arr.forEach((item, index) => data[valueKey ? item[valueKey] : index] = labelKey ? item[labelKey] : item);
    return data;
};


// 两个元素交换位置		
export const changeLocation = (arr: any[], index1: number, index2: number) => {
    arr[index1] = arr.splice(index2, 1, arr[index1])[0];
    return arr;
}

// 根据条件合并两个对象数组
export const combinedArr = (arr1: object[], arr2: object[], condition: (next: object, cur: object, nextIndex: number, curIndex: number) => boolean) => {
    const ret: any[] = [];
    arr2?.reduce((combined: object[], cur, curIndex) => {
        let target = combined?.find((next, nextIndex) => condition(next, cur, nextIndex, curIndex));
        if (target) {
            target = { ...target, ...cur };
            ret?.push(target)
        } else {
            ret?.push(cur);
        }
        return combined;
    }, arr1)
    return ret;
}

// 更新对象数组中指定项的值
export const updateArrItem = (arr: any[], itemData: any, condition: (item: any, index?: number) => boolean) => {
    const newArr = produce(arr, draft => {
        if (draft && itemData) {
            const index = draft?.findIndex((item, index) => condition(item, index));
            if (isObject(itemData)) {
                Object.keys(itemData)?.map((key) => {
                    draft[index][key] = itemData[key];
                })
            } else {
                draft[index] = itemData;
            }
        }
    });
    return newArr;
}

export const arrayMove = (arr: any[], preIndex: number, nextIndex: number) => {
    //如果当前元素在拖动目标位置的下方，先将当前元素从数组拿出，数组长度-1，我们直接给数组拖动目标位置的地方新增一个和当前元素值一样的元素，
    //我们再把数组之前的那个拖动的元素删除掉，所以要len+1
    const newArr = produce(arr, draft => {
        if (preIndex > nextIndex) {
            draft.splice(nextIndex, 0, arr[preIndex]);
            draft.splice(preIndex + 1, 1)
        }
        else if (preIndex < nextIndex) {
            //如果当前元素在拖动目标位置的上方，先将当前元素从数组拿出，数组长度-1，我们直接给数组拖动目标位置+1的地方新增一个和当前元素值一样的元素，
            //这时，数组len不变，我们再把数组之前的那个拖动的元素删除掉，下标还是index
            draft.splice(nextIndex + 1, 0, arr[preIndex]);
            draft.splice(preIndex, 1)
        }
    })
    return newArr;
}