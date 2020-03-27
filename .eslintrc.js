module.exports = {
  // 指定eslint的babel解析器(解析jsx语法)
  "parser": "babel-eslint",
  // 挂载hooks插件用来校验hooks
  "plugins": ["react-hooks"],
  // javascript语言类型和风格
  "parserOptions": {
    // 模块导入方式
    "sourceType": "module",
    // 语法版本6
    "ecmaVersion": 6,
    "ecmaFeatures": {
      // 启动jsx检查
      "jsx": true
    }
  },
  // 运行eslint的环境
  "env": {
    "browser": true,
    "es6": true
  },
  // 允许使用的全局变量 不让eslint报错 true表示允许修改 readonly表示只允许读 不允许写 false是不允许读写
  "globals": {
    "window": true,
    "document": true,
    "$": true,
    "process": true
  },
  // "plugins": [
  //   "react"
  // ],
  "rules": {
    "eqeqeq": "error",
    "indent": ["error", 2, {
      "SwitchCase": 1
    }],
    "react-hooks/rules-of-hooks": "error", // 检查 Hook 的规则
    "react-hooks/exhaustive-deps": "warn", // 检查 effect 的依赖
    // 0表示允许有声明但未被使用的变量存在
    "no-unused-vars": 0,
    // 0表示可以使用 ==
    "eqeqeq": [0, "allow-null"],
    // 0表示关闭强制对jsx属性值使用双引号或单引号
    "jsx-quotes": 0,
    // 禁止使用多个空格, 否则报错
    "no-multi-spaces": 2,
    // 禁止在代码行后使用内联注释, 否则报错
    // "no-inline-comments": 2,
    // 强制分号结尾,否则报错
    "semi": [2, "always"],
    // 要求操作符周围有空格, 否则报错
    "space-infix-ops": 2,
    // 禁止模板字符串中的嵌入表达式周围空格的使用, 否则报错
    "template-curly-spacing": 2,
    // 在单行代码块中需要使用空格,否则警告
    "block-spacing": [1, "always"],
    // if while function 后面的{必须与if在同一行，java风格。
    "brace-style": [2, "1tbs", { "allowSingleLine": true }],
    // 文件末尾强制换行,否则报错
    "eol-last": 2,
    // 在对象字面量中键和冒号之间不允许存在空格, 在冒号和值之间需要空格,否则报错
    "key-spacing": [2, { "beforeColon": false, "afterColon": true }],
    // 默认使用unix的换行结尾\n,否则警告 vscode编辑器会使用\r\n换行所以要么不使用vscode要么关闭这条规则
    "linebreak-style": [1, "unix"],
    // 行前/行后备注
    "lines-around-comment": 0
  }
}
