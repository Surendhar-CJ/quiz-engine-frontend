import { useContext } from 'react';
import { QuizContext } from '../context/QuizContext';
import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
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

   
   
   
    const getUserProfileDetails = async (user) => {
        const userId = user.id;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:9090/api/v1/users/${userId}`, {
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
            const response = await fetch(`http://localhost:9090/api/v1/quizzes/quiz-result/${quizId}`, {
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


    const progressByTopic = () => {
        const quizList = userProfileDetails.quizList;
      
        // Prepare the data for the Line chart
        let dataByTopic = {};
        for (let quiz of quizList) {
            let date = new Date(quiz.completedAt).toLocaleDateString();  // Format the date
            let topicId = quiz.topic.id.toString();
            let topicName = quiz.topic.name;
            let score = quiz.finalPercentage;
    
            // Initialize this topic's data if it hasn't been initialized yet
            if (!dataByTopic[topicId]) {
                dataByTopic[topicId] = {
                    name: topicName,
                    datesAndScores: {}
                };
            }
    
            // Add this date and score to this topic's data
            dataByTopic[topicId].datesAndScores[date] = score;
        }
    
        // Prepare the datasets for the Line chart using dataByTopic
        let datasets = [];
        for (let topicId in dataByTopic) {
            let topicData = dataByTopic[topicId];
    
            // Check if the color mapping exists for this topic
            let color = topicColorMapping[topicId] ? topicColorMapping[topicId].color : 'rgba(0,123,255,0.5)';
            let borderColor = topicColorMapping[topicId] ? topicColorMapping[topicId].border : 'rgba(0,123,255,1)';
    
            let data = {
                label: topicData.name,
                labels:[],
                data: [], 
                backgroundColor: color, // use the previously assigned color
                borderColor: borderColor, // use the previously assigned border color
                fill: false,
            };
    
            let datesAndScores = topicData.datesAndScores;
            for (let date in datesAndScores) {
                data.labels.push(date);
                data.data.push(datesAndScores[date]);
            }
    
            datasets.push(data);
        }
    
        // Prepare the final data for the Line chart
        let finalData = {
            labels: Object.keys(dataByTopic).sort(), // this will contain your x-axis labels (dates)
            datasets: datasets,
        };
    
        return (
            <LineChart data={finalData} options={options} />
        );
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
             <Header options={[{ label: 'Home', action: handleHomeClick }, { label: 'Profile', Icon: FaUser, action: handleProfileClick }, {label: 'Logout', action: handleLogoutClick}]}  />
              {userProfileDetails && <div className="user-profile-details">
                <div className="first-section">    
                    <UserCard firstName={userProfileDetails.firstName} lastName={userProfileDetails.lastName} email={userProfileDetails.email} />
                    <div className="quizzes-count" onClick={() => navigate('#quiz-history')}>
                        <p className="quiz-count">{userProfileDetails.quizList.length}</p>
                        <div className="quiz-count-info">
                            <p>{userProfileDetails.quizList.length === 1 ? "Quiz" : "Quizzes"} taken so far</p>
                            {userProfileDetails.quizList.length > 0 && <p>Last Quiz Date: {lastQuizDate()}</p>}
                        </div>
                    </div>
                </div> 
                <div className="performance-analysis">
                    <p className="performance-analysis-title">Performance Analysis</p>
                   {userProfileDetails.quizList.length > 0 ? 
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
                    :
                    <p className="no-quiz-history">Take a quiz to know your areas of strength and improvements. <span className="create-quiz-link" onClick = {handleCreateQuizOnUserProfileClick}>Let's quiz!</span></p>}
                </div>

                <div className="performance-analysis-by-topic">
                    {userProfileDetails.quizList.length > 0 ?
                        <>
                            <p className="performance-analysis-by-topic-title">Progress</p>
                            <div className="progress-by-topic">
                                {progressByTopic()}
                            </div>
                        </>
                        : null
                    }
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
        </div>}
        </>
    )
}

//<UserCard firstName={userProfileDetails.firstName} lastName={userProfileDetails.lastName} email={userProfileDetails.email} />
// 
export default UserProfile;