// == 兼容性处理 ==

// 调用此函数，关掉键盘，并回到页面顶部，以解决iOS 12中键盘收起后页面底部会有一部分空白的问题
export function resetPageInIOS() {
    if ("scrollIntoView" in document.activeElement) {
        document.activeElement.blur();
    }
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

// 禁止页面滚动默认行为（移动端）
export function bodyScroll(event: Event | MouseEvent) {
    event.preventDefault();
}

// 禁止页面滚动，解决弹框出现时 IOS 上滚动穿透的问题, passive：false用来提升移动端性能优化，作用不调用preventDefault()，从而避免延迟
export function forbidBodyScroll() {
    document
        .getElementsByTagName("body")[0]
        .addEventListener("touchmove", bodyScroll, { passive: false });
}

// 解除禁止滚动，解决弹框出现时 IOS 上滚动穿透的问题
export function allowBodyScroll() {
    document
        .getElementsByTagName("body")[0]
        .removeEventListener("touchmove", bodyScroll);
}
