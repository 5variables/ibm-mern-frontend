import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Input from '@/components/atoms/Input';
import LargeButton from '@/components/atoms/LargeButton';
import './molecules-style.css';


const RegisterForm = () => {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // check if all fields are completed
        if (email && password) {
            
            try {
                const response = await axios.post('http://localhost:3001/register/login', {
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
        <div className="register-form">
            <h1>Welcome back!</h1>
            <form onSubmit={handleFormSubmit}>
            <div className="mid-fields">
                <Input _onInputChange={(value) => setEmail(value)} _placeholder={"Mail"}/>
                <Input _onInputChange={(value) => setPassword(value)} _placeholder={"Password"}/>
            </div>

            <div className="bottom-fields">
                <LargeButton _label="Sign In -->" _type="submit"/>
                <h3 onClick={() => {
                    router.push('/register/new-user');
                }}><u>I don't have an account {"->"}</u></h3>
            </div>
            </form>
        </div>
    );
}

export default RegisterForm;