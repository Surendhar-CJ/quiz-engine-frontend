
import React, { useState } from 'react';
import {BiSolidHome} from 'react-icons/bi'
import { FaUser } from 'react-icons/fa';
import { IoLogOut } from 'react-icons/io5';
import { useContext } from 'react';
import { QuizContext } from '../context/QuizContext.js';
import { useNavigate } from "react-router-dom";
import { baseURL } from '../config.js';
import Header from '../components/Header.js';
import Topic from '../components/Topic.js';
import Footer from '../components/Footer.js';
import "../styles/Home.css";
import QuizConfiguration from '../components/QuizConfiguration.js';
import Modal from '../components/Modal';

const Home = () => {
    const [showQuizConfig, setShowQuizConfig] = useState(false);
    const [selectedTopicId, setSelectedTopicId] = useState(null);
    const contextValue = useContext(QuizContext);
    const [sessionExpired, setSessionExpired] = useState(false);

    const navigate = useNavigate();

    

    const handleHomeClick = () => {
        //redirect to Home
    }

    const handleLogoutClick = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            // Clear context
            contextValue.resetContext();
            //Clear local storage
            localStorage.clear();
            // Navigate to the login page
            navigate('/');
        }
    }

    const handleProfileClick = () => {
        navigate('/profile');
    }

    /** TOPIC */

    const [topics, setTopics] = useState([]);

    const getTopics = async() =>  {
        try {
           const token = localStorage.getItem('token');
           const response =  await fetch(`${baseURL}/api/v1/topics`, {
                headers: {
                    'Authorization': `Bearer ${token}`, // include token in headers
                },
            });


            if(response.status === 403) {
                setSessionExpired(true);
            }
            
            
           if(response.status === 200) {
                const data = await response.json();
                setTopics(data);
                contextValue.setAvailableTopics(data);
                localStorage.setItem('topics', JSON.stringify(data));
           } 
        } catch (error) {
            console.error("Error :", error);
        }
        
    };
    

    React.useEffect(() => {
        const storedUser = JSON.parse(window.localStorage.getItem('user'));
        
        if(storedUser !== null) {
            contextValue.setUser(storedUser);
        }
        
        getTopics();
        
    }, []);

   


    const handleOnTopicClick = (topicId) => {
        setSelectedTopicId(topicId);

        const selectedTopic = topics.find(topic => topic.id === topicId);
        contextValue.setTopic(selectedTopic);
        localStorage.setItem('topic', JSON.stringify(selectedTopic));
        
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



    const handleAddQuestionClick = () => {
        navigate('/add-question');
    }

    React.useEffect(() => {
        if (sessionExpired) {
          setTimeout(() => {
            // Clear context
            contextValue.resetContext();
            // Clear local storage
            localStorage.clear();
            // Navigate to the login page
            navigate('/');
          }, 5000);
        }
    }, [sessionExpired]);

    
    //Icon: BiSolidHome, Icon: FaUser, Icon: IoLogOut, 

    return (
        <>
        {
            sessionExpired &&
            <Modal id="session-expired-modal" onClose={() => {}} className={sessionExpired ? 'visible' : ''}>
                <h2 className="session-expired-title">Session Expired</h2>
                <p className="session-expired-message-content">Your session has expired. You will be redirected to the home page, please log in again to continue.</p>
            </Modal>
        }
        {contextValue.user &&   
        <div className="home-page">
            <Header options={[{ label: 'Home', action: handleHomeClick }, { label: 'Profile', action: handleProfileClick }, {label: 'Logout', action: handleLogoutClick}]}  />
           
            <div className="home-content">
                <h1>Welcome, {contextValue.user.firstName}!</h1>
                <h2>Ready for a quiz?</h2>
                <p className="pick-topic-intro">Pick a topic and challenge yourself!</p>
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
                <p className="add-question-intro">Got anything interesting to add? <span className="add-question-link" onClick={handleAddQuestionClick}>Click here</span> </p>
                
            </div>
            <Footer />
        </div> }
        </>
         
    )
}

export default Home;