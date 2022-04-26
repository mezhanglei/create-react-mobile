/**
 * webpack的配置管理文件
 */

const os = require("os");

// 自动获取可远程访问的ip
function getNetworkIp() {
  // 打开的host
  let needHost = "";
  try {
    // 获得网络接口对象
    let network = os.networkInterfaces();
    // 遍历网络接口对象得到ipv4且不为127.0.0.1且internal为fasle(可远程访问)的host
    Object.keys(network).map((item) => {
      // 遍历每个类型的网络地址列表
      network[item].map((sub) => {
        if (
          sub.family === "IPv4" &&
          sub.address !== "127.0.0.1" &&
          !sub.internal
        ) {
          needHost = sub.address;
        }
      });
    });
  } catch (e) {
    needHost = "localhost";
  }
  return needHost;
}

// 合并为一个对象输出
module.exports = {
  // 是否开启体积分析插件
  isAnalyz: false,
  // 是否使用eslint true表示使用
  useEslint: false,
  // 是否使用stylelint true表示使用
  useStylelint: false,
  // 是否是生产环境
  isProd: process.env.NODE_ENV === 'prod',
  // 是否是开发环境
  isDev: process.env.NODE_ENV === 'dev',
  // 是否是测试环境
  isSit: process.env.NODE_ENV === 'sit',
  getNetworkIp,
};
