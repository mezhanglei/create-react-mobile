import React, { LegacyRef } from 'react';
import './index.less';

interface SvgIconProps extends React.HtmlHTMLAttributes<SVGSVGElement> {
  name: string;
  className?: string;
}

const SvgIcon = React.forwardRef((props: SvgIconProps, ref: LegacyRef<SVGSVGElement>) => {
  const { name, className, ...rest } = props
  const svgClass = className ? 'svg-icon ' + className : 'svg-icon';
  const iconName = `#${name}`;
  return (
    <svg className={svgClass} aria-hidden="true" ref={ref} {...rest}>
      <use xlinkHref={iconName} />
    </svg>
  );
});

export default SvgIcon;