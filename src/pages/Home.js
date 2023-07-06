
import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import Header from '../components/Header.js';
import Topic from '../components/Topic.js';
import Footer from '../components/Footer.js';
import ProfileCard from '../components/ProfileCard.js';
import "../styles/Home.css";

const Home = () => {

    const [showProfile, setShowProfile] = useState(false);

    const handleHomeClick = () => {
        //redirect to Home
    }

    const handleProfileClick = () => {
        setShowProfile(true);
    }

    const toggleProfile = () => {
        setShowProfile(!showProfile);
    }


    return (
        <div className="home-page">
            <Header options={[{ label: 'Home', action: handleHomeClick }, { label: 'Profile', Icon: FaUser, action: handleProfileClick }]} showProfile={showProfile} toggleProfile={toggleProfile} />
            {showProfile && <ProfileCard />}
            <Topic />
            <Footer />
        </div>
    )
}

export default Home;