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

