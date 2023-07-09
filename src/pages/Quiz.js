import React, { useState } from 'react';
import { useContext } from 'react';
import { QuizContext } from '../context/QuizContext';
import Modal from "../components/Modal";
import TestHeader from "../components/TestHeader";
import StartQuiz from '../components/StartQuiz';
import QuizQuestion from '../components/QuizQuestion';
import TestFooter from '../components/TestFooter';
import "../styles/Quiz.css";




const Quiz = () => {   

    const contextValue = useContext(QuizContext);

    const [showQuizStarted, setShowQuizStarted] = useState(false);
    const [quizQuestion, setQuizQuestion] = useState(null);

        
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
                console.log(data);
            }

        } catch (error) {
            console.error("Error :", error);
        }
    } ;


    const getQuestion = async() => {
        try {
            const response = await fetch("http://localhost:9090/api/v1/quizzes/quiz-questions", {
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
                console.log(data);
            }

        } catch (error) {
            console.error("Error :", error);
        }

    };

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
                console.log(data.questionDTO);
            }

        } catch (error) {
            console.error("Error :", error);
        }
    }



    return (
        <div className = "test-page">
            <TestHeader />
            <div className="quiz-area">
            {showQuizStarted && quizQuestion? 
                <QuizQuestion 
                id={quizQuestion.id} 
                text={quizQuestion.text} 
                score={quizQuestion.score}
                type={quizQuestion.questionType}
                choices={quizQuestion.choices} 
                onClickNext={handleOnClickNext}                  
                /> 
                : 
                <Modal className={showQuizStarted ? '' : 'visible'} show={showQuizStarted}>
                    <StartQuiz onStartQuizClick ={handleOnStartQuizClick}/>
                </Modal> 
            }
            </div>
            <TestFooter />
        </div>   
    )

}

export default Quiz;

