
// 数组的一些方法

/**
 * 针对[{},{}..]数组对象根据对象中的某个字段进行排序
 * @param {String} attr 属性名
 * @param {bool} asc // 表示升序或降序，默认true升序
 * 使用方式 数组.sort(sortBy('属性名'))
 */
export function sortBy(attr, asc) {
  //第二个参数没有传递 默认升序排列
  if (asc == undefined) {
    asc = 1;
  } else {
    asc = (asc) ? 1 : -1;
  }
  return function (a, b) {
    a = a[attr];
    b = b[attr];
    if (a < b) {
      return asc * -1;
    }
    if (a > b) {
      return asc * 1;
    }
    return 0;
  }
}

/**
 * 冒泡排序(从小到大)
 * @param {Array} arr
 */
export function popSort(arr) {
  if (arr == null) return arr;
  for (let i = 0; i < arr.length - 1; i++) {
    //决定每一轮比较多少次
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        let tmp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = tmp;
      }
    }
  }
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
}

/**
 * 一维数组转化为二维数组
 * @param {Array} array 一维数组
 * @param {Number} num 二维数组每一项包含几个一维数组元素 
 */
export function arrayChange(array, num) {
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
 * 根据数组中对象的某一个字段,字段值相同的多个对象选择出来组成数组, 成为新对象的一个元素
 * @param {Array} array
 * @param {String} dependendStr 新对象中用来区分不同类型的字段
 * @param {String} childrenStr 新对象中用来存放相同类型数据组成的数组的字段
 * @param {Array} other 新的对象所需要的其他字段, 格式例如['str1', 'str2', 'str3']
 */
export function arrayGroup(array, dependendStr, childrenStr, other) {
  // 缓存内容，用来判断是否存在这个相同的类型
  let newObj = {};
  // 最终需要的数组格式
  let newArr = [];
  array &&
    array.map((item) => {
      // 如果是一条新数据则创建一条
      if (!newObj[item[dependendStr]]) {
        // 组合嵌套完成的对象
        let getObj = {}
        // 添加区分字段
        getObj[dependendStr] = item[dependendStr];
        // 添加嵌套的子数组字段
        getObj[childrenStr] = [item];
        // 添加需要的其他字段
        other.map(str => {
          getObj[str] = item[str]
        });
        // 将嵌套好的对象添加进新数组
        newArr.push(getObj);
        newObj[item[dependendStr]] = item;
        // 如果已经存在同类型的则添加到同类型的对象下
      } else {
        newArr &&
          newArr.map((sub) => {
            if (sub[dependendStr] === item[dependendStr]) {
              sub[childrenStr].push(item);
            }
          });
      }
    });
  return newArr;
}


/**
 * 最简单的数组去重
 * @param {array} array 
 */
// export function unique(array) {
//   let temp = []; //一个新的临时数组
//   for (let i = 0; i < array.length; i++) {
//     if (temp.indexOf(array[i]) == -1) {
//       temp.push(array[i]);
//     }
//   }
//   return temp;
// }

/*
* 推荐的方法
*
* 方法的实现代码相当酷炫，
* 实现思路：获取没重复的最右一值放入新数组。
* （检测到有重复值时终止当前循环同时进入顶层循环的下一轮判断
*/
export function unique(array) {
  let temp = [];
  let index = [];
  let length = array.length;
  for (let i = 0; i < length; i++) {
    for (let j = i + 1; j < length; j++) {
      if (array[i] === array[j]) {
        i++;
        j = i;
      }
    }
    temp.push(array[i]);
    index.push(i);
  }
  return temp;
}

//利用map和set去重
// export function unique(arr) {
//   let map = new Map();
//   let array = new Array();  // 数组用于返回结果
//   for (let i = 0; i < arr.length; i++) {
//     if (map.has(arr[i])) {  // 如果有该key值
//       map.set(arr[i], true);
//     } else {
//       map.set(arr[i], false);   // 如果没有该key值
//       array.push(arr[i]);
//     }
//   }
//   return array;
// }

//利用set和三点运算符
// [...new Set(arr)]

//利用filter去重
// export function unique(arr) {
//   return arr.filter(function (item, index, arr) {
//     //当前元素，在原始数组中的第一个索引==当前索引值，否则返回当前元素
//     return arr.indexOf(item, 0) === index;
//   });
// }