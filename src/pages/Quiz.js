import React, { useState } from 'react';
import { useContext } from 'react';
import { QuizContext } from '../context/QuizContext';
import Modal from "../components/Modal";
import TestHeader from "../components/TestHeader";
import StartQuiz from '../components/StartQuiz';
import QuizQuestion from '../components/QuizQuestion';
import FeedbackCard from '../components/FeedbackCard';
import SubmitQuiz from '../components/SubmitQuiz';
import TestFooter from '../components/TestFooter';
import "../styles/Quiz.css";




const Quiz = () => {   

    const contextValue = useContext(QuizContext);

    const [showQuizStarted, setShowQuizStarted] = useState(false);
    const [quizQuestion, setQuizQuestion] = useState(null);
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [questionCount, setQuestionCount] = useState(0);
    const [feedback, setFeedback] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isAllQuestionsReceived, setIsAllQuestionsReceived] = useState(false);
    const [showSubmitQuiz, setShowSubmitQuiz] = useState(false);
    

        
    const handleOnStartQuizClick = () => {
        setShowQuizStarted(true);
        getFirstQuestion();
    }

    const toggleQuizStarted = () => {
        setShowQuizStarted(!showQuizStarted);
    }

    const toggleShowSubmitQuiz = () => {
        setShowSubmitQuiz(!showSubmitQuiz);
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
            
            const data = await response.json();
            if(response.ok) {
                setQuizQuestion(data);
                setQuestionCount(questionCount + 1);
            }

        } catch (error) {
            console.error("Error :", error);
        }
    } ;

    const handleOnClickSubmitAnswer = async (selectedChoices) => {
        try {
            const response = await fetch("http://localhost:9090/api/v1/quizzes/submit-answer", {
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

            const feedback = await response.json();
            
            if(response.ok) {
                setFeedback(feedback);
                setShowFeedback(true);
            }

    } catch(error) {
        console.log("Error :", error);
    }
}

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
                sequenceNumber: questionCount - 1,
                answerChoices: selectedChoices
            })
        }); 

        const data = await response.json();
        // Ignore "No more questions available" error
        if (data.message === "No more questions available") {
            setIsAllQuestionsReceived(true);
            setShowSubmitQuiz(true);
            return;
        }

        if(response.ok) {
            if(questionCount === contextValue.topic.numberOfQuestions) {
                setIsAllQuestionsReceived(true);
                setShowSubmitQuiz(true);
            } else {
                // Update the quizQuestions with the selectedChoices
                const updatedCurrentQuestion = { ...quizQuestion, userAnswer: selectedChoices };

                setQuizQuestions(prevQuestions => {
                    const index = questionCount - 1; // get current index
                    const newQuizQuestions = [...prevQuestions];
                    newQuizQuestions[index] = updatedCurrentQuestion; // replace question at current index
                    return newQuizQuestions;
                });

                setQuizQuestion(data);
                setShowFeedback(false);
                setQuestionCount(questionCount + 1);
            }
        }

    } catch (error) {
        console.error("Error :", error);
    }
}



    const isDisplayFeedback = () => {
        const quizFeedbackType = contextValue.quizDetails.feedbackType.type;
        let displayFeedback;
        
        if(quizFeedbackType === "IMMEDIATE_RESPONSE" ||
            quizFeedbackType === "IMMEDIATE_CORRECT_ANSWER_RESPONSE" || 
            quizFeedbackType ==="IMMEDIATE_ELABORATED") {  
            displayFeedback = true;
        } else {
            displayFeedback = false;
        }

        return displayFeedback;
    }


    const handleOnClickBack = () => {
         // subtract one from the question count
         setQuestionCount(prevCount => {
            let newCount = prevCount - 1;
            
            // set the current question to be the previous question in the quizQuestions array
            if(newCount > 0) {
                setQuizQuestion(quizQuestions[newCount - 1]);
            }
    
            return newCount;
        });
       
    }

    const handleOnSubmitQuizClick = async () => {
        const quizId = contextValue.quizDetails.id;
        try {
            const response = await fetch(`http://localhost:9090/api/v1/quizzes/quiz-finish/${quizId}`);
            
            if(!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                const data = await response.json();
                console.log(data);
            }
        } catch(error) {
            console.error('An error occurred while submitting the quiz:', error);
        }
    }
    
    return (
        <div className = "test-page">
            <TestHeader />
            <div className="quiz-area">
                
            {showQuizStarted && quizQuestion ? 
                <div>
                    <div className="question-number">{questionCount}/{contextValue.topic.numberOfQuestions}</div>
                    <QuizQuestion 
                    userAnswer={quizQuestion.userAnswer || []}
                    id={quizQuestion.id} 
                    text={quizQuestion.text} 
                    score={quizQuestion.score}
                    type={quizQuestion.questionType}
                    choices={quizQuestion.choices} 
                    questionCount={questionCount}
                    quizQuestions={quizQuestions}
                    displayFeedback={isDisplayFeedback()}
                    allQuestionsReceived={isAllQuestionsReceived}
                    onClickSubmitAnswer={handleOnClickSubmitAnswer}
                    onClickBack={handleOnClickBack}
                    onClickNext={handleOnClickNext}
                    onClickSubmitQuiz={handleOnSubmitQuizClick}                  
                    /> 
                </div>
                : 
                <Modal className={showQuizStarted ? '' : 'visible'} show={showQuizStarted}>
                    <StartQuiz onStartQuizClick ={handleOnStartQuizClick}/>
                </Modal> 
            }   
            {isDisplayFeedback() && showFeedback &&
                <FeedbackCard result ={feedback.result} 
                correctAnswer={feedback.correctAnswer} 
                explanation={feedback.explanation} 
            />}
            { showSubmitQuiz && <Modal className={showSubmitQuiz ? 'visible' : ''} show={showSubmitQuiz} onClose={toggleShowSubmitQuiz}>
                <SubmitQuiz onSubmitQuizClick ={handleOnSubmitQuizClick}/>
            </Modal> }
            

            </div>
            <TestFooter />
        </div>   
    )

}

export default Quiz;

