import React, { useState } from 'react';
import CreateGroupForm from './CreateGroupForm';
import './molecules-style.css';

const CreateGroupModal = ({_isModal, _setIsModal}) => {
    
    const toggleModal =() =>{
        _setIsModal(!_isModal);
    };

    return (
        <div>
          <div className="modal">
            <div className="modal-content">
                <div className='close-btn'>
                  <button className='close' onClick={toggleModal}>Close</button>
                </div>
                <CreateGroupForm />
            </div>
          </div>
        </div>
      );
};


export default CreateGroupModal;
