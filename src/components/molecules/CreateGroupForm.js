import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Input from '@/components/atoms/Input';
import LargeButton from '@/components/atoms/LargeButton';
import './molecules-style.css';
import '../atoms/atoms-style.css';

// import mapboxgl from 'mapbox-gl';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import Autosuggest from 'react-autosuggest';
import 'mapbox-gl/dist/mapbox-gl.css';


const CreateGroupForm = () => { 

    const [groupName, setGroupName] = useState('');
    const [invitations, setInvitations] = useState([]);

    const handleFormSubmit = async (e) => {
        e.preventDafault();

        if(groupName && invitations && members) {
            console.log(groupName,invitations,members);

            try{
                const response = await axios.post('http://localhost:3001/groups/create-group', {
                   name: groupName,
                   invitations: invitations,
                });
                location.reload();
            }catch(error){
                console.error(error);
            }

        }else{
            console.log('Please fill in all fields');
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
            // console.log(groupIds);
            const groupPromises = groupIds.map(async (groupId) => {
              try {
                // console.log(String(groupId));
                const groupRes = await axios.get('http://localhost:3001/groups/get-group-name-from-groupid/'+groupId);
                // console.log(groupRes);
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
        <div className="create-group-form">
            <h1>Create Group</h1>
              <form onSubmit={handleFormSubmit}>
                <div className="mid-fields">
                    <Input _onInputChange={(value) => setGroupName(value)} _placeholder={"Group Name"}/>
                    <Input _onInputChange={(value) => setInvitations(value)} _placeholder={"Invitations"}/>
                    <Input _onInputChange={(value) => setMembers(value)} _placeholder={"Members"}/>
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
                  <LargeButton _label="Create group -->" _type="submit"/>
              </div>
              </form>
        </div>
        
    );
}