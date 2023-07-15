import "../styles/FeedbackCard.css";

const FeedbackCard = (props) => {
    const resultClass = props.result.toLowerCase() === "true" || props.result.toLowerCase() === "correct" ? "correct" : "incorrect";
    
    return(
        <div className={`feedback-card ${resultClass}`}>
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