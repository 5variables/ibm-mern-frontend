import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Input from '@/components/atoms/Input';
import LargeButton from '@/components/atoms/LargeButton';
import './molecules-style.css';


const RegisterForm = () => {
    const router = useRouter();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // check if all fields are completed
        if (firstName && lastName && email && password) {
            
            try {
                const response = await axios.post('http://localhost:3001/register/new-user', {
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
        } else {
           
            console.log('Please fill in all fields.');
        }
    };

    return(
        <div className="register-form">
            <h1>Create your account</h1>
            <form onSubmit={handleFormSubmit}>
            <div className="names">
                <Input _onInputChange={(value) => setFirstName(value)} _placeholder={"First Name"}/>
                <Input _onInputChange={(value) => setLastName(value)} _placeholder={"Last Name"}/>
            </div>
            <div className="mid-fields">
                <Input _onInputChange={(value) => setEmail(value)} _placeholder={"Mail"}/>
                <Input _onInputChange={(value) => setPassword(value)} _placeholder={"Password"}/>
            </div>

            <div className="bottom-fields">
                <LargeButton _label="Sign Up -->" _type="submit"/>
                <h3 onClick={() => {
                    router.push('/register/login');
                }}><u>I already have an account {"->"}</u></h3>
            </div>
            </form>
        </div>
    );
}

export default RegisterForm;