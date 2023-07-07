import React, { useState } from 'react';
import "../styles/SignUp.css";



const SignUp = () => {

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




    return (
        <div className = "signup-card">
            <h2>Sign Up</h2>
            <form className="signup-form">
                <input  
                    type="text" 
                    name="firstname" 
                    placeholder="Firstname"
                    onChange={handleChange}
                    value={formData.firstName} 
                />
                <input 
                    type="text" 
                    name="lastname" 
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
                <p>Already have an account?</p>
                <span>Login</span>
            </form>       
        </div>
    )
}

export default SignUp;