import React from "react";

// 是否为函数类组件声明
export function isClassComponent(component: any) {
  return (
    typeof component === 'function' &&
    !!component.prototype.isReactComponent
  )
}

// 是否为函数组件(函数都可以渲染为组件)
export function isFunctionComponent(component: any) {
  return (
    typeof component === 'function'
    // String(component).includes('return React.createElement')
  )
}

// 是否为函数组件或类组件
export function isReactComponent(component: any) {
  return (
    isClassComponent(component) ||
    isFunctionComponent(component) ||
    isClassComponent(component?.render || component?.type) ||
    isFunctionComponent(component?.render || component?.type)
  )
}

// 是否为字符串/数字，组件，组件实例, dom元素
export function isValidElement(element: any) {
  return React.isValidElement(element) || typeof element === 'number' || typeof element === 'string';
}

// 是否为dom元素渲染结果
export function isDOMTypeElement(element: any) {
  return isValidElement(element) && typeof element.type === 'string';
}

// 是否为函数或类的渲染结果
export function isCompositeTypeElement(element: any) {
  return isValidElement(element) && typeof element.type === 'function';
}