import React, { useState } from 'react';
import { QuizContext, QuizContextProvider } from "./context/QuizContext.js"
import LandingPage from './pages/LandingPage.js';
import Home from './pages/Home.js';
import Quiz from './pages/Quiz.js';
import QuizResult from './pages/QuizResult.js';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import QuizDetailedResults from './pages/QuizDetailedResults.js';
import UserProfile from './pages/UserProfile.js';
import QuizQuestionAddition from './components/QuizQuestionAddition.js';


const App = () => {

  return ( 
    <div>
      <QuizContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/result" element={<QuizResult />} />
            <Route path="/detailed-results" element={<QuizDetailedResults />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/add-question" element ={<QuizQuestionAddition />} />
          </Routes>
        </BrowserRouter>
      </QuizContextProvider>
    </div>
    ); 
}

export default App;
