import { useState } from "react";
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
    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // Reset previous error messages
        setFirstNameError('');
        setLastNameError('');
        setEmailError('');
        setPasswordError('');

        // check if all fields are completed
        if (firstName && lastName && email && password) {
            try {
                const response = await axios.post('http://localhost:3001/register/new-user', {
                    firstName: firstName,
                    lastName: lastName,
                    mail: email,
                    password: password,
                });

                // Successful registration
                localStorage.setItem('token', response.data.token);
                router.push('/');
            } catch (error) {
                console.error(error);
            }

            // Clear the fields
            setFirstName('');
            setLastName('');
            setEmail('');
            setPassword('');
        } else {
            // Validation for empty fields
            if (!firstName) {
                setFirstNameError('Please enter your first name.');
            }
            if (!lastName) {
                setLastNameError('Please enter your last name.');
            }
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
            <h1>Create your account</h1>
            <form onSubmit={handleFormSubmit}>
                <div className="names">
                    <Input
                        _onInputChange={(value) => setFirstName(value)}
                        _placeholder={"First Name"}
                    />
                    {firstNameError && <p className="error-message">{firstNameError}</p>}
                    <Input
                        _onInputChange={(value) => setLastName(value)}
                        _placeholder={"Last Name"}
                    />
                    {lastNameError && <p className="error-message">{lastNameError}</p>}
                </div>
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
                    <LargeButton _label="Sign Up -->" _type="submit" />
                    <h3 onClick={() => {
                        router.push('/register/login');
                    }}><u>I already have an account {"->"}</u></h3>
                </div>
            </form>
        </div>
    );
}

export default RegisterForm;
