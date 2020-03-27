'use strict';

// glob用来动态扫描目标文件 但只能扫描一个路径,如果要同时扫描多个路径请使用glob-all
// const glob = require('glob');
// 1. path.join('字段1','字段2'....) 使用平台特定的分隔符把所有的片段链接生成相对路径,遇到..和../时会进行相对路径计算
// 2. path.resolve('字段1','字段2'....) 从右到左拼接路径片段,返回一个相对于当前工作目录的绝对路径,当遇到/时表示根路径,遇到../表示上一个目录, 如果还不是完整路径则自动添加当前绝对路径
const path = require('path');
// 引入webpack
const webpack = require('webpack');
// 1.为html文件中引入的外部资源如script、link动态添加每次compile后的hash，防止引用缓存的外部文件问题
// 2.打包时创建html入口文件，比如单页面可以生成一个html文件入口，配置N个html-webpack-plugin可以生成N个页面入口
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 对webpack打包构建的信息进行处理 可以选择使用或不使用
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
// stylelint的样式检查
const StyleLintPlugin = require('stylelint-webpack-plugin');
// 整个项目的根目录
const root = path.join(__dirname);
// webpack的配置开关
const configs = {
  // 是否使用eslint true表示使用
  useEslint: false,
  // 是否使用stylelint true表示使用
  useStylelint: false,
  // 入口文件路径
  entryPath: path.join(root, 'src/main/index.js'),
  // 引入资源路径的公共部分, 这里将所有打包后的相对路径都替换为绝对路径/, 这样无论之后发布的ip和端口怎么变, 只要根目录不变则引入静态资源(img等)都不会出错
  publicPath: '/',
  // 输出目录
  outputPath: path.join(root, 'dist')
};

// eslint的loader配置, 默认配置文件为项目根目录下的.eslintrc.js
const useEslintLoader = {
  test: /\.(js|jsx)$/,
  use: ["babel-loader", "eslint-loader"],
  // 不会检查node_modules里面的包
  exclude: /node_modules/
};

// stylelint的plugin配置
const useStylelintPlugin = new StyleLintPlugin({
  // 要检查scss的根目录
  context: path.join(root, 'src'),
  // 1.扫描要检查的文件, 字符串或者数组, 将被glob接收所以支持style/**/*.scss这类语法
  // 2.我们也可以通过在package.json中配置命令的方式(--ext表示扩展名)
  // files: path.join(root, 'style/**/*.scss'),
  // 配置文件的路径
  configFile: path.join(root, './.stylelintrc.js'),
  // 如果为true，则在全局构建过程中发生任何stylelint错误时结束构建过程 所以一般为false
  failOnError: false
});

