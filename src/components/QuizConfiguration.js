import React, { useState } from 'react';
import { useContext } from 'react';
import { QuizContext } from '../context/QuizContext';
import { baseURL } from '../config.js';
import "../styles/QuizConfiguration.css";
import { async } from 'q';
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";


const QuizConfiguration = (props) => {
    const contextValue = useContext(QuizContext);
    const [sessionExpired, setSessionExpired] = useState(false);
    
    const navigate = useNavigate();
    const [quizData, setQuizData] = useState(null);

    const [feedbackTypes, setFeedbackTypes] = useState([]);
    
    const [configuration, setConfiguration] = useState(
        {
            userId: contextValue.user.id,
            topicId: props.topicId,
            feedbackId: null,
            questionsLimit: null,
            difficultyLevel: null,        
        }
    )

    const [formData, setFormData] = useState(
        {
            isLimited: false,
            questionsLimit: 1,
            feedbackType: '',
            setDifficultyLevel: false,
            difficultyLevel: ''
        }
    );


    const handleChange = (event) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;

        if (event.target.name === 'isLimited' && !value) {
            setFormData(prevFormData => ({
                ...prevFormData,
                [event.target.name]: value,
                questionsLimit: ''
            }));
        } else if (event.target.name === 'setDifficultyLevel' && !value) {
            setFormData((prevFormData) => ({
              ...prevFormData,
              [event.target.name]: value,
              difficultyLevel: ''
            }));
          } else {
            setFormData((prevFormData) => ({
              ...prevFormData,
              [event.target.name]: value
            }));
          }
    };


    const getFeedbackTypes = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${baseURL}/api/v1/quiz-configuration`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if(response.status === 403) {
                setSessionExpired(true);
            }
            
            if(response.status === 200) {
                const data = await response.json();
                setFeedbackTypes(data);
            }
        } catch (error) {
            console.error("Error :",error);
        }
    }

    React.useEffect(() => {
        getFeedbackTypes();
    }, []);


    const feedbackElements = feedbackTypes.map(feedbackType => {
        return (
            <option 
                key={feedbackType.id} 
                value={feedbackType.type}
                name={feedbackType.type.replace(/_/g, ' ')}
                >
                {feedbackType.type.replace(/_/g, ' ')}
            </option>
        )
    }) 

    const handleConfigureClick = (event) => {
        event.preventDefault();
        const selectedFeedbackType = feedbackTypes.find(feedback => feedback.type === formData.feedbackType);

        if (selectedFeedbackType) {
            setConfiguration(prevConfigState => ({
            ...prevConfigState,
            feedbackId: selectedFeedbackType.id,
            questionsLimit: formData.isLimited && formData.questionsLimit !== '' ? formData.questionsLimit : null,  // Set to null if isLimited is not checked or questionsLimit is an empty string
            difficultyLevel: formData.setDifficultyLevel && formData.difficultyLevel !== '' ? formData.difficultyLevel : null // Set to null if setDifficultyLevel is not checked or difficultyLevel is an empty string
        }));
      } else {
        console.log('No matching feedback type found.');
      }

    }

    const postConfigureQuizRequest = async () => {
        try {
            
            const token = localStorage.getItem('token');
            const response = await fetch(`${baseURL}/api/v1/quizzes`, 
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(configuration)    
            });

            if(response.status === 403) {
                setSessionExpired(true);
            }

            if(response.status === 201) {
                    const data = await response.json();
                    setQuizData(data);
                    contextValue.setQuizDetails(data); 
                    localStorage.setItem('quizDetails', JSON.stringify(data));
                    if(JSON.parse(window.localStorage.getItem('firstQuestion'))) {
                        localStorage.removeItem('firstQuestion');
                    }
                    navigate('/quiz');
            }
        }
         catch(error) {
            console.log("Error : ", error);
        }
    }

    React.useEffect(() => {
        if (configuration.feedbackId) {  // Make sure feedbackId is not null
          postConfigureQuizRequest();
        }
      }, [configuration]);  // Run this effect whenever configuration changes
      

    const calculateMaxQuestions = () => {
        if (!formData.setDifficultyLevel || !formData.difficultyLevel) {
            if (!contextValue.topic) {
                throw new Error('Topic is not selected or not defined.');
            }
            return contextValue.topic.numberOfQuestions;
        }
    
        switch (formData.difficultyLevel) {
            case "easy":
                return contextValue.topic.easyQuestionsAvailable;
            case "medium":
                return contextValue.topic.mediumQuestionsAvailable;
            case "hard":
                return contextValue.topic.hardQuestionsAvailable;
            default:
                return contextValue.topic.numberOfQuestions;
        }
    };


    const getAvailableDifficultyLevels = () => {
        const availableLevels = [];
    
        if (contextValue.topic.easyQuestionsAvailable > 0) {
            availableLevels.push('easy');
        }
        
        if (contextValue.topic.mediumQuestionsAvailable > 0) {
            availableLevels.push('medium');
        }
    
        if (contextValue.topic.hardQuestionsAvailable > 0) {
            availableLevels.push('hard');
        }
    
        return availableLevels;
    };

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

        {<div className="quiz-configure-card">
            <h2>Quiz Settings</h2>
            <h3>{contextValue.topic.name}</h3>
            <form className="quiz-configure-form">

                <div className="set-difficulty-checkbox">
                    <label htmlFor="setDifficultyLevel">Set difficulty level</label>
                    <input
                    type="checkbox"
                    id="setDifficultyLevel"
                    checked={formData.setDifficultyLevel}
                    onChange={handleChange}
                    name="setDifficultyLevel"
                    />
                </div>

                {formData.setDifficultyLevel && (
                    <div className="difficulty-level">
                    <label htmlFor="difficultyLevel">Difficulty Level</label>
                    <select
                        id="difficultyLevel"
                        value={formData.difficultyLevel}
                        onChange={handleChange}
                        name="difficultyLevel"
                    >
                        <option value="">--Select--</option>
                        {getAvailableDifficultyLevels().map(level => (
                        <option value={level} key={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
                        ))}
                    </select>
                    </div>
                )}


                <div className="set-questions-checkbox">
                    <label htmlFor="isLimited">Set questions limit</label>
                    <input 
                        type="checkbox"
                        id="isLimited"
                        checked={formData.isLimited}
                        onChange={handleChange}
                        name="isLimited"
                    />
                </div>

                
                {formData.isLimited && (
                    <div className="questions-limit">
                        <label htmlFor="questionsLimit">
                        Questions: (Max {calculateMaxQuestions()})
                        </label>
                        <input 
                        type="number"
                        id="questionsLimit"
                        min="1"
                        max={calculateMaxQuestions()}
                        value={formData.questionsLimit}
                        onChange={handleChange}
                        name="questionsLimit"
                         />
                    </div>
                )}
              

                <div className="feedback-type">
                    <label htmlFor="feedbackType">Feedback type</label>
                    <select
                        id="feedbackType"
                        value={formData.feedbackType}
                        onChange={handleChange}
                        name="feedbackType"
                        required
                    >
                        <option value="">--Select--</option>
                        {feedbackElements}
                    </select>
                </div>

                
                <div className="configure-button">
                    <button type="submit" onClick={handleConfigureClick}>Configure</button>
                </div>        
            </form>
        </div>}
        </>
    )  
} 

export default QuizConfiguration;