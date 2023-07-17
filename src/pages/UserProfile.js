import { useContext } from 'react';
import { QuizContext } from '../context/QuizContext';
import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import BarChart from '../components/visual/BarChart';
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
    
        const data = {
            labels: [], // this will contain your x-axis labels (topic names)
            datasets: [
                {
                    label: 'Average Score',
                    data: [], // this will contain your y-axis values (percentage)
                    backgroundColor: [
                        'rgba(75,192,192,0.4)',
                        'rgba(134, 203, 92, 0.4)',
                        'rgba(161, 92, 203, 0.4)',
                        'rgba(35, 43, 244, 0.4)',
                        'rgba(35, 244, 106, 0.4)',
                    ],

                    hoverBackgroundColor: [
                        'rgba(75,192,192,1)',
                        'rgba(134,203,92,1)',
                        'rgba(161,92,203,1)',
                        'rgba(35,43,244,1)',
                        'rgba(35,244,106,1)',
                    ],

                    borderColor: [
                        'rgba(75,192,192,0.4)',
                        'rgba(134, 203, 92, 0.4)',
                        'rgba(161, 92, 203, 0.4)',
                        'rgba(35, 43, 244, 0.4)',
                        'rgba(35, 244, 106, 0.4)',
                    ],
                    borderWidth: 1,
                    barThickness: 30
                },
            ],
        };
    
        for (let topicId in averagePercentageByTopic) {
            let percentage = averagePercentageByTopic[topicId];
            
            let topicName;
            for(let topic of topics) {
                if(topic.id.toString() === topicId) {
                    topicName = topic.name;
                }
            }
    
            if (percentage >= 60) {
                data.labels.push(topicName);
                data.datasets[0].data.push(percentage);
            }
        }

        return (
            <BarChart chartData={data} options={options} />
        );
        
    }


    const options = {
        responsive: true, 
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels : {
                    display: true,
                    color: "red"
                }
               
            }
        }
    }

    const weakness = () => {
        const topics = contextValue.availableTopics;
        const averagePercentageByTopic = userProfileDetails.averageScoreByTopic;
    
        const data = {
            labels: [], // this will contain your x-axis labels (topic names)
            datasets: [
                {
                    label: 'Average Score',
                    data: [], // this will contain your y-axis values (percentage)
                    backgroundColor: [
                        'rgba(255,0,0,0.4)',
                        'rgba(203,199,92,0.4)',
                        'rgba(255,107,0,0.4)',
                        'rgba(240,244,35,0.4)',
                        'rgba(185,140,52,0.4)',
                    ], 
                    
                    hoverBackgroundColor:  [
                        'rgba(255,0,0,1)',
                        'rgba(203,199,92,1)',
                        'rgba(255,107,0,1)',
                        'rgba(240,244,35,1)',
                        'rgba(185,140,52,1)',
                    ], 
                    borderColor: [
                        'rgba(255,0,0,0.4)',
                        'rgba(203,199,92,0.4)',
                        'rgba(255,107,0,0.4)',
                        'rgba(240,244,35,0.4)',
                        'rgba(185,140,52,0.4)',
                    ], 
                    borderWidth: 1,
                    barThickness: 30,
                    
                },
            ],
        };
    
        for (let topicId in averagePercentageByTopic) {
            let percentage = averagePercentageByTopic[topicId];
            
            let topicName;
            for(let topic of topics) {
                if(topic.id.toString() === topicId) {
                    topicName = topic.name;
                }
            }
    
            if (percentage <= 59) {
                data.labels.push(topicName);
                data.datasets[0].data.push(percentage);
            }
        }

        return (
            <BarChart chartData={data} options={options}/>
        );
        
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
            const response = await fetch(`http://localhost:9090/api/v1/quizzes/quiz-result/${quizId}`);
            
            if(!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                const data = await response.json();
                contextValue.setQuizResult(data);
                contextValue.setTopic(data.topic);
                console.log(data);
                navigate('/result');
            }
        } catch(error) {
            console.error('An error occurred while submitting the quiz:', error);
        }

       
    }


    const handleCreateQuizOnUserProfileClick = () => {
        navigate('/home');
    }


    return (
        <div className="user-profile-page">
             <Header options={[{ label: 'Home', action: handleHomeClick }, { label: 'Profile', Icon: FaUser, action: handleProfileClick }, {label: 'Logout', action: handleLogoutClick}]}  />
              {userProfileDetails && <div className="user-profile-details">
                <div className="first-section">    
                    <UserCard firstName={userProfileDetails.firstName} lastName={userProfileDetails.lastName} email={userProfileDetails.email} />
                    <div className="quizzes-count" onClick={() => navigate('#quiz-history')}>
                        <p className="quiz-count">{userProfileDetails.quizList.length}</p>
                        <div className="quiz-count-info">
                            <p>Quizzes taken so far</p>
                            {userProfileDetails.quizList.length > 0 && <p>Last Quiz Date: {lastQuizDate()}</p>}
                        </div>
                    </div>
                </div> 
                <div className="performance-analysis">
                    <p className="performance-analysis-title">Performance Analysis</p>
                    <div className="strength-weakness">
                        <div className="strength">
                            <p>You're good at</p>
                            <div className="user-strengths">
                                {strength()}
                            </div>
                        </div>
                        <div className="weakness">
                            <p>Focus more on</p>
                            <div className="user-weaknesses">
                                {weakness()}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="quiz-history" id="quiz-history">
                    <p className="quiz-history-title">Quiz History</p>
                    <div className="quiz-history-cards">
                        {userProfileDetails.quizList.length > 0 ? quizHistory() : <p className="no-quiz-history">You haven't challenged yourself with a quiz yet. <span className="create-quiz-link" onClick = {handleCreateQuizOnUserProfileClick}>Let's change that!</span></p>}
                    </div>
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