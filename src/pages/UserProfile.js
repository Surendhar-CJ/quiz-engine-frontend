import { useContext } from 'react';
import { QuizContext } from '../context/QuizContext';
import React, { useState } from 'react';
import { useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { baseURL } from '../config.js';
import BarChart from '../components/visual/BarChart';
import LineChart from '../components/visual/LineChart';
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import UserCard from '../components/UserProfileComponents/UserCard.js';
import QuizCard from '../components/UserProfileComponents/QuizCard';
import { useLocation } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import Modal from "../components/Modal";
import '../styles/UserProfile.css';

const UserProfile = () => {
    const contextValue = useContext(QuizContext);
    const navigate = useNavigate();
    const [userProfileDetails, setUserProfileDetails] = useState(null);
    const [sessionExpired, setSessionExpired] = useState(false);
    const quizHistoryRef = useRef(null);
    const [selectedOption, setSelectedOption] = useState('Me');
    const [isDeleteClicked, setIsDeleteClicked] = useState(false);
    const [deleteTopicId, setDeleteTopicId] = useState(null);
    const [refresh, setRefresh] = useState(false);

   
   
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
            }


            if(response.status === 400) {
                const data = await response.json();
                throw new Error(data.message);
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

    const handleOptionClick = (option) => {
        setSelectedOption(option);
    };

    const topicColorMapping = {
        // color mapping for each topicId
    };

    const strength = () => {
        const topics = contextValue.availableTopics;
        const averagePercentageByTopic = userProfileDetails.averageScoreByTopic;
    
        const colors = [
            'rgba(75,192,192,0.8)',
            'rgba(134,203,92,0.8)',
            'rgba(161,92,203,0.8)',
            'rgba(35,43,244,0.8)',
            'rgba(35,244,106,0.8)',
            
        ];
    
        const hoverColors = [
            'rgba(75,192,192,0.6)',
            'rgba(134, 203, 92, 0.6)',
            'rgba(161, 92, 203, 0.6)',
            'rgba(35, 43, 244, 0.6)',
            'rgba(35, 244, 106, 0.6)',
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
            'rgba(255,0,0,0.8)',
            'rgba(203,199,92,0.8)',
            'rgba(255,107,0,0.8)',
            'rgba(240,244,35,0.8)',
            'rgba(185,140,52,0.8)',
        ];
    
        const hoverColors = [
            'rgba(255,0,0,0.6)',
            'rgba(203,199,92,0.6)',
            'rgba(255,107,0,0.6)',
            'rgba(240,244,35,0.6)',
            'rgba(185,140,52,0.6)',
           
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
                        },
                        title: function(context) {
                            let dataset = context[0].dataset;
                            return dataset.label; // Shows the topic name as the title of the tooltip.
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
            labels: [], 
            datasets: [
                {
                    label: 'Your Average Score',
                    data: [], 
                    backgroundColor: [],
                    hoverBackgroundColor: [],
                    borderColor: [],
                    borderWidth: 1,
                    barThickness: 30,
                },
                {
                    label: 'Other Users\' Average Score',
                    data: [], 
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
    
            // apply lighter version of color for other's data, using hoverColor
            let otherColor = topicColors.hoverColor;
            let otherHoverColor = topicColors.hoverColor;
            let otherBorder = topicColors.border;
    
            data.labels.push(topicName);
            data.datasets[0].data.push(percentage);
            data.datasets[0].backgroundColor.push(color);
            data.datasets[0].hoverBackgroundColor.push(hoverColor);
            data.datasets[0].borderColor.push(border);
    
            data.datasets[1].data.push(otherPercentage);
            data.datasets[1].backgroundColor.push(otherColor);
            data.datasets[1].hoverBackgroundColor.push(otherHoverColor);
            data.datasets[1].borderColor.push(otherBorder);
        }
    
        return (
            <BarChart chartData={data} options={options} />
        );
    }
    
    
    
    const quizHistory = () => {
        const quizzes = userProfileDetails.quizList;

        quizzes.sort((a, b) => parseDate(b.createdAt) - parseDate(a.createdAt));

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

    const parseDate = (dateStr) => {
        // Split date and time
        let [date, time] = dateStr.split('T');
    
        // Split date into components
        let [year, month, day] = date.split('-');
    
        // Split time into components
        let [hour, minute, second] = time.split(':');
    
        // Remove fractional seconds if they exist
        second = second.split('.')[0];
    
        // Adjust month index (JavaScript months are 0-11)
        month = parseInt(month) - 1;
    
        // Create new date object
        let dateObj = new Date(year, month, day, hour, minute, second);
    
        return dateObj;
    }

    const lastQuizDate = () => {
        const quizzes = userProfileDetails.quizList;

        quizzes.sort((a, b) => parseDate(b.createdAt) - parseDate(a.createdAt));

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

    const handleCreateQuizOnUserProfileQuizzesClick = () => {
        navigate('/home');
    }


    const handleDeleteClick = (topicId, event) => {
        event.stopPropagation(); // prevents triggering the topic click when delete is clicked
        setIsDeleteClicked(true);
        setDeleteTopicId(topicId);
    }
    
    const handleConfirmDelete = async () => {
        const userId = userProfileDetails.userId;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${baseURL}/api/v1/topics/${deleteTopicId}/${userId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
            });
            
            if(response.status === 200) {
                setIsDeleteClicked(false);
                setDeleteTopicId(null);
                window.location.reload(); 
            }

        } catch (error) {
            console.error("Error:", error);
        }
    }
    
    const handleCancelDelete = () => {
        setIsDeleteClicked(false);
        setDeleteTopicId(null);
    }

  
    
    const quizTopicsCreated = () => {
        const topics = userProfileDetails.topicsCreated;
    
        return topics.map((topic, index) => (
            <div className="topic-created-card" key={index}>
                <div className="user-topic">
                    <p className="user-created-topic-name">{topic.name}</p>
                    <p className="current-rating">{topic.rating}<span className="golden-star">★</span><span className="raters-count">({topic.numberOfRaters})</span></p>
                </div>
                <button className="delete-button" onClick={(event) => handleDeleteClick(topic.id, event)}>
                    <FaTrash />
                </button>
                {
                    isDeleteClicked && deleteTopicId === topic.id &&
                    <Modal className= {isDeleteClicked ? 'visible' : ''}>
                        <p className="delete-topic">Are you sure you want to delete the quiz topic created?</p>
                        <div className="delete-buttons">
                            <button className="delete-topic-yes-button" type="submit" onClick={handleConfirmDelete}>Yes</button>
                            <button className="delete-topic-no-button" type="submit" onClick={handleCancelDelete}>No</button>
                        </div>
                    </Modal>
                }
            </div>
        ));
    }
    
    

    const hasCommonKeys = (obj1, obj2) => {
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);
    
        return keys1.some(key => keys2.includes(key));
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
            <Header options={[{ label: 'Home', action: handleHomeClick }, { label: 'Profile', action: handleProfileClick }, {label: 'Logout', action: handleLogoutClick}]}  /> 
              
              {userProfileDetails && <div className="user-profile-details">


                <div className="user-profile-options">
                     <p 
                        className={`option ${selectedOption === 'Me' ? 'options-active' : ''}`} 
                        onClick={() => handleOptionClick('Me')}
                    >
                        Me
                    </p>
                    <p 
                        className={`option ${selectedOption === 'My Progress' ? 'options-active' : ''}`} 
                        onClick={() => handleOptionClick('My Progress')}
                    >
                        My Progress
                    </p>
                    <p 
                        className={`option ${selectedOption === 'Quiz History' ? 'options-active' : ''}`} 
                        onClick={() => handleOptionClick('Quiz History')}
                    >
                        Quiz History
                    </p>
                    <p 
                        className={`option ${selectedOption === 'Quizzes created' ? 'options-active' : ''}`} 
                        onClick={() => handleOptionClick('Quizzes created')}
                    >
                        Quizzes created
                    </p>
                </div>
                

                {selectedOption === 'Me' && (
                    <div className="first-section">    
                        <UserCard firstName={userProfileDetails.firstName} lastName={userProfileDetails.lastName} email={userProfileDetails.email} />
                        <div className="quizzes-count" onClick={() => setSelectedOption('Quiz History')}>
                            <p className="quiz-count">{userProfileDetails.quizList.length}</p>
                            <div className="quiz-count-info">
                                <p>{userProfileDetails.quizList.length === 1 ? "Quiz" : "Quizzes"} taken so far</p>
                                {userProfileDetails.quizList.length > 0 && <p>Last Quiz Date: {lastQuizDate()}</p>}
                            </div>
                        </div>
                    </div>
                )}

                {selectedOption === 'My Progress' && (
                <>
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
                            <p className="performance-analysis-by-topic-title">My Performance Over Time</p>
                            <div className="progress-by-topic">
                                {progressByTopic()}
                            </div> 
                </div> }


                {
                    hasCommonKeys(userProfileDetails.averagePercentageByOtherUsersPerTopic, userProfileDetails.averageScoreByTopic) &&
                    <div className="comparison-chart">
                        <p className="comparison-bar-title">Benchmarking with Learning Community</p>
                        <div className="comparison-bar-chart-picture">
                            {comparisonChart()}
                        </div>
                    </div> 
                }
               

               </>
            )}

            {selectedOption === 'Quiz History' && (
                <div className="quiz-history" ref={quizHistoryRef}>
                    <p className="quiz-history-title">Quiz History</p>
                    <div className="quiz-history-cards">
                        {userProfileDetails.quizList.length > 0 ? quizHistory() : <p className="no-quiz-history-last">You haven't challenged yourself with a quiz yet. <span className="create-quiz-link" onClick = {handleCreateQuizOnUserProfileClick}>Let's change that!</span></p>}
                    </div>
                </div>
            )}

            {selectedOption === 'Quizzes created' && (
                <>
                {userProfileDetails.topicsCreated.length > 0  ?
                <div className="topics-created">
                    <p className="topics-created-title">Quizzes created</p>
                    <div className="topics-created-cards">
                        {quizTopicsCreated()}
                    </div>
                </div>
                
                    :
                    <div className= "no-quiz">
                    <p className="no-quiz-created">No quizzes created yet. <span className="create-quiz-link" onClick = {handleCreateQuizOnUserProfileQuizzesClick}>Would you like to try?</span></p>
                    </div>
                    }
                </>
                )}

              </div> 
            

            }
             <Footer />
        </div>}
        </>
    )
}

// 
export default UserProfile;