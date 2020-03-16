# react-mobile脚手架

## 项目安装和依赖说明
```
基于webpack4 + react + ant-design-mobile等的h5开发脚手架(目前正在往里面集成redux, react-router,布局等基础功能中)
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
根目录下文件:
dll文件夹: 只支持模块化js的预编译
static文件夹: 静态资源文件夹, 支持script直接引入静态资源
src文件夹: 业务功能所在文件夹
src/main: 入口文件及模板html.
后续功能集成中....
```
### css约定规则（若是没有使用CSS module）
```
命名规则：每个组件最外层类名以组件所在的文件夹来命名并且最外层类名包裹所有组件内样式，比如views/person/index.vue那么组件的最外面类名命名为v-person-index，来尽量避免变量名污染
书写规则：css嵌套最好不要超过四层
```
### 组件开发规则
```
1. 如果是组件之间的数据通讯尽量采用组件传值, 如果是页面组件之间使用则选择redux
2. 开发过程中封装的组件比如自定义弹窗，自定义toast等这种使用较为广泛的在main.js注册，普通的组件最好手动引入，利于代码阅读
```
