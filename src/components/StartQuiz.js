import "../styles/StartQuiz.css";


const StartQuiz = (props) => {
    return (
        <div className="start-quiz">
            <p>Click to start the quiz</p>
            <button type="submit" onClick={()=>props.onStartQuizClick()}>Start Quiz</button>
        </div>
    )
}


export default StartQuiz;