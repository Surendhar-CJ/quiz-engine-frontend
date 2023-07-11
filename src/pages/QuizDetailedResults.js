import { useContext } from 'react';
import { QuizContext } from '../context/QuizContext';
import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import '../styles/QuizDetailedResults.css';

const QuizDetailedResults = () => {
    const contextValue = useContext(QuizContext);
    const quizResult = contextValue.quizResult;
    const [showProfile, setShowProfile] = useState(false);
    const navigate = useNavigate();
     
    console.log(quizResult);
     
    const handleHomeClick = () => {
        navigate('/home');
    }

    const handleLogoutClick = () => {
        //Asks a user a confirmation and logouts
    }

    const handleProfileClick = () => {
        setShowProfile(true);
    }

    const toggleProfile = () => {
        setShowProfile(!showProfile);
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

            let answerIsCorrect = areSetsEqual(userChoicesSet, correctAnswersSet);

            allAnswerRows.push(
                <tr key={id} className={answerIsCorrect ? 'correct-answer' : 'incorrect-answer'}>
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

    function areSetsEqual(set1, set2) {
        if(set1.size !== set2.size) {
          return false;
        }
        for(let item of set1) {
          if(!set2.has(item)) {
            return false;
          }
        }
        return true;
    }

    const handleOnResultClick = () => {
        navigate('/result');
     }


    return (
             
        <div className="quiz-detailed-results">
            <Header options={[{ label: 'Home', action: handleHomeClick }, { label: 'Profile', Icon: FaUser, action: handleProfileClick }, {label: 'Logout', action: handleLogoutClick}]} showProfile={showProfile} toggleProfile={toggleProfile} />
            <div className="detailed-results">
                <h1>Detailed Quiz Results</h1>
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
                <p className="results-link" onClick={handleOnResultClick}>Click here for the results</p>
            </div>
            
            <Footer />    
        </div>
    );
}

export default QuizDetailedResults;
