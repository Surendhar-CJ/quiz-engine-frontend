import React, { useState } from 'react';
import { useEffect } from 'react';
import "../styles/QuizQuestion.css";


const QuizQuestion = (props) => {
    const [question, setQuestion] = useState(props);
    const [selectedChoices, setSelectedChoices] = useState([]);

     // useEffect to update question state whenever props change
     useEffect(() => {
        setQuestion(props);
    }, [props]);

    const handleChoiceChange = (choice) => {
        setSelectedChoices([choice]);
    }

    const choices = question.choices.map(choice =>  {
        if(question.type === "Multiple Choice") {
            return (
                <div key={choice.id}>  
                    <input
                        type="radio"
                        id={choice.id}   
                        value={choice.text}  
                        name="choice"
                        onChange={() => handleChoiceChange(choice)}
                    />
                    <label htmlFor={choice.id}>{choice.text}</label> 
                </div>
            )
        }
    })

    const handleNextClick = () => {
        props.onClickNext(selectedChoices);
    }

    return (
        <div className="quiz-question"> 
            <div className="question">
                <p>{question.text}</p>
                {choices}
            </div>
            <button onClick={handleNextClick}>Next</button>
        </div>
    )
}


export default QuizQuestion;