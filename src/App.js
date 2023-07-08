import React, { useState } from 'react';
import LandingPage from './pages/LandingPage.js';
import Home from './pages/Home.js';
import QuizConfiguration from './components/QuizConfiguration.js';
import Quiz from './pages/Quiz.js';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import PrivateRoute from "./routes/PrivateRoute.js";


const App = () => {
  
  return ( 
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/quiz" element={<Quiz />} />
      </Routes>
    </BrowserRouter>
    ); 
}

export default App;
