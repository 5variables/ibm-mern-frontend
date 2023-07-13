import './molecules-style.css';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const BottomNavBar = ({_firstName, _isAdmin, _setIsModal}) => {
    const router = useRouter();

    const [isPop, setIsPop] = useState(false);
    const popupRef = useRef(null);

    const handleButtonPopup = () => {
        setIsPop(!isPop);
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleClickOutsidePopup = (event) => {
        if (popupRef.current && !popupRef.current.contains(event.target)) {
            // setIsPop(false);
        }
    };

    useEffect(() => {
        if (isPop) {
            window.addEventListener('click', handleClickOutsidePopup);
        }

        return () => {
            window.removeEventListener('click', handleClickOutsidePopup);
        };
    }, [isPop]);

    const logout = () => {
        localStorage.clear();
        location.reload();
      }

    return(
        <div className="navbar">
        <button
            className={"profile"}
            onClick={handleButtonPopup}
        >
            <div className="nameHandle">{_firstName}</div>
        </button>
        {isPop && (
            <div className="popup" ref={popupRef}>
                {_isAdmin && (
                    <div className='popup-option' onClick={() => _setIsModal(true)}>Create event</div>
                )}
                <div className='popup-option' onClick={logout}>Log Out</div>
            </div>
        )}
        </div>
    );
}

export default BottomNavBar;