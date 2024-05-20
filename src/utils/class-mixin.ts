/**
 * 多重继承 一个子类继承多个父类
 * @param mixins 要继承的多个父类
 * 使用demo: class Other extends mixin(Animal, Person) {}
 */
export function mixin(...mixins) {
  class Mix {
    constructor() {
      for (let mixin of mixins) {
        // 拷贝实例属性
        copyProperties(this, new mixin());
      }
    }
  }
  for (let mixin of mixins) {
    copyProperties(Mix, mixin); // 拷贝静态属性(静态方法。静态方法指的是通过类直接可以调用并且不被实例所继承的方法)
    copyProperties(Mix.prototype, mixin.prototype); // 拷贝原型属性
  }
  return Mix;
}

// 拷贝属性到target类中
export function copyProperties(target, source) {
  // Reflect.ownKeys 返回所有属性key
  // Object.keys 返回属性key，不包括不可枚举属性
  for (let key of Reflect.ownKeys(source)) {
    if (key !== 'constructor' && key !== 'prototype' && key !== 'name') {
      // Object.getOwnPropertyDescriptor 返回指定对象上一个自有属性对应的属性描述符。
      // 自有属性指的是直接赋予该对象的属性，不需要从原型链上进行查找的属性
      // 属性描述符指的是configurable、enumerable、writable、value这些
      const desc = Object.getOwnPropertyDescriptor(source, key);
      if (desc !== undefined) {
        Object.defineProperty(target, key, desc);
      }
    }
  }
};