module.exports = {
  // 入口
  entry: {
    // 1. 如果入口文件为一个对象且有多条数据,则会打包进入多个html文件
    // 2. 如果入口文件为一个对象且只有一条数据(数组或字符串), 则打包后插入一个html
    // 入口文件路径
    index: configs.entryPath
  },
  // 查找解析入口文件entry所在的根目录文件夹, 默认为项目的根目录
  context: root,
  // 输出
  output: {
    path: configs.outputPath,
    // 用[name]动态表示打包的名称 名称默认为入口文件指定的键
    filename: '[name].js',
    // 1. 引入资源路径的公共部分, 这里将所有打包后的相对路径都替换为绝对路径/.
    // 2. 这里设置了publicPath则devServer里也需要设置publicPath
    publicPath: configs.publicPath
  },
  // process.env会返回用户的环境变量 process.env.NODE_ENV用来设置当前构建脚本是开发阶段还是生产阶段
  // mode一共可设置三种环境production development none 分别表示生产环境还是开发环境还是什么都不做
  // mode设置的作用主要是根据当前环境进行一些优化工作
  // development 开启NamedChunksPlugin 和 NameModulesPlugin
  // production开启FlagDependencyUsagePlugin, FlagIncludedChunksPlugin, ModuleConcatenationPlugin(减少声明和闭包引起的内存开销), NoEmitOnErrorsPlugin, occurrenceOrderPlugin, SideEffectsFlagPlugin, TerserWebpackPlugin(统一提取js和css)
  mode: 'development',
  // 用来指定loaders的匹配规则和指定使用的loaders名称
  module: {
    rules: [
      {
        test: /\.js$/,
        // babel-loader的核心依赖为@babel/core
        use: 'babel-loader',
        // include: path.resolve("src"),
        // 忽略第三方(看第三方包是否需要转译,不需要的话去掉)
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        // 这里需要遵循一定的顺序 因为是compose函数方式先解析css-loader然后插入到style-loader
        use: [
          // style-loader 把 js 中 import 导入的样式文件代码，打包到 js 文件中，运行 js 文件时，将样式自动插入到<style>标签中
          'style-loader',
          // css-loader解析几个css之间的关系 最终把几个css文件打包成一个css文件
          'css-loader',
          {
            // 需放到less-loader前面
            loader: 'px2rem-loader',
            options: {
              // 1rem等于多少px
              remUnit: 37.5,
              // 小数点位数
              remPrecision: 8
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          {
            // 需放到less-loader前面
            loader: 'px2rem-loader',
            options: {
              // 1rem等于多少px
              remUnit: 37.5,
              // 小数点位数
              remPrecision: 8
            }
          },
          'less-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          "css-loader",
          {
            // 需放到sass-loader前面
            loader: 'px2rem-loader',
            options: {
              // 1rem等于多少px
              remUnit: 37.5,
              // 小数点位数
              remPrecision: 8
            }
          },
          "sass-loader"
        ],
      },
      // 使用url-loader也可以进行图片和字体的解析和打包 并且可以设置一定大小以下的图片转换成base64编码
      {
        test: /\.(png|svg|jpg|gif|jpeg|ico)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 50240
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: 'url-loader'
      },
      // eslint
      ...(configs.useEslint ? [useEslintLoader] : [])
    ]
  },
  plugins: [
    // 加载webpack内置的热更新插件
    new webpack.HotModuleReplacementPlugin(),
    // 清理dist目录
    // new CleanWebpackPlugin(),
    // 统计信息提示插件(比如错误或者警告会用带颜色的字体来显示,更加友好)
    new FriendlyErrorsWebpackPlugin(),
    // 编译后生成html入口
    new HtmlWebpackPlugin({
      // html模板所在的位置(一般需要设置个指定文件夹,这里设置为任意一个文件夹)
      template: path.join(__dirname, 'src/main/index.html'),
      // 指定输出的模板html名称(一般为index.html,这里是用html模板所在的文件夹名)
      filename: 'index.html',
      // 解决多入口文件时打包后输出的html指定要引用哪些js文件的名字
      chunks: ['index'],
      // body：script标签位于html文件的 body 底部（同 true）
      inject: true,
      minify: {
        // 根据html5规范输入 默认true
        html5: true,
        // 是否对大小写敏感 默认false
        caseSensitive: false,
        // 删除空格换行 默认false
        collapseWhitespace: true,
        // 当标记之间的空格包含换行符时，始终折叠为1换行符（从不完全删除它）。必须与collapseWhitespace一起使用 默认false
        preserveLineBreaks: false,
        // 压缩一开始就内联的css文件 默认false
        minifyCSS: true,
        // 压缩一开始就内联的js文件 默认false
        minifyJS: true,
        // 移除html中的注释 默认false
        removeComments: false
      }
    }),
    // 设置项目的全局变量, 如果值是个字符串会被当成一个代码片段来使用, 如果不是,它会被转化为字符串(包括函数)
    new webpack.DefinePlugin({
      "process.env.PUBLIC_PATH": JSON.stringify(configs.publicPath)
    }),
    // stylelint
    ...(configs.useStylelint ? [useStylelintPlugin] : [])
  ],
  // require 引用入口配置
  resolve: {
    extensions: ['.vue', '.js', '.json'],
    alias: {
      "@": `${root}/src/`,
      "src": `${root}/src/`
    }
  },
  // 配置webpack的开发服务器
  devServer: {
    // output中设置了publicPath则devServer里也需要设置publicPath
    publicPath: configs.publicPath,
    // 字符串或数组,表示你提供静态资源的根目录.当你从html通过script引入静态资源时的根目录就是这个
    contentBase: root,
    // 有时无法访问可能是端口被占用
    port: 8082,
    // 设置自定义的host(但当设置useLocalIp打开时必须设置为0.0.0.0或本机ip,否则无法打开)
    host: '0.0.0.0',
    // 使用本机ip打开,必须设置host为0.0.0.0或本机ip, 否则无法打开
    useLocalIp: true,
    // 开启热更新
    hot: true,
    // true启动时和每次保存之后，那些显示的 webpack 包(bundle)信息将被隐藏。错误和警告仍然会显示, 和stats不能一起使用。
    // noInfo: true,
    // inline模式,完成自动编译打包、页面自动刷新的功能，在控制台中会显示reload的状态。默认true
    // 也可以通过webpack-dev-server --inline=true使用
    inline: true,
    // 一切服务都启用gzip 压缩(也可以通过webpack-dev-server --compress启动)
    compress: true,
    // 当使用 HTML5 History API 时，任意的 404 响应都需要替代为该单页面的index.html,如果为多入口文件则需要设置指定的html文件
    historyApiFallback: true,
    // webpack 使用文件系统(file system)获取文件改动的通知, 但是当在远程进行操作时有可能会出问题,所以需要轮询
    watchOptions: {
      // 重建之前的延迟在此时间段内的改动将被一起聚合在一块重建
      aggregateTimeout: 300,
      // 打开轮询并设置周期
      poll: 1000,
      // 忽视的文件夹,多个文件夹使用这种形式['files/**/*.js', 'node_modules/**']
      ignored: /node_modules/
    },
    // true启用https，false不启用
    https: false,
    // webpack启动或保存时命令行的信息,当配置了quiet或noInfo时，该配置不起作用
    stats: "errors-only",
    // 本地静态资源访问的公共路径,如果output里设置了这个,则devServer也要设置,否则本地访问不到
    // publicPath: '/mobile/',
    // 开发环境接口域名代理
    // proxy: {
    //   // 匹配 url 路径的开头
    //   '/api': {
    //     // 路劲只要是/api开头的url都代理到下面这个网站。
    //     // 例如：fetch('/api/xxxx') 会代理到 https://news-at.zhihu.com/api/xxxx
    //     // 例如：fetch('http://localhost:9000/api/xxxx') 这种写法会代理失败
    //     target: 'https://news-at.zhihu.com',
    //     // 允许代理 websockets 协议
    //     ws: true,
    //     // true不接受运行在 HTTPS 上，且使用了无效证书的后端服务, false关闭安全检测
    //     secure: false,
    //     // 需要虚拟托管的站点要设为true，开发时大部分情况都是虚拟托管的站点
    //     changeOrigin: true,
    //     // 实际请求中不存在代理字段则重写接口路径把api字符串去掉
    //     pathRewrite: {
    //       '^/api': '/'
    //     }
    //   }
    // },
    // 将错误或警告覆盖显示在浏览器屏幕上
    // overlay: {
    //   // 显示警告信息
    //   warnings: false,
    //   // 显示错误信息
    //   errors: false
    // },
  },
  // 开启source-map 用途是为了在开发环境中便于调试错误 因为打包过后的代码和源代码不一样很难阅读 source map一般只在开发环境运行 生产环境还是保持混乱的状态防止逻辑暴露
  devtool: 'source-map'
}