'use client'

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


export default function Home() {
  // but we have to check if the user is authenticated
  // if it is not, we redirect it to register page
  // otherwise, we let him be :)
  const router = useRouter();

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
        // console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {

    checkToken();
  }, []); 

  const logout = () => {
    localStorage.clear();
    router.refresh();
    checkToken();
  }

  return (
    <div className="main">
      {/* this will be the main page */}
      <h1>Events</h1>
      <button onClick={logout}>Log Out</button>
    </div>
  )
}
