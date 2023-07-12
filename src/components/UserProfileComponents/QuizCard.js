

const QuizCard = (props) => {
    return (
        <div className="quiz-card" onClick={() => props.onClickQuizCard(props.id)}>
            <p>{props.topic}</p>
            <p>{props.finalScore} / {props.totalMarks}</p>
            <p>{props.date}</p>
        </div>
    )
}

export default QuizCard;