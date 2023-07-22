import React, { useState } from 'react';
import { baseURL } from '../config.js';
import "../styles/SignUp.css";



const SignUp = ({ toggleLogin, toggleSignUp }) => {

    const [successMessage, setSuccessMessage] = useState(false);

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
            const response = await fetch(`${baseURL}/api/v1/users`, {
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
                showSuccessMessage(true); // Show success message
                setTimeout(() => {
                  toggleSignUp(); 
                  toggleLogin(); 
                }, 1500); 
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

    const showSuccessMessage = (message) => {
        setSuccessMessage(message);
        setTimeout(() => {
          setSuccessMessage(false);
        }, 1500);
      }

    const handleLoginLinkClick = (event) => {
        event.preventDefault();
        toggleSignUp();  
        toggleLogin();  
      };


      return (
        <div className = "signup-card">
          {successMessage ? (
            <div className="success-message">
                <p id="successful-signup"> Sign up successful!</p>
                <p id="login-notification">Please log in to continue</p>
            </div>
          ) : (
            <>
              <h2>Sign Up</h2>
              <form className="signup-form" onSubmit={handleSubmit}>
                <input  
                    type="text" 
                    name="firstName" 
                    placeholder="Firstname"
                    onChange={handleChange}
                    value={formData.firstName}
                    required 
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
                <p>Already have an account?</p>
                <span className="login-link" onClick={handleLoginLinkClick}>Login</span>
              </form>       
            </>
          )}
        </div>
      )
    }      

export default SignUp;