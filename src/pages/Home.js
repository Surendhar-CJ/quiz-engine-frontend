
import React, { useState } from 'react';
import { useContext } from 'react';
import { QuizContext } from '../context/QuizContext.js';
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { baseURL } from '../config.js';
import {Puff} from 'react-loader-spinner';
import Header from '../components/Header.js';
import Topic from '../components/Topic.js';
import Footer from '../components/Footer.js';
import "../styles/Home.css";
import QuizConfiguration from '../components/QuizConfiguration.js';
import CreateQuiz from '../components/CreateQuiz.js';
import { useErrorHandler } from '../hooks/useErrorHandler';
import Modal from '../components/Modal';
import { useRef } from 'react';


const Home = () => {
    const [showQuizConfig, setShowQuizConfig] = useState(false);
    const [selectedTopicId, setSelectedTopicId] = useState(null);
    const [isTopicSearched, setIsTopicSearched] = useState(null);
    const [isTopicFound, setIsTopicFound] = useState(false);
    const [sessionExpired, setSessionExpired] = useState(false);
    const [showCreateQuiz, setShowCreateQuiz] = useState(false);
    const [topics, setTopics] = useState([]);
    const [loadingTopics, setLoadingTopics] = useState(true);

    

    const navigate = useNavigate();
    const contextValue = useContext(QuizContext);
    const handleError = useErrorHandler();
    const createTopicButtonRef = useRef(null);
    const location = useLocation();


    const quizTopics = JSON.parse(localStorage.getItem('topics'));

    
    const handleHomeClick = () => {
        //rStays at the same page
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


    const handleOnTopicClick = (topicId) => {
        setSelectedTopicId(topicId);

        const selectedTopic = topics.find(topic => topic.id === topicId);
        contextValue.setTopic(selectedTopic);
        localStorage.setItem('topic', JSON.stringify(selectedTopic));
        
        setShowQuizConfig(true);
    }

    const toggleQuizConfig = () => {
        setShowQuizConfig(!showQuizConfig);
    }

    const handleCreateQuizClick = () => {
        setShowCreateQuiz(true);
    }

    const toggleShowCreateQuiz = () => {
        setShowCreateQuiz(!showCreateQuiz);
    }

    const handleAddQuestionClick = () => {
        navigate('/add-question');
    }

    
    
    const topicElements = topics.map(topic => <Topic 
        key={topic.id} 
        id={topic.id} 
        name={topic.name}
        rating={topic.rating}
        numberOfRaters={topic.numberOfRaters}
        createdBy={topic.userName}
        numberOfQuestions={topic.numberOfQuestions}
        onTopicClick={handleOnTopicClick}
      />
    )

    const getTopic = () => {
        const topic = contextValue.searchedTopic;
        if (topic === null) {
            return null; 
        }
        return (
            <Topic 
                id={topic.id} 
                name={topic.name}
                rating={topic.rating}
                numberOfRaters={topic.numberOfRaters}
                createdBy={topic.userName}
                numberOfQuestions={topic.numberOfQuestions}
                onTopicClick={handleOnTopicClick}
            />
        )
    }
    

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {  // Check if the pressed key is 'Enter'
            const searchValue = event.target.value;
            if (searchValue.trim() !== '') { // Check if the search value is not empty
                searchTopic(searchValue);
            } else {
                setIsTopicSearched(false);
            }
        }
    };

    const handleWhyNotLink = () => {
       setShowCreateQuiz(true);
    }

    const handleCheckProgressClick = () => {
        navigate('/profile');
    }
    

    const searchTopic = async(name) =>  {
        contextValue.setSearchedTopic(null);
        try {
           const token = localStorage.getItem('token');
           const response =  await fetch(`${baseURL}/api/v1/topics/${name}`, {
                headers: {
                    'Authorization': `Bearer ${token}`, // include token in headers
                },
            });

            setIsTopicSearched(true);

            if(response.status === 403) {
                setSessionExpired(true);
            }
            
            
           if(response.status === 302) {
                const data = await response.json();
                contextValue.setSearchedTopic(data);
                setIsTopicFound(true);

           } else if (response.status === 404 && response.message === "Topic not found") {
                setIsTopicFound(false);
           }
           else {
            const error = await response.json();
            throw new Error(error.message);
        }
        
        } catch(error) {
            if (error.name === 'TypeError' || error.message === 'Failed to fetch') {
                handleError('An error occurred while trying to reach the server. Please try again');
            } else {
                handleError(error);
            }
        }
    };



    

        const getTopics = async() =>  {
            try {
                setLoadingTopics(true); // Set loading state to true before the request
                const token = localStorage.getItem('token');
                const response =  await fetch(`${baseURL}/api/v1/topics`, {
                    headers: {
                        'Authorization': `Bearer ${token}`, // include token in headers
                    },
                });

                if(response.status === 403) {
                    setSessionExpired(true);
                }
                
                if(response.status === 200) {
                    const data = await response.json();
                    setTopics(data);
                    contextValue.setAvailableTopics(data);
                    localStorage.setItem('topics', JSON.stringify(data));
                } else {
                    const error = await response.json();
                    throw new Error(error.message);
                }
            } catch(error) {
                if (error.name === 'TypeError' || error.message === 'Failed to fetch') {
                    handleError('An error occurred while trying to reach the server. Please try again');
                } else {
                    handleError(error);
                }
            } finally {
                setLoadingTopics(false); // Set loading state to false after the request
            }
        };

    React.useEffect(() => {
        window.scrollTo(0, 0);
        }, [location.pathname]);
            

    React.useEffect(() => {
        const storedUser = JSON.parse(window.localStorage.getItem('user'));
        
        if(storedUser !== null) {
            contextValue.setUser(storedUser);
        }
        
        getTopics();
        
    }, []);

   

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
        {contextValue.user &&  contextValue.availableTopics &&
        <div className="home-page">
            <Header options={[{ label: 'Create+', action: handleCreateQuizClick }, { label: 'Home', action: handleHomeClick }, { label: 'Profile', action: handleProfileClick }, {label: 'Logout', action: handleLogoutClick}]}  />
           
            <div className="home-content">
                <h1 className="welcome">Welcome, <span className="welcome-user-name">{contextValue.user.firstName}</span> !</h1>
               
                
                <div className="create-add">
                    <div className="add-topic-box">
                        <button ref={createTopicButtonRef} type="submit" className="add-topic-intro" onClick={handleCreateQuizClick}>Create Quiz</button> 
                    </div>
                    { contextValue.availableTopics.length > 0 &&

                        <div className="contribute-box">
                            <button type="submit" className="add-question-intro" onClick={handleAddQuestionClick}>Add Question</button>
                        </div>
                    }
                    
                </div>
                
                
                <div className="search-intro">
                    <p>Pick a topic, configure it and quiz</p>
                </div>
               
                <div className="search-div">
                <input
                    type="search"
                    className="search-bar"
                    placeholder="Search for a topic"
                    onKeyPress={handleKeyPress} 
                    required
                />
                </div>

               
                { isTopicSearched &&
                    <div className="searched-topic"> 
                        {isTopicFound && contextValue.searchedTopic?
                            getTopic()
                                :
                            <div className="not-found-div">
                                <p className="not-found">Sorry, topic not found. <br></br><br></br><span className="not-found-create-link" onClick={handleWhyNotLink}>Why not create one?</span></p>
                            </div>
                        }
                    </div>
                 }
                {quizTopics.length !== 0 ? 
                    <p className="pick-topic-intro"></p>
                                :
                    null
                }

                <div className="topics-list">
                    {loadingTopics ? (
                        <div className="home-loading">
                        <Puff className
                        color="#00BFFF"
                        height={100}
                        width={100}
                        timeout={3000} //3 secs
                        />
                        </div>
                    ) : (
                        <>
                            {topicElements}
                            <Modal 
                                show={showQuizConfig} 
                                onClose={toggleQuizConfig}
                                className={showQuizConfig ? 'visible' : ''}
                            >
                                {showQuizConfig && <QuizConfiguration topicId={selectedTopicId}  />}
                            </Modal>
                        </>
                    )}
                </div>



                 {showCreateQuiz &&
                    <Modal
                        show={showCreateQuiz}
                        onClose={toggleShowCreateQuiz}
                        className={showCreateQuiz ? 'visible' : ''}
                    >
                        <CreateQuiz userId={contextValue.user.id}/>
                    </Modal> 
                }
                  
                
                <div className="to-profile">
                    <p className="to-profile-performance">Check your progress and activity</p>
                    <button className="go-to-profile" type="button" onClick={handleCheckProgressClick}>Show</button>
                </div>

            </div>

            

            <Footer />
        </div> }
        </>
         
    )
}

export default Home;