import React, { useState } from 'react';
import "../styles/QuizConfiguration.css";

const QuizConfiguration = () => {

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


    return (
        <div className="quiz-configure-card">
            <h2>Configure Quiz</h2>
            <h2>Quiz Topic</h2>
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
                            <label htmlFor="questionsLimit">Questions: Max 10</label>
                            <input 
                                type="number"
                                id="questionsLimit"
                                min="1"
                                max="10"
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
                        <option value="">--Feedback Type --</option>
                        <option value="type1">Type 1</option>
                        <option value="type2">Type 2</option>
                    </select>
                </div>
                
                <button type="submit">Configure</button>
            </form>
        </div>
    )  
} 

export default QuizConfiguration;