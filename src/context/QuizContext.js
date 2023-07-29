import { createContext, useState } from 'react';

const QuizContext = createContext("");


const QuizContextProvider = ({children}) => {

    const [user, setUser] = useState(null);
    const [topic, setTopic] = useState(null);
    const [availableTopics, setAvailableTopics] = useState(null);
    const [searchedTopic, setSearchedTopic] = useState(null);
    const [quizDetails, setQuizDetails] = useState(null);
    const [quizResult, setQuizResult] = useState(null);

    const resetContext = () => {
        setUser(null);
        setTopic(null);
        setAvailableTopics(null);
        setSearchedTopic(null);
        setQuizDetails(null);
        setQuizResult(null);
       
    }

    return (
        <QuizContext.Provider value = {{
                user, setUser, 
                topic, setTopic, 
                availableTopics, setAvailableTopics, 
                searchedTopic, setSearchedTopic,
                quizDetails, setQuizDetails, 
                quizResult, setQuizResult,
                resetContext
            }}>
            {children}
        </QuizContext.Provider>
    )
}

export { QuizContextProvider };
export { QuizContext };