import { useState } from "react";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Input from '@/components/atoms/Input';
import LargeButton from '@/components/atoms/LargeButton';
import './molecules-style.css';

const RegisterForm = () => {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // Reset previous error messages
        setEmailError('');
        setPasswordError('');


        if (email && password) {
            try {
                const response = await axios.post('http://localhost:3001/register/login', {
                    mail: email,
                    password: password,
                });


                localStorage.setItem('token', response.data.token);
                router.push('/');
            } catch (error) {
                console.error(error);
 
                setPasswordError('Incorrect email or password');
            }

            setEmail('');
            setPassword('');
        } else {
            // Validation for empty fields
            if (!email) {
                setEmailError('Please enter your email.');
            }
            if (!password) {
                setPasswordError('Please enter your password.');
            }
        }
    };

    return (
        <div className="register-form">
            <h1>Welcome back!</h1>
            <form onSubmit={handleFormSubmit}>
                <div className="mid-fields">
                    <Input
                        _onInputChange={(value) => setEmail(value)}
                        _placeholder={"Mail"}
                    />
                    {emailError && <p className="error-message">{emailError}</p>}
                    <Input
                        _onInputChange={(value) => setPassword(value)}
                        _placeholder={"Password"}
                    />
                    {passwordError && <p className="error-message">{passwordError}</p>}
                </div>

                <div className="bottom-fields">
                    <LargeButton _label="Sign In -->" _type="submit" />
                    <h3 onClick={() => {
                        router.push('/register/new-user');
                    }}><u>I don't have an account {"->"}</u></h3>
                </div>
            </form>
        </div>
    );
}

export default RegisterForm;
