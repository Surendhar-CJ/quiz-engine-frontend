import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useContext } from 'react';
import { QuizContext } from '../context/QuizContext';
import { baseURL } from '../config.js';
import "../styles/Login.css";


const Login = ({ toggleLogin, toggleSignUp }) => {
    const contextValue = useContext(QuizContext);
    const setUser = contextValue.setUser;

    const navigate = useNavigate();
    const [formData, setFormData] = useState(
        {username: "", password: ""}
    )

    const handleChange = (event) => {
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [event.target.name]: event.target.value
            }
        })
    }

    const postLoginRequest = async() => {
        try {
            const response = await fetch(`${baseURL}/api/v1/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();

            if(response.ok)  {
                setUser(data.user);
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('token', data.token);
            }           

            if (!response.ok) {
                throw new Error(data.message);
            } else {
                setServerErrors('');
                navigate('/home');
            }
        } catch (error) {
            setServerErrors(error.message);
        }
    }

    React.useEffect(() => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
    
        if (user && token) {
            setUser(user);
            navigate('/home');
        }
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        postLoginRequest();
    }

    const handleSignUpLinkClick = (event) => {
        event.preventDefault();
        toggleLogin();
        toggleSignUp();  
  };

  const [serverErrors, setServerErrors] = useState('');



    return (
        <div className = "login-card" onSubmit={handleSubmit}>
            <h2>Login</h2>
            <form className="login-form">
                <input 
                    type="text" 
                    name="username" 
                    placeholder="Username"
                    onChange={handleChange}
                    value={formData.username}
                    required
                />
                <input 
                    type="password" 
                    name="password" 
                    placeholder="Password"
                    onChange={handleChange}
                    value={formData.password}
                    required 
                />
                <button type="submit">Submit</button>
                {serverErrors && <div className="error-message">{serverErrors}</div>}
                <p>Don't have an account?</p>
                <span className="signup-link" onClick={handleSignUpLinkClick}>Signup</span>
            </form>       
        </div>
    )
}

export default Login;