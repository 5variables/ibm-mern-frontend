import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Input from '@/components/atoms/Input';
import LargeButton from '@/components/atoms/LargeButton';
import './molecules-style.css';


const CreateEventForm = () => {
    const router = useRouter();

    const [eventName, setEventName] = useState('');
    const [description, setDescription] = useState('');

    const [users, setUsers] = useState([]);
    const [userName, setUserName] = useState([]);
    const [invitations, setInvitations] = useState([]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        // check if all fields are completed
        if (eventName && description) {
            
            try {
                const response = await axios.post('http://localhost:3001/events/create-event', {
                    title: eventName,
                    description: description,
                    invitations: invitations
                });
                
                location.reload();
            } catch (error) {
                console.error(error);
            }

        } else {
            console.log('Please fill in all fields.');
        }
    };

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

    useEffect(() => {
        const fetchData = async () => {
            try {
              const res = await axios.get('http://localhost:3001/users/get-all');
              const userData = await Promise.all(
                res.data.map(async (user) => {
                  const groupNames = user.groups.length > 0
                    ? await fetchGroupNames(user.groups)
                    : [];
                  return {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    userMail: user.mail,
                    groups: groupNames
                  };
                })
              );
              setUsers(userData);
            } catch (error) {
              console.error(error);
            }
          };
          
          const fetchGroupNames = async (groupIds) => {
            console.log(groupIds);
            const groupPromises = groupIds.map(async (groupId) => {
              try {
                // console.log(String(groupId));
                const groupRes = await axios.get('http://localhost:3001/groups/get-group-name-from-groupid/'+groupId);
                console.log(groupRes);
                return groupRes.data;
              } catch (error) {
                console.error(`Error fetching group name for groupId: ${groupId}`, error);
                return null; // Handle errors as needed
              }
            });
            return Promise.all(groupPromises);
          };
    
        fetchData();
    }, [])

    return(
        <div className="register-form">
            <h1>Create event</h1>
            <form onSubmit={handleFormSubmit}>
                <div className="mid-fields">
                    <Input _onInputChange={(value) => setEventName(value)} _placeholder={"Event title"}/>
                    <Input _onInputChange={(value) => setDescription(value)} _placeholder={"Description"}/>
                </div>

                <h4>Select invitations</h4>
                <div className="users">
                    {users.map((user) => (
                        <div style={{ backgroundColor: invitations.includes(user.userMail) ? 'rgb(0, 0, 0)' : 'rgb(233, 228, 228)', color: invitations.includes(user.userMail) ? 'white' : 'black' }} className="user" key={user.userMail} onClick={() => handleInvitationToggle(user.userMail)}>
                            <p>{user.firstName} {user.lastName} <b>{user.groups.join(", ")}</b></p>
                        </div>
                    ))}
                </div>

                <div className="bottom-fields">
                    <LargeButton _label="Create event -->" _type="submit"/>
                </div>
            </form>
        </div>
    );
}

export default CreateEventForm;