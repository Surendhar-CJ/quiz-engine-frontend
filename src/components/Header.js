import React, { useState } from 'react';
import Login from "./Login.js";
import SignUp from './SignUp.js';


const title = "QUIZ ENGINE"


const Header = ({ onLoginClick, onSignUpClick }) => {
    
    return (
        <header className="header-container">
            <h1 className="title">{title}</h1>
             <div className="login-signup">
                <h3 className="login" onClick={onLoginClick}>LOG IN</h3>
                <h3 className="signup" onClick={onSignUpClick}>SIGN UP</h3>
            </div>
        </header>
    )
}

export default Header;