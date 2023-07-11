import { useContext } from 'react';
import { QuizContext } from '../context/QuizContext';
import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import ProfileCard from '../components/ProfileCard.js';
import IncorrectFeedbackCard from '../components/IncorrectFeedbackCard';
import Modal from '../components/Modal';
import '../styles/QuizResult.css';
import QuizDetailedResults from './QuizDetailedResults';


 const QuizResult = () => {


    const [showProfile, setShowProfile] = useState(false);
    const navigate = useNavigate();
    const [showDetailedResults, setShowDetailedResults] = useState(false);
    const contextValue = useContext(QuizContext);
    const quizTopic = useContext(QuizContext).topic.name;
    const quizResult = contextValue.quizResult;
    
    
    
    
     
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


    const getIncorrectCards = () => {
        const questions = quizResult.questions;
        const correctAnswers = quizResult.correctAnswerChoices;
        const userChoices = quizResult.userAnswerChoices;
        const explanation = quizResult.answerExplanation;
      
        let incorrectCards = [];
      
        for(let i = 0; i < questions.length; i++) {
            let id = questions[i].id.toString();
          
          let userChoicesSet = new Set(userChoices[id].map(choice => choice.id));
          let correctAnswersSet = new Set(correctAnswers[id].map(choice => choice.id));
      
          if(!areSetsEqual(userChoicesSet, correctAnswersSet)) {
            incorrectCards.push(
              <IncorrectFeedbackCard 
                key={id}
                questionNumber={i+1}
                question={questions[i].text}
                userAnswer={userChoices[id].map(choice => choice.text).join(", ")}
                correctAnswer={correctAnswers[id].map(choice => choice.text).join(", ")}
                explanation={explanation[id]}
              />
            );
          }
        }
      
        return incorrectCards;
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

    
    const handleOnDetailedResultsClick = () => {
       // setShowDetailedResults(true);
       navigate('/detailed-results');
    }

    const toggleShowDetailedResults = () => {
        setShowDetailedResults(!setShowDetailedResults);
    }

    return (
        <div className="quiz-result-page">
             <Header options={[{ label: 'Home', action: handleHomeClick}, { label: 'Profile', Icon: FaUser, action: handleProfileClick }, {label: 'Logout', action: handleLogoutClick}]} showProfile={showProfile} toggleProfile={toggleProfile} />
            <div className="quiz-result-content">
                <h1>Quiz results</h1>
                <div className="quiz-topic">
                    {quizTopic}
                </div>
                <div className="percentage-card">
                    Percantage: {quizResult.finalPercentage} %
                </div>
                <div className="marks-card">
                    <p>Marks: {quizResult.finalScore} / {quizResult.totalNumberOfMarks}</p>
                    <p>Number of questions correct: {}</p>
                    <p>Number of questions incorrect: {}</p>
                </div>
                <div className="quiz-feedback">
                    Feedback
                    <p>Some initial feedback message based on the percentage scored</p>
                    <p>These are the places where you went wrong</p>
                </div>
                <div className="incorrect-answer-explanations">
                    {getIncorrectCards()}
                </div>
                <p className="detailed-results-link" onClick={handleOnDetailedResultsClick}>Click here to get the detailed results</p>
            </div>
            
          

            <Footer />
        </div>
    )
    
 }

 export default QuizResult;

 /*

  {showDetailedResults && <Modal className={showDetailedResults ? 'visible' : ''} show={showDetailedResults} onClose={toggleShowDetailedResults}>
                <QuizDetailedResults />
            </Modal> }


 */