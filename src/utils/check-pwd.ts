// 是否连续3次出现重复字符
const regRepeat = /([0-9a-zA-Z])\1{2}/;
// 是否包含大写字母
const regUpperLetter = /(?=.*[A-Z])/;
// 是否包含小写字母
const regLowerLetter = /(?=.*[a-z])/;
// 是否包含大小写
const regLetter = /(?=.*[A-Z])(?=.*[a-z])/;
// 是否包含数字
const regDigit = /(?=.*[0-9])/;
// 是否包含特殊字符
const regSpChar = /(?=.*[\W_])/;
// 组合验证，综合上面三种，并且密码长度不小于8位
const regCompose = /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W_]).{8,}/;

//是否连续3次出现重复字符
function repeatCheck(str?: string) {
  if (!str) return false;
  return regRepeat.test(str);
}

// 是否连续字符（如abc, 123）连续3位以上
function LxCheck(str?: string) {
  if (!str) return false;
  let lcontinuity = 0; //用于连贯个数的计数
  for (let i = 1; i < str.length; i++) {
    //1正序连贯；-1倒序连贯
    if (((str[i].charCodeAt(0)) - (str[i - 1].charCodeAt(0)) == 1) || ((str[i].charCodeAt(0)) - (str[i - 1].charCodeAt(0)) == -1)) {
      lcontinuity += 1; //存在连贯：计数+1
    }
  }
  if (lcontinuity > 3) {
    return true;
  }
}

//是否包含大写字母
function upperLetterCheck(str?: string) {
  if (!str) return false;
  return regUpperLetter.test(str);
}

//是否包含小写字母
function lowerLetterCheck(str?: string) {
  if (!str) return false;
  return regLowerLetter.test(str);
}

//是否包含大小写字母
function letterCheck(str?: string) {
  if (!str) return false;
  return regLetter.test(str);
}

//是否包含数字
function digitCheck(str?: string) {
  if (!str) return false;
  return regDigit.test(str);
}

//是否包含特殊字符
function spCharCheck(str?: string) {
  if (!str) return false;
  return regSpChar.test(str);
}

// 密码中是否包含特殊词组
function spWordsCheck(str?: string) {
  if (!str) return false;
  const password = str.toUpperCase();
  const words = ['ADMIN', 'PASSWARD', 'TEST'];
  const result = words?.some((word) => password?.indexOf(word) > 0);
  if (result) {
    return true;
  }
}

// 组合验证，符合返回true
function composeCheck(str?: string) {
  if (!str) return false;
  return regCompose.test(str);
}

export {
  repeatCheck,
  LxCheck,
  upperLetterCheck,
  lowerLetterCheck,
  letterCheck,
  digitCheck,
  spCharCheck,
  spWordsCheck,
  composeCheck
};