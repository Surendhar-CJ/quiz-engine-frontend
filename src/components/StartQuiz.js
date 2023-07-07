import "../styles/StartQuiz.css";


const StartQuiz = (props) => {
    return (
        <div className="start-quiz" onClick={props.onClick}>
            <p>Click to start the quiz</p>
            <button type="submit">Start Quiz</button>
        </div>
    )
}


export default StartQuiz;