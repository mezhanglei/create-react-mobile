
// 页面切换埋点

// 监听location.href变化
window.onload = function () {
    // 上报事件
};

// 监听hashChange事件
window.addEventListener('hashchange', function () {
    // 上报事件
}, true);

// 重写路由事件
function aop(type: string) {
    const source = window.history[type];
    return function () {
        // 创建自定义事件，以便window可以监听到该事件名
        const event = new Event(type);
        event.arguments = arguments;
        window.dispatchEvent(event);
        // 正常执行原事件
        const rewrite = source.apply(this, arguments);
        return rewrite;
    };
}

// 第二阶段：将 pushState 和 replaceState 进行基于 AOP 思想的代码注入
window.history.pushState = aop('pushState');
window.history.replaceState = aop('replaceState');

// 第三阶段：捕获pushState 和 replaceState
window.addEventListener('pushState', function () {
    // 上报【进入页面】事件
}, true);
window.addEventListener('replaceState', function () {
    // 上报【进入页面】事件
}, true);

// js错误
window.onerror = function (msg, url, lineno, colno, stack) {
    // 上报 【js错误】事件
};

// 资源错误
window.addEventListener('error', function (e) {
    var target = e.target || e.srcElement;
    if (target instanceof HTMLScriptElement) {
        // 上报 【资源错误】事件
    }
}, true);

window.addEventListener('beforeunload', function () {
    // 上报【离开页面】事件
}, true);
