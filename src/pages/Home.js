
import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import Header from '../components/Header.js';
import Topic from '../components/Topic.js';
import Footer from '../components/Footer.js';
import ProfileCard from '../components/ProfileCard.js';
import "../styles/Home.css";
import QuizConfiguration from '../components/QuizConfiguration.js';
import Modal from '../components/Modal';

const Home = () => {
    const [showProfile, setShowProfile] = useState(false);
    const [showQuizConfig, setShowQuizConfig] = useState(false);
    const [selectedTopicId, setSelectedTopicId] = useState(null);
    

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

    const [topics, setTopics] = useState([]);

    const getTopics = async() =>  {
        try {
           const response =  await fetch("http://localhost:9090/api/v1/topics");
           if(response.status === 200) {
                const data = await response.json();
                setTopics(data);
           } 
        } catch (error) {
            console.error("Error :", error);
        }
        
    };
    

    React.useEffect(() => {
        getTopics();
    }, [])

    const handleOnTopicClick = (topicId) => {
        setSelectedTopicId(topicId);
        setShowQuizConfig(true);
    }

    const toggleQuizConfig = () => {
        setShowQuizConfig(!showQuizConfig);
    }

    const topicElements = topics.map(topic => <Topic 
                                                key={topic.id} 
                                                id={topic.id} 
                                                name={topic.name} 
                                                numberOfQuestions={topic.numberOfQuestions}
                                                onTopicClick={handleOnTopicClick}
                                              />
                                            )




    return (
        <div className="home-page">
            <Header options={[{ label: 'Home', action: handleHomeClick }, { label: 'Profile', Icon: FaUser, action: handleProfileClick }, {label: 'Logout', action: handleLogoutClick}]} showProfile={showProfile} toggleProfile={toggleProfile} />
            {showProfile && <ProfileCard />}
            <div className="home-content">
                <h1>Welcome, User!</h1>
                <h2>Ready for a quiz?</h2>
                <div className="topics-list">
                    {topicElements}
                    <Modal 
                        show={showQuizConfig} 
                        onClose={toggleQuizConfig}
                        className={showQuizConfig ? 'visible' : ''}
                    >
                        {showQuizConfig && <QuizConfiguration topicId={selectedTopicId}  />}
                    </Modal>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Home;