const prefixes = ['Moz', 'Webkit', 'O', 'ms'];

// style属性添加前缀转换为-分隔的形式
export function upperCamelToStyle(prop: string, prefix: string) {
    return prefix ? `-${prefix.toLowerCase()}-${prop}` : prop;
}

// 将style属性转换为驼峰
function upperCamelCase(prop: string, prefix: string) {
    let out = '';
    let shouldCapitalize = true;
    for (let i = 0; i < prop.length; i++) {
        if (shouldCapitalize) {
            out += prop[i].toUpperCase();
            shouldCapitalize = false;
        } else if (prop[i] === '-') {
            shouldCapitalize = true;
        } else {
            out += prop[i];
        }
    }
    return prefix ? `${prefix}${out}` : prop;
}

// 返回兼容样式（带兼容前缀的驼峰）
export function getPrefixStyle(prop: string = 'transform') {
    if (typeof window === 'undefined' || typeof window.document === 'undefined') return '';

    // 根元素的样式
    const style = window.document.documentElement.style;

    if (prop in style) return prop;

    for (let i = 0; i < prefixes.length; i++) {
        if (upperCamelCase(prop, prefixes[i]) in style) return upperCamelCase(prop, prefixes[i]);
    }

    return "";
};
