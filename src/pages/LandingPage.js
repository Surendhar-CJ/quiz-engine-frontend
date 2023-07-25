import React, { useState } from 'react';
import Header from "../components/Header.js";
import Main from "../components/Main.js";
import Footer from "../components/Footer.js";

import "../styles/LandingPage.css";



const LandingPage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
 
  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const toggleLogin = () => {
    setShowLogin(!showLogin);
  };

  const handleSignUpClick = () => {
    setShowSignUp(true);
  };

  const toggleSignUp = () => {
    setShowSignUp(!showSignUp);
  };


  return (
    <div className="landingPage">
      <Header options={[{ label: 'Log In', action: handleLoginClick }, { label: 'Sign Up', action: handleSignUpClick }]} />
      <Main showLogin={showLogin} toggleLogin={toggleLogin} showSignUp={showSignUp} toggleSignUp={toggleSignUp} />
      
      <Footer />
    </div>
  );
}

export default LandingPage;