import { useContext } from 'react';
import { QuizContext } from '../context/QuizContext';
import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import ProfileCard from '../components/ProfileCard.js';
import IncorrectFeedbackCard from '../components/IncorrectFeedbackCard';
import Modal from '../components/Modal';
import '../styles/QuizResult.css';
import QuizDetailedResults from './QuizDetailedResults';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


 const QuizResult = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showProfile, setShowProfile] = useState(false);
    const navigate = useNavigate();
    const [showDetailedResults, setShowDetailedResults] = useState(false);
    const contextValue = useContext(QuizContext);
    const quizTopic = useContext(QuizContext).topic.name;
    const quizResult = contextValue.quizResult;
    
    
    const location = useLocation();
    const fromQuiz = location.state?.fromQuiz;

      
    React.useEffect(() => {
      console.log("fromQuiz value: ", fromQuiz);  // Logging the fromQuiz value
      if (fromQuiz) {
          console.log("getQuizResult function called."); // To verify that the function is called
          getQuizResult();
      }
  }, [fromQuiz]);
    
     
    const handleHomeClick = () => {
        navigate('/home');
    }

    const handleLogoutClick = () => {
        //Asks a user a confirmation and logouts
    }

    const handleProfileClick = () => {
      // setShowProfile(true);
       navigate('/profile');
   }

   /*const toggleProfile = () => {
       setShowProfile(!showProfile);

       //In Header component
       showProfile={showProfile} toggleProfile={toggleProfile}
       //After Header component
        {showProfile && <ProfileCard />}
   } */

   const getQuizResult = async () => {
      const quizId = contextValue.quizDetails.id;
      try {
          const response = await fetch(`http://localhost:9090/api/v1/quizzes/quiz-result/${quizId}`);
          
          if(!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          } else {
              const data = await response.json();
              contextValue.setQuizResult(data);
          }
      } catch(error) {
        console.error('An error occurred while submitting the quiz:', error);
        setError(error.message);
    } finally {
        setIsLoading(false);
    }
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

    const getProgressColor = (percentage) => {
      if (percentage < 40) {
        return "#FF0000"; // red
      } else if (percentage < 60) {
        return "#FF6B00"; // orange 
      } else if (percentage < 70) {
        return "#FFA500"; // golden yellow
      } else if (percentage < 91) {
        return "#86CB5C"; // light green
      } else {
        return "#006400"; // dark green
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

    return (
        <div className="quiz-result-page">
              <Header options={[{ label: 'Home', action: handleHomeClick }, { label: 'Profile', Icon: FaUser, action: handleProfileClick }, {label: 'Logout', action: handleLogoutClick}]}  />
              {isLoading ? (
                <div>Loading...</div>
              ) : error ? (
                <div>Error: {error}</div>
              ) : (
            <div className="quiz-result-content">
               
                <h1>Quiz results</h1>

                <div className="quiz-marks-section">
                  <div className="percentage-card" style={{ width: 150, height: 150 }}>
                     <CircularProgressbar 
                        value={quizResult.finalPercentage} 
                        text={`${quizResult.finalPercentage}%`} 
                        styles= {buildStyles ({
                          pathColor: getProgressColor(quizResult.finalPercentage),
                          textColor: getProgressColor(quizResult.finalPercentage),
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

                <div className="quiz-feedback">
                    <h2 className="quiz-feedback-title">Feedback</h2>
                    <p>Some message based on the percentage scored</p>
                </div>
                <p className="answer-explain-heading">These are the places where you went wrong</p>
                <div className="incorrect-answer-explanations">
                    {getIncorrectCards()}
                </div>

                <p className="detailed-results-link" onClick={handleOnDetailedResultsClick}>Click here to get the detailed results</p>
            
            </div>
          )}
          

            <Footer />
        </div>
    )
    
 }

 export default QuizResult;

