import React, { useState } from 'react';
import { useContext } from 'react';
import { QuizContext } from '../context/QuizContext';
import { baseURL } from '../config.js';
import { useNavigate } from "react-router-dom";
import {useErrorHandler} from "../hooks/useErrorHandler";
import Modal from "../components/Modal";


const ViewQuestions = () => {

    return (
        <div className = "view-questions">

        </div>
    )

}

export default ViewQuestions;