import React, { useState } from 'react';
import { useContext } from 'react';
import { QuizContext } from '../context/QuizContext';
import Modal from "../components/Modal";
import TestHeader from "../components/TestHeader";
import StartQuiz from '../components/StartQuiz';
import QuizQuestion from '../components/QuizQuestion';
import FeedbackCard from '../components/FeedbackCard';
import TestFooter from '../components/TestFooter';
import "../styles/Quiz.css";




const Quiz = () => {   

    const contextValue = useContext(QuizContext);

    const [showQuizStarted, setShowQuizStarted] = useState(false);
    const [quizQuestion, setQuizQuestion] = useState(null);
    const [questionCount, setQuestionCount] = useState(0);
    const [feedback, setFeedback] = useState(null);
    const [isPreviousQuestionFeedbackShown, setIsPreviousQuestionFeddbackShown] = useState(true);

        
    const handleOnStartQuizClick = () => {
        setShowQuizStarted(true);
        getFirstQuestion();
    }

    const toggleQuizStarted = () => {
        setShowQuizStarted(!showQuizStarted);
    }


   const getFirstQuestion = async() => {
        try {
            const response = await fetch("http://localhost:9090/api/v1/quizzes/quiz-start", {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    quizId: contextValue.quizDetails.id,
                    topicId: contextValue.topic.id
                })
                
            }); 
            console.log({
                quizId: contextValue.quizDetails.id,
                topicId: contextValue.topic.id
            })
            const data = await response.json();
            if(response.ok) {
                setQuizQuestion(data);
                setQuestionCount(questionCount + 1);
            }

        } catch (error) {
            console.error("Error :", error);
        }
    } ;


    const handleOnClickNext = async (selectedChoices) => {
        try {
            const response = await fetch("http://localhost:9090/api/v1/quizzes/quiz-questions", {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    quizId: contextValue.quizDetails.id,
                    questionId: quizQuestion.id,
                    answerChoices: selectedChoices
                })
                
            }); 

            const data = await response.json();

            if(response.ok) {
                setQuizQuestion(data.questionDTO);
                setFeedback(data.feedbackResponse);
                setQuestionCount(questionCount + 1);
            }

        } catch (error) {
            console.error("Error :", error);
        }
    }

    /*
        (1, 'IMMEDIATE_RESPONSE'),
        (2, 'IMMEDIATE_CORRECT_ANSWER_RESPONSE'),
        (3, 'IMMEDIATE_ELABORATED'),
        (4, 'DELAYED_RESPONSE'),
        (5, 'DELAYED_CORRECT_ANSWER_RESPONSE'),
        (6, 'DELAYED_ELABORATED');
    */

    return (
        <div className = "test-page">
            <TestHeader />
            <div className="quiz-area">
                
            {showQuizStarted && quizQuestion ? 
                <div>
                    <div className="question-number">{questionCount}/{contextValue.topic.numberOfQuestions}</div>
                    <QuizQuestion 
                    id={quizQuestion.id} 
                    text={quizQuestion.text} 
                    score={quizQuestion.score}
                    type={quizQuestion.questionType}
                    choices={quizQuestion.choices} 
                    onClickNext={handleOnClickNext}                  
                    /> 
                </div>
                : 
                <Modal className={showQuizStarted ? '' : 'visible'} show={showQuizStarted}>
                    <StartQuiz onStartQuizClick ={handleOnStartQuizClick}/>
                </Modal> 
            }

            {feedback !== null && 
                <FeedbackCard result ={feedback.result} 
                correctAnswer={feedback.correctAnswer} 
                explanation={feedback.explanation} 
            />}
            

            </div>
            <TestFooter />
        </div>   
    )

}

export default Quiz;

