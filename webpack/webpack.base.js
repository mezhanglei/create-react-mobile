"use strict";

// 引入webpack
const webpack = require("webpack");
// 1. path.join('字段1','字段2'....) 使用平台特定的分隔符把所有的片段链接生成相对路径,遇到..和../时会进行相对路径计算
// 2. path.resolve('字段1','字段2'....) 从右到左拼接路径片段,返回一个相对于当前工作目录的绝对路径,当遇到/时表示根路径,遇到../表示上一个目录, 如果还不是完整路径则自动添加当前绝对路径
const path = require("path");
// css文件指纹插件提取css，作用是缓存css并解决样式闪动问题 因为只在编译阶段作用 所以不适用于热更新 但在生产环境无需配置热更新也没多大问题
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 1.为html文件中引入的外部资源如script、link动态添加每次compile后的hash，防止引用缓存的外部文件问题
// 2.打包时创建html入口文件，比如单页面可以生成一个html文件入口，配置N个html-webpack-plugin可以生成N个页面入口
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 对webpack打包的信息进行警告,错误的明显标识提示 可以选择使用或不使用
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
// 通过CopyWebpackPlugin将目标文件夹里的静态资源拷贝到目标文件夹
const CopyWebpackPlugin = require("copy-webpack-plugin");
// (构建过程优化)webpack体积分析插件(会单独打开一个端口8888的页面显示体积构造图)
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
// stylelint的样式检查
const StyleLintPlugin = require("stylelint-webpack-plugin");
// eslint格式检查
const ESLintPlugin = require('eslint-webpack-plugin');
// 引入配置
const configs = require('./configs.js');
// 引入路径
const paths = require('./paths.js');
// const versionShell = require('./version.js');
const isDev = configs.isDev;
// less/less module 正则表达式
const lessRegex = /\.less$/;
const lessModuleRegex = /\.module\.less$/;
// css/css module 正则表达式
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
// node_modules正则表达式
const nodeModulesRegex = /node_modules/;

// webpack从manifest文件中读取到已预编译的文件, 然后忽略对其的编辑打包,多个dll文件则循环
const dllList = paths.manifestPathArr.map((path) => {
  return new webpack.DllReferencePlugin({
    // 上下文环境路径(与dllplugin在同一目录)
    context: paths.appRoot,
    manifest: require(path),
  });
});

const cssLoader = isDev ? 'style-loader' : {
  loader: MiniCssExtractPlugin.loader,
  options: {
    // 修改打包后目录中css文件中静态资源的引用的基础路径
    publicPath: paths.assetsPath,
  },
};

