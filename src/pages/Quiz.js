import React, { useState } from 'react';
import { useContext } from 'react';
import { QuizContext } from '../context/QuizContext';
import { useNavigate } from "react-router-dom";
import { baseURL } from '../config.js';
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
    const navigate = useNavigate();


    const [showQuizStarted, setShowQuizStarted] = useState(false);
    const [quizQuestion, setQuizQuestion] = useState(null);
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [questionCount, setQuestionCount] = useState(0);
    const [feedback, setFeedback] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isAllQuestionsReceived, setIsAllQuestionsReceived] = useState(false);
    const [showSubmitQuiz, setShowSubmitQuiz] = useState(false);
    const [hasQuizBeenSubmitted, setHasQuizBeenSubmitted] = useState(false);
    const [showExitConfirmation, setShowExitConfirmation] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [sessionExpired, setSessionExpired] = useState(false);

    React.useEffect(() => {
        const storedQuizDetails = JSON.parse(localStorage.getItem('quizDetails'));
        const storedTopic = JSON.parse(localStorage.getItem('topic'));

        if(contextValue.quizDetails === null && storedQuizDetails) {
            contextValue.setQuizDetails(storedQuizDetails);
        }

        if(contextValue.topic === null && storedTopic) {
            contextValue.setTopic(storedTopic);
        }
        setIsLoading(false);
    }, [])



        
    const handleOnStartQuizClick = () => {
        setShowQuizStarted(true);
        const storedFirstQuestion = JSON.parse(window.localStorage.getItem('firstQuestion'));
        if(!storedFirstQuestion) {
            getFirstQuestion();
        } else {
            setQuizQuestion(storedFirstQuestion);
        }
    }

    const toggleQuizStarted = () => {
        setShowQuizStarted(!showQuizStarted);
    }

    const toggleShowSubmitQuiz = () => {
        const feedback = contextValue.quizDetails.feedbackType.type;
        if(feedback.toLowerCase() === "immediate response" || feedback.toLowerCase() === "immediate correct answer response" || feedback.toLowerCase() === "immediate elaborated") {
            return;
        }
        setShowSubmitQuiz(!showSubmitQuiz);
    }

    

    


   const getFirstQuestion = async() => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${baseURL}/api/v1/quizzes/quiz-start`, {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    quizId: contextValue.quizDetails.id,
                    topicId: contextValue.topic.id
                })
                
            }); 

            if(response.status === 403) {
                setSessionExpired(true);
            }
            
            const data = await response.json();
            if(response.ok) {
                setQuizQuestion(data);
                setQuestionCount(questionCount + 1);
                localStorage.setItem('firstQuestion', JSON.stringify(data));
            }

        } catch (error) {
            console.error("Error :", error);
        }
    } ;

    const handleOnClickSubmitAnswer = async (selectedChoices) => {
      // event.preventDefault();
        try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${baseURL}/api/v1/quizzes/submit-answer`, {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    quizId: contextValue.quizDetails.id,
                    questionId: quizQuestion.id,
                    sequenceNumber: questionCount - 1,
                    answerChoices: selectedChoices
                })
                
            }); 

            if(response.status === 403) {
                setSessionExpired(true);
            } else {
                const feedback = await response.json();
                
                if(response.ok) {
                    setQuizQuestion(prevState => ({...prevState, userAnswer: selectedChoices}));
                    setFeedback(feedback);
                    setShowFeedback(true);
                }
            }

        } catch(error) {
            console.log("Error :", error);
        }
    }

    const handleOnClickNext = async (selectedChoices) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${baseURL}/api/v1/quizzes/quiz-questions`, {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json",
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({
                    quizId: contextValue.quizDetails.id,
                    questionId: quizQuestion.id,
                    sequenceNumber: questionCount - 1,
                    answerChoices: selectedChoices
                })
            }); 

        if(response.status === 403) {
            setSessionExpired(true);
        }
        else {

        const data = await response.json();
        // Ignore "No more questions available" error
        if (data.message === "No more questions available" || data.message === "Questions limit reached" || data.message === "No more questions available for the specified difficulty level") {
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
    }

    } catch (error) {
        console.error("Error :", error);
    }
}



    const isDisplayFeedback = () => {
        const quizFeedbackType = contextValue.quizDetails.feedbackType.type;
        let displayFeedback;
        
        if(quizFeedbackType === "IMMEDIATE RESPONSE" ||
            quizFeedbackType === "IMMEDIATE CORRECT ANSWER RESPONSE" || 
            quizFeedbackType ==="IMMEDIATE ELABORATED") {  
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
            const token = localStorage.getItem('token');
            const response = await fetch(`${baseURL}/api/v1/quizzes/submit-quiz/${quizId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`, 
                },
            });

            if(response.status === 403) {
                setSessionExpired(true);
            } else {
            
            if(!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                setHasQuizBeenSubmitted(true);
                if(localStorage.getItem('quizResult')) {
                    localStorage.removeItem('quizResult');
                }
            }
        }
        } catch(error) {
            console.error('An error occurred while submitting the quiz:', error);
        }
    }
    
    React.useEffect(() => {
        if(hasQuizBeenSubmitted == true) {
            navigate('/result', { state: { fromQuiz: true } });
        }
    }, [hasQuizBeenSubmitted == true]);



    const handleOnExitQuizClick = () => {
        setShowExitConfirmation(true);
    }

    const toggleExitConfirmation = () => {
        setShowExitConfirmation(!showExitConfirmation);
    }

    const confirmExit = () => {
        navigate('/home');
    }

    const numberOfQuestions = () => {

       let numberOfQuestions;

       if(contextValue.quizDetails.questionsLimit !== null) {
            numberOfQuestions = contextValue.quizDetails.questionsLimit
       }
        else if( contextValue.quizDetails.difficultyLevel !== null &&  contextValue.quizDetails.questionsLimit === null) {
            switch(contextValue.quizDetails.difficultyLevel.toLowerCase()) {
                case "easy":
                    numberOfQuestions = contextValue.topic.easyQuestionsAvailable;
                    break;
                case "medium":
                    numberOfQuestions = contextValue.topic.mediumQuestionsAvailable;
                    break;
                case "hard":
                    numberOfQuestions = contextValue.topic.hardQuestionsAvailable;
                    break;
            }
       }
       else {
            numberOfQuestions = contextValue.topic.numberOfQuestions;
      }

        return numberOfQuestions;
    }

    React.useEffect(() => {
        if (sessionExpired) {
          setTimeout(() => {
            // Clear context
            contextValue.resetContext();
            // Clear local storage
            localStorage.clear();
            // Navigate to the login page
            navigate('/');
          }, 5000);
        }
    }, [sessionExpired]);

    
    {if (isLoading) {
        return <div>Loading...</div>;
    }}

    return (
        <>
        {
            sessionExpired &&
            <Modal id="session-expired-modal" onClose={() => {}} className={sessionExpired ? 'visible' : ''}>
                <h2 className="session-expired-title">Session Expired</h2>
                <p className="session-expired-message-content">Your session has expired. You will be redirected to the home page, please log in again to continue.</p>
            </Modal>
        }
        
        {<div className = "test-page">
            <TestHeader onExitQuizClick={handleOnExitQuizClick} />
            <div className="quiz-area">
            { showExitConfirmation &&
            <Modal
                className={showExitConfirmation ? 'visible' : ''}
                show={showExitConfirmation}
                onClose={toggleExitConfirmation}>
                <div>
                    <p>Are you sure you want to exit the quiz?</p>
                    <div className="exit-buttons">
                        <button className="exit-button-confirmation" onClick={confirmExit}>Exit</button>
                        <button className="exit-no-button-confirmation" onClick={toggleExitConfirmation}>No</button>
                    </div>
                </div>
            </Modal> 
            }
            {showQuizStarted && quizQuestion ? 
                <div className="quiz-question-area">
                    <div className="question-number">{questionCount} / {numberOfQuestions()}</div>
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
               { hasQuizBeenSubmitted ? 
                    <div>Quiz has been submitted successfully</div>
                        :
                    <SubmitQuiz quizDetails={contextValue.quizDetails} onSubmitQuizClick ={handleOnSubmitQuizClick}/> 
                }
            </Modal> }
            

            </div>
            <TestFooter />
        </div>   }
        </>
    )

}

export default Quiz;

