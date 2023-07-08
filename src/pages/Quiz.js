import React, { useState } from 'react';
import Modal from "../components/Modal";
import TestHeader from "../components/TestHeader";
import StartQuiz from '../components/StartQuiz';
import QuizQuestion from '../components/QuizQuestion';
import TestFooter from '../components/TestFooter';
import "../styles/Quiz.css";




const Quiz = () => {   

    const [quizStarted, setQuizStarted] = useState(false);

    const startQuiz = () => {
        setQuizStarted(true);     
    }

    const [quizQuestion, setQuizQuestion] = useState(
        {
            id: 1,
            text: "What is an in-place sorting algorithm?",
            score: 2.0,
            questionType: "Multiple Choice",
            questionDifficultyLevel: "Medium",
            choices: [
                {
                    id : 1,
                    text : "An algorithm that sorts the data directly within its original storage without needing to copy it to a temporary location"
                },
                {
                     id: 2,
                     text: "An algorithm that requires additional space to sort data"
                },
                {
                     id: 3,
                     text: "An algorithm that cannot handle large datasets"
                }
            ]
        }
    );

    

    return (
        <div className = "test-page">
            <TestHeader />
            <div className="quiz-area">
                <QuizQuestion 
                    id={quizQuestion.id} 
                    text={quizQuestion.text} 
                    score={quizQuestion.score}
                    type={quizQuestion.questionType}
                    choices={quizQuestion.choices}                   
                />
            </div>
            <TestFooter />
        </div>   
    )

}

export default Quiz;


/*<div className="quiz-area">
        {quizStarted ? 
        <QuizQuestion /> : 
        <div>
            <Modal show={startQuiz}><StartQuiz onClick ={startQuiz}/></Modal> 
        </div>
        }
        </div> */