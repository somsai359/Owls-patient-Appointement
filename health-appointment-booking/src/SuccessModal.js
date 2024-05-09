// SuccessModal.js
import React from 'react';

function SuccessModal({ isOpen, onClose }) {
  return (
    <div className={`modal ${isOpen ? 'show' : ''}`}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Success!</h2>
        <p>Patient created successfully.</p>
      </div>
    </div>
  );
}

export default SuccessModal;
