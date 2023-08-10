
const QuizCard = (props) => {
    return (
        <div className="quiz-card" onClick={() => props.onClickQuizCard(props.id)}>
            <div className="quiz-topic-mark">
                <p className="quiz-topic">{props.topic}</p>
                <p className="quiz-percentage-history">{props.finalScore/props.totalMarks * 100} %</p>
                <p className="quiz-mark">{props.finalScore} / {props.totalMarks}</p>
                <p className="quiz-date">{props.date}</p>
            </div>           
            
        </div>
    )
}

export default QuizCard;