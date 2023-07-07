import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';


const RegisterPage = () => {
    const router = useRouter();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // check if all fields are completed
        if (firstName && lastName && email && password && confirmPassword) {
            
            try {
                const response = await axios.post('http://localhost:3001/register', {
                    firstName: firstName,
                    lastName: lastName,
                    mail: email,
                    password: password,
                });
            
                // console.log(response.data.token); 
                localStorage.setItem('token', response.data.token);
                router.push('/');
            } catch (error) {
                console.error(error);
            }

            
            setFirstName('');
            setLastName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
        } else {
           
            console.log('Please fill in all fields.');
        }
    };

    return(
        <div>
            <h1>Create your account</h1>
            <div style={{ display: 'flex' }}>
                <div style={{ flex: 3 }}>
                    <form onSubmit={handleFormSubmit}>
                    <div>
                        <label>
                        First Name:
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        </label>
                    </div>
                    <div>
                        <label>
                        Last Name:
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                        </label>
                    </div>
                    <div>
                        <label>
                        Email:
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        </label>
                    </div>
                    <div>
                        <label>
                        Password:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        </label>
                    </div>
                    <div>
                        <label>
                        Confirm Password:
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        </label>
                    </div>
                    <div>
                        <button type="submit">Register</button>
                    </div>
                    <div>
                        <h3 onClick={() => {
                            router.push('/login');
                        }}><u>I already have an account. Click here</u></h3>
                    </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default  RegisterPage;