import './molecules-style.css';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const BottomNavBar = ({_groups, _mail, _firstName, _isAdmin, _setIsModal, _setModalType }) => {
    const router = useRouter();

    const [isPop, setIsPop] = useState(false);
    const [prevPop, setPrevPop] = useState("user");
    const [popContent, setPopContent] = useState("");
    const popupRef = useRef(null);
    const [users, setUsers] = useState([]);
    const [invitations, setInvitations] = useState([]);
    const [currentGroup, setCurrentGroup] = useState("");
    
    const [mail, setMail] = useState(_mail);
    const [notifications, setNotifications] = useState([]);


    const [groupName, setGroupName] = useState();

    const handleButtonPopup = (event) => {
        if (event !== "" && event !== "notifications" && event !== "user") {
            setCurrentGroup(event);
        }

        if (popContent === "") {
            setIsPop(!isPop);
        }
        else {
            if (event === popContent) {
                setIsPop(!isPop);
            }
            else if (event !== popContent && isPop === false) {
                setIsPop(true);
            }
        }
        // setPrevPop(popContent);
        setPopContent(event)
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleClickOutsidePopup = (event) => {
        if (popupRef.current && !popupRef.current.contains(event.target)) {
            // setIsPop(false);
        }
    };

    const sendInvite = async (mail) => {
        try {
            const res = await axios.put('http://localhost:3001/groups/invite/'+currentGroup+'/'+mail);
        } catch (error) {
            console.error("error inviting to group");
        }
    }

    const invite = () => {
        // console.log("inviting..");
        for (let i = 0; i < invitations.length; i++) {
            sendInvite(invitations[i]);
            // console.log(invitations[i]);
        }
        location.reload();
    }

    
    const handleInvitationToggle = (mail) => {
        const invitationIndex = invitations.indexOf(mail);
        if (invitationIndex === -1) {
          // Email is not in invitations array, add it
          setInvitations([...invitations, mail]);
        } else {
          // Email is already in invitations array, remove it
          const updatedInvitations = [...invitations];
          updatedInvitations.splice(invitationIndex, 1);
          setInvitations(updatedInvitations);
        }
    };

    const fetchData = async () => {
        try {
            const res = await axios.get('http://localhost:3001/users/get-all');
            const userData = res.data.map(user => ({
                firstName: user.firstName,
                lastName: user.lastName,
                userMail: user.mail
            }));
            setUsers(userData);
        } catch (error) {
            console.error(error);
        }
    };

    
    useEffect(() => {
        fetchData();
    }, []);

    const confirmInvitation = async (not) => {
        try {
            const res = await axios.post('http://localhost:3001/groups/confirmInvite/'+not+'/'+_mail);
        } catch(err) {
            console.error(err);
        }
        location.reload();
    }

    const getGroupName = async (groupId) => {
        try {
            const res = await axios.get('http://localhost:3001/groups/get-group-name-from-groupid/'+groupId);
            // console.log(res.data.name);
            return res.data.name
            // setGroupName(res.data.name);
        } catch(err) {
            console.error(err);
        }
    }


    const getNotifications = async () => {
        try {
            const res = await axios.get('http://localhost:3001/users/get-notifications-of-user/' + _mail);
            // const userData = res.data.map(user => ({
            //     firstName: user.firstName,
            //     lastName: user.lastName,
            //     userMail: user.mail
            // }));
            // setUsers(userData);
            const notifications = await Promise.all(
                res.data.map(async (notification) => {
                    // console.log(notification);
                    const groupId = notification; // Assuming the groupId is available in the notification object, adjust this accordingly to your data structure.
                    const groupResponse = await axios.get(`http://localhost:3001/groups/get-group-name-from-groupid/${groupId}`);
                    const notificationWithGroup = {
                        id: groupId,
                        groupName: groupResponse.data.name // Assuming the group name is available in the groupResponse data, adjust this accordingly to your data structure.
                    };
                    return notificationWithGroup;
                })
            );

            setNotifications(notifications);
            // console.log(notifications);
        } catch (error) {
            console.error(error);
        }
    };
    
    useEffect(() => {
        getNotifications();
    }, [_mail]);



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
            {_groups && _groups.map((group) => (
                <button key={group} className='group-btn' onClick={() => handleButtonPopup(group)}>{group}</button>
            ))}
            <button
                className={"profile"}
                onClick={() => handleButtonPopup("user")}
            >
                {_firstName}
            </button>
            <button onClick={() => handleButtonPopup("notifications")} style={{backgroundColor: notifications.length > 0 ? 'rgb(30, 190, 56)' : 'white', color: notifications.length > 0 ? 'white' : 'black'}}>Notifications</button>
            {isPop && popContent === "user" ? (
                <div className="popup" ref={popupRef}>
                    {_isAdmin && (
                        <div style={{width:'100%'}}>
                            <div className='popup-option' onClick={() => { _setIsModal(true); _setModalType("create-event") }}>Create event</div>
                            <div className='popup-option' onClick={() => { router.push('edit-users'); }}>Edit users</div>
                        </div>
                    )}
                    <div className='popup-option' onClick={() => { _setIsModal(true); _setModalType("create-group") }}>Create group</div>
                    <div className='popup-option logout' onClick={logout}>Log Out</div>
                </div>
            ) :
            isPop && popContent === "notifications" ? (
                <div className="popup" ref={popupRef}>
                    <div className='popup-title'>Notifications</div>
                    <div className='notifications'>
                        {notifications.map((not) => (
                            <div key={not.groupName} className='popup-option' onClick={() => confirmInvitation(not.id)}>Group invitation to {not.groupName}!</div>
                        ))}
                    </div>
                </div>
            ) : 
            isPop && (
                <div className="popup" ref={popupRef}>
                    <div className='popup-title'>Invite members to {currentGroup}</div>
                    <div className='user-invitations'>
                        {users.map((user) => (
                            <div style={{ backgroundColor: invitations.includes(user.userMail) ? 'rgb(0, 0, 0)' : 'rgb(233, 228, 228)', color: invitations.includes(user.userMail) ? 'white' : 'black' }} className="user" key={user.userMail} onClick={() => handleInvitationToggle(user.userMail)}>
                                <p>{user.firstName} {user.lastName}</p>
                            </div>
                        ))}
                    </div>
                    <div className='invite-btn' onClick={invite}>Invite</div>
                </div>
            )
            }
        </div>
    );
}

export default BottomNavBar;