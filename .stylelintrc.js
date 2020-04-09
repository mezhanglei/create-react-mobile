module.exports = {
  "rules": {
    // 是否不允许出现无属性的布局
    "block-no-empty": true,
    // 十六进制颜色小写
    "color-hex-case": "lower",
    // 十六进制缩写 #ffffff to #fff    #ff8800 to #f80
    "color-hex-length": "short",
    // tab 为 2
    "indentation": 2,
    // 根目录最大的嵌套级别，也就是说一共有 .a .b .c .d { *** }
    "max-nesting-depth": 3,
    // 没有多余的换行
    "no-eol-whitespace": true,
    // 不允许出现多余的 ;
    "no-extra-semicolons": true,
    // 属性必须小写
    "property-case": "lower",
    // 文件必须结尾空行
    // "no-missing-end-of-source-newline": "always",
    // 最大的空行
    "max-empty-lines": 1,
    // 不明属性
    "property-no-unknown": true,
    // 块的 { 需要添加一个空格
    "block-opening-brace-space-before": "always",
    // 类名规则
    "selector-class-pattern": /^((^ant.*)|(^el.*)|([a-z0-9A-Z\-]+))$/,
    // 强制样式不换行
    "string-no-newline": true,
    // 冒号之后必须空格
    "declaration-colon-space-after": "always",
    // 冒号之前不能有空格
    "declaration-colon-space-before": "never",
  }
};