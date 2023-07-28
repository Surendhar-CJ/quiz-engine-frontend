import { useContext } from 'react';
import { QuizContext } from '../context/QuizContext';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { baseURL } from '../config.js';
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import IncorrectFeedbackCard from '../components/IncorrectFeedbackCard';
import Modal from '../components/Modal';
import '../styles/QuizResult.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { useErrorHandler } from '../hooks/useErrorHandler';
import ProgressBar from '@ramonak/react-progress-bar';
import AskRating from '../components/AskRating.js';
import 'react-circular-progressbar/dist/styles.css';


 const QuizResult = () => {

    const navigate = useNavigate();
    const contextValue = useContext(QuizContext);
    const [sessionExpired, setSessionExpired] = useState(false);
    const [isRatingSubmitted, setIsRatingSubmitted] = useState(false);
    
    const location = useLocation();
    const fromQuiz = location.state?.fromQuiz;
    const handleError = useErrorHandler();

    const quizTopic = JSON.parse(localStorage.getItem('topic')).name;
    const quizResult = JSON.parse(localStorage.getItem('quizResult'));
    const quizDetails = JSON.parse(localStorage.getItem('quizDetails'));
      
       
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
       navigate('/detailed-results');
    }


    const getProgressColor = (percentage) => {
      if (percentage < 40) {
        return "#FF0000"; // red
      } else if (percentage < 60) {
        return "#FF6B00"; // orange 
      } else if (percentage < 70) {
        return "#FFA500"; // golden yellow
      } else if (percentage < 91) {
        return "#86CB5C"; // light green
      } else if (percentage <= 99) {
        return "#006400"; // dark green
      } else {
        return "#0D99FF"; //blue
      }
    }

    const lightenColor = (color, percent) => {
      var num = parseInt(color.replace("#",""),16),
      amt = Math.round(2.55 * percent),
      R = (num >> 16) + amt,
      G = (num >> 8 & 0x00FF) + amt,
      B = (num & 0x0000FF) + amt;
      return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
    }

    

    const getSubtopicScores = () => {
      const { marksScoredPerTopic, totalMarksPerTopic, percentagePerTopic } = quizResult;
      const subtopicKeys = Object.keys(marksScoredPerTopic);
      if (subtopicKeys.length > 1 || (subtopicKeys.length === 1 && subtopicKeys[0] !== "General")) {
        return (
          <div className="table-wrapper">
            <table className="subtopic-table">
              <tbody>
                {subtopicKeys.map((subtopic) => (
                  <tr className="subtopic-progress-section">
                    <td>
                      <p>{subtopic}</p>
                    </td>
                    <td>
                      <ProgressBar 
                        completed={percentagePerTopic[subtopic]} 
                        className="wrapper"
                        barContainerClassName="container"
                        width= "100%"
                        height= "8px"
                        bgColor= {getProgressColor(percentagePerTopic[subtopic])}
                        baseBgColor= "#979797"
                        labelAlignment="center"
                        labelSize="10px"
                        isLabelVisible={false}
                        transitionDuration="2s"
                        transitionTimingFunction="ease-in-out"
                      />
                    </td>
                    <td>
                      <p><span>{marksScoredPerTopic[subtopic]} / {totalMarksPerTopic[subtopic]}</span></p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      return null;
  };
  

      const getQuizResult = async () => {
        const quizId = contextValue.quizDetails? contextValue.quizDetails.id : quizDetails.id;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${baseURL}/api/v1/quizzes/quiz-result/${quizId}`, {
              headers : {
                "Authorization":`Bearer ${token}`
              }
            });

            if(response.status === 403) {
              setSessionExpired(true);
            } else {
              if(!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
              } else {
                  const data = await response.json();
                  contextValue.setQuizResult(data);
                  const dataL = localStorage.setItem('quizResult', JSON.stringify(data));
                  
              }
          }
        } catch(error) {
            if (error.name === 'TypeError' || error.message === 'Failed to fetch') {
                handleError('An error occurred while trying to reach the server. Please try again');
            } else {
                handleError(error);
            }
       }
      }
    

      React.useEffect(() => {
        window.scrollTo(0, 0);
      }, [location.pathname]);
     
      React.useEffect(() => {
        if (fromQuiz) {
            getQuizResult();
        }
      }, [fromQuiz]);
  
      React.useEffect(() => {
      }, [isRatingSubmitted]);
  
      
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
      


    
    return (

      <>
      {
          sessionExpired &&
          <Modal id="session-expired-modal" onClose={() => {}} className={sessionExpired ? 'visible' : ''}>
              <h2 className="session-expired-title">Session Expired</h2>
              <p className="session-expired-message-content">Your session has expired. You will be redirected to the home page, please log in again to continue.</p>
          </Modal>
      }
       
          { quizResult && <div className="quiz-result-page">
            <Header options={[{ label: 'Home', action: handleHomeClick }, { label: 'Profile', action: handleProfileClick }, {label: 'Logout', action: handleLogoutClick}]}  />
              
            <div className="quiz-result-content">
               
                <h1>Quiz results</h1>
                <div className="quiz-marks-all">
                  <div className="quiz-marks-section">
                    <div className="percentage-card" style={{ width: 150, height: 150 }}>
                      <CircularProgressbar 
                          value={quizResult.finalPercentage} 
                          text={`${quizResult.finalPercentage}%`} 
                          styles= {buildStyles ({
                            pathColor: getProgressColor(quizResult.finalPercentage),
                            textColor: getProgressColor(quizResult.finalPercentage),
                            pathTransitionDuration: 0.5

                          })
                        }                    
                      />
                    </div>

                    <div className="topic-marks-card" style={{ backgroundColor: lightenColor(getProgressColor(quizResult.finalPercentage), 60) }}>
                      <div className="quiz-topic-result">
                          <p>Topic: <span>{quizTopic}</span></p>
                      </div>
                      <div className="marks-card">
                          <p>Marks: <span>{quizResult.finalScore} / {quizResult.totalNumberOfMarks}</span></p>
                      </div>
                    </div>
                  </div>

                  <div className="marks-by-subtopic">
                      {getSubtopicScores()}
                  </div>
                </div>
                <div className="quiz-feedback">
                    <h2 className="quiz-feedback-title">Feedback</h2>
                    <div className="quiz-feedback-content">
                      <p>{quizResult.overallFeedback}</p>
                      <p className="subtopic-feedback">{quizResult.feedbackBySubtopic}</p>
                    </div>
                </div>
                {quizResult.finalPercentage <= 99 ? <p className="answer-explain-heading">Growth happens when we understand our mistakes. Here are the question(s) that didn't go as planned.</p> : null}
                <div className="incorrect-answer-explanations">
                    {getIncorrectCards()}
                </div>
                
                {quizResult.userId !== quizResult.topic.user.id && !quizResult.isRated && !isRatingSubmitted && (
                  <div className="rating-area">
                      <AskRating onRatingSubmit={() => setIsRatingSubmitted(true)}/>
                  </div>
              )}
                <p className="detailed-results-link" onClick={handleOnDetailedResultsClick}>Get detailed results</p>
            
            </div>
            <Footer />
        </div> }
        </>
    )
    
 }

 export default QuizResult;

