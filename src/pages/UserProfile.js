import { useContext } from 'react';
import { QuizContext } from '../context/QuizContext';
import React, { useState } from 'react';
import { useRef } from 'react';
import {BiSolidHome} from 'react-icons/bi'
import { FaUser } from 'react-icons/fa';
import { IoLogOut } from 'react-icons/io5';
import { useNavigate } from "react-router-dom";
import { baseURL } from '../config.js';
import BarChart from '../components/visual/BarChart';
import LineChart from '../components/visual/LineChart';
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import UserCard from '../components/UserProfileComponents/UserCard.js';
import QuizCard from '../components/UserProfileComponents/QuizCard';
import Modal from "../components/Modal";
import '../styles/UserProfile.css';

const UserProfile = () => {
    const contextValue = useContext(QuizContext);
    const navigate = useNavigate();
    const [userProfileDetails, setUserProfileDetails] = useState(null);
    const [sessionExpired, setSessionExpired] = useState(false);
    const quizHistoryRef = useRef(null);

   
   
   
    const getUserProfileDetails = async (user) => {
        const userId = user.id;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${baseURL}/api/v1/users/${userId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if(response.status === 403) {
                setSessionExpired(true);
            }

            if(response.status === 302) {
                const data = await response.json();
                setUserProfileDetails(data);
                console.log(data);
            }

        } catch (error) {
            console.log("Error :", error);
        }
    };

    React.useEffect(() => {
        const storedUser = JSON.parse(window.localStorage.getItem('user'));
        const storedTopics = JSON.parse(window.localStorage.getItem('topics'));

        if (storedUser) {
            contextValue.setUser(storedUser);
            getUserProfileDetails(storedUser);
        }
        
       if(contextValue.availableTopics == null && storedTopics !== null) {
            contextValue.setAvailableTopics(storedTopics);
        } 
        
    }, [])




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
      // navigate('/profile');
    }

    const topicColorMapping = {
        // color mapping for each topicId
    };

    const strength = () => {
        const topics = contextValue.availableTopics;
        const averagePercentageByTopic = userProfileDetails.averageScoreByTopic;
    
        const colors = [
            'rgba(75,192,192,0.4)',
            'rgba(134, 203, 92, 0.4)',
            'rgba(161, 92, 203, 0.4)',
            'rgba(35, 43, 244, 0.4)',
            'rgba(35, 244, 106, 0.4)',
        ];
    
        const hoverColors = [
            'rgba(75,192,192,1)',
            'rgba(134,203,92,1)',
            'rgba(161,92,203,1)',
            'rgba(35,43,244,1)',
            'rgba(35,244,106,1)',
        ];
    
        const borderColor = [
            'rgba(75,192,192,0.4)',
            'rgba(134, 203, 92, 0.4)',
            'rgba(161, 92, 203, 0.4)',
            'rgba(35, 43, 244, 0.4)',
            'rgba(35, 244, 106, 0.4)',
        ];
    
        const data = {
            labels: [], // this will contain your x-axis labels (topic names)
            datasets: [
                {
                    label: 'Average Score',
                    data: [], // this will contain your y-axis values (percentage)
                    backgroundColor: [],
                    hoverBackgroundColor: [],
                    borderColor: [],
                    borderWidth: 1,
                    barThickness: 30,
                },
            ],
        };
    
        let colorIndex = 0;
        for (let topicId in averagePercentageByTopic) {
            let percentage = averagePercentageByTopic[topicId];
    
            let topicName;
            for(let topic of topics) {
                if(topic.id.toString() === topicId) {
                    topicName = topic.name;
                }
            }
    
            if (percentage >= 60) {
                let color = colors[colorIndex % colors.length];
                let hoverColor = hoverColors[colorIndex % hoverColors.length];
                let border = borderColor[colorIndex % borderColor.length];
    
                data.labels.push(topicName);
                data.datasets[0].data.push(percentage);
                data.datasets[0].backgroundColor.push(color);
                data.datasets[0].hoverBackgroundColor.push(hoverColor);
                data.datasets[0].borderColor.push(border);
    
                // Save the color mapping for this topic
                if (!topicColorMapping[topicId]) {
                    topicColorMapping[topicId] = {
                        color: color,
                        hoverColor: hoverColor,
                        border: border
                    };
                }
    
                colorIndex++;
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
                display: false,
                labels: {
                    color: "black"
                }
            }
        }
    }
    

    const weakness = () => {
        const topics = contextValue.availableTopics;
        const averagePercentageByTopic = userProfileDetails.averageScoreByTopic;
    
        const colors = [
            'rgba(255,0,0,0.4)',
            'rgba(203,199,92,0.4)',
            'rgba(255,107,0,0.4)',
            'rgba(240,244,35,0.4)',
            'rgba(185,140,52,0.4)',
        ];
    
        const hoverColors = [
            'rgba(255,0,0,1)',
            'rgba(203,199,92,1)',
            'rgba(255,107,0,1)',
            'rgba(240,244,35,1)',
            'rgba(185,140,52,1)',
        ];
    
        const borderColor = [
            'rgba(255,0,0,0.4)',
            'rgba(203,199,92,0.4)',
            'rgba(255,107,0,0.4)',
            'rgba(240,244,35,0.4)',
            'rgba(185,140,52,0.4)',
        ];
    
        const data = {
            labels: [], 
            datasets: [
                {
                    label: 'Average Score',
                    data: [], 
                    backgroundColor: [],
                    hoverBackgroundColor: [],
                    borderColor: [],
                    borderWidth: 1,
                    barThickness: 30,
                },
            ],
        };
    
        let colorIndex = 0;
        for (let topicId in averagePercentageByTopic) {
            let percentage = averagePercentageByTopic[topicId];
    
            let topicName;
            for(let topic of topics) {
                if(topic.id.toString() === topicId) {
                    topicName = topic.name;
                }
            }
    
            if (percentage <= 59) {
                let color = colors[colorIndex % colors.length];
                let hoverColor = hoverColors[colorIndex % hoverColors.length];
                let border = borderColor[colorIndex % borderColor.length];
    
                data.labels.push(topicName);
                data.datasets[0].data.push(percentage);
                data.datasets[0].backgroundColor.push(color);
                data.datasets[0].hoverBackgroundColor.push(hoverColor);
                data.datasets[0].borderColor.push(border);
    
                // Save the color mapping for this topic
                if (!topicColorMapping[topicId]) {
                    topicColorMapping[topicId] = {
                        color: color,
                        hoverColor: hoverColor,
                        border: border
                    };
                }
    
                colorIndex++;
            }
        }
    
        return (
            <BarChart chartData={data} options={options}/>
        );
    }

    const progressByTopic = () => {
        const quizList = userProfileDetails.quizList;
        quizList.sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt));
        let dataByTopic = {};
    
        for (let quiz of quizList) {
            let date = new Date(quiz.completedAt).toLocaleDateString('en-GB');
            let topicId = quiz.topic.id.toString();
            let topicName = quiz.topic.name;
            let score = quiz.finalPercentage;
    
            if (!dataByTopic[topicId]) {
                dataByTopic[topicId] = {
                    name: topicName,
                    data: [],
                    quizCounter: 0 // Initialize a quizCounter for each topic
                };
            }
    
            // Increase the quizCounter for this topic
            dataByTopic[topicId].quizCounter++;
            // Add this quiz number, date, and score to this topic's data
            dataByTopic[topicId].data.push({ x: dataByTopic[topicId].quizCounter, 
                                             y: score, 
                                             date: date,
                                             quizNum: dataByTopic[topicId].quizCounter});
        }
    
        let datasets = [];
        for (let topicId in dataByTopic) {
            let topicData = dataByTopic[topicId];
            let color = topicColorMapping[topicId] ? topicColorMapping[topicId].color : 'rgba(0,123,255,0.5)';
            let borderColor = topicColorMapping[topicId] ? topicColorMapping[topicId].border : 'rgba(0,123,255,1)';
    
            let data = {
                label: topicData.name,
                data: topicData.data,
                backgroundColor: color,
                borderColor: borderColor,
                fill: false,
            };
    
            datasets.push(data);
        }
    
        let finalData = {
            datasets: datasets,
        };
    
        // Customize tooltip
        let options = {
            scales: {
                x: {
                    type: 'linear',  
                    ticks: {
                        stepSize: 1,  
                    }
                },
                y: {  
                    min: 0,  
                    max: 100,  
                }
            },
            plugins: {
                legend: {
                    labels: {
                        boxWidth: 10,
                        boxHeight: 10,
                        padding: 10
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let dataset = context.dataset;
                            let currentItem = dataset.data[context.dataIndex];
                            return `Quiz ${currentItem.quizNum}, Date: ${currentItem.date}, Score: ${context.parsed.y}%`;
                        }
                    }
                }
            }
        };
    
        return (
            <LineChart data={finalData} options={options} />
        );
    }

    const comparisonChart = () => {
        const topics = contextValue.availableTopics;
        const userScores = userProfileDetails.averageScoreByTopic;
        const otherScores = userProfileDetails.averagePercentageByOtherUsersPerTopic;
    
        const data = {
            labels: [], // this will contain your x-axis labels (topic names)
            datasets: [
                {
                    label: 'Your Average Score',
                    data: [], // this will contain your y-axis values (percentage)
                    backgroundColor: [],
                    hoverBackgroundColor: [],
                    borderColor: [],
                    borderWidth: 1,
                    barThickness: 30,
                },
                {
                    label: 'Other Users\' Average Score',
                    data: [], // this will contain your y-axis values (percentage)
                    backgroundColor: [],
                    hoverBackgroundColor: [],
                    borderColor: [],
                    borderWidth: 1,
                    barThickness: 30,
                }
            ],
        };
    
        for (let topicId in userScores) {
            let percentage = userScores[topicId];
            let otherPercentage = otherScores[topicId];
    
            let topicName;
            for(let topic of topics) {
                if(topic.id.toString() === topicId) {
                    topicName = topic.name;
                }
            }
    
            let topicColors = topicColorMapping[topicId];
            if (!topicColors) {
                // if there is no color mapping for this topic, use default colors
                topicColors = {
                    color: 'rgba(0,123,255,0.5)',
                    hoverColor: 'rgba(0,123,255,1)',
                    border: 'rgba(0,123,255,1)'
                }
            }
            let color = topicColors.color;
            let hoverColor = topicColors.hoverColor;
            let border = topicColors.border;
    
            data.labels.push(topicName);
            data.datasets[0].data.push(percentage);
            data.datasets[0].backgroundColor.push(color);
            data.datasets[0].hoverBackgroundColor.push(hoverColor);
            data.datasets[0].borderColor.push(border);
    
            data.datasets[1].data.push(otherPercentage);
            data.datasets[1].backgroundColor.push(color);
            data.datasets[1].hoverBackgroundColor.push(hoverColor);
            data.datasets[1].borderColor.push(border);
        }
    
        return (
            <BarChart chartData={data} options={options} />
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
            const token = localStorage.getItem('token');
            const response = await fetch(`${baseURL}/api/v1/quizzes/quiz-result/${quizId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if(response.status === 403) {
                setSessionExpired(true);
            }
            else if(!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                const data = await response.json();
                window.localStorage.setItem('quizResult', JSON.stringify(data));
                window.localStorage.setItem('topic', JSON.stringify(data.topic));
                navigate('/result');
            }
        } catch(error) {
            console.error('An error occurred while submitting the quiz:', error);
        }

       
    }


    const handleCreateQuizOnUserProfileClick = () => {
        navigate('/home');
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


    return (

        <>
        {
            sessionExpired &&
            <Modal id="session-expired-modal" onClose={() => {}} className={sessionExpired ? 'visible' : ''}>
                <h2 className="session-expired-title">Session Expired</h2>
                <p className="session-expired-message-content">Your session has expired. You will be redirected to the home page, please log in again to continue.</p>
            </Modal>
        }

        {<div className="user-profile-page">
            <Header options={[{ label: 'Home', Icon: BiSolidHome, action: handleHomeClick }, { label: 'Profile', Icon: FaUser, action: handleProfileClick }, {label: 'Logout', Icon: IoLogOut, action: handleLogoutClick}]}  /> 
              
              {userProfileDetails && <div className="user-profile-details">
                
                <div className="first-section">    
                    <UserCard firstName={userProfileDetails.firstName} lastName={userProfileDetails.lastName} email={userProfileDetails.email} />
                    <div className="quizzes-count" onClick={() => quizHistoryRef.current.scrollIntoView({ behavior: 'smooth' })}>
                        <p className="quiz-count">{userProfileDetails.quizList.length}</p>
                        <div className="quiz-count-info">
                            <p>{userProfileDetails.quizList.length === 1 ? "Quiz" : "Quizzes"} taken so far</p>
                            {userProfileDetails.quizList.length > 0 && <p>Last Quiz Date: {lastQuizDate()}</p>}
                        </div>
                    </div>
                </div>


                <div className="performance-analysis">
                    <p className="performance-analysis-title">Areas of Strength and Potential Growth</p>
                   {userProfileDetails.quizList.length > 0 ? 
                    <div className="strength-weakness">
                        <div className="strength">
                            <p>Areas You Shine In</p>
                            <div className="user-strengths">
                                {strength()}
                            </div>
                        </div>
                        <div className="weakness">
                            <p>Areas for Improvement</p>
                            <div className="user-weaknesses">
                                {weakness()}
                            </div>
                        </div>
                    </div>
                    :
                    <p className="no-quiz-history">Take a quiz to know your areas of strength and improvements. <span className="create-quiz-link" onClick = {handleCreateQuizOnUserProfileClick}>Let's quiz!</span></p>}
                </div>

                {userProfileDetails.quizList.length > 0 &&
                <div className="performance-analysis-by-topic">
                    
                        
                            <p className="performance-analysis-by-topic-title">Your Quiz Performance Over Time</p>
                            <div className="progress-by-topic">
                                {progressByTopic()}
                            </div> 
                </div> }


                {Object.keys(userProfileDetails.averagePercentageByOtherUsersPerTopic).length > 0
                    &&
                <div className="comparison-chart">
                
                        <p className="comparison-bar-title">Benchmarking with Learning Community</p>
                        <div className="comparison-bar-chart-picture">
                        {comparisonChart()}
                        </div>
                </div> 
            }
               

                <div className="quiz-history" ref={quizHistoryRef}>
                    <p className="quiz-history-title">Quiz History</p>
                    <div className="quiz-history-cards">
                        {userProfileDetails.quizList.length > 0 ? quizHistory() : <p className="no-quiz-history-last">You haven't challenged yourself with a quiz yet. <span className="create-quiz-link" onClick = {handleCreateQuizOnUserProfileClick}>Let's change that!</span></p>}
                    </div>
                </div>
              </div> 
            }
             <Footer />
        </div>}
        </>
    )
}

//<UserCard firstName={userProfileDetails.firstName} lastName={userProfileDetails.lastName} email={userProfileDetails.email} />
// 
export default UserProfile;