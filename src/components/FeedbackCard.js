

const FeedbackCard = (props) => {
    return(
        <div className="feedback-card">
            <p>Result:</p>
            <p>{props.result}</p>
            {props.correctAnswer !== null && 
            <div>
                <p>Correct Answer:</p>
                <p>{props.correctAnswer.text}</p>
            </div>
            }
            {props.explanation !== "" && 
            <div>
                <p>Explanation:</p>
                <p>{props.explanation}</p>
            </div>
            }
        </div>
    )
}

export default FeedbackCard;