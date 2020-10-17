
/**
 * 监听html元素
 * @param {*} props
 * targetNode: 监听的目标节点
 * options参数：
 *    attributeFilter： Array 监听的特定属性数组，默认监听所有属性
 *    attributeOldValue： Boolean true时将记录任何有改动的属性的上一个值
 *    attributes：Boolean true时表示监听元素的属性变化
 *    characterData：Boolean true以监视指定目标节点或子节点树中节点所包含的字符数据的变化
 *    characterDataOldValue: Boolean true则文本在受监视节点上发生更改时记录节点文本的先前值
 *    childList：Boolean true则监视目标节点（如果 subtree 为 true，则包含子孙节点）添加或删除新的子节点。默认值为false。
 *    subtree：Boolean true则将监视范围扩展至目标节点整个节点树中的所有节点。
 * callback回调的参数(mutation)： 
 *     type：观察的变动类型(即上面的options)
 *     target：发生变动的 DOM 节点
 *     addedNodes：新增的 DOM 节点
 *     removedNodes：删除的 DOM 节点
 *     previousSibling：前一个同级节点，如果没有则返回 null
 *     nextSibling：下一个同级节点，如果没有则返回 null
 *     attributeName：发生变动的属性。如果设置了attributeFilter，则只返回预先指定的属性。
 *     oldValue：变动前的值。这个属性只对 attribute 和 characterData 变动有效，如果发生 childList 变动，则返回 null
 */
export function useMutationObserver(props) {
    const { callBack, options, targetNode } = props;
    // 实例化一个观察类
    const Observer = new MutationObserver(function (mutations) {
        for (const i = 0; i < mutations.length; i++) {
            callBack(mutations[i]);
        }
    });

    // 观察
    const observe = () => {
        Observer.observe(targetNode, options);
    };

    // 断开观察
    const disconnect = () => {
        Observer.disconnect();
    };

    // 返回已检测到但尚未由观察者的回调函数处理的所有匹配DOM更改的列表，已发生但未传递给回调的变更队列将保留为空。
    const takeRecords = () => {
        Observer.takeRecords();
    };
    return { observe, disconnect, takeRecords };
}
