import { css } from '@/utils/dom';
import React, { CSSProperties } from 'react';
import ReactDOM from 'react-dom';

/**
 * 插入根节点组件
 * @param props 
 * @returns 
 */
export const BodyPortal: React.FC<{ style?: CSSProperties, customPortal?: HTMLElement }> = (props) => {
  const elBox = React.useRef<HTMLDivElement>(document.createElement('div'));

  React.useEffect(() => {
    const portal = elBox.current;
    css(portal, {
      position: 'relative'
    });
    if (props?.style) {
      css(portal, props?.style);
    }
    const root = props?.customPortal || document.body;
    root.appendChild(portal);
    return () => {
      root.removeChild(portal);
    };
  }, []);

  return ReactDOM.createPortal(props.children, elBox.current);
};

export function withBodyPortal<P>(component: any) {
  return React.forwardRef<unknown, P>((props, ref) => (
    <BodyPortal>{React.createElement(component, { ...props, ref })}</BodyPortal>
  ));
}
