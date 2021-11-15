
/**
 * 监听-订阅者模式(不设置事件类型，触发监听的所有事件)
 * 
 * 使用：1. 继承或实例化一个类const WatchableStore = new WatchableStore()
 *      2. 监听目标事件，const id = WatchableStore.wath(目标事件)，返回一个事件id
 *      3. 通过WatchableStore.triggerAll(data)来触发事件,并传递参数给监听的事件
 *      4. 通过WatchableStore.unwatch(id), 卸载对应的目标事件
 */
export class WatchableStore {

    _watchers: { id: number; handle: Function }[] = [];
    _nextHandlerId: number = 0;

    // 触发事件池里的所有事件(所以监听多个事件，那么触发时会全部触发)
    triggerAll(data: unknown) {
        this._watchers.forEach(watcher => {
            watcher.handle(data);
        });
    }

    // 监听事件，返回id，id用来识别是哪个事件
    watch(func: Function) {
        const id = this._nextHandlerId;
        this._watchers.push({ id, handle: func });
        this._nextHandlerId++;
        return id;
    }

    // 根据监听事件时的id卸载对应的事件
    unwatch(id: number) {
        for (let i = 0; i < this._watchers.length; i++) {
            if (this._watchers[i].id === id) {
                this._watchers.splice(i, 1);
                break;
            }
        }
    }
}

/**
 * 监听-订阅者模式(通过监听时设定事件名，来保证多个事件的监听与触发不会相互干扰)
 * 
 * 使用：1. 继承或实例化一个类const WatchableStoreByType = new WatchableStoreByType()
 *      2. 监听目标事件，const type = WatchableStoreByType.wath(事件名, 目标事件)，返回一个事件type(也就是事件名)
 *      3. 通过WatchableStoreByType.trigger(type, data)来触发对应的监听事件,并传递参数给监听的事件
 *             WatchableStoreByType.triggerAll(data) 触发所有监听的事件
 *      4. 通过WatchableStoreByType.unwatch(type), 卸载对应的目标事件
 */
export class WatchableStoreByType {
    _watchers: { type: string; handle: Function }[] = [];

    // 触发事件池里的所有事件(所以监听多个事件，那么触发时会全部触发)
    triggerAll(data: unknown) {
        this._watchers.forEach(watcher => {
            watcher.handle(data);
        });
    }

    // 触发事件池里对应type的事件
    trigger(type: string, data: unknown) {
        this._watchers.forEach(watcher => {
            if (watcher.type == type) {
                watcher.handle(data);
            }
        });
    }

    // 监听事件，设置事件类型type和要监听的事件
    watch(type: string, func: Function) {
        this._watchers.push({ type, handle: func });
        return type;
    }

    // 根据监听事件时的type卸载对应的事件
    unwatch(type: string) {
        for (let i = 0; i < this._watchers.length; i++) {
            if (this._watchers[i].type === type) {
                this._watchers.splice(i, 1);
                break;
            }
        }
    }
}
