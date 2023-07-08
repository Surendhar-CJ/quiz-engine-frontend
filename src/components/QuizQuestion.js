import React, { useState } from 'react';
import "../styles/QuizQuestion.css";


const QuizQuestion = (props) => {
    const [question, setQuestion] = useState(props);

    const choices = question.choices.map(choice =>  {
        if(question.type === "Multiple Choice") {
            return (
                <div key={choice.id}>  
                    <input
                        type="radio"
                        id={choice.id}   
                        value={choice.text}  
                        name="choice"
                    />
                    <label htmlFor={choice.id}>{choice.text}</label> 
                </div>
            )
        }
    })

    return (
        <div className="quiz-question"> 
            <div className="question">
                <p>{question.text}</p>
                {choices}
            </div>
            <button>Next</button>
        </div>
    )
}


export default QuizQuestion;