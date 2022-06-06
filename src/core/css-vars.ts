import cssVars, { CSSVarsPonyfillOptions } from "css-vars-ponyfill";

// 设置css自定义变量的值，用来动态设置自定义变量的值
export function setCssVars(obj: { [key: string]: string; }, other?: CSSVarsPonyfillOptions) {
  cssVars({
    variables: obj,
    ...other
  });
}
