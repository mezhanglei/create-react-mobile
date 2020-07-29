
/**
 * 单例模式
 * @param {*} fn 目标函数
 * 使用方式: 1:先实例化一个对象 const newFn = getSingle(fn)
 *          2: 执行函数 newFn()
 */
export function getSingle(fn) {
    let instance = null;
    return function () {
        if (!instance) {
            instance = fn.apply(this, arguments);
        }

        return instance;
    };
}

/**
 * 实现缓存递归执行函数功能,原理是让已经执行过的函数的结果缓存起来,当再次想要执行时直接返回结果
 * @param {function} fn 递归调用的函数,且有返回值
 * @param {Object} cache 用来缓存的对象
 * 使用方法: 1: 实例化一个对象: const fn = cacheProxy(需要递归调用的函数)
 *           2: 执行递归函数:  fn()
 */
export function cacheProxy(fn, cache) {
    cache = cache || {};

    return function (arg) {
        //如果缓存数据中没有这个参数对应的值
        if (!cache.hasOwnProperty(arg)) {
            cache[arg] = fn(arg);
        }
        //缓存递归执行结果
        return cache[arg];
    };
};

/**
 * 防抖， 一段时间内没有再执行则执行完一次，否则重新执行
 * @param {*} fn 目标函数
 * 使用： 1. 实例化一个对象: const fn = debounce(函数)
 *        2. 执行fn()
 */
export function debounce(fn) {
    let timeout = null;
    return function () {
        if (timeout !== null) clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn.apply(this, arguments);
        }, 500);
    };
};

/**
 * 节流, 一段时间只能执行一次
 * @param {*} fn 目标函数
 * 使用: 1. 实例化一个对象: const fn = throttle(函数)
 *       2. 执行fn()
 */
export function throttle(fn) {
    let timer = null;
    return function () {
        if (!timer) {
            timer = setTimeout(function () {
                fn.apply(this, arguments);
                timer = null;
            }, 500);
        }
    };
};
