/**
 * 函数的依赖注入
 * 使用方式：
 * 1. 使用injector.register收集或注册需要使用的依赖项
 * 2. const newFunc = injector.resolve方法给目标函数注入形参依赖项
 * 3. 执行newFunc函数代替原目标函数
 */

export default (function injector() {
  let modules = {};

  // 获取目标函数的依赖参数字符串列表
  const getFuncParams = function (func: Function) {
    var matches = func.toString().match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m);
    if (matches && matches.length > 1)
      return matches[1].replace(/\s+/g, '').split(',');
    return [];
  };

  // 根据目标函数依赖参数字符串列表返回依赖列表
  const setFuncParams = function (deps: string[], modules: Record<string, unknown>) {
    const result: Array<unknown> = [];
    for (let i = 0; i < deps?.length; i++) {
      if (modules.hasOwnProperty(deps[i])) {
        result.push(modules[deps[i]]);
      }
    }
    return result;
  };

  // 注册依赖
  const register = (key: string | { [key: string]: unknown }, value?: unknown) => {
    if (typeof key === 'string') {
      modules[key] = value;
    } else if (typeof key === 'object') {
      Object.keys(key).map((n) => register(n, key?.[n]));
    }
  };

  // 注入依赖
  const resolve = (func: [...string[], Function] | Function, scope?: unknown) => {
    let deps;
    if (func instanceof Array) {
      let last = func.length - 1;
      deps = func.slice(0, last) as string[];
      func = func[last] as Function;
    } else {
      deps = getFuncParams(func as Function);
    }

    const dependencies = setFuncParams(deps, modules);

    return function () {
      (func as Function).apply(scope || {}, dependencies);
    };
  };

  return {
    register,
    resolve
  };
})();
