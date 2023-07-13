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
            const userEmails = res.data.map((user) => user.mail);
            setUsers(userEmails);
            // console.log(userEmails);
        } catch (error) {
            console.error(error);
        }
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

                <div className="users">
                    <h4>Select invitations</h4>
                    <ul>
                        {users.map((mail) => (
                        <li
                            key={mail}
                            onClick={() => handleInvitationToggle(mail)}
                            style={{ cursor: 'pointer', fontWeight: invitations.includes(mail) ? '700' : '200' }}
                        >
                            {mail}
                        </li>
                        ))}
                    </ul>
                </div>

                <div className="bottom-fields">
                    <LargeButton _label="Create event -->" _type="submit"/>
                </div>
            </form>
        </div>
    );
}

export default CreateEventForm;