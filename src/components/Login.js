import React, { useState } from 'react';
import "../styles/Login.css";


const Login = () => {
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

    return (
        <div className = "login-card">
            <h2>Login</h2>
            <form className="login-form">
                <input 
                    type="text" 
                    name="username" 
                    placeholder="Username"
                    onChange={handleChange}
                    value={formData.username}
                />
                <input 
                    type="password" 
                    name="password" 
                    placeholder="Password"
                    onChange={handleChange}
                    value={formData.password} 
                />
                <button type="submit">Submit</button>
                <p>Don't have an account?</p>
                <span>Signup</span>
            </form>       
        </div>
    )
}

export default Login;