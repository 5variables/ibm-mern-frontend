'use client'

import BottomNavBar from '@/components/molecules/BottomNavBar';
import Modal from '@/components/molecules/Modal';
import axios from 'axios';
import DateSelector from '../components/molecules/DateSelector'
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import EventList from '@/components/molecules/EventList';


const Home = () => {
  // but we have to check if the user is authenticated
  // if it is not, we redirect it to register page
  // otherwise, we let him be :)
  const router = useRouter();

  const [mail, setMail] = useState();
  const [firstName, setFirstName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [groups, setGroups] = useState([]);
  const [groupsName, setGroupsName] = useState([]);

  
  useEffect(() => {
    const checkToken = async () => {
      // check if token exists in localStorage
      const token = localStorage.getItem('token');
  
      if (!token) {
        // redirect to RegisterPage if token doesn't exist
        router.push('/register/new-user');
      } else {
        // verify user with token
        try {
          const response = await axios.post('http://localhost:3001/register/verify-token', {
            token: token,
          });
  
          // handle the response if needed
          // console.log(response.data.user.groups);
          setGroups(response.data.user.groups);
          setFirstName(response.data.user.firstName);
          setIsAdmin(response.data.user.admin);
          setMail(response.data.user.mail);
          // console.log("da " + response.data.user.mail);
        } catch (error) {
          console.error(error);
        }
      }
    };

    
    checkToken();   
  }, []);

  const getGroupName = async ( groupId ) => {
    try {
        const res = await axios.get("http://localhost:3001/groups/get-group-name-from-groupid/" + groupId);
        // console.log(res.data);
        setGroupsName(names => [...names, res.data.name]);
    } catch (error) {
        console.log("Error getting the group: " + groupId);
    }
  }

  useEffect(() => {
    // Fetch group names whenever the groups state changes
    for (let i = 0; i < groups.length; i++) {
      getGroupName(groups[i]);
    }
  }, [groups]);

  return (
    <div className="main">
      <h1>Events</h1>
      <div className="content">
      <DateSelector/>
      <EventList/>
      </div>
      <BottomNavBar _groups={groupsName} _firstName={firstName} _mail={mail} _isAdmin={isAdmin} _setIsModal={setIsModal}/>
      {isModal && (<Modal _isModal={isModal} _setIsModal={setIsModal}/>)}
    </div>
  );
}

export default Home;
