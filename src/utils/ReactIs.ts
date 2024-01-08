// 是否为类组件声明
export function isClassComponent(component: any) {
  return (
    typeof component === 'function' &&
    (component.prototype && component.prototype.isReactComponent)
  );
}

// 是否为函数组件
export function isFunctionComponent(component: any) {
  return (
    typeof component === 'function'
  );
}

// 是否为函数组件或类组件
export function isReactComponent(component: any) {
  return (
    isClassComponent(component) ||
    isFunctionComponent(component) ||
    isClassComponent(component?.render || component?.type) ||
    isFunctionComponent(component?.render || component?.type)
  );
}
