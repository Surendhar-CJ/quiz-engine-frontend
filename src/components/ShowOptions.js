

import React, { useState } from 'react';
import { useContext } from 'react';
import { QuizContext } from '../context/QuizContext.js';
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { baseURL } from '../config.js';
import '../styles/ShowOptions.css';


const ShowOptions = (props) => {

    const contextValue = useContext(QuizContext);

    const { onViewQuestionsClick, onQuizConfigClick } = props;

    return (
        <div className="show-options">
            <h3 className="topic-name-options">{contextValue.topic.name}</h3>
            <button id="view-questions-button" type="submit" onClick={onViewQuestionsClick}>
                <p>Questions</p>
            </button>
            <button id="quiz-config-button" type="submit" onClick={onQuizConfigClick}>
                <p>Take Quiz</p>
            </button>
        </div>
    )
}

export default ShowOptions;
