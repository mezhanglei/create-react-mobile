import { isEmpty } from "./type";

/**
 * 防抖， 一段时间内没有再执行则执行完一次，否则重新执行
 * @param {*} fn 目标函数
 * 使用： 1. 实例化一个对象: const fn = debounce(函数)
 *        2. 执行fn()
 */
export function debounce(fn: any, time: number = 500): any {
  let timeout: any = null;
  return function (...args: any[]) {
    if (timeout !== null) clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn?.(...args);
    }, time);
  };
};

/**
 * 节流, 一段时间只能执行一次
 * @param {*} fn 目标函数
 * 使用: 1. 实例化一个对象: const fn = throttle(函数)
 *       2. 执行fn()
 */
export function throttle(fn: any, time: number = 200): any {
  let timer: any = null;

  return function (...args: any[]) {
    if (!timer) {
      timer = setTimeout(function () {
        fn?.(...args);
        timer = null;
      }, time);
    }
  };
};

// 将函数或promise统一为promise
export function createPromise(x: Promise<any> | ((...rest: any[]) => any)) {
  if (x instanceof Promise) { // if promise just return it
    return x;
  }
  if (typeof x === 'function') {
    // if function is not async this will turn its result into a promise
    // if it is async this will await for the result
    return (async () => await x())();
  }
  return Promise.resolve(x);
}

/**
 * 顺序执行数组中的函数或promise，返回对应的结果数组
 */
export const asyncSequentialExe = (queues?: Array<() => Promise<any>>, forbidFn?: Function) => {

  // 异步队列顺序执行，可以根据条件是否终止执行
  const results: any[] = [];
  return queues?.reduce((lastPromise, currentPromise, index) => {
    return lastPromise?.then(async (res: any) => {
      if (res === null) return;
      results.push(res);
      const valid = await forbidFn?.(res, results, index);
      if (valid) {
        return null;
      } else {
        return createPromise(currentPromise)
      }
    });
  }, createPromise(queues?.[0])).then((res: any) => Promise.resolve([...results, res]?.filter((val) => !isEmpty(val))));
};

// 并发执行
export async function concurrentExe(queues: any[], max = 4) {

  return new Promise((resolve, reject) => {
    const len = queues?.length;
    let idx = 0;
    let counter = 0;
    const start = async () => {
      while (idx < len && max > 0) {
        max--;
        idx++
        createPromise(queues[idx]).then((res: any) => {
          max++;
          counter++;
          if (counter === len) {
            resolve(res);
          } else {
            start();
          }
        }).catch((err) => {
          reject(err);
        });
      }
    }
    start();
  });
}

// settimeout模拟的循环方法
export async function poll(fn: () => any, forbidFn: (val: any) => boolean, interval = 2500) {
  const resolver = async (resolve: (arg0: any) => void, reject: (arg0: any) => void) => {
    try {
      const result = await fn();
      // call validator to see if the data is at the state to stop the polling
      const valid = forbidFn(result);
      if (valid === true) {
        resolve(result);
      } else {
        setTimeout(resolver, interval, resolve, reject);
      }
    } catch (e) {
      // if validator returns anything other than "true" or "false" it stops polling
      reject(e);
    }
  };
  return new Promise(resolver);
}

