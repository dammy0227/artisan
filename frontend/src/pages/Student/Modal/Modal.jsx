import React from "react";
import "./Modal.css";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modals-overlay">
      <div className="modals-content">
        <button className="modals-close" onClick={onClose}>✕</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
