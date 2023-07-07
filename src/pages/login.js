import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';


const LoginPage = () => {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // check if all fields are completed
        if (email && password) {
            
            try {
                const response = await axios.post('http://localhost:3001/login', {
                    mail: email,
                    password: password,
                });
            
                // console.log(response.data.token); 
                localStorage.setItem('token', response.data.token);
                router.push('/');
            } catch (error) {
                console.error(error);
            }

            
            setEmail('');
            setPassword('');
        } else {
           
            console.log('Please fill in all fields.');
        }
    };

    return(
        <div>
            <h1>Welcome back, login in your account</h1>
            <div style={{ display: 'flex' }}>
                <div style={{ flex: 3 }}>
                    <form onSubmit={handleFormSubmit}>
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
                        <button type="submit">Login</button>
                    </div>
                    <div>
                        <h3 onClick={() => {
                            router.push('/register');
                        }}><u>I don't have an account. Click here</u></h3>
                    </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;