import { css } from '@/utils/dom';
import React, { CSSProperties } from 'react';
import ReactDOM from 'react-dom';

/**
 * 插入目标节点组件
 * @param props 
 * @returns 
 */
const CreatePortal = React.forwardRef<any, { style?: CSSProperties, container?: HTMLElement, children: any }>((props, ref) => {
  const elBox = React.useRef<HTMLDivElement>(document.createElement('div'));

  React.useEffect(() => {
    const portal = elBox.current;
    css(portal, {
      position: 'relative'
    });
    if (props?.style) {
      css(portal, props?.style);
    }
    const root = props?.container || document.body;
    root.appendChild(portal);
    return () => {
      root.removeChild(portal);
    };
  }, []);

  return React.isValidElement(props.children) ? ReactDOM.createPortal(React.cloneElement(props.children, { ref }), elBox.current) : null;
});

export default CreatePortal;
