import React, { useState } from 'react';
import { useEffect } from 'react';
import "../styles/QuizQuestion.css";


const QuizQuestion = (props) => {
    const [question, setQuestion] = useState(props);
    const [selectedChoices, setSelectedChoices] = useState(props.userAnswer || []);
    const [hasAnswerBeenSubmitted, setHasAnswerBeenSubmitted] = useState(false);

     // useEffect to update question state whenever props change
     useEffect(() => {
        setQuestion(props);
        setSelectedChoices(props.userAnswer || []);
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
                        checked={selectedChoices.some(selectedChoice => selectedChoice.id === choice.id)}
                        onChange={() => handleChoiceChange(choice)}
                    />
                    <label htmlFor={choice.id}>{choice.text}</label> 
                </div>
            )
        }
    })

    const handleSubmitAnswerClick = () => {
        props.onClickSubmitAnswer(selectedChoices);
        setHasAnswerBeenSubmitted(true);
    }

    const handleNextClick = () => {
        props.onClickNext(selectedChoices);
        setHasAnswerBeenSubmitted(false);
    }

    const handleBackClick = () => {
        props.onClickBack();
        setHasAnswerBeenSubmitted(false);
    }

    return (
        <div className="quiz-question"> 
            <div className="question">
                <p>{question.text}</p>
                {choices}
            </div>
            {props.displayFeedback && !props.allQuestionsReceived && <button onClick={handleSubmitAnswerClick}>Submit Answer</button>}
            {!props.displayFeedback && props.questionCount > 1 && <button onClick={handleBackClick}>Back</button>}
            <p>{props.questionCount+" - "+props.quizQuestions.length+" - "+ !props.allQuestionsReceived+" - "+props.displayFeedback}</p>
            {
                        props.displayFeedback ? 
                            <div><p>First</p>
                            <button id="next-button" className={hasAnswerBeenSubmitted ? '' : 'disabled'} disabled={!hasAnswerBeenSubmitted} onClick={handleNextClick}>Next</button>
                            </div>    
                            :
                        <div> 
                          <p>Second</p>     
                        <button id="next-button" onClick={handleNextClick}>Next</button>
                        </div>
                   
            }
        </div>
    )
}


export default QuizQuestion;