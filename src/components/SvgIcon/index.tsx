import React, { LegacyRef } from 'react';
import './index.less';
// 批量引入svg组件
const svgs = {};
const context = require['context']('./svg', false, /\.svg$/);
context.keys().forEach((filename: string) => {
  const componentName = filename.replace(/^\.\/(.*)\.svg$/, '$1');
  const Com = context(filename).default;
  svgs[componentName] = Com;
});
interface SvgIconProps extends React.HtmlHTMLAttributes<SVGSVGElement> {
  name: string;
  className?: string;
}

const SvgIcon = React.forwardRef((props: SvgIconProps, ref: LegacyRef<SVGSVGElement>) => {
  const { name, className, ...rest } = props;
  const svgClass = className ? 'svg-icon ' + className : 'svg-icon';
  const SvgIconChild = name ? svgs[name] : null;
  return SvgIconChild ? <SvgIconChild className={svgClass} {...rest} /> : null;
});

export default SvgIcon;
