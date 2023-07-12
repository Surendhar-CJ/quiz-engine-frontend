import { useContext } from 'react';
import { QuizContext } from '../context/QuizContext';
import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import UserCard from '../components/UserProfileComponents/UserCard.js';
import QuizCard from '../components/UserProfileComponents/QuizCard';
import '../styles/UserProfile.css';

const UserProfile = () => {
    const contextValue = useContext(QuizContext);
    const navigate = useNavigate();
    const [userProfileDetails, setUserProfileDetails] = useState(null);

    const getUserProfileDetails = async () => {
        const userId = 1; //contextValue.user.getId();
        try {
            const response = await fetch(`http://localhost:9090/api/v1/users/${userId}`);
            if(response.status === 302) {
                const data = await response.json();
                console.log(data);
                setUserProfileDetails(data);
                
            }

        } catch (error) {
            console.log("Error :", error);
        }
    };

    React.useEffect(() => {
        getUserProfileDetails();
    }, [])




    const handleHomeClick = () => {
        navigate('/home');
    }

    const handleLogoutClick = () => {
        //Asks a user a confirmation and logouts
    }

    const handleProfileClick = () => {
      // navigate('/profile');
    }

    const strength = () => {
        const topics = contextValue.availableTopics;
        const averagePercentageByTopic = userProfileDetails.averageScoreByTopic;

        const strengths = [];
        for (let topicId in averagePercentageByTopic) {
            let percentage = averagePercentageByTopic[topicId];
            
            let topicName;
            for(let topic of topics) {
                if(topic.id.toString() === topicId) {
                    topicName = topic.name;
                }
            }

            if (percentage >= 60) {
                strengths.push(
                    <div key={topicId}>
                        <p>Topic ID: {topicName}</p>
                        <p>Score: {percentage}</p>
                    </div>
                );
            }
        }
        
        return strengths;
    }

    const weakness = () => {
        const topics = contextValue.availableTopics;
        const averagePercentageByTopic = userProfileDetails.averageScoreByTopic;

        const weakness = [];
        for (let topicId in averagePercentageByTopic) {
            let percentage = averagePercentageByTopic[topicId];
            
            let topicName;
            for(let topic of topics) {
                if(topic.id.toString() === topicId) {
                    topicName = topic.name;
                }
            }

            if (percentage <= 59) {
                weakness.push(
                    <div key={topicId}>
                        <p>Topic ID: {topicName}</p>
                        <p>Score: {percentage}</p>
                    </div>
                );
            }
        }
        
        return weakness;
    }
    
    const quizHistory = () => {
        const quizzes = userProfileDetails.quizList;

        quizzes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const quizCards = quizzes.map(quiz => {
        let dateString = quiz.createdAt; 
        let dateObj = new Date(dateString);
        let day = String(dateObj.getDate()).padStart(2, '0');
        let month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are 0-11 in JavaScript
        let year = dateObj.getFullYear();

        let formattedDate = `${day}/${month}/${year}`; // "12/07/2023"

        return <QuizCard 
                    key={quiz.quizId}
                    id={quiz.quizId}
                    topic={quiz.topic.name}
                    finalScore={quiz.finalScore}
                    totalMarks={quiz.totalNumberOfMarks}
                    date={formattedDate}
                    onClickQuizCard={handleOnClickQuizCard}
                />;
            });
    
        return quizCards;
    }


    const lastQuizDate = () => {
        const quizzes = userProfileDetails.quizList;

        quizzes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const lastQuizDate =  quizzes[0].createdAt;
        const dateObj = new Date(lastQuizDate);
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are 0-11 in JavaScript
        const year = dateObj.getFullYear();

        return `${day}/${month}/${year}`; 
    }

    const handleOnClickQuizCard = async(quizId) => {
        try {
            const response = await fetch(`http://localhost:9090/api/v1/quizzes/quiz-finish/${quizId}`);
            
            if(!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                const data = await response.json();
                contextValue.setQuizResult(data);
                contextValue.setTopic(data.topic);
                navigate('/result');
            }
        } catch(error) {
            console.error('An error occurred while submitting the quiz:', error);
        }

       
    }


    return (
        <div className="user-profile-page">
             <Header options={[{ label: 'Home', action: handleHomeClick }, { label: 'Profile', Icon: FaUser, action: handleProfileClick }, {label: 'Logout', action: handleLogoutClick}]}  />
              {userProfileDetails && <div className="user-profile-details">
                <div>    
                    <UserCard firstName={userProfileDetails.firstName} lastName={userProfileDetails.lastName} email={userProfileDetails.email} />
                    <div className="quizzes-count" onClick={() => navigate('#quiz-history')}>
                        <p>Number Of Quizzes: {userProfileDetails.quizList.length}</p>
                        <p>Last Quiz Date: {lastQuizDate()}</p>
                    </div>
                </div> 
                <div className="strength-weakness">
                    <p>You're good at</p>
                    {strength()}
                    <p>Focus more on</p>
                    {weakness()}
                </div>
                <div className="quiz-history" id="quiz-history">
                    <p>Quiz History</p>
                    {quizHistory()}
                </div>
              </div> 
            }
             <Footer />
        </div>
    )
}

//<UserCard firstName={userProfileDetails.firstName} lastName={userProfileDetails.lastName} email={userProfileDetails.email} />
// 
export default UserProfile;