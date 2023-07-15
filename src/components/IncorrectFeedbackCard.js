import '../styles/IncorrectFeedbackCard.css'


const IncorrectFeedbackCard = (props) => {
    return (
        <div className="incorrect-feedback-card">
            <h4>Question {props.questionNumber}</h4>
            <p>{props.question}</p>
            <h4>Your Answer</h4>
            <p>{props.userAnswer}</p>
            <h4>Correct Answer</h4>
            <p>{props.correctAnswer}</p>
            <h4>Explanation</h4>
            <p>{props.explanation}</p>
        </div>
    )
}

export default IncorrectFeedbackCard;