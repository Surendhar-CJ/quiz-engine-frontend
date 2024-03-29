import { useContext } from 'react';
import { QuizContext } from '../context/QuizContext';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import QuizSummary from '../components/QuizSummary';
import CreateQuiz from '../components/CreateQuiz.js';
import Modal from '../components/Modal';
import '../styles/QuizDetailedResults.css';

const QuizDetailedResults = () => {
    const contextValue = useContext(QuizContext);
    const quizResult = JSON.parse(localStorage.getItem('quizResult'));
    const navigate = useNavigate();
    const location = useLocation();
    const [showCreateQuiz, setShowCreateQuiz] = useState(false);

    const handleCreateQuizClick = () => {
        setShowCreateQuiz(true);
     }
  
     const toggleShowCreateQuiz = () => {
        setShowCreateQuiz(!showCreateQuiz);
     }
        
    const handleHomeClick = () => {
        navigate('/home');
    }

    const handleLogoutClick = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            // Clear context
            contextValue.resetContext();
            //Clear local storage
            localStorage.clear();
            // Navigate to the login page
            navigate('/');
        }
    }

    const handleProfileClick = () => {
       navigate('/profile');
    }


    const calculateScore = (userChoicesSet, correctAnswersSet) => {
        let intersection = new Set([...userChoicesSet].filter(x => correctAnswersSet.has(x)));
    
        if (intersection.size === correctAnswersSet.size && intersection.size === userChoicesSet.size) {
          return 'correct-answer';
        } else if (intersection.size > 0) {
          return 'partially-correct-answer';
        } else {
          return 'incorrect-answer';
        }
    }
    
    const getAllAnswers = () => {
        const questions = quizResult.questions;
        const correctAnswers = quizResult.correctAnswerChoices;
        const userChoices = quizResult.userAnswerChoices;
        const explanation = quizResult.answerExplanation;

    
        let allAnswerRows = [];
    
        for(let i = 0; i < questions.length; i++) {
            let id = questions[i].id.toString();
    
            let userChoicesSet = new Set(userChoices[id].map(choice => choice.id));
            let correctAnswersSet = new Set(correctAnswers[id].map(choice => choice.id));
    
            let userChoicesText = userChoices[id].map(choice => choice.text).join(", ");
            let correctAnswersText = correctAnswers[id].map(choice => choice.text).join(", ");
    
            let score = calculateScore(userChoicesSet, correctAnswersSet);
    
            allAnswerRows.push(
                <tr key={id} className={score}>
                    <td>{i+1}</td>
                    <td>{questions[i].text}</td>
                    <td>{userChoicesText}</td>
                    <td>{correctAnswersText}</td>
                    <td>{explanation[id]}</td>
                </tr>
            );
        }
    
        return allAnswerRows;
    }

    const handleOnResultClick = () => {
        navigate('/result');
     }


    React.useEffect(() => {
    window.scrollTo(0, 0);
    }, [location.pathname]);
    

    return (
        <>
        {showCreateQuiz &&
                    <Modal
                        show={showCreateQuiz}
                        onClose={toggleShowCreateQuiz}
                        className={showCreateQuiz ? 'visible' : ''}
                    >
                        <CreateQuiz userId={contextValue.user.id}/>
                    </Modal> 
        } 
             
        <div className="quiz-detailed-results">
            <Header options={[{ label: 'Create+', action: handleCreateQuizClick }, { label: 'Home', action: handleHomeClick }, { label: 'Profile', action: handleProfileClick }, {label: 'Logout', action: handleLogoutClick}]}  />
            <div className="detailed-results">
                <h1>Quiz Detailed Results</h1>
                <QuizSummary quizResult = {quizResult} />
                <table className="all-answers-table">
                    <thead>
                        <tr>
                            <th>Question No.</th>
                            <th>Question</th>
                            <th>Your Answer</th>
                            <th>Correct Answer</th>
                            <th>Explanation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {getAllAnswers()}
                    </tbody>
                </table>
                <p className="results-link" onClick={handleOnResultClick}>Go back to the results</p>
            </div>
            
            <Footer />    
        </div>

        </>
    );
}

export default QuizDetailedResults;
