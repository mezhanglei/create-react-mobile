module.exports = {
  // 指定eslint的babel解析器(解析jsx语法)
  "parser": "babel-eslint",
  // typescripth环境下(解析tsx语法)
  // "parser": "@typescript-eslint/parser",
  // 使用eslint-lugin-xxxx插件，如果想使用react的一些推荐可以使用eslint-plugin-react
  "plugins": ["@typescript-eslint", "react-hooks"],
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
    "node": true,
    "es6": true
  },
  // 允许使用的全局变量 不让eslint报错 true表示允许修改 readonly表示只允许读 不允许写 false是不允许读写
  "globals": {
    "window": true,
    "document": true,
    "$": true,
    "process": true,
  },
  // 0 - 关闭规则 1 - 开启规则，触发则警告  2 - 开启规则，触发则报错
  "rules": {
    // 强制使用一样的缩进, 还有强制switch 语句中的 case 子句的缩进级别
    "indent": ["error", 4, {
      "SwitchCase": 1
    }],
    "typescript/member-ordering": 'off',
    "typescript/member-delimiter-style": 'off',
    // 检查 Hook 的规则
    "react-hooks/rules-of-hooks": "error",
    // 检查 effect 的依赖
    "react-hooks/exhaustive-deps": "warn",
    // 禁止有声明但是没有使用的变量存在规则
    "no-unused-vars": 0,
    // 除了null其余比较必须为===或！==而不是==的规则
    "eqeqeq": [0, "allow-null"],
    // 强制对jsx属性值使用双引号或单引号规则
    "jsx-quotes": 0,
    // 禁止使用多个空格规则
    "no-multi-spaces": 2,
    // 禁止在代码行后使用内联注释规则
    "no-inline-comments": 0,
    // 强制分号结尾的规则
    "semi": [2, "always"],
    // 要求操作符周围有空格的规则
    "space-infix-ops": 2,
    // 禁止花括号内空格的规则
    "template-curly-spacing": 0,
    // 禁止或强制在代码块{}中开括号前和闭括号后有空格规则
    "block-spacing": [0, "always"],
    // if while function 后面的{必须与if在同一行，java风格。
    "brace-style": [2, "1tbs", { "allowSingleLine": true }],
    // 文件末尾强制换行的规则
    "eol-last": 2,
    // 在对象字面量中键和冒号之间不允许存在空格, 在冒号和值之间需要空格的规则
    "key-spacing": [2, { "beforeColon": false, "afterColon": true }],
    // 默认使用unix的换行结尾\n,否则警告 vscode编辑器会使用\r\n换行所以要么不使用vscode要么关闭这条规则
    "linebreak-style": [0, "unix"],
    // 禁止使用console规则
    "no-console": 1,
    // 禁止使用debugger规则
    "no-debugger": 1
  }
}
