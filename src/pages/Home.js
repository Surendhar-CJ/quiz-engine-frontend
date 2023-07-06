
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

    const handleLogoutClick = () => {
        //Asks a user a confirmation and logouts
    }

    const handleProfileClick = () => {
        setShowProfile(true);
    }

    const toggleProfile = () => {
        setShowProfile(!showProfile);
    }

    /** TOPIC */

    const [topics, setTopics] = useState([
        {
             id: 1,
             name: "Java",
            numberOfQuestions: 10
        },
        {
            id: 2,
            name: "Algorithms",
           numberOfQuestions: 10
       },
       {
           id: 3,
           name: "Java",
          numberOfQuestions: 10
      },
      {
        id: 4,
        name: "Java",
       numberOfQuestions: 10
   }
        
  
    ]);

    const topicElements = topics.map(topic => <Topic key={topic.id} id={topic.id} name={topic.name} numberOfQuestions={topic.numberOfQuestions}/>)




    return (
        <div className="home-page">
            <Header options={[{ label: 'Home', action: handleHomeClick }, { label: 'Profile', Icon: FaUser, action: handleProfileClick }, {label: 'Logout', action: handleLogoutClick}]} showProfile={showProfile} toggleProfile={toggleProfile} />
            {showProfile && <ProfileCard />}
            <div className="home-content">
                <h1>Welcome, User!</h1>
                <h2>Ready for a quiz?</h2>
                <div className="topics-list">
                    {topicElements}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Home;