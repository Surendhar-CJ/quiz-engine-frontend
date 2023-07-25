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
        if (question.type === "Multiple Choice") {
            setSelectedChoices([choice]);
        } else if (question.type === "Multiple Answer") {
            if (selectedChoices.some(selectedChoice => selectedChoice.id === choice.id)) {
                setSelectedChoices(selectedChoices.filter(selectedChoice => selectedChoice.id !== choice.id));
            } else {
                setSelectedChoices([...selectedChoices, choice]);
            }
        } else if (question.type === "True or False") {
            setSelectedChoices([choice]);
        }
    }


    const renderChoice = (inputType) => {
        return question.choices.map(choice => (
            <div className={`${inputType}-choice`} key={choice.id}>
                <input
                    type={inputType}
                    id={choice.id}
                    value={choice.text}
                    name="choice"
                    checked={selectedChoices.some(selectedChoice => selectedChoice.id === choice.id)}
                    onChange={() => handleChoiceChange(choice)}
                    disabled={hasAnswerBeenSubmitted}
                />
                <label htmlFor={choice.id} className={`${inputType}-button-choice`}>
                    <span className={`${inputType}-choice-text`}>{choice.text}</span>
                </label>
            </div>
        ));
    };
    

    const choices = () => {
        switch (question.type) {
            case "Multiple Choice":
                return renderChoice("radio");
            case "Multiple Answer":
                return renderChoice("checkbox");
            case "True or False":
                return renderChoice("radio");
            default:
                return null;
        }
    };


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
                <p className="quiz-question-text">{question.text}</p>
                {choices()}
            </div>
            <div className="quiz-question-buttons">
                {props.displayFeedback && !props.allQuestionsReceived && <button id="submit-answer-button" className={hasAnswerBeenSubmitted ? 'disabled' : ''} disabled={hasAnswerBeenSubmitted} onClick={handleSubmitAnswerClick}>Submit Answer</button>}
                {!props.displayFeedback && props.questionCount > 1 && <button id="back-button" onClick={handleBackClick}>Back</button>}
                {props.displayFeedback ? 
                    <button id="next-button" className={hasAnswerBeenSubmitted ? '' : 'disabled'} disabled={!hasAnswerBeenSubmitted} onClick={handleNextClick}>Next</button>
                    :
                    <button id="next-button" onClick={handleNextClick}>Next</button>
                }
            </div>
        </div>
    )
}


export default QuizQuestion;