import React, { useState } from 'react';
import { QuizContext, QuizContextProvider } from "./context/QuizContext.js"
import LandingPage from './pages/LandingPage.js';
import Home from './pages/Home.js';
import Quiz from './pages/Quiz.js';
import QuizResult from './pages/QuizResult.js';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import QuizDetailedResults from './pages/QuizDetailedResults.js';
import UserProfile from './pages/UserProfile.js';
import QuizQuestionAddition from './pages/QuizQuestionAddition.js';
import PrivateRoute from './components/PrivateRoute.js';
import { ToastContainer, toast  } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ViewQuestions from './pages/ViewQuestions.js';


const App = () => {

  return ( 
    <div>
      <QuizContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/quiz" element={<PrivateRoute><Quiz /></PrivateRoute>} />  
            <Route path="/result" element={<PrivateRoute><QuizResult /></PrivateRoute>} />  
            <Route path="/detailed-results" element={<PrivateRoute><QuizDetailedResults /></PrivateRoute>} /> 
            <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
            <Route path="/add-question" element={<PrivateRoute><QuizQuestionAddition /></PrivateRoute>} />
            <Route path="/view-questions" element={<PrivateRoute><ViewQuestions /></PrivateRoute>} />   
          </Routes>
        </BrowserRouter>
      </QuizContextProvider>
      <ToastContainer position={toast.POSITION.BOTTOM_CENTER} />
    </div>
  ); 
}

export default App;
