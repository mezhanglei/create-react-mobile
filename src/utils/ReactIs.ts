import React from "react";

// 是否为类组件声明
export function isClassComponent(component: any) {
  return (
    typeof component === 'function' &&
    (component.prototype && component.prototype.isReactComponent)
  )
}

// 是否为函数组件
export function isFunctionComponent(component: any) {
  return (
    typeof component === 'function'
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
export function isValidChildren(element: any) {
  return React.isValidElement(element) || typeof element === 'number' || typeof element === 'string';
}

// 是否为dom元素渲染结果
export function isDOMTypeElement(element: any) {
  return isValidChildren(element) && typeof element?.type === 'string';
}

// 是否为函数或类的渲染结果
export function isCompositeTypeElement(element: any) {
  return isValidChildren(element) && typeof element?.type === 'function';
}