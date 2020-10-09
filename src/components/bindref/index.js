
/**
 * ref转发，在父组件中将ref转发给子组件
 * @param {*} WrappedComponent 目标组件
 * 使用：1. const WrapComponent = bindRef(目标组件);
 *      2. <WrapComponent ref={} />，ref传递给子组件
 *      3. 子组件通过forwardedRef接收父组件传过来的ref
 */
export function bindRef(WrappedComponent) {
    return React.forwardRef((props, ref) => {
        return <WrappedComponent forwardedRef={ref} {...props} />;
    });
}
