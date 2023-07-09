import React, { useState } from 'react';
import { QuizContext, QuizContextProvider } from "./context/QuizContext.js"
import LandingPage from './pages/LandingPage.js';
import Home from './pages/Home.js';
import QuizConfiguration from './components/QuizConfiguration.js';
import Quiz from './pages/Quiz.js';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import PrivateRoute from "./routes/PrivateRoute.js";


const App = () => {

  const [text, setText] = useState("");
  
  return ( 
    <div>
      <QuizContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/quiz" element={<Quiz />} />
          </Routes>
        </BrowserRouter>
      </QuizContextProvider>
    </div>
    ); 
}

export default App;
