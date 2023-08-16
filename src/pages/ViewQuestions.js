import { useContext } from 'react';
import { QuizContext } from '../context/QuizContext';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { baseURL } from '../config.js';
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import {useErrorHandler} from "../hooks/useErrorHandler";
import Modal from "../components/Modal";
import CreateQuiz from '../components/CreateQuiz.js';
import QuizConfiguration from '../components/QuizConfiguration.js';
import '../styles/ViewQuestions.css';

const ViewQuestions = () => {
    const [showCreateQuiz, setShowCreateQuiz] = useState(false);
    const [showQuizConfig, setShowQuizConfig] = useState(false);
    const [sessionExpired, setSessionExpired] = useState(false);
    const [questionsList, setQuestionsList] = useState();
    const [topic, setTopic] = useState(null);
    const [topicId, setTopicId] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();
    const contextValue = useContext(QuizContext);
    const handleError = useErrorHandler();

    const handleCreateQuizClick = () => {
        setShowCreateQuiz(true);
     }
  
     const toggleShowCreateQuiz = () => {
        setShowCreateQuiz(!showCreateQuiz);
     }
        
    const handleHomeClick = () => {
        navigate('/home');
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

    const handleAddQuestionClick = () => {
        navigate('/add-question', { state: { from: '/view-questions' } });
    }

    const handleQuizConfigClick = () => {
        toggleQuizConfig();
    }

    const toggleQuizConfig = () => {
        setShowQuizConfig(!showQuizConfig);
    }

    const Question = ({ question }) => {
        return (
            <div className="user-question-list">
                <p className="user-question-for-topic">{question.topicName}</p>
                <h4>Question</h4>
                <p className="user-question-text">{question.text}</p>
                <h4>Choices</h4>
                {
                    question.choices && question.choices.map((choice, choiceIndex) => (
                        <p key={choiceIndex} className="user-question-choice">Choice {choiceIndex + 1}: {choice.text}</p>
                    ))
                }
            </div>
        )
    }
    


    const getQuestions = async (topicId) => {
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${baseURL}/api/v1/questions/${topicId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`, // include token in headers
                },
            });

            if(response.status === 403) {
               setSessionExpired(true);
            }

            const data = await response.json();

            if(response.status === 200) {
                setQuestionsList(data);
                   
            } else {
                // If HTTP status code is not a success status (2xx), consider it an error
                const error = await response.json();
                throw new Error(error.message);
            }
            
        } catch(error) {
            handleError(error); // call the returned function with the error
        }
    }

    React.useEffect(() => {
        const storedTopic = JSON.parse(window.localStorage.getItem('topic'));
        if(storedTopic) {
            getQuestions(storedTopic.id);
            contextValue.setTopic(storedTopic);
            setTopic(storedTopic);
        }  
    }, [])


    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);


    return (
        <>
        {showCreateQuiz &&
                    <Modal
                        show={showCreateQuiz}
                        onClose={toggleShowCreateQuiz}
                        className={showCreateQuiz ? 'visible' : ''}
                    >
                        <CreateQuiz userId={contextValue.user.id}/>
                    </Modal> 
        } 

        {topic && showQuizConfig && 
              <Modal 
                    show={showQuizConfig} 
                    onClose={toggleQuizConfig}
                    className={showQuizConfig ? 'visible' : ''}
                >
                    {showQuizConfig && <QuizConfiguration topicId={topic.id}  />}
                </Modal>
        }

        <div className="view-questions">
             <Header options={[{ label: 'Create+', action: handleCreateQuizClick }, { label: 'Home', action: handleHomeClick }, { label: 'Profile', action: handleProfileClick }, {label: 'Logout', action: handleLogoutClick}]}  />
             <div className="view-questions-content">
                    {topic && 
                        <div className="topic-details">
                            <p className="topic-details-name">{topic.name}</p>
                            <p className="topic-details-count">Questions: {topic.numberOfQuestions}</p>
                        </div>
                    }

                    <div className="view-questions-buttons">
                        <div className="add-question-new">
                                <button type="submit" className="add-question-intro" onClick={handleAddQuestionClick}>Add Question</button>
                        </div>
                        <div className="take-quiz-new">
                                <button type="submit" className="take-quiz-new-button" onClick={handleQuizConfigClick}>Take Quiz</button>
                        </div>
                    </div>
                {
                    questionsList && questionsList.map((question, index) => (
                        <Question key={index} question={question} />
                    ))
                }
            </div>

        </div>
    </>
    )

}

export default ViewQuestions;