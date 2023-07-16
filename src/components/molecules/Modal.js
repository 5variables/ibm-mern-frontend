import React, { useState } from 'react';
import CreateEventForm from './CreateEventForm';
import './molecules-style.css';

const Modal = ({ _isModal, _setIsModal }) => {

  const toggleModal = () => {
    _setIsModal(!_isModal);
  };

  return (
    <div>
      <div className="modal">
        <div className="modal-content">
            <div className='close-btn'>
              <button onClick={toggleModal}>Close</button>
            </div>
            <CreateEventForm />
        </div>
      </div>
    </div>
  );
};

export default Modal;