
import React, { useState } from 'react';
import { useContext } from 'react';
import { QuizContext } from '../context/QuizContext.js';
import { useNavigate } from "react-router-dom";
import { baseURL } from '../config.js';
import Header from '../components/Header.js';
import Topic from '../components/Topic.js';
import Footer from '../components/Footer.js';
import "../styles/Home.css";
import QuizConfiguration from '../components/QuizConfiguration.js';
import CreateQuiz from '../components/CreateQuiz.js';
import { useErrorHandler } from '../hooks/useErrorHandler';
import Modal from '../components/Modal';

const Home = () => {
    const [showQuizConfig, setShowQuizConfig] = useState(false);
    const [selectedTopicId, setSelectedTopicId] = useState(null);
    const [sessionExpired, setSessionExpired] = useState(false);
    const [showCreateQuiz, setShowCreateQuiz] = useState(false);
    const [topics, setTopics] = useState([]);
    

    const navigate = useNavigate();
    const contextValue = useContext(QuizContext);
    const handleError = useErrorHandler();

    const quizTopics = JSON.parse(localStorage.getItem('topics'));

    
    const handleHomeClick = () => {
        //rStays at the same page
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

    const handleCreateQuizClick = () => {
        setShowCreateQuiz(true);
    }

    const toggleShowCreateQuiz = () => {
        setShowCreateQuiz(!showCreateQuiz);
    }

    const handleAddQuestionClick = () => {
        navigate('/add-question');
    }
    
    const topicElements = topics.map(topic => <Topic 
        key={topic.id} 
        id={topic.id} 
        name={topic.name}
        rating={topic.rating}
        numberOfRaters={topic.numberOfRaters}
        createdBy={topic.userName}
        numberOfQuestions={topic.numberOfQuestions}
        onTopicClick={handleOnTopicClick}
      />
    )


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
           else {
            const error = await response.json();
            throw new Error(error.message);
        }
        
        } catch(error) {
            if (error.name === 'TypeError' || error.message === 'Failed to fetch') {
                handleError('An error occurred while trying to reach the server. Please try again');
            } else {
                handleError(error);
            }
        }
    };
    

    React.useEffect(() => {
        const storedUser = JSON.parse(window.localStorage.getItem('user'));
        
        if(storedUser !== null) {
            contextValue.setUser(storedUser);
        }
        
        getTopics();
        
    }, []);

   

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

    
    

    return (
        <>
        {
            sessionExpired &&
            <Modal id="session-expired-modal" onClose={() => {}} className={sessionExpired ? 'visible' : ''}>
                <h2 className="session-expired-title">Session Expired</h2>
                <p className="session-expired-message-content">Your session has expired. You will be redirected to the home page, please log in again to continue.</p>
            </Modal>
        }
        {contextValue.user &&   contextValue.availableTopics &&
        <div className="home-page">
            <Header options={[{ label: 'Home', action: handleHomeClick }, { label: 'Profile', action: handleProfileClick }, {label: 'Logout', action: handleLogoutClick}]}  />
           
            <div className="home-content">
                <h1 className="welcome">Welcome, <span className="welcome-user-name">{contextValue.user.firstName}</span>!</h1>
              
               { quizTopics.length !== 0 && <p className="ready">Ready for a quiz?</p>}
                
                {quizTopics.length !== 0 ? 
                    <p className="pick-topic-intro">Pick a topic and challenge yourself!</p>
                                :
                    <p className="add-quiz-intro">Create a quiz, challenge yourself and your peers!</p> 
                }

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

                 {showCreateQuiz &&
                    <Modal
                        show={showCreateQuiz}
                        onClose={toggleShowCreateQuiz}
                        className={showCreateQuiz ? 'visible' : ''}
                    >
                        <CreateQuiz userId={contextValue.user.id}/>
                    </Modal> 
                }
                  
                <div className="create-add">
                    <p className="add-topic-intro" onClick={handleCreateQuizClick}>Create a quiz and help your peers!</p>
                    <p className="add-question-intro" onClick={handleAddQuestionClick}>Got a question to add?</p>
                </div>
            </div>
            <Footer />
        </div> }
        </>
         
    )
}

export default Home;