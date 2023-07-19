import { useContext } from 'react';
import { QuizContext } from '../context/QuizContext';
import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import "../styles/QuizQuestionAddition.css";


const QuizQuestionAddition = () => {
    const contextValue = useContext(QuizContext);
    const navigate = useNavigate();
    const [formSubmitted, setFormSubmitted] = useState(null);
    const [showQuestionSubmitted, setShowQuestionSubmitted] = useState(false);
 
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
    
    const availableTopics = JSON.parse(localStorage.getItem("topics"))

    
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


    const [formData, setFormData] = useState(
        {
            topicId: '',
            questionType: '',
            difficultyLevel: '',
            questionText:'',
            choices:'',
            explanation:'',
            score:''
        }
    );

    const handleChange = (event) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [event.target.name]: event.target.value
        }))
    };

    const [choices, setChoices] = useState([
        { text: '', isCorrect: false }
    ]);
    const [correctAnswerIndex, setCorrectAnswerIndex] = useState(-1);  // For single correct answer types
    
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
    


    const postSubmitClick = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch("http://localhost:9090/api/v1/questions", 
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
                
            });


            if(response.status === 201) {
                    const data = await response.json();
                    setShowQuestionSubmitted(true);
                    console.log(data)
                    
            }
        }
         catch(error) {
            console.log("Error : ", error);
        }
    }



    React.useEffect(() => {
        if (formSubmitted) {
            postSubmitClick();
            setFormSubmitted(false);  // Reset formSubmitted to false
        }
    }, [formData, formSubmitted]);


  
    const resetForm = () => {
        setFormData({
            topicId: '',
            questionType: '',
            difficultyLevel: '',
            questionText:'',
            choices:'',
            explanation:'',
            score:''
        });
        setChoices([{ text: '', isCorrect: false }]);
        setCorrectAnswerIndex(-1);
    };


    
    const handleQuizQuestionSubmittedClick = () => {
        setShowQuestionSubmitted(!showQuestionSubmitted);
        
        // Call the reset function
        resetForm();
    };

    
    const handleQuizQuestionSubmittedExitClick = () => {
        setShowQuestionSubmitted(!showQuestionSubmitted);
        navigate('/home');
    };



    return (
        <div className="question-addition-page">
            <Header options={[{ label: 'Home', action: handleHomeClick }, { label: 'Profile', Icon: FaUser, action: handleProfileClick }, {label: 'Logout', action: handleLogoutClick}]}  />
            <div className="question-addition-main">
                <h2 className="add-question-title">Add Question</h2>
                <form className="question-addition-form" onSubmit={submitClick}>
                    
                    <div className="question-addition-topic">
                           <label htmlFor="topicId">Which topic would you like to add question to? </label> 
                           <select
                                id="topicId"
                                value={formData.topicId}
                                onChange={handleChange}
                                name="topicId"
                            >
                                <option value="">--Select--</option>
                                {topicElements}
                            </select>       
                    </div>

                    <div className="question-addition-type">    
                           <label htmlFor="questionType">Question type </label> 
                           <select
                                id="questionType"
                                value={formData.questionType}
                                onChange={handleChange}
                                name="questionType"
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
                        />
                    </div>

                    <div className="question-addition-options">
                        <label htmlFor="choices">Options </label>
                        {formData.questionType === "True or False" ? 
                            ['True', 'False'].map((choice, index) => (
                                <div key={index} className="true-false">
                                    <label>{choice}</label>
                                    <select 
                                        onChange={event => handleCorrectAnswerChangeForTF(event, index)}
                                    >
                                        <option value={false}>Incorrect</option>
                                        <option value={true}>Correct</option>
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
                                        onChange={event => handleCorrectAnswerChange(event, index)}
                                    >
                                        <option value={false}>Incorrect</option>
                                        <option value={true}>Correct</option>
                                    </select>
                                </div>
                            ))
                        }
                        {["Multiple Choice", "Multiple Answer"].includes(formData.questionType) && 
                            <button type="button" onClick={handleAddChoice} className="add-choice-button">Add Choice</button>
                        }
                    </div>

                    <div className="question-addition-correct-answer-explanation">
                        <label htmlFor="explanation">Provide an explanation on why the choice(s) is the correct answer</label>   
                        <textarea 
                            value={formData.explanation}
                            placeholder="Explanation"
                            onChange={handleChange}
                            name="explanation"
                        />
                    </div>
                    
                    <div className="question-addition-difficulty">
                           <label htmlFor="difficultyLevel">Question type What do you think the difficulty level of the question should be? </label> 
                           <select
                                id="difficultyLevel"
                                value={formData.difficultyLevel}
                                onChange={handleChange}
                                name="difficultyLevel"
                            >
                                <option value="">--Select--</option>
                                {difficultyElements()}
                            </select>
                    </div>
                    
                    <div className="question-addition-score">
                        <label htmlFor="score">Would you like to give a score to the question? <br></br>If not given, score will be assigned based on its difficulty level. </label>   
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
        </div>
    )


}

export default QuizQuestionAddition;