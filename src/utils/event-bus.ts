/**
 * 监听-订阅类(通过监听时设定事件名，来保证多个事件的监听与触发不会相互干扰)
 * 
 * 使用：1. 继承或实例化一个类const eventBus = new EventBus()
 *      2. 监听目标事件，const type = eventBus.on(事件名, 目标事件)，返回一个事件type(也就是事件名)
 *      3. 通过eventBus.emit(type, data)来触发对应的监听事件,并传递参数给监听的事件
 *             eventBus.emitAll(data) 触发所有监听的事件
 *             eventBus.remove(type), 卸载对应的目标事件
 *             eventBus.clear(), 清空对应的目标事件
 */
export default class EventBus {
  _watchers: { type: string; handle: Function }[] = [];

  // 触发事件池里的所有事件(所以监听多个事件，那么触发时会全部触发)
  emitAll(...args: unknown[]) {
    this._watchers.forEach(watcher => {
      watcher.handle(...args);
    });
  }

  // 触发事件池里对应type的事件
  emit(type: string, ...args: unknown[]) {
    this._watchers.forEach(watcher => {
      if (watcher.type == type) {
        watcher.handle(...args);
      }
    });
  }

  // 监听事件，设置事件类型type和要监听的事件
  on(type: string, func: Function) {
    this._watchers.push({ type, handle: func });
    return type;
  }

  // 根据监听事件时的type卸载对应的事件
  remove(type: string) {
    for (let i = 0; i < this._watchers.length; i++) {
      if (this._watchers[i].type === type) {
        this._watchers.splice(i, 1);
        break;
      }
    }
  }

  // 清空监听事件
  clear() {
    this._watchers = []
  }
}
