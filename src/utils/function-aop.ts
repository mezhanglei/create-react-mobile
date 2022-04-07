/**
 * aop包装函数：在目标函数前面或后面添加可以执行的方法
 * 使用方式: 
 * const aop = new AopFactory(fn);
 * const aopBeforeFn = aop.addBefore(() => coonsole.log('在目标前面执行'))
 * const aopAfterFn = aop.addAfter(() => coonsole.log('在目标后面执行'))
 * 使用aopBeforeFn或aopAfterFn替代原函数fn
 */
export class AopFactory {
  private originFun: any;
  private beforeFun?: Function;
  private afterFun?: Function;
  constructor(originFun: Function) {
    this.originFun = this.init(originFun);
  }

  // 初始化一个aop实例
  init(originFun: Function) {
    return (...args: any[]) => {
      const beforeRet = this.beforeFun?.(...args);
      if (typeof beforeRet === 'boolean' && !beforeRet) return;
      const ret = originFun?.(...args);
      this.afterFun?.(...args);
      return ret;
    };
  }

  // 增加在前面执行的方法
  addBefore(fn?: (...args: any[]) => boolean | undefined) {
    if (typeof fn === 'function') {
      this.beforeFun = fn;
    }
    return this.originFun;
  }

  // 增加在后面执行的方法
  addAfter(fn?: (...args: any[]) => void) {
    if (typeof fn === 'function') {
      this.afterFun = fn;
    }
    return this.originFun;
  };
};
