import React, { useState } from 'react';
import "../styles/SignUp.css";



const SignUp = ({ toggleLogin, toggleSignUp }) => {

    const [formData, setFormData] = useState( 
        {
            firstName : "",
            lastName : "",
            email : "",
            password : ""
        }
    );

    const handleChange = (event) => {
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [event.target.name] : event.target.value
            }
        })
    };

    const [serverErrors, setServerErrors] = useState('');

    const postSignUpRequest = async() => {
        try {
            const response = await fetch("http://localhost:9090/api/v1/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            } else {
                setServerErrors('');
                toggleSignUp(); 
                toggleLogin(); 
            }
        } catch (error) {
            console.error("Error :", error);
            setServerErrors(error.message);
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        postSignUpRequest();
    }

    const handleLoginLinkClick = (event) => {
        event.preventDefault();
        toggleSignUp();  
        toggleLogin();  
      };


    return (
        <div className = "signup-card">
            <h2>Sign Up</h2>
            <form className="signup-form" onSubmit={handleSubmit}>
                <input  
                    type="text" 
                    name="firstName" 
                    placeholder="Firstname"
                    onChange={handleChange}
                    value={formData.firstName} 
                />
                <input 
                    type="text" 
                    name="lastName" 
                    placeholder="Lastname"
                    onChange={handleChange}
                    value={formData.lastName}
                />
                <input 
                    type="email" 
                    name="email" 
                    placeholder="Email"
                    onChange={handleChange}
                    value={formData.email}
                />
                <input 
                    type="password" 
                    name="password" 
                    placeholder="Password" 
                    onChange={handleChange}
                    value={formData.password}
                />
                <button type="submit">Submit</button>
                {serverErrors && <div className="error-message">{serverErrors}</div>}
                <p>Already have an account?</p>
                <span className="login-link" onClick={handleLoginLinkClick}>Login</span>
            </form>       
        </div>
    )
}

export default SignUp;