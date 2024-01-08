import React from 'react';
import 'react-responsive-modal/styles.css';
import "./baseModal.less";
import { Modal, ModalProps } from 'react-responsive-modal';

export interface BaseModalProps extends ModalProps {

}
const BaseModal = React.forwardRef<HTMLDivElement, BaseModalProps>((props, ref) => {

  const {
    children,
    center = true,
    classNames,
    ...rest
  } = props;

  return (
    <Modal ref={ref} classNames={{ modalContainer: "custom-modal-wrapper", ...classNames }} center={center} {...rest}>
      {children}
    </Modal>
  );
});

export default BaseModal;
