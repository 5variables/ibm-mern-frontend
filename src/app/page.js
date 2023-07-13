'use client'

import BottomNavBar from '@/components/molecules/BottomNavBar';
import Modal from '@/components/molecules/Modal';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';


const Home = () => {
  // but we have to check if the user is authenticated
  // if it is not, we redirect it to register page
  // otherwise, we let him be :)
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModal, setIsModal] = useState(false);

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
        // console.log(response.data.user.firstName);
        setFirstName(response.data.user.firstName);
        setIsAdmin(response.data.user.admin);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {

    checkToken();
  }, []); 

  return (
    <div className="main">
      <h1>Events</h1>
      <div className="content">

      </div>
      <BottomNavBar _firstName={firstName} _isAdmin={isAdmin} _setIsModal={setIsModal}/>
      {isModal && (<Modal _isModal={isModal} _setIsModal={setIsModal}/>)}
    </div>
  );
}

export default Home;
