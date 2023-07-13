
const QuizCard = (props) => {
    return (
        <div className="quiz-card" onClick={() => props.onClickQuizCard(props.id)}>
            <div className="quiz-topic-mark">
                <p className="quiz-topic">{props.topic}</p>
                <p className="quiz-mark">{props.finalScore} / {props.totalMarks}</p>
            </div>           
            <p className="quiz-date">{props.date}</p>
        </div>
    )
}

export default QuizCard;