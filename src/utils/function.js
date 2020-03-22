
/**
 * 单例模式函数: 作用传入一个方法,多次执行单例模式函数而只会执行一次方法
 * @param {function} fn 传入的用来执行的方法
 * 使用方式: 1:先实例化一个对象 const fn = getSingleton(被包裹的执行的方法)
 *           2: 执行函数 fn()
 */
export function getSingleton(fn) {
  let instance = null;

  return function () {
    if (!instance) {
      instance = fn.apply(this, arguments);
    }

    return instance;
  }
};

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
  }
};

/**
 * 发布-订阅者模式 用来实现消息传递
 * 使用方式: 1.首先实例化一个对象 const EventDefined = new EventDefined()
 *           2. 订阅一个事件用来接收值 EventDefined.on('自定义的事件名字', 事件函数)
 *           3. 发布将值传递过去 EventDefined.emit('已定阅的事件名', 需要传的值)
 *           4. 然后在事件函数中可以取到值 function fn(data) { // data就是发布传过来的值 }
 */
export function EventDefined() {
  //订阅自定义事件,同一个事件订阅几次,触发的时候就会触发几次
  this.on = function (type, callback) {
    this.handle = this.handle || {};
    this.handle[type] = this.handle[type] || [];
    this.handle[type].push(callback);
  }
  // 发布传值(目标自定义事件的所有函数都可以接收到值)
  this.emit = function (type, data) {
    this.handle[type].forEach((item, index) => {
      item(data);
    })
  }
}