# react-mobile脚手架(适合做h5端)

## 项目安装和依赖说明
```
说明：基于webpack4.x + react16.12 + redux + react-redux + redux-thunk + ant-design-mobile等的h5开发脚手架(目前正在往里面集成基础功能中)
依赖：下载项目后在项目根目录运行命令：
      1. 设置依赖镜像源：
         如果镜像源为国内淘宝镜像https://registry.npm.taobao.org,则:
           npm config set registry https://registry.npm.taobao.org
           或cnpm config set registry https://registry.npm.taobao.org
           或yarn config set registry https://registry.npm.taobao.org
         如果镜像源为yarn官方镜像https://registry.yarnpkg.com,则:
           yarn config set registry https://registry.yarnpkg.com
      2. 下载所有的依赖： npm install 或 cnpm install 或yarn install
```
### 项目运行说明
```
npm run dev 运行项目
npm run dll 如果想对某些基础包进行预编译,在webpack.dll.js中配置相关基础包,然后启动,最后在html中script引进
npm run build 生产打包
npm run eslint 检查js规范
npm run csslint 检查css规范
```

### 脚手架功能说明(通过mddir插件获取树)
```
现在已支持单/多页面,具体使用说明下次更新
```
### css约定规则（若是没有使用CSS module）
```
命名规则：每个组件最外层类名以组件所在的文件夹来命名并且最外层类名包裹所有组件内样式，比如views/person/index.js那么组件的最外面类名命名为v-person-index，来尽量避免变量名污染
书写规则：1. css嵌套最好不要超过四层
         2. 尽量不要写行内样式
```
### 组件开发规则
```
1. 如果是功能组件之间的数据通讯尽量采用组件传值, 如果是多个页面组件之间建议选择redux
2. 通用功能模块尽量解耦封装成组件（高阶组件，自定义组件，hook组件）使用。
```
### image和background背景等静态资源在vue中引入规则(配置src文件夹的别名为@)
```
1. 在js文件中require('@/文件相对于src的路径')或import * from('@/文件相对于src的路径')形式
2. css文件中, 例如background: url('图片的相对路径');
3. 本地的图片资源必须要手动压缩，大图片在200kb以内，尽量不要超过200kb，可以使用tinypng在线压缩图片资源，可以重复压缩
```
