import React, { useState } from 'react';
import CreateEventForm from './CreateEventForm';
import CreateGroupForm from './CreateGroupForm';
import './molecules-style.css';

const Modal = ({ _isModal, _setIsModal, _modalType }) => {

  const toggleModal = () => {
    _setIsModal(!_isModal);
  };

  return (
    <div>
      <div className="modal">
        <div className="modal-content">
            <div className='close-btn'>
              <button className='close' onClick={toggleModal}>Close</button>
            </div>
            {_modalType === "create-event" ? <CreateEventForm /> : <CreateGroupForm />}
        </div>
      </div>
    </div>
  );
};

export default Modal;