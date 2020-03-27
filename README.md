# react-mobile脚手架(适合做h5端)

## 项目安装和依赖说明
```
基于webpack4.x + react16.12 + redux + react-redux + redux-thunk + ant-design-mobile等的h5开发脚手架(目前正在往里面集成基础功能中)
```
### 项目运行说明
```
npm run dev 运行项目
npm run dll 如果想对某些基础包进行预编译,在webpack.dll.js中配置相关基础包,然后启动,最后在html中script引进
npm run build 生产打包
npm run eslint 检查js规范
npm run csslint 检查css规范
```

### 脚手架功能说明
```
等待脚手架目录功能说明
```
### css约定规则（若是没有使用CSS module）
```
命名规则：每个组件最外层类名以组件所在的文件夹来命名并且最外层类名包裹所有组件内样式，比如views/person/index.js那么组件的最外面类名命名为v-person-index，来尽量避免变量名污染
书写规则：css嵌套最好不要超过四层
```
### 组件开发规则
```
1. 如果是组件之间的数据通讯尽量采用组件传值, 如果是页面组件之间使用则选择redux
2. 高阶组件处理公共逻辑,自定义组件处理公共模块功能;
```
### 文件夹命名规范
```
建议文件夹命名全部小写,遵循规范!
```
### image和background背景等静态资源在vue中引入规则(配置src文件夹的别名为@)
```
1. 在js文件中require('@/文件相对于src的路径')或import * from('@/文件相对于src的路径')形式
2. css文件中,例如background: url('@/文件相对于src的路径');
```
