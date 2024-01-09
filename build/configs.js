/**
 * webpack的配置管理文件
 */

// 合并为一个对象输出
module.exports = {
  // 是否开启体积分析插件
  isAnalyz: false,
  // 是否是开发环境
  isDev: process.env.NODE_ENV === 'dev',
};
