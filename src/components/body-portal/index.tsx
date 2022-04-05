import { setStyle } from '@/utils/dom';
import React, { CSSProperties } from 'react';
import ReactDOM from 'react-dom';

/**
 * 插入根节点组件
 * @param props 
 * @returns 
 */
export const BodyPortal: React.FC<{ style?: CSSProperties }> = (props) => {
  const elBox = React.useRef<HTMLDivElement>(document.createElement('div'));

  React.useEffect(() => {
    const portal = elBox.current;
    setStyle({
      position: 'relative'
    }, portal)
    if (props?.style) {
      setStyle(props?.style, portal);
    }
    document.body.appendChild(portal);
    return () => {
      document.body.removeChild(portal);
    };
  }, []);

  return ReactDOM.createPortal(props.children, elBox.current);
};

export function withBodyPortal<P>(component: any) {
  return React.forwardRef<unknown, P>((props, ref) => (
    <BodyPortal>{React.createElement(component, { ...props, ref })}</BodyPortal>
  ));
}
