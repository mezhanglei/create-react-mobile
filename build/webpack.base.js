"use strict";

// 引入webpack
const webpack = require("webpack");
const path = require("path");
// css文件指纹插件提取css，作用是缓存css并解决样式闪动问题 因为只在编译阶段作用 所以不适用于热更新 但在生产环境无需配置热更新也没多大问题
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 通过CopyWebpackPlugin将目标文件夹里的静态资源拷贝到目标文件夹
// const CopyWebpackPlugin = require("copy-webpack-plugin");
// (构建过程优化)webpack体积分析插件(会单独打开一个端口8888的页面显示体积构造图)
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
// eslint格式检查
const ESLintWebpackPlugin = require('eslint-webpack-plugin');

// 引入配置
const configs = require('./configs.js');
// 引入路径
const paths = require('./paths.js');
const isDev = configs.isDev;
// less/less module 正则表达式
const lessRegex = /\.less$/;
const lessModuleRegex = /\.module\.less$/;
// css/css module 正则表达式
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
// node_modules正则表达式
const nodeModulesRegex = /node_modules/;

const cssLoader = isDev ? 'style-loader' : {
  loader: MiniCssExtractPlugin.loader,
  options: {
    // 修改打包后目录中css文件中静态资源的引用的基础路径
    publicPath: "../",
  },
};

//  === webpack配置内容 === //
module.exports = {
  entry: paths.appEntry,
  context: paths.appRoot,
  target: ["web", "es5"],
  output: {
    clean: isDev ? false : true, // 在生成文件之前清空 output 目录
    path: paths.outputPath,
    filename: isDev ? "[name].js" : "js/[name]_[chunkhash:8].js",
    publicPath: paths.publicPath
  },
  externals: {},
  resolve: {
    // 后缀，引入时可以默认不写
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json", ".less"],
    alias: {
      "@": `${paths.srcPath}`,
      "src": `${paths.srcPath}`
    }
  },
  // 用来指定loaders的匹配规则和指定使用的loaders名称
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        // 忽略第三方
        // 忽略第三方(看第三方包是否需要转译,不需要的话去掉)
        // exclude: [nodeModulesRegex, /lib/],
        include: [
          paths.srcPath,
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
        use: [
          cssLoader,
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
              lessOptions: {
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
          "postcss-loader",
          "less-loader"
        ],
      },
      {
        test: /\.(png|jpg|gif|jpeg|ico)$/i,
        exclude: [nodeModulesRegex],
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
        test: /\.svg$/i,
        exclude: [nodeModulesRegex],
        type: 'asset',
        resourceQuery: /url/, // *.svg?url
      },
      {
        test: /\.svg$/,
        exclude: [nodeModulesRegex],
        resourceQuery: { not: [/url/] }, // exclude react component if *.svg?url
        use: ['@svgr/webpack'],
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
      'process.env': {
        MOCK: process.env.MOCK,
        PUBLIC_PATH: JSON.stringify(paths.publicPath || '/')
      }
    }),
    new HtmlWebpackPlugin({
      filename: `index.html`,
      template: paths.appHtml,
      inject: true,
      favicon: paths.favicon,
      minify: {
        html5: true,
        caseSensitive: false,
        removeAttributeQuotes: isDev ? false : true,
        collapseWhitespace: isDev ? false : true,
        preserveLineBreaks: false,
        minifyCSS: false,
        minifyJS: true,
        removeComments: true
      },
      commonJs: [
      ],
      commonCSS: [
      ]
    }),
    isDev &&
    new ESLintWebpackPlugin({
      context: paths.appRoot
    }),
    !isDev &&
    new MiniCssExtractPlugin({
      filename: "css/[name]_[contenthash:8].css",
    }),
    !isDev && configs.isAnalyz &&
    new BundleAnalyzerPlugin(),
  ]
};
