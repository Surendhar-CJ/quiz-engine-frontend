import React from 'react';
import '../styles/Modal.css';

const Modal = ({ children, onClose, className }) => {
   return (
    <div className={`modal ${className}`} onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default Modal;