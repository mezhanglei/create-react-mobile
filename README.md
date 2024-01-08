# `create-react-mobile`

> mobile端开发脚手架: 基于webpack5.x + react18.x + zustand + ant-design5.x, 支持typescript.

## 本地运行环境

### 依赖
- [Node.js](https://nodejs.org/en/) Version >= 18.8.2
- [react](https://react.docschina.org/) Version >= 16.8.0

### 安装依赖
```
npm install
```
### 启动
```
npm run start
```
### 打包
```
npm run build:sit 测试打包
npm run build:prod 生产打包
```
### 规范
```
npm run lint 检查js规范
npm run lint:fix 修复js规范
```

### css样式(两种解析方式)
```
建议：1. css嵌套最好不要超过四层
      2. 尽量不要写行内样式
解析方式(自行选择)：
1： .less后缀的文件则是普通的样式文件，有变量污染的可能
2： .module.less后缀的样式文件会开启css module作用域, 可以避免变量污染
   注意:
   (1) 引入方式: import styles from "xxx.module.less"
   (2) 对于代码中的普通class类名, 可以通过:global {} 包裹,在里面书写类名来修改样式
   (3) 动画类名hash化，需要在样式文件中的类名后面加:local 例如 .animation :local {animation: 动画名 all 1s }
```
### image和background背景等静态资源引入规则
```
1. 在js文件中require('路径')或import * from('路径')形式
2. css文件中, 例如background: url('图片的相对路径');
3. 本地的图片资源必须要手动压缩，大图片在200kb以内，尽量不要超过200kb，可以使用tinypng在线压缩图片资源，可以重复压缩
```
### 本地mock数据模拟接口请求使用规则(非常简单)
```
1. 创建mock数据例如: 
  1. 如果接口是 '/list', 则在mock文件夹下创建list.json,里面写json数据即可
  2. 如果接口是 '/home/list', 则在mock文件夹下的home文件夹下创建list.json,里面写json数据即可
  以此类推
2. npm run start-mock启动mock数据环境
```