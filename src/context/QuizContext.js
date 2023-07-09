import { createContext, useState } from 'react';

const QuizContext = createContext("");


const QuizContextProvider = ({children}) => {

    const[ user, setUser] = useState(null);
    const[ topic, setTopic] = useState(null);
    const [quizDetails, setQuizDetails] = useState(null);

    return (
        <QuizContext.Provider value = {{user, setUser, topic, setTopic, quizDetails, setQuizDetails}}>
            {children}
        </QuizContext.Provider>
    )
}

export { QuizContextProvider };
export { QuizContext };