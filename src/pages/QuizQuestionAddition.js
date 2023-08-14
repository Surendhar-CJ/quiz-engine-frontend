import { useContext } from 'react';
import { QuizContext } from '../context/QuizContext';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Home from './Home';
import { baseURL } from '../config.js';
import Modal from "../components/Modal";
import CreateQuiz from '../components/CreateQuiz.js';
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import "../styles/QuizQuestionAddition.css";
import { useLocation } from 'react-router-dom';
import { useErrorHandler } from '../hooks/useErrorHandler';



const QuizQuestionAddition = () => {
    
    const [formSubmitted, setFormSubmitted] = useState(null);
    const [showQuestionSubmitted, setShowQuestionSubmitted] = useState(false);
    const [sessionExpired, setSessionExpired] = useState(false);
    const [showSubtopicInput, setShowSubtopicInput] = useState(false);
    const [subtopics, setSubtopics] = useState([]);
    const [showCreateQuiz, setShowCreateQuiz] = useState(false);
    const [formData, setFormData] = useState(
        {
            topicId: '',
            subtopic:'',
            questionType: '',
            difficultyLevel: '',
            questionText:'',
            choices:'',
            explanation:'',
            score:''
        }
    );
    const [choices, setChoices] = useState([
        { text: '', isCorrect: false }
    ]);
    const [correctAnswerIndex, setCorrectAnswerIndex] = useState(-1);  

    
    const location = useLocation();
    const contextValue = useContext(QuizContext);
    const navigate = useNavigate();
    const handleError = useErrorHandler();


    const availableTopics = JSON.parse(localStorage.getItem("topics"));

    const handleCreateQuizClick = () => {
        setShowCreateQuiz(true);
    }
  
    const toggleShowCreateQuiz = () => {
        setShowCreateQuiz(!showCreateQuiz);
    }
        

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
    
    
    
    const topicElements = availableTopics.map(topic => {
        return (
            <option 
                key={topic.id}
                value={topic.id}
                name={topic.name}
            >
                {topic.name}
            </option>  
        )
    })

    const questionTypeElements = () => {
        const questionTypes = ["Multiple Choice", "True or False", "Multiple Answer"]
       return questionTypes.map(questionType => {
            return (
                <option
                    key={questionType}
                    value={questionType}
                    name={questionType}
                >
                    {questionType}
                </option>    
            )
        })
    }

    const difficultyElements = () => {
        const difficultyTypes = ["Easy", "Medium", "Hard"]
       return difficultyTypes.map(difficultyType => {
            return (
                <option
                    key={difficultyType}
                    value={difficultyType}
                    name={difficultyType}
                >
                    {difficultyType}
                </option>    
            )
        })
    }


   
   
    const getSubtopics = (topicId) => {
        const selectedTopic = availableTopics.find(topic => topic.id == topicId);
        return selectedTopic ? selectedTopic.subtopics : [];
    };
    

    
    const handleChange = (event) => {
        if(event.target.name === "questionType") {
            setChoices([{ text: '', isCorrect: false }]);
            setCorrectAnswerIndex(-1);
        }
    
        if (event.target.name === "topicId") {
            // retrieve subtopics when topicId changes
            const newSubtopics = getSubtopics(event.target.value);
            setSubtopics(newSubtopics);
            setFormData({ ...formData, subtopic: "" }); 
            setShowSubtopicInput(false);
        }
    
        if (event.target.name === "subtopic") {
            if (event.target.value === "new") {
                // If user selects 'Add New Subtopic', show the subtopic input field
                setShowSubtopicInput(true);
                setFormData({ ...formData, subtopic: "" });
            } else if (!showSubtopicInput) {
                // If an existing subtopic is selected, hide the input field only if it's currently hidden
                setShowSubtopicInput(false);
            }
        }
    
        setFormData((prevFormData) => ({
            ...prevFormData,
            [event.target.name]: event.target.value
        }))
    };
    
    
  
    
    const handleChoiceTextChange = (event, index) => {
        const newChoices = choices.map((choice, i) => {
            if (i === index) {
                return { ...choice, text: event.target.value };
            } else {
                return choice;
            }
        });

        setChoices(newChoices);
    };

    
    const handleCorrectAnswerChange = (event, index) => {
        const isCorrect = event.target.value === "true";
        if(formData.questionType === "Multiple Answer") {
            // For multiple answer type question, we don't reset other options
            const newChoices = choices.map((choice, idx) => 
                idx === index ? { ...choice, isCorrect } : choice
            );
            setChoices(newChoices);
        } else {
            // Existing logic for single correct answer types
            if (isCorrect) {
                setCorrectAnswerIndex(index);
                const newChoices = choices.map((choice, idx) => 
                    idx === index ? { ...choice, isCorrect: true } : { ...choice, isCorrect: false }
                );
                setChoices(newChoices);
            } else {
                if (index === correctAnswerIndex) {
                    setCorrectAnswerIndex(-1);
                }
            }
        }
    };
    
    
    const handleCorrectAnswerChangeForTF = (event, index) => {
        const isCorrect = event.target.value === "true";
    
        if (isCorrect) {
            if (index !== correctAnswerIndex) {
                // if different option is selected, we swap the correctness
                setCorrectAnswerIndex(index);
                const newChoices = ['True', 'False'].map((choice, idx) => 
                    idx === index ? { text: choice, isCorrect: true } : { text: choice, isCorrect: false }
                );
                setChoices(newChoices);
            }
        } else {
            if (index === correctAnswerIndex) {
                // if the incorrect answer is the previously correct one, reset the correct answer index
                setCorrectAnswerIndex(-1);
                const newChoices = ['True', 'False'].map((choice, idx) => 
                    idx === index ? { text: choice, isCorrect: false } : { text: choice, isCorrect: true }
                );
                setChoices(newChoices);
            }
        }
    };


    const handleAddChoice = () => {
        setChoices([...choices, { text: '', isCorrect: false }]);
    };

    const handleRemoveChoice = () => {
        const newChoices = choices.slice(0, -1); // creates a new array without the last element
        setChoices(newChoices);
    };
    
    
    
    const submitClick = (event) => {
        event.preventDefault(); // prevent default form submission
    
        // Transform array of choices to map
        let choicesMap = {};
        choices.forEach((choice, index) => {
            // Only add non-empty choices
            if (choice.text.trim() !== "") {
                choicesMap[choice.text] = formData.questionType === "True or False" ? index === correctAnswerIndex : choice.isCorrect;
            }
        });
    
        // Update formData to include choices
        setFormData((prevFormData) => ({
            ...prevFormData,
            choices: choicesMap
        }));
    
        setFormSubmitted(true);
    }


    const resetForm = () => {
        setFormData({
            topicId: '',
            subtopic: '',
            questionType: '',
            difficultyLevel: '',
            questionText:'',
            choices:'',
            explanation:'',
            score:''
        });
        setChoices([{ text: '', isCorrect: false }]);
        setCorrectAnswerIndex(-1);
        setShowSubtopicInput(false);
        window.scrollTo(0, 0);
    };
    
    
    const handleQuizQuestionSubmittedClick = () => {
        setShowQuestionSubmitted(!showQuestionSubmitted);
        getTopics();
        resetForm();
    };

    
    const handleQuizQuestionSubmittedExitClick = () => {
        setShowQuestionSubmitted(!showQuestionSubmitted);
        navigate('/home');
    };



    const postSubmitClick = async () => {
        if(formData.subtopic === '') {
            setFormData(prevFormData => {
                return {
                    ...prevFormData,
                    subtopic: null
                };
            });
        }

        const user = contextValue.user ? contextValue.user : JSON.parse(window.localStorage.getItem('user')); 

        // Prepare the data to be sent.
        const dataToSend = {
            ...formData,
            userId: user.id  // Add userId to the data
        };
 
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${baseURL}/api/v1/questions`, 
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(dataToSend)
                
            });

            if(response.status === 403) {
               // setSessionExpired(true);
            }

            if(response.status === 201) {
                setShowQuestionSubmitted(true);                    
            }
            else {
                const error = await response.json();
                throw new Error(error.message);
            }
            
            } catch(error) {
                 handleError(error); 
            }
    }


    const getTopics = async() => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${baseURL}/api/v1/topics`, {
                headers: {
                    'Authorization': `Bearer ${token}`, // include token in headers
                },
            });
    
            if(response.status === 403) {
                setSessionExpired(true);
            }
    
            if(response.status === 200) {
                const data = await response.json();
                contextValue.setAvailableTopics(data);
                localStorage.setItem('topics', JSON.stringify(data));
            } 
    
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }
        } catch(error) {
            if (error.name === 'TypeError' || error.message === 'Failed to fetch') {
                handleError('An error occurred while trying to reach the server. Please try again.');
            } else if (error.message === 'Network response was not ok') {
                handleError('There was a problem with the network response.');
            } else {
                handleError(error);
            }
        }
    };
    



    React.useEffect(() => {
        if (formData.questionType) {
            setChoices(choices.map(choice => ({...choice, isCorrect: false})));
            setCorrectAnswerIndex(-1);
        }
    }, [formData.questionType]);
    



    React.useEffect(() => {
        if (formSubmitted) {
            postSubmitClick();
            setFormSubmitted(false);  // Reset formSubmitted to false
        }
    }, [formData, formSubmitted]);



    React.useEffect(() => {
        window.scrollTo(0, 0);
      }, [location.pathname]);


    React.useEffect(() => {
        const storedUser = JSON.parse(window.localStorage.getItem('user'));
        
        if(storedUser !== null) {
            contextValue.setUser(storedUser);
        }
        window.scrollTo(0, 0);
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

        {showCreateQuiz &&
                    <Modal
                        show={showCreateQuiz}
                        onClose={toggleShowCreateQuiz}
                        className={showCreateQuiz ? 'visible' : ''}
                    >
                        <CreateQuiz userId={contextValue.user.id}/>
                    </Modal> 
        }

        {<div className="question-addition-page">
            <Header options={[{ label: 'Create+', action: handleCreateQuizClick }, { label: 'Home', action: handleHomeClick }, { label: 'Profile', action: handleProfileClick }, {label: 'Logout', action: handleLogoutClick}]}  />
           
            <div className="question-addition-main">
                <h2 className="add-question-title">Add Question</h2>
                <div className="question-addition-guidelines">
                    <p className="guidelines"> 
                        Your questions play a vital role in our learning community. When creating questions, please ensure they are of high quality, accurate, and appropriate. Remember, the quizzes will be rated by your peers, take special care especially when contributing questions to the other creator's quiz topic. Your thoughtful contributions help shape our collective knowledge base. Thank you for your efforts!
                    </p>
                </div>

                
            
                
                <form className="question-addition-form" onSubmit={submitClick}>
                    
                    <div className="question-addition-topic">
                           <label htmlFor="topicId">Select the topic</label> 
                           <select
                                id="topicId"
                                value={formData.topicId}
                                onChange={handleChange}
                                name="topicId"
                                required
                            >
                                <option value="">--Select--</option>
                                {topicElements}
                            </select>       
                    </div>

                    <div className="question-addition-subtopic">
                        <label htmlFor="subtopic">Select the subtopic for the question or add a new sub topic.<br></br>(optional) </label>
                        {showSubtopicInput ? (
                            <>
                                <input 
                                    type="text" 
                                    value={formData.subtopic} 
                                    onChange={handleChange} 
                                    placeholder="Enter new subtopic" 
                                    name="subtopic"
                                /> 
                                <button type="button" onClick={() => setShowSubtopicInput(false)} className="cancel-subtopic-button">Cancel</button>
                            </>
                        ) : (
                            <select value={formData.subtopic} onChange={handleChange} name="subtopic">
                                <option value="">Select Subtopic</option>
                                {subtopics.map(subtopic => (
                                    <option value={subtopic.name} key={subtopic.id}>
                                        {subtopic.name}
                                    </option>
                                ))}
                                <option value="new">Add New Subtopic</option>
                            </select>
                        )}
                </div>




                    <div className="question-addition-type">    
                           <label htmlFor="questionType">Question type </label> 
                           <select
                                id="questionType"
                                value={formData.questionType}
                                onChange={handleChange}
                                name="questionType"
                                required
                            >
                                <option value="">--Select--</option>
                                {questionTypeElements()}
                            </select>  
                    </div>

                    <div className="question-addition-text">
                        <label htmlFor="questionText">Question text </label>   
                        <textarea 
                            value={formData.questionText}
                            placeholder="Question"
                            onChange={handleChange}
                            name="questionText"
                            required
                        />
                    </div>

                    <div className="question-addition-options">
                        <label htmlFor="choices">Options </label>
                        {formData.questionType === "True or False" ? 
                            ['True', 'False'].map((choice, index) => (
                                <div key={index} className="true-false">
                                    <label>{choice}</label>
                                    <select 
                                        value={choice.isCorrect}
                                        onChange={event => handleCorrectAnswerChangeForTF(event, index)}
                                    >
                                        <option className="tf-first" value={false}>Incorrect</option>
                                        <option className="tf-second"value={true}>Correct</option>
                                    </select>
                                </div>
                            ))
                            :
                            choices.map((choice, index) => (
                                <div key={index} className="mcq-maq">
                                    <input 
                                        type="text" 
                                        value={choice.text} 
                                        onChange={event => handleChoiceTextChange(event, index)} 
                                        placeholder="Choice" 
                                    />
                                    <select 
                                        value={choice.isCorrect}
                                        onChange={event => handleCorrectAnswerChange(event, index)}
                                    >
                                        <option value={false}>Incorrect</option>
                                        <option value={true}>Correct</option>
                                    </select>
                                </div>
                            ))
                        }
                       {["Multiple Choice", "Multiple Answer"].includes(formData.questionType) && 
                        <div className="choice-buttons">
                            <button type="button" onClick={handleAddChoice} className="add-choice-button">Add Choice</button>
                            {choices.length > 1 && <button type="button" onClick={handleRemoveChoice} className="remove-choice-button">Remove Choice</button>}
                        </div>
                    }
                    </div>

                    <div className="question-addition-correct-answer-explanation">
                        <label htmlFor="explanation">Provide an explanation for the correct answer(s)</label>   
                        <textarea 
                            value={formData.explanation}
                            placeholder="Explanation"
                            onChange={handleChange}
                            name="explanation"
                            required
                        />
                    </div>
                    
                    <div className="question-addition-difficulty">
                           <label htmlFor="difficultyLevel">What do you think the difficulty level of the question should be? </label> 
                           <select
                                id="difficultyLevel"
                                value={formData.difficultyLevel}
                                onChange={handleChange}
                                name="difficultyLevel"
                                required
                            >
                                <option value="">--Select--</option>
                                {difficultyElements()}
                            </select>
                    </div>
                    
                    <div className="question-addition-score">
                        <label htmlFor="score">Would you like to give a score to the question?<br></br>(optional)
                                              </label>   
                        <input
                            type="number"
                            min="1"
                            value={formData.score}
                            placeholder="Score"
                            onChange={handleChange}
                            name="score"
                        />
                    </div>

                    <div className="question-addition-submit-button">
                        <button type="submit">Submit</button>
                        <button type="reset" onClick={resetForm}>Reset</button>
                    </div>

                </form>

            </div>

            <Modal id="quiz-question-submitted-modal" className={showQuestionSubmitted ? 'visible' : ''} show={showQuestionSubmitted}>
                    <div className="quiz-question-submitted">
                        <p>Quiz question submitted successfully</p>
                        <button type="submit" onClick={handleQuizQuestionSubmittedClick}>Add New Question</button>
                        <button type="submit" onClick={handleQuizQuestionSubmittedExitClick}>Exit</button>
                    </div>
            </Modal>  

            <Footer />
        </div>}
        </>
    )


}

export default QuizQuestionAddition;