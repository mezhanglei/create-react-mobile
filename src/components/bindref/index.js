
/**
 * ref转发，在父组件中将ref转发给子组件
 * @param {*} WrappedComponent 目标组件
 * 使用：1. const WrapComponent = bindRef(目标组件);
 *      2. 子组件中： forwardedRef通过props已经传过去作为目标的ref
 */
export function bindRef(WrappedComponent) {
    return React.forwardRef((props, ref) => {
        return <WrappedComponent forwardedRef={ref} {...props} />;
    });
}
