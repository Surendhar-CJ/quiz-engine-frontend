import React, { useState } from 'react';
import Footer from "../components/Footer";
import Modal from "../components/Modal";
import TestHeader from "../components/TestHeader";
import StartQuiz from '../components/StartQuiz';




const Quiz = () => {   

    const [quizStarted, setQuizStarted] = useState(false);

    const startQuiz = () => {
        setQuizStarted(true);     
    }



    return (
        <div>
            <TestHeader />
            {quizStarted ? 
             <p>Quiz Started</p> : 
             <div>
                <Modal show={startQuiz}><StartQuiz onClick ={startQuiz}/></Modal> 
             </div>
            }
        </div>
    )

}

export default Quiz;