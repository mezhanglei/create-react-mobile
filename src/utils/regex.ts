/**
 * 正则表达式
 */

const reg = {
  // 数字类型
  num: {
    pattern: /^[+-]?\d(\.\d+)?$/,
    message: '只能输入数字'
  },
  negative: {
    pattern: /^-\d/,
    message: '只能输入负数'
  },
  integerAndZero: {
    pattern: /^\d+(\.\d+)?$/,
    message: '只能输入正整数'
  },
  integerNoZero: {
    pattern: /^[1-9]?\d{1,12}$/,
    message: '只能输入正整数, 不超过13位'
  },
  anyIntegerAndZero: {
    pattern: /^-?[1-9]?\d{1,12}$/,
    message: '只能输入整数或零，不超过13位'
  },
  anyIntegerNoZero: {
    pattern: /^([1-9]\d{1,12}|-[1-9]\d{1,12})$/,
    message: '只能输入正整数或负整数，不超过13位'
  },
  moreThanZero: {
    pattern: /^([1-9]\d{0,3}|[0])(\.\d{0,6})?$/,
    message: '整数位最长四位，小数位最长六位，不允许为负数'
  },
  currency: {
    pattern: /^(([1-9]\d{1,12}|[1-9](,\d{3}){4}|[1-9]\d{0,2}(,\d{3}){0,3})|(0))(\.(\d){0,2})?$/,
    message: '输入金额大于等于零，整数不超过十三位，小数不超过两位'
  },
  htmlTag: {
    pattern: /<\s*(\S+)(\s[^>]*)?>[\s\S]*<\s*\/\1\s*>/
  }
}

export default reg;