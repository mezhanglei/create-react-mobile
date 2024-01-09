const shell = require('shelljs');

// 时间格式生成
function dateFormat(date) {
  let y = date.getFullYear();
  let M = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  let d = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  let h = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  let m = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  let s = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
  return `${y}-${M}-${d} ${h}:${m}:${s}`;
}

// 获取当前git分支信息
function getBranchVersionInfo() {
  // 当前分支名 git name-rev --name-only HEAD 这个命令会在终端输出你当前的版本或标签信息。
  let branchName = shell.exec('git name-rev --name-only HEAD').toString().trim();
  // 提交的commit hash
  let commitHash = shell.exec('git show -s --format=%H').toString().trim();
  // 提交人姓名
  let author = shell.exec('git show -s --format=%cn').toString().trim();
  // 提交日期
  let date = dateFormat(new Date(shell.exec('git show -s --format=%cd').toString()));
  // 提交描述
  let message = shell.exec('git show -s --format=%s').toString().trim();
  return {
    branchName,
    commitHash,
    author,
    date,
    message
  };
}

module.exports = {
  getBranchVersionInfo
};
