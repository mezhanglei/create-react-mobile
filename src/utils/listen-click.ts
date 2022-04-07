import { isEmpty } from './type';
/**
 * 点击事件拦截操作
 * 
 * 1. 先实例化一个实例 const event = new ClickListen(props);
 * 2. 调用方法生效： event.addEvent()
 * 3. 标签上自定义属性key=value的目标将会触发操作函数
 */

export interface EventConfigs {
  name: string; // 自定属性的名和值
  step?: number; // 递归查找目标标签所递归的层数，默认10
  callback: (e: EventType) => any; // 触发的操作函数
}

// 事件对象
export type EventType = MouseEvent | TouchEvent;

export default class ClickListen {
  name: string;
  step: number;
  callback: (e: EventType) => any; // 触发的操作函数
  constructor(configs: EventConfigs) {
    this.name = configs.name;
    // 触发的操作函数
    this.callback = configs?.callback;
    // 递归查询触发事件的的递归层数
    this.step = configs?.step || 10;
  }

  // 给body添加绑定事件，监听，如果触发了，则查询附近的父元素是否含有标记属性，如果含有，则执行发送代码
  addEvent(): void {
    if (isEmpty(this.name)) {
      return;
    }
    const body = document.getElementsByTagName('body')[0];
    if (body) {
      body.addEventListener('click', this.eventFunc, false);
    }
  }

  // 解绑对应事件
  removeEvent(): void {
    const body = document.getElementsByTagName('body')[0];
    if (body) {
      body.removeEventListener('click', this.eventFunc, false);
    }
  }

  // 触发事件
  eventFunc = (e: EventType): void => {
    e = e || window.event;
    const target = e.target || e.srcElement;
    const key = this.name?.split('=')?.[0];
    const value = this.name?.split('=')?.[1];
    const findName = this.findSource(target, key);
    // 执行拦截操作
    if (findName == value) {
      this.callback && this.callback(e);
    }
  };

  // 根据事件触发点，查询附近的有自定义属性的标签，如果有将其存储的数据返回
  findSource(dom: any, key: string) {
    let flag = false;
    // 标签名
    let tagName = dom.tagName.toLowerCase();
    // 触发事件的目标
    let target = dom;
    // 递归查询的层数
    let num = this.step;
    while (tagName !== 'body' && num > 0) {
      flag = target.getAttribute(key) != null;
      if (flag) {
        // 自定义属性只能是字符串
        return target.getAttribute(key);
      }
      target = target.parentNode;
      tagName = target.tagName.toLowerCase();
      num--;
    }
    return flag;
  }
}
