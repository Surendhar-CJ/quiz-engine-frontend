import { createContext, useState } from 'react';

const QuizContext = createContext("");


const QuizContextProvider = ({children}) => {

    const [user, setUser] = useState(null);
    const [topic, setTopic] = useState(null);
    const [quizDetails, setQuizDetails] = useState(null);
    const [quizResult, setQuizResult] = useState(null);

    return (
        <QuizContext.Provider value = {{user, setUser, topic, setTopic, quizDetails, setQuizDetails, quizResult, setQuizResult}}>
            {children}
        </QuizContext.Provider>
    )
}

export { QuizContextProvider };
export { QuizContext };