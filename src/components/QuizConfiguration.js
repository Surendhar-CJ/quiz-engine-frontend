import React, { useState } from 'react';
import { useContext } from 'react';
import { QuizContext } from '../context/QuizContext';
import "../styles/QuizConfiguration.css";
import { async } from 'q';
import { useNavigate } from "react-router-dom";


const QuizConfiguration = (props) => {
    const contextValue = useContext(QuizContext);
    const setQuizDetails = contextValue.setQuizDetails;
    
    const navigate = useNavigate();
    const [quizData, setQuizData] = useState(null);

    const [feedbackTypes, setFeedbackTypes] = useState([]);
    
    const [configuration, setConfiguration] = useState(
        {
            userId: 1, //contextValue.user.user.id,
            topicId: props.topicId,
            feedbackId: null        
        }
    )

    const [formData, setFormData] = useState(
        {
            isLimited: false,
            questionsLimit: 1,
            feedbackType: ''
        }
    );


    const handleChange = (event) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        setFormData({
            ...formData,
            [event.target.name]: value
        });

        
    }

    const getFeedbackTypes = async () => {
        try {
            const response = await fetch("http://localhost:9090/api/v1/quiz-configuration");
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
            feedbackId: selectedFeedbackType.id
        }
        
        ));
        } else {
            console.log('No matching feedback type found.');
        }

    }

    const postConfigureQuizRequest = async () => {
        try {
            const response = await fetch("http://localhost:9090/api/v1/quizzes", 
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(configuration)
                
            });

            if(response.status === 201) {
                    const data = await response.json();
                    setQuizData(data);
                    setQuizDetails(data);  
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
      




    return (
        <div className="quiz-configure-card">
            <h2>Quiz Settings</h2>
            <h3>{contextValue.topic.name}</h3>
            <form className="quiz-configure-form">
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

                <div className="questions-limit">
                    {formData.isLimited && (
                        <div>
                            <label htmlFor="questionsLimit">Questions: (Max  {contextValue.topic.numberOfQuestions})</label>
                            <input 
                                type="number"
                                id="questionsLimit"
                                min="1"
                                max={contextValue.topic.numberOfQuestions}
                                value={formData.questionsLimit}
                                onChange={handleChange}
                                name="questionsLimit"
                            />
                        </div>
                    )}
                </div>

                <div className="feedback-type">
                    <label htmlFor="feedbackType">Feedback Type</label>
                    <select
                        id="feedbackType"
                        value={formData.feedbackType}
                        onChange={handleChange}
                        name="feedbackType"
                    >
                        <option value=""> --Select--</option>
                        {feedbackElements}
                    </select>
                </div>
                <div className="configure-button">
                    <button type="submit" onClick={handleConfigureClick}>Configure</button>
                </div>        
            </form>
        </div>
    )  
} 

export default QuizConfiguration;