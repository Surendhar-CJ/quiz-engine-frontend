import React, { useState } from 'react';
import { baseURL } from '../config.js';
import { useNavigate } from "react-router-dom";
import { useContext } from 'react';
import { QuizContext } from '../context/QuizContext.js';
import { useErrorHandler } from '../hooks/useErrorHandler';
import '../styles/CreateQuiz.css';

const CreateQuiz = (props) => {

    const navigate = useNavigate();
    const contextValue = useContext(QuizContext);
    const handleError = useErrorHandler();

    const [formData, setFormData] = useState({
        topicName: '',
        userId: props.userId,
    });

    const handleChange = (event) => { 
        setFormData((prevFormData) => ({
            ...prevFormData,
            [event.target.name]: event.target.value,
        }));
    }

    const submitClick = async (event) => {
        event.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${baseURL}/api/v1/topics/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData)
            });
            
            if(response.status == 201) {
                const data = await response.json();
                contextValue.setAvailableTopics(data);
                localStorage.setItem('topics', JSON.stringify(data));
                navigate('/add-question');
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
    }

    return (
        <div className="create-quiz-modal">
            <h2 className="create-quiz-modal-title">Quiz Topic</h2>
            <form className="create-quiz-form" onSubmit={submitClick}>
                <input 
                    type="text" 
                    value={formData.topicName} 
                    onChange={handleChange} 
                    placeholder="Enter topic" 
                    name="topicName" 
                    required
                />
                <button className="create-quiz-button" type="submit">Create</button>
            </form>
        </div>
    )
}

export default CreateQuiz;