//  === webpack配置内容 === //
module.exports = {
  entry: {
    index: `${paths.srcPath}/pages/index`
  },
  // 解析的起点, 默认为项目的根目录
  context: paths.appRoot,
  // 告知 webpack 为目标(target)指定一个环境。默认值为 "browserslist"，如果没有找到 browserslist 的配置，则默认为 "web"
  target: ["web", "es5"],
  // 输出(默认只能打包js文件,如果需要打包其他文件,需要借助相对应的loader)
  output: {
    clean: !isDev ? true : false, // 在生成文件之前清空 output 目录
    path: paths.outputPath,
    // chunkhash 基于entery生成hash值 一个文件改动不会影响另一个
    // contenthash 通过MiniCssExtractPlugin提供 基于css文件内容生成 css内容不会影响js文件的hash值生成
    // hash是基于项目 只要项目内容改变就会影响hash值,一般用于开发环境
    // hash值的用处是当改变时浏览器则不会再使用该缓存
    filename: !isDev ? "js/[name]_[chunkhash:8].js" : "[name].js",
    // chunkFilename用来打包require.ensure方法中引入的模块,如果该方法中没有引入任何模块则不会生成任何chunk块文件
    // chunkFilename: 'js/[name]_[chunkhash:8].js'
    // 所有静态资源引用的公共绝对路径
    publicPath: paths.publicPath,
  },
  // 让项目中通过es6等模块规范引入的文件不打包到最终的包里, 而是通过script标签引入(与这个有相同功能的就是dll)
  // 其中键为在使用时引入的变量名, 值为npm包名或者绝对路径
  // externals: {
  //   jquery: 'jQuery'
  // },
  // require 引用入口配置
  resolve: {
    // 后缀，引入时可以默认不写
    extensions: [".ts", ".tsx", ".js", "jsx", ".json", ".less"],
    alias: {
      "@": `${paths.srcPath}`,
      "src": `${paths.srcPath}`,
      "static": `${paths.staticPath}`,
      "less": `${paths.lessPath}`
    }
  },
  // 用来指定loaders的匹配规则和指定使用的loaders名称
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        // 忽略第三方
        // 忽略第三方(看第三方包是否需要转译,不需要的话去掉)
        // exclude: nodeModulesRegex,
        include: [
          paths.srcPath,
          paths.staticPath,
          path.join(paths.nodeModulesPath, 'nanoid'),
          path.join(paths.nodeModulesPath, 'jian-pinyin'),
          path.join(paths.nodeModulesPath, 'crypto-js')
        ],
        use: [
          {
            // 多进程打包,必须放在处理js的loader之前
            loader: "thread-loader",
            options: {
              workers: 3,
            },
          },
          {
            loader: "babel-loader",
            options: {
              // 不使用默认的配置路径
              babelrc: false,
              // 配置新的babelrc路径
              extends: paths.babelrcPath,
              // 开启缓存
              cacheDirectory: true
            }
          },
        ],
      },
      {
        test: cssRegex,
        exclude: cssModuleRegex,
        // 这里需要遵循一定的顺序 因为是compose函数方式先解析数组后面的css-loader然后插入到style-loader
        use: [
          // 不能和style-loader一起使用,会互斥
          // 把 js 中 import 导入的样式文件代码，打包成一个实际的 css 文件，结合 html-webpack-plugin，在 dist/index.html 中以 link 插入 css 文件；默认将 js 中 import 的多个 css 文件，打包时合成一个
          cssLoader,
          // style-loader 把 js 中 import 导入的样式文件代码，打包到 js 文件中，运行 js 文件时，将样式自动插入到<style>标签中
          // 'style-loader',
          // css-loader解析几个css之间的关系 最终把几个css文件打包成一个css文件
          "css-loader"
        ],
      },
      {
        test: lessRegex,
        exclude: lessModuleRegex,
        use: [
          cssLoader,
          "css-loader",
          "postcss-loader",
          {
            loader: "less-loader",
            options: {
              lessOptions: { // 如果使用less-loader@5，请移除 lessOptions 这一级直接配置选项。
                modifyVars: {
                  // 引入antd 主题颜色覆盖文件
                  hack: `true; @import "${path.join(
                    paths.appRoot,
                    "less/constants/theme.less"
                  )}";`,
                },
                javascriptEnabled: true
              }
            },
          },
        ]
      },
      // 解析css module
      {
        test: lessModuleRegex,
        exclude: nodeModulesRegex,
        use: [
          cssLoader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'local',
                localIdentName: '[path][name]__[local]--[hash:base64:5]',
                localIdentContext: paths.srcPath
              },
              importLoaders: 3,
            } //css modules
          },
          // 提供一种用js来处理css方法,抽象成语法树结构,一般不单独使用
          // 1. 在postcss.config.js导出autoprefixer用来自动添加前缀,在cssloader之后执行
          // 2. 然后在package.json里设置borowserslist选项来设置浏览器兼容版本
          "postcss-loader",
          "less-loader"
        ],
      },
      {
        test: /\.(png|svg|jpg|gif|jpeg|ico)$/i,
        exclude: nodeModulesRegex,
        type: "asset",
        parser: {
          dataUrlCondition: {
            // 小于20kb后导出内联类型资源, 超出后输出到指定目录
            maxSize: 20 * 1024
          }
        },
        generator: {
          filename: "img/[name]_[hash:8].[ext]"
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        exclude: nodeModulesRegex,
        type: 'asset',
        generator: {
          filename: "font/[name]_[hash:8].[ext]"
        }
      },
    ],
  },
  // 插件
  plugins: [
    // 全局变量暴露
    new webpack.ProvidePlugin({
      React: "react",
      ReactDOM: "react-dom",
      ReactRouterDOM: "react-router-dom",
    }),
    // 设置项目的全局变量,String类型, 如果值是个字符串会被当成一个代码片段来使用, 如果不是,它会被转化为字符串(包括函数)
    new webpack.DefinePlugin({
      'process.env.MOCK': process.env.MOCK,
      'process.env.PUBLIC_PATH': JSON.stringify(paths.publicPath || '/')
    }),
    // 统计信息提示插件(比如错误或者警告会用带颜色的字体来显示,更加友好)
    new FriendlyErrorsWebpackPlugin(),
    // 将目标目录里的文件直接拷贝到输出dist目录
    new CopyWebpackPlugin({
      patterns: [{
        from: paths.staticPath,
        to: path.join(paths.outputPath, 'static')
        // 忽略文件名
        // ignore: ['.*']
      }]
    }),
    // htmlplugin
    new HtmlWebpackPlugin({
      // title: '生成的html文档的标题',
      // 指定输出的html文档
      filename: `index.html`,
      // html模板所在的位置，默认支持html和ejs模板语法，处理文件后缀为html的模板会与html-loader冲突
      template: paths.appHtml,
      // 不能与template共存，也可以指定html字符串
      // templateContent: string|function,
      // 默认script一次性引用所有的chunk(chunk的name)
      // chunks: [],
      // 跳过一个块
      // excludeChunks: [],
      // 注入静态资源的位置:
      //    1. true或者body：所有JavaScript资源插入到body元素的底部
      //    2. head： 所有JavaScript资源插入到head元素中
      //    3. false：所有静态资源css和JavaScript都不会注入到模板文件中
      inject: true,
      // 图标的所在路径，最终会被打包到到输出目录
      favicon: paths.favicon,
      // 注入meta标签，例如{viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'}
      // meta: {},
      // 注入base标签。例如base: "https://example.com/path/page.html
      // base: false,
      minify: {
        // 根据html5规范输入 默认true
        html5: true,
        // 是否对大小写敏感 默认false
        caseSensitive: false,
        // 去除属性引用
        removeAttributeQuotes: !isDev ? true : false,
        // 删除空格换行 默认false
        collapseWhitespace: !isDev ? true : false,
        // 当标记之间的空格包含换行符时，始终折叠为1换行符（从不完全删除它）。collapseWhitespace=true, 默认false
        preserveLineBreaks: false,
        // 压缩link进来的本地css文件 默认false,需要和clean-css一起使用
        minifyCSS: false,
        // 压缩script内联的本地js文件 默认false,为true需要和teserwebpackplugin一起使用
        minifyJS: true,
        // 移除html中的注释 默认false
        removeComments: true
      },
      // 如果为true则为所有的script引入和css引入添加唯一的hash值
      // hash: false,
      // 错误详细信息将写入html
      // showErrors: true,
      // script引入的公共js文件
      commonJs: [
        // 'static/dll/base_dll.js'
        // '//'
      ],
      // link引入的公共css文件
      commonCSS: [
        // `static/fonts/iconfont.css?time=${new Date().getTime()}`
      ]
    }),
    // 热更新
    ...(isDev ? [
      ...(configs.useEslint ? [new ESLintPlugin({ eslintPath: paths.eslintrcPath })] : []),
      // 样式检查
      ...(configs.useStylelint ? [new StyleLintPlugin({
        // 要检查scss的根目录
        context: paths.appRoot,
        // 1.扫描要检查的文件, 字符串或者数组, 将被glob接收所以支持style/**/*.scss这类语法
        // 2.我们也可以通过在package.json中配置命令的方式(--ext表示扩展名)
        files: paths.checkStylePath,
        // 配置文件的路径
        configFile: paths.stylelintrcPath,
        // 如果为true，则在全局构建过程中发生任何stylelint错误时结束构建过程 所以一般为false
        failOnError: false,
      })] : [])
    ] : [
      // css文件指纹 使用contenthash 只要css文件不变则contenthash不变
      new MiniCssExtractPlugin({
        filename: "css/[name]_[contenthash:8].css",
      }),
      ...(configs.isAnalyz ? [new BundleAnalyzerPlugin()] : [])
    ]),
    ...dllList
  ]
};
